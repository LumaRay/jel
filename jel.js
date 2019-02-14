/* 
    jel: Javascript Elements
    Version: 0.1
    A vanilla javascript DOM elements creation and management library
    Created by: Yury Laykov / Russia, Zelenograd
    2019
    MIT License

    Usage:

        HTML Elements creation and appending:

        [<parentHTMLElement>.]jel(<arguments>) : HTMLElement - creates a DOM subtree and adds it to parentHTMLElement (document.body by default)
        arguments: <argument0>, [<argument1>[,<argument2>[,...]]] - arguments are applied in order they are set, and the next one appends to the previous ones
            argument0 - can be string or {} or []
                string - set tag / template name
                {} - <JelElementInitializationObject>
                [] - array of <JelElementInitializationObjects>
            argument1+ - can be string or {} or [] or function
                string - add to inner HTML
                {} - set <JelElementAttributesAndJelProperties>
                [] - child <JelElementInitializationObjects>
                function - called immediately function(<el>){} : boolean
                    el - current created HTMLElement
                    if returns false - the will cancel parsing current created tree object and return undefined from current inner jel function
        JelElementInitializationObject: {<tagName>: <JelElementAttributesAndJelProperties>}
            tagName - set tag / template name
        JelElementAttributesAndJelProperties: {<param0>: <val0>[, <param1>: <val1>[, ...]]}
                param - element's attribute name or a special "jel" attribute name for <JelParameters>
                val - element's attribute value or a special "jel" attribute name for <JelParameters>
                    if <param> == "class", <val> can be string or []
                    if <param> == "style", <val> can be string or {} or []
                    else <val> should not be {} or []
        JelParameters: {<param0>: <val0>[, <param1>: <val1>[, ...]]}
            param - jel special parameter name
            val - jel special parameter value
                if <param> == "name", <val> - subelement special jel string name for a separate jel elements' naming tree
                if <param> == "root", <val> - indicates that this is a component root element, should be empty string ""
                if <param> == "links", <val> = <JelElementPropertyLinks>
        JelElementPropertyLinks: {<target0>: <local0>[, <target1>: <local1>[, ...]]} - link properties of a child element to one of it's parent elements
            target: "<targetElementType>.<targetElementCustomProperty0>[.<targetElementCustomProperty1>[.<targetElementCustomProperty2[...]>]]"
                targetElementType:
                    if <targetElementType> == "root", the link is created for a closest parent element marked as jel:{root:""}
                    if <targetElementType> == "master", the link is created for a closest parent element marked as jel:{name:"..."}
                targetElementCustomProperty<n> - custom property (sub)name for the selected parent element
            local: "<localElementCustomProperty0>[.<localElementCustomProperty1>[.<localElementCustomProperty2[...]>]]"
                localElementCustomProperty<n> - property (sub)name for current created element
         
                
        Using Templates:

        jel.SetTemplate(<templateName>, <JelTemplate>)
            templateName - string containing the template name to set / change; common tag names can be used - this will change / append to their functions when created by jel
            JelTemplate - can be string or {} or [] or function
                string - HTML element tag
                {} - <JelElementInitializationObject>
                [] - array of <JelElementInitializationObjects>
                function - element creation function: function (<elParent>, <templateName>) {} : HTMLElement
                    elParent - parent HTMLElement
                    templateName - used template name


    Examples:
        jel("div");
        jel({a:{href="#"}}, "I'm just a link")
        someform.jel("input", {type: "password"});
        jel.SetTemplate("label", {label: {style: "color: red;"}});
        ...
*/

// TODO:

// Именования адресатов в цепочных переменных
// Верховный адресат в цепочных переменных
// Установка именных свойств элемента
// Упаковка цепочных переменных в массивы
// Привязка для компонента верхнего уровня должна выполняться после привязки для компонентов нижнего уровня
// Упаковка связанных переменных в массивы
// Добавление именованных шаблонов элементов
// Инициализация из массива с последующим рядом аргументов и возвратом массива ссылок созданных элементов
// Задание классов как массива
// Добавление классов и стилей при расширении шаблона
// Слияние массивов классов и массивов / объектов стилей при расширении шаблона и обычной инициализации
// Возможность использовать функции как аргументы инициализации для атрибутов / значений объектов стилей (в функцию передается текущее значение атрибута / значения объекта стилей)

// UniBase - глобальная база данных json - концепция

