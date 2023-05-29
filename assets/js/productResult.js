$(document).ready(function () {
  // runAsampleAPI();
  scan();
  fileupload();
  $("#apiurl").addClass("d-none");
  $("[rel=tooltip]").tooltip({ placement: "right" });
  $(".api-invalid-tooltip").hide();
  $(".email-invalid-tooltip").hide();
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
var apiCallCounter = 0;
var contents = "";
var jsonData;
var baseURL = null;
$("#fileUploadModal").click(function () {
  $("#getFile").val("");
  $("#fileUploadModal").removeClass("d-none");
  $(".modal-backdrop").addClass("d-none");
  $("body").addClass("modal-open");
  fileupload();
});
function callAPI() {
  $("#exampleModalCenterUnabletoLoad").hide();
  $(".modal-backdrop").addClass("d-none");
  // $(".modal").modal("hide");
  document.getElementById("btn").click();
  // scan();
}
function scan() {
  apiCallCounter = 0;
  $("#btn").click(function () {
    $("#Features").addClass("d-none");
    $("#testresultfree").addClass("d-none");
    $("#errorresult").addClass("d-none");
    $("#errorresult2").addClass("d-none");
    $("#errorresult1").addClass("d-none");
    var email = $("#email").val();
    var testStart = Date.now();
    var openAPISpectemp = $("#openAPISpec").val();
    var openAPISpec = openAPISpectemp.replace("getpostman", "postman");
    $("#email").next().hide();
    $("#openAPISpec").next().hide();
    if (openAPISpec == "") {
      $(".api-invalid-tooltip").show();
      return false;
    }
    if (email == "") {
      $(".email-invalid-tooltip").show();
      return false;
    }
    // if (IsEmail(email) == false) {
    //   $("#email").next().show();
    //   return false;
    // }
    $(this).prop("disabled", true);
    $("#testresultfree").addClass("d-none");
    $(".testdomain").text(openAPISpec);
    $("#loadingresultfree").removeClass("d-none");
    $("#progressIcons").removeClass("d-none");
    $("#scantime").removeClass("d-none");

    baseURL = $("#baseUrlInput").val();
    // progressStats();
    // $('.report').hide();
    // var jsonData = {
    //   email: email,
    //   openAPISpec: openAPISpec,
    //   isFileUpload: false,
    // };
    if (contents != "") {
      jsonData = {
        email: email,
        openAPISpec: contents,
        isFileUpload: true,
        host: baseURL,
      };
    } else {
      jsonData = {
        email: email,
        openAPISpec: openAPISpec,
        isFileUpload: false,
        host: baseURL,
      };
    }

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
          var resultMessages = result.messages[0].key === "Missing Base URL";
          console.log(resultMessages);
          if (resultMessages) {
            apiCallCounter = 0 + 1;
            if (apiCallCounter == 1) {
              $("#missingBaseUrlPop").removeClass("d-none");
              $("#exampleModalCenterUnabletoLoad").modal("show");

              $("#errorresult1").addClass("d-none");
              $("#messageValue").addClass("d-none");
              $("#loadingresultfree").addClass("d-none");
              $("#progressIcons").addClass("d-none");
              $("#scantime").addClass("d-none");
              $("#btn").prop("disabled", false);
            } else if (apiCallCounter > 1 && apiCallCounter <= 3) {
              $("#missingBaseUrlPop").removeClass("d-none");
              $("#exampleModalCenter").modal("show");
            } else if (apiCallCounter > 3) {
              $("#exampleModalCenterGoback").modal("show");
            }
          }
          if (!resultMessages) {
            for (var i = 0; i < result.messages.length; i++) {
              if (result.messages[i].type === "ERROR" || resultMessages) {
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
          }
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
                barchart();
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
$(".testdomain").text("");
$("#fileUploadModal").removeClass("d-none");
$(".modal-backdrop").removeClass("d-none");
$("body").addClass("modal-open");
$("#errorresult").addClass("d-none");
$("#errorresult2").addClass("d-none");
$("#errorresult1").addClass("d-none");
$("#Features").addClass("d-none");
$("#testresultfree").addClass("d-none");
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
    contents = v.target.result;
    if (contents) {
      $(".modal").modal("hide");
    }
    // console.log(contents);
  };
  reader.readAsText(file);
  $("#fileUploadModal").hide();
  $(".modal-backdrop").addClass("d-none");
});
// $("#btn").click(function () {
//   $("#btn").prop("disabled", true);
//   var jsonData = {
//     email: email,
//     openAPISpec: contents,
//     isFileUpload: true,
//   };

//   $.ajax({
//     url: "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck",
//     method: "POST",
//     // dataType: 'json',
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: JSON.stringify(jsonData),
//     success: function (result) {
//       try {
//         if (result.errors === true) {
//           $("#errorresult").addClass("d-none");
//           $("#errorresult1").addClass("d-none");
//           errorDisplay();
//         }
//         function errorDisplay() {
//           $("#errorresult").addClass("d-none");
//           $("#errorresult1").addClass("d-none");
//           for (var i = 0; i < result.messages.length; i++) {
//             if (result.messages[i].type == "ERROR") {
//               keyMessage = result.messages[i].key;
//               messageValue = result.messages[i].value;
//               $("#keyerror").text(keyMessage);
//               $("#errorvalue").html(messageValue);
//               $("#messageValue").addClass("d-none");
//               $("#loadingresultfree").addClass("d-none");
//               $("#progressIcons").addClass("d-none");
//               $("#scantime").addClass("d-none");
//             }
//           }
//           $("#errorresult").removeClass("d-none");
//           $("#errorresult1").addClass("d-none");
//           $("#messageValue").addClass("d-none");
//           $("#loadingresultfree").addClass("d-none");
//           $("#progressIcons").addClass("d-none");
//           $("#scantime").addClass("d-none");
//           $("#btn").prop("disabled", false);
//           $("#openAPISpec").val("");
//           $("#getFile").val("");
//           // $("#fileUploadModal").addClass('d-none');

//           $("body").removeClass("modal-open");
//           return;
//         }
//         // var modal = document.getElementById('fileUploadModal');

//         // // When the form is submitted
//         // document.getElementById('popupform').addEventListener('submit', function (e) {
//         //     e.preventDefault(); // Prevent the form from submitting
//         //     // Do your file upload process here
//         //     // Once the upload is complete, close the modal
//         //     $(modal).modal('hide');
//         // });
//         // $("#fileUploadModal").addClass('d-none');
//         $("#fileUploadModal").hide();
//         $(".modal-backdrop").addClass("d-none");
//         $("body").removeClass("modal-open");
//         if (result.errors === false) {
//           $("#loadingresultfree").removeClass("d-none");
//           $("#progressIcons").removeClass("d-none");
//           $("#scantime").removeClass("d-none");
//         }
//       } catch (error) {
//         console.error(error);
//         // Handle the error here, such as displaying an error message to the user
//       }
//       if (result.errors === false) {
//         var intervalId = setInterval(function () {
//           $.ajax({
//             url:
//               "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/status?project-name=" +
//               result.data.name,
//             method: "GET",
//             dataType: "json",
//             headers: {
//               "Content-Type": "application/json",
//             },

//             success: function (testresult) {
//               $("#errorresult").addClass("d-none");
//               $("#errorresult1").addClass("d-none");
//               $("#messageValue").text(testresult.data);
//               if (testresult.data == "API Security Test case Generation") {
//                 $("#progre").removeClass("d-none");
//                 $("#analyse").css("color", "#025c7a", "font-weight", "600");
//                 $(".hr-line").css("border-bottom", "3px solid #025c7a");
//                 $("#runasamplescan").addClass("d-none");
//               }
//               if (testresult.data == "Security Test Execution") {
//                 $("#settingdark").css("filter", "none");
//                 $("#generate").removeClass("d-none");
//                 $("#generate").css("color", "#025c7a", "font-weight", "600");
//                 $(".hr-line1").css("border-bottom", "3px solid #025c7a");
//               }
//               if (testresult.data == "Preparing Test Results") {
//                 $("#targetNew").css("filter", "none");
//                 $("#running").removeClass("d-none");
//                 $("#running").css("color", "#025c7a", "font-weight", "600");
//                 $(".hr-line2").css("border-bottom", "3px solid #025c7a");
//               }
//               if (
//                 testresult.data ==
//                 "Please check your OAS URL is valid, and the API is not too large."
//               ) {
//                 $("#openAPISpec").val("");
//                 // $('#messageValue').text('');
//                 $("#btn").prop("disabled", false);
//                 $("#loadingresultfree").addClass("d-none");
//                 $("#progressIcons").addClass("d-none");
//                 $("#errorresult2").removeClass("d-none");
//                 clearInterval(intervalId);
//               }
//               if (testresult.data == "Scan completed") {
//                 $("#reporticon").css("filter", "none");
//                 $("#preparing").removeClass("d-none");
//                 $("#preparing").css("color", "#025c7a", "font-weight", "600");
//                 $("#openAPISpec").val("");
//                 $("#btn").prop("disabled", false);
//                 $("#loadingresultfree").addClass("d-none");
//                 $("#progressIcons").addClass("d-none");

//                 clearInterval(intervalId);
//                 resultAPI();
//               }
//               $("#messageValue").text("");
//             },
//             error: function (xhr, status, error) {
//               // Handle any API errors here
//             },
//           });
//         }, 10000);

//         function resultAPI() {
//           clearInterval(intervalId);
//           $("#errorresult").addClass("d-none");
//           $.ajax({
//             url:
//               "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/results?project-name=" +
//               result.data.name,
//             method: "GET",
//             dataType: "json",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             success: function (resultData) {
//               var viewResult = resultData;
//               var apispecification = "file";
//               var name = viewResult.data.name;
//               var APIdescription = viewResult.data.description;
//               var score = viewResult.data.testSummary.overallScore;
//               var totalEndpoints = viewResult.data.testSummary.totalEndpoints;
//               // var dateTested = viewResult.data.dateTested
//               var testEnvironment =
//                 viewResult.data.testSummary.testEnvironment;
//               var vulnerabilityScore =
//                 viewResult.data.testSummary.vulnerabilityScore;
//               var valueDataScore = viewResult.data.testSummary.valueDataScore;
//               var configurationScore =
//                 viewResult.data.testSummary.configurationScore;
//               var authenticationScore =
//                 viewResult.data.testSummary.authenticationScore;
//               var dateString = viewResult.data.dateTested;
//               var date = new Date(dateString);
//               var formattedDate = date.toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               });

//               var injectionsForEndpoints =
//                 viewResult.data.testSummary.injectionsForEndpoints;
//               var sixXFuzz = viewResult.data.testSummary.sixXFuzz;
//               var reflectedGetInjection =
//                 viewResult.data.testSummary.reflectedGetInjection;
//               var reflectedPOSTInjection =
//                 viewResult.data.testSummary.reflectedPOSTInjection;
//               var pii = viewResult.data.testSummary.pii;
//               // var moneyRelated = viewResult.data.testSummary.moneyRelated;
//               // var richContentUploads = viewResult.data.testSummary.richContentUploads;
//               var sslCertificateIssues =
//                 viewResult.data.testSummary.sslCertificateIssues;
//               var missingTLSHSTSHeaders =
//                 viewResult.data.testSummary.missingTLSHSTSHeaders;
//               var serverPropertiesLeakInHeaders =
//                 viewResult.data.testSummary.serverPropertiesLeakInHeaders;
//               var httpOptions = viewResult.data.testSummary.httpOptions;
//               var corsConfig = viewResult.data.testSummary.corsConfig;
//               var incrementalIDsForEndpoint =
//                 viewResult.data.testSummary.incrementalIDsForEndpoint;
//               var noAuth = viewResult.data.testSummary.noAuth;
//               var brokenAuthentication =
//                 viewResult.data.testSummary.brokenAuthentication;
//               var basicAuthentication =
//                 viewResult.data.testSummary.basicAuthentication;
//               let mainURL = window.location.origin + "/result.html";
//               let url2 = new URL(mainURL.replace("index.html", ""));
//               url2.searchParams.set("project-name", name);
//               window.location.replace(url2);
//               barchart();
//               if (APIdescription === "null") {
//                 $("#descriptionForAPI").text("No Description");
//               } else {
//                 $("#descriptionForAPI").text(APIdescription);
//               }
//               if (injectionsForEndpoints === "Passed") {
//                 $("#injection").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else if (injectionsForEndpoints === "Failed") {
//                 $("#injection").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (sixXFuzz === "Passed") {
//                 $("#6fuzz").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#6fuzz").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (reflectedGetInjection === "Passed") {
//                 $("#reflectedget").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#reflectedget").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (reflectedPOSTInjection === "Passed") {
//                 $("#reflectedpost").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#reflectedpost").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (pii === "Passed") {
//                 $("#piiData").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#piiData").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (sslCertificateIssues === "Passed") {
//                 $("#ssl").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#ssl").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (missingTLSHSTSHeaders === "Passed") {
//                 $("#missing").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#missing").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (serverPropertiesLeakInHeaders === "Passed") {
//                 $("#serverprop").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#serverprop").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (httpOptions === "Passed") {
//                 $("#httpoption").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#httpoption").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (corsConfig === "Passed") {
//                 $("#cors").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#cors").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (incrementalIDsForEndpoint === "Passed") {
//                 $("#incremental").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#incremental").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (noAuth === "Passed") {
//                 $("#noauth").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#noauth").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (brokenAuthentication === "Passed") {
//                 $("#brokenauth").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#brokenauth").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               if (basicAuthentication === "Passed") {
//                 $("#basicauth").html(
//                   '<i class="fa fa-check-circle check" aria-hidden="true"></i>'
//                 );
//               } else {
//                 $("#basicauth").html(
//                   '<i class="fa fa-times-circle cross" aria-hidden="true"></i>'
//                 );
//               }

//               $("#indexpageUI").hide().html();
//               $("#indexpageUI").hide().html("#resultPageOnUI");
//               $("#indexpageUI").addClass("d-none");
//               $("#resultPageOnUI").removeClass("d-none");
//               $("#dateTested").text(formattedDate);
//               $("#apispecification").text(apispecification);
//               $("#name").text(name);

//               $("#totalEndpoints").text(totalEndpoints);
//               $("#testEnvironment").text(testEnvironment);
//               $("#overallScore").text(score);

//               function barchart() {
//                 var mychart;
//                 var xValues = [
//                   "Vulnerable",
//                   "Valuable",
//                   "Configuration",
//                   "Authentication",
//                 ];
//                 var yValues = [
//                   vulnerabilityScore,
//                   valueDataScore,
//                   configurationScore,
//                   authenticationScore,
//                 ];

//                 // var barColors = ["#dec15a", "#d65745", "#72ba2c", "#d65745"];
//                 const backgroundColor = [];
//                 for (i = 0; i < yValues.length; i++) {
//                   if (yValues[i] >= 0 && yValues[i] < 49) {
//                     backgroundColor.push("green");
//                   }
//                   if (yValues[i] >= 50 && yValues[i] <= 75) {
//                     backgroundColor.push("yellow");
//                   }
//                   if (yValues[i] > 75) {
//                     backgroundColor.push("red");
//                   }
//                 }
//                 mychart = new Chart("myChart", {
//                   type: "bar",

//                   data: {
//                     labels: xValues,
//                     fontColor: ["#dec15a"],
//                     datasets: [
//                       {
//                         backgroundColor: backgroundColor,
//                         data: yValues,
//                       },
//                     ],
//                   },

//                   options: {
//                     legend: { display: false },
//                     title: {
//                       display: true,
//                     },

//                     scales: {
//                       yAxes: [{ ticks: { min: 0, stepSize: 10, max: 100 } }],
//                     },
//                   },
//                 });
//               }
//             },
//             error: function (xhr, status, error) {
//               // Handle any API errors here
//             },
//           });
//         }
//       }
//     },
//     error: function (error) {
//       var err = eval("(" + error.responseText + ")");

//       var errmsg = error.responseText;

//       if ((error.statusText = "error")) {
//         $("#errorresult1").removeClass("d-none");
//         $("#keyerror1").html("Internal Server Error");
//         $("#openAPISpec").val("");
//         $("#messageValue").addClass("d-none");
//         $("#loadingresultfree").addClass("d-none");
//         $("#progressIcons").addClass("d-none");
//         $("#scantime").addClass("d-none");
//         $("#btn").prop("disabled", false);
//         $("#errorresult").addClass("d-none");
//         $("#errorscreen").removeClass("d-none");
//         // $("#fileUploadModal").addClass('d-none')
//         $("#fileUploadModal").hide();
//         $(".modal-backdrop").addClass("d-none");
//         $("body").removeClass("modal-open");
//       }

//       // if (err.status == '500') {
//       //     $("#errorresult1").removeClass("d-none");
//       //     $("#keyerror1").html("Internal Server Error");
//       //     $('#openAPISpec').val('');
//       //     $('#messageValue').addClass("d-none");
//       //     $("#loadingresultfree").addClass("d-none");
//       //     $("#progressIcons").addClass("d-none");
//       //     $('#scantime').addClass("d-none");
//       //     $('#btn').prop('disabled', false);
//       //     $("#errorresult").addClass("d-none");

//       //     // $("#errorscreen").removeClass("d-none")
//       // }
//       // else {
//       //     errorDisplay();
//       // }
//       // console.log(error);
//     },
//   });
// });
}

function runAsampleAPI() {
$("#runSample").click(function (e) {
  e.preventDefault();
  // // window.location.href = "/sampleResult.html";
  // let mainURL = window.location.origin + "/sampleResult.html";
  // let url2 = new URL(mainURL.replace("index.html", ""));
  // window.location.replace(url2);
  // console.log("resultData", resultData);
  window.location.replace = "/sampleResult.html";
  $("#errorresult").addClass("d-none");
  $.ajax({
    url: "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/results?project-name=Online%20Banking%20REST%20API%20jsPi",
    method: "GET",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    success: function (resultData) {
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
      barchart();
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
        // var ctx = document.getElementById("myChart").getContext("2d");
        // var mychart = new Chart(ctx, {
        //   type: "bar",
        //   data: {
        //     labels: xValues,
        //     fontColor: ["#dec15a"],
        //     datasets: [
        //       {
        //         data: yValues,
        //         backgroundColor: backgroundColor,
        //       },
        //     ],
        //   },

        //   options: {
        //     legend: { display: false },
        //     title: {
        //       display: true,
        //     },

        //     scales: {
        //       yAxes: [{ ticks: { min: 0, stepSize: 10, max: 100 } }],
        //     },
        //   },
        // });
      }
    },
    error: function (xhr, status, error) {
      // Handle any API errors here
    },
  });
});
}
