$(document).ready(function () {

    scan();
    hidecheck();
    $("#apiurl").addClass("d-none");
    $("#bearertoken").addClass("d-none");
    $("#emailpro2").addClass("d-none");
    $("#licensekey2").addClass("d-none");

    $("[rel=tooltip]").tooltip({ placement: 'right' });

});



function scan() {
    $('#btn').click(function () {
        $("#Features").addClass("d-none");
        $("#testresultfree").addClass("d-none");
        $("#errorresult").addClass("d-none");
        var testStart = Date.now();
        var openAPISpectemp = $('#openAPISpec').val();
        var openAPISpec = openAPISpectemp.replace("getpostman", "postman");
        // $("#email").next().hide();
        $("#openAPISpec").next().hide();
        if (openAPISpec == '') {
            $('.invalid-tooltip').show()
            return false;
        }
        $(this).prop('disabled', true);

        $("#testresultfree").addClass("d-none");
        $('.testdomain').text(openAPISpec);


        $("#loadingresultfree").removeClass("d-none");
        $("#progressIcons").removeClass("d-none");
        $("#scantime").removeClass("d-none");



        // progressStats();
        // $('.report').hide();
        var jsonData = { 'openAPISpec': openAPISpec };
        var hutk = document.cookie.replace(/(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        var HSData = {
            "submittedAt": testStart,
            "fields": [
                {
                    "objectTypeId": "0-1",
                    "name": "api_specification_url",
                    "value": openAPISpec
                }
            ],
            "context": {
                "pageUri": window.location.href,
                "pageName": "Free API Test",
                "ipAddress": "{ip_address}"
            }
        };
        $.ajax({
            url: 'https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck',
            method: 'POST',
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
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
                            $('#keyerror').text(keyMessage);
                            $('#errorvalue').html(messageValue);
                        }
                    }
                    $("#errorresult").removeClass("d-none");
                    $("#errorresult1").addClass("d-none");

                    $('#messageValue').addClass("d-none");
                    $("#loadingresultfree").addClass("d-none");
                    $("#progressIcons").addClass("d-none");
                    $('#scantime').addClass("d-none");
                    $('#btn').prop('disabled', false);

                }
                var intervalId = setInterval(function () {
                    $.ajax({
                        url: 'https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/status?project-name=' + result.data.name,
                        method: 'GET',
                        dataType: 'json',
                        headers: {
                            "Content-Type": "application/json"
                        },

                        success: function (testresult) {
                            $("#errorresult").addClass("d-none");
                            console.log('testresult',);
                            $('#messageValue').text(testresult.data)
                            if (testresult.data == 'API Security Test case Generation') {
                                $('#progre').removeClass('d-none')
                                $('#analyse').css('color', '#025c7a', 'font-weight', '600')
                                $('.hr-line').css('border-bottom', '3px solid #025c7a')
                            }
                            if (testresult.data == 'Security Test Execution') {
                                $('#settingdark').css('filter', 'none')
                                $('#generate').removeClass('d-none')
                                $('#generate').css('color', '#6c757d')
                                $('.hr-line1').css('border-bottom', '3px solid #025c7a')
                            }
                            if (testresult.data == 'Preparing Test Results') {
                                $('#targetNew').css('filter', 'none')
                                $('#running').removeClass('d-none')
                                $('#running').css('color', '#6c757d')
                                $('.hr-line2').css('border-bottom', '3px solid #025c7a')
                            }
                            if (testresult.data == 'Scan completed') {
                                $('#reporticon').css('filter', 'none')
                                $('#preparing').removeClass('d-none')
                                $('#preparing').css('color', '#6c757d');
                                $('#openAPISpec').val('');
                                $('#btn').prop('disabled', false);
                                $('#loadingresultfree').addClass('d-none')
                                $('#progressIcons').addClass('d-none')
                                clearInterval(intervalId);
                                resultAPI();
                            }
                        },
                        error: function (xhr, status, error) {
                            // Handle any API errors here
                        }

                    });
                }, 10000);





                function resultAPI() {
                    clearInterval(intervalId);
                    $("#errorresult").addClass("d-none");
                    $.ajax({
                        url: 'https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/results?project-name=' + result.data.name,
                        method: 'GET',
                        dataType: 'json',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        success: function (resultData) {
                            console.log('resultData', resultData);
                            var viewResult = resultData;
                            var apispecification = viewResult.data.openAPISpec;
                            var name = viewResult.data.name;
                            var APIdescription = viewResult.data.description;
                            var score = viewResult.data.testSummary.overallScore;
                            var totalEndpoints = viewResult.data.testSummary.totalEndpoints;
                            // var dateTested = viewResult.data.dateTested
                            var testEnvironment = viewResult.data.testSummary.testEnvironment;
                            var vulnerabilityScore = viewResult.data.testSummary.vulnerabilityScore;
                            var valueDataScore = viewResult.data.testSummary.valueDataScore;
                            var configurationScore = viewResult.data.testSummary.configurationScore;
                            var authenticationScore = viewResult.data.testSummary.authenticationScore;
                            var dateString = viewResult.data.dateTested;
                            var date = new Date(dateString);
                            var formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                            console.log(formattedDate);

                            var injectionsForEndpoints = viewResult.data.testSummary.injectionsForEndpoints;
                            var sixXFuzz = viewResult.data.testSummary.sixXFuzz;
                            var reflectedGetInjection = viewResult.data.testSummary.reflectedGetInjection;
                            var reflectedPOSTInjection = viewResult.data.testSummary.reflectedPOSTInjection;
                            var pii = viewResult.data.testSummary.pii;
                            // var moneyRelated = viewResult.data.testSummary.moneyRelated;
                            // var richContentUploads = viewResult.data.testSummary.richContentUploads;
                            var sslCertificateIssues = viewResult.data.testSummary.sslCertificateIssues;
                            var missingTLSHSTSHeaders = viewResult.data.testSummary.missingTLSHSTSHeaders;
                            var serverPropertiesLeakInHeaders = viewResult.data.testSummary.serverPropertiesLeakInHeaders;
                            var httpOptions = viewResult.data.testSummary.httpOptions;
                            var corsConfig = viewResult.data.testSummary.corsConfig;
                            var incrementalIDsForEndpoint = viewResult.data.testSummary.incrementalIDsForEndpoint;
                            var noAuth = viewResult.data.testSummary.noAuth;
                            var brokenAuthentication = viewResult.data.testSummary.brokenAuthentication;
                            var basicAuthentication = viewResult.data.testSummary.basicAuthentication;
                            barchart();
                            if (APIdescription === 'null') {
                                $("#descriptionForAPI").text('No Description');
                            }
                            else {
                                $("#descriptionForAPI").text(APIdescription)
                            }
                            if (injectionsForEndpoints === 'Passed') {
                                $("#injection").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else if (injectionsForEndpoints === 'Failed') {
                                $("#injection").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (sixXFuzz === 'Passed') {
                                $("#6fuzz").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }

                            else {
                                $("#6fuzz").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (reflectedGetInjection === 'Passed') {
                                $("#reflectedget").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#reflectedget").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (reflectedPOSTInjection === 'Passed') {
                                $("#reflectedpost").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#reflectedpost").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (pii === 'Passed') {
                                $("#piiData").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#piiData").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (sslCertificateIssues === 'Passed') {
                                $("#ssl").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#ssl").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (missingTLSHSTSHeaders === 'Passed') {
                                $("#missing").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#missing").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (serverPropertiesLeakInHeaders === 'Passed') {
                                $("#serverprop").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#serverprop").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (httpOptions === 'Passed') {
                                $("#httpoption").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#httpoption").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (corsConfig === 'Passed') {
                                $("#cors").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#cors").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (incrementalIDsForEndpoint === 'Passed') {
                                $("#incremental").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#incremental").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (noAuth === 'Passed') {
                                $("#noauth").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#noauth").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (brokenAuthentication === 'Passed') {
                                $("#brokenauth").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#brokenauth").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            if (basicAuthentication === 'Passed') {
                                $("#basicauth").html('<i class="fa fa-check-circle check" aria-hidden="true"></i>');
                            }
                            else {
                                $("#basicauth").html('<i class="fa fa-times-circle cross" aria-hidden="true"></i>');
                            }

                            $('#indexpageUI').hide().html();
                            $('#indexpageUI').hide().html('#resultPageOnUI');
                            $('#indexpageUI').addClass('d-none');
                            $('#resultPageOnUI').removeClass('d-none')
                            $('#dateTested').text(formattedDate);
                            $("#apispecification").text(apispecification)
                            $("#name").text(name)

                            $("#totalEndpoints").text(totalEndpoints)
                            $("#testEnvironment").text(testEnvironment)
                            $("#overallScore").text(score);

                            function barchart() {
                                var mychart
                                var xValues = ["Vulnerability", "Value Data", "Configuration", "Authentication"];
                                var yValues = [vulnerabilityScore, valueDataScore, configurationScore, authenticationScore];


                                var barColors = ["#dec15a", "#d65745", "#72ba2c", "#d65745"];
                                mychart = new Chart("myChart", {

                                    type: "bar",

                                    data: {
                                        labels: xValues,
                                        fontColor: ['#dec15a'],
                                        datasets: [{
                                            backgroundColor: barColors,
                                            data: yValues,
                                        }],
                                    },
                                    options: {

                                        legend: { display: false },
                                        title: {
                                            display: true,
                                        },

                                        scales: {
                                            yAxes: [{ ticks: { min: 0, stepSize: 50, max: 100 } }]
                                        }
                                    }
                                })

                            }





                        },
                        error: function (xhr, status, error) {
                            // Handle any API errors here
                        }

                    })
                }






            },
            error: function (error) {

                var err = eval("(" + error.responseText + ")");

                var errmsg = error.responseText
                if (err.status == '500') {
                    $("#errorresult1").removeClass("d-none");
                    $("#keyerror1").html("Internal Server Error");
                    $('#openAPISpec').val('');
                    $('#messageValue').addClass("d-none");
                    $("#loadingresultfree").addClass("d-none");
                    $("#progressIcons").addClass("d-none");
                    $('#scantime').addClass("d-none");
                    $('#btn').prop('disabled', false);
                    $("#errorresult").addClass("d-none");

                    // $("#errorscreen").removeClass("d-none")
                }
                else {
                    errorDisplay();
                }
                // console.log(error);
            }

        });

    })


}
function hidecheck() {

}
function updateProgress(progress) {
    var progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = progress + '%';
    progressBar.innerHTML = progress + '%';
    $("#text12").text()
}

function simulateProgress() {
    var progress = 0;
    var interval = setInterval(function () {
        progress += Math.floor(Math.random() * 10);
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        updateProgress(25);
        updateProgress(50);
        updateProgress(75);
        updateProgress(100);
    }, 500);
}




$(document).ready(function () {
    $('#runSample').click(function (e) {
        e.preventDefault();
        $('#openAPISpec').val('https://raw.githubusercontent.com/apisec-inc/Netbanking-Specs/main/ethicalcheck-netbanking-spec.json');
        setTimeout(function () {
            $("#btn").click();
        }, 1);
        // console.log($(''))
        console.log('clicked');
    })
});