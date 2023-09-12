import { getServer } from "./environment.js";

$(document).ready(function () {
  runAsampleAPI();
});

var s = getServer();

function runAsampleAPI() {
  console.log(s)
  // $("#runSample").onload(function (e) {
  //   e.preventDefault();
  $("#errorresult").addClass("d-none");
  $.ajax({
    url:s+ "/api/v1/apiseccheck/results?project-name=Online%20Banking%20REST%20API%20zSBb",
    method: "GET",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    success: function (resultData) {
      // console.log('resultData', resultData);
      var viewResult = resultData;
      let apispecification = viewResult.data.openAPISpec;
      var name = viewResult.data.name;
      var APIdescription = viewResult.data.description;
      var score = viewResult.data.testSummary.overallScore;
      var totalEndpoints = viewResult.data.testSummary.totalEndpoints;
      // var dateTested = viewResult.data.dateTested
      var testEnvironment = viewResult.data.testSummary.testEnvironment;
      var vulnerabilityScore =
        viewResult.data.testSummary.vulnerabilityScore;
      var valueDataScore = viewResult.data.testSummary.valueDataScore;
      var configurationScore =
        viewResult.data.testSummary.configurationScore;
      var authenticationScore =
        viewResult.data.testSummary.authenticationScore;
      var dateString = viewResult.data.dateTested;
      var date = new Date(dateString);
      var formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      // console.log(formattedDate);

      var injectionsForEndpoints =
        viewResult.data.testSummary.injectionsForEndpoints;
      var sixXFuzz = viewResult.data.testSummary.sixXFuzz;
      var reflectedGetInjection =
        viewResult.data.testSummary.reflectedGetInjection;
      var reflectedPOSTInjection =
        viewResult.data.testSummary.reflectedPOSTInjection;
      var pii = viewResult.data.testSummary.pii;
      // var moneyRelated = viewResult.data.testSummary.moneyRelated;
      // var richContentUploads = viewResult.data.testSummary.richContentUploads;
      var sslCertificateIssues =
        viewResult.data.testSummary.sslCertificateIssues;
      var missingTLSHSTSHeaders =
        viewResult.data.testSummary.missingTLSHSTSHeaders;
      var serverPropertiesLeakInHeaders =
        viewResult.data.testSummary.serverPropertiesLeakInHeaders;
      var httpOptions = viewResult.data.testSummary.httpOptions;
      var corsConfig = viewResult.data.testSummary.corsConfig;
      var incrementalIDsForEndpoint =
        viewResult.data.testSummary.incrementalIDsForEndpoint;
      var noAuth = viewResult.data.testSummary.noAuth;
      var brokenAuthentication =
        viewResult.data.testSummary.brokenAuthentication;
      var basicAuthentication =
        viewResult.data.testSummary.basicAuthentication;
      //   barchart();
      if (APIdescription === "null") {
        $("#descriptionForAPI").text("No Description");
      } else {
        $("#descriptionForAPI").text(APIdescription);
      }
      $("#headingOne .btn").click(function() {
        console.log( $(this).find('.fas'))
        $(this).find('.fas').toggleClass("fa-plus fa-minus");
      });
      if (injectionsForEndpoints === "Passed") {
        $("#injection").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else if (injectionsForEndpoints === "Failed") {
        $("#injection").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (sixXFuzz === "Passed") {
        $("#6fuzz").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#6fuzz").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (reflectedGetInjection === "Passed") {
        $("#reflectedget").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#reflectedget").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (reflectedPOSTInjection === "Passed") {
        $("#reflectedpost").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#reflectedpost").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (pii === "Passed") {
        $("#piiData").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#piiData").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (sslCertificateIssues === "Passed") {
        $("#ssl").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#ssl").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (missingTLSHSTSHeaders === "Passed") {
        $("#missing").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#missing").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (serverPropertiesLeakInHeaders === "Passed") {
        $("#serverprop").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#serverprop").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (httpOptions === "Passed") {
        $("#httpoption").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#httpoption").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (corsConfig === "Passed") {
        $("#cors").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#cors").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (incrementalIDsForEndpoint === "Passed") {
        $("#incremental").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#incremental").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (noAuth === "Passed") {
        $("#noauth").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#noauth").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (brokenAuthentication === "Passed") {
        $("#brokenauth").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#brokenauth").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      if (basicAuthentication === "Passed") {
        $("#basicauth").html(
          '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
        );
      } else {
        $("#basicauth").html(
          '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
        );
      }

      $("#indexpageUI").hide().html();
      $("#indexpageUI").hide().html("#resultPageOnUI");
      $("#indexpageUI").addClass("d-none");
      $("#resultPageOnUI").removeClass("d-none");
      $("#dateTested").text(formattedDate);
      $("#apispecification").text(apispecification);
      $("#name").text(name);

      $("#totalEndpoints").text(totalEndpoints);
      $("#testEnvironment").text(testEnvironment);
      //   $("#overallScore").text(score);

      function barchart() {
        var xValues = [
          "Vulnerable",
          "Valuable",
          "Configuration",
          "Authentication",
        ];
        var yValues = [
          vulnerability,
          valueDataScore,
          configurationScore,
          authenticationScore,
        ];
        var barColors = ["#dec15a", "#d65745", "#72ba2c", "#d65745"];
        const backgroundColor = [];
        for (i = 0; i < yValues.length; i++) {
          if (yValues[i] >= 0 && yValues[i] < 49) {
            backgroundColor.push("green");
          }
          if (yValues[i] >= 50 && yValues[i] <= 75) {
            backgroundColor.push("yellow");
          }
          if (yValues[i] > 75) {
            backgroundColor.push("red");
          }
        }
        var ctx = document.getElementById("myChart").getContext("2d");
        var mychart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: xValues,
            fontColor: ["#dec15a"],
            datasets: [
              {
                data: yValues,
                backgroundColor: backgroundColor,
              },
            ],
          },

          options: {
            legend: { display: false },
            title: {
              display: true,
            },

            scales: {
              yAxes: [{ ticks: { min: 0, stepSize: 10, max: 100 } }],
            },
          },
        });
      }
    },
    error: function (xhr, status, error) {
      // Handle any API errors here
    },
  });
  // });
}