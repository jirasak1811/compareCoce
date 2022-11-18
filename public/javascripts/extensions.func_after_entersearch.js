
$(document).ready(function () {
    $(document).on('click', '.btn-delete-extension', function () {

        var confirmtxt = ''
        if (Cookies('lang') == 'th') {
            confirmtxt = "ต้องการลบ : " + $(this).attr('data-pk') + "หรือไม่"
        } else {
            confirmtxt = "Do you want to delete : " + $(this).attr('data-pk') + "?"
        }

        if (confirm(confirmtxt)) {
            $.ajax({
                url: '/api/v1/extensions/delete/',
                type: 'POST',
                data: { pk: $(this).attr('data-pk') },
                success: function (data) {                    
                    window.location.reload()
                },
                error: function (err) {
                    //console.log(err)
                }
            });
        }
    })

    $(document).on('dblclick', '.showmoredetail', function () {
        $('#view-detail-body').html('')
        var extension = $(this).attr('data-pk').split(',')[0]
        var email = $(this).attr('data-email')
        var name
        if ($(this).attr('data-name') != undefined) {
            name = $(this).attr('data-name')
        }
        $.getJSON('/api/v1/extensions/info/' + extension, { user: Cookies('user') }).done(function (data) {
            console.log(data)
            if (data.length == 1) {
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='extension'>extension </b></div><div class='row col-md-6'>" + (data[0].extension || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='exttype'>exttype</b></div><div class='row col-md-6'>" + (data[0].exttype || "")+ "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='nameth'>Name(TH) </b></div><div class='row col-md-6'>" + (data[0].nameth || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='name'>Name(Eng)</b></div><div class='row col-md-6'>" + (data[0].name || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='employee_line'>Employee Line</b></div><div class='row col-md-6'>" + (data[0].employee_line || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='position'>Position</b></div><div class='row col-md-6'>" + (data[0].position || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='email'>Email</b></div><div class='row col-md-6'>" + (data[0].email || "") + "</div></div><div class='row col-md-6' style='display:none;'><div class='row col-md-6'><b data-i18n='employee_type'>Employee Type</b></div><div class='row col-md-6'>" + (data[0].employee_type || "")+ "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-2'><b data-i18n='groups'>Groups </b></div>" + ( data[0].org_path || "") + "</div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='rent_charge'>Rent charge </b></div><div class='row col-md-6'>" + (data[0].rent_charge || "") + "</div></div><div class='row col-md-6' ><div class='row col-md-6'><b data-i18n='special_service_fee'>Special Service Fee</b></div><div class='row col-md-6'>" +( data[0].special_service_fee || "") + "</div></div></div>")
            } else if (data.length > 1) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].email == email || data[i].name == name) {
                        data[0] = data[i]
                        break;
                    }
                }
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='extension'>extension </b></div><div class='row col-md-6'>" + (data[0].extension || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='exttype'>exttype</b></div><div class='row col-md-6'>" + (data[0].exttype || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='nameth'>Name(TH) </b></div><div class='row col-md-6'>" + (data[0].nameth || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='name'>Name(Eng)</b></div><div class='row col-md-6'>" + (data[0].name || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='employee_line'>Employee Line</b></div><div class='row col-md-6'>" + (data[0].employee_line || "") + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='position'>Position</b></div><div class='row col-md-6'>" + (data[0].position || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='email'>Email</b></div><div class='row col-md-6'>" + (data[0].email || "") + "</div></div><div class='row col-md-6' style='display:none;'><div class='row col-md-6'><b data-i18n='employee_type'>Employee Type</b></div><div class='row col-md-6'>" + (data[0].employee_type || "") + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-2'><b data-i18n='groups'>Groups </b></div>" + (data[0].org_path || "") + "</div>")
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='rent_charge'>Rent charge </b></div><div class='row col-md-6'>" + (data[0].rent_charge || "") + "</div></div><div class='row col-md-6' ><div class='row col-md-6'><b data-i18n='special_service_fee'>Special Service Fee</b></div><div class='row col-md-6'>" + (data[0].special_service_fee || "") + "</div></div></div>")

            }else {
                $('#view-detail-body').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='extension'>extension </b></div><div class='row col-md-6'>" + extension + "</div></div></div>")
                $('#view-detail-body').append("<div class='row col-md-12' align='center'><h5 data-i18n='not found extensions data'>Not Found Extensions Data</h5></div>")
            }
            if (document.getElementsByTagName('html')[0].lang == 'th') {
                $('.lang-switch')[1].click()
            } else {
                $('.lang-switch')[0].click()
            }
        })
        $('.view-detail').modal('show')
    })
    $(document).on('click', '.btn-ext-add',function (ev) {
        ev.preventDefault();
        $('.ext-modal-add-ext').modal();
    });
})
function getAllExtension(user, ext_lic, token) {
    $.getJSON('/api/v1/directorysearch/all/extension', { user: user }).done(function (data) {
        var ext = '<button class="btn btn-ext-add btn-app bg-olive btn-flat" >';
        ext += '<i class="fa fa-plus"></i>';
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            ext += '<label data-i18n="Create Ext.">Create Ext.</label>';
        } else {
            ext += '<label data-i18n="Create Ext.">สร้างเบอร์ภายใน</label>';
        }
        ext += '</button>'
            //<div class="col-md-6"><input class="form-control" type="text" id="searchextenstion" onkeyup="searchtable('+"'"+user+"'"+')" placeholder="Search...." data-i18n="[placeholder]search"></div></div>';
        $('.with-border').append(ext);
        RenderExtensionTable(data)
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            $('.with-border').append('<button type="button" class="btn-ext-add-range btn bg-purple btn-flat btn-app"> <i class="fa fa-plus-square"></i><label data-i18n="Create Extension Range">สร้างเบอร์ภายในแบบกำหนดช่วง</label></button>')
        } else {
            $('.with-border').append('<button type="button" class="btn-ext-add-range btn bg-purple btn-flat btn-app"> <i class="fa fa-plus-square"></i><label data-i18n="Create Extension Range">Create Extension Range</label></button>')
        }
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            $('.lang-switch')[1].click()
        } else {
            $('.lang-switch')[0].click()
        }
        //$('#searchextenstion')[0].style.display = 'none'
        $('#extensiontable').DataTable({
            initComplete: function () {
                var input = $('.dataTables_filter input').unbind(),
                    self = this.api(),
                    $searchButton = $('<button class="btn btn-primary" data-i18n="search">')
                        .text('search')
                        .click(function () {
                            self.search(input.val()).draw();
                        }),
                    $clearButton = $('<button class="btn" data-i18n="clear">')
                        .text('clear')
                        .click(function () {
                            input.val('');
                            $searchButton.click();
                        })
                $('.dataTables_filter').append($searchButton, $clearButton);
                $('#extensiontable_filter')[0].className = $('#extensiontable_filter')[0].className + " pull-right"
            }
        })  
        $('a.btn-ext-add').click(function(ev) {
            ev.preventDefault();

            $('.ext-modal-add-ext').modal();
        });

    });
}
function getAllExtensionGropPage(user, ext_lic, token) {
    $.getJSON('/api/v1/extensions/all', { user: user }).done(function (data) {

        tmp = ''
        tmp += "<table  class='table table-striped table-hover table-fixed' id='extensiontable' width=100%>"
        tmp += "<thead class='thead-light'> <tr>"
        $.each(Object.keys(data[0]), function (i, d) {
            tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
        })
        tmp += "        <th data-i18n='action' style='text-align:center;'> Action </th>"
        tmp += "    </tr> </thead>"
        //console.log(data)
        $.each(data, function (i, d) {
            tmp += "    <tr>"
            $.each(Object.keys(data[0]), function (i, keyname) {
                tmp += "<td> " + d[keyname.toString()] + "</td>"
            });
            //Action 
            tmp += "<td align='center'><a class='btn btn-success btn-xs edit btn-ext-piece'data-val='" + d.extension + "' ><i class='fa fa-pencil-square-o'></i></a> <a class='btn btn-warning btn-xs '><i class='fa fa-trash'></i></a></td>"
            tmp += "</tr>"
        })
        tmp += "</table>"
        $('#ext-list').append(tmp);
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            $('.lang-switch')[1].click()
        } else {
            $('.lang-switch')[0].click()
        }
    });
}

