/**
 * FullDemo.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import { Merger } from '@ephox/katamari';
import XHR from 'tinymce/core/api/util/XHR';
import * as KindDoc from "tinymce/core/KindDoc";
import { getTemplates, setup } from './TemplateManager';

declare let tinymce: any;
declare let mcImageManager: any;

let savecallback = function (editor) {
  let data = editor.contentDocument.body.innerHTML;

  editor.windowManager.open({
    title: 'Укажите имя файла',
    body: [
      { type: 'textbox', name: 'title', label: 'Имя файла', value: '' }
    ],
    onsubmit: function (e) {
      // Insert content when the window form is submitted
      if (data.length && e.data.title.length) {
        //site.replace(/\/$/, "");
        // {0}/[dir]/{1}
        // {0}/{1}
        //String.prototype.lastIndexOf()

        let kindDoc = KindDoc.getKindDoc(editor);

        let json = JSON.stringify({ data: { Data: sanitizeHtml(data), FileNameWithoutExtension: e.data.title, Type: kindDoc, Extension: '.htm' } });

        let errorMsg = 'Ошибка сохранения';
        console.log('thiFile', mcImageManager.currentFile);

        XHR.send({
          url: "TemplateConstructor.aspx/SaveData",
          type: "POST",
          content_type: "application/json; charset=utf-8",
          data_type: "json",
          data: json, // pass that text to the server as a correct JSON String
          success: function (msg) {
            msg = JSON.parse(msg);
            let n = (msg.d ? 'Файл ' + e.data.title + ' успешно сохранён' : errorMsg);
            editor.notificationManager.open({
              text: n,
              timeout: 5000,
              type: msg.d ? 'info' : 'error'
            });
          },
          error: function (type) {
            editor.notificationManager.open({
              text: "Возникла критическая ошибка при сохранении файла",
              timeout: 10000,
              type: 'error'
            });
          }

        });
      }

      //editor.insertContent('Title: ' + e.data.title);
    }
  });

}

//let makeModel = function (data) {
//  let result = {};

//  data.forEach((tmpl) => {
//    result[tmpl.title];
//  });
//}

let sanitizeHtml = function (data) {
  return JSON.stringify(data);
}

export default function () {

  const settings = {
    skin_url: 'http://localhost:3000/js/tinymce/skins/lightgray',
    codesample_content_css: 'http://localhost:3000/js/tinymce/plugins/codesample/css/prism.css',
    visualblocks_content_css: 'http://localhost:3000/js/tinymce/plugins/visualblocks/css/visualblocks.css',
    images_upload_url: 'd',
    selector: 'textarea',
    // rtl_ui: true,
    link_list: [
      { title: 'My page 1', value: 'http://www.tinymce.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_list: [
      { title: 'My page 1', value: 'http://www.tinymce.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_class_list: [
      { title: 'None', value: '' },
      { title: 'Some class', value: 'class-name' }
    ],
    importcss_append: true,
    height: 400,
    file_picker_callback(callback, value, meta) {
      // Provide file and text for the link dialog
      if (meta.filetype === 'file') {
        callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
      }

      // Provide image and alt text for the image dialog
      if (meta.filetype === 'image') {
        callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
      }

      // Provide alternative source and posted for the media dialog
      if (meta.filetype === 'media') {
        callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
      }
    },
    spellchecker_callback(method, text, success, failure) {
      const words = text.match(this.getWordCharPattern());

      if (method === 'spellcheck') {
        const suggestions = {};

        for (let i = 0; i < words.length; i++) {
          suggestions[words[i]] = ['First', 'Second'];
        }

        success(suggestions);
      }

      if (method === 'addToDictionary') {
        success();
      }
    },
    setup: setup,
    save_onsavecallback: savecallback,
    templates: getTemplates,
    template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
    image_caption: true,
    theme: 'modern',
    mobile: {
      plugins: [
        'autosave lists'
      ]
    },
    plugins: [
      'autosave advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker toc',
      'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
      'save table contextmenu directionality emoticons template_mr paste textcolor importcss colorpicker textpattern',
      'codesample help noneditable print imagemanager'
    ],
    // rtl_ui: true,
    add_unload_trigger: false,
    autosave_ask_before_unload: false,
    toolbar: 'save fontsizeselect fontselect insertfile undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons table codesample code | ltr rtl'
  };

  tinymce.init(settings);
  tinymce.init(Merger.deepMerge(settings, { inline: true, selector: 'div.tinymce' }));
}
