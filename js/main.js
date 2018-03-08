/*global gc, $*/


// TODO: Make dynamic. Basically just checking if there's a port...
var getCientPath = function getCientPath() {
    if(window.location.href.split('/')[2].indexOf(':') > 0) {
        return 'http://127.0.0.1:4000/grant-calculator/'
    } else {
        return 'https://mulligan-fund.github.io/grant-calculator/'
    }
};

var getAPIPath = function getAPIPath() {
    if(window.location.href.split('/')[2].indexOf(':') > 0) {
        return 'http://127.0.0.1:3000'
    } else {
        return 'https://grantcalc.herokuapp.com'
    }
}

var checkIfURL = function checkIfURL(path) {
    return window.location.href.indexOf(path) > -1 ? true : false
}

function checkAuth(callback) {
    console.log("Checking auth")
    if(checkIfURL('about')) return
    if(checkIfURL('contact')) return

    $.ajax({
        url : window.gc.api + '/auth',
        type : 'GET',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Access-Control-Allow-Origin': true
        },
        crossDomain: true,  
        success : function(data,status,xfr) {              
            console.log("Authenticated",data);
            if(window.location.href == window.gc.home) window.location.replace(window.gc.home+'/list')
            callback()
        },
        error : function(request,error)
        {
            if(window.location.href !== window.gc.home) window.location.replace(window.gc.home)
            else console.log("Already logged out")
            callback()
        }
    });
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

window.gc = {
    auth: false,
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Init: {},

    home: getCientPath(),
    api: getAPIPath(),
    
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

        this.Init.List = new this.Views.listView({
            el:null,
            collection: this.Init.Grant
        });

        this.Init.objectList = new this.Views.objectListView({
            el:'#objectlist',
            collection: this.Init.Grant
        });

        this.Init.resultView = new this.Views.resultView({
            el:'.resultblock',
            collection: this.Init.Grant
        });

        _.each(this.Init, function(v){
            // v.initialize();
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