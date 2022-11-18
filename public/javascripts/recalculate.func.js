$(document).ready(function () {
    var today_date = moment();
    var yesterday_date = moment().subtract(1, 'days');

    $(document).on('change','#optReportDate',function () {
        switch ($('#optReportDate').val()) {
            case "Today":
                $('input#dtpDateFrom').val(formatDate(today_date));
                $('input#dtpDateTo').val(formatDate(today_date));
                break;
            case "Yesterday":
                $('input#dtpDateFrom').val(formatDate(yesterday_date));
                $('input#dtpDateTo').val(formatDate(yesterday_date));
                break;
            case "This Week":
                $('input#dtpDateFrom').val(formatDate(moment().startOf('week')));
                $('input#dtpDateTo').val(formatDate(today_date));
                break;
            case "Last Week":
                $('input#dtpDateFrom').val(formatDate(moment().subtract(1, 'week').startOf('week')));
                $('input#dtpDateTo').val(formatDate(moment().subtract(1, 'week').endOf('week')));
                break;
            case "This Month":
                $('input#dtpDateFrom').val(formatDate(moment().startOf('month')));
                $('input#dtpDateTo').val(formatDate(today_date));
                break;
            case "Last Month":
                $('input#dtpDateFrom').val(formatDate(moment().subtract(1, 'month').startOf('month')));
                $('input#dtpDateTo').val(formatDate(moment().subtract(1, 'month').endOf('month')));
                break;
            case "Year to date":
                $('input#dtpDateFrom').val(formatDate(moment().startOf('year')));
                $('input#dtpDateTo').val(formatDate(today_date));
                break;
            case "Manual Select":
                break;
            default:
        }
    });

})
function RecalculateLoad(user, ext_lic, token) {
    $('.recalculate-view').html('')
    $('.recalculate-view').append('<div class="row"><div class="col-md-4 recalculate-mode-list"></div><div class="col-md-8 recalculate-display"></div></div>');
    RenderRecalculateModeList(user, ext_lic, token)
    defaultRender()

    //
    $(document).on('change', '#optReportDate', function () {
        if (this.value == 'Manual Select') {
            $('#dtpDateTo').removeAttr('disabled')
            $('#dtpDateFrom').removeAttr('disabled')
        } else {
            $('#dtpDateTo').attr('disabled', 'disabled')
            $('#dtpDateFrom').attr('disabled', 'disabled')
        }
    })
}

function defaultRender() {
    $('.recalculate.r1').click()
}

