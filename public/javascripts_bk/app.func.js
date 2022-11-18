﻿function getLicenseUsage(user, ext_lic, token) {

    //console.log(data);
    $.getJSON('/api/v1/dashboard/lic/usage', { user: user }).done(function (data) {

        //console.log(data[0]);
        var ext_usage = data[0].usg;

        if (!ext_usage)
            ext_usage = 0;

        $('p.lb-company-name').html(data[0].company.toUpperCase());
        $('a.lb-ext-lic').text(ext_lic);
        $('a.lb-used-lic').text(ext_usage);
        $('a.lb-remain-lic').text(ext_lic - ext_usage);
    });
}
function checklanguage() {
    $('.language').html()
    if (Cookies.get('lang') == 'th') {
        $('.lang-switch')[1].click()
    } else {
        $('.lang-switch')[0].click()
    }

}

function renderMenu(user, ext_lic, token, permission_access_data) {
    $('.sidebar-menu').html('')
    var access_token = ''
    if (token != undefined) {
        access_token = '?access_token=' + token
    }
    var permission_access = []
    if (permission_access_data != undefined) {
        var perm = JSON.parse(permission_access_data)
        for (var i = 0; i < perm.length; i++) {
            //console.log(perm[i].perm_type)
            permission_access[perm[i].perm_type] = true
        }
        var tmpMenu = '<li data-i18n="menu" class="header">เมนู</li>'
        //Dashboard
        if (permission_access['/api/v1/dashboard']) {
            tmpMenu += '  <li>'
            tmpMenu += '       <a href="/api/v1/dashboard' + access_token + '">'
            tmpMenu += '          <i class="fa fa-dashboard"></i>'
            tmpMenu += '          <span data-i18n="dashboard">รายละเอียดการใช้โทรศัพท์</span>'
            tmpMenu += '      </a>'
            tmpMenu += '  </li>'
        }
        //Dashboard
        //Report
        if (permission_access['/api/v1/reports'] || permission_access['/api/v1/reports/users'] || permission_access['/api/v1/reports/admin'] || permission_access['/api/v1/reports/trunk'] || permission_access['/api/v1/reports/top'] || permission_access['/api/v1/reports/chart']) {
            tmpMenu += '<li class="treeview">'
            tmpMenu += '        <a href="#">'
            tmpMenu += '            <i class="fa fa-files-o"></i>'
            tmpMenu += '            <span data-i18n="Report">รายงาน</span>'
            tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
            tmpMenu += '        </a>'
            tmpMenu += '        <ul class="treeview-menu">'
            //Report-User
            if (permission_access['/api/v1/reports/users']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/reports/user/extension/summary' + access_token + '" data-i18n="User Reports">'
                tmpMenu += '                    - รายงานส่วนของผู้ใช้'
                tmpMenu += '                </a>'
                tmpMenu += '           </li>'
            }
            //Report-Admin
            if (permission_access['/api/v1/reports/admin']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/reports/admin/destination/summary' + access_token + '" data-i18n="Admin Reports">'
                tmpMenu += '                    - รายงานส่วนของผู้ดูแลระบบ'
                tmpMenu += '                </a>'
                tmpMenu += '            </li>'
            }
            //Report-Trunk
            if (permission_access['/api/v1/reports/trunk']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/reports/trunk/summary' + access_token + '" data-i18n="Trunk Reports">'
                tmpMenu += '                    - รายงานสายนอก'
                tmpMenu += '                </a>'
                tmpMenu += '            </li>'
            }
            //Report-Top
            if (permission_access['/api/v1/reports/top']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/reports/top/extension' + access_token + '" data-i18n="Top Usage Reports">'
                tmpMenu += '                    - รายงานการใช้งานสูงสุด'
                tmpMenu += '                </a>'
                tmpMenu += '            </li>'
            }
            //Report-Chart
            if (permission_access['/api/v1/reports/chart']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/reports/chart/summary' + access_token + '" data-i18n="Chart Reports">'
                tmpMenu += '                   - รายงานรูปแบบแผนภูมิ'
                tmpMenu += '               </a>'
                tmpMenu += '            </li>'
            }
            tmpMenu += '       </ul>' // ul treeview-menu
            tmpMenu += '   </li>'
        }
        //Report
        //Extensions
        if (permission_access['/api/v1/extensions'] || permission_access['/api/v1/organize'] || permission_access['/api/v1/trunk']) {
            tmpMenu += '    <li class="treeview">'
            tmpMenu += '        <a href="#">'
            tmpMenu += '            <i class="fa fa-group"></i>'
            tmpMenu += '            <span data-i18n="extensions">เบอร์ภายใน</span>'
            tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
            tmpMenu += '        </a>'
            tmpMenu += '        <ul class="treeview-menu">'
            if (permission_access['/api/v1/extensions']) {
                //Extensions-Extension
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/extensions' + access_token + '" data-i18n="extensions">'
                tmpMenu += '                    เบอร์ภายใน'
                tmpMenu += '                </a>'
                tmpMenu += '            </li>'
            }
            if (permission_access['/api/v1/organize']) {
                //Extensions-Group
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/organize' + access_token + '" data-i18n="groups">'
                tmpMenu += '                    กลุ่ม'
                tmpMenu += '                </a>'
                tmpMenu += '            </li>'
            }
            if (permission_access['/api/v1/trunk']) {
                //Extensions-Trunk
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/trunk' + access_token + '" data-i18n="trunks">'
                tmpMenu += '                    สายนอก'
                tmpMenu += '                </a>'
                tmpMenu += '            </li>'
            }
            tmpMenu += '        </ul>'
            tmpMenu += '    </li>'
        }
        //Extensions
        if (permission_access['/api/v1/recalculate']) {
            //Recalculator
            tmpMenu += '  <li>'
            tmpMenu += '      <a href="/api/v1/recalculate' + access_token + '">'
            tmpMenu += '            <i class="fa fa-calculator"></i>'
            tmpMenu += '            <span data-i18n="recalculate">คำนวณค่าโทรใหม่</span>'
            tmpMenu += '      </a>'
            tmpMenu += '  </li>'
        }
        //Recalculator
        if (permission_access['/api/v1/directorysearch']) {
            //DirectorySearch
            tmpMenu += '  <li>'
            tmpMenu += '      <a href="/api/v1/directorysearch' + access_token + '">'
            tmpMenu += '            <i class="fa fa-search"></i>'
            tmpMenu += '            <span data-i18n="directorysearch">ค้นหาข้อมูลบุคคล</span>'
            tmpMenu += '      </a>'
            tmpMenu += '  </li>'
        }
        //DirectorySearch
        //Tariffs
        if (permission_access['/api/v1/areacodes'] || permission_access['/api/v1/locations']) {
            tmpMenu += '    <li class="treeview">'
            tmpMenu += '        <a href="#">'
            tmpMenu += '            <i class="fa fa-btc"></i>'
            tmpMenu += '            <span data-i18n="tariffs">อัตราราคาโทร</span>'
            tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
            tmpMenu += '        </a>'
            tmpMenu += '        <ul class="treeview-menu">'
            //Tariffs-locations
            if (permission_access['/api/v1/locations']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/locations' + access_token + '" data-i18n="locations">'
                tmpMenu += '                    ตำแหน่งที่ตั้ง'
                tmpMenu += '                </a>'
                tmpMenu += '            </li>'
            }
            //Tariffs-areacode
            if (permission_access['/api/v1/areacodes']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/areacodes' + access_token + '" data-i18n="Areacodes &amp; Rates">'
                tmpMenu += '                    รหัสพื้นที่และอัตรา'
                tmpMenu += '                </a>'
                tmpMenu += '            </li>'
            }
            tmpMenu += '        </ul>'
            tmpMenu += '    </li>'
        }
        //Tariffs
        //B2E
        if (permission_access['/b2e']) {
            tmpMenu += '  <li>'
            tmpMenu += '      <a href="/b2e' + access_token + '" target="_blank" >'
            tmpMenu += '            <i class="fa fa-envelope"></i>'
            tmpMenu += '            <span data-i18n="B2E">B2E</span>'
            tmpMenu += '      </a>'
            tmpMenu += '  </li>'
        }
        //B2E
        //Sync
        if (permission_access['/Sync-All'] || permission_access['/Sync-Extensions'] || permission_access['/Sync-Organizations'] || permission_access['/Sync-Users']) {
            tmpMenu += '    <li class="treeview">'
            tmpMenu += '        <a href="#">'
            tmpMenu += '            <i class="fa fa-refresh"></i>'
            tmpMenu += '            <span data-i18n="Sync">Sync</span>'
            tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
            tmpMenu += '        </a>'
            tmpMenu += '        <ul class="treeview-menu">'
            //Sync All
            if (permission_access['/Sync-All']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="#" class="Sync-All" data-i18n="Sync All">Sync All</a>'
                tmpMenu += '            </li>'
            }
            //Sync Extensions
            if (permission_access['/Sync-Extensions']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="#" class="Sync-Extensions" data-i18n="Sync Extensions">Sync Extensions</a>'
                tmpMenu += '            </li>'
            }
            //Sync Organizations
            if (permission_access['/Sync-Groups']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="#" class="Sync-Groups"data-i18n="Sync Groups">Sync Groups</a>'
                tmpMenu += '            </li>'
            }
            //Sync Users
            if (permission_access['/Sync-Users']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="#" class="Sync-Users"data-i18n="Sync Users">Sync Users</a>'
                tmpMenu += '            </li>'
            }
            tmpMenu += '        </ul>'
            tmpMenu += '    </li>'
        }
        //Sync
        //Configuration
        if (permission_access['/api/v1/etbs-permissions'] || permission_access['/api/v1/etbs-roles'] || permission_access['/api/v1/usersM']) {
            tmpMenu += '    <li class="treeview">'
            tmpMenu += '        <a href="#">'
            tmpMenu += '            <i class="fa fa-gear"></i>'
            tmpMenu += '            <span data-i18n="authorization">การตั้งค่า</span>'
            tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
            tmpMenu += '        </a>'
            tmpMenu += '        <ul class="treeview-menu">'
            //Configuration-UserManage
            if (permission_access['/api/v1/usersM']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/usersM' + access_token + '" data-i18n="users">ผู้ใช้</a>'
                tmpMenu += '            </li>'
            }
            //Configuration-Roles
            if (permission_access['/api/v1/etbs-roles']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/etbs-roles' + access_token + '" data-i18n="roles">ตำแหน่ง</a>'
                tmpMenu += '            </li>'
            }
            //Configuration-Permissions
            if (permission_access['/api/v1/etbs-permissions']) {
                tmpMenu += '            <li>'
                tmpMenu += '                <a href="/api/v1/etbs-permissions' + access_token + '" data-i18n="authorize">สิทธิ์</a>'
                tmpMenu += '            </li>'
            }
            //Configuration-Deoartment
            //tmpMenu += '            <li>'
            //tmpMenu += '                <a href="/api/v1/etbs-Department' + access_token + '" data-i18n="department">แผนก</a>'
            //tmpMenu += '            </li>'
            tmpMenu += '        </ul>'
            tmpMenu += '    </li>'
        }
        //Configuration
        $('.sidebar-menu').html(tmpMenu)
        checklanguage()
    }
    else {
        $.ajax({
            url: '/api/v1/etbs-roles/getpathaccess',
            type: 'POST',
            data: { user: user },
            success: function (data) {
                Cookies('permission_access',data)
                var perm = JSON.parse(data)
                for (var i = 0; i < perm.length; i++) {
                    //console.log(perm[i].perm_type)
                    permission_access[perm[i].perm_type] = true
                }
                var tmpMenu = '<li data-i18n="menu" class="header">เมนู</li>'
                //Dashboard
                if (permission_access['/api/v1/dashboard']) {
                    tmpMenu += '  <li>'
                    tmpMenu += '       <a href="/api/v1/dashboard' + access_token + '">'
                    tmpMenu += '          <i class="fa fa-dashboard"></i>'
                    tmpMenu += '          <span data-i18n="dashboard">รายละเอียดการใช้โทรศัพท์</span>'
                    tmpMenu += '      </a>'
                    tmpMenu += '  </li>'
                }
                //Dashboard
                //Report
                if (permission_access['/api/v1/reports'] || permission_access['/api/v1/reports/user'] || permission_access['/api/v1/reports/admin'] || permission_access['/api/v1/reports/trunk'] || permission_access['/api/v1/reports/top'] || permission_access['/api/v1/reports/chart']) {
                    tmpMenu += '<li class="treeview">'
                    tmpMenu += '        <a href="#">'
                    tmpMenu += '            <i class="fa fa-files-o"></i>'
                    tmpMenu += '            <span data-i18n="Report">รายงาน</span>'
                    tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
                    tmpMenu += '        </a>'
                    tmpMenu += '        <ul class="treeview-menu">'
                    //Report-User
                    if (permission_access['/api/v1/reports/user']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/reports/user/extension/summary' + access_token + '" data-i18n="User Reports">'
                        tmpMenu += '                    - รายงานส่วนของผู้ใช้'
                        tmpMenu += '                </a>'
                        tmpMenu += '           </li>'
                    }
                    //Report-Admin
                    if (permission_access['/api/v1/reports/admin']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/reports/admin/destination/summary' + access_token + '" data-i18n="Admin Reports">'
                        tmpMenu += '                    - รายงานส่วนของผู้ดูแลระบบ'
                        tmpMenu += '                </a>'
                        tmpMenu += '            </li>'
                    }
                    //Report-Trunk
                    if (permission_access['/api/v1/reports/trunk']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/reports/trunk/summary' + access_token + '" data-i18n="Trunk Reports">'
                        tmpMenu += '                    - รายงานสายนอก'
                        tmpMenu += '                </a>'
                        tmpMenu += '            </li>'
                    }
                    //Report-Top
                    if (permission_access['/api/v1/reports/top']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/reports/top/extension' + access_token + '" data-i18n="Top Usage Reports">'
                        tmpMenu += '                    - รายงานการใช้งานสูงสุด'
                        tmpMenu += '                </a>'
                        tmpMenu += '            </li>'
                    }
                    //Report-Chart
                    if (permission_access['/api/v1/reports/chart']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/reports/chart/summary' + access_token + '" data-i18n="Chart Reports">'
                        tmpMenu += '                   - รายงานรูปแบบแผนภูมิ'
                        tmpMenu += '               </a>'
                        tmpMenu += '            </li>'
                    }
                    tmpMenu += '       </ul>' // ul treeview-menu
                    tmpMenu += '   </li>'
                }
                //Report
                //Extensions
                if (permission_access['/api/v1/extensions'] || permission_access['/api/v1/organize'] || permission_access['/api/v1/trunk']) {
                    tmpMenu += '    <li class="treeview">'
                    tmpMenu += '        <a href="#">'
                    tmpMenu += '            <i class="fa fa-group"></i>'
                    tmpMenu += '            <span data-i18n="extensions">เบอร์ภายใน</span>'
                    tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
                    tmpMenu += '        </a>'
                    tmpMenu += '        <ul class="treeview-menu">'
                    if (permission_access['/api/v1/extensions']) {
                        //Extensions-Extension
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/extensions' + access_token + '" data-i18n="extensions">'
                        tmpMenu += '                    เบอร์ภายใน'
                        tmpMenu += '                </a>'
                        tmpMenu += '            </li>'
                    }
                    if (permission_access['/api/v1/organize']) {
                        //Extensions-Group
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/organize' + access_token + '" data-i18n="groups">'
                        tmpMenu += '                    กลุ่ม'
                        tmpMenu += '                </a>'
                        tmpMenu += '            </li>'
                    }
                    if (permission_access['/api/v1/trunk']) {
                        //Extensions-Trunk
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/trunk' + access_token + '" data-i18n="trunks">'
                        tmpMenu += '                    สายนอก'
                        tmpMenu += '                </a>'
                        tmpMenu += '            </li>'
                    }
                    tmpMenu += '        </ul>'
                    tmpMenu += '    </li>'
                }
                //Extensions
                if (permission_access['/api/v1/recalculate']) {
                    //Recalculator
                    tmpMenu += '  <li>'
                    tmpMenu += '      <a href="/api/v1/recalculate' + access_token + '">'
                    tmpMenu += '            <i class="fa fa-calculator"></i>'
                    tmpMenu += '            <span data-i18n="recalculate">คำนวณค่าโทรใหม่</span>'
                    tmpMenu += '      </a>'
                    tmpMenu += '  </li>'
                }
                //Recalculator
                if (permission_access['/api/v1/directorysearch']) {
                    //DirectorySearch
                    tmpMenu += '  <li>'
                    tmpMenu += '      <a href="/api/v1/directorysearch' + access_token + '">'
                    tmpMenu += '            <i class="fa fa-search"></i>'
                    tmpMenu += '            <span data-i18n="directorysearch">ค้นหาข้อมูลบุคคล</span>'
                    tmpMenu += '      </a>'
                    tmpMenu += '  </li>'
                }
                //DirectorySearch
                //Tariffs
                if (permission_access['/api/v1/areacodes'] || permission_access['/api/v1/locations']) {
                    tmpMenu += '    <li class="treeview">'
                    tmpMenu += '        <a href="#">'
                    tmpMenu += '            <i class="fa fa-btc"></i>'
                    tmpMenu += '            <span data-i18n="tariffs">อัตราราคาโทร</span>'
                    tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
                    tmpMenu += '        </a>'
                    tmpMenu += '        <ul class="treeview-menu">'
                    //Tariffs-locations
                    if (permission_access['/api/v1/locations']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/locations' + access_token + '" data-i18n="locations">'
                        tmpMenu += '                    ตำแหน่งที่ตั้ง'
                        tmpMenu += '                </a>'
                        tmpMenu += '            </li>'
                    }
                    //Tariffs-areacode
                    if (permission_access['/api/v1/areacodes']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/areacodes' + access_token + '" data-i18n="Areacodes &amp; Rates">'
                        tmpMenu += '                    รหัสพื้นที่และอัตรา'
                        tmpMenu += '                </a>'
                        tmpMenu += '            </li>'
                    }
                    tmpMenu += '        </ul>'
                    tmpMenu += '    </li>'
                }
                //Tariffs
                //B2E
                if (permission_access['/b2e']) {
                    tmpMenu += '  <li>'
                    tmpMenu += '      <a href="/b2e' + access_token + '" target="_blank" >'
                    tmpMenu += '            <i class="fa fa-envelope"></i>'
                    tmpMenu += '            <span data-i18n="B2E">B2E</span>'
                    tmpMenu += '      </a>'
                    tmpMenu += '  </li>'
                }
                //B2E
                //Sync
                if (permission_access['/Sync-All'] || permission_access['/Sync-Extensions'] || permission_access['/Sync-Organizations']) {
                    tmpMenu += '    <li class="treeview">'
                    tmpMenu += '        <a href="#">'
                    tmpMenu += '            <i class="fa fa-refresh"></i>'
                    tmpMenu += '            <span data-i18n="Sync">Sync</span>'
                    tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
                    tmpMenu += '        </a>'
                    tmpMenu += '        <ul class="treeview-menu">'
                    //Sync All
                    if (permission_access['/Sync-All']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="#" class="Sync-All" data-i18n="Sync All">Sync All</a>'
                        tmpMenu += '            </li>'
                    }
                    //Sync Extensions
                    if (permission_access['/Sync-Extensions']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="#" class="Sync-Extensions" data-i18n="Sync Extensions">Sync Extensions</a>'
                        tmpMenu += '            </li>'
                    }
                    //Sync Organizations
                    if (permission_access['/Sync-Groups']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="#" class="Sync-Groups"data-i18n="Sync Groups">Sync Groups</a>'
                        tmpMenu += '            </li>'
                    }
                    //Sync Users
                    if (permission_access['/Sync-Users']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="#" class="Sync-Users"data-i18n="Sync Users">Sync Users</a>'
                        tmpMenu += '            </li>'
                    }
                    tmpMenu += '        </ul>'
                    tmpMenu += '    </li>'
                }
                //Sync
                //Configuration
                if (permission_access['/api/v1/etbs-permissions'] || permission_access['/api/v1/etbs-roles'] || permission_access['/api/v1/usersM']) {
                    tmpMenu += '    <li class="treeview">'
                    tmpMenu += '        <a href="#">'
                    tmpMenu += '            <i class="fa fa-gear"></i>'
                    tmpMenu += '            <span data-i18n="authorization">การตั้งค่า</span>'
                    tmpMenu += '            <i class="fa fa-angle-left pull-right"></i>'
                    tmpMenu += '        </a>'
                    tmpMenu += '        <ul class="treeview-menu">'
                    //Configuration-UserManage
                    if (permission_access['/api/v1/usersM']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/usersM' + access_token + '" data-i18n="users">ผู้ใช้</a>'
                        tmpMenu += '            </li>'
                    }
                    //Configuration-Roles
                    if (permission_access['/api/v1/etbs-roles']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/etbs-roles' + access_token + '" data-i18n="roles">ตำแหน่ง</a>'
                        tmpMenu += '            </li>'
                    }
                    //Configuration-Permissions
                    if (permission_access['/api/v1/etbs-permissions']) {
                        tmpMenu += '            <li>'
                        tmpMenu += '                <a href="/api/v1/etbs-permissions' + access_token + '" data-i18n="authorize">สิทธิ์</a>'
                        tmpMenu += '            </li>'
                    }
                    //Configuration-Deoartment
                    //tmpMenu += '            <li>'
                    //tmpMenu += '                <a href="/api/v1/etbs-Department' + access_token + '" data-i18n="department">แผนก</a>'
                    //tmpMenu += '            </li>'
                    tmpMenu += '        </ul>'
                    tmpMenu += '    </li>'
                }
                //Configuration
                $('.sidebar-menu').html(tmpMenu)
                checklanguage()
            },
            error: function (err) {
                //console.log(err)
            }
        });
    }
}
function ReRenderReportMenu() {
    for (var i = 0; i < $('.rpt').length; i++) {
        $('.rpt')[i].className = "btn btn-secondary rpt rpt" + (i + 1).toString()
        if ($('#rpt' + (i + 1)).length != 0) {
            $('#rpt' + (i + 1))[0].style.display = 'none'
        }
    }
}
function renderReportMenu(user, ext_lic, token, permission_access_data){
    $('.report-menu').html('')
    var access_token = ''
    var permission_access = []
    if (token != undefined) {
        access_token = '?access_token=' + token
    }
    var tmp = ''

    if (permission_access_data != undefined) {
        var perm = JSON.parse(permission_access_data)
        for (var i = 0; i < perm.length; i++) {
            //console.log(perm[i].perm_type)
            permission_access[perm[i].perm_type] = true
        }
        var countPermission = 1;
        if (permission_access['/api/v1/reports/user']) {
            tmp += '<div id="blockrpt1" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission +'" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="User Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
            countPermission++
        }
        if (permission_access['/api/v1/reports/admin']) {
            tmp += '<div id="blockrpt2" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission +'" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="Admin Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
            countPermission++
        }
        if (permission_access['/api/v1/reports/trunk']) {
            tmp += '<div id="blockrpt3" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission +'" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="Trunk Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
            countPermission++
        }
        if (permission_access['/api/v1/reports/top']) {
            tmp += '<div id="blockrpt4" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission +'" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="Top Usage Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
            countPermission++
        }
        if (permission_access['/api/v1/reports/chart']) {
            tmp += '<div id="blockrpt5" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission +'" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="Chart Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
            countPermission++
        }

        $('.report-menu').html(tmp)

        countPermission = 1;
        if (permission_access['/api/v1/reports/user']) {
            //rpt1
            $('#rpt' + countPermission +'').html('')
            var rpt1 = ''
            rpt1 += '<li style="margin-left:20px;list-style:none;" id="rptExtensionSummary">'
            rpt1 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/user/extension/summary' + access_token + '" data-i18n="extension summary report">Extensions Summary Report</a>'
            rpt1 += '</li>'
            rpt1 += '<li style="margin-left:20px;list-style:none;" id="rptExtensionDetail">'
            rpt1 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/user/extension/detail' + access_token + '" data-i18n="extensions detail report">Extensions Detail Report</a>'
            rpt1 += '</li> '
            rpt1 += '<li style="margin-left:20px;list-style:none;" id="rptGroupSummary">'
            rpt1 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/user/group/summary' + access_token + '" data-i18n="group summary report">Group Summary Report</a>'
            rpt1 += '</li>'
            rpt1 += '<li style="margin-left:20px;list-style:none;" id="rptGroupDetail">'
            rpt1 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/user/group/detail' + access_token + '" data-i18n="group detail report">Group Detail Report</a>'
            rpt1 += '</li>'
            $('#rpt' + countPermission +'').html(rpt1)
            //rpt1
            countPermission++
        }
        //Report-Admin
        if (permission_access['/api/v1/reports/admin']) {
            //rpt2
            $('#rpt' + countPermission +'').html('')
            var rpt2 = ''
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptDestinationSummary">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/destination/summary' + access_token + '" data-i18n="destination summary report">Destination Summary Report</a>'
            rpt2 += '</li>'
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptDestinationDetail">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/destination/detail' + access_token + '" data-i18n="destination details report">Destination Details Report</a>'
            rpt2 += '</li>'
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptDialledSummary">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/diallednumber/summary' + access_token + '" data-i18n="dialled number summary report">Dialled Number Summary Report</a>'
            rpt2 += '</li> '
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptDialledDetail">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/diallednumber/detail' + access_token + '" data-i18n="dialled number detail report">Dialled Number Detail Report</a>'
            rpt2 += '</li> '
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptUserDetail">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/user/detial' + access_token + '" data-i18n="user details report">User Details Report</a>'
            rpt2 += '</li>'
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptAccoutCodeSummary">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/accountcode/summary' + access_token + '" data-i18n="account code summary report">Account Code Summary Report</a>'
            rpt2 += '</li> '
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptAccoutCodeDetail">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/accountcode/detail' + access_token + '" data-i18n="account code details report">Account Code Details Report</a>'
            rpt2 += '</li>'
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptSummary">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/summary' + access_token + '" data-i18n="summary report">Summary Report</a>'
            rpt2 += '</li>'
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptSummaryByGroup">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/summary/group' + access_token + '" data-i18n="summary report by group">Summary Report By Group</a>'
            rpt2 += '</li>'
            rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptTranferCall">'
            rpt2 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/admin/tranfer/call' + access_token + '" data-i18n="tranfer call report">Transfer Call Report</a>'
            rpt2 += '</li>'
            $('#rpt' + countPermission + '').html(rpt2)
            countPermission++
        }
        //Report-Trunk
        if (permission_access['/api/v1/reports/trunk']) {
            var rpt3 = ''
            $('#rpt' + countPermission +'').html('')
            rpt3 += '<li style="margin-left:20px;list-style:none;" id="rptTrunkSummary">'
            rpt3 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/trunk/summary' + access_token + '" data-i18n="trunk summary report">Trunk Summary Report</a>'
            rpt3 += '</li>'
            rpt3 += '<li style="margin-left:20px;list-style:none;" id="rptTrunkDetail">'
            rpt3 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/trunk/detail' + access_token + '" data-i18n="trunk detail report">Trunk Detail Report</a>'
            rpt3 += '</li>'
            $('#rpt' + countPermission + '').html(rpt3)
            countPermission++
        }
        //Report-Top
        if (permission_access['/api/v1/reports/top']) {
            var rpt4 = ''
            $('#rpt' + countPermission +'').html('')
            rpt4 += '<li style="margin-left:20px;list-style:none;" id="rptTopExtension">'
            rpt4 += '   <a class="inrpt' + countPermission +'" href="/api/v1/reports/top/extension' + access_token + '" data-i18n="top extension usage report">Top Extension Usage Report</a>'
            rpt4 += '</li>'
            rpt4 += '<li style="margin-left:20px;list-style:none;" id="rptTopDestination">'
            rpt4 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/top/destination' + access_token + '" data-i18n="top destination usage report">Top Destination Usage Report</a>'
            rpt4 += '</li>'
            rpt4 += '<li style="margin-left:20px;list-style:none;" id="rptTopDailled">'
            rpt4 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/top/diallednumber' + access_token + '" data-i18n="top dialled number usage report">Top Dialled Number Usage Report</a>'
            rpt4 += '</li>'
            rpt4 += '<li style="margin-left:20px;list-style:none;" id="rptTopTrunk">'
            rpt4 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/top/trunk' + access_token + '" data-i18n="top trunk usage report">Top Trunk Usage Report</a>'
            rpt4 += '</li>'
            $('#rpt' + countPermission + '').html(rpt4)
            countPermission++
        }
        //Report-Chart
        if (permission_access['/api/v1/reports/chart']) {
            var rpt5 = ''
            $('#rpt' + countPermission +'').html('')
            rpt5 += '<li style="margin-left:20px;list-style:none;" id="rptMonthlySummary">'
            rpt5 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/chart/summary' + access_token + '" data-i18n="monthly summary report">Monthly Summary Report</a>'
            rpt5 += '</li>'
            rpt5 += '<li style="margin-left:20px;list-style:none;" id="rptMonthlyChargeSummary">'
            rpt5 += '    <a class="inrpt' + countPermission +'" href="/api/v1/reports/chart/summary/charge' + access_token + '" data-i18n="monthly charge summary report">Monthly Charge Summary Report</a>'
            rpt5 += '</li>'
            $('#rpt' + countPermission + '').html(rpt5)
            countPermission++
        }

        $('.rpt').on('click', function () {
            ReRenderReportMenu()
            $('.' + $(this).attr('action'))[0].className = "btn btn-primary rpt " + $(this).attr('action')
            $('.block' + $(this).attr('action'))[0].style.display = ''
        })

        for (var i = 0; i < $('a').length; i++) {
            if ($('a')[i].innerHTML == document.title) {
                $('.' + $('a')[i].className.replace('in', ''))[0].click()
            }
        }
        checklanguage()
    }
    else {
        $.ajax({
            url: '/api/v1/etbs-roles/getpathaccess',
            type: 'POST',
            data: { user: user },
            success: function (data) {
                Cookies('permission_access', data)
                var perm = JSON.parse(data)
                for (var i = 0; i < perm.length; i++) {
                    //console.log(perm[i].perm_type)
                    permission_access[perm[i].perm_type] = true
                }
                var countPermission = 1;
                if (permission_access['/api/v1/reports/user']) {
                    tmp += '<div id="blockrpt1" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission + '" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="User Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
                    countPermission++
                }
                if (permission_access['/api/v1/reports/admin']) {
                    tmp += '<div id="blockrpt2" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission + '" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="Admin Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
                    countPermission++
                }
                if (permission_access['/api/v1/reports/trunk']) {
                    tmp += '<div id="blockrpt3" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission + '" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="Trunk Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
                    countPermission++
                }
                if (permission_access['/api/v1/reports/top']) {
                    tmp += '<div id="blockrpt4" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission + '" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="Top Usage Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
                    countPermission++
                }
                if (permission_access['/api/v1/reports/chart']) {
                    tmp += '<div id="blockrpt5" style="border:1px solid #d2d6de;"><button class="btn btn-secondary rpt rpt' + countPermission + '" action="rpt' + countPermission + '" type="button" style="width:100%; text-align:left;" data-i18n="Chart Reports"></button><div id="rpt' + countPermission + '" class="blockrpt' + countPermission + '" style="display:none;background:#ffffff;"></div></div>'
                    countPermission++
                }

                $('.report-menu').html(tmp)

                countPermission = 1;
                if (permission_access['/api/v1/reports/user']) {
                    //rpt1
                    $('#rpt' + countPermission + '').html('')
                    var rpt1 = ''
                    rpt1 += '<li style="margin-left:20px;list-style:none;" id="rptExtensionSummary">'
                    rpt1 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/user/extension/summary' + access_token + '" data-i18n="extension summary report">Extensions Summary Report</a>'
                    rpt1 += '</li>'
                    rpt1 += '<li style="margin-left:20px;list-style:none;" id="rptExtensionDetail">'
                    rpt1 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/user/extension/detail' + access_token + '" data-i18n="extensions detail report">Extensions Detail Report</a>'
                    rpt1 += '</li> '
                    rpt1 += '<li style="margin-left:20px;list-style:none;" id="rptGroupSummary">'
                    rpt1 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/user/group/summary' + access_token + '" data-i18n="group summary report">Group Summary Report</a>'
                    rpt1 += '</li>'
                    rpt1 += '<li style="margin-left:20px;list-style:none;" id="rptGroupDetail">'
                    rpt1 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/user/group/detail' + access_token + '" data-i18n="group detail report">Group Detail Report</a>'
                    rpt1 += '</li>'
                    $('#rpt' + countPermission + '').html(rpt1)
                    //rpt1
                    countPermission++
                }
                //Report-Admin
                if (permission_access['/api/v1/reports/admin']) {
                    //rpt2
                    $('#rpt' + countPermission + '').html('')
                    var rpt2 = ''
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptDestinationSummary">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/destination/summary' + access_token + '" data-i18n="destination summary report">Destination Summary Report</a>'
                    rpt2 += '</li>'
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptDestinationDetail">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/destination/detail' + access_token + '" data-i18n="destination details report">Destination Details Report</a>'
                    rpt2 += '</li>'
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptDialledSummary">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/diallednumber/summary' + access_token + '" data-i18n="dialled number summary report">Dialled Number Summary Report</a>'
                    rpt2 += '</li> '
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptDialledDetail">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/diallednumber/detail' + access_token + '" data-i18n="dialled number detail report">Dialled Number Detail Report</a>'
                    rpt2 += '</li> '
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptUserDetail">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/user/detial' + access_token + '" data-i18n="user details report">User Details Report</a>'
                    rpt2 += '</li>'
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptAccoutCodeSummary">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/accountcode/summary' + access_token + '" data-i18n="account code summary report">Account Code Summary Report</a>'
                    rpt2 += '</li> '
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptAccoutCodeDetail">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/accountcode/detail' + access_token + '" data-i18n="account code details report">Account Code Details Report</a>'
                    rpt2 += '</li>'
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptSummary">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/summary' + access_token + '" data-i18n="summary report">Summary Report</a>'
                    rpt2 += '</li>'
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptSummaryByGroup">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/summary/group' + access_token + '" data-i18n="summary report by group">Summary Report By Group</a>'
                    rpt2 += '</li>'
                    rpt2 += '<li style="margin-left:20px;list-style:none;" id="rptTranferCall">'
                    rpt2 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/admin/tranfer/call' + access_token + '" data-i18n="tranfer call report">Transfer Call Report</a>'
                    rpt2 += '</li>'
                    $('#rpt' + countPermission + '').html(rpt2)
                    countPermission++
                }
                //Report-Trunk
                if (permission_access['/api/v1/reports/trunk']) {
                    var rpt3 = ''
                    $('#rpt' + countPermission + '').html('')
                    rpt3 += '<li style="margin-left:20px;list-style:none;" id="rptTrunkSummary">'
                    rpt3 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/trunk/summary' + access_token + '" data-i18n="trunk summary report">Trunk Summary Report</a>'
                    rpt3 += '</li>'
                    rpt3 += '<li style="margin-left:20px;list-style:none;" id="rptTrunkDetail">'
                    rpt3 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/trunk/detail' + access_token + '" data-i18n="trunk detail report">Trunk Detail Report</a>'
                    rpt3 += '</li>'
                    $('#rpt' + countPermission + '').html(rpt3)
                    countPermission++
                }
                //Report-Top
                if (permission_access['/api/v1/reports/top']) {
                    var rpt4 = ''
                    $('#rpt' + countPermission + '').html('')
                    rpt4 += '<li style="margin-left:20px;list-style:none;" id="rptTopExtension">'
                    rpt4 += '   <a class="inrpt' + countPermission + '" href="/api/v1/reports/top/extension' + access_token + '" data-i18n="top extension usage report">Top Extension Usage Report</a>'
                    rpt4 += '</li>'
                    rpt4 += '<li style="margin-left:20px;list-style:none;" id="rptTopDestination">'
                    rpt4 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/top/destination' + access_token + '" data-i18n="top destination usage report">Top Destination Usage Report</a>'
                    rpt4 += '</li>'
                    rpt4 += '<li style="margin-left:20px;list-style:none;" id="rptTopDailled">'
                    rpt4 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/top/diallednumber' + access_token + '" data-i18n="top dialled number usage report">Top Dialled Number Usage Report</a>'
                    rpt4 += '</li>'
                    rpt4 += '<li style="margin-left:20px;list-style:none;" id="rptTopTrunk">'
                    rpt4 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/top/trunk' + access_token + '" data-i18n="top trunk usage report">Top Trunk Usage Report</a>'
                    rpt4 += '</li>'
                    $('#rpt' + countPermission + '').html(rpt4)
                    countPermission++
                }
                //Report-Chart
                if (permission_access['/api/v1/reports/chart']) {
                    var rpt5 = ''
                    $('#rpt' + countPermission + '').html('')
                    rpt5 += '<li style="margin-left:20px;list-style:none;" id="rptMonthlySummary">'
                    rpt5 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/chart/summary' + access_token + '" data-i18n="monthly summary report">Monthly Summary Report</a>'
                    rpt5 += '</li>'
                    rpt5 += '<li style="margin-left:20px;list-style:none;" id="rptMonthlyChargeSummary">'
                    rpt5 += '    <a class="inrpt' + countPermission + '" href="/api/v1/reports/chart/summary/charge' + access_token + '" data-i18n="monthly charge summary report">Monthly Charge Summary Report</a>'
                    rpt5 += '</li>'
                    $('#rpt' + countPermission + '').html(rpt5)
                    countPermission++
                }

                $('.rpt').on('click', function () {
                    ReRenderReportMenu()
                    $('.' + $(this).attr('action'))[0].className = "btn btn-primary rpt " + $(this).attr('action')
                    $('.block' + $(this).attr('action'))[0].style.display = ''
                })

                for (var i = 0; i < $('a').length; i++) {
                    if ($('a')[i].innerHTML == document.title) {
                        $('.' + $('a')[i].className.replace('in', ''))[0].click()
                    }
                }
                checklanguage()
            },
            error: function (err) {
                //console.log(err)
            }
        });
    }

}

