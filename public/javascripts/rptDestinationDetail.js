$(document).ready(function () {
    $("#rptDestinationDetail").css({ 'font-weight': 'bold' });

    getDestinationsName("Unknow", $('input#dtpDateFrom').val(), $('input#dtpDateTo').val());

    $('button.btn-rpt-ok').click(function (event) {
        var select2destination = $('#optDestinationName').select2('data');
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reportth = "__report=report/DestinationDetailsth.rptdesign";
                var reporten = "__report=report/DestinationDetails.rptdesign";
                var dateFrom = "&DateFrom=" + $('input#dtpDateFrom').val() + " " + $('input#dtpTimeFrom').val();
                var dateTo = "&DateTo=" + $('input#dtpDateTo').val() + " " + $('input#dtpTimeTo').val();
                var destinationName = "&DestinationName=" + select2destination[0]['text'];

                if(Cookies.get('lang') == 'th'){
                    var url = host + reportth + dateFrom + dateTo + destinationName;
                    window.open(url, '_blank');
                }else{
                    var url = host + reporten + dateFrom + dateTo + destinationName;
                    window.open(url, '_blank');
                }
            },
            error: function (data) {
                alert('Error: Report host not found');
            }
        });
    });

    $('#optTollType').select2({
    });

    $('.lang-switch').click(function () {
        $('#optTollType').select2({
        });
    })

    $('#optTollType').change(function () {
        $('#optDestinationName').children().remove().end();

        getDestinationsName(this.value, $('input#dtpDateFrom').val(), $('input#dtpDateTo').val());
        // $.ajax({
        //     type: 'GET',
        //     url: '/api/v1/reports/admin/destination/summary/get_destinations_name/' + this.value,
        //     success: function (data) {
        //         array = $.parseJSON(data);
        //         //console.log(array);
        //         $('#optDestinationName').select2({
        //             data: array
        //         });
        //     },
        //     error: function (data) {
        //         alert(data);
        //     }
        // });
    });

    $("#optReportDate").change(function () {
        getDestinationsName($('#optTollType').val(), $('input#dtpDateFrom').val(), $('input#dtpDateTo').val())
    });
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function getDestinationsName(tolltype, startdate, enddate) {
    $.ajax({
        type: 'GET',
        url: '/api/v1/reports/admin/destination/summary/get_destinations_name/' + tolltype + '/' + startdate + '/' + enddate,
        success: function (data) {
            array = $.parseJSON(data);
            //console.log(array);
            $('#optDestinationName').select2({
                data: array
            });
        },
        error: function (data) {
            //console.log(data);
            alert(data);
        }
    });
}