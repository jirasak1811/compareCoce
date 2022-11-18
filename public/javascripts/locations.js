$(document).ready(function () {
    $('.editable').editable({
        url: '/api/v1/locations/update',
        ajaxOptions: {
            type: 'POST',
            dataType: 'json'
        }
    });

    $('.edit-ariff').editable({
        url: '/api/v1/locations/update',
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
        $.ajax({
            type: 'POST',
            url: '/api/v1/locations/new',
            data: $('#newLocationForm').serializeArray(),
            dataType: 'json',
            success: function (data) {
                $('#new_location').modal('hide');

                if (data && data.redirect) {
                    window.location = data.redirect;
                }
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
});
