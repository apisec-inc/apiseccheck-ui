import { getServer } from "./environment.js";
$(document).ready(function () {
  var s = getServer();
  $.ajax({
    url:
      s +
      "/api/v1/apiseccheck/results?project-name=Online%20Banking%20REST%20API%20WuNU",
    method: "GET",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    success: function (resultData) {
      $("#subTitle").html(resultData.data.name);
      let tableDataParameters = "";
      for (
        let i = 0;
        i < resultData.data.specAnalysis.variablesList.length;
        i++
      ) {
        let variableFormat =
          resultData.data.specAnalysis.variablesList[i].format;
        tableDataParameters += `<tr><td class="text-center">${
          resultData.data.specAnalysis.variablesList[i].name
        }</td>
        <td class="text-center">${
          resultData.data.specAnalysis.variablesList[i].type
        }</td>
        <td class="text-center">${
          variableFormat == null ? "-" : variableFormat
        }</td>
        </tr>`;
      }
      $("#parameters .parameter-table").append(tableDataParameters);

      $("#endpointCount").html(resultData.data.specAnalysis.totalEndpoints);
      $("#testsCount").html(resultData.data.specAnalysis.totalPlaybooks);

      let tableDataCategory = "";

      function sortJSON(arr, key, asc = true) {
        return arr.sort((a, b) => {
          let x = a[key];
          let y = b[key];
          if (asc) {
            return x < y ? -1 : x > y ? 1 : 0;
          } else {
            return x > y ? -1 : x < y ? 1 : 0;
          }
        });
      }
      let output = sortJSON(
        resultData.data.specAnalysis.categoryWisePlaybookCountList,
        "owaspRank",
        true
      );
      for (
        let i = 0;
        i < resultData.data.specAnalysis.categoryWisePlaybookCountList.length;
        i++
      ) {
        let testsGenerated =
          resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count;
        if (testsGenerated > 0) {
          tableDataCategory += `<tr><td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].owaspRank}</td>
        <td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].label}</td>
        <td class="text-center">${resultData.data.specAnalysis.categoryWisePlaybookCountList[i].count}</td>
        </tr>`;
        }
      }

      $("#OWASP .owasp-table").append(tableDataCategory);

      function tableToCSVOWASPRanking() {
        var csv_data = [];
        var rows = $("#OWASP .owasp-table")[0].rows;
        for (var i = 0; i < rows.length; i++) {
          var cols = rows[i].querySelectorAll("td,th");
          var csvrow = [];
          for (var j = 0; j < cols.length; j++) {
            csvrow.push(cols[j].innerHTML);
          }
          csv_data.push(csvrow.join(","));
        }
        csv_data = csv_data.join("\n");
        console.log(csv_data);
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
        var rows = $("#parameters .parameter-table")[0].rows;
        for (var i = 0; i < rows.length; i++) {
          var cols = rows[i].querySelectorAll("td,th");
          var csvrow = [];
          for (var j = 0; j < cols.length; j++) {
            csvrow.push(cols[j].innerHTML);
          }
          csv_data.push(csvrow.join(","));
        }
        csv_data = csv_data.join("\n");
        console.log(csv_data);
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

      let tableDataMethod = "";
      for (
        let i = 0;
        i < resultData.data.specAnalysis.countEndpointsByMethodList.length;
        i++
      ) {
        tableDataMethod += `<tr><td class="text-center">${resultData.data.specAnalysis.countEndpointsByMethodList[i].method}</td>
        <td class="text-center">${resultData.data.specAnalysis.countEndpointsByMethodList[i].count}</td>
       
        </tr>`;
      }
      $("#basicInfo .basicinfo-table").append(tableDataMethod);
      $("#description").html(
        "<span class='font-weight-bold fs-6'>Description:</span>" +
          resultData.data.description
      );
      $("#openApiSec").html(
        "<span class='font-weight-bold fs-6'>API Specification:</span>" +
          resultData.data.openAPISpec
      );

      localStorage.setItem("detailsURL", window.location.href);
      $("#OWASPRankingDownloadBtn").click(function () {
        tableToCSVOWASPRanking();
      });
      $("#variablesDownloadBtn").click(function () {
        tableToCSVVariables();
      });
    },
    error: function (xhr, status, error) {},
  });
  $("#sampleRunBtn").click(function () {
   window.location.replace('sample.html')
  });
  $("#previousBtn2").click(function (event) {
    window.location.replace("product.html");
  });

});