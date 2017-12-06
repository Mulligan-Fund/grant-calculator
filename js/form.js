gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.formView = Backbone.View.extend({
        // template: JST['app/scripts/templates/card.ejs'],
        // errorTemplate: JST['app/scripts/templates/card-err.ejs'],
        events: {
            "click .submit":"submitSection",
        	
        },
        initialize: function() {
        	var _this = this
            this.boards = []
        },

        usernameUpdate: function(e) {
            var _this = this
             if(e.keyCode == 13){
                e.preventDefault();
                this.collection.doPinBoardsExist($(this.el).find("#pinterestUsername").html()
                    , function(data) {
                    if(data.length > 0) {
                        console.log("populating boards")
                        for(var v in data) {
                            $(_this.el).find(".boardList").append("<option value="+data[v]+">"+data[v]+"</option>")
                        }
                    $(_this.el).find(".boardList").show()
                }
            })
            }
            
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
