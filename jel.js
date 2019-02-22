/* 
    jel: Javascript Elements
    Version: 0.2.2
    A vanilla javascript DOM elements creation and management helper library
    Created by: Yury Laykov / Russia, Zelenograd
    2019
    MIT License
    No additional libraries required.
    Can be used with other libraries.
    Works on older browsers (ES5).
    The product is distributed "AS IS", without any warranties and liabilities.
*/

function jel() {
    var elParent = (this === window) ? document.body : this;
    return elParent.jel.apply(elParent, arguments);
}

jel.settings = {};

jel.settings.allowScripts = true;

jel.settings.mapKeywords = {
    innerHTML: "innerHTML",
    html: "html",
    children: "children",
    chi: "chi",
    properties: "properties",
    prop: "prop",
    jel: "jel"
}

jel._templates = {};

jel.SetTemplate = function (strTemplateName, jelTemplate) {
    if (typeof strTemplateName == "string" && 
    (typeof jelTemplate == "function" || typeof jelTemplate == "object" || typeof jelTemplate == "string")) {
        this._templates[strTemplateName] = jelTemplate;
        return this;
    } else
        return undefined;
}

jel.GetTemplate = function (strTemplateName) {
    return this._templates[strTemplateName];
}

HTMLElement.prototype.jel = function() {

    function jelSetStyle(el, oStyle) {
        if (Array.isArray(oStyle))
        for (var o in oStyle)
            jelSetStyle(el, oStyle[o]);
        else {
            if (typeof oStyle == "function")
                jelSetStyle(el, oStyle.call(el, el, el.style));
            else
            for (var o in oStyle) {
                var newStyleProp;
                if (typeof oStyle[o] == "function")
                    newStyleProp = oStyle[o].call(el, el, el.style[o]);
                else
                    newStyleProp = oStyle[o];
                if (typeof el.style[o] != "string" ||
                    el.style[o].search("!important") == -1 || 
                    typeof newStyleProp == "string" && newStyleProp.search("!important") != -1)
                        el.style[o] = newStyleProp;
            }
        }
    }
    
    function jelSetClass(el, oClass) {
        var strClass = el.class;
        if (strClass === null)
            strClass = "";
        if (Array.isArray(oClass)) {
            for (o in oClass)
                jelSetClass(el, oClass[o]);
        } else {
            if (typeof oClass == "function")
                strClass = strClass + " " + oClass.call(el, el, strClass.trim());
            else
                strClass = strClass + " " + oClass;
        }

        el.class = strClass.trim();
    }
    
    function jelAddHTML(el, strHTML) {
        if (!jel.settings.allowScripts && strHTML.search("<script") != -1)
            return undefined;
        return el.appendChild(document.createRange().createContextualFragment(strHTML));
    }
    
    function jelAddArray(el, arr, appliedTemplatesAttr) {
        for (var rel in arr)
        if (arr[rel].tagName !== undefined)
            el.appendChild(arr[rel]);
        else if (typeof arr[rel] == "object")
            el.jel(arr[rel], {_appliedTemplates: appliedTemplatesAttr});
    }
    
    function jelAddPropertyLink(strTarget, strLocal) {
        if ((typeof strLocal == "object") && Array.isArray(strLocal)) {
            for (var l = 0; l < strLocal.length; l++)
                jelAddPropertyLink.call(this, strTarget, strLocal[l]);
            return;
        }
        var el = this._ownerElement;
        var arTargetProp = strTarget.split(".");
        var arLocalProp = strLocal.split(".");
        var iterTarget = el.jelEx._namedParent;
        if (arTargetProp[0] === "root")
            iterTarget = el.jelEx._componentRoot;
        for (var tp = 1; tp < arTargetProp.length - 1; tp++) {
            if (typeof iterTarget[arTargetProp[tp]] == "undefined")
                iterTarget[arTargetProp[tp]] = {};
            iterTarget = iterTarget[arTargetProp[tp]];
        }
        var iterLocal = el;
        for (var lp = 0; lp < arLocalProp.length - 1; lp++) {
            if (typeof iterLocal[arLocalProp[lp]] == "undefined")
                throw "Invalid local property";
            iterLocal = iterLocal[arLocalProp[lp]];
        }
        (function(arTargetProp, iterTarget, arLocalProp, iterLocal) {
            var strTargetPropName = arTargetProp[arTargetProp.length - 1];
            var strLocalPropName = arLocalProp[arLocalProp.length - 1];
            if (typeof iterTarget[strTargetPropName] == "undefined") {
                Object.defineProperty(iterTarget, strTargetPropName, {
                    get: function() { 
                        // return iterLocal[strLocalPropName]; 
                        var res = [];
                        var linkedProps = iterTarget.jelExt[strTargetPropName]._properties;
                        for (var p in linkedProps)
                            res.push(linkedProps[p].localPropParent[linkedProps[p].localPropName]);
                        if (res.length === 1)
                            res = res[0];
                        return res;
                    },
                    set: function(newValue) { 
                        // iterLocal[strLocalPropName] = newValue;
                        var linkedProps = iterTarget.jelExt[strTargetPropName]._properties;
                        for (var p in linkedProps)
                            linkedProps[p].localPropParent[linkedProps[p].localPropName] = newValue;
                        // return iterTarget;
                    }
                });
                iterTarget.jelExt = iterTarget.jelExt || {};
                iterTarget.jelExt[strTargetPropName] = {};
                iterTarget.jelExt[strTargetPropName]._properties = [];
            }
            iterTarget.jelExt[strTargetPropName]._properties.push({
                localPropParent: iterLocal,
                localPropName: strLocalPropName
            });
        })(arTargetProp, iterTarget, arLocalProp, iterLocal);
    }

    function jelSetAttributes(el, attributes, appliedTemplatesAttr) {
        for (var a in attributes)
        if (a != "_appliedTemplates")
        switch (typeof attributes[a]) {
        case "string":
            switch (a) {
                case jel.settings.mapKeywords.innerHTML:
                case jel.settings.mapKeywords.html:
                    jelAddHTML(el, attributes[a]);
                    break;
                case "style":
                case "class":
                    var tmpAttr = el.getAttribute(a);
                    if (tmpAttr === null)
                        tmpAttr = "";
                    el.setAttribute(a, (tmpAttr + " " + attributes[a]).trim());
                    break;
                default:
                    el.setAttribute(a, attributes[a]);
            }
            break;
        case "object":
            switch (a) {
                case "style":
                    jelSetStyle(el, attributes[a]);
                    break;
                case "class":
                    jelSetClass(el, attributes[a]);
                    break;
                case jel.settings.mapKeywords.children:
                case jel.settings.mapKeywords.chi:
                    if (Array.isArray(attributes[a]))
                    for (var c in attributes[a])
                    switch (typeof attributes[a][c]) {
                        case "object":
                            el.jel(attributes[a][c], {_appliedTemplates: appliedTemplatesAttr});
                            break;
                        case "string":
                            // var text = document.createTextNode("");
                            jelAddHTML(el, attributes[a][c]);
                            break;
                        case "function":
                            var res = attributes[a][c].call(el, el);
                            if (res === false)
                                return;
                            if (res)
                                el.jel(res);
                            break;
                        default:
                    }
                    break;
                // case jel.settings.mapKeywords.properties:
                // case jel.settings.mapKeywords.prop:
                //     for (var p in attributes[a]) {
                //         var arLocalProp = p.split(".");
                //         var iterLocal = el;
                //         for (var lp = 0; lp < arLocalProp.length - 1; lp++) {
                //             if (typeof iterLocal[arLocalProp[lp]] == "undefined") {
                //                 iterLocal[arLocalProp[lp]] = {};
                //                 // throw "Invalid local property";
                //             }
                //             iterLocal = iterLocal[arLocalProp[lp]];
                //         }
                //         iterLocal[arLocalProp[arLocalProp.length - 1]] = attributes[a][p];
                //         // el[p] = attributes[a][p];
                //     }
                //     break;
                case jel.settings.mapKeywords.jel:
                    for (var c in attributes[a])
                    switch (c) {
                        case "name":
                            if (el.jelEx._namedParent !== el) {
                                el.jelEx._namedParent[attributes[a][c]] = el;
                                el.jelEx._namedParentForChildren = el;
                            }
                            break;
                        case "root":
                            el.jelEx._componentRoot = el;
                            break;
                        case "links":
                            if (typeof attributes[a][c] != "object")
                                break;
                            for (var p in attributes[a][c]) {
                                if (typeof attributes[a][c][p] == "object")
                                    for (var pp in attributes[a][c][p])
                                        el.jelEx.AddPropertyLink(pp, attributes[a][c][p][pp]);
                                else
                                    el.jelEx.AddPropertyLink(p, attributes[a][c][p]);
                            }
                            break;
                        default:
                    }
                    break;
                default:
            }
            break;
        case "function":
            el.setAttribute(a, attributes[a].call(el, el, el.getAttribute(a)));
            break;
        default:
            el.setAttribute(a, attributes[a]);
        }
    }
    
    function jelSoftClone(oSrc) {
        var oTrg = {};
        for (var k in oSrc)
            oTrg[k] = oSrc[k];
        return oTrg;
    }

    function jelSoftCloneArray(aSrc) {
        var aDest = new Array(aSrc.length);
        for(var i = 0; i < aDest.length; i++)
            aDest[i] = aSrc[i];
        return aDest;
    }
    
    function jelSoftJoin(oSrc, oToJoin) {
        oSrc = oSrc || {};
        oToJoin = oToJoin || {};
        for (var k in oToJoin)
            oSrc[k] = oToJoin[k];
        return oSrc;
    }

    function jelSoftJoinArray(aSrc, aToJoin) {
        aSrc = aSrc || [];
        aToJoin = aToJoin || [];
        for (var i = 0; i < aToJoin.length; i++)
            aSrc.push(aToJoin[i]);
        return aSrc;
    }

    
    // --------------------------------------------------------------------
    // Startup code here
    // --------------------------------------------------------------------

    if (arguments.length === 0)
        return;

    var appliedTemplatesAttr =  typeof arguments[arguments.length - 1] == "object" && 
                                typeof arguments[arguments.length - 1]._appliedTemplates != "undefined" ? 
                                jelSoftClone(arguments[arguments.length - 1]._appliedTemplates) : undefined;

    // if ((typeof arguments[0] == "object" && Array.isArray(arguments[0])) && 
    //     (arguments.length === 1 || arguments.length === 2 && typeof appliedTemplatesAttr !== undefined )) {
    if (typeof arguments[0] == "object" && Array.isArray(arguments[0])) {
        var arrEls = [];
        for (var o in arguments[0]) {
            // var newEl = this.jel(arguments[0][o], {_appliedTemplates: appliedTemplatesAttr});
            // var newArgs = arguments.slice(0);
            var newArgs = jelSoftCloneArray(arguments);
            newArgs[0] = arguments[0][o];
            var newEl = this.jel.apply(this, newArgs);
            if (newEl != "undefined")
                arrEls.push(newEl);
        }
        return arrEls;
    }

    if (typeof arguments[0] == "object") {
        // if (Array.isArray(arguments[0]))
            // return undefined;

        var tagName = undefined;
        var attrs = undefined;
        for (var key in arguments[0]) {
            tagName = key;
            attrs = arguments[0][key];
            break;
        }
        // if (typeof tagName != "string") {
        //     throw "Format error";
        // }
        //arguments.unshift(tagName);
        //var optionalParameter = Array.prototype.unshift.apply(arguments);
        Array.prototype.unshift.call(arguments, tagName);
        arguments[1] = attrs;
        return this.jel.apply(this, arguments);
    }

    if (typeof arguments[0] != "string")
        throw "Format error";

    if (typeof jel._templates[arguments[0]] == "function")
        return jel._templates[arguments[0]].call(this, this, jelSoftCloneArray(arguments));
        
    if (!jel.settings.allowScripts && arguments[0].trim() == "script")
        return undefined;

    var el = {};

    // var fromTemplate = typeof arguments[arguments.length - 1] == "boolean" ? arguments[arguments.length - 1] : false;
    // if (!fromTemplate && typeof jel._templates[arguments[0]] == "object") {
    if  (typeof jel._templates[arguments[0]] == "object" && 
        (typeof appliedTemplatesAttr == "undefined" || appliedTemplatesAttr[arguments[0]] !== true)) {
        // if (Array.isArray(jel._templates[arguments[0]])) {
        //     this.jelEx.appliedTemplatesAttr[arguments[0]] = true;
        // }
        if (typeof appliedTemplatesAttr == "undefined")
            appliedTemplatesAttr = {};
        appliedTemplatesAttr[arguments[0]] = true;
        var args = jelSoftCloneArray(arguments);
        args[0] = jel._templates[arguments[0]];
        args.push({_appliedTemplates: appliedTemplatesAttr});
        el = this.jel.apply(this, args);
        // el.jelEx._appliedTemplates[arguments[0]] = true;
        return el;
    } else {
        el = document.createElement(arguments[0]);
    }

    el.jelEx = {};
    el.jelEx._ownerElement = el;
    el.jelEx._namedParentForChildren = el;
    el.jelEx._namedParent = el;
    el.jelEx._componentRoot = el;
    el.jelEx._topComponentRoot = el;
    el.jelEx.AddPropertyLink = jelAddPropertyLink;
    // el.jelEx._appliedTemplates = {};

    if (this.jelEx !== undefined) {
        el.jelEx._namedParentForChildren = this.jelEx._namedParentForChildren;
        el.jelEx._namedParent = this.jelEx._namedParentForChildren;
        el.jelEx._componentRoot = this.jelEx._componentRoot;
    }

    if (el === undefined)
        throw "Unknown error";

    for (var i = 1; i < arguments.length; i++)
    if (typeof arguments[i] == "object" && 
            (typeof arguments[i][jel.settings.mapKeywords.properties] == "object" || 
                typeof arguments[i][jel.settings.mapKeywords.prop] == "object") 
    ) {
        var props = arguments[i][jel.settings.mapKeywords.properties] || arguments[i][jel.settings.mapKeywords.prop];
        for (var p in props) {
            var arLocalProp = p.split(".");
            var iterLocal = el;
            for (var lp = 0; lp < arLocalProp.length - 1; lp++) {
                if (typeof iterLocal[arLocalProp[lp]] == "undefined")
                    iterLocal[arLocalProp[lp]] = {};
                iterLocal = iterLocal[arLocalProp[lp]];
            }
            iterLocal[arLocalProp[arLocalProp.length - 1]] = props[p];
        }
    }

    // for (var i = 1; i < arguments.length; i++)
    // if (typeof arguments[i] == "object" && 
    //     typeof arguments[i]["jel"] == "object" && 
    //     typeof arguments[i]["jel"]["param"] == "object")
    //     el.jelEx["param"] = jelSoftMerge(el.jelEx["param"], arguments[i]["jel"]["param"])
    
    //     el.jelEx["param"] = jelSoftMerge(el.jelEx["param"], arguments[i]["jel"]["param"])

    for (var i = 1; i < arguments.length; i++)
    switch (typeof arguments[i]) {
        case "string":
            jelAddHTML(el, arguments[i]);
            break;
        case "object":
            if (Array.isArray(arguments[i]))
                jelAddArray(el, arguments[i], appliedTemplatesAttr);
            else
                jelSetAttributes(el, arguments[i], appliedTemplatesAttr);
            break;
        case "function":
            var res = arguments[i].call(el, el);
            if (res === false)
                return undefined;
            if (res)
                el.jel(res);
            break;
        default:
    }

    this.appendChild(el);

    return el;
}
