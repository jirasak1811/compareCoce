function addgroup(user, ext_lic, token) {
    $(document).on('click', '.btn-add-org-ok', function () {
        $.ajax({
            url: '/api/v1/organize/new/',
            type: 'POST',
            data: { "groupname": $('#inputAddGroupName').val() ,"user":user },
            success: function (data) {
                $('.modal-add-org').modal('hide')
                $('#inputAddGroupName').val('')
                RenderEasyTreeGroup()
            },
            error: function (err) {
                console.log(err)
            }
        });
    });
}
function getAllGroup(user, ext_lic, token) {
    console.log("Get ALL Group ")

    $.getJSON('/api/v1/organize/all', { user: user }).done(function (data) {

        $('button.btn-org-list-up').addClass('disabled');
        var org = '';
        var selected_org = null;

        $('.modal-body-org-list').html('');

        $.each(data, function (i, d) {
            //console.log(d);
            //var org = '<a class="btn btn-app" href="/api/v1/organize/all/'+d.orgid+'">';
            org = '';

            if (d.has_child != '' && d.has_child != null) {
                //alert(d.parent_orgid);
                org += '<a class="btn btn-app org-have-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
                org += '<span class="badge bg-yellow">C</span>';
            } else {
                org += '<a class="btn btn-app org-no-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
                //$('button.btn-org-list-up').addClass('disabled');
            }

            org += '<i class="fa fa-group"></i>';
            org += d.org_name;
            org += '</a>';

            $('.modal-body-org-list').append(org);

        });
        // jQuery call event
        // check click event for select organize have to point in src (extensionsDetail.jade and organizations.func.js)
        /*$('a.org-no-child').click(function(ev) {
            ev.preventDefault();

            //console.log($(this).html());
            //console.log($(this).attr('data-orgid'));
            selected_org = $(this).attr('data-orgid');
            $('h4.modal-title').html('Organize List <button type="button" class="btn btn-xs btn-primary">'+$(this).attr('data-org-name')+'</button>');
        });*/

        /*$('button.btn-selected-org').click(function(ev) {
            ev.preventDefault();

            $('input[type="radio"].org-line-green').each(function(){
                var self = $(this);

                if (selected_org != '' && selected_org != null)
                    label_text = '<div class="icheck_line-icon"></div>' + selected_org;
                else {
                    label_text = '<div class="icheck_line-icon"></div> NONE';
                }

                if (selected_org == '') {
                    self.iCheck({
                        checkboxClass: 'icheckbox_line-aero',
                        radioClass: 'iradio_line-aero',
                        insert: label_text
                    });
                    self.iCheck('uncheck');
                } else {
                    self.iCheck({
                        checkboxClass: 'icheckbox_line-green',
                        radioClass: 'iradio_line-green',
                        insert: label_text
                    });
                }
            });

            setTimeout(function(){
                $('input[type="radio"].org-line-green').iCheck('check');
            }, 50);
        });*/

        // end call event
    });
}

