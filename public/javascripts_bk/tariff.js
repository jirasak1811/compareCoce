$(document).ready(function () {
    var tableId = $('select#providerTable option:selected').val();

    $('.tablepicker').selectpicker();
    setupPager($('#areacodePages'), '/api/v1/areacodes/p', showAreacode);
    setupPager($('#ratePages'), '/api/v1/rates/p', showRate);

    $('select#providerTable').change(function () {
        var tableId = $('select#providerTable option:selected').val();

        $.ajax({
            type: 'GET',
            url: '/api/v1/areacodes/p/' + tableId + '/1/' + rowPerPage,
            dataType: 'json',
            success: function (result) {
                var pager = $('#areacodePages');
                updatePager(pager, result.total);
                showAreacode(result.data);
            }
        });

        $.ajax({
            type: 'GET',
            url: '/api/v1/rates/p/' + tableId + '/1/' + rowPerPage,
            dataType: 'json',
            success: function (result) {
                updatePager($('#ratePages'), result.total);
                showRate(result.data);
            }
        });
    });
    //$('a.deleteuserbtn').click(function ()
    // $(document).on('click','a.delete-rates,function(){
    // }')
    // $(document).on('click','a.delete-rates',function(){
    //     var tr = $(this).closest('tr');
    //     var confirmtext =''
    //     if (document.getElementsByTagName('html')[0].lang == 'th') {
    //         confirmtext = ' ต้องการลบ : ' + d.areaname + 'หรือไม่'
    //     } else {
    //         confirmtext = ' Do you want to delete : ' + d.areaname + '?'
    //     }
    //     if (confirm(confirmtext)) {
    //         $.ajax({
    //             type: 'DELETE',
    //             url: '/api/v1/areacodes/' + tableId + '/' + d.areaname + '/' + d.areacode,
    //             dataType: 'json',
    //             success: function () {
    //                 tr.css("background-color", "sandybrown");
    //                 tr.fadeOut(1000, function () {
    //                     tr.remove();
    //                 });
    //             },
    //             error: function (data) {
    //                 alert(data.responseText);
    //             }
    //         });
    //     }
    // });
    $(document).on('click','a.delete-areacode',function() {
        console.log($(this).attr('data-href'));
        console.log($(this).attr('data-areacode-value'));
        var tr = $(this).closest('tr');
        var confirmtext =''
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            confirmtext = ' ต้องการลบ : ' + $(this).attr('data-areacode-value') + 'หรือไม่'
        } else {
            confirmtext = ' Do you want to delete : ' + $(this).attr('data-areacode-value') + '?'
        }
        event.preventDefault();
        if (confirm(confirmtext)) {
        $.ajax({
            type: 'DELETE',
            url: $(this).attr('data-href'),
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
    }});

    $(document).on('click','a.delete-rates',function() {
        console.log($(this).attr('data-href'));
        console.log($(this).attr('data-rates-value'));
        var tr = $(this).closest('tr');
        var confirmtext =''
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            confirmtext = ' ต้องการลบ : ' + $(this).attr('data-rates-value') + 'หรือไม่'
        } else {
            confirmtext = ' Do you want to delete : ' + $(this).attr('data-rates-value') + '?'
        }
        event.preventDefault();
        if (confirm(confirmtext)) {
        $.ajax({
            type: 'DELETE',
            url: $(this).attr('data-href'),
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
    }});

    $('button#saveNewAreacode').click(function () {
        var tableId = $('select#providerTable option:selected').val();
        $.ajax({
            type: 'POST',
            url: '/api/v1/areacodes/new/' + tableId,
            data: $('#newAreacodeForm').serializeArray(),
            dataType: 'json',
            success: function (data) {
                $('#newAreacodeDialog').modal('hide');

                if (data && data.redirect) {
                    window.location.reload()
                }
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });

    $('button#saveNewRate').click(function () {
        var tableId = $('select#providerTable option:selected').val();
        $.ajax({
            type: 'POST',
            url: '/api/v1/rates/new/' + tableId,
            data: $('#newRateForm').serializeArray(),
            dataType: 'json',
            success: function (data) {
                    $('#newRateDialog').modal('hide');
                    window.location.reload()
                if (data && data.code) {
                    var confirmtext = ""
                    if (data.code == 'ER_DUP_ENTRY') {
                        if (document.getElementsByTagName('html')[0].lang == 'th') {
                            confirmtext = "ตรวจพบข้อมูลซ้ำไม่สามารถเพิ่มข้อมูลได้"
                        } else {
                            confirmtext = "Found Duplicate Data Can't Insert Data"
                        }
                        alert(confirmtext)
                    }
                }
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });

    $.ajax({
        type: 'GET',
        url: '/api/v1/rates/summ/' + tableId,
        dataType: 'json',
        success: function (data) {
            var rateOptions = $('#newRate');

            $.each(data, function (i, rate) {
                rateList.push({
                    value: rate.id,
                    text: rate.ratename
                });

                rateOptions.append($('<option>', {
                    value: rate.id,
                    text: rate.ratename
                }));
            });

            $('select#providerTable').change();
        }
    });
});

function setupPager(pager, url, render) {
    pager.bootpag({
        page: 1,
        total: 1,
        maxVisible: 5,
        leaps: false,
        firstLastUse: true,
        first: 'First',
        last: 'Last',
        wrapClass: 'pagination pagination-sm pull-right'
    }).on('page', function (event, num) {
        var tableId = $('select#providerTable option:selected').val();

        $.ajax({
            type: 'GET',
            url: url + '/' + tableId + '/' + num + '/' + rowPerPage,
            dataType: 'json',
            success: function (result) {
                updatePager(pager, result.total);
                render(result.data);
            }
        });
    });
}

function updatePager(pages, totalRows) {
    pages.bootpag({
        total: Math.ceil(totalRows / rowPerPage)
    });
}

function showAreacode(data) {
    var tableId = $('select#providerTable option:selected').val();

    $('#areacodesTable tbody').empty();
    $.each(data, function (i, d) {
        var provider = (d.provider == null || d.provider.trim()) == '' ? 'null' : d.provider.trim();
        var pk = JSON.stringify({
            provider: d.provider,
            areacode: d.areacode
        });

        var row = '<tr>';
        row += '<td><a class="editable" href="#" data-name="provider" data-title="Enter provider code" data-i18n="[data-title]enter provider code" data-pk=' + pk + '>' +
            (d.provider || '-') + '</a></td>';
        row += '<td><a class="editable" href="#" data-name="areacode" data-title="Enter area code" data-i18n="[data-title]enter area code" data-pk=' + pk + '>' + (d.areacode || '-') + '</td>';
        row += '<td><a class="editable" href="#" data-name="areaname" data-title="Enter area name" data-i18n="[data-title]enter area name" data-pk=' + pk + '>' + (d.areaname || '-') + '</td>';
        row += '<td><a class="edit-toll" href="#" data-name="toll" data-title="Select toll type" data-i18n="[data-title]select toll type" data-pk=' + pk + ' data-value="' + d.toll + '">' + (d.toll || '-') + '</td>';
        row += '<td><a class="edit-rate" href="#" data-name="rate" data-title="Select rate name" data-i18n="[data-title]select rate name" data-pk=' + pk + ' data-value="' + d.rate + '">' + (d.ratename || '-') + '</td>';
        // a.btn.btn-warning.btn-xs.deleteuserbtn(data-user=row.username)
        // row += '<td><a class="btn btn-warning btn-xs deleteuserbtn" data-user=' + d.areacode + ' ><i class="fa fa-trash"' + '</i></a></td>';
        row += '<td><a class="btn btn-warning btn-xs pull-right delete-areacode" data-href="/api/v1/areacodes/' + tableId + '/' + d.areacode + '/' + d.areaname + '" data-areacode-value= "'+ d.areacode + "@" + d.areaname + '" ><i class="fa fa-trash"' + '</i></a></td>';
        // row += '<td><a class="btn btn-warning btn-xs pull-right delete" href="/api/v1/areacodes/' + tableId + '/' + d.areaname + '/' + d.areacode + '"><i class="fa fa-trash"' + '</i></a></td>';
        row += '</tr>';

        $('#areacodesTable tbody').append(row);
    });

    $('.editable').editable({
        url: '/api/v1/areacodes/update/' + tableId,
        type: 'text',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        },
        success: function (data) {
            if (data && data.redirect) {
                window.location.reload()
            }
        },
        error: function (data) {
            alert(data.responseText);
        }
    });

    $('.edit-toll').editable({
        url: '/api/v1/areacodes/update/' + tableId,
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        },
        type: 'select',
        source: [
            {
                value: 'Free',
                text: 'Free'
            },
            {
                value: 'Local',
                text: 'Local'
            },
            {
                value: 'Domestic',
                text: 'Domestic'
            },
            {
                value: 'Mobile',
                text: 'Mobile'
            },
            {
                value: 'International',
                text: 'International'
            }
        ]
    });

    $('.edit-rate').editable({
        url: '/api/v1/areacodes/update/' + tableId,
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        },
        type: 'select',
        source: rateList
    });
}

function showRate(data) {
    var tableId = $('select#providerTable option:selected').val();

    $('#ratesTable tbody').empty();

    var lastRate;

    $.each(data, function (i, d) {
        var pk = JSON.stringify({
            id: d.id,
            day: d.day,
            timeto: d.timeto,
            timefrom: d.timefrom,
            charge : d.charge
        });

        var row = '<tr>';

        if (lastRate != d.id) {
            lastRate = d.id;
            row += '<td><a class="editable" href="#" data-name="id" data-title="Enter rate id" data-i18n="[data-title]enter rate id" data-pk=' + pk + '>' +
                d.id + '</a></td>';
            row += '<td><a class="editable" href="#" data-name="ratename" data-title="Enter rate name" data-i18n="[data-title]enter rate name" data-pk=' + pk + '>' + d.ratename + '</td>';
        } else {
            row += '<td colspan=\'2\'></td>';
        }

        row += '<td><a class="edit-day" href="#" data-name="day" data-title="Select day of week" data-i18n="[data-title]select day of week" data-pk=' + pk + ' data-value="' + (d.day || '-') + '">' + d.day + '</td>';
        row += '<td><a class="editable" href="#" data-name="timefrom" data-title="Enter start time" data-i18n="[data-title]enter start time" data-pk=' + pk + '>' + (d.timefrom || '-') + '</td>';
        row += '<td><a class="editable" href="#" data-name="timeto" data-title="Enter end time" data-i18n="[data-title]enter end time" data-pk=' + pk + '>' + (d.timeto || '-') + '</td>';
        row += '<td><a class="editable" href="#" data-name="charge" data-title="Enter charging data" data-i18n="[data-title]enter charging data" data-pk=' + pk + '>' + (d.charge || '-') + '</td>';
        row += '<td><a class="btn btn-warning btn-xs pull-right delete-rates" data-href="/api/v1/rates/' + tableId + '/' + d.id + '/' + d.day + '" data-rates-value= "'+ d.id + "@" + d.day + '" ><i class="fa fa-trash"' + '</i></a></td>';
        row += '</tr>';

        $('#rates tbody').append(row);
    });

    $('.editable').editable({
        url: '/api/v1/rates/update/' + tableId,
        type: 'text',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        },
        success: function (data) {
            window.location.reload()
        },
        error: function (data) {
            alert(data.responseText);
        }
    });

    // $('.edit-day').editable({
    //     url: '/api/v1/rates/update/' + tableId,
    //     ajaxOptions: {
    //         type: 'POST',
    //         dataType: 'json'
    //     },
    //     type: 'select',
    //     source: [
    //         {
    //             value: 'Monday',
    //             text: 'Monday'
    //         },
    //         {
    //             value: 'Tuesday',
    //             text: 'Tuesday'
    //         },
    //         {
    //             value: 'Wednesday',
    //             text: 'Wednesday'
    //         },
    //         {
    //             value: 'Thursday',
    //             text: 'Thursday'
    //         },
    //         {
    //             value: 'Friday',
    //             text: 'Friday'
    //         },
    //         {
    //             value: 'Saturday',
    //             text: 'Saturday'
    //         },
    //         {
    //             value: 'Sunday',
    //             text: 'Sunday'
    //         }
    //     ]
    // });
    
    $('.edit-day').editable({
        url: '/api/v1/rates/update/' + tableId,
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        },
        type: 'select',
        source: [
            // {
            //     value: 'Weekday',
            //     text: 'Weekday'
            // },
            {
                value: 'Monday',
                text: 'Monday'
            },
            {
                value: 'Tuesday',
                text: 'Tuesday'
            },
            {
                value: 'Wednesday',
                text: 'Wednesday'
            },
            {
                value: 'Thursday',
                text: 'Thursday'
            },
            {
                value: 'Friday',
                text: 'Friday'
            },
            {
                value: 'Saturday',
                text: 'Saturday'
            },
            {
                value: 'Sunday',
                text: 'Sunday'
            }
        ]
    });
}
