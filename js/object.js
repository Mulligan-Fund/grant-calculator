gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.objectListView = Backbone.View.extend({
        events: {
            "click .new":"newObject"
            , "click .submit": "submitForm"
        },
        
        template: {},

        initialize: function() {
            var _this = this
            if($(this.el).is('#objectlist')) {
                console.log("Init obj",this.el)
               this.getClassifiers({},function() {
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
          var _this = this
          // this.undelegateEvents();
          this.$el.prepend(this.template(data))
          this.$el.find('.fadein').removeClass('fadein');
          // this.$el.find('.submit:first').on('click',function(e) {
          //   _this.submitForm(e)
          // })
          // this.delegateEvents();
        },

        getClassifiers: function(e,cb) {
            this.collection.getRoleData({},function(data){
               var t = data 
               var temp = $($('#objectTemplate')[0].innerHTML)
               $(temp).find('option').remove();
               // console.log("class",t)
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
            var t = {}
            var val;
            if(!$(e.currentTarget).prop('nodeName')=='A') return // double exec for some reason
            $(e.currentTarget).parent().find('input, select').each(function(e,i){
                console.log('Submitting',i)
                if($(i).prop('nodeName') == 'SELECT') {
                 val = $(i).children("option:selected").attr("data_id")
                 console.log("Select val",val)
                } else {
                    val = $(i).val()
                    console.log("input val",val)
                }

                t[$(i).attr('data_id')] = $(i).val()

            })
            this.collection.sendObject( 
                t, function(data,status) {
                    console.log(data,status)
                // if(String(data).match('/')) {
                //     console.log("Redirecting")
                //     window.location.replace(data)
                // }
            })
        },

        // This fills in all the fields
        getObjects:  function(context){
            var _this = this
            var t = {}
            this.collection.getObjectData({'list':true}, function(data){
                   t = data 
                    for(var i in t) {
                        // console.log("GETTING OBJECTS",t[i])
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