function getAllGroup2(user, ext_lic, token) {
    getGroupAllByUser(user); // Render TreeView
    $.getJSON('/api/v1/organize/all', { user: user }).done(function (data) {
        $('button.btn-org-list-back').addClass('disabled');
        //var org = '';
        var selected_org = null;

        $('.org-list').html('');

        var org = '<a class="btn btn-app btn-org-add bg-olive btn-flat">';
        org += '<i class="fa fa-plus"></i>';
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            org += '<label data-i18n="create group">Create Group</label>';
        } else {
            org += '<label data-i18n="create group">สร้างกลุ่ม</label>';
        }
        org += '</a>';
        org += '<a class="btn btn-app btn-move-org bg-orange btn-flat" >';
        org += '<i class="fa fa-exchange"></i>';
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            org += '<label data-i18n="move group">Move Group</label>';
        } else {
            org += '<label data-i18n="move group">ย้ายกลุ่ม</label>';
        }
        org += '</a>';
        //Edit
        org += '<a class="btn btn-app btn-edit-org bg-olive btn-flat" style="display:none" >';
        org += '<i class="fa  fa-pencil-square-o"></i>';
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            org += '<label data-i18n="edit group">Edit Group</label>';
        } else {
            org += '<label data-i18n="edit group">แก้ไขกลุ่ม</label>';
        }
        org += '</a>';
        // Move to main
        org += '<a class="btn btn-app btn-move-to-main bg-info btn-flat" style="display:none" >';
        org += '<i class="fa  fa-reply"></i>';
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            org += '<label data-i18n="move to main">Move to Main</label>';
        } else {
            org += '<label data-i18n="move to main">ย้ายไปเส้นหลัก</label>';
        }
        org += '</a>';

        // Delete Group 
        org += '<a class="btn btn-app btn-delete-group bg-red btn-flat" style="display:none" >';
        org += '<i class="fa  fa-trash-o"></i>';
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            org += '<label data-i18n="delete group">Delete Group</label>';
        } else {
            org += '<label data-i18n="delete group">ลบ กลุ่ม</label>';
        }
        org += '</a>';

        $('.org-list').append(org);

        setTimeout(function () { 
            if ($('.easy-tree').length == 0) {
                getGroupAllByUser(user); // Render TreeView
                $.getJSON('/api/v1/extensions/all', { user: user }).done(function (data) {
                    console.log("All Group Data : " + data.length + " rows")
                    RenderTable(data)
                    RenderTable([])
                })
            } else {
                $.getJSON('/api/v1/extensions/all', { user: user }).done(function (data) {
                    console.log("All Group Data : " + data.length + " rows")
                    RenderTable(data)
                    RenderTable([])
                })
            }
            if (Cookies.get('lang') == 'th') {
                $('.lang-switch')[1].click()
            } else {
                $('.lang-switch')[0].click()
            }
        }, 1500);
        $('a.btn-org-add').click(function(ev) {
            ev.preventDefault();

            $('.modal-add-org').modal();
        });

    });
}
function RenderTree(d,h) {
    var tmp =''
    $.each(d, function (i, d) {
        if (d.has_child != '' && d.has_child != null) {
            tmp += '<li class="leaf" data-orgid="' + d.orgid + '" data-org-name="' + d.org_name + '" data-parent-orgid="' + d.parent_orgid + '" >' + d.org_name
            tmp += '<ul>'
            tmp += RenderTree(d.client,'child')
            tmp += '</ul>'
            tmp += '</li>'
        }
        else {
            tmp += '<li class="leaf" data-orgid="' + d.orgid + '" data-org-name="' + d.org_name + '" data-parent-orgid="' + d.parent_orgid + '">' + d.org_name + '</li>'
        }
    });
    return tmp
}

function getGroupAllByUser(user) {
    $.getJSON('/api/v1/organize/alls', { user: user }).done(function (data) {
        var tmp = []
        //FindParentOwner
        for (var i = 0; i < data.length; i++) {
            if (data[i].parent_orgid == null) {
                data[i]["isFolder"] = true
                data[i]["text"] = data[i].org_name
                data[i]["id"] = data[i].orgid
                tmp.push(data[i])
                data.splice(i, 1)
            }
        }
        $('.with-border').html('')
        tools =''
        tools +='<div class="btn-group " role="group" aria-label="Basic example">'
        tools +=    '<button type="button" class="btn btn-primary btn-groupview" data-i18n="show for selected group" data="Group">Show For Selected Group</button>'
        tools +=    '<button type="button" class="btn btn-primary btn-groupview" data-i18n="show no group" data="NoGroup">Show No Group</button>'
        tools +=    '<button type="button" class="btn btn-primary btn-groupview" data-i18n="show all" data="All">Show All</button>'
        tools += '</div>'
        $('.with-border').append(tools)
        //var data = addchildren(tmp, data)
        $('.org-list').append('<div class="row"><div class="easy-tree col-md-4" style="max-height:' + (screen.height / 3) * 1.57+'px;overflow: auto;"></div><div class="col-md-8" id="ext-list"></div></div>');
        RenderEasyTreeGroup()
    })
}

