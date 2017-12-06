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

    	url: '/user',

        initialize: function() {

        },

        getUserStat: function() {
            var user = this.findWhere()
            return {
                user
            }
        },

        sendData: function(o,callback) {
            
        },

        login: function(o,callback) {
            var endpoint = this.url + "/login?"
            if(o.pinUser) endpoint += "username=" + o.pin_user + "&password=" + 
            console.log(endpoint)
            $.ajax({
                url : endpoint,
                type : 'PUT',
                dataType:'json',
                success : function(data) { 
                    callback()
                },
                error : function(request,error)
                {
                    console.log("Request: "+JSON.stringify(request));
                    callback()
                }
            });
        },

        getUserInfo: function(username,callback) {
            var endpoint = this.url + "/pin-exist?user=" + username
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
        },

        registerUserPinterestConfig: function(username,board,callback) {
            var endpoint = this.url + "/login?user=" + username + "&board=" + board
                $.ajax({

                url : endpoint,
                type : 'PUT',
                dataType:'json',
                success : function(data) {              
                    console.log("Updated")
                    callback()
                },
                error : function(request,error)
                {
                    console.log("Request: "+JSON.stringify(request));
                    callback()
                }
            });
        }


    });

})();