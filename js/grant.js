gc.Models = gc.Models || {};
gc.Collections = gc.Collections || {};

(function() {
    "use strict";

    gc.Models.GrantModel = Backbone.Model.extend({
        initialize: function() {},

        defaults: {},

        validate: function(attrs, options) {},

        parse: function(response, options) {
            return response;
        }
    });

    gc.Collections.GrantCollection = Backbone.Collection.extend({
        url: window.gc.api + "/g/grant",
        maker: window.gc.api + "/g/maker",
        profile: window.gc.api + "/org",
        obj: window.gc.api + "/object",
        role: window.gc.api + "/role",
        lookup: {},

        initialize: function() {},

        getID: function(data, callback) {
            var _this = this;
            if (decodeURIComponent(window.location.search.substring(1)) == "") {
                this.sendData(
                    {},
                    function(data) {
                        location.href = location.href + "?id=" + data._id;
                        _this.setLocalLinks(data._id);
                    },
                    checkIfURL("gmaker"),
                    checkIfURL("profile")
                );
            } else {
                _this.setLocalLinks(
                    window.location.search.substring(0).split("?id=")[1]
                );
            }
        },

        setLocalLinks: function(id) {
            $(".local").each(function(e, v) {
                console.log("local", v);
                var cur = $(v).attr("href");
                $(v).attr("href", cur + "?id=" + id);
            });
        },

        getAllGrants: function(data, callback) {},

        sendData: function(data, callback, maker, org) {
            console.log("Data got to", data);
            if (getUrlParameter("id")) data._id = getUrlParameter("id");
            $.ajax({
                url: maker ? this.maker : org ? this.profile : this.url,
                type: "PUT",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Access-Control-Allow-Origin": true
                },
                crossDomain: true,
                dataType: "json",
                data: data,
                success: function(data, status, xfr) {
                    console.log("Put Success: ", data, status, xfr);
                    callback(data, null);
                },
                error: function(request, error) {
                    console.log(
                        "Put Error: ",
                        JSON.stringify(data),
                        JSON.stringify(request)
                    );
                    callback(null, error);
                }
            });
        },

        getData: function(data, callback, maker, org) {
            // var endpoint = maker ? this.maker : this.url
            var data = data || {};
            if (getUrlParameter("id") && typeof data.id == "undefined")
                data.id = getUrlParameter("id");
            $.ajax({
                url: maker ? this.maker : org ? this.profile : this.url,
                type: "GET",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Access-Control-Allow-Origin": true
                },
                crossDomain: true,
                data: data,
                dataType: "json",
                success: function(data, status, xfr) {
                    // console.log("Get Success",data,status,xfr)
                    callback(data);
                },
                error: function(request, error) {
                    // alert("Get Error: "+JSON.stringify(request));
                    callback("err", error);
                }
            });
        },

        getTemplate: function(data, callback, maker) {
            // var endpoint = maker ? this.maker : this.url
            var data = data || {};
            if (getUrlParameter("id")) data.id = getUrlParameter("id");
            $.ajax({
                url: maker
                    ? window.gc.api + "/template/maker"
                    : window.gc.api + "/template/seeker",
                type: "GET",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Access-Control-Allow-Origin": true
                },
                crossDomain: true,
                data: data,
                dataType: "json",
                success: function(data, status, xfr) {
                    // console.log("Get Success",data,status,xfr)
                    callback(data);
                },
                error: function(request, error) {
                    // alert("Get Error: "+JSON.stringify(request));
                    callback("err", error);
                }
            });
        },

        sendObject: function(data, callback) {
            console.log("Data got to", data);
            if (getUrlParameter("id")) data._id = getUrlParameter("id");
            $.ajax({
                url: this.obj,
                type: "PUT",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Access-Control-Allow-Origin": true
                },
                crossDomain: true,
                dataType: "json",
                data: data,
                success: function(data, status, xfr) {
                    console.log("Put Success: ", data, status, xfr);
                    callback(data);
                },
                error: function(request, error) {
                    console.log(
                        "Put Error: ",
                        JSON.stringify(data),
                        JSON.stringify(request)
                    );
                    callback(error);
                }
            });
        },

        deleteObject: function(id, callback) {
            var endpoint = this.obj;
            var data = {
                _id: id,
                delete: true
            };
            $.ajax({
                url: this.obj,
                type: "PUT",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Access-Control-Allow-Origin": true
                },
                crossDomain: true,
                dataType: "json",
                data: data,
                success: function(data, status, xfr) {
                    callback(data);
                },
                error: function(request, error) {
                    // alert("Get Error: "+JSON.stringify(request));
                    callback();
                }
            });
        },

        getObjectData: function(data, callback) {
            var endpoint = this.obj;
            var _this = this;
            var data = data || {};

            if (getUrlParameter("id")) data.id = getUrlParameter("id");
            // if(this.lookup)
            $.ajax({
                url: endpoint,
                type: "GET",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Access-Control-Allow-Origin": true
                },
                crossDomain: true,
                data: data,
                dataType: "json",
                success: function(data, status, xfr) {
                    console.log("Get Success", data, status, xfr);
                    for (var t in data) {
                        _this.lookup[data[t]._id] = data[t].name;
                        data[t].id = data[t]._id;
                    }

                    callback(data);
                },
                error: function(request, error) {
                    // alert("Get Error: "+JSON.stringify(request));
                    callback();
                }
            });
        },

        deleteGrant: function(id, callback, maker) {
            var endpoint = maker ? this.maker : this.url;
            $.ajax({
                url: endpoint,
                type: "DELETE",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Access-Control-Allow-Origin": true
                },
                crossDomain: true,
                data: { id: id },
                dataType: "json",
                success: function(data, status, xfr) {
                    callback(data);
                },
                error: function(request, error) {
                    // alert("Get Error: "+JSON.stringify(request));
                    callback();
                }
            });
        },

        getRoleData: function(data, callback) {
            var endpoint = this.role;
            var data = data || {};
            if (getUrlParameter("id")) data.id = getUrlParameter("id");
            $.ajax({
                url: endpoint,
                type: "GET",
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    "Access-Control-Allow-Origin": true
                },
                crossDomain: true,
                data: data,
                dataType: "json",
                success: function(data, status, xfr) {
                    // console.log("Get Success",data,status,xfr)
                    callback(data);
                },
                error: function(request, error) {
                    // alert("Get Error: "+JSON.stringify(request));
                    callback();
                }
            });
        }
    });
})();