function RenderEasyTreeGroup() {
    $('.easy-tree').jstree('destroy')
    $('.move-easy-tree').jstree('destroy')
    var user = Cookies.get('user')
    $('.easy-tree').jstree({
        'core': {
            'data': {
                "url": "/api/v1/reports/user/group/summary/get_organizations",
                "dataType": "json",
            },
            check_callback: function (operation, node, parent, position, more) {
                if (more.core != undefined) {
                    if (operation === "move_node") {
                        if (document.getElementsByTagName('html')[0].lang == 'th') {
                            var confirmtext = "กรุณายืนยันย้ายกลุ่ม " + node.text + " ไปยัง " + parent.text
                        } else {
                            var confirmtext = "Please Confirm Move Group " + node.text + " To " + parent.text
                        }
                        if (confirm(confirmtext)) {
                            if (parent.id === "#") {
                                alert("Some Error")
                                return false; // prevent moving a child above or below the root
                            } else {
                                $.ajax({
                                    type: 'POST',
                                    url: '/api/v1/organize/movegroup',
                                    data: { user: user, orgid: node.id, parent_id: parent.id },
                                    dataType: 'json',
                                    success: function (data) {

                                        if (document.getElementsByTagName('html')[0].lang == 'th') {
                                            $.notify('ย้ายกลุ่ม ' + node.text + ' ไปยัง ' + parent.text + ' เสร็จเรียบร้อย.', 'success');
                                        } else {
                                            $.notify('Move Group ' + node.text + ' to ' + parent.text + ' successed.', 'success');
                                        }

                                        if (data && data.redirect) {
                                            setTimeout(function () {
                                                window.location = data.redirect + '?access_token=' + token;
                                            }, 2000);
                                        }
                                    },
                                    error: function (data) {
                                        alert(data.responseText);
                                    }
                                });
                            }
                        } else {
                            return false; // Cancel Move
                        }
                    }
                } else {
                    if (operation === "copy_node" || operation === "move_node") {
                        if (parent.id === "#") {
                            return false; // prevent moving a child above or below the root
                        }
                    } else {
                        return true; // allow everything else
                    }
                }
            }
        },
        plugins: ["dnd"]

    });
    MoveEasyTree()
    $('.easy-tree').on("changed.jstree", function (e, data) {
        console.log(data)
        console.log("Has Children : " + data.node.children_d.length)
        if (data.selected.length != 0) {
            $('.btn-edit-org').attr('orgid', data.selected[0])
            $('.btn-edit-org').attr('org_name', data.node.text)
            $('.btn-edit-org')[0].style.display = ''
            if (data.node.parent != '#') {
                $('.btn-move-to-main').attr('orgid', data.selected[0])
                $('.btn-move-to-main').attr('org_name', data.node.text)
                $('.btn-move-to-main')[0].style.display = ''
            } else {
                $('.btn-move-to-main')[0].style.display = 'none'
            }

            $('.btn-delete-group').attr('org_child', data.node.children_d)
            $('.btn-delete-group').attr('orgid', data.selected[0])
            $('.btn-delete-group').attr('org_name', data.node.text)
            $('.btn-delete-group')[0].style.display = ''

            console.log("The selected nodes are:");
            $.getJSON('/api/v1/extensions/' + data.selected[0], { user: user }).done(function (data) {
                RenderTable(data)
            })
        }
    });
    $('.btn-groupview').on('click', function () {
        $('.btn-groupview').removeClass('btn-primary')
        $('.btn-groupview').removeClass('btn-secondary')
        $('.btn-groupview').addClass('btn-primary')
        $(this).removeClass('btn-primary')
        $(this).addClass('btn-secondary')
        console.log("Get : " + $(this).attr('data'))
        var select = $(this).attr('data')
        if (select == 'All') {
            $('#ext-list').removeClass('col-md-8')
            $('.easy-tree').removeClass('col-md-4')
            $('#ext-list').addClass('col-md-12')
            $('.jstree-container-ul')[0].style.display = 'none'
            $('.btn-edit-org')[0].style.display = 'none'
            $('.btn-move-to-main')[0].style.display = 'none'
            $('.btn-delete-group')[0].style.display = 'none'
            RenderTable([])
            $.getJSON('/api/v1/directorysearch/all/extension', { user: user }).done(function (data) {
                RenderTable(data)
            })
        }
        else if (select == 'Group') {
            $('#ext-list').addClass('col-md-8')
            $('#ext-list').removeClass('col-md-12')
            $('.easy-tree').addClass('col-md-4')
            $('.jstree-container-ul')[0].style.display = ''
            if ($('.btn-edit-org').attr('orgid') != undefined) {
                $('.btn-edit-org')[0].style.display = ''
                $('.btn-move-to-main')[0].style.display = ''
                $('.btn-delete-group')[0].style.display = ''
            } else {
                $('.btn-edit-org')[0].style.display = 'none'
                $('.btn-move-to-main')[0].style.display = 'none'
                $('.btn-delete-group')[0].style.display = 'none'
            }
            RenderTable([])
        }
        else if (select == 'NoGroup') {
            $('#ext-list').removeClass('col-md-8')
            $('#ext-list').addClass('col-md-12')
            $('.easy-tree').removeClass('col-md-4')
            $('.jstree-container-ul')[0].style.display = 'none'
            $('.btn-edit-org')[0].style.display = 'none'
            $('.btn-move-to-main')[0].style.display = 'none'
            $('.btn-delete-group')[0].style.display = 'none'
            $.getJSON('/api/v1/extensions/' + 0, { user: user }).done(function (data) {
                console.log("Group Data : " + data.length + " rows")
                RenderTable(data)
            })
        }
    })
    $('.btn-groupview')[0].click()
    RenderTable([])
    checklanguage()
}

