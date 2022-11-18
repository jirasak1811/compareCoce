$(document).ready(function () {
    $('.navbar-right')[0].style.display = 'none'
    $('#smtp')[0].style.display = 'none'
    get_data();
    click_insert();
    click_edit();
    click_delete();
    click_save();
  });

  function get_data() {
    $('#editable').DataTable({
      "ajax": {
        "url": "/b2e/schedules/get_all",
        "type": "POST"
      },
      "columns": [
        { "data": "SID" },
        { "data": "Minutes" },
        { "data": "Hours" },
        { "data": "DOM" },
        { "data": "Months" },
        { "data": "DOW" },
        { "data": "ReportID" },
        { "data": "EmailID" },
        { "data": "CreatedDate" },
        { "data": "NextExecDate" },
        { "data": "LastExecDate" },
        { "data": "IsActive" },
        { "data": "btn_edit" },
        { "data": "btn_delete" }
      ],
      "columnDefs": [
        {
          "targets": [ 0 ],
          "visible": false,
          "searchable": false
        }
      ],
      "order": [ 0, 'desc' ]
    });
  }

  function click_insert() {
    $('div.btn_insert').on('click', 'a#btn_insert', function (e) {
      e.preventDefault();
      
      setTimeout(function(){ get_report(); }, 100);
      setTimeout(function(){ get_email(); }, 200);
      
      $("#btn_save").text("Add New");
      $("#status").val("insert");
      $('#rd_minutes').iCheck('check');;

      setTimeout(function(){ $("#editModal").modal(); }, 300);
    });
  }

  function click_edit() {
    $('#editable').on('click', 'a#btn_edit', function (e) {
      e.preventDefault();

      

      var table = $('#editable').DataTable();
      var nRow = $(this).parents('tr')[0];
      var data = table.row(nRow).data();

      setTimeout(function(){ get_report(); }, 100);
      setTimeout(function(){ get_email(); }, 200);
      setTimeout(function(){ 
        $("#btn_save").text("Update");
        $("#status").val("update");
        $("#sid").val(data["SID"]);

        console.log(data["Minutes"]);
        val_check = '<i class="fa fa-check"></i>';
        if(data["Minutes"] == val_check){
          $('#rd_minutes').iCheck('check');
        } else if(data["Hours"] == val_check){
          $('#rd_hours').iCheck('check');
        } else if(data["DOM"] == val_check){
          $('#rd_dom').iCheck('check');
        } else if(data["Mouths"] == val_check){
          $('#rd_mouths').iCheck('check');
        } else if(data["DOW"] == val_check){
          $('#rd_dow').iCheck('check');
        } else {
          $('#rd_minutes').iCheck('check');
        }

        $('#inputReport').val(data["ReportID"]);
        $('#inputEmail').val(data["EmailID"]);
        
        f_date = moment(data["NextExecDate"],"DD/MM/YYYY HH:mm:ss").format('YYYY-MM-DDTHH:mm:ss');
        $("#inputNextExec").val(f_date);
        //console.log(f_date);

        if (data["IsActive"] == '<i class="fa fa-check"></i>'){
          isActive = '1';
        } else { 
          isActive = '0'
        }
        $('#inputActive').val(isActive);

        $("#editModal").modal();
      }, 1000);
    });
  }



  function get_report() {
    $.post("/b2e/schedules/get_report", function(data){
      var rsr_option = '<option value="">- Please Select -</option>';
      //console.log(data["data"][0]["ReportName"]);
      for (const [key, value] of Object.entries(data)) {
        //console.log('val = '+ value);
        rsr_option += '<option value="'+value['RID']+'">[ID:'+value['RID']+'] '+value['ReportName']+'</option>'; 
      }
        //$('#inputReport').html(rsr_option);
        setTimeout(function(){ set_select_input("#inputReport",rsr_option); }, 100);
        //get_email();
        $('#inputNextExec').setNow();
    });
  }

  function get_email() {
    $.post("/b2e/schedules/get_email", function(data){
      var rse_option = '<option value="">- Please Select -</option>';
      //console.log(data["data"][0]["ReportName"]);
      for (const [key, value] of Object.entries(data)) {
        //console.log(value);
        rse_option += '<option value="'+value['EID']+'">[ID:'+value['EID']+'] '+value['ToAddr']+'</option>'; 
      }
        //$('#inputEmail').html(rse_option);
        setTimeout(function(){ set_select_input("#inputEmail",rse_option); }, 100);
    });
  }

  function set_select_input(id,data) {
    $(id).html(data);
  }


  function data_refresh() {
    $('#editable').DataTable().ajax.reload();
  }

  function click_save() {
    $('#editModal').on('click', 'button#btn_save', function (e) {
      e.preventDefault();
      var sid = $("#sid").val();
      var rid = $("#inputReport").val();
      var eid = $("#inputEmail").val();

      if (rid == '' || eid == '') {
        alert('Please fill up this form.');
        return;
      }

      if (confirm("Are you sure to save this data ?") == false) {
        return;
      }

      if($('#rd_minutes').is(':checked')){
        hourly = '1';
      } else {
        hourly = '*';
      }
      if($('#rd_hours').is(':checked')){
        daily = '1';
      } else {
        daily = '*';
      }
      if($('#rd_dom').is(':checked')){
        monthly = '1';
      } else {
        monthly = '*';
      }
      if($('#rd_months').is(':checked')){
        yearly = '1';
      } else {
        yearly = '*';
      }
      if($('#rd_dow').is(':checked')){
        weekly = '1';
      } else {
        weekly = '*';
      }


      //convert datetime format
      var next_exec = moment($("#inputNextExec").val()).format('YYYY-MM-DD HH:mm:ss');
      var active = $("#inputActive").val();


      console.log($("#status").val() );
      console.log(hourly);
      console.log(daily);
      console.log(monthly);
      console.log(yearly);
      console.log(weekly);
      console.log(rid);
      console.log(eid);
      console.log(next_exec);
      console.log(active);

      if ($("#status").val() == "insert") {
        //console.log("/schedules/insert/"+hourly+"/"+daily+"/"+monthly+"/"+yearly+"/"+weekly+"/"+rid+"/"+eid+"/"+next_exec+"/"+active)   
        $.post("/b2e/schedules/insert/"+hourly+"/"+daily+"/"+monthly+"/"+yearly+"/"+weekly+"/"+rid+"/"+eid+"/"+next_exec+"/"+active, function(data){
          if(data.status == "success"){
            $('#editModal').modal('toggle');
            setTimeout(function(){ data_refresh(); }, 200);
          }
        });
      } else if ($("#status").val() == "update") {
        //console.log("/schedules/update/"+hourly+"/"+daily+"/"+monthly+"/"+yearly+"/"+weekly+"/"+rid+"/"+eid+"/"+next_exec+"/"+active)
        $.post("/b2e/schedules/update/"+sid+"/"+hourly+"/"+daily+"/"+monthly+"/"+yearly+"/"+weekly+"/"+rid+"/"+eid+"/"+next_exec+"/"+active, function(data){
          if(data.status == "success"){
            $('#editModal').modal('toggle');
            setTimeout(function(){ data_refresh(); }, 200);
          }
        });
      }
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
      var sid = data["SID"];

      $.post("/b2e/schedules/delete/"+sid, function(data){
        if(data.status == "success"){
          setTimeout(function(){ data_refresh(); }, 200);
        }
      });
    });
  }

  $.fn.setNow = function (onlyBlank) {
    var now = new Date($.now())
      , year
      , month
      , date
      , hours
      , minutes
      , seconds
      , formattedDateTime
      ;

    year = now.getFullYear();
    month = now.getMonth().toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1;
    date = now.getDate().toString().length === 1 ? '0' + (now.getDate()).toString() : now.getDate();
    hours = now.getHours().toString().length === 1 ? '0' + now.getHours().toString() : now.getHours();
    minutes = now.getMinutes().toString().length === 1 ? '0' + now.getMinutes().toString() : now.getMinutes();
    seconds = now.getSeconds().toString().length === 1 ? '0' + now.getSeconds().toString() : now.getSeconds();

    formattedDateTime = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds;

    if ( onlyBlank === true && $(this).val() ) {
      return this;
    }

    $(this).val(formattedDateTime);

    return this;
  }