gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.listView = Backbone.View.extend({
        events: {

        },

        template: _.template("<a href='form?id=<%= _id %>'><div class='item'><div class='name'><%= funder %></div> <div class='amount'>$<%= amount %></div></div></a>"),


        initialize: function() {
        	var _this = this
            if($(this.el).find('#list')) {
                this.getItems()
                this.getObjectList()
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


        getObjectList: function(context) {
            var _this = this
            var t = {}
            this.collection.getObjectData({'list':true}, function(data){
                console.log("obj list data",data)
                if(data.length < 1) {
                    $('.objlist').html("After you add them, your team members will show up here.")
                }
                for(var t in data) {
                    $(".objlist ul").append("<li>"+ data[t].name +"</li>")
                }
            })
        },

        redirectClient: function(path) {
            window.location.href=path
        }

    });

})();
