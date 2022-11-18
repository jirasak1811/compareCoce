
$(document).ready(function () {
    clear_active();
    if (window.location.pathname == '/b2e/dashboard') {
        set_active('#dashboard');
    } else if (window.location.pathname.includes('/b2e/schedules')) {
        set_active('#schedules');
    } else if (window.location.pathname.includes('/b2e/report')) {
        set_active('#report');
    } else if (window.location.pathname.includes('/b2e/setting/email')) {
        set_active('#email');
    } else if (window.location.pathname.includes('/b2e/setting/smtp')) {
        set_active('#smtp');
    }
});

function set_active(id) {
    $(id).addClass("active");
}

function clear_active() {
    $('#dashboard').removeClass("active");
    $('#schedules').removeClass("active");
    $('#report').removeClass("active");
    $('#email').removeClass("active");
    $('#smtp').removeClass("active");
}