function RenderExtensionTable(data) {
    tmp = ''
    tmp += "<table  class='table table-striped table-hover' id='extensiontable' width=100%>"
    tmp += "<thead class='thead-light'> <tr>"
    $.each(Object.keys(data[0]), function (i, d) {
        if (d != 'emp_id') {
            tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
        }
    })
    tmp += "        <th data-i18n='action' style='text-align:center;width:30px'> Action </th>"
    tmp += "    </tr> </thead>"
    //console.log(data)
    editindex = 0;
    tmp += "<tbody id='ext-tbody' style='overflow-wrap:anywhere;'>"
    tmp += "</tbody>"
    tmp += "</table>"
    $('.ext-list').append(tmp);
    $('tbody')[0].style['max-height'] = (window.innerHeight / 3) * 1.5 + "px"
    $.each(data, function (i, d) {
        tmp =''
        tmp += "    <tr editindex='-' class='showmoredetail INL" + d.extension + "' data-extension='" + d.extension + "' data-pk='" + d.extension + "," + d.emp_id + "," + d.name + "' data-email='" + d.email + "'>"
        $.each(Object.keys(data[0]), function (i, keyname) {
            if (d[keyname.toString()] == null || d[keyname.toString()] == "null") {
                d[keyname.toString()] = '-'
            }

            if (keyname.toString() == 'org_path' || keyname.toString() == 'org_name') {
                tmp += "<td> <a class='INL" + d.extension + "'" + 'data-type="text" editindex="' + (editindex++) + '" data-extension="'+d.extension+'" data-pk="' + d.extension + "," + d.emp_id + "," + d.name + '" data-name="' + keyname.toString() + '" data-emp_id="' + d.emp_id + '" data-namepk="' + d.name + '" data-title="Enter ' + keyname.toString() + '" >' + (d[keyname.toString()] || '-') + "</a></td>"
            } else if (keyname.toString() == 'has_license') {
                tmp += "<td> <a class='editable-selectActive INL" + d.extension + "'" + 'data-value="' + d[keyname.toString()] + '" data-type="select" editindex="' + (editindex++) + '" data-extension="' + d.extension +'" data-pk="' + d.extension + "," + d.emp_id + "," + d.name + '" data-name="' + keyname.toString() + '" data-emp_id="' + d.emp_id + '" data-namepk="' + d.name + '" data-title="Enter ' + keyname.toString() + '" >' + (d[keyname.toString()] == '1' ? 'Active' : 'InActive') + "</a></td>"
            } else if (keyname.toString() == 'exttype') {
                tmp += "<td> <a class='editable-selectexttype INL" + d.extension + "'" + 'data-type="select" editindex="' + (editindex++) + '" data-extension="' + d.extension +'" data-pk="' + d.extension + "," + d.emp_id + "," + d.name + '" data-name="' + keyname.toString() + '" data-emp_id="' + d.emp_id + '" data-namepk="' + d.name + '"  data-title="Enter ' + keyname.toString() + '" >' + (d[keyname.toString()] || '-') + "</a></td>"
            } else if (keyname.toString() == 'emp_id') {

            } else if (keyname.toString() == 'rent_charge' || keyname.toString() == 'special_service_fee') {
                tmp += "<td> <a class='editable INL" + d.extension + "'" + 'data-type="text" editindex="' + (editindex++) + '" data-extension="' + d.extension +'" data-pk="' + d.extension + "," + d.emp_id + "," + d.name + '" data-name="' + keyname.toString() + '"data-emp_id="' + d.emp_id + '" data-namepk="' + d.name + '" data-title="Enter ' + keyname.toString() + '" >' + d[keyname.toString()] + "</a></td>"
            }
            else {
                tmp += "<td> <a class='editable INL" + d.extension + "'" + ' style="word-break:break-all;" data-type="text" editindex="' + (editindex++) + '" data-extension="' + d.extension +'" data-pk="' + d.extension + "," + d.emp_id + "," + d.name + '" data-name="' + keyname.toString() + '" data-emp_id="' + d.emp_id + '" data-namepk="' + d.name + '" data-title="Enter ' + keyname.toString() + '" >' + (d[keyname.toString()] || '-') + "</a></td>"
            }
        });
        //Action 
        tmp += "<td align='center' style='text-align:center;width:30px'> <a class='btn btn-warning btn-xs btn-delete-extension INL" + d.extension + "' editindex='-'  data-pk='" + d.extension + "," + d.emp_id + "," + d.name + "' data-namepk='" + d.name + "' data-emp_id='" + d.emp_id + "' data-extension='" + d.extension +"'><i class='fa fa-trash'></i></a></td>"
        tmp += "</tr>"
        $('#ext-tbody').append(tmp)
    })
    //Update editable
    updateEditable()
    //Update editable
    if (document.getElementsByTagName('html')[0].lang == 'th') {
        $('.lang-switch')[1].click()
    } else {
        $('.lang-switch')[0].click()
    }
}

