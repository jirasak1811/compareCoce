$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: '/api/v1/usersM/alluser',
        success: function (data) {
            $('#UserManageTableBody').html('')
            data = JSON.parse(data)
            for (var i = 0; i < data.length; i++) {
                let tmp = '';
                tmp += "<tr class='showmoredetail' , data-ext='" + data[i].extension + "' , data-username='" + data[i].username + "' ,data-email='" + data[i].email +"'>"
                tmp += "<td> <a href='#', data-name='username', data-type='text', data-pk='" + data[i].username + "', data-title='Enter Username' , data-i18n='[data-title]Enter Username'>" + data[i].username +"</a></td>"
                tmp += "<td> <a href = '#',data-name='passowrd',data-type='text', data-pk='" + data[i].username + "',data-title='Enter Password',data-i18n='[data-title]Enter Password'></a>#######</td> "
                tmp += "<td> <a class='edit-selectRole' href='#', data-name='rolename', data-type='select', data-pk='" + data[i].username + "', data-title='Enter Role', data-i18n='[data-title]Enter Rolename', data-value='" + data[i].rolename + "'> " + (data[i].rolename || '-') + "</a></td>"
                //tmp += "<td> <a class='editable' href='#', data-name='extension', data-type='text',data-pk='" + data[i].username + "', data-title='Enter Extension', data-i18n='[data-title]Enter Extension'>" + (data[i].extension || '-')+" </a></td>"
                tmp += "<td> <a class='editable' href='#', data-name='extension', data-type='text', data-pk='" + data[i].username + "', data-title='Enter Extension', data-i18n='[data-title]Enter Extension'> "+ (data[i].extension || '-')+"</a></td>"
                tmp += "<td> <a class='editable' href='#', data-name='name', data-type='text', data-pk='" + data[i].username + "', data-title='Enter Name', data-i18n='[data-title]Enter Name'> "+ (data[i].name || '-')+"</a></td>"
                tmp += "<td> <a class='editable' href='#', data-name='mobile', data-type='text', data-pk='" + data[i].username + "', data-title='Enter Mobile',data-i18n='[data-title]Enter Mobile'>"+(data[i].mobile || '-') +" </a></td>"
                tmp += "<td> <a class='editable' href='#', data-name='fax', data-type='text', data-pk='" + data[i].username + "', data-title='Enter Fax', data-i18n='[data-title]Enter Fax'> " + (data[i].fax || '-')+"</a></td> "
                tmp += "<td> <a class='editable' href='#', data-name='email', data-type='text', data-pk='" + data[i].username + "', data-title='Enter Email',data-i18n='[data-title]Enter Email'>" + (data[i].email || '-' ) + "</a></td>"
                //tmp += "<td align='center'> <a class='edittable-selectActives' href='#', data-type='select', data-name='is_active',data-pk='" + data[i].username + "',data-title='Enter Active',data-i18n='[data-title]Enter Active', data-value='" + data[i].is_active + "' >" + (data[i].is_active == '1' ? 'Active' : 'InActive') + " </a></td> "
                tmp += "<td align='center'> <a class='edittable-selectActives' href='#', data-name='is_active', data-type='select', data-pk='" + data[i].username + "', data-title='Enter Active', data-i18n='[data-title]Enter Active', data-value='" + data[i].is_active + "'> " + (data[i].is_active == '1' ? 'Active' : 'InActive') + "</a></td>"
                tmp += "<td align='center', style = 'width:30px'> <a class='btn btn-success btn-xs vieweditgroup' data-user='" + data[i].username + "'> <i class='fa fa-users'></i></a> </td>"
                tmp += "<td align='center', style = 'width:30px'> <a class='btn btn-warning btn-xs deleteuserbtn' data-user='" + data[i].username + "'> <i class='fa fa-trash'></i></a> </td>"
                tmp += "</tr>"
                $('#UserManageTableBody').append(tmp)
            }
            $('.deleteuserbtn').click(function () {
                var confirmtext = ''
                if (document.getElementsByTagName('html')[0].lang == 'th') {
                    confirmtext = ' ต้องการลบ : ' + this.attributes['data-user'].value + 'หรือไม่'
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
                        source: rolelist
                    });
                }
            });

            $('#UserManageTable').DataTable({
                initComplete: function () {
                    var input = $('.dataTables_filter input').unbind(),
                        self = this.api(),
                        $searchButton = $('<button class="btn btn-primary">')
                            .text('search')
                            .click(function () {
                                self.search(input.val()).draw();
                            }),
                        $clearButton = $('<button class="btn">')
                            .text('clear')
                            .click(function () {
                                input.val('');
                                $searchButton.click();
                            })
                    $('.dataTables_filter').append($searchButton, $clearButton);
                }
            })
            $('tbody')[0].style['max-height'] = screen.height / 1.85 + 'px'
            $('#UserManageTable_filter')[0].className = $('#UserManageTable_filter')[0].className + " pull-right"

            $('.edittable-selectActives').editable({
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
        }
    });  

    $(document).on('dblclick', '.showmoredetail', function () {
        $('#view-detail-body').html('')        
        var email = $(this).attr('data-email')
        $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='extension'>extension </b></div><div class='row col-md-6'>" + $(this).attr('data-ext') + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='Username'>username</b></div><div class='row col-md-6'>" + $(this).attr('data-username') + "</div></div></div>")
        $.getJSON('/api/v1/extensions/info/' + $(this).attr('data-ext'), { user: Cookies('user') }).done(function (data) {
            console.log(data)
            if (data.length == 1) {
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='nameth'>Name(TH) </b></div><div class='row col-md-6'>" + (data[0].nameth || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='name'>Name(Eng)</b></div><div class='row col-md-6'>" + (data[0].name || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='position'>Position</b></div><div class='row col-md-6'>" + (data[0].position || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='employee_type'>Employee Type</b></div><div class='row col-md-6'>" + (data[0].employee_type || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='employee_line'>Employee Line</b></div><div class='row col-md-6'>" + (data[0].employee_line || "") + "</div></div><div class='row col-md-6' style='display:none;'><div class='row col-md-6'><b data-i18n='employee_type'>Employee Type</b></div><div class='row col-md-6'>" + (data[0].employee_type || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-3'><b data-i18n='org_path'>org </b></div>" + (data[0].org_path || "") + "</div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='rent_charge'>Rent charge </b></div><div class='row col-md-6'>" + (data[0].rent_charge || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='special_service_fee'>Special Service Fee</b></div><div class='row col-md-6'>" + (data[0].special_service_fee || "") + "</div></div></div>")
            } else if (data.length > 1) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].email == email) {
                        data[0] = data[i]
                        break;
                    }
                }
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

    $(document).on('click', '.vieweditgroup', function () {
        var user = $(this).attr('data-user');
        $('#confirm-editgroupview').attr('data-user', user)
        if ($('.easy-tree').html != '') {
            $('.easy-tree').jstree('destroy')
        }
        $('#confirm-editgroupview').attr('data-group', undefined)
        $('.easy-tree').jstree({
            'core': {
                'data': {
                    "url": "/api/v1/reports/user/group/summary/get_organizations",
                    "dataType": "json",
                },
                check_callback: function (operation, node, parent, position, more) {
                    console.log({ operation, node, parent, position, more })
                }
            }
        })
        //ajax
        $.ajax({
            type: 'POST',
            url: '/api/v1/usersM/usergroup',
            data: {username:user},
            dataType: 'json',
            success: function (data) {
                setTimeout(function () {
                    if (data == null || data == undefined) {
                        data = []
                    } else {
                        data = JSON.parse(data)
                    }
                    $('.easy-tree').jstree("select_node", data, true); //Show Select 
                    $('#confirm-editgroupview').attr('data-group', JSON.stringify(data)) //Set Confirm Data
                }, 500);
            }
        })

        $('.easy-tree').on("changed.jstree", function (e, data) {
            console.log(data)
            console.log(data.selected)
            $('#confirm-editgroupview').attr('data-group', JSON.stringify(data.selected))
        });
        $('.editgroupview').modal('show')
    });

    $(document).on('click', '#confirm-editgroupview', function () {
        if ($(this).attr('data-group') == undefined) {
            if (Cookies.get('lang') == 'th') {
                $('#alertgroupview-body').html('<h4>กรุณาเลือกกลุ่มที่ต้องการ</h4>')
            } else {
                $('#alertgroupview-body').html('<h4>Please Select Group</h4>')
            }
            $('.alertgroupview').modal('show')
        } else {
            var data = {
                username: $(this).attr('data-user'),
                groupview: $(this).attr('data-group')
            }
            console.log("data :", data);

            $.ajax({
                type: 'POST',
                url: '/api/v1/usersM/usergroup/setgroup',
                data: data,
                dataType: 'json',
                success: function (data) {
                    $('.editgroupview').modal('hide')
                    $('.easy-tree').jstree('destroy')
                }
            });
        }
    })
});
