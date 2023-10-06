import { getServer } from "./environment.js";
$(document).ready(function () {
  var s = getServer();
if (s === "http://5.161.99.171:8080") {
  $.ajax({
    url:
      s +
      "/api/v1/apiseccheck/results?project-name=Online%20Banking%20REST%20API%20WKMk",
    method: "GET",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    success: function (resultData) {
      if (resultData) {
        $("#loader").addClass("d-none");
        $("#main").removeClass("d-none");

        $("#subTitle").html("API Name:" + resultData.data.name);

        $(".basicinfo-table").CanvasJSChart({
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
          height: 300,
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
        let tableDataParameters = [];

        $("#parameters .parameter-table").append(tableDataParameters);

        $("#endpointCount").html(resultData.data.specAnalysis.totalEndpoints);
        $("#testsCount").html(resultData.data.specAnalysis.totalPlaybooks);
        let tableDataCategory = [];

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

            if (testsGenerated > 0) {
              tableDataCategory.push(
                resultData.data.specAnalysis.categoryWisePlaybookCountList[i]
              );
            }
          }
        }
        $("#headingOne .btn").click(function () {
          $(this).find(".fas").toggleClass("fa-plus fa-minus");
        });
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
        for (const key in resultData.data.specAnalysis.piiList) {
          if (resultData.data.specAnalysis.piiList.hasOwnProperty(key)) {
            let paraName = key;
            let paraValue = resultData.data.specAnalysis.piiList[key];
            if (paraValue == false) paraValue = "-";
            else
              paraValue = `<span class="p-1  font-weight-bold text-light rounded-3" style="background-color:#69bc6d;font-size:12px">PII</span>`;

            tableDataParameters.push({ name: paraName, type: paraValue });
          }
        }
        let sortedParameters = tableDataParameters.sort((p1, p2) =>
          p1.type < p2.type ? 1 : p1.type > p2.type ? -1 : 0
        );
        var columnsParameters = {
          name: "Name",
          type: "Category",
        };
        var tableParameters = $("#parameters .parameter-table").tableSortable({
          data: sortedParameters,
          sorting: ["type"],
          columns: columnsParameters,
          searchField: "#searchFieldVariables",
          rowsPerPage: 10,
          pagination: true,
          sortingIcons: {
            asc: "<span>▼</span>",
            desc: "<span>▲</span>",
          },
        });
        $("#changeRowsVariables").on("change", function () {
          tableParameters.updateRowsPerPage(parseInt($(this).val(), 10));
        });

        $("#description").html(
          "<span class='font-weight-bold fs-6'>Description:</span>" +
            resultData.data.description
        );
        $("#openApiSec").html(
          "<span class='font-weight-bold fs-6'>API Specification:</span>" +
            resultData.data.openAPISpec
        );
      }
    },
    error: function (xhr, status, error) {},
  });
} else if (s === "http://apisecfree-stg-ui.apisec.ai:8080") {
  $.ajax({
    url:
      s +
      "/api/v1/apiseccheck/results?project-name=Online%20Banking%20REST%20API%20Ezgr",
    method: "GET",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    success: function (resultData) {
      if (resultData) {
        $("#loader").addClass("d-none");
        $("#main").removeClass("d-none");

        $("#subTitle").html("API Name:" + resultData.data.name);

        $(".basicinfo-table").CanvasJSChart({
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
          height: 300,
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
        let tableDataParameters = [];

        $("#parameters .parameter-table").append(tableDataParameters);

        $("#endpointCount").html(resultData.data.specAnalysis.totalEndpoints);
        $("#testsCount").html(resultData.data.specAnalysis.totalPlaybooks);
        let tableDataCategory = [];

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

            if (testsGenerated > 0) {
              tableDataCategory.push(
                resultData.data.specAnalysis.categoryWisePlaybookCountList[i]
              );
            }
          }
        }
        $("#headingOne .btn").click(function () {
          $(this).find(".fas").toggleClass("fa-plus fa-minus");
        });
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
        for (const key in resultData.data.specAnalysis.piiList) {
          if (resultData.data.specAnalysis.piiList.hasOwnProperty(key)) {
            let paraName = key;
            let paraValue = resultData.data.specAnalysis.piiList[key];
            if (paraValue == false) paraValue = "-";
            else
              paraValue = `<span class="p-1  font-weight-bold text-light rounded-3" style="background-color:#69bc6d;font-size:12px">PII</span>`;

            tableDataParameters.push({ name: paraName, type: paraValue });
          }
        }
        let sortedParameters = tableDataParameters.sort((p1, p2) =>
          p1.type < p2.type ? 1 : p1.type > p2.type ? -1 : 0
        );
        var columnsParameters = {
          name: "Name",
          type: "Category",
        };
        var tableParameters = $("#parameters .parameter-table").tableSortable({
          data: sortedParameters,
          sorting: ["type"],
          columns: columnsParameters,
          searchField: "#searchFieldVariables",
          rowsPerPage: 10,
          pagination: true,
          sortingIcons: {
            asc: "<span>▼</span>",
            desc: "<span>▲</span>",
          },
        });
        $("#changeRowsVariables").on("change", function () {
          tableParameters.updateRowsPerPage(parseInt($(this).val(), 10));
        });

        $("#description").html(
          "<span class='font-weight-bold fs-6'>Description:</span>" +
            resultData.data.description
        );
        $("#openApiSec").html(
          "<span class='font-weight-bold fs-6'>API Specification:</span>" +
            resultData.data.openAPISpec
        );
      }
    },
    error: function (xhr, status, error) {},
  });
} else if (s === "https://apiseccheck-image-4w7ghmnvva-uw.a.run.app") {
  $.ajax({
    url:
      s +
      "/api/v1/apiseccheck/results?project-name=Online%20Banking%20REST%20API%20MIWH",
    method: "GET",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    success: function (resultData) {
      if (resultData) {
        $("#loader").addClass("d-none");
        $("#main").removeClass("d-none");

        $("#subTitle").html("API Name:" + resultData.data.name);

        $(".basicinfo-table").CanvasJSChart({
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
          height: 300,
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
        let tableDataParameters = [];

        $("#parameters .parameter-table").append(tableDataParameters);

        $("#endpointCount").html(resultData.data.specAnalysis.totalEndpoints);
        $("#testsCount").html(resultData.data.specAnalysis.totalPlaybooks);
        let tableDataCategory = [];

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

            if (testsGenerated > 0) {
              tableDataCategory.push(
                resultData.data.specAnalysis.categoryWisePlaybookCountList[i]
              );
            }
          }
        }
        $("#headingOne .btn").click(function () {
          $(this).find(".fas").toggleClass("fa-plus fa-minus");
        });
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
        for (const key in resultData.data.specAnalysis.piiList) {
          if (resultData.data.specAnalysis.piiList.hasOwnProperty(key)) {
            let paraName = key;
            let paraValue = resultData.data.specAnalysis.piiList[key];
            if (paraValue == false) paraValue = "-";
            else
              paraValue = `<span class="p-1  font-weight-bold text-light rounded-3" style="background-color:#69bc6d;font-size:12px">PII</span>`;

            tableDataParameters.push({ name: paraName, type: paraValue });
          }
        }
        let sortedParameters = tableDataParameters.sort((p1, p2) =>
          p1.type < p2.type ? 1 : p1.type > p2.type ? -1 : 0
        );
        var columnsParameters = {
          name: "Name",
          type: "Category",
        };
        var tableParameters = $("#parameters .parameter-table").tableSortable({
          data: sortedParameters,
          sorting: ["type"],
          columns: columnsParameters,
          searchField: "#searchFieldVariables",
          rowsPerPage: 10,
          pagination: true,
          sortingIcons: {
            asc: "<span>▼</span>",
            desc: "<span>▲</span>",
          },
        });
        $("#changeRowsVariables").on("change", function () {
          tableParameters.updateRowsPerPage(parseInt($(this).val(), 10));
        });

        $("#description").html(
          "<span class='font-weight-bold fs-6'>Description:</span>" +
            resultData.data.description
        );
        $("#openApiSec").html(
          "<span class='font-weight-bold fs-6'>API Specification:</span>" +
            resultData.data.openAPISpec
        );
      }
    },
    error: function (xhr, status, error) {},
  });
}
  $("#sampleRunBtn").click(function () {
   window.location.replace('sample.html')
  });
  $("#previousBtn2").click(function (event) {
    window.location.replace("product.html");
  });
});