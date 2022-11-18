$(document).ready(function () {

    $("#rptExtensionDetail").css({ 'font-weight': 'bold' });

    $('button.btn-rpt-ok').click(function (event) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reporten = "__report=report/ExtensionDetails.rptdesign";
                var reportth = "__report=report/ExtensionDetailsth.rptdesign";
                var dateFrom = "&DateFrom=" + $('input#dtpDateFrom').val() + " " + $('input#dtpTimeFrom').val();
                var dateTo = "&DateTo=" + $('input#dtpDateTo').val() + " " + $('input#dtpTimeTo').val();
                var extensionFrom = "&ExtensionFrom=" + $('input#txtExtensionFrom').val();
                var extensionTo = "&ExtensionTo=" + $('input#txtExtensionTo').val();

                if ($("#ckbCallTypeInternal").is(':checked')) {
                    callTypeInternal = "&Internal=INT";
                } else { callTypeInternal = ""; }
                if ($("#ckbCallTypeIncoming").is(':checked')) {
                    callTypeIncoming = "&Incoming=IN";
                } else { callTypeIncoming = ""; }
                if ($("#ckbCallTypeOutgoing").is(':checked')) {
                    callTypeOutgoing = "&Outgoing=OUT"
                } else { callTypeOutgoing = ""; }

                if ($("#ckbTollTypeUnknown").is(':checked')) {
                    tollTypeUnknown = "&Unknown=Unknown";
                } else { tollTypeUnknown = ""; }
                if ($("#ckbTollTypeHotline").is(':checked')) {
                    tollTypeFree = "&Free=Free";
                } else { tollTypeFree = ""; }
                if ($("#ckbTollTypeLocal").is(':checked')) {
                    tollTypeLocal = "&Local=Local";
                } else { tollTypeLocal = ""; }
                if ($("#ckbTollTypeMobile").is(':checked')) {
                    tollTypeMobile = "&Mobile=Mobile";
                } else { tollTypeMobile = ""; }
                if ($("#ckbTollTypeDomestic").is(':checked')) {
                    tollTypeDomestic = "&Domestic=Domestic";
                } else { tollTypeDomestic = ""; }
                if ($("#ckbTollTypeInternational").is(':checked')) {
                    tollTypeInternational = "&International=International";
                } else { tollTypeInternational = ""; }


                if(Cookies.get('lang') == 'th'){
                    var url = host + reportth + dateFrom + dateTo + extensionFrom + extensionTo
                    + callTypeInternal + callTypeIncoming + callTypeOutgoing
                    + tollTypeUnknown + tollTypeFree + tollTypeLocal + tollTypeMobile + tollTypeDomestic + tollTypeInternational;
                window.open(url, '_blank');
                }else{
                    var url = host + reporten + dateFrom + dateTo + extensionFrom + extensionTo
                    + callTypeInternal + callTypeIncoming + callTypeOutgoing
                    + tollTypeUnknown + tollTypeFree + tollTypeLocal + tollTypeMobile + tollTypeDomestic + tollTypeInternational;
                window.open(url, '_blank');
                }

            },
            error: function (data) {
                alert('Error: Report host not found');
            }
        });


    });
});
