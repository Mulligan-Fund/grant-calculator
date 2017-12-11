gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.formView = Backbone.View.extend({
        // template: JST['app/scripts/templates/card.ejs'],
        // errorTemplate: JST['app/scripts/templates/card-err.ejs'],
        events: {
            "click .submit":"submitForm",
        	
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
                // t.push( { "key": $(i).attr('id'),
                         // "val": $(i).val() })
                t[$(i).attr('id')] = $(i).val()

            })

             console.log(t)

            this.collection.sendData( 
                // var o = {}
                // for(i in t) {
                //     o[i['key']]=i['val']
                // }

                t
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



        render: function() {
            	
        },

        resize: function() {

        },



    });

})();
