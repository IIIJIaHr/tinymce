/**
 * Uploader.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
 * Upload blobs or blob infos to the specified URL or handler.
 *
 * @private
 * @class tinymce.file.Uploader
 * @example
 * var uploader = new Uploader({
 *     url: '/upload.php',
 *     basePath: '/base/path',
 *     credentials: true,
 *     handler: function(data, success, failure) {
 *         ...
 *     }
 * });
 *
 * uploader.upload(blobInfos).then(function(result) {
 *     ...
 * });
 */
define("tinymce/file/Uploader", [
	"tinymce/util/Promise",
	"tinymce/util/Tools"
], function(Promise, Tools) {
	return function(settings) {
		function blobInfoToData(blobInfo) {
			var fileName = "x";

			return {
				id: blobInfo.id,
				blob: blobInfo.blob,
				base64: blobInfo.base64,
				filename: Tools.constant(fileName)
			};
		}

		function defaultHandler(blobInfo, success, failure) {
			var xhr, formData;

			xhr = new XMLHttpRequest();
			xhr.withCredentials = settings.credentials;
			xhr.open('POST', settings.url);

			xhr.onload = function() {
				var json;

				if (xhr.status != 200) {
					failure("HTTP Error: " + xhr.status);
					return;
				}

				json = JSON.parse(xhr.responseText);

				if (!json || typeof json.location != "string") {
					failure("Invalid JSON: " + xhr.responseText);
					return;
				}

				success(json.location);
			};

			formData = new FormData();
			formData.append('file', blobInfo.blob());

			xhr.send(formData);
		}

		function upload(blobInfos) {
			return new Promise(function(resolve) {
				var handler = settings.handler, queue, index = 0;

				queue = Tools.map(blobInfos, function(blobInfo) {
					return {
						status: false,
						blobInfo: blobInfo,
						url: ''
					};
				});

				function uploadNext() {
					var queueItem = queue[index++];

					if (!queueItem) {
						resolve(queue);
						return;
					}

					handler(blobInfoToData(queueItem.blobInfo), function(url) {
						queueItem.url = url;
						queueItem.status = true;
						uploadNext();
					}, function() {
						queueItem.status = false;
						uploadNext();
					});
				}

				uploadNext();
			});
		}

		settings = Tools.extend({
			credentials: false,
			handler: defaultHandler
		}, settings);

		return {
			upload: upload
		};
	};
});