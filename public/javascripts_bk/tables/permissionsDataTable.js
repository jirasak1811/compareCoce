$(document).ready(function () {
    var lang = Cookies.get('lang')
    if (lang != 'th') {
        $("#datatable-permissions").DataTable({
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/English.json"
            }
        });
    } else {
        $("#datatable-permissions").DataTable({
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Thai.json"
            }
        });
    }
    $(document).on('click', '.lang-switch', function () {
        if (lang != Cookies.get('lang')) {
            lang = Cookies.get('lang')
            $("#datatable-permissions").DataTable().destroy();
            if (lang != 'th') {
                $("#datatable-permissions").DataTable({
                    "language": {
                        "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/English.json"
                    }
                });
            } else {
                $("#datatable-permissions").DataTable({
                    "language": {
                        "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Thai.json"
                    }
                });
            }
        }
    })
    $('tbody')[0].style['max-height'] = screen.height / 2.5 + 'px'
    setTimeout(function () {
        $('.dataTables_filter')[0].className = $('.dataTables_filter')[0].className + " pull-right"
    }, 500);
    $(document).on('click', '.btn-permission-remove', function () {
        console.log("Delete " + $(this).attr('data-pk'))
        var key = $(this).attr('data-pk').split(',')
        var confirm_text =''
        if (Cookies.get('lang') == 'th') {
            confirm_text = 'ต้องการลบ ' + key[0]+','+key[1] + ' หรือไม่ '
        } else {
            confirm_text = 'Do you want to delete : ' + key[0] + ',' + key[1] + ' ? '
        }
        if (confirm(confirm_text)) {          
            var data = {
                originPermission: key[0],
                originProfileid: key[1],
                originPerm_type: key[2]
            }
            $.ajax({
                url: '/api/v1/etbs-permissions/delete',
                type: 'POST',
                data: data,
                success: function (data) {
                    window.location.reload()
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    })

    $(document).on('click', '.edit.btn-permission', function () {
        console.log("open edit view : " + $(this).attr('data-pk'))
        var key = $(this).attr('data-pk').split(',')
        const searchRegExp = new RegExp('/', 'g');
        key[2] = key[2].replace(searchRegExp, ',')
        console.log(key)
        window.location = '/api/v1/etbs-permissions/edit/' + key[0] + '/' + key[1] + '/' + key[2] + '?access_token=' + key[3]
    })

    //
    $('.edittable-selectActive').editable({
        source: [
            { '1': 'Active' },
            { '0': 'InActive' },
        ],
        url: '/api/v1/etbs-permissions/update',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }
    });

});