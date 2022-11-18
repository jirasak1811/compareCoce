$(document).ready(function () {
    RenderTable(data)
    $(document).on('dblclick', '.showmoredetail', function () {
        alert($(this).attr('data-key3') + $(this).attr('data-key2') + $(this).attr('data-key4'));
        $('#view-detail-body').html('')
        var RenderType = $(this).attr('data-key4')
        $.ajax({
            type: $(this).attr('data-key3'),
            url: $(this).attr('data-key2'),
            dataType: 'json',
            success: function (data) {
                console.log(data);
                ChkRenderType(RenderType,data)
            }
        });
        $('.view-detail').modal('show')
    })

})

var data = [{"Name" : "Dashboard" , link : "/api/v1/dashboard/recent/calls" , type :"GET", RenderType : "" , ReqUser : "False"},
            {"Name" : "Dashboard-Get System Info" , link : "/api/v1/dashboard/system/info" , type :"GET" , RenderType : "",ReqUser : "False"},
            {"Name" : "Directory Search" , link : "/api/v1/directorysearch/all/directory" , type :"GET" , RenderType : "",ReqUser : "False"},
            {"Name" : "Users" , link : "/api/v1/usersM/alluser" , type :"GET" , RenderType : "",ReqUser : "False"},
            { "Name": "Authorization", link: "/api/v1/etbs-permissions/allpermiss", type: "GET", RenderType: "", ReqUser: "False" },
            { "Name": "employee", link: "/api/v1/extensions/all/employee/2400001", type: "GET", RenderType: "", ReqUser: "False" }]

            function RenderTable(data,user) {
                if (data.length != 0) {
                    $('.api-list').html('');
                    var tmp = ''
                    tmp += "<table  class='table table-striped table-hover' id='apitable' width=100%>"
                    tmp += "<thead class='thead-light'> <tr>"
                    $.each(Object.keys(data[0]), function (i, d) {
                        console.log(d);
                        if (d.toString() != 'RenderType' || d.toString() != 'ReqUser') {
                            tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
                        }
                    })
                    tmp += "    </tr> </thead>"
                    $.each(data, function (i, d) {
                        tmp += "<tr class='showmoredetail' data-key='" + d[Object.keys(data[0])[0]] +"' data-keylength='" + Object.keys(data[0]).length*2 + "'"
                        $.each(Object.keys(data[0]), function (i, keyname) {
                            tmp += ' data-key' + (i + 1).toString() + '="' + d[keyname.toString()] + '"'
                            tmp += ' data-keyname' + (i + 1).toString() + '="' + Object.keys(data[0])[i] + '"'
                        })
                        tmp +=  ">"
                        $.each(Object.keys(data[0]), function (i, keyname) {
                            if (d[keyname.toString()] == null) {
                                d[keyname.toString()] = ''
                            }
                            if (keyname.toString() != 'RenderType' || keyname.toString() != 'ReqUser') {
                                tmp += "<td> " + d[keyname.toString()] + "</td>"
                            }
                        });
                        tmp += "</tr>"
                    })
                    tmp += "</table>"
                    $('.api-list').append(tmp);
                    if (document.getElementsByTagName('html')[0].lang == 'th') {
                        $('.lang-switch')[1].click()
                    } else {
                        $('.lang-switch')[0].click()
                    }
                }
                else {
                    $('tbody').html('')
                }
            
            }

            
function RenderTableInModel(data,user) {
    if (data.length != 0) {
        $('#view-detail-body').html('');
        var tmp = ''
        tmp += "<table  class='table table-striped table-hover' id='modeltable' width=100%>"
        tmp += "<thead class='thead-light'> <tr>"
        $.each(Object.keys(data[0]), function (i, d) {
            tmp += "        <th data-i18n='" + d + "'>" + d.charAt(0).toUpperCase() + d.slice(1) + "</th>"
        })
        tmp += "    </tr> </thead>"
        $.each(data, function (i, d) {
            tmp += "<tr class='showmoredetail' data-key='" + d[Object.keys(data[0])[0]] +"' data-keylength='" + Object.keys(data[0]).length*2 + "'"
            $.each(Object.keys(data[0]), function (i, keyname) {
                tmp += ' data-key' + (i + 1).toString() + '="' + d[keyname.toString()] + '"'
                tmp += ' data-keyname' + (i + 1).toString() + '="' + Object.keys(data[0])[i] + '"'
            })
            tmp +=  ">"
            $.each(Object.keys(data[0]), function (i, keyname) {
                if (d[keyname.toString()] == null) {
                    d[keyname.toString()] = ''
                }
                tmp += "<td> " + d[keyname.toString()] + "</td>"
            });
            tmp += "</tr>"
        })
        tmp += "</table>"
        $('#view-detail-body').append(tmp);
    }
    else {
        $('tbody').html('')
    }
}

function ChkRenderType(RenderType, data) {
    $('#view-detail-body').html('')
    // if (data.length == undefined) {
    //     RenderType = "OBJ"
    // } else if (Object.keys(data)[0] == 0) {
    //     RenderType = "JSON"
    // }
    if (RenderType == "") {
        $('#view-detail-body').append(JSON.stringify(data))
    }
    else if (RenderType == "Table") {
        RenderTableInModel(data);
    }
    else if (RenderType == "OBJ") {
        $.each(Object.keys(data), function (i, d) {
            $('#view-detail-body').append("<div class='row col-12'><div class='row col-6'><h4>" + d + "</h4></div> <div class='row col-6'>" + data[d]+"</div></div>")
        })
    }
    else if (RenderType == "JSON") {
        var tmpdata = []
        for (var i = 0; i < data.length; i++) {
            tmpdata.push(JSON.parse(data[i]))
        }
        RenderTableInModel(tmpdata)
    }
    else {
        $('#view-detail-body').append(JSON.stringify(data))
    }
}
