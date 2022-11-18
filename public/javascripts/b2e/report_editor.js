$(document).ready(function () {
    $('.navbar-right')[0].style.display = 'none'
    $('#smtp')[0].style.display = 'none'
  $('input').iCheck({
    checkboxClass: 'icheckbox_minimal-red',
    radioClass: 'iradio_minimal-red',
    increaseArea: '20%' // optional
  });

  $('select#inputDestination').select2();

  ReportName = $(".checked input[name=rd_reportname").val();
  select_report_name(ReportName);


  if ($('#inputStartDate').val() == "" && $('#inputEndDate').val() == "") {
    $('#inputStartDate').val(moment().startOf('year').format('YYYY-MM-DD[T]HH:mm'));
    $('#inputEndDate').val(moment().endOf('year').format('YYYY-MM-DD[T]HH:mm'));
  }
  $('ui#ui_report_name input').prop("disabled", true);

  $('#treeGroup').jstree({
    'core': {
      'data':
      {
        "url": "/b2e/report/get_organizations",
        "dataType": "json",
      }
    }
  });

  setTimeout(function () {
    if ($('input#sl_Group').val() != "") {
      $('#treeGroup').jstree('select_node', $('input#sl_Group').val());
    } else {
      $('#treeGroup').jstree('select_node', 'ul > li:last');
    }
  }, 1000);

  $('#treeGroup').on("changed.jstree", function (e, data) {
    if (data.selected.length) {
      $('#sl_Group').val(data.instance.get_node(data.selected[0]).id);
      // console.log('Selected: [' + data.instance.get_node(data.selected[0]).id + ']' + data.instance.get_node(data.selected[0]).text);
    }
  })


  input_change();

  click_report_name_a();
  click_save();
  click_data_type();
  check_data_type();
});



function click_save() {
  $('div#save').on('click', 'button#btn_save', function (e) {
    e.preventDefault();

    if (confirm("Are you sure save data ?") == false) {
      return;
    }

    RID = $('#inputRID').val();
    ReportName = $(".checked input[name=rd_reportname").val();

    StartDate = moment($('#inputStartDate').val()).format('YYYY-MM-DD HH:mm:ss');
    EndDate = moment($('#inputEndDate').val()).format('YYYY-MM-DD HH:mm:ss');
    if ($('input#sl_CT_INT').is(":checked")) { CT_INT = $('input#sl_CT_INT').val(); } else { CT_INT = -1; }
    if ($('input#sl_CT_INC').is(":checked")) { CT_INC = $('input#sl_CT_INC').val(); } else { CT_INC = -1; }
    if ($('input#sl_CT_OUT').is(":checked")) { CT_OUT = $('input#sl_CT_OUT').val(); } else { CT_OUT = -1; }
    if ($('input#sl_TT_UNK').is(":checked")) { TT_UNK = $('input#sl_TT_UNK').val(); } else { TT_UNK = -1; }
    if ($('input#sl_TT_FRE').is(":checked")) { TT_FRE = $('input#sl_TT_FRE').val(); } else { TT_FRE = -1; }
    if ($('input#sl_TT_LOC').is(":checked")) { TT_LOC = $('input#sl_TT_LOC').val(); } else { TT_LOC = -1; }
    if ($('input#sl_TT_MOB').is(":checked")) { TT_MOB = $('input#sl_TT_MOB').val(); } else { TT_MOB = -1; }
    if ($('input#sl_TT_LON').is(":checked")) { TT_LON = $('input#sl_TT_LON').val(); } else { TT_LON = -1; }
    if ($('input#sl_TT_OVE').is(":checked")) { TT_OVE = $('input#sl_TT_OVE').val(); } else { TT_OVE = -1; }

    ExtType = $("#sl_ExtType option:selected").val();
    ExtFrom = $('#inputExtFrom').val();
    ExtTo = $('#inputExtTo').val();
    Exts = $('#inputExt').val();
    GroupID = $("#sl_Group").val();
    AccFrom = $('#inputAccFrom').val();
    AccTo = $('#inputAccTo').val();
    RouteF = $('#inputRouteFrom').val();
    RouteT = $('#inputRouteTo').val();
    TrunkF = $('#inputTrunkFrom').val();
    TrunkT = $('#inputTrunkTo').val();
    if ($('#inputDestination').val() == null) {
      Destination = "-";
    } else {
      Destination = $('#inputDestination').val();
    }
    DialledNo = $('#inputDialledNo').val();
    DataType = $("#sl_DataType option:selected").val();
    UserDetailType = $('#inputUserDetailType option:selected').val();
    TopUsageBy = $('#inputTopUsageBy option:selected').val();
    Top = $('#inputTop option:selected').val();
    CustomMonthly = $('#inputStartMonthly').val();

    if ($('#inputStatus').val() == 'update') {
      $.post("/b2e/report/update/" + RID + "/" + ReportName + "/" + StartDate + "/" + EndDate + "/" + CT_INT + "/" + CT_INC + "/" + CT_OUT + "/" + TT_UNK + "/" + TT_FRE + "/" + TT_LOC + "/" + TT_MOB + "/" + TT_LON + "/" + TT_OVE + "/" + ExtType + "/" + ExtFrom + "/" + ExtTo + "/" + Exts + "/" + GroupID + "/" + RouteF + "/" + RouteT + "/" + TrunkF + "/" + TrunkT + "/" + Destination + "/" + DialledNo + "/" + DataType + "/" + UserDetailType + "/" + TopUsageBy + "/" + Top + "/" + CustomMonthly + "/" + AccFrom + "/" + AccTo, function (data) {
        if (data.status == "success") {
          setTimeout(function () { location.href = '/b2e/report'; }, 200);
        }
      });
    } else if ($('#inputStatus').val() == 'insert') {
      $.post("/b2e/report/insert/" + ReportName + "/" + StartDate + "/" + EndDate + "/" + CT_INT + "/" + CT_INC + "/" + CT_OUT + "/" + TT_UNK + "/" + TT_FRE + "/" + TT_LOC + "/" + TT_MOB + "/" + TT_LON + "/" + TT_OVE + "/" + ExtType + "/" + ExtFrom + "/" + ExtTo + "/" + Exts + "/" + GroupID + "/" + RouteF + "/" + RouteT + "/" + TrunkF + "/" + TrunkT + "/" + Destination + "/" + DialledNo + "/" + DataType + "/" + UserDetailType + "/" + TopUsageBy + "/" + Top + "/" + CustomMonthly + "/" + AccFrom + "/" + AccTo, function (data) {
        if (data.status == "success") {
          setTimeout(function () { location.href = '/b2e/report'; }, 200);
        }
      });
    }


    console.log('save');
  });
}

