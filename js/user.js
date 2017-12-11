gc.Models = gc.Models || {};

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

})();



gc.Collections = gc.Collections || {};

(function () {
    'use strict';

    gc.Collections.UserCollection = Backbone.Collection.extend({

        // model: peddler.Models.UserModel,

    	url: 'http://localhost:3000/auth',

        initialize: function() {

        },

        getUserStat: function() {
            var user = this.findWhere()
            return {
                user
            }
        },

        sendData: function(data,callback) {
            console.log("Data got to",data)
            $.ajax({
                url : this.url,
                type : 'PUT',
                dataType:'json',
                data: data,
                success : function(data) { 
                    console.log(data)
                    callback()
                },
                error : function(request,error)
                {
                    console.log("Request: ",JSON.stringify(data),JSON.stringify(request));
                    callback()
                }
            });
        },

        getData: function(username,callback) {
            var endpoint = this.url
            $.ajax({
            url : endpoint,
            type : 'GET',
            dataType:'json',
            success : function(data) {              
                console.log("returning data",data)
                callback(data)
            },
            error : function(request,error)
            {
                alert("Request: "+JSON.stringify(request));
            }
            });
        }

    });

})();