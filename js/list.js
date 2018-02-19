gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.listView = Backbone.View.extend({
        events: {

        },
        seeker: null,
        maker: null,

        template: _.template("<a href='form?id=<%= _id %>'><div class='item'><div class='name'><%= funder %></div> <div class='amount'>$<%= amount %></div></div></a>"),

        initialize: function() {
            this.seeker = $('#seeker')
            this.maker = $('#maker')   
            var _this = this
            console.log(this.seeker, this.maker) 
            if($(_this.seeker).is('#seeker')) {
                this.getItems(_this.maker)
                this.getItems(_this.seeker)
                this.getObjectList()
            }
        },


        getItems:  function(t){
            var _this = this
            console.log("Get item pass",t)
            this.collection.getData({'list':true}, function(data){
                if(data.length < 1) {
                    if(t.is('#maker')) { 
                        t.html("Once created, your Grant Makers will appear here.") 
                    } else {
                        t.html("Once created, your Grant Applications will appear here.") 
                    }
                }
                $.each(data,function(e,i){
                    i.funder  = i.funder || "No funder yet"
                    i.amount  = i.amount || "0"
                    t.append( _this.template(i));    
                })
                
            }, t.is('#maker') )
        },


        getObjectList: function(context) {
            var _this = this
            var t = {}
            this.collection.getObjectData({'list':true}, function(data){
                console.log("obj list data",data)
                if(data.length < 1) {
                    $('.objlist').html("Add your team first in order to assign them to grant tasks.")
                }
                var count = 0
                for(var t in data) {
                    $(".objlist ul").append("<li>"+ data[t].name +"</li>")
                    count+=1;
                    if(count >= 12) {
                        $(".objlist ul").append("<br>plus " + (data.length-count) + " more people.")
                        break;
                    }
                }
            })
        },

        redirectClient: function(path) {
            window.location.href=path
        }

    });

})();
