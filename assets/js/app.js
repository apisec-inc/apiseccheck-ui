$(document).ready(function () {

    scan();
    barchart();
    hidecheck();
    $("#apiurl").addClass("d-none");
    $("#bearertoken").addClass("d-none");
    $("#emailpro2").addClass("d-none");
    $("#licensekey2").addClass("d-none");





});

function barchart() {
    var mychart
    var xValues = ["Vulnerability", "Value Data", "Configuration", "Authentication"];
    var yValues = [100, 100, 100, 100];
    var barColors = ["#dec15a", "#d65745", "#72ba2c", "#d65745"];

    mychart = new Chart("myChart", {
        type: "bar",
        data: {
            labels: xValues,
            fontColor: ['#dec15a'],
            datasets: [{
                backgroundColor: barColors,
                data: yValues
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
        event.preventDefault();
        $.ajax({
            url: 'https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck',
            method: 'POST',
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(jsonData),
            success: function (result) {
                console.log('result', result);
                $('#resultFeatures').removeClass('d-none');

                var intervalId = setInterval(function () {
                    $.ajax({
                        url: 'https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/status?project-name=' + result.data.name,
                        method: 'GET',
                        dataType: 'json',
                        headers: {
                            "Content-Type": "application/json"
                        },

                        success: function (testresult) {
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
                                $('#scancomp').css('filter', 'none')
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




                // 
                function resultAPI() {
                    clearInterval(intervalId);
                    $.ajax({
                        url: 'https://apiseccheck-image-4w7ghmnvva-uw.a.run.app/api/v1/apiseccheck/results?project-name=' + result.data.name,
                        method: 'GET',
                        dataType: 'json',
                        headers: {
                            "Content-Type": "application/json"
                        },

                        success: function (resultData) {
                            $('#indexpageUI').hide().html();
                            $('#indexpageUI').hide().html('#resultPageOnUI');
                            $('#indexpageUI').addClass('d-none');
                            $('#resultPageOnUI').removeClass('d-none')
                            console.log('resultData', resultData);
                            var viewResult = resultData
                            var apispecification = viewResult.data.openAPISpec
                            var name = viewResult.data.name
                            var description = viewResult.data.description
                            var score = viewResult.data.testSummary.overallScore
                            var totalEndpoints = viewResult.data.testSummary.totalEndpoints
                            // var dateTested = viewResult.data.dateTested
                            var testEnvironment = viewResult.data.testSummary.testEnvironment
                            var dateString = viewResult.data.dateTested;
                            var date = new Date(dateString);
                            var formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                            console.log(formattedDate);
                            var injectionsForEndpoints = viewResult.data.testSummary.injectionsForEndpoints;
                            var sixXFuzz = viewResult.data.testSummary.sixXFuzz;
                            var reflectedGetInjection = viewResult.data.testSummary.reflectedGetInjection;
                            var reflectedPOSTInjection = viewResult.data.testSummary.reflectedPOSTInjection;
                            var pii = viewResult.data.testSummary.pii;
                            var moneyRelated = viewResult.data.testSummary.moneyRelated;
                            var richContentUploads = viewResult.data.testSummary.richContentUploads;
                            var sslCertificateIssues = viewResult.data.testSummary.sslCertificateIssues;
                            var missingTLSHSTSHeaders = viewResult.data.testSummary.missingTLSHSTSHeaders;
                            var serverPropertiesLeakInHeaders = viewResult.data.testSummary.serverPropertiesLeakInHeaders;
                            var httpOptions = viewResult.data.testSummary.httpOptions;
                            var corsConfig = viewResult.data.testSummary.corsConfig;
                            var incrementalIDsForEndpoint = viewResult.data.testSummary.incrementalIDsForEndpoint;
                            var noAuth = viewResult.data.testSummary.noAuth;
                            var brokenAuthentication = viewResult.data.testSummary.brokenAuthentication;
                            var basicAuthentication = viewResult.data.testSummary.basicAuthentication;
                            for (var i = 0; i < viewResult.data.testSummary.length; i++) {
                                if (viewResult.data.testSummary[i].injectionsForEndpoints == 'passed') {
                                    $('#passed').removeClass('d-none');
                                }
                                if (viewResult.data.testSummary[i].injectionsForEndpoints == 'passed') {
                                    $('#failed').removeClass('d-none');
                                }

                            }

                            $('#dateTested').text(formattedDate);
                            $("#apispecification").text(apispecification)
                            $("#name").text(name)
                            $("#description").text(description)
                            $("#totalEndpoints").text(totalEndpoints)
                            $("#testEnvironment").text(testEnvironment)
                            $("#overallScore").text(score);
                            $('#injectionsForEndpoints').text(injectionsForEndpoints)
                            if (injectionsForEndpoints == 'failed') {
                                $('#injectionsForEndpoints').html(' <i class="fa fa-times-circle cross d-none" aria-hidden="true"></i>')
                            }
                            if (injectionsForEndpoints == 'passed') {
                                $('#injectionsForEndpoints').html('<i class="fa fa-check-circle check d-none" aria-hidden="true" id=""></i>')
                            }
                            $('#sixXFuzz').text(sixXFuzz)
                            $('#reflectedGetInjection').text(reflectedGetInjection)
                            $('#reflectedPOSTInjection').text(reflectedPOSTInjection)
                            $('#pii').text(pii)
                            $('#moneyRelated').text(moneyRelated)
                            $('#richContentUploads').text(richContentUploads)
                            $('#sslCertificateIssues').text(sslCertificateIssues)
                            $('#missingTLSHSTSHeaders').text(missingTLSHSTSHeaders)
                            $('#serverPropertiesLeakInHeaders').text(serverPropertiesLeakInHeaders)
                            $('#httpOptions').text(httpOptions)
                            $('#corsConfig').text(corsConfig)
                            $('#incrementalIDsForEndpoint').text(incrementalIDsForEndpoint)
                            $('#noAuth').text(noAuth)
                            $('#brokenAuthentication').text(brokenAuthentication)
                            $('#basicAuthentication').text(basicAuthentication)

                                // for (var key in viewResult.data.testSummary) {
                                //     if (viewResult.data.testSummary.hasOwnProperty(key)) {
                                //         console.log(key + ": " + viewResult.data.testSummary[key]);
                                //     }
                                //     if (viewResult.data.testSummary.hasOwnProperty(injectionsForEndpoints || sixXFuzz) == 'passed') {
                                //         $('#passed').removeClass('d-none');
                                //     }
                                //     if (viewResult.data.testSummary.hasOwnProperty(injectionsForEndpoints || sixXFuzz) == 'failed') {
                                //         $('#failed').removeClass('d-none');
                                //     }
                                // }
                                // if (viewResult.data.testSummary.injectionsForEndpoints && viewResult.data.testSummary.sixXFuzz && viewResult.data.testSummary.reflectedGetInjection && viewResult.data.testSummary.reflectedPOSTInjection && viewResult.data.testSummary.pii && viewResult.data.testSummary.moneyRelated && viewResult.data.testSummary.richContentUploads && viewResult.data.testSummary.sslCertificateIssues && viewResult.data.testSummary.missingTLSHSTSHeaders && viewResult.data.testSummary.serverPropertiesLeakInHeaders && viewResult.data.testSummary.httpOptions && viewResult.data.testSummary.corsConfig && viewResult.data.testSummary.incrementalIDsForEndpoint && viewResult.data.testSummary.noAuth && viewResult.data.testSummary.brokenAuthentication && viewResult.data.testSummary.basicAuthentication === 'failed') {
                                //     $('#failed').removeClass('d-none');
                                //     $('#na').hide();
                                // }
                                // else if (viewResult.data.testSummary.injectionsForEndpoints && viewResult.data.testSummary.sixXFuzz && viewResult.data.testSummary.reflectedGetInjection && viewResult.data.testSummary.reflectedPOSTInjection && viewResult.data.testSummary.pii && viewResult.data.testSummary.moneyRelated && viewResult.data.testSummary.richContentUploads && viewResult.data.testSummary.sslCertificateIssues && viewResult.data.testSummary.missingTLSHSTSHeaders && viewResult.data.testSummary.serverPropertiesLeakInHeaders && viewResult.data.testSummary.httpOptions && viewResult.data.testSummary.corsConfig && viewResult.data.testSummary.incrementalIDsForEndpoint && viewResult.data.testSummary.noAuth && viewResult.data.testSummary.brokenAuthentication && viewResult.data.testSummary.basicAuthentication == 'passed') {
                                //     $('#passed').removeClass('d-none');
                                //     $('#na').hide();
                                // }
                                // else {
                                //     $('#failed').hide();
                                //     $('#passed').hide();
                                //     $('#na').show()
                                // }
                                // var dateTestValue = currentDate().curentDate

                                ("date").text()
                            console.log('overallscore', score);

                        },
                        error: function (xhr, status, error) {
                            // Handle any API errors here
                        }

                    })
                }





                if (result.errors === true) {
                    errorDisplay();
                }
                function errorDisplay() {
                    $("#testresultfree").addClass("d-none");
                    $("#testresultpro").addClass("d-none");
                    $("#displayerrormessage").addClass("d-none");
                    $("#errorscreen").addClass("d-none")
                    for (var i = 0; i < result.messages.length; i++) {
                        if (result.messages[i].type == "ERROR") {
                            keyMessage = result.messages[i].key;
                            messageValue = result.messages[i].value;
                            $('#keyerror').text(keyMessage);
                            $('#errorvalue').html(messageValue);
                        }
                    }
                    $("#errorresult").removeClass("d-none")

                }

            },
            error: function (error) {

                var err = eval("(" + error.responseText + ")");
                console.log(err.messageValue)
                var errmsg = error.responseText
                if (err.status == '500') {
                    $('#email').val("");
                    $('#openAPISpec').val('');
                    $('#btn').prop('disabled', false);
                    $('.freebtn').prop('disabled', false);
                    $('.probtn').prop('disabled', false);
                    $("#loadingresultfree").addClass("d-none");
                    $("#Features").removeClass("d-none");
                    $("#errorscreen").removeClass("d-none")
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
// function currentDate() {
//     var months = new Array(12);
//     months[0] = "January";
//     months[1] = "February";
//     months[2] = "March";
//     months[3] = "April";
//     months[4] = "May";
//     months[5] = "June";
//     months[6] = "July";
//     months[7] = "August";
//     months[8] = "September";
//     months[9] = "October";
//     months[10] = "November";
//     months[11] = "December";

//     var current_date = new Date();
//     current_date.setDate(current_date.getDate() + 15);
//     month_value = current_date.getMonth();
//     day_value = current_date.getDate();
//     year_value = current_date.getFullYear();

//     var curentDate = months[month_value] + " " + day_value + ", " + year_value;
// }
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



// function progressStats() {
//     var texts = ['Spec is validating.....', 'Spec validation successfully completed !', 'Tests are being created', 'Playbooks generation is in progress', 'Scan triggered.', 'Please wait for the result it will be populated down below'];
//     var counter = 0;
//     setInterval(function () {
//         $('#progress-text').text(texts[counter]);
//         counter = (counter + 1) % texts.length;
//     }, 20000);

// }
// $(document).ready(function () {
//     $('#runSample').click(function () {
//         $('#openAPISpec').val('https://raw.githubusercontent.com/apisec-inc/Netbanking-Specs/main/ethicalcheck-netbanking-spec.json');
//         // console.log($(''))
//         console.log('clicked');
//     })
// });