import { EditorKindDoc } from "tinymce/core/KindDoc"

const testPrj = [
    {
        "title": "Номер РК",
        "url": "../tmpl/DOC_RC/freeNum.htm",
        "description": "Значение номера документа"
    },
    {
        "title": "Адресаты с датой отправки",
        "url": "../tmpl/DOC_RC/addresses.htm",
        "description": "Перечень адресатов с датой отправки"
    },
    {
        "title": "Дата РК",
        "url": "../tmpl/DOC_RC/docDate.htm",
        "description": "Дата РК"
    }
];

const testDoc = [
    {
        "title": "For Doc",
        "url": "../tmpl/DOC_RC/freeNum.htm",
        "description": "Значение номера документа"
    },
    {
        "title": "Адресаты с датой отправки",
        "url": "../tmpl/DOC_RC/addresses.htm",
        "description": "Перечень адресатов с датой отправки"
    },
    {
        "title": "Дата РК",
        "url": "../tmpl/DOC_RC/docDate.htm",
        "description": "Дата РК"
    }
];

const getTemplates = function (editor, showDialogCallback) {
    let kindDoc = editor.getKindDoc();

    switch (kindDoc) {
        case EditorKindDoc.DOC_RC:
            showDialogCallback(testDoc)
            break;
        case EditorKindDoc.PRC_RC:
            showDialogCallback(testPrj)
            break;
        default:
            throw `Unknown EditorKindDoc: ${kindDoc}`;
    }
}

export {
    getTemplates
}