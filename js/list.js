gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.listView = Backbone.View.extend({
        events: {
            "click .submit":"submitForm"
        	, "focusout .live": "submitField"
            , "blur .live": "submitField"
        },
        initialize: function() {
        	var _this = this
            this.boards = []
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
                t
                , function(data) {
                    
            })
            
        },

        submitField: function(e) {
            var _this = this;
            console.log("Field submit")
            var t = $(e.currentTarget)
            console.log(t.attr("id"),t.val())
            var i={};
            this.collection.sendData(i[t.attr("id")] = t.val()
                , function(data) {
                    
            })
        },

        getFields:  function(context){
            var _this = context
            var t = []
            console.log($(_this))
             $(_this).find('input').each(function(e,i){
                t.push( String($(i).attr('id') +":"+ $(i).val() ))
                console.log(e,_this.length)
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
            window.location.href=path
        }

    });

})();
