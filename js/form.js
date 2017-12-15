gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.formView = Backbone.View.extend({
        events: {
            "click .submit":"submitForm"
        	, "focusout .live": "submitField"
            , "blur .live": "submitField"
        },
        initialize: function() {
        	var _this = this
            if($(this.el).hasClass('form')) {
                this.collection.getID()
                this.getFields()
            }
        },

        submitForm: function(e) {
            var _this = this
            console.log("Form clicked")
            var l = $(this.el).find('input').length
            var t = {}

            $(this.el).find('input').each(function(e,i){
                t[$(i).attr('id')] = $(i).val()

            })

            console.log(t)

            this.collection.sendData( 
                t, function(data,status) {
                console.log(data)
                if(String(data).match('/')) {
                    window.location.replace(data)
                }
            })
            
        },

        submitField: function(e) {
            var _this = this;
            console.log("Field submit")
            var t = $(e.currentTarget)
            console.log(t.attr("id"),t.val())
            var i={};
            i[t.attr("id")] = t.val();
            this.collection.sendData(i, function(data,next) {

            })
        },

        // This fills in all the fields
        getFields:  function(context){
            var _this = this
            var t = {}
            this.collection.getData( function(data){
                   t = data 
                } )
            $(_this).find('input').each(function(e,i){
                console.log($(i).attr('id'))
                
                if (e==_this.length) return t
            })
        },

        formClear: function() {
            if(!this.cleared) {
                $(this.el).find("#pinterestUsername").html("")
                this.cleared = true
            }
        },

        redirectClient: function(path) {
            console.log("Trying to redirect to",path)
            window.location.replace(path)
        }

    });

})();
