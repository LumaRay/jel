# jel

### jel : Javascript Elements

*A vanilla javascript DOM elements creation and management helper library*

Simply turn all `<h1>that stuff</h1>` into `jel("h1", "this one")`

This library should help move from explicit HTML markup to javascript objects coding. Just retrieve JSON elements' init objects from a server or initialize them yourself, then convert them into common javascript objects and use with **jel** function (or add as templates for a later use).

    Version: 0.1
    Created by: Yury Laykov / Russia, Zelenograd
    2019
    MIT License

#### Usage:

###### HTML Elements creation and appending:

    [<parentHTMLElement>.]jel(<arguments>) : HTMLElement - creates a DOM subtree and adds it to parentHTMLElement 
    (document.body by default)
        arguments: <argument0>, [<argument1>[,<argument2>[,...]]] - arguments are applied in order they are set, 
        and the next one appends to the previous ones
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
         
                
###### Using Templates:

    jel.SetTemplate(<templateName>, <JelTemplate>)
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


#### Examples:

    jel("div");

    jel({a:{href="#"}}, "I'm just a link");

    someform.jel("input", {type: "password"});

    jel.SetTemplate("label", {label: {style: "color: red;"}});
    
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
                {div: {id: "testid2", class: "testcl", name: "testname2", style: "width: 50px; height: 50px; background: green;"}},
                "Bla <b>bla</b>",
                {div: {
                    id: "testid3", class: "testcl", name: "testname3", 
                    style: {width: "30px", height: "30px", background: "blue"}, 
                    jel:{name: "tn2", links: {
                        "root.testWidth": "style.width",
                        "root.testEventListener": "addEventListener",
                        "root.testOnClick": "onclick",
                        "master.testBackgroundColor": "style.backgroundColor"
                    }}
                }},
                "Yeee ",
                "Cool",
                {div:{children:[{div:{children:[{div:{children:[{div:{jel:{name: "lowestNode"}}}, function(el) {window.ttt = el;}]}}]}}]}}
            ],
            innerHTML: "test<b>!</b>",
            jel: {
                name: "topName",
                root: ""
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
            el.jel("h6");
        }
    );

    elTest.testEventListener("click",function(e){console.log(e.target);});

    elTest.testOnClick = function(){alert(1);};

    jel("div",{children: [
        {dev:{children: [
            {dev:{}},
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