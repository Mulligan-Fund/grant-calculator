gc.Models = gc.Models || {};
gc.Collections = gc.Collections || {};

(function () {
    'use strict';

    gc.Models.UserModel = Backbone.Model.extend({

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

    gc.Collections.UserCollection = Backbone.Collection.extend({

    	url: window.gc.api + '/auth',

        initialize: function() { 

        },

        sendData: function(data,callback) {
            console.log("Data got to",data)
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
                    console.log("Put Success: ", data, status, xfr)
                    callback(data,status)
                },
                error : function(request,error)
                {
                    console.log("Put Error: ",JSON.stringify(data),JSON.stringify(request));
                    callback()
                }
            });
        },

        getData: function(username,callback) {
            var endpoint = this.url
            $.ajax({
            url : endpoint,
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Access-Control-Allow-Origin': true
            },
            crossDomain: true,
            type : 'GET',
            dataType:'json',
            success : function(data,status,xfr) {              
                console.log("Get Success",data,status,xfr)
                callback(data,)
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