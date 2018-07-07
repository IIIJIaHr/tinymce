/**
 * KindDoc.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2018 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

import { Editor } from 'tinymce/core/api/Editor';
import Events from 'tinymce/core/api/Events';

export enum EditorKindDoc {
    DOC_RC,
    PRC_RC,
    UNKNOWN,
}


const setKindDoc = (editor: Editor, kindDoc: EditorKindDoc) => {
    if (kindDoc === getKindDoc(editor)) {
        return;
    }

    if (editor.initialized) {
        editor.kindDoc = kindDoc;
    } else {
        editor.on('init', function () {
            editor.kindDoc = kindDoc;
        });
    }

    Events.fireSwitchKindDoc(editor, kindDoc);
};

const getKindDoc = (editor: Editor) => editor.kindDoc;

export {
    setKindDoc,
    getKindDoc,
};