function MoveEasyTree() {
    $('.move-easy-tree').jstree({
        'core': {
            'data': {
                "url": "/api/v1/reports/user/group/summary/get_organizations",
                "dataType": "json",
            }
        }
    });
    $('.move-easy-tree').on("changed.jstree", function (e, data) {
        console.log(data)
        console.log("Move Group In Select To " + data.selected[0]);
        $('.btn-org-move-ok').attr('groupid', data.selected[0])
        $('.btn-org-move-ok').removeAttr('disabled')
    });
}

function addchildren(tmp, data) {
    for (var i = 0; i < tmp.length; i++) {
        if (tmp[i].has_child != 0) {
            for (var n = 0; n < data.length; n++) {
                if (data[n].parent_orgid == tmp[i].orgid) {
                    if (tmp[i]['children'] == undefined) {
                        tmp[i]['children'] = []
                    }
                    if (data[n].has_child != 0 && data[n].has_child != '') {
                        data[n]["isFolder"] = true
                        data[n]["text"] = data[n].org_name
                        data[n]["id"] = data[n].orgid
                        tmp[i].children.push(data[n])
                    }
                    else {
                        data[n]["isFolder"] = false
                        data[n]["text"] = data[n].org_name
                        data[n]["id"] = data[n].orgid
                        tmp[i].children.push(data[n])
                    }
                }
            }
            var chkchildren = checkchild(tmp[i].children)
            if (chkchildren.status == false) {
                tmp[i]['children'] = addchildren(tmp[i].children, data)
            }
        }
    }
    var chkchildren = checkchild(tmp[i])
    if (chkchildren.status == true) {
        console.log(tmp)
        return tmp
    }
}
function checkchild(tmp) {
    if (tmp != undefined) {
        for (var i = 0; i < tmp.length; i++) {
            if (tmp[i].has_child != 0 && tmp[i]['children'] == undefined) {
                return { status: false, index: i }
            }
        }
        return { status: true, index: 0 }
    }
    return { status: true, index: 0 }
}

function RenderTable(data) {
    if (data.length != 0) {
        $('#ext-list').html('');
        var tmp=''
        tmp += "<table  class='table table-striped table-hover' id='extensiontable' width=100%>"
        tmp += "<thead class='thead-light'> <tr>"
        $.each(Object.keys(data[0]), function (i, d) {
            if(d == 'id'){

            }else{
                tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
            }
        })
        //tmp += "        <th data-i18n='action' style='text-align:center;'> Action </th>"
        tmp += '<tbody style="overflow-wrap: anywhere">'
        tmp += "    </tr> </thead>"
        $.each(data, function (i, d) {
            if(d['id'] != undefined){
		tmp += "    <tr class='ext-list-item showmoredetail' data-extension="+d.extension+"  data-pk=" + d.id +" data-email="+d.email+" data-name="+d.name+">"
            }else{
                tmp += "    <tr class='ext-list-item showmoredetail' data-extension="+d.extension+" data-pk=" + d.extension +" data-email="+d.email+" data-name="+d.name+">"
            }
            $.each(Object.keys(data[0]), function (i, keyname) {
                if(keyname.toString() == 'id'){

                }else{
                    if (d[keyname.toString()] == null) {
                        d[keyname.toString()] = ''
                    }

		if (keyname.toString() == 'has_license') {
                    if (d[keyname.toString()] == 1) {
                        d[keyname.toString()] = 'Active'
                    } else {
                        d[keyname.toString()] = 'InActive'
                    }
                    tmp += "<td> " + d[keyname.toString()] + "</td>"

                } else {
                    tmp += "<td> " + d[keyname.toString()] + "</td>"
                }
                    //tmp += "<td> " + d[keyname.toString()] + "</td>"
                }
            });
            //Action 
            //tmp += "<td align='center'><a class='btn btn-success btn-xs edit btn-ext-piece'data-val='" + d.extension + "' ><i class='fa fa-pencil-square-o'></i></a> <a class='btn btn-warning btn-xs '><i class='fa fa-trash'></i></a></td>"
            tmp += "</tr>"
        // tmp += "</tbody>"
        })
        tmp += "</table>"
        $('#ext-list').append(tmp);
        if (Cookies.get('lang') == 'th') {
            $('.lang-switch')[1].click()
        } else {
            $('.lang-switch')[0].click()
        }
    } 
    else {
        $('tbody').html('')
    }
    $('tbody')[0].style.height = (screen.height / 3) * 1.4 + "px"
}

