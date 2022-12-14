$(document).ready(function () {
    $(document).on('click', '.btn-trk-delete', function () {
        var confirmtxt = ''
        if (Cookies('lang') == 'th') {
            confirmtxt = "ต้องการลบ : " + $(this).attr('data-pk') + "หรือไม่"
        } else {
            confirmtxt = "Do you want to delete : " + $(this).attr('data-pk') + "?"
        }
        if (confirm(confirmtxt)) {
            $.ajax({
                // url: '/api/v1/trunk/' + d.route + '/' + d.trunk,
                type: 'DELETE',
                url: $(this).attr('data-href'),
                data: { pk: $(this).attr('data-pk') },
                success: function (data) {         
                    window.location.reload();
                },
                error: function (err) {
                    //console.log(err)
                }
            });
        }
    })
})

function getAllTrunk(user, ext_lic, token) {
    $.getJSON('/api/v1/trunk/all', { user: user }).done(function (data) {

        //$('button.btn-org-list-back').addClass('disabled');
        //var org = '';
        var selected_trk = null;

        $('.trk-list').html('');

        var trk = '<div class="row"><div class="col-md-6"><a class="btn btn-app btn-trk-add bg-olive btn-flat" >';
        trk += '<i class="fa fa-plus"></i>';
        if (document.getElementsByTagName('html')[0].lang != 'th') {
            trk += '<label data-i18n="create trunk">Create Trunk</label>';
        } else {
            trk += '<label data-i18n="create trunk">สร้างสายนอก</label>';
        }
        trk += '</a></div><div class="col-md-6"><input class="form-control" type="text" id="searchtrunk" onkeyup="searchtable(' + "'" + user + "'" +')" placeholder="Search...." data-i18n="[placeholder]search"></div></div>';

        $('.trk-list').append(trk+'</br><div id="trunklist">');
        RenderTableTrunk(data, user)


        $('a.btn-trk-add').click(function(ev) {
            ev.preventDefault();

            $('.modal-add-trk').modal();
        });

        $('.editable').editable({
            url: '/api/v1/trunk/update',
            ajaxOptions: {
                type: 'POST',
                dataType: 'json'
            }
        });

        // $(document).on('click', 'button.btn-add-trk-ok', function () {
        //     $.ajax({
        //         type: 'POST',
        //         url: '/api/v1/trunk/new',
        //         data: $('#newTrunkForm').serializeArray(),
        //         dataType: 'json',
        //         success: function (data) {
        //             $('.modal-add-trk').modal('hide');
        //             if (data) {
        //                 window.location.reload()
        //             }
        //         },
        //         error: function (data) {
        //             alert(data.responseText);
        //         }
        //     });
        // })
    });
}

