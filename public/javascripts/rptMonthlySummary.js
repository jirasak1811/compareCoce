$(document).ready(function () {

    $("#rptMonthlySummary").css({ 'font-weight': 'bold' });

    $('button.btn-rpt-ok').click(function (event) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reporten = "__report=report/MonthlySummary.rptdesign";
                var reportth = "__report=report/MonthlySummaryth.rptdesign";
                var dateFrom = "&DateFrom=" + $('input#dtpDateFrom').val() + " " + $('input#dtpTimeFrom').val();
                var dateTo = "&DateTo=" + $('input#dtpDateTo').val() + " " + $('input#dtpTimeTo').val();

                if(Cookies.get('lang') == 'th'){
                    var url = host + reportth + dateFrom + dateTo;
                    window.open(url, '_blank');
                }else{
                    var url = host + reporten + dateFrom + dateTo;
                    window.open(url, '_blank');
                }
            },
            error: function (data) {
                alert('Error: Report host not found');
            }
        });

    });
});
