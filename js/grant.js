gc.Models = gc.Models || {};
gc.Collections = gc.Collections || {};

(function () {
    'use strict';

    gc.Models.GrantModel = Backbone.Model.extend({

        initialize: function() {
            
        },

        defaults: {

        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

    gc.Collections.GrantCollection = Backbone.Collection.extend({

    	url: window.gc.api + '/grant',
        obj: window.gc.api + '/object',
        role: window.gc.api + '/role',


        initialize: function() {    
        },

        getID: function(data,callback) {
            if(decodeURIComponent(window.location.search.substring(1)) == "") {
                this.sendData({},function(data){
                    location.href = location.href + '?id='+data._id
                })
            }
        },

        getAllGrants: function(data,callback) {

        },

        sendData: function(data,callback) {
            console.log("Data got to",data)
            if(getUrlParameter('id')) data._id = getUrlParameter('id')
            $.ajax({
                url : this.url,
                type : 'PUT',
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    'Access-Control-Allow-Origin': true
                },
                crossDomain: true,
                dataType:'json',
                data: data,
                success : function(data,status,xfr) {              
                    console.log("Put Success: ",data,status,xfr)
                    callback(data)
                },
                error : function(request,error)
                {
                    console.log("Put Error: ",JSON.stringify(data),JSON.stringify(request));
                    callback(error)
                }
            });
        },

        getData: function(data,callback) {
            var endpoint = this.url
            var data = data || {};
            if(getUrlParameter('id')) data.id = getUrlParameter('id');
            $.ajax({
            url : endpoint,
            type : 'GET',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Access-Control-Allow-Origin': true
            },
            crossDomain: true,
            data: data,
            dataType:'json',
            success : function(data,status,xfr) {              
                console.log("Get Success",data,status,xfr)
                callback(data)
            },
            error : function(request,error)
            {
                // alert("Get Error: "+JSON.stringify(request));
                callback()
            }
            });
        },

        getObjectData: function(data,callback) {
            var endpoint = this.obj
            var data = data || {};
            if(getUrlParameter('id')) data.id = getUrlParameter('id');
            $.ajax({
            url : endpoint,
            type : 'GET',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Access-Control-Allow-Origin': true
            },
            crossDomain: true,
            data: data,
            dataType:'json',
            success : function(data,status,xfr) {              
                console.log("Get Success",data,status,xfr)
                callback(data)
            },
            error : function(request,error)
            {
                // alert("Get Error: "+JSON.stringify(request));
                callback()
            }
            });
        },

        getRoleData: function(data,callback) {
            var endpoint = this.role
            var data = data || {};
            if(getUrlParameter('id')) data.id = getUrlParameter('id');
            $.ajax({
            url : endpoint,
            type : 'GET',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Access-Control-Allow-Origin': true
            },
            crossDomain: true,
            data: data,
            dataType:'json',
            success : function(data,status,xfr) {              
                console.log("Get Success",data,status,xfr)
                callback(data)
            },
            error : function(request,error)
            {
                // alert("Get Error: "+JSON.stringify(request));
                callback()
            }
            });
        }


    });

})();