function getGroupById(user, ext_lic, token, orgid) {
    console.log("Get Group By id ")

    $.getJSON('/api/v1/organize/all/'+orgid, { user: user }).done(function (data) {

        var org = '';
        $('.modal-body-org-list').html('');

        $.each(data, function (i, d) {
            //console.log(d);
            org = '';

            if (d.has_child != '' && d.has_child != null) {
                //alert(d.parent_orgid);
                org += '<a class="btn btn-app org-have-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
                org += '<span class="badge bg-yellow">C</span>';
            } else {
                org += '<a class="btn btn-app org-no-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
                //$('button.btn-org-list-up').addClass('disabled');
            }

            org += '<i class="fa fa-group"></i>';
            org += d.org_name;
            org += '</a>';

            $('.modal-body-org-list').append(org);
        });
    });
}

function getGroupInfoById(user, ext_lic, token, orgid) {
    console.log("Get Group INFO By id ")

    $.getJSON('/api/v1/organize/info/'+orgid, { user: user }).done(function (data) {

        $.each(data, function (i, d) {
            //console.log(d);

            var parent_org_name = null;

            /*if (!d.name)
                ext_name = '';
            else {
                ext_name = d.name;
            }*/

            if (!d.parent_orgid)
                parent_org_name = '';
            else {
                parent_org_name = d.pon;
            }

            // set organize id to hidden input
            $('input#inputEditOrgId').val(d.orgid);
            $('input#inputEditParentOrgId').val(d.parent_orgid);

            /*if (!d.authorization_code)
                auth_code = '';
            else {
                auth_code = d.authorization_code;
            }*/

            $('input#inputOrgName').val(d.org_name);
            $('input#inputEditOrgName').val(d.org_name); // set value to hidden input
            $('input#inputOrgBudget').val(d.budget);
            //$('input#inputOrgName').val(org_name);
            //$('select#selectExtType').val(d.exttype);
            //$('select#selectExtType').select2('val', d.exttype);
            //$('select#selectExtType').val(d.exttype).trigger('change');
            /*var arr_exttype = ['New', 'Normal', 'VIP', 'Guest'];
            var rd_list = '';

            for (var i = 0; i < arr_exttype.length; i++) {

                rd_list += '<div class="col-sm-3">';

                if (arr_exttype[i] == d.exttype)
                    rd_list += '<input type="radio" name="exttype" class="form-control flat-blue" data-val="'+arr_exttype[i]+'" checked>';
                else if (arr_exttype[i] == 'VIP' || arr_exttype[i] == 'Guest')
                    rd_list += '<input type="radio" name="exttype" class="form-control flat-blue" data-val="'+arr_exttype[i]+'" disabled>';
                else {
                    rd_list += '<input type="radio" name="exttype" class="form-control flat-blue" data-val="'+arr_exttype[i]+'">';
                }

                rd_list += '  &nbsp;' + arr_exttype[i];
                rd_list += '</div>';

                //console.log(rd_list);
            }

            rd_list += '<input id="selectEditExtType" type="hidden" name="exttypeval" class="form-control" value="">';

            $('.rd-exttype').html(rd_list);*/

            //$('input#inputExtAuthrizeCode').val(auth_code);
            $('input#inputExtCreated').val(d.created_at);
            $('input#inputExtUpdated').val(d.updated_on);
            //$('input#selectEditExtType').val(d.exttype);

            /*if (d.has_license == 1)
                $('input#inputExtLicense').iCheck('check');
                //$('input#inputExtLicense').prop('checked', true);*/

            $('h3.profile-username').html(d.company.toUpperCase());
            //$('p.text-muted.text-center').html('License created at');

            //Flat red color scheme for iCheck
            /*$('input[type="radio"].flat-blue').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });*/

            //Flat red color scheme for iCheck
            $('input[type="checkbox"].org-line-green').each(function(){
                var self = $(this);

                if (parent_org_name != '')
                    label_text = '' + parent_org_name;
                else {
                    label_text = ' NONE';
                }

                if (parent_org_name == '') {
                    self.iCheck({
                        checkboxClass: 'icheckbox_line-aero',
                        radioClass: 'iradio_line-aero',
                        insert: label_text
                    });
                    self.iCheck('uncheck');
                } else {
                    self.iCheck({
                        checkboxClass: 'icheckbox_line-green',
                        radioClass: 'iradio_line-green',
                        insert: label_text
                    });
                }
            });

        });
    });
}

