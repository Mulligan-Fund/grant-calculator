gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.resultView = Backbone.View.extend({
        events: {
            "click .turn": "pageTurn"
        },
        initialize: function() {
        	var _this = this
            if($(this.el).hasClass('resultblock')) {
                console.log("Init form",this.el)
                this.collection.getID()
                this.getObjectList()
                this.getFields()
            }
        },

        // This populators dynamic fields
        getObjectList: function(context) {
            var _this = this
            this.lookup = {}
            this.collection.getObjectData({'list':true}, function(data){
                console.log("Populated object list")
            })
        },



        // This fills in all the fields
        getFields:  function(context){
            var _this = this
            var t = {}
            var hr = []
            var ro = []
            this.collection.getData( {}, function(data){
                t = data
                console.log(t)
                _this.collection.getObjectData({list:true}, function(roles){
                    ro = roles
                    console.log("Roles",ro)
                    _.each(t,function(val,key,context) {
                        if(key.indexOf('_hour') > 0) {
                            var id = key.split('_hour')[0]
                            if(typeof t[id] !== 'undefined') {
                                console.log(t[id])
                                var person = _.findWhere(ro, {'_id': t[id]})
                                console.log("Person found",person)
                                hr[id] = { 
                                    time: val
                                    , salary: person.salary
                                    } 
                                // hr.push(oo)
                            }
                        }
                    })
                })
           })
            console.log()
        },

        getCount: function(data) {

        },

        pageTurn: function(e) {
            console.log("Turning page",e)
            if($(e.currentTarget).hasClass('next')) {
                console.log("Next page")
                $('.page.show').removeClass('show').next().addClass('show')    
            } else {
                console.log("prev page")
                $('.page.show').removeClass('show').prev().addClass('show')
            }
            
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
