// var el = jel({form:{
//     chi:(function(){
//         return [
//             {"jel:sample:form-field":{}},
//             {"jel:sample:form-field":{}}
//         ];
//     })()
// }});

// var el = jel({form:{
//     chi:[function(){
//         this.jel([
//             {"jel:sample:form-field":{}},
//             {"jel:sample:form-field":{}}
//         ]);
//     }]
// }});

jel.SetTemplate("jel:sample:form", 
    {form:{
        chi:[function(){
            this.jelEx._jelFields = this.jelFields;
            Object.defineProperty(this, "jelFields", {
                get: function() { return this.jelEx._jelFields; },
                set: function(arFields) { 
                    this.jelEx._jelFields = arFields;
                    this.innerHTML = "";
                    for (var f in arFields) {
                        var el = this.jel({"jel:sample:form-field": {prop:{jelType: arFields[f].type}}});
                        el.jelLabel = arFields[f].label;
                        el.jelValue = arFields[f].value;
                        // el.jelType = arFields[f].type;
                    }
                }
            });
            if (this.jelEx._jelFields)
                this.jelFields = this.jelEx._jelFields;
        }]
    }}
);
