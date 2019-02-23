gc.Views = gc.Views || {};

(function() {
  "use strict";

  gc.Views.formView = Backbone.View.extend({
    events: {
      "click .submit": "submitForm",
      "focusout .live": "submitField",
      "change select.live": "submitField",
      "blur .live": "submitField",
      "click .turn": "pageTurn",
      "click .people-button": "newHourObject",
      "click .delete": "deleteGrant",
      "click .login-toggle": "tab",
      "click #consent": "activateButton",
      "click .ppllistdel": "deleteHourObject",
      "change #templateselect": "selectTemplate",
      "click #template-open": "showForm",
      "click #loadwizard": "selectFromWizard"
    },
    template: {},
    templates: [],
    wizardSelect: [
      {
        cost: "50",
        type: "project",
        new: "new",
        id: "5c3c073bcbb6db0004bbb8bc"
      },
      {
        cost: "100",
        type: "project",
        new: "new",
        id: "5c3eb24b9951850004136f8e"
      },
      {
        cost: "250",
        type: "project",
        new: "new",
        id: "5c3eb8799951850004136f92"
      },
      {
        cost: "50",
        type: "operating",
        new: "new",
        id: "5c3eac289951850004136f8b"
      },
      {
        cost: "100",
        type: "operating",
        new: "new",
        id: "5c3eb4019951850004136f8f"
      },
      {
        cost: "250",
        type: "operating",
        new: "new",
        id: "5c3eb9aa9951850004136f93"
      },
      {
        cost: "50",
        type: "project",
        new: "renew",
        id: "5c3eaf829951850004136f8c"
      },
      {
        cost: "100",
        type: "project",
        new: "renew",
        id: "5c3eb5339951850004136f90"
      },
      {
        cost: "250",
        type: "project",
        new: "renew",
        id: "5c3ebad39951850004136f94"
      },
      {
        cost: "50",
        type: "operating",
        new: "renew",
        id: "5c3eb15d9951850004136f8d"
      },
      {
        cost: "100",
        type: "operating",
        new: "renew",
        id: "5c3eb7329951850004136f91"
      },
      {
        cost: "250",
        type: "operating",
        new: "renew",
        id: "5c3ebbfb9951850004136f95"
      }
    ],
    initialize: function() {
      var _this = this;
      if ($(this.el).hasClass("page")) {
        // console.log("Init form", this.el);
        this.collection.getID();
        _this.template = _.template($("#ppllistTemplate").html());
        this.getObjectList(function() {
          // console.log("Getting called");
          _this.getFields();
        });
        _this.getTemplateList();
        _this.listenTo("click .delete", _this.deleteGrant);
      }
    },

    activateButton: function(e) {
      // console.log("Activating register");
      if (
        $("#consent")
          .find("input")
          .is(":checked")
      )
        $("#loginreg").prop("disabled", false);
      else $("#loginreg").prop("disabled", true);
    },

    showForm: function() {
      $("#wizard").hasClass("show")
        ? $("#wizard").removeClass("show")
        : $("#wizard").addClass("show");
    },

    selectFromWizard: function() {
      var cost = $("#wiz-amount")
        .find("option:selected")
        .val();
      var type = $("#wiz-type")
        .find("option:selected")
        .val();
      var isnew = $("#wiz-new")
        .find("option:selected")
        .val();

      var id = this.wizardSelect.filter(item => {
        if (item.cost === cost && item.type === type && item.new === isnew)
          return item.id;
      });
      if (id.length > 0) {
        id = id[0].id;
      } else {
        alert("Error: No template found");
        return;
      }
      this.selectTemplate(null, id);
    },

    tab: function(e) {
      var t = $(e.currentTarget).find(".active");
      var n = t.siblings();
      n.addClass("active");
      t.removeClass("active");
      if (n.hasClass("log")) {
        $("#consent").hide();
        $("#loginreg").prop("disabled", false);
        $("#loginreg").html("Login");
        $("#forgot").show();
      } else {
        $("#consent").show();
        $("#forgot").hide();
        $("#loginreg").html("Register");
        if (
          !$("#consent")
            .find("input")
            .is(":checked")
        )
          $("#loginreg").prop("disabled", true);
      }
    },

    submitAll: function() {
      $(".live").each(function(i) {
        // console.log("Submitting all");
        $(this).trigger("focusout");
      });
    },

    // This stupid function handles the register/password flow.
    // Why it's here. Honestly. I have no good excuse.
    submitForm: function(e) {
      var _this = this;
      var l = $(this.el).find("input").length;
      var t = {};

      $(this.el)
        .find("input")
        .each(function(e, i) {
          t[$(i).attr("id")] = $(i).val();
        });
      this.collection.sendData(
        t,
        function(data, status) {
          // Redirect
          if (String(data).match("/")) {
            console.log("Redirecting");
            window.location.replace(data);
          }
        },
        checkIfURL("gmaker"),
        checkIfURL("profile")
      );
    },

    // This handles everything else.
    submitField: function(e) {
      var _this = this;
      // console.log("Field submit");
      var t = $(e.currentTarget);
      var i = {};
      var val = "";
      t.parent()
        .find(".load")
        .addClass("show");
      if ($(t).prop("nodeName") == "SELECT") {
        val = $(t)
          .children("option:selected")
          .attr("data_id");
        // console.log("gotval select", val);
      } else {
        val = t.val();
      }
      // Handle ppl list info
      if (t.hasClass("ppl")) {
        var f = t.parent();
        var bod = f.parent();
        var pa = [];
        bod.find(".time").each(function(i, e) {
          //   console.log("LOG", e);
          var personid = $(e)
            .find(".objlist")
            .find("option:selected")
            .attr("data_id");
          var hours = $(e)
            .find(".hours")
            .val();
          // console.log("person:", personid, hours);
          var tt = {
            person: personid,
            hours: hours
          };
          // console.log("Input ppllist", i, tt);
          pa.push(tt);
        });
        var ttt = $(e.currentTarget).attr("ID");
        i[ttt] = pa;
        // console.log("Handling ppl", i);
      } else {
        i[t.attr("id")] = val;
      }

      this.collection.sendData(
        i,
        function(data, error) {
          if (error) {
            console.log("Some kind of error");
          }
          t.parent()
            .find(".load")
            .removeClass("show");
          // <div className="remove"></div>Class("show");
        },
        checkIfURL("gmaker"),
        checkIfURL("profile")
      );
    },

    // This fills in all the fields
    getFields: function(context, varid, cb, template) {
      var _this = this;
      var cb = cb || function() {};
      var template = template || false;
      var t = {};
      var d = {};
      if (typeof varid !== "undefined") {
        d.id = varid;
        console.log("Override field:", d);
      }
      this.collection.getData(
        d,
        function(data) {
          _this.populateFields(
            data,
            function() {
              cb();
            },
            template
          );
        },
        checkIfURL("gmaker"),
        checkIfURL("profile")
      );
    },

    populateFields: function(data, cb, template) {
      var _this = this;
      var template = template || false;
      var t = data;
      var cb = cb || function() {};
      $(".page").each(function(z, x) {
        $(x)
          .find("form")
          .each(function(o, p) {
            // console.log("Pop page",o)

            $(p)
              .find("input")
              .each(function(e, i) {
                if (
                  template &&
                  $(i)
                    .parent()
                    .hasClass("notemplate")
                ) {
                  return;
                }
                var id = $(i).attr("id");
                // console.log(id,t[id])
                $("#" + id).val(t[id]);
              });

            $(p)
              .find("select")
              .each(function(e, i) {
                if (
                  template &&
                  $(i)
                    .parent()
                    .hasClass("notemplate")
                ) {
                  return;
                }
                var id = $(i).attr("id");
                // console.log(id,t[id])
                // console.log("Trying to set attr",'option[data_id="'+ data[id] +'"]')
                $("#" + id)
                  .children('option[data_id="' + t[id] + '"]')
                  .attr("selected", true);
              });

            $(p)
              .find(".peoplelist")
              .each(function(e, i) {
                if (
                  template &&
                  $(i)
                    .parent()
                    .hasClass("notemplate")
                ) {
                  return;
                }
                var id = $(i).attr("id");
                _this.getFieldArray(id, t);
              });
          });
      });
      cb();
    },

    // These handle the people list
    getFieldArray: function(id, data) {
      var _this = this;
      // if(data[id].length > 0) console.log("GetFieldArray",id,data[id])
      $.each(data[id], function(e, i) {
        // console.log("GetFieldArray",e,i)
        // console.log("getFieldArray", e, i);
        if (i != null) {
          _this.makeHourObject($("#" + id), {
            id: e,
            dbid: String(id), //+ "_" + String(e),
            personid: i.person,
            hours: i.hours
          });
        }
      });
    },

    newHourObject: function(e) {
      var target = $(e.currentTarget).parent();
      this.makeHourObject(target, {
        id: 0,
        dbid: $(e.currentTarget).attr("id")
      });
    },

    makeHourObject: function(e, data) {
      var _this = this;

      data = data ? data : { id: 0, title: "" };
      var t = $(this.template(data));
      t.find(".objlist")
        .find('option[data_id="' + data.personid + '"]')
        .attr("selected", true);
      if (data.hours) t.find("input").val(data.hours);
      t.hide().fadeIn("fast");
      e.find(".bod").append(t);
    },

    deleteHourObject: function(e) {
      var target = $(e.currentTarget).parent();
      var delid = target.attr("db_id");
      this.deleteField(target, delid, function() {
        target.remove();
      });
    },

    deleteField: function(e, delid, callback) {
      var _this = this;
      var i = {};

      var bod = e.parent();
      // console.log("bod", bod);
      var pa = [];
      bod.find(".time").each(function(i, e) {
        // console.log(delid,i)
        var tt = null;
        if (delid != i) {
          tt = {
            person: $(e)
              .find(".objlist")
              .children("option:selected")
              .attr("data_id"),
            hours: $(e)
              .find(".hours")
              .val()
          };
        }
        // console.log("time item", tt);
        pa.push(tt);
      });
      i[bod.parent().attr("id")] = pa;
      // console.log("Del ppl", i);

      this.collection.sendData(
        i,
        function(data, next) {
          callback();
        },
        checkIfURL("gmaker"),
        checkIfURL("profile")
      );
    },

    // This populates dynamic fields
    getObjectList: function(callback) {
      var _this = this;
      var t = {};
      this.collection.getObjectData({ list: true, global: true }, function(
        data
      ) {
        // console.log("obj list data",data)
        $(".objlist").each(function(i, l) {
          $(l)
            .find("option")
            .remove();
          $(l).append(
            '<option value="" selected disabled hidden>Select Team Member</option>'
          );

          data.sort(function(a, b) {
            if (a.name.includes("eg:")) return 1;
            return -1;
          });

          for (var t in data) {
            $(l).append(
              "<option data_id='" +
                data[t]._id +
                "''>" +
                data[t].name +
                "</option>"
            );
          }
        });
        // console.log("Finished setting objects", callback);
        if (callback) callback();
        _this.template = _.template($("#ppllistTemplate").html());
      });
    },

    // This populates template fields
    getTemplateList: function(context) {
      var _this = this;
      var t = {};
      this.collection.getTemplate(
        {},
        function(data) {
          // console.log("template list data", data);
          _this.templates = data;
          $("#templateselect").each(function(i, l) {
            $(l)
              .find("option")
              .remove();
            $(l).append(
              '<option value="" selected disabled hidden>Choose a template</option>'
            );

            for (var t in data) {
              var lt = data[t].program_name || data[t].funder;
              $(l).append(
                "<option data_id='" + data[t]._id + "''>" + lt + "</option>"
              );
            }
          });
          _this.template = _.template($("#ppllistTemplate").html());
        },
        checkIfURL("gmaker"),
        false
      );
    },

    selectTemplate: function(e, id) {
      var _this = this;
      var check = confirm(
        "This will replace all fields with the template. This can't be undone."
      );
      if (check) {
        if (id) {
          var selectedId = id;
        } else {
          var selectedId = $(e.currentTarget)
            .children("option:selected")
            .attr("data_id");
        }
        console.log("SelectedId", selectedId);
        _this.populateTemplate(selectedId);
      }
    },

    populateTemplate: function(id) {
      var _this = this;
      this.getFields(
        null,
        id,
        function() {
          _this.submitAll();
        },
        true // This is the notemplate call
      );
    },

    pageTurn: function(e) {
      // console.log("Turning page", e);
      if ($(e.currentTarget).hasClass("next")) {
        // console.log("Next page");
        $(".page.show")
          .removeClass("show")
          .next()
          .addClass("show");
      } else {
        // console.log("prev page");
        $(".page.show")
          .removeClass("show")
          .prev()
          .addClass("show");
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

    deleteGrant: function(e) {
      var _this = this;
      var id = decodeURIComponent(window.location.search.substring(1)).split(
        "="
      )[1];
      console.log("Delete", id);

      if (window.confirm("Delete this Grant?")) {
        this.collection.deleteGrant(
          id,
          function(r) {
            // _this.redirectClient('/list')
            alert("This grant was deleted");
          },
          checkIfURL("gmaker"),
          checkIfURL("profile")
        );
      } else {
        console.log("Canceled");
      }
    },

    redirectClient: function(path) {
      console.log("Trying to redirect to", path);
      window.location.replace(path);
    }
  });
})();
