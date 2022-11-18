$(document).ready(function () {

})

function DirectoryLoad(user, ext_lic,token) {
    //console.log($('.directory-list').attr('data-role'), user)
    if ($('.directory-list').attr('data-role').toLowerCase().search('admin') != -1) {
        $('.directory-list').attr('data-role', 'admin')
    } else {
        //console.log($('.directory-list').attr('data-role'))
        if ($('.directory-list').attr('data-role') == 'guest') {

        } else {
            $('.directory-list').attr('data-role', 'user')
        }
    }

    $('.with-border').append('<input id="search" class="form-control" data-role="' + $('.directory-list').attr('data-role')+'" type="text" placeholder="Search" data-i18n="[placeholder]search">')
    if ($('.directory-list').attr('data-role') == 'guest') {
        $.getJSON('/api/v1/directorysearch/all/' + $('.directory-list').attr('data-role')).done(function (data) {
            RenderTableDirectory(data, user)
        })
    } else {
        $.getJSON('/api/v1/directorysearch/all/' + $('.directory-list').attr('data-role'), { user: user }).done(function (data) {
            RenderTableDirectory(data, user)
        })
    }
    $('#search').keyup(function () {
        if (this.value != '' && $('#search').attr('data-role') != 'guest') {
            $.getJSON('/api/v1/directorysearch/search/' + $('#search').attr('data-role') + '/' + this.value, { user: user }).done(function (data) {
                RenderTableDirectory(data, user)
            })
        } else if (this.value != '' && $('#search').attr('data-role') == 'guest') {
            $.getJSON('/api/v1/directorysearch/search/' + $('#search').attr('data-role') + '/' + this.value).done(function (data) {
                RenderTableDirectory(data, user)
            })
        } else if (this.value == '' && $('#search').attr('data-role') == 'guest') {
            $.getJSON('/api/v1/directorysearch/all/' + $('.directory-list').attr('data-role')).done(function (data) {
                RenderTableDirectory(data, user)
            })
        } else if (this.value == '' && $('#search').attr('data-role') != 'guest') {
            $.getJSON('/api/v1/directorysearch/all/' + $('.directory-list').attr('data-role'), { user: user }).done(function (data) {
                RenderTableDirectory(data, user)
            })
        } else {
            //console.log("Out Of Condition ")
        }

    })
}
function RenderTableDirectory(data,user) {
    if (data.length != 0) {
        $('.directory-list').html('');
        var tmp = ''
        tmp += "<table  class='table table-striped table-hover' id='extensiontable' width=100%>"
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
        $('.directory-list').append(tmp);
        $('tbody')[0].style.height = (screen.height / 3) * 1.8 + "px"
        if (document.getElementsByTagName('html')[0].lang == 'th') {
            $('.lang-switch')[1].click()
        } else {
            $('.lang-switch')[0].click()
        }
    }
    else {
        $('tbody').html('')
    }

    $('.showmoredetail').on('click', function () {
        if ($('.directory-list').attr('data-role') != 'user' && $('.directory-list').attr('data-role') != 'guest') {
            $.getJSON('/api/v1/directorysearch/search/' + $('.directory-list').attr('data-role') + '/detail/' + $(this).attr('data-key'), { user: user }).done(function (data) {
                //console.log(data[0])
                $('#headerlist').html('')
                $('#headerlist').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='extension'>extension </b></div><div class='row col-md-6'>" + (data[0].extension || '') + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='nameth'>nameth</b></div><div class='row col-md-6'>" + ( data[0].nameth || '') + "</div></div></div>")
                $('#headerlist').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='position'>position </b></div><div class='row col-md-6' >" + (data[0].position || '') + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='name'>name</b></div><div class='row col-md-6'>" + ( data[0].name || '' )  + "</div></div></div>")
                $('#headerlist').append("<div class='row col-md-12'><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='authorization_code'>authorization_code</b></div><div class='row col-md-6'>" +( data[0].authorization_code || '') + "</div></div><div class='row col-md-6'><div class='row col-md-6'><b data-i18n='email'>E-mail</b></div><div class='row col-md-6'>" + ( data[0].email || '' ) + "</div></div></div>")
                $('#headerlist').append("<div class='row col-md-12'><div class='row col-md-2'><b data-i18n='groups'>Groups </b></div>" + (data[0].org_path || "") + "</div>")
                $('#headerlist').append('<hr>')
            })
            $.getJSON('/api/v1/directorysearch/search/' + $('.directory-list').attr('data-role') + '/callin/' + $(this).attr('data-key'), { user: user }).done(function (data) {
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
                if (document.getElementsByTagName('html')[0].lang == 'th') {
                    $('.lang-switch')[1].click()
                } else {
                    $('.lang-switch')[0].click()
                }
            })
            $.getJSON('/api/v1/directorysearch/search/' + $('.directory-list').attr('data-role') + '/callout/' + $(this).attr('data-key'), { user: user }).done(function (data) {
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
                if (document.getElementsByTagName('html')[0].lang == 'th') {
                    $('.lang-switch')[1].click()
                } else {
                    $('.lang-switch')[0].click()
                }
            })
            if (document.getElementsByTagName('html')[0].lang == 'th') {
                $('.lang-switch')[1].click()
            } else {
                $('.lang-switch')[0].click()
            }
            $('.view-detail').modal('show');
        }
        else {
            $.getJSON('/api/v1/directorysearch/search/' + $('.directory-list').attr('data-role') + '/callin/' + $(this).attr('data-key')).done(function (data) {
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
                if (document.getElementsByTagName('html')[0].lang == 'th') {
                    $('.lang-switch')[1].click()
                } else {
                    $('.lang-switch')[0].click()
                }
            })
            $.getJSON('/api/v1/directorysearch/search/' + $('.directory-list').attr('data-role') + '/callout/' + $(this).attr('data-key')).done(function (data) {
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
                if (document.getElementsByTagName('html')[0].lang == 'th') {
                    $('.lang-switch')[1].click()
                } else {
                    $('.lang-switch')[0].click()
                }
            })
            $('.view-detail').modal('show');
        }

    })
}
