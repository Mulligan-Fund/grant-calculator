$(document).ready(function () {
    'use strict';
    checkAuth(function() {
		$.ajax({
            url : window.gc.api + '/admin/users',
            type : 'GET',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Access-Control-Allow-Origin': true
            },
            crossDomain: true,
            data: '',
            dataType:'json',
            success : function(data,status,xfr) {              
                console.log("Get Success",data,status,xfr)
                $('.admin').html(JSON.stringify(data))
            },
            error : function(request,error)
            {
                console.log("Err",error)
            }
            });
    });
});