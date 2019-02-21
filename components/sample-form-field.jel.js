jel.SetTemplate("jel:sample:form-field", 
    {div:{jel:{root:{}},chi:[
        {label:{jel:{links:{"root.jelLabel":"innerText"}}}},
        {br:{}},
        function(){
            var elobj = {};
            var tagName = (this.jelType === "textarea")?"textarea":"input";
            elobj[tagName] = {
                type:this.jelType, 
                jel:{
                    links:{
                        "root.jelValue": (this.jelType === "checkbox")?"checked":"value"
                    }
                }
            };
            return elobj;
        },
        {br:{}}
    ]}}
);