function RenderRecalculateModeList(user, ext_lic, token) {
    $('.recalculate-mode-list').html('')
    var tmp = ''
    tmp +='<button class="btn btn-secondary recalculate r1" action="r1" type="button" style="width:100%; text-align:left;" data-i18n="recalculate by date">Recalculate By Date</button>'
    tmp +='<button class="btn btn-secondary recalculate r2" action="r2" type="button" style="width:100%; text-align:left;" data-i18n="recalculate by tolltype">Recalculate By TollType</button>'
   // tmp +='<button class="btn btn-secondary recalculate r3" action="r3" type="button" style="width:100%; text-align:left;" data-i18n="recalculate by group">Recalculate By Group</button>'
   //  tmp +='<button class="btn btn-secondary recalculate r4" action="r4" type="button" style="width:100%; text-align:left;" data-i18n="recalculate by extension">Recalculate By Extension</button>'
    $('.recalculate-mode-list').append(tmp)
    //onselect
    $('.recalculate').on('click', function () {
        ReRenderRecalculate()
        $('.' + $(this).attr('action'))[0].className = "btn btn-primary recalculate " + $(this).attr('action')
        var fn = window['RenderRecalculateModeDisplay_' + $(this).attr('action')];
        if (typeof fn === "function") {
            fn(user)
        } else {
            alert('Error Function Name : ' + 'RenderRecalculateModeDisplay_' + $(this).attr('action') + '()')
        }
    })

    $(document).on('click', '.confirm-recalculate', function (){
        console.log("action : " + $(this).attr('action'))
        if ($(this).attr('action') == 'r1') {
            console.log("Select : " + $('#optReportDate').val())
            console.log("Date From : "+ $('input#dtpDateFrom').val())
            console.log("Date To : " + $('input#dtpDateTo').val())
            modalLoadingView()
            var param = moment($('input#dtpDateFrom').val(), 'YYYY-MM-DD').format('YYYY-MM-DD 0:00:00') + "/" + moment($('input#dtpDateTo').val(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59')
            $.getJSON('/api/v1/recalculate/date/' + param, { user: user }).done(function (data) {
                console.log(data)
                var body = "<label data-i18n='recalculate' style='font-size:18px;'></label> <label style='font-size:18px;'>" + data.length + "</label> <label style='font-size:18px;' data-i18n='Records'>Records</label>"
                body += '&nbsp;<label data-i18n="timeremining" style="font-size:18px;">timeremining</label> &nbsp; <label style="font-size:18px;">' + moment.utc(moment.duration(((data.length * 500) / 1000), 'seconds').as('milliseconds')).format('HH:mm:ss'); + '</label>'
                modalLoadingView(undefined, body,'')
                setTimeout(function () {
                                            modalLoadingView(undefined, "<h3 data-i18n='recalculate success'></h3>",'<button type="button" data-dismiss="modal" data-i18n="close" class="btn btn-default">Close</button>')
                }, data.length * 500);
            })
        }
        if ($(this).attr('action') == 'r2') {
            var param = ''
            if ($("#ckbTollTypeUnknown").is(':checked')) {
                param += 'Unknow,'
            }
            if ($("#ckbTollTypeHotline").is(':checked')) {
                param += 'Free,'
            }
            if ($("#ckbTollTypeLocal").is(':checked')) {
                param += 'Local,'
            }
            if ($("#ckbTollTypeMobile").is(':checked')) {
                param += 'Mobile,'
            }
            if ($("#ckbTollTypeDomestic").is(':checked')) {
                param += 'Domestic,'
            }
            if ($("#ckbTollTypeInternational").is(':checked')) {
                param += 'International'
            }
            if (param != '') {
                modalLoadingView()
                $.getJSON('/api/v1/recalculate/tolltype/' + param, { user: user }).done(function (data) {
                    console.log(data)
                    var body = "<label data-i18n='recalculate' style='font-size:18px;'></label> <label style='font-size:18px;'>" + data.length + "</label> <label style='font-size:18px;' data-i18n='Records'>Records</label>"
                    body += '&nbsp;<label data-i18n="timeremining" style="font-size:18px;">timeremining</label> &nbsp; <label style="font-size:18px;">' + moment.utc(moment.duration(((data.length * 500) / 1000), 'seconds').as('milliseconds')).format('HH:mm:ss'); + '</label>'
                    modalLoadingView(undefined, body,'')
                    setTimeout(function () {
                                                modalLoadingView(undefined, "<h3 data-i18n='recalculate success'></h3>",'<button type="button" data-dismiss="modal" data-i18n="close" class="btn btn-default">Close</button>')
                    }, data.length * 500);
                })
            } else {
                if (document.getElementsByTagName('html')[0].lang == 'th') {
                    alert("กรุณาเลือกชนิดการโทร")
                } else {
                    alert("Please Select TollType")
                }
            }

        }
        if ($(this).attr('action') == 'r3') {
            if ($(this).attr('recal-group') != '') {
                console.log("Recalculate By Group : " + $(this).attr('recal-group'))
                modalLoadingView()
                $.getJSON('/api/v1/recalculate/group/' + $(this).attr('recal-group') , { user: user }).done(function (data) {
                    console.log(data)
                    var body = "<label data-i18n='recalculate' style='font-size:18px;'></label> <label style='font-size:18px;'>" + data.length + "</label> <label style='font-size:18px;' data-i18n='Records'>Records</label>"
                    body += '&nbsp;<label data-i18n="timeremining" style="font-size:18px;">timeremining</label> &nbsp; <label style="font-size:18px;">' + moment.utc(moment.duration(((data.length * 500) / 1000), 'seconds').as('milliseconds')).format('HH:mm:ss'); + '</label>'
                    modalLoadingView(undefined, body,'')
                    setTimeout(function () {
                        modalLoadingView(undefined, "<h3 data-i18n='recalculate success'></h3>",'<button type="button" data-dismiss="modal" data-i18n="close" class="btn btn-default">Close</button>')
                    }, data.length * 500);
                })
            }
            else {
                if (document.getElementsByTagName('html')[0].lang == 'th') {
                    alert("กรุณาเลือกกลุ่ม")
                } else {
                    alert("Please Select Group")
                }
            }
        }
        if ($(this).attr('action') == 'r4') {
            console.log("Select : " + $('#optReportDate').val())
            console.log("Date From : " + $('input#dtpDateFrom').val())
            console.log("Date To : " + $('input#dtpDateTo').val())
            console.log("Unknow : " + $("#ckbTollTypeUnknown").is(':checked'))
            console.log("HotLine : " + $("#ckbTollTypeHotline").is(':checked'))
            console.log("Local : " + $("#ckbTollTypeLocal").is(':checked'))
            console.log("Mobile : " + $("#ckbTollTypeMobile").is(':checked'))
            console.log("Domestic : " + $("#ckbTollTypeDomestic").is(':checked'))
            console.log("International : " + $("#ckbTollTypeInternational").is(':checked'))
            console.log("Extension From : " + $('#txtExtensionFrom').val())
            console.log("Extension To : " + $('#txtExtensionTo').val())
            var param = moment($('input#dtpDateFrom').val(), 'YYYY-MM-DD').format('YYYY-MM-DD 0:00:00') + "/" + moment($('input#dtpDateTo').val(), 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59') +"/"

            if ($("#ckbTollTypeUnknown").is(':checked')) {
                param += 'Unknow,'
            }
            if ($("#ckbTollTypeHotline").is(':checked')) {
                param += 'Free,'
            }
            if ($("#ckbTollTypeLocal").is(':checked')) {
                param += 'Local,'
            }
            if ($("#ckbTollTypeMobile").is(':checked')) {
                param += 'Mobile,'
            }
            if ($("#ckbTollTypeDomestic").is(':checked')) {
                param += 'Domestic,'
            }
            if ($("#ckbTollTypeInternational").is(':checked')) {
                param += 'International'
            }
            param += "/" + $('#txtExtensionFrom').val() + "/" + $('#txtExtensionTo').val()
            modalLoadingView()
            $.getJSON('/api/v1/recalculate/extension/' + param, { user: user }).done(function (data) {
                var body = "<label data-i18n='recalculate' style='font-size:18px;'></label> <label style='font-size:18px;'>" + data.length + "</label> <label style='font-size:18px;' data-i18n='Records'>Records</label>"
                body += '&nbsp;<label data-i18n="timeremining" style="font-size:18px;">timeremining</label> &nbsp; <label style="font-size:18px;">' + moment.utc(moment.duration(((data.length * 500) / 1000), 'seconds').as('milliseconds')).format('HH:mm:ss'); + '</label>'
                modalLoadingView(undefined, body,'')
                setTimeout(function () {
                                            modalLoadingView(undefined, "<h3 data-i18n='recalculate success'></h3>",'<button type="button" data-dismiss="modal" data-i18n="close" class="btn btn-default">Close</button>')
                }, data.length * 500);
            })
        }
    })
}

function RenderRecalculateModeDisplay_r1(user) {
    var today_date = moment();
    var yesterday_date = moment().subtract(1, 'days');
    $('.recalculate-display').html('')
    $('.recalculate-display').append('<h3 data-i18n="recalculate by date">Recalculate By Date</h3>')
    var tmp = ''
    tmp += '<form id = "Recalculate_r1" class="form-horizontal" >'
    tmp += '<div class="form-group">'
    tmp += '<label for="dtpDateTimeFrom" data-i18n="reportdate" class="col-sm-2 control-label">Report Date</label>'
    tmp += '<div class="col-sm-10">'
    tmp += '    <div class="row">'
    tmp += '        <div class="col-sm-6">'
    tmp += '            <select id="optReportDate" class="form-control">'
    tmp += '                <option value="Today" data-i18n="Today">Today</option>'
    tmp += '                <option value="Yesterday" data-i18n="Yesterday">Yesterday</option>'
    tmp += '                <option value="This Week" data-i18n="This Week">This Week</option>'
    tmp += '                <option value="Last Week" data-i18n="Last Week">Last Week</option>'
    tmp += '                <option value="This Month" data-i18n="This Month">This Month</option>'
    tmp += '                <option value="Last Month" data-i18n="Last Month">Last Month</option>'
    tmp += '                <option value="Year to date" data-i18n="Year to date">Year to date</option>'
    tmp += '                <option value="Manual Select" data-i18n="Manual Select">Manual Select</option>'
    tmp += '            </select>'
    tmp += '        </div>'
    tmp += '    </div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '<div class="form-group">'
    tmp += '<label for="dtpDateTimeFrom" data-i18n="DateTimeFrom" class="col-sm-2 control-label">Date Time From</label>'
    tmp += '            <div class="col-sm-10">'
    tmp += '<div class="row">'
    tmp += '<div class="col-sm-12">'
    tmp += '<input id="dtpDateFrom" name="date_from" type="date" class="form-control">'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '<div class="form-group">'
    tmp += '<label for="dtpDateTimeTo" data-i18n="DateTimeTo" class="col-sm-2 control-label">Date Time To</label>'
    tmp += '<div class="col-sm-10">'
    tmp += '<div class="row">'
    tmp += '                <div class="col-sm-12">'
    tmp += '<input id="dtpDateTo" name="date_to" type="date" class="form-control">'
    tmp += '                        </div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</form>'
    
    $('.recalculate-display').append(tmp)
    $('.recalculate-display').append('<br><div align="left"><button class="btn btn-primary confirm-recalculate" action="r1" type="button" style="width:35%;" data-i18n="recalculate">Recalculate</button></div>')
    if (document.getElementsByTagName('html')[0].lang == 'th') {
        $('.lang-switch')[1].click()
    } else {
        $('.lang-switch')[0].click()
    }
    $('input#dtpDateFrom').val(formatDate(today_date));
    $('input#dtpDateTo').val(formatDate(today_date));
    $('#dtpDateTo').attr('disabled', 'disabled')
    $('#dtpDateFrom').attr('disabled', 'disabled')
}

function RenderRecalculateModeDisplay_r2(user) {
    $('.recalculate-display').html('')    
    $('.recalculate-display').append('<h3 data-i18n="recalculate by tolltype">Recalculate By TollType</h3>')
    var tmp = ''
    tmp += '<form id = "Recalculate_r2" class="form-horizontal">'
    tmp += '<div class="form-group">'
    tmp += '    <label for="ckbTollType" data-i18n="toll type" class="col-sm-2 control-label">Toll Type</label>'
    tmp += '        <div class="col-sm-10">'
    tmp += '            <label class="checkbox-inline">'
    tmp += '                <input id="ckbTollTypeUnknown" type="checkbox" value="unknown">'
    tmp += '                <label data-i18n="unknown"> Unknown</label>'
    tmp += '            </label>'
    tmp += '            <label class="checkbox-inline">'
    tmp += '                <input id="ckbTollTypeHotline" type="checkbox" value="hotline" checked="checked">'
    tmp += '                <label data-i18n="hotline">HotLine</label>'
    tmp += '            </label>'
    tmp += '            <label class="checkbox-inline">'
    tmp += '                <input id="ckbTollTypeLocal" type="checkbox" value="local" checked="checked">'
    tmp += '                <label data-i18n="local">Local</label>'
    tmp += '            </label>'
    tmp += '            <label class="checkbox-inline">'
    tmp += '                <input id="ckbTollTypeMobile" type="checkbox" value="mobile" checked="checked">'
    tmp += '                <label data-i18n="mobile">Mobile</label>'
    tmp += '            </label>'
    tmp += '            <label class="checkbox-inline">'
    tmp += '                <input id="ckbTollTypeDomestic" type="checkbox" value="domestic" checked="checked">'
    tmp += '                <label data-i18n="domestic">Domestic</label>'
    tmp += '            </label>'
    tmp += '            <label class="checkbox-inline">'
    tmp += '                <input id="ckbTollTypeInternational" type="checkbox" value="international" checked="checked">'
    tmp += '                <label data-i18n="international">International</label>'
    tmp += '            </label>'
    tmp += '        </div>'
    tmp += '</div>'
    tmp += '</form>'

    $('.recalculate-display').append(tmp)
    $('.recalculate-display').append('<br><div align="left"><button class="btn btn-primary confirm-recalculate" action="r2" type="button" style="width:35%;" data-i18n="recalculate">Recalculate</button></div>')
    if (document.getElementsByTagName('html')[0].lang == 'th') {
        $('.lang-switch')[1].click()
    } else {
        $('.lang-switch')[0].click()
    }
}

function RenderRecalculateModeDisplay_r3(user) {
    $('.recalculate-display').html('')
    $('.recalculate-display').append('<h3 data-i18n="recalculate by group">Recalculate By Group</h3>')
    $.getJSON('/api/v1/organize/alls', { user: user }).done(function (data) {
        $('.recalculate-display').append('<div class="row"><div class="easy-tree col-md-12" style="height:100%;"></div></div>');
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
            }
        });
        $('.recalculate-display').append('<br><div align="left"><button class="btn btn-primary confirm-recalculate" action="r3" recal-group="" type="button" style="width:35%;" data-i18n="recalculate">Recalculate</button></div>')
        $('.easy-tree').on("changed.jstree", function (e, data) {
            //console.log("The selected nodes are: " + data.selected[0]);
            $('.confirm-recalculate').attr('recal-group', data.selected[0])
        });
    })

    if (document.getElementsByTagName('html')[0].lang == 'th') {
        $('.lang-switch')[1].click()
    } else {
        $('.lang-switch')[0].click()
    }
}

