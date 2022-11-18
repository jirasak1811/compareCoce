$(document).ready(function () {

    $("#rptDialledDetail").css({ 'font-weight': 'bold' });

    $('button.btn-rpt-ok').click(function (event) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reporten = "__report=report/DialledNumberDetails.rptdesign";
                var reportth = "__report=report/DialledNumberDetailsth.rptdesign";
                var dateFrom = "&DateFrom=" + $('input#dtpDateFrom').val() + " " + $('input#dtpTimeFrom').val();
                var dateTo = "&DateTo=" + $('input#dtpDateTo').val() + " " + $('input#dtpTimeTo').val();
                var destinationName = "&DialledNumber=" + $('input#txtDialledNumber').val();

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

    $('#optTollType').change(function () {
        $('#txtDestinationName').val(this.value);
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

