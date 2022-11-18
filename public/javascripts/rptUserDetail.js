$(document).ready(function () {

    $("#rptUserDetail").css({ 'font-weight': 'bold' });

    $('button.btn-rpt-ok').click(function (event) {
        $.ajax({
            type: 'GET',
            url: '/api/v1/reports/config',
            success: function (data) {
                var host = data["host"];
                var reporten = "__report=report/" + $('select#optUserDetail').val() + ".rptdesign";
                var reportth = "__report=report/" + $('select#optUserDetail').val() + "th" + ".rptdesign";

                if(Cookies.get('lang') == 'th'){
                    var url = host + reportth;
                    window.open(url, '_blank');
                }else{
                    var url = host + reporten;
                    window.open(url, '_blank');
                }

            },
            error: function (data) {
                alert('Error: Report host not found');
            }
        });

    });
});