function searchtable(user) {
    $('#extensiontable').remove()
    if ($('#searchextenstion').val() == '') {
        $.getJSON('/api/v1/directorysearch/all/extension', { user: user }).done(function (data) {
            $('#extensiontable').remove()
            RenderExtensionTable(data)
        })
    } else {
        $.getJSON('/api/v1/extensions/search/' + $('#searchextenstion').val(), { user: user }).done(function (data) {
            $('#extensiontable').remove()
            RenderExtensionTable(data)
       })    
    }

}

function updateEditable() { 
    var editabledata = {
        url: '/api/v1/extensions/update',
        //mode:'inline',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }, success: function (response, newValue) {
            if ($(this).attr('data-name') == 'extension' || $(this).attr('data-name') == 'name') {
                var oldpk = $(this).attr('data-pk')
                var emp_id = $(this).attr('data-emp_id')
                var name = $(this).attr('data-namepk')
                var extension = $(this).attr('data-extension')
                console.log("Old? emp_id: " + emp_id)
                console.log("Old? name: " + name)
                console.log("Old? extension: " + extension)
                console.log(" NewValue : " + newValue)
                console.log(" Edit on : " + $(this).attr('data-name'))
                if ($(this).attr('data-name') == 'name') {
                    newValue = extension + ',' + emp_id + ',' + newValue
                } else if ($(this).attr('data-name') == 'extension') {
                    newValue = newValue + ',' + emp_id + ',' + name
                }
                var tmp = 0;
                for (var i = $('.INL' + oldpk).length-1 ; i >= 0 ; i--) {
                    $('.INL' + oldpk)[i].attributes['data-pk'].value = newValue
                    tmp = $('.INL' + oldpk)[i].attributes['editindex'].value
                    if ($(this).attr('data-name') == 'extension' || $(this).attr('data-name') == 'name') {
                        $('.INL' + oldpk)[i].className = $('.INL' + oldpk)[i].className.replace("INL" + oldpk, "INL" + newValue)
                    }
                    $($('.editable')[tmp]).editable('option', 'pk', newValue)
                    $($('.editable')[tmp]).editable('option', 'data-pk', newValue)                    
                }
                $(this).text(newValue);
            }
        }
    }
    $('.editable').editable(editabledata);
    $('.editable-selectexttype').editable({
        source: [
            { 'Normal': 'Normal' },
            { 'VIP': 'VIP' },
            { 'Guest': 'Guest' },
        ],
        url: '/api/v1/extensions/update',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }
    });
    $('.editable-selectActive').editable({
        source: [
            { '1': 'Active' },
            { '0': 'InActive' },
        ],
        url: '/api/v1/extensions/update',
        //mode:'inline',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }
    });

}

