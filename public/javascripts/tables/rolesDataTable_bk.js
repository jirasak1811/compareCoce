$(document).ready(function () {
    var lang = Cookies.get('lang')
    if (lang != 'th') {
        $("#datatable-roles").DataTable({
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/English.json"
            }
        });
    } else {
        $("#datatable-roles").DataTable({
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Thai.json"
            }
        });
    }
    $(document).on('click', '.lang-switch', function () {
        if (lang != Cookies.get('lang')) {
            lang = Cookies.get('lang')
            $("#datatable-roles").DataTable().destroy();
            if (lang != 'th') {
                $("#datatable-roles").DataTable({
                    "language": {
                        "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/English.json"
                    }
                });
            } else {
                $("#datatable-roles").DataTable({
                    "language": {
                        "url": "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Thai.json"
                    }
                });
            }
        }
    })


    $(document).on('click', '.btn-role-remove', function () {
        console.log("Delete " + $(this).attr('data-pk'))
        var key = $(this).attr('data-pk').split(',')
        var confirm_text = ''
        if (Cookies.get('lang') == 'th') {
            confirm_text = 'ต้องการลบ ' + key[0] + ',' + key[1] + ' หรือไม่ '
        } else {
            confirm_text = 'Do you want to delete : ' + key[0] + ',' + key[1] + ' ? '
        }
        if (confirm(confirm_text)) {            
            var data = {
                originRolename: key[0],
                originProfileid: key[1]
            }
            $.ajax({
                url: '/api/v1/etbs-roles/delete',
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

    $(document).on('click', '.btn-role-edit', function () {
        console.log("open edit view : " + $(this).attr('data-pk'))
        var key = $(this).attr('data-pk').split(',')
        console.log(key)
        window.location = '/api/v1/etbs-roles/edit/' + key[0] + '/' + key[1] + '?access_token=' + key[2]
    })

    //
    $('.edittable-selectActive').editable({
        source: [
            { '1': 'Active' },
            { '0': 'InActive' },
        ],
        url: '/api/v1/etbs-role/update',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }
    });
    console.log("loadtablescript")
    $("#datatable-roles").DataTable();
    $('tbody')[0].style['max-height'] = screen.height / 2.5 + 'px'
    setTimeout(function () {
        $('#datatable-roles_filter')[0].className = $('#datatable-roles_filter')[0].className + " pull-right"
    }, 500);

    $('#example2').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": false
    });
});