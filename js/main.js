/*global gc, $*/


window.gc = {
    auth: false,
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Init: {},

    home: 'http://127.0.0.1:4000/grant-calculator/',
    api: 'http://127.0.0.1:3000',
    
    init: function () {
        'use strict';

        this.Init.User = new this.Collections.UserCollection({
                model: new this.Models.UserModel()
            });

        this.Init.Grant = new this.Collections.GrantCollection({
                model: new this.Models.GrantModel()
            });

        this.Init.Login = new this.Views.formView({
        	el:'.login',
            collection: this.Init.User,
        });

        this.Init.Form = new this.Views.formView({
            el:'.page',
            collection: this.Init.Grant
        });

        _.each(this.Init, function(v){
            v.initialize();
        })

    },

};

$(document).ready(function () {
    'use strict';
    $('button').on('click',function(e){
    	e.preventDefault()
    })
    checkAuth(function() {
        gc.init();
    });
});

function checkAuth(callback) {
    if(window.location.href !== window.gc.home) {
        $.ajax({
            url : window.gc.api + '/auth',
            type : 'GET',
            xhrFields: {
                withCredentials: true
            },
            success : function(data,status,xfr) {              
                console.log("Authenticated");
                callback()
            },
            error : function(request,error)
            {
                if(window.location.href !== window.gc.home) window.location.replace(window.gc.home)
                else console.log("Already logged out")
            }
        });
    } else {
        callback()
    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};