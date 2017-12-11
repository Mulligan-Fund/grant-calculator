/*global gc, $*/


window.gc = {
    auth: false,
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    Init: {},
    init: function () {
        'use strict';

        this.Init.User = new this.Collections.UserCollection({
                model: new this.Models.UserModel()
            });

        this.Init.Login = new this.Views.formView({
        	el:'.login',
            collection: this.Init.User,
        });

        this.Init.Form = new this.Views.formView({
            el:'.form',
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
    gc.init();
});
