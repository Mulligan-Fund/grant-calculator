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
            , "click .delete": "deleteGrant"
            , "click .login-toggle": "tab"
            , "click #consent": "activateButton"
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
                this.listenTo('click .delete',this.deleteGrant)
            }
        },

        activateButton: function(e) {
            console.log("Activating register")
            if($("#consent").find('input').is(":checked")) $("#loginreg").prop("disabled",false);
            else $("#loginreg").prop("disabled",true);
        },

        tab: function(e) {
            var t = $(e.currentTarget).find('.active')
            var n = t.siblings()
            n.addClass('active')
            t.removeClass('active')
            if(n.hasClass('log')) {
                $('#consent').hide()
                $("#loginreg").prop("disabled",false);
                $('#loginreg').html('Login')
            } else {
                $('#consent').show()
                $('#loginreg').html('Register')
                if(!$('#consent').find('input').is(":checked")) $("#loginreg").prop("disabled",true);
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
            var i={};
            var val = ""
            if($(t).prop('nodeName') == 'SELECT') {
                 val = $(t).children("option:selected").attr("data_id")
                 console.log('gotval select',val)
            } else {
                val = t.val()
            }
            // Handle ppl list info
            if (t.hasClass('ppl')) {
                var f = t.parent()
                var bod = f.parent()
                var pa = []
                bod.find('.time').each(function(i,e){
                    var tt = {
                        "person": $(e).find('.objlist').children("option:selected").attr("data_id")
                        , "hours": $(e).find('.hours').val()
                    }
                    // if($(e).attr('obj_id') != 0) tt["_id"] = $(e).attr('obj_id') == 0 ? null : $(e).attr('obj_id')
                    console.log(i,tt)
                    pa.push(tt)
                })
                i[t.attr('id')] = pa
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

                           $(p).find('.peoplelist').each(function(e,i){
                                var id = $(i).attr('id');
                                _this.getFieldArray(id,t)

                           })
                    } )
                })
           }, checkIfURL('gmaker') )
        },
        // These handle the people list
        getFieldArray: function(id,data) {
          var _this = this
          if(data[id].length > 0) console.log("GetFieldArray",id,data[id])
          $.each(data[id],function(e,i){
            // console.log("GetFieldArray",e,i)
                _this.makeHourObject($('#'+id), {
                    id: e
                    , dbid: data[id]
                    , personid: i.person
                    , hours: i.hours
                })
            })
        },
        
        newHourObject: function(e) {
            var target = $(e.currentTarget).parent()
            this.makeHourObject(target, {
                id: 0
                , dbid: $(e.currentTarget).attr('id')
            })
        },

        makeHourObject: function(e,data) {
          var _this = this

          data = data ? data : { id: 0, title: ""}
          var t = $(this.template(data))
          t.find('select').find('option[data_id="'+data.personid+'"]').attr('selected',true)
          if(data.hours) t.find('input').val(data.hours)
          t.hide().fadeIn('fast')
          e.find('.bod').append(t)
        },

        deleteHourObject: function(e) {

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

        deleteGrant: function(e) {
            var _this = this
            var id = decodeURIComponent(window.location.search.substring(1)).split('=')[1]
            console.log('Delete',id)
            
            if (window.confirm("Delete this Grant?")) {
                this.collection.deleteGrant(id,function(r) {
                    // _this.redirectClient('/list')
                    alert("This grant was deleted")
                },checkIfURL('gmaker'))
            } else {
                console.log("Canceled")
            }
            
        },

        redirectClient: function(path) {
            console.log("Trying to redirect to",path)
            window.location.replace(path)
        }

    });

})();
