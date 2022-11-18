$(document).ready(function () {

    $("#rptExtensionSummary").css({ 'font-weight': 'bold' });

    $('button.btn-rpt-ok').click(function (event) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reporten = "__report=report/ExtensionSummary.rptdesign";
                var reportth = "__report=report/ExtensionSummaryth.rptdesign";
                var dateFrom = "&DateFrom=" + $('input#dtpDateFrom').val() + " " + $('input#dtpTimeFrom').val();
                var dateTo = "&DateTo=" + $('input#dtpDateTo').val() + " " + $('input#dtpTimeTo').val();
                var extensionFrom = "&ExtensionFrom=" + $('input#txtExtensionFrom').val();
                var extensionTo = "&ExtensionTo=" + $('input#txtExtensionTo').val();

                if ($("#ckbCallTypeInternal").is(':checked')) {
                    callTypeInternal = "&Internal=INT";
                } else { callTypeInternal = ""; }
                if ($("#ckbCallTypeIncoming").is(':checked')) {
                    callTypeIncoming = "&Incoming=INC";
                } else { callTypeIncoming = ""; }
                if ($("#ckbCallTypeOutgoing").is(':checked')) {
                    callTypeOutgoing = "&Outgoing=OUT"
                } else { callTypeOutgoing = ""; }

                if(Cookies.get('lang') == 'th'){
                    var url = host + reportth + dateFrom + dateTo + extensionFrom + extensionTo;
                    window.open(url, '_blank');
                }else{
                    var url = host + reporten + dateFrom + dateTo + extensionFrom + extensionTo;
                    window.open(url, '_blank');
                }
            },
            error: function (data) {
                alert('Error: Report host not found');
            }
        });

    });
});