function addTrunk(user, ext_lic, token) {
    var trunk_form = $('#newTrunkForm').serializeArray();
    trunk_form.push({name: 'user', value: user});
    //console.log(ext_form);
    $.ajax({
        type: 'POST',
        url: '/api/v1/trunk/new',
        data: trunk_form,
        dataType: 'json',
        success: function (data) {
            $('.modal-add-trk').modal('hide');
            if (data && data.redirect) {
                setTimeout(function(){
                    window.location.reload();
                }, 2000);
            }
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function searchtable(user) {
    console.log($('#searchtrunk').val())
    $.ajax({
        type: 'POST',
        url: '/api/v1/trunk/search',
        data: { user: user, keyword: $('#searchtrunk').val() },
        dataType: 'json',
        success: function (data) {
            console.log(data)
            RenderTableTrunk(data, user)
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

function RenderTableTrunk(data, user) {
    if (data.length != 0) {
        tmp = ''
        tmp += "<table  class='table table-striped table-hover' id='trunktable' width=100%>"
        tmp += "<thead class='thead-light'> <tr>"
        $.each(Object.keys(data[0]), function (i, d) {
            tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
        })
        tmp += "        <th data-i18n='action' style='text-align:center;'> Action </th>"
        tmp += "    </tr> </thead>"

        $('#trunklist').html('');
        // var tmp = ''
        // tmp += "<table  class='table table-striped table-hover' id='trunktable' width=100%>"
        // tmp += "<thead class='thead-light'> <tr>"
        
        // $.each(Object.keys(data[0]), function (i, d) {
        //     tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
        // })
        // tmp += "    </tr> </thead>"
        $.each(data, function (i, d) {
            var pk = JSON.stringify({
                route: d.route,
                trunk: d.trunk
            });

            tmp += "<tr class='showmoredetail' data-key='" + d[Object.keys(data[0])[0]] + "' data-keylength='" + Object.keys(data[0]).length * 2 + "'"
            $.each(Object.keys(data[0]), function (i, keyname) {
                tmp += ' data-key' + (i + 1).toString() + '="' + d[keyname.toString()] + '"'
                tmp += ' data-keyname' + (i + 1).toString() + '="' + Object.keys(data[0])[i] + '"'
            })
            tmp += ">"
            $.each(Object.keys(data[0]), function (i, keyname) {
                if (keyname.toString() == 'trk_name') {
                    tmp += '<td><a class="editable" href="#" data-name="' + keyname.toString() + '" data-title="Enter name" data-i18n="[data-title]enter name" data-pk=' + pk + '>' + (d[keyname.toString()] || '-') + '</td>';
                    // tmp += '<td><a class="editable" href="#" data-title="Enter area name" data-i18n="[data-title]enter area name" data-pk=' + pk + '>' + (d.areaname || '-') + '</td>';
                   // tmp += "<td> <a class='editable'" + 'data-type="text"  data-pk="' + pk + d.name + '" data-name="' + keyname.toString() + '" data-title="Enter ' + keyname.toString() + '" >' + (d[keyname.toString()] || '-')  + "</a></td>"
                } else {
                    tmp += "<td> <class=''" + 'data-type="text" data-pk="' + d.route + '" data-name="' + keyname.toString() + '" data-title="Enter ' + keyname.toString() + '" >' + (d[keyname.toString()] || '-') + "</td>"
                }
            });
            //Action 
            tmp += '<td><a class="btn btn-warning btn-xs btn-trk-delete" data-href="/api/v1/trunk/' + d.route + '/' + d.trunk + '" data-pk= "'+ d.route + "@" + d.trunk + '" ><i class="fa fa-trash"' + '</i></a></td>';
            //row += '<td><a class="btn btn-warning btn-xs pull-right delete-rates" data-href="/api/v1/rates/' + tableId + '/' + d.id + '/' + d.day + '" data-rates-value= "'+ d.id + "@" + d.day + '" ><i class="fa fa-trash"' + '</i></a></td>';
            // tmp += "<td align='center'> <a class='btn btn-warning btn-xs btn-trk-delete' data-pk='" + d.route + d.trunk + "''><i class='fa fa-trash'></i></a></td>"
            tmp += "</tr>"
        })

        // $.each(data, function (i, d) {

        //     $.each(Object.keys(data[0]), function (i, keyname) {
        //         if (d[keyname.toString()] == null) {
        //             d[keyname.toString()] = ''
        //         }
        //         tmp += "<td> " + d[keyname.toString()] + "</td>"
        //     });
        //     tmp += "<td align='center'> <a class='btn btn-warning btn-xs btn-trk-delete' data-pk='" + d.trunk +"' '><i class='fa fa-trash'></i></a></td>"
        //     //tmp += "<td align='center'><a class='btn btn-success btn-xs edit trk-no-child' data-trkid=" + d.trunk + " data-rtid=" + d.route + " data-trk-name=" + d.trk_name + "><i class='fa fa-pencil-square-o'></i></a></td>"
        //     tmp += "</tr>"
        // })
        tmp += "</table>"
        $('#trunklist').append(tmp);
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            $('.lang-switch')[1].click()
        } else {
            $('.lang-switch')[0].click()
        }
    }
    else {
        $('tbody').html('')
    }

    $('.showmoredetail').on('dblclick', function () {
        console.log("Render Modal data get CallIn & CallOut")
        console.log($(this))
        console.log($(this).attr('data-key1'))
        console.log($(this).attr('data-key2'))
        $('#view-detail-modal-header').html('<button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>' + '<h4 data-i18n="trunks">Trunks</h4><h4>' + $(this).attr('data-key2') + '( ' + $(this).attr('data-key1') + ')</h4> ')
        $('#view-detail-modal-body').html('<div id="callin"></div><div id="callout">')
        $.ajax({
            type: 'POST',
            url: '/api/v1/trunk/search/callin',
            data: { user: user, route: $(this).attr('data-key1'), trunk: $(this).attr('data-key2') },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.length != 0) {
                    $('#callin').html('<h4 data-i18n="callin">Call IN</h4>');
                    var tmp = ''
                    tmp += "<table  class='table table-striped table-hover' id='viewcallin' width=100%>"
                    tmp += "<thead class='thead-light'> <tr>"
                    $.each(Object.keys(data[0]), function (i, d) {
                        tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
                    })
                    tmp += "    </tr> </thead>"
                    $.each(data, function (i, d) {
                        tmp += "<tr class='' data-key='" + d[Object.keys(data[0])[0]] + "'>"
                        $.each(Object.keys(data[0]), function (i, keyname) {
                            if (d[keyname.toString()] == null) {
                                d[keyname.toString()] = ''
                            }
                            if (keyname.toString() == 'toll type' && d[keyname.toString()] != '') {
                                tmp += "<td data-i18n='" + d[keyname.toString()].toLowerCase() + "'> " + d[keyname.toString()] + "</td>"
                            } else {
                                tmp += "<td> " + d[keyname.toString()] + "</td>"
                            }
                        });
                        tmp += "</tr>"
                    })
                    tmp += "</table>"
                    $('#callin').append(tmp);
                }
                else {
                    $('#callin').html('<h4 data-i18n="callin">Call IN</h4><div align="center"><h5 data-i18n="no record data" >No Record Data</h5></div>');
                }
                checklanguage()
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
        $.ajax({
            type: 'POST',
            url: '/api/v1/trunk/search/callout',
            data: { user: user, route: $(this).attr('data-key1'), trunk: $(this).attr('data-key2') },
            dataType: 'json',
            success: function (data) {
                console.log(data)
                if (data.length != 0) {
                    $('#callout').html('<h4 data-i18n="callout">Call OUT</h4>');
                    var tmp = ''
                    tmp += "<table  class='table table-striped table-hover' id='viewcallout' width=100%>"
                    tmp += "<thead class='thead-light'> <tr>"
                    $.each(Object.keys(data[0]), function (i, d) {
                        tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
                    })
                    tmp += "    </tr> </thead>"
                    $.each(data, function (i, d) {
                        tmp += "<tr class='' data-key='" + d[Object.keys(data[0])[0]] + "'>"
                        $.each(Object.keys(data[0]), function (i, keyname) {
                            if (d[keyname.toString()] == null) {
                                d[keyname.toString()] = ''
                            }
                            if (keyname.toString() == 'toll type' && d[keyname.toString()] != '') {
                                tmp += "<td data-i18n='" + d[keyname.toString()].toLowerCase() + "'> " + d[keyname.toString()] + "</td>"
                            } else {
                                tmp += "<td> " + d[keyname.toString()] + "</td>"
                            }
                        });
                        tmp += "</tr>"
                    })
                    tmp += "</table>"
                    $('#callout').append(tmp);
                } else {
                    $('#callout').html('<h4 data-i18n="callout">Call OUT</h4><div align="center"><h5 data-i18n="no record data" >No Record Data</h5></div>');
                }

                checklanguage()
            },
            error: function (data) {
                alert(data.responseText);
            }
        });

        $('.view-detail').modal('show')
    })


    $('.editable').editable({
        url: '/api/v1/trunk/update',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }
    });
}




function getTrunkInfoById(user, ext_lic, token, rtid, trkid) {
    $.getJSON('/api/v1/trunk/info/'+rtid+'/'+trkid, { user: user }).done(function (data) {
        console.log("trunk info : ", data)
        $.each(data, function (i, d) {
            //console.log(d);

            $('input#inputRouteNo').val(d.route);
            $('input#inputTrunkNo').val(d.trunk); // set value to hidden input
            $('input#inputTrunkName').val(d.trk_name);

            $('input#inputTrkCreated').val(d.created_at);
            $('input#inputTrkUpdated').val(d.updated_on);

            //$('h3.profile-username').html(d.company.toUpperCase());

            //Flat red color scheme for iCheck
            /*$('input[type="checkbox"].org-line-green').each(function(){
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
            });*/

        });
    });
}
