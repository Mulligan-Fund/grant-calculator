gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.listView = Backbone.View.extend({
        events: {

        },

        template: _.template("<div class='item'><a href='form/?id=<%= _id %>'></strong> (<%= funder %>) - <%= amount %></a></div>"),


        initialize: function() {
        	var _this = this
            if($(this.el).find('#list')) {
                this.getItems()
            }
        },


        getItems:  function(){
            var _this = this
            var t = {}
            this.collection.getData({'list':true}, function(data){
                $.each(data,function(e,i){
                    // console.log(_this.template(i))
                    i.funder  = i.funder || "No funder yet"
                    i.amount  = i.amount || "0"
                    $(_this.el).append( _this.template(i));    
                })
                
            } )
        },

        redirectClient: function(path) {
            window.location.href=path
        }

    });

})();
