# jel

### jel : Javascript Elements

*A vanilla javascript DOM elements creation and management helper library*

Simply turn all `<h1>that stuff</h1>` into `{h1: "this one"}` - [but this is just a beginning!](https://codepen.io/lumaray/pen/VgEMpg?editors=0010)

Check out form examples:
* [Using Materialize](https://codepen.io/lumaray/pen/gEpMJw?editors=0010)
* [Using Bootstrap](https://codepen.io/lumaray/pen/EMjwRm?editors=0010)

This library should help move from explicit HTML markup to javascript objects coding. Just retrieve JSON elements' init objects from a server or initialize them yourself, then convert them into common javascript objects and use with **jel** function (or add as templates for a later use).

    Created by: Yury Laykov / Russia, Zelenograd
    2019
    MIT License
    No additional libraries required.
    Can be used with other libraries.
    Works on older browsers (ES5).
    The product is distributed "AS IS", without any warranties and liabilities.

### Usage:

##### HTML Elements creation and appending:

    [<parentHTMLElement>.]jel(<arguments>) : HTMLElement - creates a DOM subtree and adds it to parentHTMLElement 
    (document.body by default)
        arguments: <argument0>, [<argument1>[,<argument2>[,...]]] - arguments are applied in order they are set, 
        and the next one appends to the previous ones
            argument0 - can be string or {} or []
                string - set tag / template name (if == "" and argument1 - string, then just append html from argument1)
                {} - <JelElementInitializationObject>
                [] - array of <JelElementInitializationObjects>
            argument1+ - can be string or {} or [] or function
                string - add to inner HTML
                {} - set <JelElementAttributesAndJelProperties>
                [] - child elements of <JelElementInitializationObject> or string or function
                function - called immediately function(<el>){} : undefined, or boolean, or <JelElementInitializationObject(s)>
                    el - current created HTMLElement
                    - if returns false - this will cancel parsing current created tree object and return undefined from current inner jel function;
                    - if returns other !undefined value - jel tries to append them as <JelElementInitializationObject(s)>;
                    - if returns undefined (no return value) - the parsing process goes on.
        JelElementInitializationObject: {<tagName>: <JelElementAttributesAndJelProperties>}
            tagName - set tag / template name
        JelElementAttributesAndJelProperties: {<param0>: <val0>[, <param1>: <val1>[, ...]]}
                param - element's attribute name or a special "jel" attribute name for <JelParameters>
                val - element's attribute value or a special "jel" attribute name for <JelParameters>
                    if <param> == "class", element class sting will be appended with <val>,
                    which can be string or [] or function (<el>, <curClassString>) {... return <addToClassString>}
                        el - current created HTMLElement;
                        if <val> is [], items in it can be strings or [] (then recursive) or function (<el>, <curClassString>) {... return <addToClassString>}
                            addToClassString - class string to append to current class string
                    if <param> == "style", element style will be appended with <val>, 
                    which can be string or {} or [] or function (<el>, <curStyle>) {... return <addToStyle>}
                        if <val> is {}, values in it can be function (<el>, <curStyleParam>) {... return <newStyleParam>}
                        if <val> is [], items in it can be <addToStyle> or [] (then recursive) or function (<el>, <curStyle>) {... return <addToStyle>}
                            addToStyle - key-value style object {}
                    if <param> == "children" or <param> == "chi", <val> - array [] of <JelElementInitializationObjects>, 
                    or html strings with child elements' contents, or functions that can append jel elements manually or by returning jel objects/arrays.
                    if <param> == "properties" or <param> == "prop", <val> = <Properties>
                    if <param> == "innerHTML" or <param> == "html", <val> = html string to append to the element's inner content
                    if <param> == "jel", <val> = <JelParameters>
                    else <val> should not be {} or []
                        if <val> is function, then it should be: function(<el>, <oldAttr>){... return <newAttr>} 
                            el - current created HTMLElement
        Properties: {<prop0>: <val0>[, <prop1>: <val1>[, ...]]} - set additional properties (<prop>) to values (<val>) for currently created element
            prop: "<localElementProperty0>[.<localElementProperty1>[.<localElementProperty2[...]>]]"
                localElementProperty<n> - property (sub)name for current created element
        JelParameters: {<param0>: <val0>[, <param1>: <val1>[, ...]]}
            param - jel special parameter name
            val - jel special parameter value
                if <param> == "name", <val> - subelement special jel string name for a separate jel elements' naming tree
                if <param> == "root", <val> - indicates that this is a component root element, should be empty string ""
                if <param> == "links", <val> = <JelElementPropertyLinks>
        JelElementPropertyLinks: {<target0>: <local0>[, <target1>: <local1>[, ...]]} or [{<target0>: <local0>}[, {<target1>: <local1>}[, ...]]]
         - link properties of a child element to one of it's parent elements
            target: "<targetElementType>.<targetElementCustomProperty0>[.<targetElementCustomProperty1>[.<targetElementCustomProperty2[...]>]]"
                targetElementType:
                    if <targetElementType> == "root", the link is created for a closest parent element marked as jel:{root:""}
                    if <targetElementType> == "master", the link is created for a closest parent element marked as jel:{name:"..."}
                targetElementCustomProperty<n> - custom property (sub)name for the selected parent element
            local: "<localElementProperty0>[.<localElementProperty1>[.<localElementProperty2[...]>]]"
                localElementProperty<n> - property (sub)name for current created element
         
##### Extended jel element functions:

    <jelElement>.jelEx.addPropertyLink(<target>, <local>) - see <JelElementPropertyLinks>
        jelElement - HTMLElement, created using jel function.
        target, local - see <JelElementPropertyLinks>

##### Using Templates:

    jel.setTemplate(<templateName>, <JelTemplate>)
        templateName - string containing the template name to set / change;
        common tag names can be used - this will change / append 
        to their functions when created by jel
        JelTemplate - can be string or {} or [] or function
            string - HTML element tag
            {} - <JelElementInitializationObject>
            [] - array of <JelElementInitializationObjects>
            function - element creation function: function (<elParent>, <templateName>) {} : HTMLElement
                elParent - parent HTMLElement
                templateName - used template name
    Templates can be applied as regular elements creation using jel function. 
    Using additional jel arguments will append to the created template instance.
    
    jel.getTemplate(<templateName>) - returns template as a string or {} or [] or function or undefined if not exists

##### Additional settings:

    jel settings can be accessed by global jel.settings object:
        jel.settings.allowScripts - if set to false, insertion of script tags will be blocked by the library (default - true);
        jel.settings.mapKeywords - a key:value object, where keys - default library keywords, 
            and values - the corresponding keywords the library looks for when creating and object.
            By altering values, user can change which keywords the jel library should look for 
            (it case the default ones are reserved by some other user's code).
            E.g.: jel.settings.mapKeywords.html = "elternate_html_key"; jel("div", {elternate_html_key: "<p>Hello Jonh Doe!</p>"});

### Examples 

You can test the lib [in this sandbox](https://codepen.io/lumaray/pen/VgEMpg?editors=0010) or:
* [using Materialize](https://codepen.io/lumaray/pen/gEpMJw?editors=0010)
* [using Bootstrap](https://codepen.io/lumaray/pen/EMjwRm?editors=0010)

And / or you can check our [test GitHub page](https://lumaray.github.io/jel/) to see extended examples with templates in action 
(open developer tools and view the sources)

    jel([
        {p:"Hello John Doe."},
        {p:"Here is what I know about you:"},
        {ul:[
            {li:"you code fast;"},
            {li:"you are so smart;"},
            {li:"you are the top cited man!"}
        ]},
        "hr"
    ]);

    jel("div");

    jel({a:{href="#"}}, "I'm just a link");

    someform.jel("input", {type: "password"});

    jel.setTemplate("label", {label: {style: "color: red;"}});
    
    document.head.jel("meta");

    document.getElementsByTagName("html")[0].jel("head2");

    document.head.parentElement.jel("body2");

    jel("div", {
        "id": "testid",
        "class": "testcl",
        "name": "testname"
    });

    jel("div", {id: "testid", class: "testcl", name: "testname", style: "width: 50px; height: 50px; background: green;"});
    jel("div", {id: "testid", class: "testcl", name: "testname", style: {width: "50px", height: "50px", background: "green"}});
    jel({div: {id: "testid", class: "testcl", name: "testname", style: {width: "50px", height: "50px", background: "green"}}});
    jel({div: {id: "testid", class: "testcl", name: "testname", style: {width: "50px", height: "50px", background: "green"}}},[
        {div: {id: "testid2", class: "testcl", name: "testname2", style: {width: "30px", height: "30px", background: "blue"}}}
    ]);

    jel("div", {id: "testid", class: "testcl", name: "testname", style: "width: 50px; height: 50px; background: green;"}, [
        {div: {id: "testid2", class: "testcl", name: "testname2", style: {width: "30px", height: "30px", background: "blue"}}}
    ]);

    jel("div", function(){
        this.jel("h1");
        this.jel("h2");
        this.jel("h3");
    });

    jel("div", el => {
        el.jel("h1");
        el.jel("h2");
        el.jel("h3");
    });

    jel("div", [
        jel("h1"),
        jel("h2"),
        jel("h3")
    ]);

    jel("div", [
        "h4",
        {h5:"Hurray!"},
        el => {el.jel("h6");}
    ]);

    jel("div")
        .jel("h1");

    jel("div", {
        id: "testid",
        class: "testcl",
        name: "testname"
    }, [
        jel("h1"),
        jel("h2"),
        jel("h3")
    ]);

    jel({div: {
        id: "testid",
        class: "testcl",
        name: "testname"
    }}, [
        jel("h1"),
        jel("h2"),
        jel("h3")
    ]);

    window.elTest = jel({div: 
        {
            id: "testid",
            class: "testcl",
            name: "testname",
            children: [
                {div: {id: "testid2", class: "testcl", name: "testname2", 
                    style: "width: 50px; height: 50px; background: green;", 
                    jel: {
                        links: {
                            "master.testBackgroundColor": "style.backgroundColor",
                            "root.testEventListener": "addEventListener"
                        }
                    }}},
                "Bla <b>bla</b>",
                {div: {
                    id: "testid3", class: "testcl", name: "testname3", 
                    style: {width: "30px", height: "30px", background: "blue"}, 
                    jel: {name: "tn2", links: {
                        "root.testWidth": "style.width",
                        "root.testEventListener": "addEventListener",
                        "root.testOnClick": "onclick",
                        "master.testBackgroundColor": "style.backgroundColor"
                    }}
                }},
                "Yeee ",
                "Cool",
                {div:{chi:[{div:{chi:[{div:{chi:[{div:{jel:{name: "lowestNode"}}}, function(el) {window.ttt = el;}]}}]}}]}}
            ],
            innerHTML: "test<b>!</b>",
            jel: {
                name: "topName",
                root: ""
            },
            properties: {
                align: "right"
            }
        }}, 
        "Test <i>1111</i>", 
        [
            jel("h1"),
            jel("h2", "Test <u>H2</u>"),
            jel("h3")
        ],
        "Test 2222", 
        function(el) {
            el.jel("h4");
            el.jel("h5");
            el.jel("","Some plain <u>HTML</u>");
        }
    );

    for (e in elTest.testEventListener) {
        elTest.testEventListener[e].call(elTest,"click",function(e){console.log(e.target);});
    };

    elTest.testOnClick = function(){elTest.testBackgroundColor = "pink"};

    jel("div",{children: [
        {div:{children: [
            {div:{}},
            el => {window.ttt = el;}
        ]}},
        "test!"
    ]});

    jel({form: {action: "", method: "post", children: [
        {label: {for: "FullName", children: ["Full Name"]}}, {br:{}},
        {input: {type: "text", name: "FullName", id: "FullName"}},
        {br:{}},
        {label: {for: "Passport", children: ["Your Local ID"]}}, {br:{}},
        {input: {type: "text", name: "Passport", id: "Passport"}},
        {br:{}},
        {label: {for: "Scan", children: ["Scan of application form"]}}, {br:{}},
        {input: {type: "file", name: "Scan", id: "Scan"}},
        {hr:{}},
        {label: {for: "Comments", children: ["Additional comments"]}}, {br:{}},
        {textarea: {rows: 10, cols: 45, name: "Comments", id: "Comments"}},
        {br:{}},
        {label: {for: "AdditionalFiles", children: ["Additional files"]}}, {br:{}},
        {input: {type: "file", name: "AdditionalFiles", id: "AdditionalFiles"}},
        {br:{}},
        {input: {type: "submit", value: "Save"}}
    ]}});



    function addFormField(el, arrInputData) {
        el.jel({label: {for: arrInputData.inputName, children: [arrInputData.inputTitle]}});
        el.jel({br:{}});
        el.jel(new function() {
            this[arrInputData.inputTag] = {
                type: arrInputData.inputType, 
                name: arrInputData.inputName, 
                id: arrInputData.inputName};
            if (arrInputData.inputType != "")
                this[arrInputData.inputTag]["type"] = arrInputData.inputType;
            for (var a in arrInputData.additionalAttributes)
                this[arrInputData.inputTag][a] = arrInputData.additionalAttributes[a];
        });
    }



    function addForm(el, arrFieldsData, strSubmitTitle) {
        el.jel({form: {action: "", method: "post"}}, function() {
            for (var d in arrFieldsData) {
                if (arrFieldsData[d].inputTag === "hr") {
                    this.jel("hr");
                    continue;
                }
                addFormField(this, arrFieldsData[d]);
                // if (d !== Object.keys(arrFieldsData)[Object.keys(arrFieldsData).length-1])
                    this.jel("br");
            }
            this.jel([{br:{}}, {br:{}}]);
            this.jel({input: {type: "submit", value: strSubmitTitle}});
        });
    }


    var formData = [
        {inputTag: "input", inputType: "text", inputName: "FullName", inputTitle: "Full Name", additionalAttributes: {}},
        {inputTag: "input", inputType: "text", inputName: "Passport", inputTitle: "Your Local ID", additionalAttributes: {}},
        {inputTag: "input", inputType: "file", inputName: "Scan", inputTitle: "Scan of application form", additionalAttributes: {}},
        {inputTag: "hr"},
        {inputTag: "textarea", inputType: "", inputName: "Comments", inputTitle: "Additional comments", additionalAttributes: {rows: 10, cols: 45}},
        {inputTag: "input", inputType: "file", inputName: "AdditionalFiles", inputTitle: "Additional files", additionalAttributes: {}},
    ];

    addForm(document.body, formData, "Save");


    jel("h1", {
        style:{color:"green"},
        html:"Welcome to jel sandbox!"
    });

    jel("a", {href:"https://github.com/LumaRay/jel", target:"_blank"})
        .jel("h2", 
            {style:{"font-style":"italic"}},
            "Code your pages with pure javascript.");

    document.head.jel(
        {style:{type:"text/css"}}, 
        ".wow{text-decoration:underline;}");

    jel({ul:{chi:[
        {li:{class:"wow", chi:["Easy use with JSON"]}},
        {li:{chi:["Vanilla <i>javascript</i>"]}},
        {li:{chi:["Templates"]}},
        {li:{chi:["Linked properties"]}}
    ]}}, [
        jel({li:{chi:[
            {a:{href:"https://github.com/LumaRay/jel#usage",
                target:"_blank",
                prop:{innerText:"And more"}}}
            ]}})
    ]);

    jel.setTemplate("sample text template name", {div:{chi:[
        "In case you have ",
        {i:{chi:["a mixed text content"]}},
        ", it is still possible ",
        {b:{chi:["to list them as child elements"]}},
        " or <u>use markup inside your text.</u>"
    ]}});

    jel({"sample text template name":{style:{"font-size":"14pt"}}}, function(el){
        this.jel(["br", "br"]);
    });

    jel({a:{
        style:"font-size: 16pt", 
        target:"_blank",
        href:"https://github.com/LumaRay/jel#examples"
    }}, "Try other examples!");