function jel() {
    var elParent = (this === window) ? document.body : this;
    return elParent.jel.apply(elParent, arguments);
}

jel.allowScripts = true;

jel._templates = {};

jel.SetTemplate = function (strTemplateName, jelTemplate) {
    if (typeof strTemplateName == "string" && 
    (typeof jelTemplate == "function" || typeof jelTemplate == "object" || typeof jelTemplate == "string")) {
        this._templates[strTemplateName] = jelTemplate;
        return this;
    } else {
        return undefined;
    }
}

HTMLElement.prototype.jel = function() {

    function jelSetStyle(el, style) {
        for (var s in style)
            el.style[s] = style[s];
    }
    
    function jelAddHTML(el, strHTML) {
        if (!jel.allowScripts && strHTML.search("<script") != -1)
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
            Object.defineProperty(iterTarget, arTargetProp[arTargetProp.length - 1], {
                get: function() { return iterLocal[arLocalProp[arLocalProp.length - 1]]; },
                set: function(newValue) { iterLocal[arLocalProp[arLocalProp.length - 1]] = newValue; }
            });
        })(arTargetProp, iterTarget, arLocalProp, iterLocal);
    }

    function jelSetAttributes(el, attributes, appliedTemplatesAttr) {
        for (var a in attributes)
        if (typeof attributes[a] == "string")
        switch (a) {
            case "innerHTML":
                jelAddHTML(el, attributes[a]);
                break;
            default:
                el.setAttribute(a, attributes[a]);
        } else 
        if (typeof attributes[a] == "object")
        switch (a) {
            case "style":
                jelSetStyle(el, attributes[a]);
                break;
            case "children":
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
                        attributes[a][c].call(el, el);
                        break;
                    default:
                }
                break;
            case "jel":
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
                        for (var p in attributes[a][c])
                            el.jelEx.AddPropertyLink(p, attributes[a][c][p]);
                        break;
                    default:
                }
                break;
            default:
        } else 
        if (typeof attributes[a] == "function") {
            attributes[a][c].call(el, el);
        }
    }
    
    function jelSoftClone(oSrc) {
        var oTrg = {};
        for (o in oSrc)
            oTrg[o] = oSrc[o];
        return oTrg;
    }

    if (arguments.length === 0)
        return;

    var appliedTemplatesAttr = typeof arguments[arguments.length - 1] == "object" && typeof arguments[arguments.length - 1]._appliedTemplates != "undefined" ? jelSoftClone(arguments[arguments.length - 1]._appliedTemplates) : undefined;

    if ((typeof arguments[0] == "object" && Array.isArray(arguments[0])) && 
        (arguments.length === 1 || arguments.length === 2 && typeof appliedTemplatesAttr !== undefined )) {
        var arrEls = [];
        for (var o in arguments[0]) {
            var newEl = this.jel(arguments[0][o], {_appliedTemplates: appliedTemplatesAttr});
            if (newEl != "undefined")
                arrEls.push(newEl);
        }
        return arrEls;
    }

    if (typeof arguments[0] == "object") {
        if (Array.isArray(arguments[0]))
            return undefined;

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
        return jel._templates[arguments[0]].call(this, this, arguments[0]);
        
    if (!jel.allowScripts && arguments[0].trim() == "script")
        return undefined;

    var el = {};

    // var fromTemplate = typeof arguments[arguments.length - 1] == "boolean" ? arguments[arguments.length - 1] : false;
    // if (!fromTemplate && typeof jel._templates[arguments[0]] == "object") {
    if (typeof jel._templates[arguments[0]] == "object" && (typeof appliedTemplatesAttr == "undefined" || appliedTemplatesAttr[arguments[0]] !== true)) {
        // if (Array.isArray(jel._templates[arguments[0]])) {
        //     this.jelEx.appliedTemplatesAttr[arguments[0]] = true;
        // }
        if (typeof appliedTemplatesAttr == "undefined")
            appliedTemplatesAttr = {};
        appliedTemplatesAttr[arguments[0]] = true;
        el = this.jel(jel._templates[arguments[0]], {_appliedTemplates: appliedTemplatesAttr});
        // el.jelEx._appliedTemplates[arguments[0]] = true;
    } else    
        el = document.createElement(arguments[0]);

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
            if (arguments[i].call(el, el) === false)
                return undefined;
            break;
        default:
    }

    this.appendChild(el);

    return el;
}

// document.getElementsByTagName("html")[0].jel("meta");
// document.head.parentElement.jel("meta");

