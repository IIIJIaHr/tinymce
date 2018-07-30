import Promise from 'tinymce/core/api/util/Promise';
import XHR from 'tinymce/core/api/util/XHR';

const ServiceUrl = '../Services/TemplatesService.asmx/GetTemplateChunks';

const getTemplateChunks = function(kindDoc) {
    return new Promise(function(resolve, reject) {
        XHR.send({
            url: ServiceUrl,
            type: 'POST',
            content_type: 'application/json',
            data_type: 'json',
            data: JSON.stringify({
                templateType: kindDoc
            }),
            success: function (data) {
              resolve(parseResponse(data));
            },
            error: function (data) {
                reject(data);
            }
          });
    });
}

const parseResponse = function (responseData){
    let data = JSON.parse(responseData);

    return data.d;
} 

export {
    getTemplateChunks
}