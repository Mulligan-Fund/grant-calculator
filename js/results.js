gc.Views = gc.Views || {};

(function() {
  "use strict";

  gc.Views.resultView = Backbone.View.extend({
    events: {
      "click .turn": "pageTurn"
    },
    initialize: function() {
      var _this = this;
      if ($(this.el).hasClass("resultblock")) {
        console.log("Init form", this.el);
        this.collection.getID();
        this.getObjectList();
        this.getFields();
      }
    },

    gm_seek_fields: [
      "gm_preliminary_rsch_people",
      "gm_loi_requirements",
      "gm_pre_loi_comm",
      "gm_draft_loi",
      "gm_proposal_requirements",
      "gm_pre_proposal_comm",
      "gm_pre_proposal_mtg",
      "gm_gather_docs",
      "prepare_budget",
      "gm_draft_proposal",
      "gm_format_app",
      "gm_gs_applications_other_label",
      "gm_gs_applications_other",
      "gm_follow_up_qs",
      "gm_site_visit",
      "gm_letter_signing",
      "gm_post_grant_comm",
      "gm_gs_compliance_other_label",
      "gm_gs_compliance_other",
      "gm_report_requirements",
      "gm_collect_data",
      "gm_prepare_financials",
      "gm_modifications",
      "gm_draft_report",
      "gm_monitoring_qs",
      "gm_gs_reporting_other_label",
      "gm_gs_reporting_other"
    ],

    gm_make_fields: [
      "rsch_issue",
      "comm_prog_goals",
      "guidelines",
      "program_loi",
      "prog_proposal_req",
      "field_loi_q",
      "review_submitted_lois",
      "decide_invite",
      "invite_proposal",
      "field_proposal_q",
      "gm_prog_applications_other_label",
      "gm_prog_applications_other",
      "review_submitted_proposals",
      "due_diligence",
      "ask_proposal_q",
      "prog_site_visits",
      "follow_up_visit",
      "decide_recommend",
      "schedule_mtg",
      "prep_recommendations",
      "hold_mtg",
      "conduct_visits",
      "declines_awards",
      "accept_agreements",
      "release_funds",
      "post_grant_comm",
      "gm__prog_compliance_other_label",
      "gm__prog_compliance_other",
      "report_forms",
      "field_report_q",
      "review_submitted_reports",
      "ask_report_q",
      "approve_report",
      "release_addl_funds",
      "other_comm_reports",
      "grant_mods",
      "report_board",
      "gm_prog_reporting_other_label",
      "gm_prog_reporting_other",
      "additional_other_label",
      "gm_additional"
    ],

    gs_seek_fields: [
      "preliminary_rsch_people",
      "loi_requirements",
      "pre_loi_comm",
      "draft_loi",
      "proposal_requirements",
      "pre_proposal_comm",
      "pre_proposal_mtg",
      "gather_docs",
      "prepare_budget",
      "draft_proposal",
      "format_app",
      "gs_applications_other_label",
      "gs_applications_other",
      "follow_up_qs",
      "site_visit",
      "letter_signing",
      "post_grant_comm",
      "gs_compliance_other_label",
      "gs_compliance_other",
      "report_requirements",
      "collect_data",
      "prepare_financials",
      "modifications",
      "draft_report",
      "monitoring_qs",
      "gs_reporting_other_label",
      "gs_reporting_other",
      "gs_other_label",
      "gs_additional_other"
    ],

    // This populators dynamic fields
    getObjectList: function(context) {
      var _this = this;
      this.lookup = {};
      this.collection.getObjectData({ list: true }, function(data) {
        console.log("Populated object list");
      });
    },

    makerCalcExpected: function(d) {
      // console.log("d", d);
      return (
        (d.amount_of_grants / d.number_of_grants) *
        (d.number_of_grants / d.number_of_applications)
      );
    },

    makerProgramCost: function(progcost, grantcost) {
      return grantcost - progcost;
    },

    calculateCostForBothMaker: function(data) {
      var _this = this;
      var seekertotal = 0;
      var makertotal = 0;
      _.each(data, function(val, key, context) {
        // console.log("calboth", val, _this.gm_seek_fields.includes(val.name));
        if (_this.gm_seek_fields.includes(val.name)) {
          // console.log("test calc cost", val);
          seekertotal += (val.salary / 365) * val.time;
        } else if (_this.gm_make_fields.includes(val.name)) {
          makertotal += (val.salary / 365) * val.time;
        }
      });

      return { maker: makertotal, seeker: seekertotal };
    },

    // For Grant Seeker

    calculateExpected: function(data) {
      return data.amount * (data.probability * 0.01);
    },

    calculateSeekerCost: function(data) {
      var _this = this;
      var total = 0;
      _.each(data, function(val, key, context) {
        // console.log("test calc cost", val);
        if (_this.gs_seek_fields.includes(val.name)) {
          total += (val.salary / 365) * val.time;
        }
      });
      return total;
    },

    calculateNet: function(data, cost) {
      return this.calculateExpected(data) - cost;
    },

    // This fills in all the fields
    getFields: function(context) {
      var _this = this;
      var t = {};
      var hr = {};
      var ro = [];
      this.collection.getData(
        {},
        function(data) {
          t = data;
          console.log(t);
          _this.collection.getObjectData({ list: true, global: true }, function(
            roles
          ) {
            ro = roles;
            console.log(ro);

            _.each(t, function(val, key, context) {
              if (val == null) return;
              if (typeof val === "object" && val.length > 0) {
                var id = key;
                $.each(val, function(i, e) {
                  // console.log("Val", key, e, typeof e);
                  if (e === null) return;
                  if (typeof e.person === "undefined") return;
                  var person = _.findWhere(ro, { _id: e.person });
                  if (typeof person === "undefined") return;
                  hr[id + "_" + i] = {
                    name: id,
                    time: e.hours,
                    salary: person.salary
                  };
                });
                if (typeof t[id] !== "undefined") {
                  var person = _.findWhere(ro, { _id: t[id] });
                  console.log("Person found", person);
                }
              }
            });
            _.each(hr, function(val, key, context) {
              console.log(
                "printing",
                val.time + " * " + val.salary + " = " + val.time * val.salary
              );
              // $(".details").append(
              //   key +
              //     " : " +
              //     val.time +
              //     " * " +
              //     val.salary +
              //     " = " +
              //     val.time * val.salary +
              //     "<br>"
              // );
            });

            if (!checkIfURL("maker")) {
              // Grant Seeker
              var expect = _this.calculateExpected(t);
              var cost = _this.calculateSeekerCost(hr);
              var net = _this.calculateNet(t, cost);

              $("#expected").append("$" + _this.addComma(expect.toFixed(2)));
              $("#cost").append("$" + _this.addComma(cost.toFixed(2)));
              $("#total").append("$" + _this.addComma(net.toFixed(2)));
            } else {
              // Grant Maker
              // console.log("feed hr to calcboth", hr);
              // console.log("calcboth", _this.calculateCostForBothMaker(hr));
              // console.log("calling gmaker");

              var costToMaker = _this.calculateCostForBothMaker(hr);
              var expect = _this.makerCalcExpected(t);
              //var pcost = _this.makerProgramCost(cost, expect);
              var costmaker = costToMaker.maker;
              var costseeker = costToMaker.seeker;
              var pcost = costToMaker.seeker - expect;
              var costapplicant = 1;

              console.log(costToMaker);
              $("#expected").append("$" + _this.addComma(expect.toFixed(2)));
              $("#cost").append("$" + _this.addComma(costmaker.toFixed(2)));
              $("#total").append("$" + _this.addComma(pcost.toFixed(2)));
              $("#costgrant").append(
                "$" + _this.addComma(costseeker.toFixed(2))
              );
              $("#costmaker").append("$" + _this.addComma(pcost.toFixed(2)));
              $("#costapplicant").append(
                "$" + _this.addComma(costapplicant.toFixed(2))
              );
            }
          });
        },
        checkIfURL("maker")
      );
    },

    getCount: function(data) {},

    addComma(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    pageTurn: function(e) {
      console.log("Turning page", e);
      if ($(e.currentTarget).hasClass("next")) {
        console.log("Next page");
        $(".page.show")
          .removeClass("show")
          .next()
          .addClass("show");
      } else {
        console.log("prev page");
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

    redirectClient: function(path) {
      console.log("Trying to redirect to", path);
      window.location.replace(path);
    }
  });
})();