$(document).ready(function () {
    if (Cookies.get('user') != undefined && Cookies.get('ext_lic') != undefined) {
        getLicenseUsage(Cookies.get('user'), Cookies.get('ext_lic'))
    }
    $(document).on('click', '.lang-switch', function () {
        $('.badge-switch').removeClass('badge')
        $('.badge-lang-switch-' + $(this).attr('data-locale')).addClass('badge')
    })
    checklanguage()
    //if (Cookies('permission_access') != undefined) {
    //    if (Cookies('user') != undefined && Cookies(Cookies('user')) != undefined) {
    //        var access_token = JSON.parse(Cookies(Cookies('user'))).access_token
    //        var user = Cookies.get('user')
    //        renderMenu(user, Cookies.get('ext_lic'), access_token, Cookies('permission_access'))
    //        if ($('.report-menu').length != 0) {
    //            renderReportMenu(user, Cookies.get('ext_lic'), access_token, Cookies('permission_access'))
    //        }
    //    } else if (Cookies('user') != undefined) {
    //        var user = Cookies.get('user')
    //        renderMenu(user, Cookies.get('ext_lic'), undefined, Cookies('permission_access'))
    //        if ($('.report-menu').length != 0) {
    //            renderReportMenu(user, Cookies.get('ext_lic'), undefined, Cookies('permission_access'))
    //        }
    //    }

    //}
    //else {
    setTimeout(function () { 
        if (Cookies('user') != undefined && Cookies(Cookies('user')) != undefined) {
            var access_token = JSON.parse(Cookies(Cookies('user'))).access_token
            var user = Cookies.get('user')
            renderMenu(user, Cookies.get('ext_lic'), access_token)
            if ($('.report-menu').length != 0) {
                renderReportMenu(user, Cookies.get('ext_lic'), access_token)
            }
        } else if (Cookies('user') != undefined) {
            var user = Cookies.get('user')
            renderMenu(user)
            if ($('.report-menu').length != 0) {
                renderReportMenu(user)
            }
        }
    }, 500);


    //}


    //Sync ETL 

    $(document).on('click', '.Sync-All', function () {
        $.ajax({
            url: 'https://ccbilling.kmutt.ac.th/etl/sync/all',
            type: 'POST',
            success: function (data) {
                $.notify("Start Sync All", "success");
            }, error: function () {
                $.notify("Can't Start Sync All ", "danger");
            }
        })
    })
    $(document).on('click', '.Sync-Extensions', function () {
        $.ajax({
            url: 'https://ccbilling.kmutt.ac.th/etl/sync/employee',
            type: 'POST',
            success: function (data) {
                $.notify("Start Sync Extensions", "success");
            }, error: function () {
                $.notify("Can't Start Sync Extensions ", "danger");
            }
        })
    })

    $(document).on('click', '.Sync-Groups', function () {
        $.ajax({
            url: 'https://ccbilling.kmutt.ac.th/etl/sync/department',
            type: 'POST',
            success: function (data) {
                $.notify("Start Sync Groups", "success");
            }, error: function () {
                $.notify("Can't Start Sync Groups ", "danger");
            }
        })
    })
    $(document).on('click', '.Sync-Users', function () {
        $.ajax({
            url: 'https://ccbilling.kmutt.ac.th/etl/sync/account',
            type: 'POST',
            success: function (data) {
                $.notify("Start Sync User", "success");
            }, error: function () {
                $.notify("Can't Start Sync User ", "danger");
            }
        })
    })

});