function click_report_name_a() {
  $('#ui_report_name').on('click', 'a#report_name', function (e) {
    e.preventDefault();

    var this_li = $(this).parents('li')[0];
    $(this, 'input').iCheck('check');
    $('ui#ui_report_name li').removeClass();
    $(this_li).addClass('active-reportname');
    $('#inputNextExec').focus();

    check_data_type();
  });

  $('input[type="radio"]').on('ifChanged', function (e) {
    select_report_name(this.value);
  });
}

function select_report_name(reportname) {
  hide_input();
  switch (reportname) {
    case 'Extension Summary':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ext_from').show();
      $('.form-group#ext_to').show();
      $('.form-group#save').show();
      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Extension Details':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ckb_calltype').show();
      $('.form-group#ckb_tolltype').show();
      $('.form-group#ext_from').show();
      $('.form-group#ext_to').show();
      $('.form-group#save').show();
      break;
    case 'Group Summary':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ckb_calltype').show();
      $('.form-group#sl_group').show();
      $('.form-group#save').show();

      uncheck_tolltype();
      break;
    case 'Group Details':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ckb_calltype').show();
      $('.form-group#ckb_tolltype').show();
      $('.form-group#sl_group').show();
      $('.form-group#save').show();
      break;
    case 'Trunk Summary':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#route_from').show();
      $('.form-group#route_to').show();
      $('.form-group#trunk_from').show();
      $('.form-group#trunk_to').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Trunk Details':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ckb_calltype').show();
      $('.form-group#ckb_tolltype').show();
      $('.form-group#route_from').show();
      $('.form-group#route_to').show();
      $('.form-group#trunk_from').show();
      $('.form-group#trunk_to').show();
      $('.form-group#save').show();
      break;
    case 'Dialled Number Summary':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#dialled_no').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Dialled Number Details':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#dialled_no').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Destination Summary':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#destination').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Destination Details':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#destination').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();

      break;
    case 'Top Extension Usage':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#top_usage_by').show();
      $('.form-group#top').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Top Destination Usage':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#top_usage_by').show();
      $('.form-group#top').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Top Dialled Number Usage':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#top_usage_by').show();
      $('.form-group#top').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Top Trunk Usage':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#top_usage_by').show();
      $('.form-group#top').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'User Details':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#user_detail_type').show();
      $('.form-group#save').show();

      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Account Code Summary':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#acc_from').show();
      $('.form-group#acc_to').show();
      $('.form-group#save').show();
      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Account Code Details':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ckb_tolltype').show();
      $('.form-group#ckb_calltype').show();
      $('.form-group#acc_from').show();
      $('.form-group#acc_to').show();
      $('.form-group#save').show();
      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Summary Report':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ckb_calltype').show();
      $('.form-group#sl_group').show();
      $('.form-group#save').show();
      uncheck_tolltype();
      break;
    case 'Summary Report By Group':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ckb_calltype').show();
      $('.form-group#sl_group').show();
      $('.form-group#save').show();
      uncheck_tolltype();
      break;
    case 'Tranfer Call':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#ext_from').show();
      $('.form-group#ext_to').show();
      $('.form-group#save').show();
      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Monthly Summary':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#save').show();
      uncheck_calltype();
      uncheck_tolltype();
      break;
    case 'Monthly Charge Summary':
      hide_input();
      clear_calltype_tolltype();
      $('.form-group#data_type').show();
      $('.form-group#start_date').show();
      $('.form-group#end_date').show();
      $('.form-group#save').show();
      uncheck_calltype();
      uncheck_tolltype();
      break;
    default:
    // default
  }
}

