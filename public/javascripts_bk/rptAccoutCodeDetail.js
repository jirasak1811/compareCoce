$(document).ready(function () {
    setTimeout(function () {
        $("#rptAccoutCodeDetail").css({ 'font-weight': 'bold' });
     }, 500);


    $('button.btn-rpt-ok').click(function (event) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reporten = "__report=report/AccountCodeDetails.rptdesign";
                var reportth = "__report=report/AccountCodeDetailsth.rptdesign";
                var dateFrom = "&DateFrom=" + $('input#dtpDateFrom').val() + " " + $('input#dtpTimeFrom').val();
                var dateTo = "&DateTo=" + $('input#dtpDateTo').val() + " " + $('input#dtpTimeTo').val();
                var AccoutFrom = "&AccoutFrom=" + $('input#txtAccoutFrom').val();
                var AccoutTo = "&AccoutTo=" + $('input#txtAccoutTo').val();

                if ($("#ckbCallTypeInternal").is(':checked')) {
                    callTypeInternal = "&Internal=INT";
                } else { callTypeInternal = ""; }
                if ($("#ckbCallTypeIncoming").is(':checked')) {
                    callTypeIncoming = "&Incoming=INC";
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
                    var url = host + reportth + dateFrom + dateTo + AccoutFrom + AccoutTo
                    + callTypeInternal + callTypeIncoming + callTypeOutgoing
                    + tollTypeUnknown + tollTypeFree + tollTypeLocal + tollTypeMobile + tollTypeDomestic + tollTypeInternational;
                    window.open(url, '_blank');
                }else{
                    var url = host + reporten + dateFrom + dateTo + AccoutFrom + AccoutTo
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
