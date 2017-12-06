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
            var t = []
            console.log("input",$(this.el).find('input'))

             $(this.el).find('input').each(function(e,i){
                t.push( String($(i).attr('id') +":"+ $(i).val() ))
            })

             console.log(t)

            this.collection.sendData($(this.el).find("#pinterestUsername").html()
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

        usernameClear: function() {
            if(!this.cleared) {
                $(this.el).find("#pinterestUsername").html("")
                this.cleared = true
            }
        },

        registerPinterest: function() {
            var _this = this
            var username = $(this.el).find("#pinterestUsername").html()
            var board = $(this.el).find(".boardList").find(':selected').html()

            this.collection.registerUserPinterestConfig(username,board,function() {
                    window.location.href="/"
            })
        },

        render: function() {
            	
        },

        resize: function() {

        },



    });

})();
