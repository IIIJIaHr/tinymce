(function () {
    /**
     * mcImageManager global object
     */
    window.mcImageManager = {
        settings: {
            document_base_url: "",
            relative_urls: false,
            remove_script_host: false,
            use_url_path: true,
            remember_last_path: "auto",
            target_elements: "",
            target_form: "",
            handle: "image,media"
        },
        currentFile: {},
        setup: function () {
            var e = this,
                h, g = document,
                f = [];
            h = g.location.href;
            if (h.indexOf("?") != -1) {
                h = h.substring(0, h.indexOf("?"))
            }
            h = h.substring(0, h.lastIndexOf("/") + 1);
            e.settings.default_base_url = unescape(h);

            function c(d) {
                var j, k;
                for (j = 0; j < d.length; j++) {
                    k = d[j];
                    f.push(k);
                    if (k.src && /imagemanager\/plugin\.js/g.test(k.src)) {
                        return k.src.substring(0, k.src.lastIndexOf("/"));
                    }
                }
            }
            h = g.documentElement;
            if (h && (h = c(h.getElementsByTagName("script")))) {
                return e.baseURL = h;
            }
            h = g.getElementsByTagName("script");
            if (h && (h = c(h))) {
                return e.baseURL = h;
            }
            h = g.getElementsByTagName("head")[0];
            if (h && (h = c(h.getElementsByTagName("script")))) {
                return e.baseURL = h;
            }
        },
        relaxDomain: function () {
            var that = this,
                d = /(http|https):\/\/([^\/:]+)\/?/.exec(that.baseURL);
            if (window.tinymce && tinymce.relaxedDomain) {
                that.relaxedDomain = tinymce.relaxedDomain;
                return;x
            }
            if (d && d[2] != document.location.hostname) {
                document.domain = that.relaxedDomain = d[2].replace(/.*\.(.+\..+)$/, "$1");
            }
        },
        init: function (c) {
            this.extend(this.settings, c);
        },
        browse: function (d) {
            var c = this;
            d = d || {};
            if (d.fields) {
                d.oninsert = function (e) {
                    c.each(d.fields.replace(/\s+/g, "").split(/,/), function (f) {
                        var g;
                        if (g = document.getElementById(f)) {
                            c._setVal(g, e.focusedFile.url);
                        }
                    })
                }
            }

            this.openWin({
                page: "index.html",
                scrollbars: "yes"
            }, d);
        },
        edit: function (c) {
            this.openWin({
                page: "edit.html",
                width: 800,
                height: 500
            }, c)
        },
        upload: function (c) {
            this.openWin({
                page: "upload.html",
                width: 550,
                height: 350
            }, c)
        },
        view: function (c) {
            this.openWin({
                page: "view.html",
                width: 800,
                height: 500
            }, c)
        },
        createDir: function (c) {
            this.openWin({
                page: "createdir.html",
                width: 450,
                height: 280
            }, c)
        },
        openWin: function (i, d) {
            var that = this, c, e;

            that.windowArgs = d = that.extend({}, that.settings, d);
            i = that.extend({
                x: -1,
                y: -1,
                width: 810,
                height: 500,
                inline: 1
            }, i);

            if (i.x == -1) {
                i.x = parseInt(screen.width / 2) - (i.width / 2);
            }

            if (i.y == -1) {
                i.y = parseInt(screen.height / 2) - (i.height / 2);
            }

            if (i.page) {
                i.url = that.baseURL + "/default.aspx?type=im&page=" + i.page;
            }

            if (d.session_id) {
                i.url += "&sessionid=" + d.session_id;
            }

            if (d.custom_data) {
                i.url += "&custom_data=" + escape(d.custom_data);
            }

            if (that.relaxedDomain) {
                i.url += "&domain=" + escape(that.relaxedDomain);
            }

            if (d.custom_query) {
                i.url += d.custom_query;
            }

            if (d.target_frame) {
                if (e = frames[d.target_frame]) {
                    e.document.location = i.url;
                }

                if (e = document.getElementById(d.target_frame)) {
                    e.src = i.url;
                }
                return;
            }

            if (window.tinymce && tinyMCE.activeEditor) {
                return tinyMCE.activeEditor.windowManager.open(i, d);
            }

            if (window.jQuery && jQuery.WindowManager) {
                return jQuery.WindowManager.open(i, d);
            }

            c = window.open(i.url, "mcImageManagerWin", "left=" + i.x + ",top=" + i.y + ",width=" + i.width + ",height=" + i.height + ",scrollbars=" + (i.scrollbars ? "yes" : "no") + ",resizable=" + (i.resizable ? "yes" : "no") + ",statusbar=" + (i.statusbar ? "yes" : "no"));
            try {
                c.focus();
            } catch (g) { }
        },
        each: function (g, e, d) {
            var h, c;
            if (g) {
                d = d || g;
                if (g.length !== undefined) {
                    for (h = 0, c = g.length; h < c; h++) {
                        e.call(d, g[h], h, g)
                    }
                } else {
                    for (h in g) {
                        if (g.hasOwnProperty(h)) {
                            e.call(d, g[h], h, g)
                        }
                    }
                }
            }
        },
        extend: function () {
            var e, c = arguments,
                g = c[0],
                f, d;
            for (f = 1; f < c.length; f++) {
                if (d = c[f]) {
                    for (e in d) {
                        g[e] = d[e]
                    }
                }
            }
            return g
        },
        open: function (i, e, d, c, h) {
            var f = this,
                g;
            h = h || {};
            if (!h.url && document.forms[i] && (g = document.forms[i].elements[e.split(",")[0]])) {
                h.url = g.value
            }
            if (!c) {
                h.oninsert = function (n) {
                    var m, k, j, l = n.focusedFile;
                    j = e.replace(/\s+/g, "").split(",");
                    for (k = 0; k < j.length; k++) {
                        if (m = document.forms[i][j[k]]) {
                            f._setVal(m, l.url);
                        }
                    }
                }
            } else {
                if (typeof (c) == "string") {
                    c = window[c]
                }
                h.oninsert = function (j) {
                    c(j.focusedFile.url, j);
                }
            }

            f.browse(h);
        },

        filebrowserCallBack: function (h, k, d, j, e) {
            var l = mcImageManager,
                f, c, g, m = {};
            if (window.mcFileManager && !e) {
                c = mcFileManager.settings.handle;
                c = c.split(",");
                for (f = 0; f < c.length; f++) {
                    if (d == c[f]) {
                        g = 1
                    }
                }
                if (g && mcFileManager.filebrowserCallBack(h, k, d, j, 1)) {
                    return;
                }
            }

            l.each(tinyMCE.activeEditor ? tinyMCE.activeEditor.settings : tinyMCE.settings, function (n, i) {
                if (i.indexOf("imagemanager_") === 0) {
                    m[i.substring(13)] = n
                }
            });

            l.browse(l.extend(m, {
                url: j.document.forms[0][h].value,
                relative_urls: 0,
                oninsert: function (q) {
                    var p, n, i;
                    p = j.document.forms[0];
                    n = q.focusedFile.url;
                    inf = q.focusedFile.custom;

                    if (typeof (TinyMCE_convertURL) != "undefined") {
                        n = TinyMCE_convertURL(n, null, true);
                    } else {
                        if (tinyMCE.convertURL) {
                            n = tinyMCE.convertURL(n, null, true)
                        } else {
                            n = tinyMCE.activeEditor.convertURL(n, null, true);
                        }
                    }

                    if (inf.custom && inf.custom.description) {
                        i = ["alt", "title", "linktitle"];
                        for (f = 0; f < i.length; f++) {
                            if (p.elements[i[f]]) {
                                p.elements[i[f]].value = inf.custom.description
                            }
                        }
                    }

                    l._setVal(p[h], n);
                    j = null;
                }
            }));

            return true;
        },
        _setVal: function (f, c) {
            f.value = c;
            try {
                f.onchange()
            } catch (d) { }
        }

    };

    mcImageManager.setup();
    mcImageManager.relaxDomain();

    /***
    * Integrate with tinymce
    * 
    **/
    (function () {
        if (!window.tinymce) {
            return {};
        }

        //var a = {
        //    getInfo: function () {
        //        return {
        //            longname: "MCImageManager .NET",
        //            author: "Moxiecode Systems AB",
        //            authorurl: "https://www.tinymce.com",
        //            infourl: "https://www.moxiemanager.com/",
        //            version: "3.1.2.4"
        //        }
        //    },

        //    convertURL: function (c) {
        //        if (window.TinyMCE_convertURL) {
        //            return TinyMCE_convertURL(c, null, true);
        //        }

        //        if (tinyMCE.convertURL) {
        //            return tinyMCE.convertURL(c, null, true);
        //        }
        //        return tinyMCE.activeEditor.convertURL(c, null, true)
        //    },

        //    replace: function (g, k, j) {
        //        var f, h;
        //        if (typeof (g) != "string") {
        //            return g(k, j)
        //        }

        //        function c(i, e) {
        //            for (f = 0, h = i, e = e.split("."); f < e.length; f++) {
        //                h = h[e[f]]
        //            }
        //            return h
        //        }

        //        g = "" + g.replace(/\{\$([^\}]+)\}/g, function (i, d) {
        //            var e = d.split("|"),
        //                m = c(k, e[0]);
        //            if (e.length == 1 && j && j.xmlEncode) {
        //                m = j.xmlEncode(m)
        //            }
        //            for (f = 1; f < e.length; f++) {
        //                m = j[e[f]](m, k, d)
        //            }
        //            return m
        //        });

        //        g = g.replace(/\{\=([\w]+)([^\}]+)\}/g, function (e, d, i) {
        //            return c(j, d)(k, d, i);
        //        });

        //        return g;
        //    }
        //};

        tinymce.PluginManager.add("imagemanager", function (editor, url) {
            var editorSettings = editor.settings;

            function convertUrl(url) {
                return editor.convertURL(url, null, null);
            }

            function getMime(fileName) {
                var mimes = {
                    mp4: "video/mp4",
                    m4v: "video/mp4",
                    ogv: "video/ogg",
                    webm: "video/webm"
                };

                return mimes[fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase()];
            }

            function getBrowseSettings(type) {
                var browseSettings = {};

                // Extend with prefixed editor settings
                tinymce.each(editorSettings, function (value, key) {
                    if (key.indexOf("imagemanager_") === 0) {
                        browseSettings[key.substring(13)] = value;
                    }
                });

                // Extend with type specifc settings and remove any prefix
                var typeSettings = editorSettings["imagemanager_" + type + "_settings"];
                if (typeSettings) {
                    tinymce.each(typeSettings, function (value, key) {
                        key = key.replace(/imagemanager_/g, "");
                        browseSettings[key] = value;
                    })
                }

                return browseSettings;
            }

            editorSettings.file_browser_callback = function (id, value, type, win) {
                // TinyMCE 3
                var zIndex = editor.windowManager.zIndex, url;

                // TinyMCE 4
                if (tinymce.ui.FloatPanel) {
                    zIndex = tinymce.ui.FloatPanel.currentZIndex;
                }

                if (tinymce.trim(value).length > 0) {
                    url = editor.documentBaseURI.toAbsolute(value);
                }

                console.log('TODO: implement file browse settings');
            };

            function replace(template, data, escapeFuncs) {
                if (typeof template != "string") {
                    return template(data, escapeFuncs);
                }

                function resolve(data, path) {
                    var i, res;

                    for (i = 0, res = data, path = path.split("."); i < path.length; i++) {
                        res = res[path[i]];
                    }

                    return res;
                }
                // Replace variables
                template = "" + template.replace(/\{\$([^\}]+)\}/g, function (match, variableName) {
                    var i, parts = variableName.split("|"),
                        value = resolve(data, parts[0]);
                    if (typeof value == "undefined") {
                        return "";
                    }

                    // Default encoding
                    if (parts.length == 1 && escapeFuncs && escapeFuncs.xmlEncode) {
                        value = escapeFuncs.xmlEncode(value);
                    }

                    // Execute encoders
                    for (i = 1; i < parts.length; i++) {
                        value = escapeFuncs[parts[i]](value, data, variableName);
                    }

                    return value;
                });

                // Execute functions
                template = template.replace(/\{\=([\w]+)([^\}]+)\}/g, function (match, funcName, args) {
                    return resolve(escapeFuncs, funcName)(data, funcName, args)
                });

                return template;
            }


            editor.addCommand("mceInsertFile", function () {
                var selection = editor.selection,
                    lastRng;

                lastRng = selection.getRng();

                function processTemplate(template, file) {
                    return replace(template, file, {
                        urlencode: function (value) {
                            return encodeURIComponent(value);
                        },

                        xmlEncode: function (value) {
                            return tinymce.DOM.encode(value);
                        },

                        sizeSuffix: function (value) {
                            if (value == -1) {
                                return "";
                            }

                            if (value > 1048576) {
                                return Math.round(value / 1048576, 1) + " MB";
                            }

                            if (value > 1024) {
                                return Math.round(value / 1024, 1) + " KB";
                            }

                            return value + " b";
                        }
                    })
                }

                // TinyMCE 3
                var zIndex = editor.windowManager.zIndex;

                // TinyMCE 4
                if (tinymce.ui.FloatPanel) {
                    zIndex = tinymce.ui.FloatPanel.currentZIndex;
                }

                /*
                  /Titul/MRTemplates/Pages/default.aspx
                 */
                mcImageManager.browse(tinymce.extend({
                    zIndex: zIndex,
                    document_base_url: editorSettings.document_base_url,
                    oninsert: function (args) {
                        var html = "";

                        tinymce.each(args.files, function (file, i) {
                            selection.setRng(lastRng);
                            if (i > 0) {
                                html += " ";
                            }

                            console.log('file11', file);

                            mcImageManager.currentFile = file;

                            // Create image/file template
                            if (/\.(gif|jpe?g|png)$/i.test(file.name)) {
                                html += processTemplate(editor.getParam("imagemanager_image_template", '<img src="{$meta.url}" ' + 'width="{$meta.width}" height="{$meta.height}">'), file);
                            } else if (/\.(mp4|ogv|webm)$/i.test(file.name)) {
                                var videoTemplate = "<video controls>";

                                if (file.meta.alt_img) {
                                    videoTemplate = '<video controls poster="{$meta.alt_img}">';
                                }

                                if (file.meta.url) {
                                    file.meta.url = convertUrl(file.meta.url);
                                    videoTemplate += '<source src="{$meta.url}" type="' + getMime(file.meta.url) + '" />';
                                }

                                if (file.meta.alt_url) {
                                    file.meta.alt_url = convertUrl(file.meta.alt_url);
                                    videoTemplate += '<source src="{$meta.alt_url}" type="' + getMime(file.meta.alt_url) + '" />';
                                }

                                if (file.meta.alt_img) {
                                    file.meta.alt_img = convertUrl(file.meta.alt_img);
                                    videoTemplate += '<img src="{$meta.alt_img}" />';
                                }

                                videoTemplate += "</video>";
                                html += processTemplate(editor.getParam("imagemanager_video_template", videoTemplate), file);
                            } else if (/\.(htm|html|tpl)$/i.test(file.name)) {
                                $.ajax({
                                    url: file.url,
                                    success: function (data) {
                                        editor.execCommand("mceInsertContent", false, data);
                                    }
                                });

                                //html += file.url;
                            } else {
                                if (!selection.isCollapsed()) {
                                    editor.execCommand("mceInsertLink", file.meta.url);
                                    return false;
                                }

                                html += processTemplate(editor.getParam("imagemanager_file_template", '<a href="{$url}">{$name}</a>'), file);
                            }

                        });

                        selection.setRng(lastRng);
                        editor.execCommand("mceInsertContent", false, html);
                    }
                }, getBrowseSettings()));

            });


            if (tinymce.Env) {
                // TinyMCE 4.x+
                editor.addButton("insertfile", {
                    icon: "browse",
                    title: "Insert file",
                    //text: '������� ���� �������',
                    cmd: "mceInsertFile"
                });
            } else {
                // TinyMCE 3.x
                editor.addButton("insertfile", {
                    image: url + "/pages/im/img/insertfile.gif",
                    title: "imagemanager_insertimage_desc",
                    cmd: "mceInsertFile"
                })
            }
        });

        var langCode = tinymce.settings ? tinymce.settings.language : "auto";
        // tinyMCE.addI18n script (language)
        tinymce.ScriptLoader.add((tinymce.PluginManager.urls.imagemanager || tinymce.baseURL + "/plugins/imagemanager") + "/language/default.aspx?type=im&format=tinymce_3_x&group=tinymce&prefix=imagemanager_");
        tinymce.ScriptLoader.loadQueue();

    })();
   

    //tinymce.ScriptLoader.load((tinymce.PluginManager.urls.imagemanager || tinymce.baseURL + "/plugins/imagemanager") + "/language/default.aspx?type=im&format=tinymce_3_x&group=tinymce&prefix=imagemanager_")

    //console.log('window',window);

    // insert image
    //if (window.tinymce) {
    //    var b = {
    //        setup: function () {
    //            var c = (window.realTinyMCE || tinyMCE).baseURL;
    //            mcImageManager.baseURL = c + "/plugins/imagemanager/js";
    //            document.write('<script type="text/javascript" src="' + c + '/plugins/imagemanager/language/default.aspx?type=im&format=tinymce&group=tinymce&prefix=imagemanager_"><\/script>')
    //        },
    //        initInstance: function (c) {
    //            c.settings.file_browser_callback = "mcImageManager.filebrowserCallBack";
    //            mcImageManager.settings.handle = tinyMCE.getParam("imagemanager_handle", mcImageManager.settings.handle)
    //        },
    //        getControlHTML: function (c) {
    //            switch (c) {
    //                case "insertimage":
    //                    return tinymce.getButtonHTML(c, "lang_imagemanager_insertimage_desc", "{$pluginurl}/pages/im/img/insertimage.gif", "mceInsertImage", false)
    //            }
    //            return ""
    //        },
    //        getInfo: function () {
    //            return a.getInfo()
    //        },
    //        execCommand: function (h, e, g, f, d) {
    //            var c = tinymce.getInstanceById(h);
    //            if (g == "mceInsertImage") {
    //                mcImageManager.browse(tinymce.extend({
    //                    path: tinymce.getParam("imagemanager_path"),
    //                    rootpath: tinymce.getParam("imagemanager_rootpath"),
    //                    remember_last_path: tinymce.getParam("imagemanager_remember_last_path"),
    //                    custom_data: tinymce.getParam("imagemanager_custom_data"),
    //                    insert_filter: tinymce.getParam("imagemanager_insert_filter"),
    //                    oninsert: function (j) {
    //                        var i = j.focusedFile.custom;
    //                        if (!i.thumbnail_url) {
    //                            i.thumbnail_url = url;
    //                            i.twidth = i.width;
    //                            i.theight = i.height
    //                        }
    //                        c.execCommand("mceInsertContent", false, a.replace(tinymce.getParam("imagemanager_insert_template", '<a href="{$url}" rel="lightbox"><img src="{$custom.thumbnail_url}" width="{$custom.twidth}" height="{$custom.theight}" /></a>'), j.focusedFile, {
    //                            urlencode: function (k) {
    //                                return escape(k)
    //                            },
    //                            xmlEncode: function (k) {
    //                                return tinymce.xmlEncode(k)
    //                            }
    //                        }))
    //                    }
    //                }, d));
    //                return true
    //            }
    //            return false
    //        }
    //    };
    //    b.setup();
    //    tinymce.PluginManager.add("imagemanager", b);
    //}
})();