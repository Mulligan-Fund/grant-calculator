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

        initialize: function() {
            this.at(0).get('_id')
        },

        sendData: function(data,callback) {
            console.log("Data got to",data)
            $.ajax({
                url : this.url,
                type : 'PUT',
                xhrFields: {
                    withCredentials: true
                },
                dataType:'json',
                data: data,
                success : function(data,status,xfr) {              
                    console.log("Put Success: ",data,status,xfr)
                    this.at(0)
                    callback()
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
            type : 'GET',
            xhrFields: {
                withCredentials: true
            },
            dataType:'json',
            success : function(data,status,xfr) {              
                console.log("Get Success",data,status,xfr)
                callback(data,)
            },
            error : function(request,error)
            {
                alert("Get Error: "+JSON.stringify(request));
            }
            });
        }

    });

})();