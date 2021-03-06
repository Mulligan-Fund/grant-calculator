gc.Views = gc.Views || {};

(function() {
  "use strict";

  gc.Views.objectListView = Backbone.View.extend({
    events: {
      "click .new": "newObject",
      "click .submit": "submitForm",
      "click .del": "deleteObject",
      "click .del > a": "deleteObject",
      "change .role": "changeSalary",
      "change input": "unsavedNotice",
      "change select": "unsavedNotice"
    },

    template: {},

    initialize: function() {
      var _this = this;
      if ($(this.el).is("#objectlist")) {
        this.getClassifiers({}, function() {
          // console.log("Init obj",this.el)
          _this.template = _.template($("#objectTemplate").html());
          _this.getObjects();
        });
      }
    },

    newObject: function(e) {
      this.makeObject({
        name: "",
        salary: 0,
        id: 0
      });
    },

    makeObject: function(data) {
      var _this = this;
      var t = $(this.template(data));
      t.find("select")
        .find('option[data_id="' + data.title + '"]')
        .attr("selected", true);
      t.hide().fadeIn("fast");
      this.$el.prepend(t);
    },

    deleteObject: function(e) {
      var _this = this;
      console.log("Deleting object");
      var id = $(e.currentTarget)
        .siblings("form")
        .attr("obj_id");
      this.collection.deleteObject(id, function(r) {
        $(e.currentTarget)
          .parent(".object-container")
          .fadeOut(function(t) {
            $(t).remove();
          });
      });
      // this.collection.deleteObject(id,function(r) {
      //     $(e.currentTarget).parent('.object-container').fadeOut(function(t){
      //         $(t).remove();
      //     })
      // })
    },

    getClassifiers: function(e, cb) {
      this.collection.getRoleData({}, function(data) {
        var tt = data;
        var temp = $($("#objectTemplate")[0].innerHTML);

        var t = [];

        var fo = [];
        var no = [];
        var misc = [];

        for (var key in tt) {
          var src = String(tt[key].title);
          if (src.includes("Foundation")) {
            fo.push(tt[key]);
          } else if (src.includes("Foundation")) {
            no.push(tt[key]);
          } else {
            misc.push(tt[key]);
          }
        }

        t = [...fo, ...no, ...misc];

        $(temp)
          .find("option")
          .remove();
        for (var i in t) {
          $(temp)
            .find("select")
            .append(
              "<option data_id='" +
                t[i]._id +
                "' data_salary='" +
                t[i].salary +
                "'>" +
                t[i].title +
                "</option>"
            );
          if (i == data.length - 1) {
            $("#objectTemplate")[0].innerHTML = $(temp).html();
            cb();
          }
        }
      });
    },

    changeSalary: function(e) {
      var sal = $(e.currentTarget)
        .find("option:selected")
        .attr("data_salary");
      $(e.currentTarget)
        .siblings(".money")
        .children("input")
        .val(sal);
    },

    submitForm: function(e) {
      var _this = this;
      var t = {};
      var val;
      if (!$(e.currentTarget).prop("nodeName") == "A") return; // double exec for some reason
      $(e.currentTarget)
        .parent()
        .find("input, select")
        .each(function(e, i) {
          console.log("Submitting", i);
          if ($(i).prop("nodeName") == "SELECT") {
            val = $(i)
              .children("option:selected")
              .attr("data_id");
            t.title = val;
          } else {
            val = $(i).val();
          }
          t[$(i).attr("data_id")] = $(i).val();
        });
      t._id = $(e.currentTarget)
        .parent("form")
        .attr("obj_id");
      console.log("Submitting obj", t);
      this.collection.sendObject(t, function(data, status) {
        console.log(data, status);
        _this.unsavedNotice(e, true);
      });
    },

    // This fills in all the fields
    getObjects: function(context) {
      var _this = this;
      var t = {};
      this.collection.getObjectData({ list: true }, function(data) {
        t = data;
        for (var i in t) {
          if (typeof t[i].delete != "undefined" && t[i].delete == true)
            continue;
          _this.makeObject(t[i]);
        }
      });
    },

    unsavedNotice: function(e, saved) {
      console.log("changing", e);
      if (!saved) {
        $(e.currentTarget)
          .parent()
          .find(".unsaved")
          .removeClass("hide");
      } else {
        $(e.currentTarget)
          .parent()
          .find(".unsaved")
          .addClass("hide");
      }
    },

    formClear: function() {
      if (!this.cleared) {
        $(this.el)
          .find("#pinterestUsername")
          .html("");
        this.cleared = true;
      }
    },

    redirectClient: function(path) {
      console.log("Trying to redirect to", path);
      window.location.replace(path);
    }
  });
})();
