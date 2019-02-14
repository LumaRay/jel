# jel
jel : Javascript Elements

A vanilla javascript DOM elements creation and management library

    Version: 0.1
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