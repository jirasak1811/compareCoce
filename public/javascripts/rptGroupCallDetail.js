$(document).ready(function () {

    $('#treeGroup').jstree({
        'core': {
            'data': {
                "url": "/api/v1/reports/user/group/detail/get_organizations",
                "dataType": "json",
            }
        }
    });

    $('#treeGroup').on("changed.jstree", function (e, data) {
        if (data.selected.length) {
            $('#txtReportGroup').val(data.instance.get_node(data.selected[0]).id);
            // console.log('Selected: [' + data.instance.get_node(data.selected[0]).id + ']' + data.instance.get_node(data.selected[0]).text);
        }
    })

    $("#rptGroupDetail").css({ 'font-weight': 'bold' });

    $('button.btn-rpt-ok').click(function (event) {
        if ($('#txtReportGroup').val() == "") {
            alert("Please selected report group!");
            return;
        }
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reporten = "__report=report/GroupCallDetail.rptdesign";
                var reportth = "__report=report/GroupCallDetail.rptdesign";
                var dateFrom = "&DateFrom=" + $('input#dtpDateFrom').val() + " " + $('input#dtpTimeFrom').val();
                var dateTo = "&DateTo=" + $('input#dtpDateTo').val() + " " + $('input#dtpTimeTo').val();
                var reportGroup = "&ReportGroup=" + $('#txtReportGroup').val();

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
                    var url = host + reportth + dateFrom + dateTo + reportGroup
                    + callTypeInternal + callTypeIncoming + callTypeOutgoing
                    + tollTypeUnknown + tollTypeFree + tollTypeLocal + tollTypeMobile + tollTypeDomestic + tollTypeInternational;
                window.open(url, '_blank');
                }else{
                    var url = host + reporten + dateFrom + dateTo + reportGroup
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
