$(document).ready(function () {
    $('.navbar-right')[0].style.display = 'none'
    $('#smtp')[0].style.display = 'none'
    click_login();
});

function click_login() {
    $('div.page-form').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            $('button#btn_login').trigger('click');
        }
    });
    
    $('#div_btn_login').on('click', '#btn_login', function (e) {
        e.preventDefault();
        $('input#mUsername').prop( "disabled", true );
        $('input#mPassword').prop( "disabled", true );

        var mUser = $('input#mUsername').val();
        var mPass = $('input#mPassword').val();

        if (mUser == "" || mPass == "" || mUser == " " || mPass == " ") {
            alert("Please input your username and password to login!");
            $('input#mUsername').prop( "disabled", false );
            $('input#mPassword').prop( "disabled", false );
            return;
        }

        // if (confirm("Are you sure to login ?") == false) {
        //     return;
        // }

        $.post("/b2e/users/login/" + mUser + "/" + mPass, function (data) {
            if (data.status == "success") {
                if (data.data[0]["Type"] == "Admin") {
                    window.location.replace('/schedules');
                } else {
                    alert("Login failed, Permission denied!");
                }
            } else {
                alert("Login failed, Wrong username or password please try again!");
            }
            //console.log(data);
            $('input#mUsername').prop( "disabled", false );
            $('input#mPassword').prop( "disabled", false );
        });
    });
}
