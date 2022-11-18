
    $('button.btn-signin').click(function (ev) {
        ev.preventDefault();

        var input_u = $('input.in-user').val();
        var input_p = $('input.in-pwd').val()

        $.post('/api/client/info', {
            u: input_u,
            p: input_p
        })
        .done(function( data1 ) {

            if (data1) {
                //alert( "Data Loaded: " + data );
                var client_res = $.parseJSON(data1);
                console.log(client_res[0]);
                if (client_res[0] != undefined) {
                    $.post('/api/oauth/token', {
                        grant_type: "password",
                        client_id: client_res[0].clientid,
                        client_secret: client_res[0].clientsecret,
                        username: input_u,
                        password: input_p
                    })
                        .done(function (data2) {
                            //console.log( data2 );
                            if (data2) {
                                //Cookies.set(input_u, data2, { expires: 1, path: 'etbsjs' });
                                Cookies.set(input_u, data2);
                                Cookies.set('user', input_u);
                                //console.log(Cookies.get(input_u));
                                //alert(Cookies.get(input_u));

                                setTimeout(function () { window.location = '/api/v1/dashboard?access_token=' + data2.access_token; }, 1000);
                            }
                        });
                } else {
                    alert(" NOT FOUND Client ID ")
                }
            }

        });


    });
    $(document).on('keyup', 'input.in-pwd', function (ev) {
        if (ev.keyCode === 13) {
            $('button.btn-signin').click()
        }
    })