function getGroupById2(user, ext_lic, token, orgid) {
    $.getJSON('/api/v1/organize/all/'+orgid, { user: user }).done(function (data) {

        //$('button.btn-org-list-up').addClass('disabled');
        var org = '';
        var selected_org = null;
        var parent_org_name = null;
        var pop = null; // parent orgid

        $('.modal-body-org-list').html('');

        $.each(data, function (i, d) {
            //console.log(d);
            org = '';

            if (d.has_child != '' && d.has_child != null) {
                org += '<a class="btn btn-app org-have-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
                org += '<span class="badge bg-yellow">C</span>';
            } else {
                org += '<a class="btn btn-app org-no-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
            }

            org += '<i class="fa fa-group"></i>';
            org += d.org_name;
            org += '</a>';

            parent_org_name = d.parent_name;

            if (d.pop)
                pop = d.pop;
            else {
                pop = 'null';
            }

            $('.modal-body-org-list').append(org);
        });

        //console.log(pop);

        $('button.btn-org-list-up').removeClass('disabled').attr('data-parent-orgid', pop);
        $('h4.modal-title').html('Organize List <button type="button" class="btn btn-xs btn-primary">'+parent_org_name+'</button>');
    });
}

function getGroupById3(user, ext_lic, token, orgid) {
    console.log("getGroupById3")
    $.getJSON('/api/v1/organize/all/'+orgid, { user: user }).done(function (data) {

        //$('button.btn-org-list-up').addClass('disabled');
        var org = '';
        var selected_org = null;
        var parent_org_name = null;
        var pop = null; // parent orgid

        $('.org-list').html('');

		var org = '<a class="btn btn-app btn-org-add bg-olive btn-flat" >';
        org += '<i class="fa fa-plus"></i>';
        org += 'Create Group';
        org += '</a>';
        org += '<a class="btn btn-move-org" >';
        org += '<i class="fa fa-exchange"></i>';
        org += 'Move Group';
        org += '</a>';

        $('.org-list').append(org);

        $.each(data, function (i, d) {
            //console.log(d);
            org = '';

            if (d.has_child != '' && d.has_child != null) {
                org += '<a class="btn btn-app org-have-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
                org += '<span class="badge bg-yellow">'+d.has_child+'</span>';
            } else {
                org += '<a class="btn btn-app org-no-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
            }

            org += '<i class="fa fa-group"></i>';
            org += d.org_name;
            org += '</a>';

            parent_org_name = d.parent_name;

            if (d.pop)
                pop = d.pop;
            else {
                pop = 'null';
            }

            $('.org-list').append(org);
        });

        //console.log(pop);

        $('button.btn-org-list-back').removeClass('disabled').attr('data-parent-orgid', pop);
        //$('h4.modal-title').html('Organize List <button type="button" class="btn btn-xs btn-primary">'+parent_org_name+'</button>');

		$('a.btn-org-add').click(function(ev) {
            ev.preventDefault();

            $('.modal-add-org').modal();
        });
    });
}

