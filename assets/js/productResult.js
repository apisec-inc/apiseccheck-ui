$(document).ready(function () {
  // runAsampleAPI();
  scan();
  fileupload();
  $("#apiurl").addClass("d-none");
  $("[rel=tooltip]").tooltip({ placement: "right" });
  // $.getJSON("https://api.ipify.org/?format=json", function (e) {
  //     // console.log(""e.ip);
  //     if (e.ip == '49.204.27.190') {
  //         console.log('this is APIsec Ip', e.ip);
  //         var ip = e.ip;
  //         $("ipAddress").text(ip)
  //     }
  // });
});

var isSubmitting = false;
$("#fileUploadModal").click(function () {
  $("#getFile").val = "";
  $("#fileUploadModal").removeClass("d-none");
  $(".modal-backdrop").addClass("d-none");
  $("body").addClass("modal-open");
  fileupload();
});
function scan() {
  $("#btn").click(function () {
    $("#Features").addClass("d-none");
    $("#testresultfree").addClass("d-none");
    $("#errorresult").addClass("d-none");
    $("#errorresult2").addClass("d-none");
    $("#errorresult1").addClass("d-none");

    var testStart = Date.now();
    var openAPISpectemp = $("#openAPISpec").val();
    var openAPISpec = openAPISpectemp.replace("getpostman", "postman");
    // $("#email").next().hide();
    $("#openAPISpec").next().hide();
    if (openAPISpec == "") {
      $(".invalid-tooltip").show();
      return false;
    }
    $(this).prop("disabled", true);
    $("#testresultfree").addClass("d-none");
    $(".testdomain").text(openAPISpec);
    $("#loadingresultfree").removeClass("d-none");
    $("#progressIcons").removeClass("d-none");
    $("#scantime").removeClass("d-none");

    // progressStats();
    // $('.report').hide();
    var jsonData = { openAPISpec: openAPISpec, isFileUpload: false };
    var hutk = document.cookie.replace(
      /(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    var HSData = {
      submittedAt: testStart,
      fields: [
        {
          objectTypeId: "0-1",
          name: "api_specification_url",
          value: openAPISpec,
        },
      ],
      context: {
        pageUri: window.location.href,
        pageName: "Free API Test",
        ipAddress: "{ip_address}",
      },
    };
    $.ajax({
      url: "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck",
      method: "POST",
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(jsonData),
      success: function (result) {
        if (result.errors === true) {
          errorDisplay();
        }
        function errorDisplay() {
          for (var i = 0; i < result.messages.length; i++) {
            if (result.messages[i].type == "ERROR") {
              keyMessage = result.messages[i].key;
              messageValue = result.messages[i].value;
              $("#keyerror").text(keyMessage);
              $("#errorvalue").html(messageValue);
            }
          }
          $("#errorresult").removeClass("d-none");
          $("#errorresult1").addClass("d-none");
          $("#messageValue").addClass("d-none");
          $("#loadingresultfree").addClass("d-none");
          $("#progressIcons").addClass("d-none");
          $("#scantime").addClass("d-none");
          $("#btn").prop("disabled", false);
          $("#openAPISpec").val("");
        }
        if (result.errors === false) {
          var intervalId = setInterval(function () {
            $.ajax({
              url:
                "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/status?project-name=" +
                result.data.name,
              method: "GET",
              dataType: "json",
              headers: {
                "Content-Type": "application/json",
              },

              success: function (testresult) {
                $("#errorresult").addClass("d-none");
                $("#messageValue").text(testresult.data);
                if (testresult.data == "API Security Test case Generation") {
                  $("#progre").removeClass("d-none");
                  $("#analyse").css("color", "#025c7a", "font-weight", "600");
                  $(".hr-line").css("border-bottom", "3px solid #025c7a");
                  $("#runasamplescan").addClass("d-none");
                }
                if (testresult.data == "Security Test Execution") {
                  $("#settingdark").css("filter", "none");
                  $("#generate").removeClass("d-none");
                  $("#generate").css("color", "#025c7a", "font-weight", "600");
                  $(".hr-line1").css("border-bottom", "3px solid #025c7a");
                }
                if (testresult.data == "Preparing Test Results") {
                  $("#targetNew").css("filter", "none");
                  $("#running").removeClass("d-none");
                  $("#running").css("color", "#025c7a", "font-weight", "600");
                  $(".hr-line2").css("border-bottom", "3px solid #025c7a");
                }
                if (
                  testresult.data ==
                  "Please check your OAS URL is valid, and the API is not too large."
                ) {
                  $("#openAPISpec").val("");
                  $("#btn").prop("disabled", false);
                  $("#loadingresultfree").addClass("d-none");
                  $("#progressIcons").addClass("d-none");
                  $("#errorresult2").removeClass("d-none");
                  clearInterval(intervalId);
                }
                if (testresult.data == "Scan completed") {
                  $("#reporticon").css("filter", "none");
                  $("#preparing").removeClass("d-none");
                  $("#preparing").css("color", "#025c7a", "font-weight", "600");
                  $("#openAPISpec").val("");
                  $("#btn").prop("disabled", false);
                  $("#loadingresultfree").addClass("d-none");
                  $("#progressIcons").addClass("d-none");
                  clearInterval(intervalId);
                  resultAPI();
                }
                // if (testresult.data == 'Please check your OAS URL is valid, and the API is not too large') {
                //     clearInterval(intervalId);
                // }

                // else if (testresult.data == 'Error occured during scan') {
                //     $('#loadingresultfree').addClass('d-none')
                // }
              },
              error: function (xhr, status, error) {
                // Handle any API errors here
              },
            });
          }, 10000);

          function resultAPI() {
            clearInterval(intervalId);
            $("#errorresult").addClass("d-none");
            $.ajax({
              url:
                "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/results?project-name=" +
                result.data.name,
              method: "GET",
              dataType: "json",
              headers: {
                "Content-Type": "application/json",
              },
              success: function (resultData) {
                var viewResult = resultData;
                var apispecification = viewResult.data.openAPISpec;
                var name = viewResult.data.name;
                var APIdescription = viewResult.data.description;
                var score = viewResult.data.testSummary.overallScore;
                var totalEndpoints = viewResult.data.testSummary.totalEndpoints;
                // var dateTested = viewResult.data.dateTested
                var testEnvironment =
                  viewResult.data.testSummary.testEnvironment;
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
                let mainURL = window.location.origin + "/productResult.html";
                let url2 = new URL(mainURL.replace("index.html", ""));
                url2.searchParams.set("project-name", name);
                window.location.replace(url2);
                // barchart();
                if (APIdescription === "null") {
                  $("#descriptionForAPI").text("No Description");
                } else {
                  $("#descriptionForAPI").text(APIdescription);
                }
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
                // if (reflectedGetInjection == 'Passed' || reflectedPOSTInjection == 'Passed') {

                //     $("#reflectedInject").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                // }
                // else if (reflectedGetInjection == 'Failed' && reflectedPOSTInjection == 'Failed') {
                //     $("#reflectedInject").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                // }
                // else {
                //     $("#reflectedInject").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                // }

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
                // let resultUrl = window.location.href;
                // resultUrl.searchParams.set("project-name", name);
                // console.log(resultUrl)
                // window.location.replace(url2)
                $("#indexpageUI").hide().html();
                $("#indexpageUI").hide().html("#resultPageOnUI");
                $("#indexpageUI").addClass("d-none");
                $("#resultPageOnUI").removeClass("d-none");

                $("#dateTested").text(formattedDate);
                $("#apispecification").text(apispecification);
                $("#name").text(name);

                $("#totalEndpoints").text(totalEndpoints);
                $("#testEnvironment").text(testEnvironment);
                // $("#overallScore").text(score);

                function barchart() {
                  var mychart;
                  var xValues = [
                    "Vulnerable",
                    "Valuable",
                    "Configuration",
                    "Authentication",
                  ];
                  var yValues = [
                    vulnerabilityScore,
                    valueDataScore,
                    configurationScore,
                    authenticationScore,
                  ];

                  // var barColors = ["#dec15a", "#d65745", "#72ba2c", "#d65745"];
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
                  mychart = new Chart("myChart", {
                    type: "bar",

                    data: {
                      labels: xValues,
                      fontColor: ["#dec15a"],
                      datasets: [
                        {
                          backgroundColor: backgroundColor,
                          data: yValues,
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
          }
        }
      },
      error: function (error) {
        var err = eval("(" + error.responseText + ")");

        var errmsg = error.responseText;
        if (err.status == "500") {
          $("#errorresult1").removeClass("d-none");
          $("#keyerror1").html("Internal Server Error");
          $("#openAPISpec").val("");
          $("#messageValue").addClass("d-none");
          $("#loadingresultfree").addClass("d-none");
          $("#progressIcons").addClass("d-none");
          $("#scantime").addClass("d-none");
          $("#btn").prop("disabled", false);
          $("#errorresult").addClass("d-none");

          // $("#errorscreen").removeClass("d-none")
        } else {
          errorDisplay();
        }
        // console.log(error);
      },
    });
  });
}
var isSubmitting = false;
function fileupload() {
  $("#getFile").val = "";
  $("#fileUploadModal").removeClass("d-none");
  $(".modal-backdrop").removeClass("d-none");
  $("body").addClass("modal-open");
  $("#errorresult").addClass("d-none");
  $("#errorresult2").addClass("d-none");
  $("#errorresult1").addClass("d-none");
  $("#getFile").on("change", function () {
    var file = this.files[0];
    var reader = new FileReader();
    var fileName = file.name;

    // $('#openAPISpec').text(fileName).val
    $("#openAPISpec").val(fileName);
    // console.log('txtet', filename);
    reader.onload = function (v) {
      if (isSubmitting) {
        return false; // prevent multiple clicks if already submitting
      }

      isSubmitting = true;
      $(this).prop("disabled", true);
      var contents = v.target.result;
      if (contents) {
        $(".modal").modal("hide");
      }

      $("#btn").prop("disabled", true);
      var jsonData = {
        openAPISpec: contents,
        isFileUpload: true,
      };
      $.ajax({
        url: "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck",
        method: "POST",
        // dataType: 'json',
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(jsonData),
        success: function (result) {
          try {
            if (result.errors === true) {
              errorDisplay();
            }
            function errorDisplay() {
              for (var i = 0; i < result.messages.length; i++) {
                if (result.messages[i].type == "ERROR") {
                  keyMessage = result.messages[i].key;
                  messageValue = result.messages[i].value;
                  $("#keyerror").text(keyMessage);
                  $("#errorvalue").html(messageValue);
                  $("#messageValue").addClass("d-none");
                  $("#loadingresultfree").addClass("d-none");
                  $("#progressIcons").addClass("d-none");
                  $("#scantime").addClass("d-none");
                }
              }
              $("#errorresult").removeClass("d-none");
              $("#errorresult1").addClass("d-none");
              $("#messageValue").addClass("d-none");
              $("#loadingresultfree").addClass("d-none");
              $("#progressIcons").addClass("d-none");
              $("#scantime").addClass("d-none");
              $("#btn").prop("disabled", false);
              $("#openAPISpec").val("");
              $("#getFile").val("");
              // $("#fileUploadModal").addClass('d-none');
              $("#fileUploadModal").hide();
              $(".modal-backdrop").addClass("d-none");
              $("body").removeClass("modal-open");
              return;
            }
            // var modal = document.getElementById('fileUploadModal');

            // // When the form is submitted
            // document.getElementById('popupform').addEventListener('submit', function (e) {
            //     e.preventDefault(); // Prevent the form from submitting
            //     // Do your file upload process here
            //     // Once the upload is complete, close the modal
            //     $(modal).modal('hide');
            // });
            // $("#fileUploadModal").addClass('d-none');
            $("#fileUploadModal").hide();
            $(".modal-backdrop").addClass("d-none");
            $("body").removeClass("modal-open");
            if (result.errors === false) {
              $("#loadingresultfree").removeClass("d-none");
              $("#progressIcons").removeClass("d-none");
              $("#scantime").removeClass("d-none");
            }
          } catch (error) {
            console.error(error);
            // Handle the error here, such as displaying an error message to the user
          }
          if (result.errors === false) {
            var intervalId = setInterval(function () {
              $.ajax({
                url:
                  "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/status?project-name=" +
                  result.data.name,
                method: "GET",
                dataType: "json",
                headers: {
                  "Content-Type": "application/json",
                },

                success: function (testresult) {
                  $("#errorresult").addClass("d-none");
                  $("#errorresult1").addClass("d-none");
                  $("#messageValue").text(testresult.data);
                  if (testresult.data == "API Security Test case Generation") {
                    $("#progre").removeClass("d-none");
                    $("#analyse").css("color", "#025c7a", "font-weight", "600");
                    $(".hr-line").css("border-bottom", "3px solid #025c7a");
                    $("#runasamplescan").addClass("d-none");
                  }
                  if (testresult.data == "Security Test Execution") {
                    $("#settingdark").css("filter", "none");
                    $("#generate").removeClass("d-none");
                    $("#generate").css(
                      "color",
                      "#025c7a",
                      "font-weight",
                      "600"
                    );
                    $(".hr-line1").css("border-bottom", "3px solid #025c7a");
                  }
                  if (testresult.data == "Preparing Test Results") {
                    $("#targetNew").css("filter", "none");
                    $("#running").removeClass("d-none");
                    $("#running").css("color", "#025c7a", "font-weight", "600");
                    $(".hr-line2").css("border-bottom", "3px solid #025c7a");
                  }
                  if (
                    testresult.data ==
                    "Please check your OAS URL is valid, and the API is not too large."
                  ) {
                    $("#openAPISpec").val("");
                    // $('#messageValue').text('');
                    $("#btn").prop("disabled", false);
                    $("#loadingresultfree").addClass("d-none");
                    $("#progressIcons").addClass("d-none");
                    $("#errorresult2").removeClass("d-none");
                    clearInterval(intervalId);
                  }
                  if (testresult.data == "Scan completed") {
                    $("#reporticon").css("filter", "none");
                    $("#preparing").removeClass("d-none");
                    $("#preparing").css(
                      "color",
                      "#025c7a",
                      "font-weight",
                      "600"
                    );
                    $("#openAPISpec").val("");
                    $("#btn").prop("disabled", false);
                    $("#loadingresultfree").addClass("d-none");
                    $("#progressIcons").addClass("d-none");

                    clearInterval(intervalId);
                    resultAPI();
                  }
                  $("#messageValue").text("");
                },
                error: function (xhr, status, error) {
                  // Handle any API errors here
                },
              });
            }, 10000);

            function resultAPI() {
              clearInterval(intervalId);
              $("#errorresult").addClass("d-none");
              $.ajax({
                url:
                  "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/results?project-name=" +
                  result.data.name,
                method: "GET",
                dataType: "json",
                headers: {
                  "Content-Type": "application/json",
                },
                success: function (resultData) {
                  var viewResult = resultData;
                  var apispecification = "file";
                  var name = viewResult.data.name;
                  var APIdescription = viewResult.data.description;
                  var score = viewResult.data.testSummary.overallScore;
                  var totalEndpoints =
                    viewResult.data.testSummary.totalEndpoints;
                  // var dateTested = viewResult.data.dateTested
                  var testEnvironment =
                    viewResult.data.testSummary.testEnvironment;
                  var vulnerabilityScore =
                    viewResult.data.testSummary.vulnerabilityScore;
                  var valueDataScore =
                    viewResult.data.testSummary.valueDataScore;
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
                  let mainURL = window.location.origin + "/productResult.html";
                  let url2 = new URL(mainURL.replace("index.html", ""));
                  url2.searchParams.set("project-name", name);
                  window.location.replace(url2);
                  // barchart();
                  if (APIdescription === "null") {
                    $("#descriptionForAPI").text("No Description");
                  } else {
                    $("#descriptionForAPI").text(APIdescription);
                  }
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
                  $("#overallScore").text(score);

                  function barchart() {
                    var mychart;
                    var xValues = [
                      "Vulnerable",
                      "Valuable",
                      "Configuration",
                      "Authentication",
                    ];
                    var yValues = [
                      vulnerabilityScore,
                      valueDataScore,
                      configurationScore,
                      authenticationScore,
                    ];

                    // var barColors = ["#dec15a", "#d65745", "#72ba2c", "#d65745"];
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
                    mychart = new Chart("myChart", {
                      type: "bar",

                      data: {
                        labels: xValues,
                        fontColor: ["#dec15a"],
                        datasets: [
                          {
                            backgroundColor: backgroundColor,
                            data: yValues,
                          },
                        ],
                      },

                      options: {
                        legend: { display: false },
                        title: {
                          display: true,
                        },

                        scales: {
                          yAxes: [
                            { ticks: { min: 0, stepSize: 10, max: 100 } },
                          ],
                        },
                      },
                    });
                  }
                },
                error: function (xhr, status, error) {
                  // Handle any API errors here
                },
              });
            }
          }
        },
        error: function (error) {
          var err = eval("(" + error.responseText + ")");

          var errmsg = error.responseText;

          if ((error.statusText = "error")) {
            $("#errorresult1").removeClass("d-none");
            $("#keyerror1").html("Internal Server Error");
            $("#openAPISpec").val("");
            $("#messageValue").addClass("d-none");
            $("#loadingresultfree").addClass("d-none");
            $("#progressIcons").addClass("d-none");
            $("#scantime").addClass("d-none");
            $("#btn").prop("disabled", false);
            $("#errorresult").addClass("d-none");
            $("#errorscreen").removeClass("d-none");
            // $("#fileUploadModal").addClass('d-none')
            $("#fileUploadModal").hide();
            $(".modal-backdrop").addClass("d-none");
            $("body").removeClass("modal-open");
          }

          // if (err.status == '500') {
          //     $("#errorresult1").removeClass("d-none");
          //     $("#keyerror1").html("Internal Server Error");
          //     $('#openAPISpec').val('');
          //     $('#messageValue').addClass("d-none");
          //     $("#loadingresultfree").addClass("d-none");
          //     $("#progressIcons").addClass("d-none");
          //     $('#scantime').addClass("d-none");
          //     $('#btn').prop('disabled', false);
          //     $("#errorresult").addClass("d-none");

          //     // $("#errorscreen").removeClass("d-none")
          // }
          // else {
          //     errorDisplay();
          // }
          // console.log(error);
        },
      });
    };

    reader.readAsText(file);
  });
}

function runAsampleAPI() {
  $("#runSample").click(function (e) {
    e.preventDefault();
    $("#errorresult").addClass("d-none");
    $.ajax({
      url: "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/results?project-name=Online%20Banking%20REST%20API%20jsPi",
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
        var vulnerabilityScore = viewResult.data.testSummary.vulnerabilityScore;
        var valueDataScore = viewResult.data.testSummary.valueDataScore;
        var configurationScore = viewResult.data.testSummary.configurationScore;
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
        // barchart();
        if (APIdescription === "null") {
          $("#descriptionForAPI").text("No Description");
        } else {
          $("#descriptionForAPI").text(APIdescription);
        }
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
        $("#overallScore").text(score);

        function barchart() {
          var xValues = [
            "Vulnerable",
            "Valuable",
            "Configuration",
            "Authentication",
          ];
          var yValues = [
            vulnerabilityScore,
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
  });
}
