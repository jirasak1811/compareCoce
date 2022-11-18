$(document).ready(function () {
    //
    $('.deleteuserbtn').click(function () {
        var confirmtext =''
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            confirmtext = ' ต้องการลบ : ' + this.attributes['data-user'].value +'หรือไม่'
        } else {
            confirmtext = ' Do you want to delete : ' + this.attributes['data-user'].value + '?'
        }
        if (confirm(confirmtext)) {
            $.ajax({
                type: 'DELETE',
                url: '/api/v1/usersM/' + this.attributes['data-user'].value,
                success: function (data) {
                    console.log(JSON.parse(data))
                    console.log(data['success'])
                    if (JSON.parse(data).success) {
                        window.location.reload()
                    }
                }
            });
        }
    });
    //
    $('.editable').editable({
        url: '/api/v1/usersM/update',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }
    });

    $('.edit-ariff').editable({
        url: '/api/v1/usersM/update',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        },
        source: [
            {
                value: '0',
                text: '0'
            },
            {
                value: '1',
                text: '1'
            },
            {
                value: '2',
                text: '2'
            },
            {
                value: '3',
                text: '3'
            },
            {
                value: '4',
                text: '4'
            },
            {
                value: '5',
                text: '5'
            },
            {
                value: '6',
                text: '6'
            },
            {
                value: '7',
                text: '7'
            },
            {
                value: '8',
                text: '8'
            },
            {
                value: '9',
                text: '9'
            },
            {
                value: '10',
                text: '10'
            },
            {
                value: '11',
                text: '11'
            }
        ]
    });

    $('a.delete').click(function (event) {
        var tr = $(this).closest('tr');

        event.preventDefault();
        $.ajax({
            type: 'DELETE',
            url: this.href,
            dataType: 'json',
            success: function () {
                tr.css("background-color", "sandybrown");
                tr.fadeOut(1000, function () {
                    tr.remove();
                });
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });

    $('button#save').click(function () {
        var data = $('#newUserForm').serializeArray()
        data.push({ name: 'newActive', value: $('#newActive')[0].value })
        $.ajax({
            type: 'POST',
            url: '/api/v1/usersM/new',
            data: data,
            dataType: 'json',
            success: function (data) {
                $('#new_user').modal('hide');

                if (data) {
                    window.location.reload()
                }
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });

    $('.edittable-selectActive').editable({
        source: [
            { '1': 'Active' },
            { '0': 'InActive' },
        ],
        url: '/api/v1/usersM/update',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }
    });

    var rolelist = []
    $.ajax({
        type: 'GET',
        url: '/api/v1/etbs-roles/role',
        success: function (data) {
            data = JSON.parse(data)
            var roleOptions = $('#newRolename');
            $.each(data, function (i, roles) {
                rolelist.push({
                    value: roles.rolename,
                    text: roles.rolename
                });
                roleOptions.append($('<option>', {
                    value: roles.rolename,
                    text: roles.rolename
                }));
            });

            $('.edit-selectRole').editable({
                url: '/api/v1/usersM/update',
                ajaxOptions: {
                    type: 'POST',
                    dataType: 'json'
                },
                type: 'select',
                source:  rolelist
            });
        }
    });


    $(document).on('dblclick', '.showmoredetail', function () {
        $('#view-detail-body').html('')
        $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='extension'>extension </b></div><div class='row col-md-6'>" + $(this).attr('data-ext') + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='Username'>username</b></div><div class='row col-md-6'>" + $(this).attr('data-username') + "</div></div></div>")
        $.getJSON('/api/v1/extensions/info/' + $(this).attr('data-ext'), { user: Cookies('user') }).done(function (data) {
            if (data.length == 1) {
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='nameth'>Name(TH) </b></div><div class='row col-md-6'>" + (data[0].nameth || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='name'>Name(Eng)</b></div><div class='row col-md-6'>" + (data[0].name || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='position'>Position</b></div><div class='row col-md-6'>" + (data[0].position || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='employee_type'>Employee Type</b></div><div class='row col-md-6'>" + (data[0].employee_type || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='employee_line'>Employee Line</b></div><div class='row col-md-6'>" + (data[0].employee_line || "") + "</div></div><div class='row col-md-6' style='display:none;'><div class='row col-md-6'><b data-i18n='employee_type'>Employee Type</b></div><div class='row col-md-6'>" + (data[0].employee_type || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-3'><b data-i18n='org_path'>org </b></div>" + (data[0].org_path || "") + "</div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='rent_charge'>Rent charge </b></div><div class='row col-md-6'>" + (data[0].rent_charge || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='special_service_fee'>Special Service Fee</b></div><div class='row col-md-6'>" + (data[0].special_service_fee || "") + "</div></div></div>")
            } else {
                $('#view-detail-body').append("<div class='row col-md-12' align='center'><h5 data-i18n='not found extensions data'>Not Found Extensions Data</h5></div>")
            }
            if (document.getElementsByTagName('html')[0].lang == 'th') {
                $('.lang-switch')[1].click()
            } else {
                $('.lang-switch')[0].click()
            }
        })
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            $('.lang-switch')[1].click()
        } else {
            $('.lang-switch')[0].click()
        }
        $('.view-detail').modal('show')
    })

    // $('.editable-selectRole').editable({
    //     source: [
    //         { 'addmin': 'admin' },
    //         { 'user': 'user' },
    //     ],
    //     url: '/api/v1/usersM/update',
    //     ajaxOptions: {
    //         type: 'POST',
    //         dataType: 'json'
    //     }
    // });
});