function getParentGroup(user, ext_lic, token, par_orgid) {
    console.log("getParentGroup")

	$.getJSON('/api/v1/organize/all/'+par_orgid, { user: user }).done(function (data) {

		var org = '';
		$('.modal-body-org-list').html('');

		$.each(data, function (i, d) {
			//console.log(d);
			org = '';

			if (d.has_child != '' && d.has_child != null) {
				//alert(d.parent_orgid);
				org += '<a class="btn btn-app org-have-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
				org += '<span class="badge bg-yellow">C</span>';
			} else {
				org += '<a class="btn btn-app org-no-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
				//$('button.btn-org-list-up').addClass('disabled');
			}

			org += '<i class="fa fa-group"></i>';
			org += d.org_name;
			org += '</a>';

			$('h4.modal-title').html('Organize List <button type="button" class="btn btn-xs btn-primary">'+d.parent_name+'</button>');

			if (d.pop != null)
				$('button.btn-org-list-up').attr('data-parent-orgid', d.pop);
			else {
				$('button.btn-org-list-up').attr('data-parent-orgid', 'null');
			}

			$('.modal-body-org-list').append(org);
		});
	});
}

function getParentGroup2(user, ext_lic, token, par_orgid) {
    console.log("getParentGroup2")

	$.getJSON('/api/v1/organize/all/'+par_orgid, { user: user }).done(function (data) {

		var org = '';
		$('.org-list').html('');

		var org = '<a class="btn btn-app btn-org-add bg-olive btn-flat" >';
        org += '<i class="fa fa-plus"></i>';
        org += 'Create Group';
        org += '</a>';
        org += '<a class="btn btn-move-org" >';
        org += '<i class="fa fa-exchange"></i>';
        org += 'Move Group';
        org += '</a>';
        $('.org-list').append(org);

		$.each(data, function (i, d) {
			//console.log(d);
			org = '';

			if (d.has_child != '' && d.has_child != null) {
				//alert(d.parent_orgid);
				org += '<a class="btn btn-app org-have-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
				org += '<span class="badge bg-yellow">'+d.has_child+'</span>';
			} else {
				org += '<a class="btn btn-app org-no-child" href="javascript:;" data-orgid="'+d.orgid+'" data-org-name="'+d.org_name+'" data-parent-orgid="'+d.parent_orgid+'" >';
				//$('button.btn-org-list-up').addClass('disabled');
			}

			org += '<i class="fa fa-group"></i>';
			org += d.org_name;
			org += '</a>';

			//$('h4.modal-title').html('Organize List <button type="button" class="btn btn-xs btn-primary">'+d.parent_name+'</button>');

			if (d.pop != null)
				$('button.btn-org-list-back').attr('data-parent-orgid', d.pop);
			else {
				$('button.btn-org-list-back').attr('data-parent-orgid', 'null');
			}

			$('.org-list').append(org);
		});

		$('a.btn-org-add').click(function(ev) {
            ev.preventDefault();

            $('.modal-add-org').modal();
        });
	});
}


