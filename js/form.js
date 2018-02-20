gc.Views = gc.Views || {};

(function () {
    'use strict';

    gc.Views.formView = Backbone.View.extend({
        events: {
            "click .submit":"submitForm"
        	, "focusout .live": "submitField"
            , "blur .live": "submitField"
            , "click .turn": "pageTurn"
            , "click .people-button":"newHourObject"
        },
        template: {},
        initialize: function() {
        	var _this = this
            if($(this.el).hasClass('page')) {
                console.log("Init form",this.el)
                this.collection.getID()
                _this.template = _.template($('#ppllistTemplate').html())
                this.getObjectList()
                this.getFields()
            }
        },


        submitForm: function(e) {
            var _this = this
            var l = $(this.el).find('input').length
            var t = {}

            $(this.el).find('input').each(function(e,i){
                t[$(i).attr('id')] = $(i).val()

            })
            this.collection.sendData( 
                t, function(data,status) {
                // Redirect
                if(String(data).match('/')) {
                    console.log("Redirecting")
                    window.location.replace(data)
                }
            },checkIfURL('gmaker'))
        },

        submitField: function(e) {
            var _this = this;
            console.log("Field submit")
            var t = $(e.currentTarget)
            // console.log(t.attr("id"),t.val())
            var i={};
            var val = ""
            if($(t).prop('nodeName') == 'SELECT') {
                 val = $(t).children("option:selected").attr("data_id")
            } else {
                val = t.val()
            }
            // Handle ppl list info
            if (t.hasClass('ppl')) {
                var f = t.parent()
                i[t.attr('id')] = [{
                    "_id" : f.attr('obj_id') == 0 ? null : f.attr('obj_id')
                    , "person": f.find('.objlist').children("option:selected").attr("data_id")
                    , "hours": f.find('.hours').val()
                }]
                console.log("Handling ppl",i)

            } else {
                i[t.attr("id")] = val
            }

            this.collection.sendData(i, function(data,next) {

            },checkIfURL('gmaker'))
        },

        // This fills in all the fields
        getFields:  function(context){
            var _this = this
            var t = {}
            this.collection.getData( {}, function(data){
                    t = data
                   $('.page').each(function(z,x) {
                        $(x).find('form').each(function(o,p) {
                            console.log("Pop page",o)

                            $(p).find('input').each(function(e,i){
                                var id = $(i).attr('id')
                                console.log(id,t[id])
                                $('#'+id).val(t[id])
                            })

                           $(p).find('select').each(function(e,i){
                                var id = $(i).attr('id')
                                console.log(id,t[id])
                                // console.log("Trying to set attr",'option[data_id="'+ data[id] +'"]')
                                $('#'+id).children('option[data_id="'+ t[id] +'"]').attr('selected',true)
                            })

                           $(p).find('peoplelist').each(function(e,i){
                            var id = $(i).attr('id');
                            getFieldArray(id,t)

                           })
                    } )
                })
           }, checkIfURL('gmaker') )
        },

        getFieldArray: function(id,data) {
          var _this = this
          $.each(data.id,function(e,i){
                this.makeHourObject(i)
            })
        },

        // This populates dynamic fields
        getObjectList: function(context) {
            var _this = this
            var t = {}
            this.collection.getObjectData({'list':true}, function(data){
                // console.log("obj list data",data)
               $('.objlist').each(function(i,l){

                    $(l).find('option').remove();
                    $(l).append('<option value="" selected disabled hidden>Select Team Member</option>');

                    for(var t in data) {
                        $(l).append("<option data_id='"+data[t]._id+"''>"+ data[t].name +"</option>")
                    }
               })
               _this.template = _.template($('#ppllistTemplate').html())
            })
        },
        
        newHourObject: function(e) {
            this.makeHourObject(e, {
                id: 0
                , dbid: $(e.currentTarget).attr('id')
            })
        },

        makeHourObject: function(e,data) {
          var _this = this

          data = data ? data : { id: 0, title: ""}
          var t = $(this.template(data))
          t.find('select').find('option[data_id="'+data.title+'"]').attr('selected',true)
          t.hide().fadeIn('fast')
          $(e.currentTarget).parent().find('.bod').append(t)
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
