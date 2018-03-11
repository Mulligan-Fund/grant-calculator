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

        makerCalcExpected: function(d) {
            console.log("d",d)
            return (d.amount_of_grants / d.number_of_grants) * (d.number_of_grants / d.number_of_applications)
        },

        makerProgramCost: function(progcost, grantcost) {
            return grantcost - progcost;
        },




        // For Grant Seeker

        calculateExpected: function(data) {
            return data.amount * (data.probability*.01)
        },

        calculateCost: function(data){
            var total = 0;
            _.each(data,function(val,key,context){
                console.log("test calc cost",val)
                total += (val.salary/365)*val.time
            })
            return total;
        },

        calculateNet: function(data,cost) {
            return this.calculateExpected(data) - cost
        },

        // This fills in all the fields
        getFields:  function(context){
            var _this = this
            var t = {}
            var hr = {}
            var ro = []
            this.collection.getData( {}, function(data){
                t = data
                console.log(t)
                _this.collection.getObjectData({list:true}, function(roles){
                    ro = roles
                    console.log("Roles",ro)

                     _.each(t,function(val,key,context) {
                        if(typeof val == "object" && val.length > 0) {
                            var id = key
                            console.log("Found ppllist", val)
                            $.each(val,function(i,e){
                                // console.log('vv',i,e)
                                var person = _.findWhere(ro, {'_id': e.person })
                                // if(person == null) return
                                hr[id+"_"+i] = { 
                                    time: e.hours
                                    , salary: person.salary
                                    } 
                            })
                            if(typeof t[id] !== 'undefined') {
                                var person = _.findWhere(ro, {'_id': t[id]})
                                console.log("Person found",person)
                            }
                        }
                    })
                    console.log("Printing HR",hr)
                    _.each(hr,function(val,key,context){
                        console.log('printing',val.time+" * "+val.salary+" = "+(val.time*val.salary))
                        $('.details').append(key+" : "+val.time+" * "+val.salary+" = "+(val.time*val.salary)+"<br>")    
                    })


                    if(!checkIfURL("maker")) {
                        // Grant Seeker
                        var expect = _this.calculateExpected(t);
                        var cost = _this.calculateCost(hr)
                        var net = _this.calculateNet(t, cost)

                        $('#expected').append("$"+ _this.addComma(expect.toFixed(2)))
                        $('#cost').append("$"+ _this.addComma(cost.toFixed(2)))
                        $('#total').append("$"+ _this.addComma(net.toFixed(2)))
                    } else {
                        // Grant Maker
                        console.log("calling gmaker")
                        var expect = _this.makerCalcExpected(t);
                        var cost = _this.calculateCost(hr)
                        var pcost = _this.makerProgramCost(cost, expect)
                        console.log("gmaker",expect, cost, pcost)
                        $('#expected').append("$"+ _this.addComma(expect.toFixed(2)))
                        $('#cost').append("$"+ _this.addComma(cost.toFixed(2)))
                        $('#total').append("$"+ _this.addComma(pcost.toFixed(2)))
                    }
                })
           },checkIfURL("maker"))
        },

        getCount: function(data) {

        },

        addComma(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
