import { getServer } from "./environment.js";
// import {resultAPI} from "./productResult.js";
$(document).ready(function () {
  let url2 = new URL(window.location.href);
  let projectName = url2.searchParams.get("project-name");

  $("#basicInfoTab").on("click", function () {
    mixpanel.track("Basic Info Tab Clicked");
  });

  $("#parametersTab").on("click", function () {
    mixpanel.track("Parameters Tab Clicked");
  });

  $("#owaspTab").on("click", function () {
    mixpanel.track("OWASP Tab Clicked");
  });

  $("#runbtn").on("click", function () {
    mixpanel.track("Run Tests Button Clicked");
  });

  $("#contactSales").on("click", function () {
    mixpanel.track("Learn More link clicked");
  });
  $("#variablesDownloadBtn").on("click", function () {
    mixpanel.track("Download Variabled link clicked");
  });
  var s = getServer();

  resultAPITest();

  // statusAPITest();
  // Window.onload = callStatusApiOnIntervals();
  // document.getElementById("runbtn").disabled = true;
  // document.getElementById("runbtn").disabled = false;

  function resultAPITest() {
    // .nav - tabs.nav - link.active
    // #b8b9b9
    // $(".nav - tabs.nav - link.active").css("color", "#b8b9b9");
    // $(".nav-tabs .nav-link").css("color", "#b8b9b9");
    $("#basicInfoTab.active").css("color", "#025c7a;");
    $.ajax({
      async: false,
      url: s + "/api/v1/apiseccheck/results?project-name=" + projectName,
      method: "GET",
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
      },
      success: function (resultData) {
        document.getElementById("runbtn").disabled = true;
        if (resultData) {
          $("#loader").addClass("d-none");
          $("#main").removeClass("d-none");
        }

        // $("#loadingresultfree").removeClass("d-none");

        // function callStatusApiOnIntervals() {
        //   var intervalId = setInterval(function () {
        //     $.ajax({
        //       url:
        //         s + "/api/v1/apiseccheck/status?project-name=" + result.data.name,
        //       method: "GET",
        //       dataType: "json",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },

        //       success: function (testresult) {
        //         let flag = 0;
        //         $("#errorresult").addClass("d-none");
        //         $("#messageValue").text(testresult.data);
        //         // console.log(testresult.data)
        //         if (
        //           testresult.data == "Automatically Generating API Security Tests"
        //         ) {
        //           flag = 0;
        //           $("#settingdark").css("filter", "none");
        //           $(".hr-line").css("filter", "none");
        //           $("#generate").removeClass("d-none");
        //           $("#generate").css("color", "#025c7a", "font-weight", "600");
        //           $(".hr-line").css("border-bottom", "3px solid #025c7a");
        //           $("#runasamplescan").addClass("d-none");
        //           // console.log("analyse")
        //         }
        //         if (testresult.data == "Test Case Generation Completed") {
        //           // console.log("Security Test Case Completion")
        //           clearInterval(intervalId);
        //           showDetails();
        //         }
        //         // if (testresult.data == "Security Test Execution") {
        //         //   $("#settingdark").css("filter", "none");
        //         //   flag = 1;
        //         //   $("#generate").removeClass("d-none");
        //         //   $("#generate").css("color", "#025c7a", "font-weight", "600");
        //         //   $(".hr-line1").css("border-bottom", "3px solid #025c7a");

        //         //   console.log("Test!",result.data.name)
        //         //   // clearInterval(intervalId);
        //         //   // showDetails();
        //         //   // window.location.replace('details.html')

        //         // }
        //         // if(testresult.data == "Security Test Case Completion"){
        //         //   console.log("Security Test Case Completion")
        //         //   clearInterval(intervalId);
        //         //                     // showDetails();

        //         // }
        //         // if (testresult.data == "Preparing Test Results") {
        //         //   flag = 0;
        //         //   $("#targetNew").css("filter", "none");
        //         //   $("#running").removeClass("d-none");
        //         //   $("#running").css("color", "#025c7a", "font-weight", "600");
        //         //   $(".hr-line2").css("border-bottom", "3px solid #025c7a");
        //         //    console.log("preparing ")
        //         // }
        //         // if (
        //         //   testresult.data ==
        //         //   "Please check your OAS URL is valid, and the API is not too large."
        //         // ) {
        //         //   // $("#openAPISpec").val("");
        //         //   $("#btn").prop("disabled", false);
        //         //   $("#loadingresultfree").addClass("d-none");
        //         //   $("#progressIcons").addClass("d-none");
        //         //   $("#errorresult2").removeClass("d-none");
        //         //   console.log("check")

        //         //   clearInterval(intervalId);
        //         // }
        //         // if (testresult.data == "Scan completed") {
        //         //   flag = 0;
        //         //   $("#reporticon").css("filter", "none");
        //         //   $("#preparing").removeClass("d-none");
        //         //   $("#preparing").css("color", "#025c7a", "font-weight", "600");
        //         //   $("#openAPISpec").val("");
        //         //   $("#btn").prop("disabled", false);
        //         //   $("#loadingresultfree").addClass("d-none");
        //         //   $("#progressIcons").addClass("d-none");
        //         //   console.log("scan completed")
        //         //   // clearInterval(intervalId);
        //         //   // resultAPI();
        //         //   clearInterval(intervalId);
        //         //   // showDetails();
        //         // }
        //         // if (testresult.data == 'Please check your OAS URL is valid, and the API is not too large') {
        //         //     clearInterval(intervalId);
        //         // }

        //         // else if (testresult.data == 'Error occured during scan') {
        //         //     $('#loadingresultfree').addClass('d-none')
        //         // }
        //       },
        //       error: function (xhr, status, error) {
        //         // Handle any API errors here
        //       },
        //     });
        //   }, 10000);
        // }

        $("#subTitle").html("API Name:" + resultData.data.name);
        // let tableDataParameters = [];
        // let tableDataParameters2 = "";
        // for (
        //   let i = 0;
        //   i < resultData.data.specAnalysis.variablesList.length;
        //   i++
        // ) {
        //   let variableFormat =
        //     resultData.data.specAnalysis.variablesList[i].format;
        //   if (variableFormat == null) variableFormat = "-";
        //   resultData.data.specAnalysis.variablesList[i].format = variableFormat;
        //   tableDataParameters.push(resultData.data.specAnalysis.variablesList[i]);
        // }

        // for (
        //   let i = 0;
        //   i < resultData.data.specAnalysis.variablesList.length;
        //   i++
        // ) {
        //   let variableFormat =
        //     resultData.data.specAnalysis.variablesList[i].format;
        //   tableDataParameters2 += `<tr><td class="text-center">${
        //     resultData.data.specAnalysis.variablesList[i].name
        //   }</td>
        //   <td class="text-center">${
        //     resultData.data.specAnalysis.variablesList[i].type
        //   }</td>
        //   <td class="text-center">${
        //     variableFormat == null ? "-" : variableFormat
        //   }</td>
        //   </tr>`;
        // }
        // $(".parameter-table-virtual").append(tableDataParameters2);

        $("#endpointCount").html(resultData.data.specAnalysis.totalEndpoints);
        $("#testsCount").html(resultData.data.specAnalysis.totalPlaybooks);

        // let tableDataCategory2 = '';
        // function sortJSON(arr, key, asc=true) {
        //   return arr.sort((a, b) => {
        //     let x = a[key];
        //     let y = b[key];
        //     if (asc) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        //     else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
        //   });
        // }
        // let output = sortJSON(resuintervalIdltData.data.specAnalysis.categoryWisePlaybookCountList, "owaspRank", true);

        // for (let i = 0; i < resultData.data.specAnalysis.categoryWisePlaybookCountList.length; i++) {
        //   let testsGenerated = resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count;
        //   if (testsGenerated > 0) {
        //     tableDataCategory2 += `<tr><td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].owaspRank}</td>
        //   <td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].label}</td>
        //   <td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count}</td>
        //   </tr>`;
        //   }
        // }

        // $(".owasp-table-virtual").append(tableDataCategory2);

        // var columnsCategory = {
        //   owaspRank: "OWASP Ranking",
        //   label: "Category",
        //   count: "Number of Tests Generated",

        // };
        // var columnsParameters = {
        //   name: "Parameters",
        //   type: "Type",
        //   // format: "Format",
        // };

        // var tableCategory = $("#OWASP .owasp-table").tableSortable({
        //   data: tableDataCategory,
        //   sorting: true,
        //   columns: columnsCategory,
        //   searchField: "#searchFieldCategory",
        //   rowsPerPage: 5,
        //   pagination: true,
        //   sortingIcons: {
        //      asc:'<span>▼</span>',
        //      desc:'<span>▲</span>',
        //         },

        // });
        // $("#changeRowsCategory").on("change", function () {
        //   tableCategory.updateRowsPerPage(parseInt($(this).val(), 10));
        // });

        // var tableParameters = $("#parameters .parameter-table").tableSortable(
        //   {
        //     data: tableDataParameters,
        //     sorting: true,
        //     columns: columnsParameters,
        //     searchField: "#searchFieldVariables",
        //     rowsPerPage: 5,
        //     pagination: true,
        //     sortingIcons: {
        //       asc: "<span>▼</span>",
        //       desc: "<span>▲</span>",
        //     },
        //   }
        // );
        // $("#changeRowsVariables").on("change", function () {
        //   tableParameters.updateRowsPerPage(parseInt($(this).val(), 10));
        // });

        function tableToCSVOWASPRanking() {
          var csv_data = [];
          // console.log($('#OWASP .owasp-table .gs-table')[0])
          // var rows = $('#OWASP .owasp-table .gs-table')[0].rows;
          // console.log($(".owasp-table-virtual")[0]);
          var rows = $(".owasp-table-virtual")[0].rows;
          for (var i = 0; i < rows.length; i++) {
            var cols = rows[i].querySelectorAll("td,th");
            // console.log(cols);
            var csvrow = [];
            for (var j = 0; j < cols.length; j++) {
              csvrow.push(cols[j].innerHTML);
            }
            csv_data.push(csvrow.join(","));
          }
          csv_data = csv_data.join("\n");
          // console.log(csv_data)
          downloadCSVFileOWASPRanking(csv_data);
        }

        function downloadCSVFileOWASPRanking(csv_data) {
          var CSVFile = new Blob([csv_data], {
            type: "text/csv",
          });
          var temp_link = document.createElement("a");
          temp_link.download = "APIsecFreeOWASPRanking.csv";
          var url = window.URL.createObjectURL(CSVFile);
          temp_link.href = url;
          temp_link.style.display = "none";
          document.body.appendChild(temp_link);
          temp_link.click();
          document.body.removeChild(temp_link);
        }

        function tableToCSVVariables() {
          var csv_data = [];
          var rows = $(".parameter-table-virtual")[0].rows;
          for (var i = 0; i < rows.length; i++) {
            var cols = rows[i].querySelectorAll("td,th");
            var csvrow = [];
            for (var j = 0; j < cols.length; j++) {
              csvrow.push(cols[j].innerHTML);
            }
            csv_data.push(csvrow.join(","));
          }
          csv_data = csv_data.join("\n");
          // console.log(csv_data)
          downloadCSVFileVariables(csv_data);
        }

        function downloadCSVFileVariables(csv_data) {
          var CSVFile = new Blob([csv_data], {
            type: "text/csv",
          });
          var temp_link = document.createElement("a");
          temp_link.download = "APIsecFreeVariables.csv";
          var url = window.URL.createObjectURL(CSVFile);
          temp_link.href = url;
          temp_link.style.display = "none";
          document.body.appendChild(temp_link);
          temp_link.click();
          document.body.removeChild(temp_link);
        }

        // let tableDataMethod = '';
        // for (let i = 0; i < resultData.data.specAnalysis.countEndpointsByMethodList.length; i++) {
        //   tableDataMethod += `<tr><td class="text-center">${resultData.data.specAnalysis.countEndpointsByMethodList[i].method}</td>
        //   <td class="text-center">${resultData.data.specAnalysis.countEndpointsByMethodList[i].count}</td>

        //   </tr>`;
        // }

        // let tableDataMethod = [];
        // for (let i = 0; i < resultData.data.specAnalysis.countEndpointsByMethodList.length; i++) {
        //   tableDataMethod.push(resultData.data.specAnalysis.countEndpointsByMethodList[i])
        // }

        // var columnsMethod = {
        //   method:"Method",
        //   count:"Count"
        // }

        // var tableMethod = $("#basicInfo .basicinfo-table").tableSortable({
        //   data: tableDataMethod,
        //   sorting: true,
        //   columns: columnsMethod,
        //   // searchField: "#searchField",
        //   rowsPerPage: 5,
        //   pagination: true,
        //   // sortingIcons: {
        //   //    asc:'<span>▼</span>',
        //   //    desc:'<span>▲</span>',
        //   //       },

        // });

        $(".basicinfo-table").CanvasJSChart({
          // title: {
          //   text: "API Composition",
          //   fontSize: 24
          // },
          axisY: {
            title: " Number of Endpoints",
          },
          legend: {
            verticalAlign: "center",
            horizontalAlign: "right",
          },
          animationEnabled: true,
          animationDuration: 2000,
          theme: "light2",
          // height: 300,
          data: [
            {
              type: "pie",
              // showInLegend: true,
              radius: "100%",
              center: ["50%", "50%"],
              toolTipContent: "{label}  {y} ",
              indexLabel: "{label}({y})",
              dataPoints: [
                {
                  label: "DELETE",
                  y: resultData.data.specAnalysis.httpMethodsCounts["DELETE"],
                  legendText: "DELETE",
                  color: "#f93e3e",
                },
                {
                  label: "GET",
                  y: resultData.data.specAnalysis.httpMethodsCounts["GET"],
                  legendText: "GET",
                  color: "#61affe",
                },
                {
                  label: "POST",
                  y: resultData.data.specAnalysis.httpMethodsCounts["POST"],
                  legendText: "POST",
                  color: "#fca130",
                },
                {
                  label: "PUT",
                  y: resultData.data.specAnalysis.httpMethodsCounts["PUT"],
                  legendText: "PUT",
                  color: "#49cc90",
                },
              ],
            },
          ],
        });

        $("#headingOne .btn").click(function () {
          // console.log( $(this).find('.fas'))
          $(this).find(".fas").toggleClass("fa-plus fa-minus");
        });
        // $('#basicInfo .basicinfo-table').append(tableDataMethod);
        $("#description").html(showDescription());
        function showDescription() {
          if (resultData.data.description.length > 240) {
            let dataDescription = `${resultData.data.description.substring(
              1,
              240
            )}...`;
            $("#openDescription").html(dataDescription);
            $("#openDescriptionMore").html(resultData.data.description);
            $(".show-more").removeClass("d-none");
            $(".show-more").click(function () {
              $("#openDescriptionMore").removeClass("d-none");
              $(".show-less").removeClass("d-none");
              $(this).addClass("d-none");
              $("#openDescription").addClass("d-none");
            });
            $(".show-less").click(function () {
              $(this).addClass("d-none");
              $("#openDescriptionMore").addClass("d-none");
              $("#openDescription").removeClass("d-none");
              $(".show-more").removeClass("d-none");
            });
          } else {
            $("#openDescription").html(resultData.data.description);
            // return resultData.data.openAPISpec;
          }
        }
        // $('#openApiSec').html("<span class='font-weight-bold fs-6'>API Specification:</span>" + localStorage.getItem("fileName"))
        // console.log(resultData.data.isFileUpload,resultData.data.openAPISpec)
        $("#openApiSecContent").html(
          resultData.data.isFileUpload === "true"
            ? localStorage.getItem("fileName")
            : resultData.data.openAPISpec
        );

        localStorage.setItem("detailsURL", window.location.href);
        $("#OWASPRankingDownloadBtn").click(function () {
          tableToCSVOWASPRanking();
        });
        $("#variablesDownloadBtn").click(function () {
          tableToCSVVariables();
        });

        // let piiData = "";
        // if (resultData.data.specAnalysis.piiList.length == 0)
        //   $("#piiStatus").html(
        //     "No PII element found for the given specification!"
        //   );
        // else
        //   for (
        //     let i = 0;
        //     i < resultData.data.specAnalysis.piiList.length;
        //     i++
        //   ) {
        //     piiData += `<div class="pii-elements">${resultData.data.specAnalysis.piiList[i]}</div>`;
        //   }
        // $(".pii-ele-wrapper").append(piiData);
      },
      error: function (xhr, status, error) {
        // Handle any API errors here
      },
    });

    statusAPITest();
  }
  function showDetails() {
    let mainURLDetail2 = window.location.origin + "/SpecAnalysisResults.html";
    let urlDetail = new URL(mainURLDetail2.replace("index.html", ""));
    urlDetail.searchParams.set("project-name", result.data.name);
    window.location.replace(urlDetail);
    // console.log("length", APIdescription.length);
  }
  $("#runbtn").click(function () {
    $(this).prop("disabled", true);
    // $("#progressIcons").removeClass("d-none");
    $("#loadingresultfree").removeClass("d-none");
    $("#progressOne").addClass("d-none");
    runTests();
  });
  function runTests() {
    $.ajax({
      url: s + "/api/v1/apiseccheck/scan?project-name=" + projectName,
      method: "POST",
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
      },
      success: function (resultData) {
        if (resultData.errors === true) {
          // console.log("errors",resultData);
          errorDisplay(resultData);
        } else {
          // if (
          //   resultData.data == "Scan Request Submitted" ||
          //   resultData.data == "Scan completed"
          // )
          // $("#scantime").removeClass("d-none");
          // $("#progressIcons").removeClass("d-none");
          if ($("#messageValue").text() == "Test Case Generation Completed") {
            $("#progressTwo").removeClass("d-none");
            $("#progressTwo .progress-tooltip-info")
              .animate({ left: "5%" }, { duration: 2000 })
              .text("5%");
            $("#progressTwo .progress")
              .text("5%")
              .val(5)
              .animate({ duration: 2000 });
            $("#previousBtn2").prop("disabled", true);
          }
          $("#loadingresultfree").removeClass("d-none");
          var intervalId1 = setInterval(function () {
            $.ajax({
              url: s + "/api/v1/apiseccheck/status?project-name=" + projectName,
              method: "GET",
              dataType: "json",
              headers: {
                "Content-Type": "application/json",
              },

              success: function (testresult) {
                // let flag = 0;
                $("#messageValue").text(testresult.data);
                if (testresult.data == "Scan Request Submitted") {
                  $("#progressTwo").removeClass("d-none");
                  $("#progressTwo .progress-tooltip-info")
                    .animate({ left: "15%" }, { duration: 2000 })
                    .text("15%");
                  $("#progressTwo .progress")
                    .text("15%")
                    .val(15)
                    .animate({ duration: 2000 });
                  $("#previousBtn2").prop("disabled", true);
                } else if (
                  testresult.data == "We are executing the Security Tests"
                ) {
                  // $('#progressTwo').removeClass('d-none')
                  $("#progressTwo .progress-tooltip-info")
                    .animate({ left: "25%" }, { duration: 2000 })
                    .text("25%");
                  $("#progressTwo .progress")
                    .text("25%")
                    .val(25)
                    .animate({ duration: 2000 });
                  $("#previousBtn2").prop("disabled", true);
                }
                // if(testresult.data == "Preparing Test Results")
                //       {
                //         $('#progressTwo .progress-tooltip-info').animate({left:'50%'},{ duration: 2000}).text('50%');
                //         $('#progressTwo .progress').text('50%').val(50).animate({duration: 2000})
                //       }
                //  if(testresult.data == "Scan completed")
                //       {
                //         $('#progressTwo .progress-tooltip-info').animate({left:'100%'},{ duration: 2000}).text('100%');
                //         $('#progressTwo .progress').text('100%').val(100).animate({duration: 2000})
                //       }
                // if (testresult.data == "Security Test Execution") {
                //   $("#targetNew").css("filter", "none");
                //   $("#running").removeClass("d-none");
                //   $("#running").css("color", "#025c7a", "font-weight", "600");
                //   $(".hr-line2").css("border-bottom", "3px solid #025c7a");
                //   $('#progressTwo').removeClass('d-none')
                //   $('#progressTwo .progress-tooltip-info').animate({left:'25%'},{ duration: 2000}).text('25%');
                //   $('#progressTwo .progress').text('25%').val(25).animate({duration: 2000})
                // }
                else if (testresult.data == "Preparing Test Results") {
                  $("#reporticon").css("filter", "none");
                  $("#preparing").removeClass("d-none");
                  $("#progressTwo .progress-tooltip-info")
                    .animate({ left: "60%" }, { duration: 2000 })
                    .text("60%");
                  $("#progressTwo .progress")
                    .text("60%")
                    .val(60)
                    .animate({ duration: 2000 });
                  $("#preparing").css("color", "#025c7a", "font-weight", "600");
                  $("#previousBtn2").prop("disabled", true);
                } else if (testresult.data == "Scan completed") {
                  // flag = 0;
                  $("#loadingresultfree").addClass("d-none");
                  $("#progressIcons").addClass("d-none");
                  $("#runbtn").prop("disabled", false);
                  // $('#progressTwo').removeClass('d-none')
                  $("#progressTwo .progress-tooltip-info")
                    .animate({ left: "100%" }, { duration: 2000 })
                    .text("100%");
                  $("#progressTwo .progress")
                    .text("100%")
                    .val(100)
                    .animate({ duration: 2000 });
                  // document.getElementById("runbtn").disabled = false;
                  $("#previousBtn2").prop("disabled", false);

                  resultAPI();
                  clearInterval(intervalId1);
                  // clearInterval(intervalId);
                } else if (
                  testresult.data ==
                  "Please check your OAS URL is valid, and the API is not too large."
                ) {
                  clearInterval(intervalId1);
                }
              },
              error: function (xhr, status, error) {
                // Handle any API errors here
              },
            });
          }, 5000);
        }
      },
      error: function (xhr, status, error) {},
    });
  }

  function getOwaspCoverage() {
    let tableDataCategory = [];
    $.ajax({
      async: false,
      url: s + "/api/v1/apiseccheck/results?project-name=" + projectName,
      method: "GET",
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
      },
      success: function (resultData) {
        document.getElementById("runbtn").disabled = false;
        if (resultData) {
          $("#loader").addClass("d-none");
          $("#main").removeClass("d-none");
          $("#testsCount").html(resultData.data.specAnalysis.totalPlaybooks);
        }
        if (
          resultData &&
          resultData.data &&
          resultData.data.specAnalysis.categoryWisePlaybookCountList
        ) {
          for (
            let i = 0;
            i <
            resultData.data.specAnalysis.categoryWisePlaybookCountList.length;
            i++
          ) {
            let testsGenerated =
              resultData.data.specAnalysis.categoryWisePlaybookCountList[i]
                .count;
            // console.log(
            //   "testsGenerated",
            //   resultData.data.specAnalysis.categoryWisePlaybookCountList
            // );
            if (testsGenerated > 0) {
              tableDataCategory.push(
                resultData.data.specAnalysis.categoryWisePlaybookCountList[i]
              );
            }
          }
        }
        const groupByCategory = (tableDataCategory, owaspRank) => {
          return tableDataCategory.reduce((result, currentValue) => {
            (result[currentValue.owaspRank] =
              result[currentValue.owaspRank] || []).push(currentValue);
            return result;
          }, {});
        };
        var sortedCategory = groupByCategory(tableDataCategory, "owaspRank");
        let totalCountArray = [];
        for (const ele in sortedCategory) {
          let totalCount = 0;
          for (let i = 0; i < sortedCategory[ele].length; i++) {
            totalCount += sortedCategory[ele][i]["count"];
          }
          totalCountArray.push(totalCount);
        }
        $(".test-count").each(function (e) {
          $(this).html(totalCountArray[e]);
        });
      },
    });
  }
  function getParameters() {
    $.ajax({
      async: false,
      url: s + "/api/v1/apiseccheck/results?project-name=" + projectName,
      method: "GET",
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
      },
      success: function (resultData) {
        // document.getElementById("runbtn").disabled = true;
        if (resultData) {
          $("#loader").addClass("d-none");
          $("#main").removeClass("d-none");
          let tableDataParameters = [];
          for (const key in resultData.data.specAnalysis.piiList) {
            if (resultData.data.specAnalysis.piiList.hasOwnProperty(key)) {
              let paraName = key;
              let paraValue = resultData.data.specAnalysis.piiList[key];
              if (paraValue == false) paraValue = `<span>-</span>`;
              else
                paraValue = `<span class="p-1  font-weight-bold text-light rounded-3" style="background-color:#69bc6d;font-size:12px">PII</span>`;
              // paraValue = 'PII'
              // console.log(paraName,paraValue)
              tableDataParameters.push({ name: paraName, type: paraValue });
            }
          }
          let sortedParameters = tableDataParameters.sort((p1, p2) =>
            p1.type > p2.type ? 1 : p1.type < p2.type ? -1 : 0
          );
          // console.log(tableDataParameters)
          var columnsParameters = {
            name: "Name",
            type: "Category",
            // format: "Format",
          };
          // console.log(resultData.data.specAnalysis.piiList)
          var tableParameters = $("#parameters .parameter-table").tableSortable(
            {
              data: sortedParameters,
              // sorting: true,
              sorting: ["type"],
              columns: columnsParameters,
              searchField: "#searchFieldVariables",
              rowsPerPage: 10,
              pagination: true,
              sortingIcons: {
                asc: "<span>▼</span>",
                desc: "<span>▲</span>",
              },
            }
          );
          $("#changeRowsVariables").on("change", function () {
            tableParameters.updateRowsPerPage(parseInt($(this).val(), 10));
          });
          // console.log($(".parameter-table-virtual")[0].rows.length)
          if ($(".parameter-table-virtual")[0].rows.length == 1) {
            let doc = [];
            let tableDataParameters2 = " ";
            for (let i = 0; i < sortedParameters.length; i++) {
              doc[i] = $.parseHTML(sortedParameters[i].type)[0].innerHTML;
              tableDataParameters2 += `<tr><td class="text-center">${sortedParameters[i].name}</td>
                                       <td class="text-center">${doc[i]}</td></tr>`;
            }
            $(".parameter-table-virtual").append(tableDataParameters2);
          }
        }
      },
    });
  }
  function statusAPITest() {
    // const resultData = localStorage.getItem("testresult");
    // if (resultData) {
    //   // Use the stored data
    //   // processData(JSON.parse(resultData));
    //   console.log("resulData", resultData);
    //   $("#owaspTab").css("color", "#b8b9b9 !important;");
    //   $("#owaspTab.active").css("color", "rgb(2, 92, 122) !important;");
    $("#basicInfoTab").css("color", "#025c7a !important;");
    $("#basicInfoTab.active").css("color", "#025c7a !important;");
    //   $("#parametersTab").css("color", "#025c7a").css("important", "true");
    //   getParameters();
    //   getOwaspCoverage();
    // } else {
    var intervalId = setInterval(function () {
      $.ajax({
        url: s + "/api/v1/apiseccheck/status?project-name=" + projectName,
        method: "GET",
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
        },

        success: function (testresult) {
          let flag = 0;
          $("#messageValue").text(testresult.data);
          // localStorage.setItem("testresult", JSON.stringify(testresult));
          if (testresult.data != "Scan completed") {
            $("#loadingresultfree").removeClass("d-none");
          }
          if (testresult.data == "Scan completed") {
            $("#loadingresultfree").addClass("d-none");
            $("#parametersTab")
              .css("color", "#025c7a ")
              .css("important", "true");
            $("#owaspTab").css("color", "#025c7a").css("important", "true");
            getParameters();
            getOwaspCoverage();
            resultAPI();
            clearInterval(intervalId);
          }
          // console.log(testresult.data);
          if (testresult.data == "AI is identifying PII elements") {
            $("#progressOne").removeClass("d-none");
            $("#progressOne .progress-tooltip-info")
              .animate({ left: "25%" }, { duration: 2000 })
              .text("25%");
            $("#progressOne .progress")
              .text("25%")
              .val(25)
              .animate({ duration: 2000 });
            $("#paramsSpinner").removeClass("d-none");
            $("#targetNew").css("filter", "none");
            // $(".nav-tabs .nav-link").css("color", "#b8b9b9");
            $("#basicInfoTab")
              .css("color", "#025c7a;")
              .css("important", "true");
            $("#previousBtn2").prop("disabled", true);
            // $('#previousBtn2').addClass('disabled');
            // showDetails();
            // resultAPITest();
          } else if (
            testresult.data == "Test Case Generation Started" ||
            testresult.data == "Test Case Generation in progress"
          ) {
            $("#paramsSpinner").addClass("d-none");
            $("#owaspSpinner").removeClass("d-none");
            $("#progressOne .progress-tooltip-info")
              .animate({ left: "60%" }, { duration: 2000 })
              .text("60%");
            $("#progressOne .progress")
              .text("60%")
              .val(60)
              .animate({ duration: 2000 });
            $("#basicInfoTab")
              .css("color", "#025c7a;")
              .css("important", "true");
            // $("#parametersTab").tab("show");
            $("#owaspTab").css("color", "#b8b9b9 !important;");
            $("#owaspTab").css("color", "#b8b9b9").css("important", "true");
            $("#parametersTab div").addClass("animation-tilt-shaking");
            $("#parametersTab")
              .css("color", "#025c7a")
              .css("important", "true");
            $("#previousBtn2").prop("disabled", true);
            // $('#previousBtn2').addClass('disabled');

            // location.reload();
            getParameters();
            // showDetails();
            // getParameters();
            // resultAPITest();
          } else if (testresult.data == "Test Case Generation Completed") {
            $("#owaspTab.active").css("color", "rgb(2, 92, 122) !important;");
            $("#basicInfoTab")
              .css("color", "#025c7a;")
              .css("important", "true");

            $("#parametersTab")
              .css("color", "#025c7a")
              .css("important", "true");
            $(".nav-tabs .nav-link")
              .css("color", "#025c7a")
              .css("important", "true");
            $(".nav - tabs.nav - link.active").css("color", "#025c7a");
            $(".nav-tabs .nav-link").css("color", "#025c7a");
            $("#owaspTab").css("color", "#025c7a").css("important", "true");
            $("#owaspSpinner").addClass("d-none");
            $("#owaspTab div").addClass("animation-tilt-shaking");
            $("#progressOne .progress-tooltip-info")
              .animate({ left: "100%" }, { duration: 2000 })
              .text("100%");
            $("#progressOne .progress")
              .text("100%")
              .val(100)
              .animate({ duration: 2000 });
            $("#loadingresultfree").addClass("d-none");
            // #6B778C
            // $("#owaspTab").tab("show");
            document.getElementById("runbtn").disabled = false;
            $("#previousBtn2").prop("disabled", false);
            // $('#previousBtn2').addClass('disabled');
            getOwaspCoverage();
            getParameters();
            // location.reload();
            clearInterval(intervalId);

            // getOwaspCoverage();
            // showDetails();
          } else if (testresult.data == "Request timeout...") {
            clearInterval(intervalId);
            $("#loadingresultfree").addClass("d-none");
            $("#progressIcons").addClass("d-none");
            $("#timeout").removeClass("d-none");
            // $("#keyerror1").html(resultData.messages[0].value);
          }
          // else {

          // }
        },
        error: function (xhr, status, error) {
          // Handle any API errors here
        },
      });
    }, 5000);
    // }
  }
  $("#forwardbtn").click(function (event) {
    resultAPI();
  });

  // function callResultAPI() {}
  function resultAPI() {
    if (localStorage.getItem("resultPage") == "true") {
      $("#forwardbtn").removeClass("d-none");
      localStorage.removeItem("resultPage");
    } else {
      let mainURL = window.location.origin + "/productResult.html";
      let url3 = new URL(mainURL.replace("index.html", ""));
      url3.searchParams.set("project-name", projectName);
      window.location.replace(url3);
    }
  }

  function errorDisplay(resultData) {
    var resultMessages = resultData.messages[0].key.split(",")[0];
    // console.log(resultData,resultMessages);
    $("#runbtn").prop("disabled", false);
    $("#progressIcons").addClass("d-none");
    $("#loadingresultfree").addClass("d-none");
    $("#errorresult1").removeClass("d-none");
    $("#keyerror1").html(resultData.messages[0].value);
  }

  $("#previousBtn2").click(function (event) {
    localStorage.removeItem("resultPage");
    window.location.replace("product.html");
  });
});
