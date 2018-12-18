gc.Views = gc.Views || {};

(function() {
    "use strict";

    gc.Views.listView = Backbone.View.extend({
        events: {
            "click .del": "deleteObject"
        },
        seeker: null,
        maker: null,
        org: null,

        template: _.template(
            "<a href='<%= path %>?id=<%= _id %>'><div class='item'><div class='name'><%= funder %></div> <div class='amount'>$<%= amount %></div></div></a>"
        ),
        profile: _.template(
            "<a href='<%= path %>?id=<%= _id %>'><div class='item'><div class='name'><%= funder %></div> <div class='amount'><%= type %></div></div></a>"
        ),

        initialize: function() {
            this.seeker = $("#seeker");
            this.maker = $("#maker");
            this.org = $("#profile");
            var _this = this;
            console.log(this.seeker, this.maker);
            if ($(_this.seeker).is("#seeker")) {
                this.getProfile(_this.org);
                this.getObjectList();
            }
        },

        getProfile: function(t) {
            var _this = this;
            this.collection.getData(
                { list: true },
                function(data) {
                    if (data.length < 1) {
                        console.log("No profile details");
                        t.html(
                            "<a class='button' href='./profile'>Create profile</a>"
                        );
                    }
                    $.each(data, function(e, i) {
                        i.funder = i.username || "No User Name";
                        i.type = i.grantorg || "INCOMPLETE";
                        i.path = "profile";
                        t.append(_this.profile(i));
                    });
                    if (data[0].grantorg.indexOf("aker") > 0) {
                        _this.getItems(_this.maker);
                    } else if (data[0].grantorg.indexOf("eeker") > 0) {
                        _this.getItems(_this.seeker);
                    }
                },
                false,
                true
            );
        },

        getItems: function(t) {
            var _this = this;
            console.log("Get item pass", t);
            t.parent().show();
            this.collection.getData(
                { list: true },
                function(data) {
                    if (data.length < 1) {
                        if (t.is("#maker")) {
                            t.html(
                                "Once created, your Grant Makers will appear here."
                            );
                        } else {
                            t.html(
                                "Once created, your Grant Applications will appear here."
                            );
                        }
                    }
                    $.each(data, function(e, i) {
                        i.funder = t.is("#maker")
                            ? i.program_name || "No Grant Name"
                            : i.funder || "No Funder Name";
                        i.amount = t.is("#maker")
                            ? i.amount_of_grants || 0
                            : i.amount || "0";
                        i.path = t.is("#maker") ? "gmaker" : "form";
                        t.append(_this.template(i));
                    });
                },
                t.is("#maker")
            );
        },

        getObjectList: function(context) {
            var _this = this;
            var t = {};
            this.collection.getObjectData({ list: true }, function(data) {
                console.log("obj list data", data);
                if (data.length < 1) {
                    $(".objlist").html(
                        "Add your team first in order to assign them to grant tasks."
                    );
                }
                var count = 0;
                for (var t in data) {
                    if (t.delete == true) return;
                    $(".objlist ul").append("<li>" + data[t].name + "</li>");
                    count += 1;
                    if (count >= 12) {
                        $(".objlist ul").append(
                            "<br>plus " +
                                (data.length - count) +
                                " more people."
                        );
                        break;
                    }
                }
            });
        },

        redirectClient: function(path) {
            window.location.href = path;
        }
    });
})();
