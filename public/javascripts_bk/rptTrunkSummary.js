$(document).ready(function () {

    $("#rptTrunkSummary").css({ 'font-weight': 'bold' });

    $('button.btn-rpt-ok').click(function (event) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reporten = "__report=report/TrunkSummary.rptdesign";
                var reportth = "__report=report/TrunkSummaryth.rptdesign";
                var dateFrom = "&DateFrom=" + $('input#dtpDateFrom').val() + " " + $('input#dtpTimeFrom').val();
                var dateTo = "&DateTo=" + $('input#dtpDateTo').val() + " " + $('input#dtpTimeTo').val();
                var routeFrom = "&RouteFrom=" + $('input#txtRouteFrom').val();
                var routeTo = "&RouteTo=" + $('input#txtRouteTo').val();
                var trunkFrom = "&TrunkFrom=" + $('input#txtTrunkFrom').val();
                var trunkTo = "&TrunkTo=" + $('input#txtTrunkTo').val();

                if(Cookies.get('lang') == 'th'){
                    var url = host + reportth + dateFrom + dateTo + routeFrom + routeTo + trunkFrom + trunkTo;
                    window.open(url, '_blank');
                }else{
                    var url = host + reporten + dateFrom + dateTo + routeFrom + routeTo + trunkFrom + trunkTo;
                    window.open(url, '_blank');
                }

            },
            error: function (data) {
                alert('Error: Report host not found');
            }
        });

    });
});
