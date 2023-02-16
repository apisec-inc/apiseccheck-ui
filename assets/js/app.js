$(document).ready(function () {
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
        $('#btnpro').prop('disabled', true);
        $('.freebtn').prop('disabled', true);
        $('.probtn').prop('disabled', true);
        $("#testresultfree").addClass("d-none");
        $('.testdomain').text(openAPISpec);
        $("#loadingresultfree").removeClass("d-none");
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
                $('#openAPISpec').val('');
                $('#btn').prop('disabled', false);


                $('html, body').animate({
                    scrollTop: $("#Features").offset().top
                }, 1000);


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

    });

    $("#apiurl").addClass("d-none");
    $("#bearertoken").addClass("d-none");
    $("#emailpro2").addClass("d-none");
    $("#licensekey2").addClass("d-none");




});

var xValues = ["Vulnerability", "Value Data", "Configuration", "Authentication"];
var yValues = [50, 100, 15, 45];
var barColors = ["#dec15a", "#d65745", "#72ba2c", "#d65745"];

new Chart("myChart", {
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
});
