$(document).ready(function () {
    var date = new Date();
    var today_date = moment();
    var yesterday_date = moment().subtract(1, 'days');

    // disable_ReportDate(true);
    // $('input#dtpDateFrom').val(formatDate(today_date));
    // $('input#dtpDateTo').val(formatDate(today_date));
    // set_time("00:00:00", "23:59:59");

    var cookie_report_date = Cookies('report_date');
    var cookie_date_from = Cookies('date_from');
    var cookie_time_from = Cookies('time_from');
    var cookie_date_to = Cookies('date_to');
    var cookie_time_to = Cookies('time_to');

    if (cookie_report_date) {
        if (cookie_report_date == "Manual Select") {
            disable_ReportDate(false);
        } else {
            disable_ReportDate(true);
        }
        $("#optReportDate").val(cookie_report_date);
        $('input#dtpDateFrom').val(cookie_date_from);
        $('input#dtpTimeFrom').val(cookie_time_from);
        $('input#dtpDateTo').val(cookie_date_to);
        $('input#dtpTimeTo').val(cookie_time_to);
    } else {
        Cookies.set('report_date', 'Today');
        Cookies.set('date_from', formatDate(today_date))
        Cookies.set('date_to', formatDate(today_date))

        $('input#dtpDateFrom').val(formatDate(today_date));
        $('input#dtpDateTo').val(formatDate(today_date));
        set_time("00:00:00", "23:59:59");
    }

    $("input#dtpDateFrom").change(function () {
        Cookies.set('date_from', $('input#dtpDateFrom').val())
    });
    $("input#dtpTimeFrom").change(function () {
        Cookies.set('time_from', $('input#dtpTimeFrom').val())
    });
    $("input#dtpDateTo").change(function () {
        Cookies.set('date_to', $('input#dtpDateTo').val())
    });
    $("input#dtpTimeTo").change(function () {
        Cookies.set('time_to', $('input#dtpTimeTo').val())
    });

    $("#optReportDate").change(function () {
        Cookies.set('report_date', $('#optReportDate').val());

        switch ($('#optReportDate').val()) {
            case "Today":
                disable_ReportDate(true);
                $('input#dtpDateFrom').val(formatDate(today_date));
                $('input#dtpDateTo').val(formatDate(today_date));
                set_time("00:00:00", "23:59:59");
                break;
            case "Yesterday":
                disable_ReportDate(true);
                $('input#dtpDateFrom').val(formatDate(yesterday_date));
                $('input#dtpDateTo').val(formatDate(yesterday_date));
                set_time("00:00:00", "23:59:59");
                break;
            case "This Week":
                disable_ReportDate(true);
                $('input#dtpDateFrom').val(formatDate(moment().startOf('week')));
                $('input#dtpDateTo').val(formatDate(today_date));
                set_time("00:00:00", "23:59:59");
                break;
            case "Last Week":
                disable_ReportDate(true);
                $('input#dtpDateFrom').val(formatDate(moment().subtract(1, 'week').startOf('week')));
                $('input#dtpDateTo').val(formatDate(moment().subtract(1, 'week').endOf('week')));
                set_time("00:00:00", "23:59:59");
                break;
            case "This Month":
                disable_ReportDate(true);
                $('input#dtpDateFrom').val(formatDate(moment().startOf('month')));
                $('input#dtpDateTo').val(formatDate(today_date));
                set_time("00:00:00", "23:59:59");
                break;
            case "Last Month":
                disable_ReportDate(true);
                $('input#dtpDateFrom').val(formatDate(moment().subtract(1, 'month').startOf('month')));
                $('input#dtpDateTo').val(formatDate(moment().subtract(1, 'month').endOf('month')));
                set_time("00:00:00", "23:59:59");
                break;
            case "Year to date":
                disable_ReportDate(true);
                $('input#dtpDateFrom').val(formatDate(moment().startOf('year')));
                $('input#dtpDateTo').val(formatDate(today_date));
                set_time("00:00:00", "23:59:59");
                break;
            case "Manual Select":
                disable_ReportDate(false);
                break;
            default:
        }
        Cookies.set('date_from', $('input#dtpDateFrom').val());
        Cookies.set('date_to', $('input#dtpDateTo').val());
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

function set_time(str, end) {
    $('input#dtpTimeFrom').val(str);
    $('input#dtpTimeTo').val(end);

    Cookies.set('time_from', str)
    Cookies.set('time_to', end)
}

function disable_ReportDate(status) {
    $('input#dtpDateFrom').prop("disabled", status);
    $('input#dtpDateTo').prop("disabled", status);
    $('input#dtpTimeFrom').prop("disabled", status);
    $('input#dtpTimeTo').prop("disabled", status);
}