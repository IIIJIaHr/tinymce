import * as TemplateService from "./TemplateService";
import $ from 'tinymce/core/api/dom/DomQuery';
import { EditorKindDoc } from "tinymce/core/KindDoc";

const getTemplates = function (editor, showDialogCallback) {
    let kindDoc = editor.getKindDoc();

    TemplateService.getTemplateChunks(kindDoc).then(function (chunks) {
        showDialogCallback(chunks);
    });
}

const setup = function (editor) {
    editor.on('SwitchKindDoc', function (e) {
        showKindDoc(e.kindDoc);
    });
}

const showKindDoc = function (kindDoc: EditorKindDoc) {
    let text = '';

    switch (kindDoc) {
        case EditorKindDoc.DOC_RC:
            text = 'РК';
            break;
        case EditorKindDoc.PRC_RC:
            text = 'РКПД';
            break;
        default:
            throw `Unexpected enum value: ${kindDoc} for EditorKindDoc type`;
    }

    $('.kindDoc').text(text);
}

export {
    getTemplates,
    setup
}