$(document).ready(function () {
    $(document).keydown(function (event) {
        if (event.which == "17")
            cntrlIsPressed = true;
    });

    $(document).keyup(function () {
        cntrlIsPressed = false;
    });

    var cntrlIsPressed = false;
    var tmpExtSelect = [];
    $(document).on('click', '.ext-list-item', function () {
        console.log("Click ext list item with ctrl :" + cntrlIsPressed)
        if (!cntrlIsPressed) {
            $('.ext-list-item').removeClass(' bg-blue')
            tmpExtSelect = []
        }
        if (cntrlIsPressed && $(this)[0].className != "ext-list-item showmoredetail") {
            console.log("remove : " + $(this).attr('data-pk'))
            const index = tmpExtSelect.indexOf($(this).attr('data-pk'));
            if (index > -1) {
                tmpExtSelect.splice(index, 1);
            }
            $(this)[0].className = "ext-list-item showmoredetail"
        } else {
            $(this).addClass('bg-blue')
            tmpExtSelect.push($(this).attr('data-pk'))
        }
        console.log(tmpExtSelect)
    })

    $(document).on('click', '.btn-move-org', function () {
        if (document.getElementsByClassName('bg-blue').length != 0) {
            $('.modal-move-org').modal('show');
        } else {
            $('.modal-move-org-alert').modal('show');
        }
    })
    $(document).on('click', '.btn-edit-org', function () {
        console.log($(this).attr('org_name'))
        $('.btn-edit-org-ok').attr('orgid', $(this).attr('orgid'))
        $('#inputEditGroupName')[0].value = $(this).attr('org_name')
        $('.modal-edit-org').modal('show')
    })
    $(document).on('click', '.btn-edit-org-ok', function () {
        console.log($(this).attr('orgid'))
        var data = {
            orgid: $(this).attr('orgid'),
            org_name: $('#inputEditGroupName').val()
        }
        $.ajax({
            url: '/api/v1/organize/edit/',
            type: 'POST',
            data: data,
            success: function (data) {
                $('#inputEditGroupName').val('')
                $('.modal-edit-org').modal('hide')
                $('.easy-tree').jstree(true).refresh();
            },
            error: function (err) {
                console.log(err)
            }
        });

    })

    $(document).on('click', '.btn-move-to-main', function () {
        console.log($(this).attr('org_name'), $(this).attr('orgid'))
        var orgid = $(this).attr('orgid')
        var orgname = $(this).attr('org_name')
        var altext = ''
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            altext = 'Please Confirm Move ' + $(this).attr('org_name') +' to main ?'
        } else {
            altext = 'กรุณายืนยันการย้าย ' + $(this).attr('org_name') + ' ไปเป็นกลุ่มหลัก ?'
        }
        if (confirm(altext)) {
            $.ajax({
                type: 'POST',
                url: '/api/v1/organize/movegroup',
                data: { user: Cookies.get('user'), orgid: orgid, parent_id: null },
                dataType: 'json',
                success: function (data) {
                    if (document.getElementsByTagName('html')[0].lang == 'th') {
                        $.notify('ย้ายกลุ่ม ' + orgname + ' ไปยัง กลุ่มหลัก เสร็จเรียบร้อย.', 'success');
                    } else {
                        $.notify('Move Group ' + orgname + ' to Main successed.', 'success');
                    }
                    $('.btn-edit-org')[0].style.display = 'none'
                    $('.btn-move-to-main')[0].style.display = 'none'
                    $('.btn-delete-group')[0].style.display = 'none'
                    RenderEasyTreeGroup()
                },
                error: function (data) {
                    alert(data.responseText);
                }
            });
        }
    })

    $(document).on('click', '.btn-delete-group', function () {
        console.log($(this).attr('org_name'), $(this).attr('orgid'), $(this).attr('org_child'))
        var orgid = $(this).attr('orgid')
        var orgname = $(this).attr('org_name')
        var orgchild = JSON.parse("[" + $(this).attr('org_child') + "]")
        orgchild.push(orgid)
        var altext = ''
        var altext2 = ''
        var chk = 0
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            altext = 'Please Configm Delete Group ' + $(this).attr('org_name') + ' ?'
            altext2 = 'In This Group has parent do you want to delete ?'
        } else {
            altext = 'กรุณายืนยันการลบกลุ่ม ' + $(this).attr('org_name')
            altext2 = 'ในกลุ่มนี้มีกลุ่มย่อยอยู่ ต้องการจะลบหรือไม่'
        }
        if (orgchild.length != 0) {
            if (confirm(altext2)) {
                chk=1
            }
        } else {
            chk=1
        }
        if (chk == 1) {
            if (confirm(altext)) {
                $.ajax({
                    type: 'POST',
                    url: '/api/v1/organize/deletegroup',
                    data: { user: Cookies.get('user'), orgid: JSON.stringify(orgchild) },
                    dataType: 'json',
                    success: function (data) {
                        if (document.getElementsByTagName('html')[0].lang == 'th') {
                            $.notify('ลบกลุ่ม ' + orgname + 'เรียบร้อยแล้ว', 'success');
                        } else {
                            $.notify('Delete Group ' + orgname + ' successed.', 'success');
                        }
                        $('.btn-edit-org')[0].style.display = 'none'
                        $('.btn-move-to-main')[0].style.display = 'none'
                        $('.btn-delete-group')[0].style.display = 'none'
                        $('.easy-tree').jstree('destroy')
                        RenderEasyTreeGroup()
                    },
                    error: function (data) {
                        alert(data.responseText);
                    }
                });
            }
        }
    })

    $(document).on('click', '.btn-org-move-ok', function () {
        console.log("Move Group Confirm")
        var data = {
            groupid: $('.btn-org-move-ok').attr('groupid'),
            extensions: JSON.stringify(tmpExtSelect)
        }
        console.log(data)
        //Ajax
        $.ajax({
            type: 'POST',
            url: '/api/v1/organize/exttogroups',
            data: data,
            dataType: 'json',
            success: function (data) {
                console.log(data)
                tmpExtSelect = []
                $('.modal-move-org').modal('hide');
                $('.btn-secondary').click()
            }
        });
    })

})
