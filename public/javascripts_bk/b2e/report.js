$(document).ready(function () {
    $('.navbar-right')[0].style.display = 'none'
    $('#smtp')[0].style.display = 'none'
    get_data();
    click_view();
    click_insert();
    click_edit();
    click_delete();
});

function get_data() {
    $('#editable').DataTable({
        "ajax": {
            "url": "/b2e/report/get_all",
            "type": "POST"
        },
        "columns": [
            { "data": "RID" },
            { "data": "ReportName" },
            { "data": "StartDate" },
            { "data": "EndDate" },
            { "data": "btn_view" },
            { "data": "btn_edit" },
            { "data": "btn_delete" }
        ],
        "order": [0, 'desc']
    });
}

function click_insert() {
    $('div.btn_insert').on('click', 'a#btn_insert', function (e) {
        e.preventDefault();
        location.href = '/b2e/report/new';
    });
}

function click_edit() {
    $('#editable').on('click', 'a#btn_edit', function (e) {
        e.preventDefault();

        var table = $('#editable').DataTable();
        var nRow = $(this).parents('tr')[0];
        var data = table.row(nRow).data();

        rid = data["RID"];
        location.href = '/b2e/report/edit/' + rid;
    });
}

function click_view() {
    $('#editable').on('click', 'a#btn_view', function (e) {
        e.preventDefault();

        var table = $('#editable').DataTable();
        var nRow = $(this).parents('tr')[0];
        var data = table.row(nRow).data();
        rid = data["RID"];

        $.post("/b2e/report/get_with_groupname/" + rid, function (data) {
            if (data.status == "success") {
                $('#v_RID').text(data.data[0]["RID"]);
                $('#v_ReportName').text(data.data[0]["ReportName"]);
                $('#v_StartDate').text(data.data[0]["StartDate"]);
                $('#v_EndDate').text(data.data[0]["EndDate"]);

                if (data.data[0]["CT_INC_rs"] == "" && data.data[0]["CT_OUT_rs"] == "" && data.data[0]["CT_INT_rs"] == "") {
                    $('#v_CT_INC').text('-');
                    $('#v_CT_OUT').text('');
                    $('#v_CT_INT').text('');
                } else {
                    ct_rs = data.data[0]["CT_rs"].replace(/\*,/g, '');
                    $('#v_CT_INC').text(ct_rs.replace(/\*/g, ''));
                    // if (data.data[0]["CT_INC_rs"] != "*") {
                    //     $('#v_CT_INC').text(data.data[0]["CT_INC_rs"]);
                    // } 
                    // if (data.data[0]["CT_OUT_rs"] != "*") {
                    //     $('#v_CT_OUT').text(data.data[0]["CT_OUT_rs"]);
                    // } 
                    // if (data.data[0]["CT_INT_rs"] != "*") {
                    //     $('#v_CT_INT').text(data.data[0]["CT_INT_rs"]);
                    // } 
                    // $('#v_CT_INC').text(data.data[0]["CT_INC_rs"]);
                    // $('#v_CT_OUT').text(data.data[0]["CT_OUT_rs"]);
                    // $('#v_CT_INT').text(data.data[0]["CT_INT_rs"]);
                }

                if (data.data[0]["TT_UNK_rs"] == "" && data.data[0]["TT_FRE_rs"] == "" && data.data[0]["TT_LOC_rs"] == "" && data.data[0]["TT_MOB_rs"] == "" && data.data[0]["TT_LON_rs"] == "" && data.data[0]["TT_OVE_rs"] == "") {
                    $('#v_TT_UNK').text('-');
                    $('#v_TT_FRE').text('');
                    $('#v_TT_LOC').text('');
                    $('#v_TT_MOB').text('');
                    $('#v_TT_LON').text('');
                    $('#v_TT_OVE').text('');
                } else {
                    tt_rs = data.data[0]["TT_rs"].replace(/\*,/g, '');
                    $('#v_TT_UNK').text(tt_rs.replace(/\*/g, ''));

                    // if (data.data[0]["TT_UNK_rs"] != "*") {
                    //     $('#v_TT_UNK').text(data.data[0]["TT_UNK_rs"]);
                    // }
                    // if (data.data[0]["TT_FRE_rs"] != "*") {
                    //     $('#v_TT_FRE').text(data.data[0]["TT_FRE_rs"]);
                    // }
                    // if (data.data[0]["TT_LOC_rs"] != "*") {
                    //     $('#v_TT_LOC').text(data.data[0]["TT_LOC_rs"]);
                    // }
                    // if (data.data[0]["TT_MOB_rs"] != "*") {
                    //     $('#v_TT_MOB').text(data.data[0]["TT_MOB_rs"]);
                    // }
                    // if (data.data[0]["TT_LON_rs"] != "*") {
                    //     $('#v_TT_LON').text(data.data[0]["TT_LON_rs"]);
                    // }
                    // if (data.data[0]["TT_OVE_rs"] != "*") {
                    //     $('#v_TT_OVE').text(data.data[0]["TT_OVE_rs"]);
                    // }

                    // $('#v_TT_UNK').text(data.data[0]["TT_UNK_rs"]);
                    // $('#v_TT_FRE').text(data.data[0]["TT_FRE_rs"]);
                    // $('#v_TT_LOC').text(data.data[0]["TT_LOC_rs"]);
                    // $('#v_TT_MOB').text(data.data[0]["TT_MOB_rs"]);
                    // $('#v_TT_LON').text(data.data[0]["TT_LON_rs"]);
                    // $('#v_TT_OVE').text(data.data[0]["TT_OVE_rs"]);
                }

                $('#v_ExtType').text(data.data[0]["ExtType"]);

                // if (data.data[0]["ExtFrom"] == "0") {
                //     $('#v_ExtFrom').text("-");
                // } else {
                //     $('#v_ExtFrom').text(data.data[0]["ExtFrom"]);
                // }

                if (data.data[0]["ReportName"] == "Extension Summary" || data.data[0]["ReportName"] == "Extension Details" || data.data[0]["ReportName"] == "Tranfer Call") {
                    $('#v_ExtFrom').text(data.data[0]["ExtFrom"]);
                } else {
                    $('#v_ExtFrom').text("-");
                }

                if (data.data[0]["ExtTo"] == "0") {
                    $('#v_ExtTo').text("-");
                } else {
                    $('#v_ExtTo').text(data.data[0]["ExtTo"]);
                }

                // if (data.data[0]["RouteF"] == "0") {
                //     $('#v_RouteF').text("-");
                // } else {
                //     $('#v_RouteF').text(data.data[0]["RouteF"]);
                // }

                // if (data.data[0]["RouteT"] == "0") {
                //     $('#v_RouteT').text("-");
                // } else {
                //     $('#v_RouteT').text(data.data[0]["RouteT"]);
                // }

                if (data.data[0]["ReportName"] == "Route Details" || data.data[0]["ReportName"] == "Route Summary") {
                    $('#v_RouteF').text(data.data[0]["RouteF"]);
                    $('#v_RouteT').text(data.data[0]["RouteT"]);
                } else {
                    $('#v_RouteF').text("-");
                    $('#v_RouteT').text("-");
                }
                // if (data.data[0]["TrunkF"] == "0") {
                //     $('#v_TrunkF').text("-");
                // } else {
                //     $('#v_TrunkF').text(data.data[0]["TrunkF"]);
                // }

                if (data.data[0]["ReportName"] == "Trunk Details" || data.data[0]["ReportName"] == "Trunk Summary") {
                    $('#v_TrunkF').text(data.data[0]["TrunkF"]);
                    $('#v_TrunkT').text(data.data[0]["TrunkT"]);
                } else {
                    $('#v_TrunkF').text("-");
                    $('#v_TrunkT').text("-");
                }
                // if (data.data[0]["TrunkT"] == "0") {
                //     $('#v_TrunkT').text("-");
                // } else {
                //     $('#v_TrunkT').text(data.data[0]["TrunkT"]);
                // }

                if (data.data[0]["ReportName"] == "Account Code Summary" || data.data[0]["ReportName"] == "Account Code Details") {
                    $('#v_AccF').text(data.data[0]["AccF"]);
                    $('#v_AccT').text(data.data[0]["AccT"]);
                } else {
                    $('#v_AccF').text("-");
                    $('#v_AccT').text("-");
                }
                $('#v_Exts').text(data.data[0]["Exts"]);
                $('#v_Destination').text(data.data[0]["Destination"]);
                $('#v_DialledNo').text(data.data[0]["DialledNo"]);
                $('#v_DataType').text(data.data[0]["DataType"]);
                $('#v_UserDetailType').text(data.data[0]["UserDetailType"]);
                $('#v_TopUsageBy').text(data.data[0]["TopUsageBy"]);

                if (data.data[0]["ReportName"] == "Top Extension Usage" || data.data[0]["ReportName"] == "Top Dialled Number Usage" || data.data[0]["ReportName"] == "Top Trunk Usage" || data.data[0]["ReportName"] == "Top Destination Usage") {
                    $('#v_Top').text(data.data[0]["Top"]);
                } else {
                    $('#v_Top').text("-");
                }


                if (data.data[0]["MonthlyCustom"] == "0") {
                    $('#v_MonthlyCustom').text("-");
                } else {
                    $('#v_MonthlyCustom').text(data.data[0]["MonthlyCustom"]);
                }

                if (data.data[0]["ReportName"] == "Group Summary" || data.data[0]["ReportName"] == "Group Details" || data.data[0]["ReportName"] == "Summary Report" || data.data[0]["ReportName"] == "Summary Report By Group") {
                    $('#v_GroupName').text(data.data[0]["org_name"]);
                } else {
                    $('#v_GroupName').text("-");
                }

                $('div.modal.fade').modal();
                //alert("");
            }
        });
    });
}

function click_delete() {
    $('#editable').on('click', 'a#btn_delete', function (e) {
        e.preventDefault();

        if (confirm("Are you sure to delete this data ?") == false) {
            return;
        }

        var table = $('#editable').DataTable();
        var nRow = $(this).parents('tr')[0];
        var data = table.row(nRow).data();
        var rid = data["RID"];

        $.post("/b2e/report/delete/" + rid, function (data) {
            if (data.status == "success") {
                setTimeout(function () { data_refresh(); }, 200);
            }
        });
    });
}

function data_refresh() {
    $('#editable').DataTable().ajax.reload();
}