function hide_input() {
  $('.form-group#start_date').hide();
  $('.form-group#end_date').hide();
  $('.form-group#start_monthly').hide();

  $('.form-group#ckb_calltype').hide();
  $('.form-group#ckb_tolltype').hide();

  $('.form-group#ext_type').hide();
  $('.form-group#ext_from').hide();
  $('.form-group#ext_to').hide();
  $('.form-group#acc_from').hide();
  $('.form-group#acc_to').hide();
  $('.form-group#ext').hide();
  $('.form-group#sl_group').hide();
  $('.form-group#route_from').hide();
  $('.form-group#route_to').hide();
  $('.form-group#trunk_from').hide();
  $('.form-group#trunk_to').hide();
  $('.form-group#destination').hide();
  $('.form-group#dialled_no').hide();
  $('.form-group#data_type').hide();
  $('.form-group#user_detail_type').hide();
  $('.form-group#top_usage_by').hide();
  $('.form-group#top').hide();

  $('.form-group#save').hide();
}

function show_input() {
  $('.form-group#start_date').show();
  $('.form-group#end_date').show();
  $('.form-group#start_monthly').show();

  $('.form-group#ckb_calltype').show();
  $('.form-group#ckb_tolltype').show();

  $('.form-group#ext_type').show();
  $('.form-group#ext_from').show();
  $('.form-group#ext_to').show();
  $('.form-group#acc_from').show();
  $('.form-group#acc_to').show();
  $('.form-group#ext').show();
  $('.form-group#sl_group').show();
  $('.form-group#route_from').show();
  $('.form-group#route_to').show();
  $('.form-group#trunk_from').show();
  $('.form-group#trunk_to').show();
  $('.form-group#destination').show();
  $('.form-group#dialled_no').show();
  $('.form-group#data_type').show();
  $('.form-group#user_detail_type').show();
  $('.form-group#top_usage_by').show();
  $('.form-group#top').show();

  $('.form-group#save').show();
}

function click_data_type() {
  $("#sl_DataType").change(function () {
    if ($("#sl_DataType").val() == "MonthlyCustom") {
      $('.form-group#start_monthly').show();
    } else {
      $('.form-group#start_monthly').hide();
    }
  });
}

function check_data_type() {
  if ($('#sl_DataType').val() == "MonthlyCustom") {
    $('.form-group#start_monthly').show();
  }
}

function clear_calltype_tolltype() {
  if ($('#inputStatus').val() == 'insert') {
    $('input#sl_CT_INT').iCheck('uncheck');
    $('input#sl_CT_INC').iCheck('uncheck');
    $('input#sl_CT_OUT').iCheck('check');

    $('input#sl_TT_UNK').iCheck('uncheck');
    $('input#sl_TT_FRE').iCheck('check');
    $('input#sl_TT_LOC').iCheck('check');
    $('input#sl_TT_MOB').iCheck('check');
    $('input#sl_TT_LON').iCheck('check');
    $('input#sl_TT_OVE').iCheck('check');
  }
}

function uncheck_calltype() {
  if ($('#inputStatus').val() == 'insert') {
    $('input#sl_CT_INT').iCheck('uncheck');
    $('input#sl_CT_INC').iCheck('uncheck');
    $('input#sl_CT_OUT').iCheck('check');
  }
}

function uncheck_tolltype() {
  if ($('#inputStatus').val() == 'insert') {
    $('input#sl_TT_UNK').iCheck('uncheck');
    $('input#sl_TT_FRE').iCheck('uncheck');
    $('input#sl_TT_LOC').iCheck('uncheck');
    $('input#sl_TT_MOB').iCheck('uncheck');
    $('input#sl_TT_LON').iCheck('uncheck');
    $('input#sl_TT_OVE').iCheck('uncheck');
  }
}

function input_change() {
  $("select#optTollType").change(function () {
    getDestinationsName($('select#optTollType option:selected').text());
  });
}

function getDestinationsName(tolltype) {
  var url = '/b2e/report/get_destinations_name/' + tolltype;

  $('select#inputDestination').children().remove().end();
  $('select#inputDestination').select2({
    ajax: {
      url: url,
      dataType: 'json'
      // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
    }
  });

}