function RenderRecalculateModeDisplay_r4(user) {
    var today_date = moment();
    var yesterday_date = moment().subtract(1, 'days');
    $('.recalculate-display').html('')
    $('.recalculate-display').append('<h3 data-i18n="recalculate by extension">Recalculate By Extension</h3>')
    var tmp = ''
    tmp += '<form id="RecalculateExtension" class="form-horizontal">'
    tmp += '<div class="form-group">'
    tmp += '<label for="dtpDateTimeFrom" data-i18n="reportdate" class="col-sm-2 control-label">Report Date</label>'
    tmp += '<div class="col-sm-10">'
    tmp += '<div class="row">'
    tmp += '<div class="col-sm-6">'
    tmp += '<select id="optReportDate" class="form-control">'
    tmp += '<option value="Today" data-i18n="Today">Today</option>'
    tmp += '<option value="Yesterday" data-i18n="Yesterday">Yesterday</option>'
    tmp += '<option value="This Week" data-i18n="This Week">This Week</option>'
    tmp += '<option value="Last Week" data-i18n="Last Week">Last Week</option>'
    tmp += '<option value="This Month" data-i18n="This Month">This Month</option>'
    tmp += '<option value="Last Month" data-i18n="Last Month">Last Month</option>'
    tmp += '<option value="Year to date" data-i18n="Year to date">Year to date</option>'
    tmp += '<option value="Manual Select" data-i18n="Manual Select">Manual Select</option>'
    tmp += '</select>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '<div class="form-group">'
    tmp += '<label for="dtpDateTimeFrom" data-i18n="DateTimeFrom" class="col-sm-2 control-label">Date Time From</label>'
    tmp += '<div class="col-sm-10">'
    tmp += '<div class="row">'
    tmp += '<div class="col-sm-12">'
    tmp += '<input id="dtpDateFrom" name="date_from" type="date" class="form-control">'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '<div class="form-group">'
    tmp += '<label for="dtpDateTimeTo" data-i18n="DateTimeTo" class="col-sm-2 control-label">Date Time To</label>'
    tmp += '<div class="col-sm-10">'
    tmp += '<div class="row">'
    tmp += '<div class="col-sm-12">'
    tmp += '<input id="dtpDateTo" name="date_to" type="date" class="form-control">'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '<div class="form-group">'
    tmp += '<label for="ckbTollType" data-i18n="toll type" class="col-sm-2 control-label">Toll Type</label>'
    tmp += '<div class="col-sm-10">'
    tmp += '<label class="checkbox-inline">'
    tmp += '<input id="ckbTollTypeUnknown" type="checkbox" value="unknown">'
    tmp += '<label data-i18n="unknown"> Unknown</label>'
    tmp += '</label>'
    tmp += '<label class="checkbox-inline">'
    tmp += '<input id="ckbTollTypeHotline" type="checkbox" value="hotline" checked="checked">'
    tmp += '<label data-i18n="hotline">HotLine</label>'
    tmp += '</label>'
    tmp += '<label class="checkbox-inline">'
    tmp += '<input id="ckbTollTypeLocal" type="checkbox" value="local" checked="checked">'
    tmp += '<label data-i18n="local">Local</label>'
    tmp += '</label>'
    tmp += '<label class="checkbox-inline">'
    tmp += '<input id="ckbTollTypeMobile" type="checkbox" value="mobile" checked="checked">'
    tmp += '<label data-i18n="mobile">Mobile</label>'
    tmp += '</label>'
    tmp += '<label class="checkbox-inline">'
    tmp += '<input id="ckbTollTypeDomestic" type="checkbox" value="domestic" checked="checked">'
    tmp += '<label data-i18n="domestic">Domestic</label>'
    tmp += '</label>'
    tmp += '<label class="checkbox-inline">'
    tmp += '<input id="ckbTollTypeInternational" type="checkbox" value="international" checked="checked">'
    tmp += '<label data-i18n="international">International</label>'
    tmp += '</label>'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '<div class="form-group">'
    tmp += '<label for="rbCallType" data-i18n="from extension" class="col-sm-2 control-label">From Extension</label>'
    tmp += '<div class="col-sm-10">'
    tmp += '<input id="txtExtensionFrom" type="text" value="" class="form-control">'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '<div class="form-group">'
    tmp += '<label for="rbCallType" data-i18n="to extension" class="col-sm-2 control-label">To Extension</label>'
    tmp += '<div class="col-sm-10">'
    tmp += '<input id="txtExtensionTo" type="text" value="" class="form-control">'
    tmp += '</div>'
    tmp += '</div>'
    tmp += '</form>'
    $('.recalculate-display').append(tmp)
    $('.recalculate-display').append('<br><div align="left"><button class="btn btn-primary confirm-recalculate" action="r4" type="button" style="width:35%;" data-i18n="recalculate">Recalculate</button></div>')
    if (document.getElementsByTagName('html')[0].lang == 'th') {
        $('.lang-switch')[1].click()
    } else {
        $('.lang-switch')[0].click()
    }
    $('input#dtpDateFrom').val(formatDate(today_date));
    $('input#dtpDateTo').val(formatDate(today_date));
    $('#dtpDateTo').attr('disabled', 'disabled')
    $('#dtpDateFrom').attr('disabled', 'disabled')
}

function ReRenderRecalculate() {
    for (var i = 0; i < $('.recalculate').length; i++) {
        $('.recalculate')[i].className = "btn btn-secondary recalculate r" + (i + 1).toString()
    }
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

function modalLoadingView(header, body, footer,update) {
    if (header != undefined) {
        $('#headerLoadingView').html(header)
    }
    else {
        $('#headerLoadingView').html('<h3 data-i18n="recalculate">Recalculate</h3>')
    }
    if (body != undefined) {
        $('#bodyLoadingView').html(body)
    } else {
        $('#bodyLoadingView').html('<h3 data-i18n="loading">Loading</h3>')
    }
    if (footer != undefined) {
        $('#footerLoadingView').html(footer)
    }
    if (update != undefined) {

    } else {
        $('.LoadingView').modal('show')
    }
    if (document.getElementsByTagName('html')[0].lang == 'th') {
        $('.lang-switch')[1].click()
    } else {
        $('.lang-switch')[0].click()
    }
}
