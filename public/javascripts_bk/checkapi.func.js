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
            {"Name": "Authorization", link: "/api/v1/etbs-permissions/allpermiss", type: "GET", RenderType: "", ReqUser: "False" },
            {"Name": "employee", link: "/api/v1/extensions/all/employee/", type: "GET", RenderType: "", ReqUser: "False" }]

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

function RenderLiveChat() {
    $('body').html('')

    var livechat = ''
    livechat += '<div class="modal fade- modal-sticky-bottom-right show" id="kt_chat_modal" role="dialog" data-backdrop="false" aria-modal="true" style="padding-right: 17px; display: block;">'
    livechat += '<div class="modal-dialog" role="document">'
    livechat += '<div class="modal-content">'
    livechat += '<div class="kt-chat">'
    livechat += '<div class="kt-portlet kt-portlet--last">'
    livechat += '<div class="kt-portlet__head">'
    livechat += '<div class="kt-chat__head ">'
    livechat += '<div class="kt-chat__left">'
    livechat += '<div class="kt-chat__label">'
    livechat += '<a href="#" class="kt-chat__title">Jason Muller</a>'
    livechat += '<span class="kt-chat__status">'
    livechat += '<span class="kt-badge kt-badge--dot kt-badge--success"></span> Active'
    livechat += '</span>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__right">'
    livechat += '<div class="dropdown dropdown-inline">'
    livechat += '<button type="button" class="btn btn-clean btn-sm btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    livechat += '<i class="flaticon-more-1"></i>'
    livechat += '</button>'
    livechat += '<div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-md">'
    livechat += '<!--begin::Nav-->'
    livechat += '<ul class="kt-nav">'
    livechat += '<li class="kt-nav__head">'
    livechat += 'Messaging'
    livechat += '<i class="flaticon2-information" data-toggle="kt-tooltip" data-placement="right" title="" data-original-title="Click to learn more..."></i>'
    livechat += '</li>'
    livechat += '<li class="kt-nav__separator"></li>'
    livechat += '<li class="kt-nav__item">'
    livechat += '<a href="#" class="kt-nav__link">'
    livechat += '<i class="kt-nav__link-icon flaticon2-group"></i>'
    livechat += '<span class="kt-nav__link-text">New Group</span>'
    livechat += '</a>'
    livechat += '</li>'
    livechat += '<li class="kt-nav__item">'
    livechat += '<a href="#" class="kt-nav__link">'
    livechat += '<i class="kt-nav__link-icon flaticon2-open-text-book"></i>'
    livechat += '<span class="kt-nav__link-text">Contacts</span>'
    livechat += '<span class="kt-nav__link-badge">'
    livechat += '<span class="kt-badge kt-badge--brand  kt-badge--rounded-">5</span>'
    livechat += '</span>'
    livechat += '</a>'
    livechat += '</li>'
    livechat += '<li class="kt-nav__item">'
    livechat += '<a href="#" class="kt-nav__link">'
    livechat += '<i class="kt-nav__link-icon flaticon2-bell-2"></i>'
    livechat += '<span class="kt-nav__link-text">Calls</span>'
    livechat += '</a>'
    livechat += '</li>'
    livechat += '<li class="kt-nav__item">'
    livechat += '<a href="#" class="kt-nav__link">'
    livechat += '<i class="kt-nav__link-icon flaticon2-dashboard"></i>'
    livechat += '<span class="kt-nav__link-text">Settings</span>'
    livechat += '</a>'
    livechat += '</li>'
    livechat += '<li class="kt-nav__item">'
    livechat += '<a href="#" class="kt-nav__link">'
    livechat += '<i class="kt-nav__link-icon flaticon2-protected"></i>'
    livechat += '<span class="kt-nav__link-text">Help</span>'
    livechat += '</a>'
    livechat += '</li>'
    livechat += '<li class="kt-nav__separator"></li>'
    livechat += '<li class="kt-nav__foot">'
    livechat += '<a class="btn btn-label-brand btn-bold btn-sm" href="#">Upgrade plan</a>'
    livechat += '<a class="btn btn-clean btn-bold btn-sm" href="#" data-toggle="kt-tooltip" data-placement="right" title="" data-original-title="Click to learn more...">Learn more</a>'
    livechat += '</li>'
    livechat += '</ul>'
    livechat += '<!--end::Nav-->'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<button type="button" class="btn btn-clean btn-sm btn-icon" data-dismiss="modal">'
    livechat += '<i class="flaticon2-cross"></i>'
    livechat += '</button>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-portlet__body">'
    livechat += '<div class="kt-scroll kt-scroll--pull ps ps--active-y" data-height="410" data-mobile-height="300" style="height: 410px; overflow: hidden;">'
    livechat += '<div class="kt-chat__messages kt-chat__messages--solid">'
    livechat += '<div class="kt-chat__message kt-chat__message--success">'
    livechat += '<div class="kt-chat__user">'
    livechat += '<span class="kt-media kt-media--circle kt-media--sm">'
    livechat += '<img src="./assets/media/users/100_12.jpg" alt="image">'
    livechat += '</span>'
    livechat += '<a href="#" class="kt-chat__username">Jason Muller</a>'
    livechat += '<span class="kt-chat__datetime">2 Hours</span>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__text">'
    livechat += 'How likely are you to recommend our company<br> to your friends and family?'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__message kt-chat__message--right kt-chat__message--brand">'
    livechat += '<div class="kt-chat__user">'
    livechat += '<span class="kt-chat__datetime">30 Seconds</span>'
    livechat += '<a href="#" class="kt-chat__username">You</a>'
    livechat += '<span class="kt-media kt-media--circle kt-media--sm">'
    livechat += '<img src="./assets/media/users/300_21.jpg" alt="image">'
    livechat += '</span>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__text">'
    livechat += 'Hey there, we’re just writing to let you know that you’ve<br> been subscribed to a repository on GitHub.'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__message kt-chat__message--success">'
    livechat += '<div class="kt-chat__user">'
    livechat += '<span class="kt-media kt-media--circle kt-media--sm">'
    livechat += '<img src="./assets/media/users/100_12.jpg" alt="image">'
    livechat += '</span>'
    livechat += '<a href="#" class="kt-chat__username">Jason Muller</a>'
    livechat += '<span class="kt-chat__datetime">30 Seconds</span>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__text">'
    livechat += 'Ok, Understood!'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__message kt-chat__message--right kt-chat__message--brand">'
    livechat += '<div class="kt-chat__user">'
    livechat += '<span class="kt-chat__datetime">Just Now</span>'
    livechat += '<a href="#" class="kt-chat__username">You</a>'
    livechat += '<span class="kt-media kt-media--circle kt-media--sm">'
    livechat += '<img src="./assets/media/users/300_21.jpg" alt="image">'
    livechat += '</span>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__text">'
    livechat += 'You’ll receive notifications for all issues, pull requests!'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__message kt-chat__message--success">'
    livechat += '<div class="kt-chat__user">'
    livechat += '<span class="kt-media kt-media--circle kt-media--sm">'
    livechat += '<img src="./assets/media/users/100_12.jpg" alt="image">'
    livechat += '</span>'
    livechat += '<a href="#" class="kt-chat__username">Jason Muller</a>'
    livechat += '<span class="kt-chat__datetime">2 Hours</span>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__text">'
    livechat += 'You were automatically <b class="kt-font-brand">subscribed</b> <br>because you’ve been given access to the repository'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__message kt-chat__message--right kt-chat__message--brand">'
    livechat += '<div class="kt-chat__user">'
    livechat += '<span class="kt-chat__datetime">30 Seconds</span>'
    livechat += '<a href="#" class="kt-chat__username">You</a>'
    livechat += '<span class="kt-media kt-media--circle kt-media--sm">'
    livechat += '<img src="./assets/media/users/300_21.jpg" alt="image">'
    livechat += '</span>'
    livechat += '</div>'

    livechat += '<div class="kt-chat__text">'
    livechat += 'You can unwatch this repository immediately <br>by clicking here: <a href="#" class="kt-font-bold kt-link"></a>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__message kt-chat__message--success">'
    livechat += '<div class="kt-chat__user">'
    livechat += '<span class="kt-media kt-media--circle kt-media--sm">'
    livechat += '<img src="./assets/media/users/100_12.jpg" alt="image">'
    livechat += '</span>'
    livechat += '<a href="#" class="kt-chat__username">Jason Muller</a>'
    livechat += '<span class="kt-chat__datetime">30 Seconds</span>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__text">'
    livechat += 'Discover what students who viewed Learn <br>Figma - UI/UX Design Essential Training also viewed'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__message kt-chat__message--right kt-chat__message--brand">'
    livechat += '<div class="kt-chat__user">'
    livechat += '<span class="kt-chat__datetime">Just Now</span>'
    livechat += '<a href="#" class="kt-chat__username">You</a>'
    livechat += '<span class="kt-media kt-media--circle kt-media--sm">'
    livechat += '<img src="./assets/media/users/300_21.jpg" alt="image">'
    livechat += '</span>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__text">'
    livechat += 'Most purchased Business courses during this sale!'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '<div class="ps__rail-x" style="left: 0px; bottom: 0px;"><div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps__rail-y" style="top: 0px; right: -2px; height: 410px;"><div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 142px;"></div></div></div>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__input">'
    livechat += '<div class="kt-chat__editor">'
    livechat += '<textarea placeholder="Type here..." style="height: 50px"></textarea>'
    livechat += '</div>'
    livechat += '<div class="kt-chat__toolbar">'
    livechat += '<div class="kt_chat__tools">'
    livechat += '<a href="#"><i class="flaticon2-link"></i></a>'
    livechat += '<a href="#"><i class="flaticon2-photograph"></i></a>'
    livechat += '<a href="#"><i class="flaticon2-photo-camera"></i></a>'
    livechat += '</div>'
    livechat += '<div class="kt_chat__actions">'
    livechat += '<button type="button" class="btn btn-brand btn-md  btn-font-sm btn-upper btn-bold kt-chat__reply">reply</button>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    livechat += '</div>'
    $('body').html(livechat)
}