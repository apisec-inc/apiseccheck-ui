import { getServer } from "./environment.js";
// import {resultAPI} from "./productResult.js";
$(document).ready(function () {
  let url2 = new URL(window.location.href);
  let projectName = url2.searchParams.get("project-name");
  var s = getServer();
  $.ajax({
    url:
      s +
      "/api/v1/apiseccheck/results?project-name=" +
      projectName,
    method: "GET",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    success: function (resultData) {
    
      $('#subTitle').html(resultData.data.name);
      let tableDataParameters = '';
      for (let i = 0; i < resultData.data.specAnalysis.variablesList.length; i++) {
        let variableFormat = resultData.data.specAnalysis.variablesList[i].format;
        tableDataParameters += `<tr><td class="text-left">${resultData.data.specAnalysis.variablesList[i].name}</td>
        <td class="text-left">${resultData.data.specAnalysis.variablesList[i].type}</td>
        <td class="text-left">${variableFormat == null ? "-" : variableFormat}</td>
        </tr>`;
      }
      $('#parameters .parameter-table').append(tableDataParameters);

      $('#endpointCount').html(resultData.data.specAnalysis.totalEndpoints);
      $('#testsCount').html(resultData.data.specAnalysis.totalPlaybooks);

      let tableDataCategory = '';
      
      function sortJSON(arr, key, asc=true) {
        return arr.sort((a, b) => {
          let x = a[key];
          let y = b[key];
          if (asc) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
          else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
        });
      }
      let output = sortJSON(resultData.data.specAnalysis.categoryWisePlaybookCountList, "owaspRank", true);
      // console.log(output)
      for (let i = 0; i < resultData.data.specAnalysis.categoryWisePlaybookCountList.length; i++) {
        let testsGenerated = resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count;
        if (testsGenerated > 0) {
          tableDataCategory += `<tr><td class="text-left">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].owaspRank}</td>
        <td class="text-left">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].label}</td>
        <td class="text-left">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count}</td>
        </tr>`;
        }
      }
    
      $('#OWASP .owasp-table').append(tableDataCategory);


      let tableDataMethod = '';
      for (let i = 0; i < resultData.data.specAnalysis.countEndpointsByMethodList.length; i++) {
        tableDataMethod += `<tr><td class="text-left">${resultData.data.specAnalysis.countEndpointsByMethodList[i].method}</td>
        <td class="text-left">${resultData.data.specAnalysis.countEndpointsByMethodList[i].count}</td>
       
        </tr>`;
      }
      $('#basicInfo .basicinfo-table').append(tableDataMethod);
      $('#description').html("<span class='font-weight-bold fs-6'>Description:</span>" + resultData.data.description)
      $('#openApiSec').html("<span class='font-weight-bold fs-6'>OpenAPI Spec:</span>" + resultData.data.openAPISpec)

      //to go back to details page from product page 
      
      localStorage.setItem("detailsURL",window.location.href)
    },
    error: function (xhr, status, error) {
      // Handle any API errors here
    },
  });
  $("#runbtn").click(function () {
    $(this).prop('disabled', true);
    $('#progressIcons').removeClass('d-none')
    $('#loadingresultfree').removeClass('d-none')

    runTests();
  });
  function runTests() {
    $.ajax({
      url:
        s +
        "/api/v1/apiseccheck/scan?project-name=" +
        projectName,
      method: "POST",
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
      },
      success: function (resultData) {
        if (resultData.data == "Scan Request Submitted") {
          $("#scantime").removeClass("d-none");
          var intervalId = setInterval(function () {
            $.ajax({
              url:
                s +
                "/api/v1/apiseccheck/status?project-name=" +
                projectName,
              method: "GET",
              dataType: "json",
              headers: {
                "Content-Type": "application/json",
              },

              success: function (testresult) {
                let flag = 0;
                $("#messageValue").text(testresult.data);
                if (testresult.data == "Security Test Execution") {
                  $("#settingdark").css("filter", "none");
                  flag = 1;
                  $("#generate").removeClass("d-none");
                  $("#generate").css("color", "#025c7a", "font-weight", "600");
                  $(".hr-line1").css("border-bottom", "3px solid #025c7a");

                }

                if (testresult.data == "Preparing Test Results") {
                  flag = 0;
                  $("#targetNew").css("filter", "none");
                  $("#running").removeClass("d-none");
                  $("#running").css("color", "#025c7a", "font-weight", "600");
                  $(".hr-line2").css("border-bottom", "3px solid #025c7a");
                }

                if (testresult.data == "Scan completed") {
                  flag = 0;
                  $("#reporticon").css("filter", "none");
                  $("#preparing").removeClass("d-none");
                  $("#preparing").css("color", "#025c7a", "font-weight", "600");
                  $("#openAPISpec").val("");
                  $("#btn").prop("disabled", false);
                  $("#loadingresultfree").addClass("d-none");
                  $("#progressIcons").addClass("d-none");
                  resultAPI();

                  clearInterval(intervalId);

                }


              },
              error: function (xhr, status, error) {
                // Handle any API errors here
              },
            });
          }, 10000);
        }
      },
      error: function (xhr, status, error) {

      },
    });

  }

  function resultAPI() {
    let mainURL = window.location.origin + "/productResult.html";
    let url3 = new URL(mainURL.replace("index.html", ""));
    url3.searchParams.set("project-name", projectName);
    window.location.replace(url3);
  }

  $("#previousBtn2").click(function (event) {
    window.location.replace("product.html");
  });

});
