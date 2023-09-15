import { getServer } from "./environment.js";
// import {resultAPI} from "./productResult.js";
$(document).ready(function () {
  let url2 = new URL(window.location.href);
  let projectName = url2.searchParams.get("project-name");
  var s = getServer();
  $.ajax({
    async: false,
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
      if(resultData == ''){
        console.log("jjjjjkf")
      }
      $('#subTitle').html(resultData.data.name);
      let tableDataParameters = [];
      for (let i = 0; i < resultData.data.specAnalysis.variablesList.length; i++) {
        let variableFormat = resultData.data.specAnalysis.variablesList[i].format;
        if(variableFormat == null) 
                 variableFormat = "-";
        resultData.data.specAnalysis.variablesList[i].format = variableFormat;
        tableDataParameters.push(resultData.data.specAnalysis.variablesList[i]);
      }
    
      // for (let i = 0; i < resultData.data.specAnalysis.variablesList.length; i++) {
      //   let variableFormat = resultData.data.specAnalysis.variablesList[i].format;
      //   tableDataParameters += `<tr><td class="text-center">${resultData.data.specAnalysis.variablesList[i].name}</td>
      //   <td class="text-center">${resultData.data.specAnalysis.variablesList[i].type}</td>
      //   <td class="text-center">${variableFormat == null ? "-" : variableFormat}</td>
      //   </tr>`;
      // }
      // $('#parameters .parameter-table').append(tableDataParameters);

      $('#endpointCount').html(resultData.data.specAnalysis.totalEndpoints);
      $('#testsCount').html(resultData.data.specAnalysis.totalPlaybooks);

      let tableDataCategory = [];
      
      // function sortJSON(arr, key, asc=true) {
      //   return arr.sort((a, b) => {
      //     let x = a[key];
      //     let y = b[key];
      //     if (asc) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
      //     else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
      //   });
      // }
      // let output = sortJSON(resultData.data.specAnalysis.categoryWisePlaybookCountList, "owaspRank", true);
     
      // for (let i = 0; i < resultData.data.specAnalysis.categoryWisePlaybookCountList.length; i++) {
      //   let testsGenerated = resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count;
      //   if (testsGenerated > 0) {
      //     tableDataCategory += `<tr><td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].owaspRank}</td>
      //   <td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].label}</td>
      //   <td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count}</td>
      //   </tr>`;
      //   }
      // }
    
      // $('#OWASP .owasp-table').append(tableDataCategory);
       
        for (let i = 0; i < resultData.data.specAnalysis.categoryWisePlaybookCountList.length; i++) {
        let testsGenerated = resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count;
        if (testsGenerated > 0) {
            tableDataCategory.push(resultData.data.specAnalysis.categoryWisePlaybookCountList[i]);
        }
      }

      var columnsCategory = {
        owaspRank: "OWASP Ranking",
        label: "Category",
        count: "Number of Tests Generated",
       
      };
      var columnsParameters = {
        name: "Name",
        type: "Type",
        format: "Format",
      };

        var tableCategory = $("#OWASP .owasp-table").tableSortable({
          data: tableDataCategory,
          sorting: true,
          columns: columnsCategory,
          searchField: "#searchFieldCategory",
          rowsPerPage: 5,
          pagination: true,
          sortingIcons: {
             asc:'<span>▼</span>',
             desc:'<span>▲</span>',
                },

        });
        $("#changeRowsCategory").on("change", function () {
          tableCategory.updateRowsPerPage(parseInt($(this).val(), 10));
        });

        var tableParameters = $("#parameters .parameter-table").tableSortable({
          data: tableDataParameters,
          sorting: true,
          columns: columnsParameters,
          searchField: "#searchFieldVariables",
          rowsPerPage: 5,
          pagination: true,
          sortingIcons: {
             asc:'<span>▼</span>',
             desc:'<span>▲</span>',
                },

        });
        $("#changeRowsVariables").on("change", function () {
          tableParameters.updateRowsPerPage(parseInt($(this).val(), 10));
        });
     
       
   
      function tableToCSVOWASPRanking() {
        var csv_data = [];
        console.log($('#OWASP .owasp-table .gs-table')[0])
        var rows = $('#OWASP .owasp-table .gs-table')[0].rows;
        for (var i = 0; i < rows.length; i++) {
            var cols = rows[i].querySelectorAll('td,th span');
            var csvrow = [];
            for (var j = 0; j < cols.length; j++) {
              csvrow.push(cols[j].innerHTML);
            }
            csv_data.push(csvrow.join(","));
        }
        csv_data = csv_data.join('\n');
        // console.log(csv_data)
        downloadCSVFileOWASPRanking(csv_data);
      }

      function downloadCSVFileOWASPRanking(csv_data) {
         var CSVFile = new Blob([csv_data], {
            type: "text/csv"
        });
        var temp_link = document.createElement('a');
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
        console.log($('#parameters .parameter-table .gs-table')[0])
        var rows = $('#parameters .parameter-table .gs-table')[0].rows;
        for (var i = 0; i < rows.length; i++) {
            var cols = rows[i].querySelectorAll('td,th span');
            var csvrow = [];
            for (var j = 0; j < cols.length; j++) {
              csvrow.push(cols[j].innerHTML);
            }
            csv_data.push(csvrow.join(","));
        }
        csv_data = csv_data.join('\n');
        // console.log(csv_data)
        downloadCSVFileVariables(csv_data);
      }

      function downloadCSVFileVariables(csv_data) {
         var CSVFile = new Blob([csv_data], {
            type: "text/csv"
        });
        var temp_link = document.createElement('a');
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

      
      let tableDataMethod = [];
      for (let i = 0; i < resultData.data.specAnalysis.countEndpointsByMethodList.length; i++) {
        tableDataMethod.push(resultData.data.specAnalysis.countEndpointsByMethodList[i])
      }
   
      var columnsMethod = {
        method:"Method",
        count:"Count"
      }

      var tableMethod = $("#basicInfo .basicinfo-table").tableSortable({
        data: tableDataMethod,
        sorting: true,
        columns: columnsMethod,
        // searchField: "#searchField",
        rowsPerPage: 5,
        pagination: true,
        // sortingIcons: {
        //    asc:'<span>▼</span>',
        //    desc:'<span>▲</span>',
        //       },

      });

      // $('#basicInfo .basicinfo-table').append(tableDataMethod);
      $('#description').html("<span class='font-weight-bold fs-6'>Description:</span>" + resultData.data.description)
      // $('#openApiSec').html("<span class='font-weight-bold fs-6'>API Specification:</span>" + localStorage.getItem("fileName"))
      $('#openApiSecContent').html(resultData.data.isFileUpload ? showOpenAPISpec():resultData.data.openAPISpec)
      
      function showOpenAPISpec(){
        // console.log("openAPIsec",resultData.data.openAPISpec.length);
        if(resultData.data.openAPISpec.length > 250){
          let dataopenAPISpec = `${resultData.data.openAPISpec.substring(1,250)}...`
          $('#openApiSecContent').html(dataopenAPISpec);
          $('#openApiSecContentMore').html(resultData.data.openAPISpec);
          $('.show-more').removeClass('d-none');
          $('.show-more').click(function(){
            $('#openApiSecContentMore').removeClass('d-none')
            $('.show-less').removeClass('d-none')
            $(this).addClass('d-none')
            $('#openApiSecContent').addClass('d-none');

          })
          $('.show-less').click(function(){
            $(this).addClass('d-none')
            $('#openApiSecContentMore').addClass('d-none')
            $('#openApiSecContent').removeClass('d-none');
            $('.show-more').removeClass('d-none');

          })
        }
        else{
          $('#openApiSecContent').html(resultData.data.openAPISpec)

        }
      }
    
      
      localStorage.setItem("detailsURL",window.location.href)
      $("#OWASPRankingDownloadBtn").click(function(){
        tableToCSVOWASPRanking();
      });
      $("#variablesDownloadBtn").click(function(){
        tableToCSVVariables();
      });

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
      if(resultData.errors === true){
        // console.log("errors",resultData);
        errorDisplay(resultData);
      }
      else{
        if (resultData.data == "Scan Request Submitted" || resultData.data == "Scan completed") {
          // $("#scantime").removeClass("d-none");
            $('#progressIcons').removeClass('d-none')
            $('#loadingresultfree').removeClass('d-none')
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
                // console.log(testresult.data);
                if (testresult.data == "Security Test Execution") {
                  
                  $("#targetNew").css("filter", "none");
                  $("#running").removeClass("d-none");
                  $("#running").css("color", "#025c7a", "font-weight", "600");
                  $(".hr-line2").css("border-bottom", "3px solid #025c7a");

                }

                if (testresult.data == "Preparing Test Results") {
                 
                  $("#reporticon").css("filter", "none");
                  $("#preparing").removeClass("d-none");
                  $("#preparing").css("color", "#025c7a", "font-weight", "600");
                }

                if (testresult.data == "Scan completed") {
                  flag = 0;
                
                  $("#openAPISpec").val("");
                  $("#btn").prop("disabled", false);
                  $("#loadingresultfree").addClass("d-none");
                  $("#progressIcons").addClass("d-none");
                  $("#runbtn").prop('disabled',false)
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
   
  function errorDisplay(resultData){
    var resultMessages = resultData.messages[0].key.split(",")[0];
    // console.log(resultData,resultMessages);
    $('#runbtn').prop('disabled', false);
    $('#progressIcons').addClass('d-none')
    $('#loadingresultfree').addClass('d-none')
    $("#errorresult1").removeClass("d-none");
    $("#keyerror1").html(resultData.messages[0].value)

  }

  $("#previousBtn2").click(function (event) {
    window.location.replace("product.html");
  });

});
