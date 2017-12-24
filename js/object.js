gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.objectListView = Backbone.View.extend({
        events: {
            "click .new":"newObject"
            , "focusout .live": "submitField"
            , "blur .live": "submitField"
        },
        
        template: {},

        initialize: function() {
            var _this = this
            console.log("Init form",this.el)
            if($(this.el).has('#objectlist')) {
               this.getClassifiers({},function() {
                console.log("cb")
                _this.template = _.template($('#objectTemplate').html())
                _this.getObjects()
               })
            }
        },

        newObject: function(e) {
            this.makeObject({
                name: ""
                , salary: 0
            })
        },

        makeObject: function(data) {
          $(this.el).append(this.template(data))
        },

        getClassifiers: function(e,cb) {
            this.collection.getRoleData({},function(data){
                   var t = data 
                   var temp = $($('#objectTemplate')[0].innerHTML)
                   $(temp).find('option').remove();
                   console.log("class",t)
                    for(var i in t) {
                        $(temp).find('select').append("<option data_id='"+t[i]._id+"''>"+ t[i].title +"</option>")
                        if(i==data.length-1) { 
                            $('#objectTemplate')[0].innerHTML = $(temp).html()
                            cb()
                        }
                    }
            })
        },

        submitForm: function(e) {
            var _this = this
            var l = $(this.el).find('input').length
            var t = {}

            $(this.el).find('input').each(function(e,i){
                t[$(i).attr('id')] = $(i).val()

            })
            this.collection.sendObject( 
                t, function(data,status) {
                if(String(data).match('/')) {
                    console.log("Redirecting")
                    window.location.replace(data)
                }
            })
        },

        // This fills in all the fields
        getObjects:  function(context){
            var _this = this
            var t = {}
            this.collection.getObjectData({'list':true}, function(data){
                   t = data 
                    for(var i in t) {
                        console.log("GETTING OBJECTS",t[i])
                        _this.makeObject(t[i])
                    }
            } )
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