function destroyEditable() {
    $('.editable').editable("destroy");
    $('.editable-selectexttype').editable("destroy");
    $('.editable-selectActive').editable("destroy");
}

function getExtensionById(user, ext_lic, token, extension) {
    $.getJSON('/api/v1/extensions/info/'+extension, { user: user }).done(function (data) {

        $.each(data, function (i, d) {
            ////console.log(d);

            var ext_name = null,
                org_name = null,
                auth_code = null;

            if (!d.name)
                ext_name = '';
            else {
                ext_name = d.name;
            }

            if (!d.orgid)
                org_name = '';
            else {
                org_name = d.org_name;
            }

            // set organize id to hidden input
            $('input#inputEditOrgId').val(d.orgid);
            $('input#inputEditParentOrgId').val(d.parent_orgid);

            if (!d.authorization_code)
                auth_code = '';
            else {
                auth_code = d.authorization_code;
            }

            $('input#inputExt').val(d.extension);
            $('input#inputEditExt').val(d.extension); // set value to hidden input
            $('input#inputExtName').val(ext_name);
            //$('input#inputOrgName').val(org_name);
            //$('select#selectExtType').val(d.exttype);
            //$('select#selectExtType').select2('val', d.exttype);
            //$('select#selectExtType').val(d.exttype).trigger('change');
            var arr_exttype = ['New', 'Normal', 'VIP', 'Guest'];
            var arr_exttypeTH = ['ใหม่', 'ปกติ', 'วีไอพี', 'ผู้มาเยือน'];
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
                if (document.getElementsByTagName('html')[0].lang != 'th') {
                    rd_list += "<label data-i18n='" + arr_exttype[i] + "'>  &nbsp;" + arr_exttype[i];
                } else {
                    rd_list += "<label data-i18n='" + arr_exttype[i] + "'>  &nbsp;" + arr_exttypeTH[i];
                }
                rd_list += '</div>';

                ////console.log(rd_list);
            }

            rd_list += '<input id="selectEditExtType" type="hidden" name="exttypeval" class="form-control" value="">';

            $('.rd-exttype').html(rd_list);

            $('input#inputExtAuthrizeCode').val(auth_code);
            $('input#inputExtCreated').val(d.created_at);
            $('input#inputExtUpdated').val(d.updated_on);
            $('input#selectEditExtType').val(d.exttype);

            if (d.has_license == 1)
                $('input#inputExtLicense').iCheck('check');
                //$('input#inputExtLicense').prop('checked', true);

            $('h3.profile-username').html(d.company.toUpperCase());
            //$('p.text-muted.text-center').html('License created at');

            //Flat red color scheme for iCheck
            $('input[type="radio"].flat-blue').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });

            //Flat red color scheme for iCheck
            /*$('input[type="radio"].line-green').iCheck({
                checkboxClass: 'icheckbox_line-green',
                radioClass: 'iradio_line-green'
                insert: '<div class="icheck_line-icon"></div>' + label_text
            });*/
            $('input[type="checkbox"].org-line-green').each(function(){
                var self = $(this);

                if (org_name != '')
                    label_text = '' + org_name;
                else {
                    label_text = ' NONE';
                }

                if (org_name == '') {
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

            /*$('input[type="radio"].flat-blue').on('ifChecked', function(event){
                //alert(event.type + ' callback');
                ////console.log($(this).attr('data-val'));
            });*/

            /*$('input[type="checkbox"].org-line-green').on('ifChecked', function(event){

                $('h4.modal-title').html('Organize List ');
                getAllGroup(user, ext_lic, token);
                //event.preventDefault();
                //alert(event.type + ' callback');
                //console.log($(this).attr('data-val'));
                $('.org-modal-list').modal();

                if (org_name == '') {
                    //alert('uncheck');
                    setTimeout(function(){
                        $('input[type="checkbox"].org-line-green').iCheck('uncheck');
                    }, 50);
                }
            });*/

        });
    });
}

function getTotalExtension(user, ext_lic, token) {
    $.getJSON('/api/v1/extensions/info/total/ext', { user: user }).done(function (data) {

        $.each(data, function (i, d) {
            ////console.log(d);
            $('a.lb-total-ext').text(d.te);
        });
    });
}

function getTotalGroup(user, ext_lic, token) {
    $.getJSON('/api/v1/extensions/info/total/group', { user: user }).done(function (data) {

        $.each(data, function (i, d) {
            ////console.log(d);
            $('a.lb-total-group').text(d.tg);
        });
    });
}

function addExtension(user, ext_lic, token, v_ext) {

    var ext_form = $('#newExtensionForm').serializeArray();
    ext_form.push({name: 'user', value: user});
    //console.log(ext_form);

    $.ajax({
        type: 'POST',
        url: '/api/v1/extensions/new',
        data: ext_form,
        dataType: 'json',
        success: function (data) {
            $('.ext-modal-add-ext').modal('hide');
            $.notify('Extension ' + v_ext + ' have been created.', 'success');

            if (data && data.redirect) {
                setTimeout(function(){
                    window.location = data.redirect + '?access_token=' + token;
                }, 2000);
            }
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function delExtension(user, ext_lic, token, v_ext) {

    //console.log(v_ext);

    $.ajax({
        type: 'DELETE',
        url: '/api/v1/extensions/' + v_ext + '?user=' + user,
        dataType: 'json',
        success: function (data) {
            $.notify('Extension ' + v_ext + ' have been deleted.', 'success');

            if (data && data.redirect) {
                setTimeout(function(){
                    window.location = data.redirect + '?access_token=' + token;
                }, 2000);
            }
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function updateExtension(user, ext_lic, token, v_ext) {

    var ext_form = $('#detailExtensionForm').serializeArray();
    ext_form.push({name: 'user', value: user});
    //console.log(ext_form);

    $.ajax({
        type: 'PUT',
        url: '/api/v1/extensions/' + v_ext,
        data: ext_form,
        dataType: 'json',
        success: function (data) {
            //$('.ext-modal-add-ext').modal('hide');
            $.notify('Extension ' + v_ext + ' have been updated.', 'success');

            if (data && data.redirect) {
                setTimeout(function(){
                    window.location = data.redirect + '?e=' + v_ext + '&access_token=' + token;
                }, 2000);
            }
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function addRangeExtension(user, ext_lic, token, v_from_ext, v_to_ext, v_name, v_exttype, v_authcode, v_lic) {

    var ext_range_form = $('#newExtensionRangeForm').serializeArray();
    ext_range_form.push({name: 'user', value: user});
    //console.log(ext_range_form);

    $.ajax({
        type: 'POST',
        url: '/api/v1/extensions/new/range',
        data: ext_range_form,
        dataType: 'json',
        success: function (data) {
            $('.ext-modal-add-range').modal('hide');
            $.notify('Extension since ' + v_from_ext + ' through ' + v_to_ext + ' have been created.', 'success');

            if (data && data.redirect) {
                setTimeout(function(){
                    window.location = data.redirect + '?access_token=' + token;
                }, 2000);
            }
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
