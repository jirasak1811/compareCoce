$(document).ready(function () {
    $('.navbar-right')[0].style.display = 'none'
    $('#smtp')[0].style.display = 'none'
    get_data();
  });


  function get_data() {
    $('#editable').DataTable({
      "ajax": {
        "url": "/b2e/setting/email/get_all",
        "type": "POST"
      },
      "columns": [
        { "data": "EID" },
        { "data": "ToAddr" },
        { "data": "btn_edit" },
        { "data": "btn_delete" }
      ]
    });

    click_insert();
    click_delete();
    click_edit();
    click_save();
  }

  function data_refresh() {
    $('#editable').DataTable().ajax.reload();
  }

  function click_delete() {
    $('#editable').on('click', 'a.delete', function (e) {
      e.preventDefault();
      var table = $('#editable').DataTable();
      var nRow = $(this).parents('tr')[0];

      if (confirm("Are you sure to delete this data ?") == false) {
        return;
      }
      var data = table.row(nRow).data();
      //console.log(data[0]);
      $.post("/b2e/setting/email/delete/"+data["EID"], function(data){
        //console.log(nRow);
        if(data.status == "success"){
          table.row(nRow).remove().draw();
        }
      });
    });
  }

  function click_edit() { 
    $('#editable').on('click', 'a.edit', function (e) {
      e.preventDefault();
      $("#inputID").prop('disabled', true);

      var table = $('#editable').DataTable();
      var nRow = $(this).parents('tr')[0];
      var data = table.row(nRow).data();
      //console.log(this);

      $("#status").val("update");
      $("#btn_save").text("Save Change");
      $("#now_ID").val(data["EID"]);
      $("#inputID").val(data["EID"]);
      $("#inputEmail").val(data["ToAddr"]);

      $("#editModal").modal();

      //- $("#now_ID").val(data[0]);
      //- $("#inputID").val(data[0]);
      //- $("#inputEmail").val(data[1]);
      //- $("#editModal").modal();
    });
  }

  function click_save() {
    $('#editModal').on('click', 'button#btn_save', function (e) {
      e.preventDefault();
      if (confirm("Are you sure to save this data ?") == false) {
        return;
      }

      var eid = $("#inputID").val();
      var email = $("#inputEmail").val();

      if ($("#status").val() == "insert") {

        $.post("/b2e/setting/email/check_rid/"+eid, function(data){
          console.log(data);
          if( data == true ){
            $.post("/b2e/setting/email/insert/"+eid+"/"+email, function(data){
              if(data.status == "success"){
                $('#editModal').modal('toggle');
                setTimeout(function(){ data_refresh(); }, 100);
              }
            });

          } else {
            alert("Plase Check for duplicate 'Email ID' values");
          }
        });

      } else if ($("#status").val() == "update") {

        $.post("/b2e/setting/email/update/"+eid+"/"+email, function(data){
          if(data.status == "success"){
            $('#editModal').modal('toggle');
            setTimeout(function(){ data_refresh(); }, 100);
          }
        });
        
      }
    });
  }

  function click_insert() {
    $('div.btn_insert').on('click', 'a#btn_insert', function (e) {
      e.preventDefault();
      $("#status").val("insert");
      $("#btn_save").text("Add New");
      $("#now_ID").val("");
      $("#inputID").val("");
      $("#inputEmail").val("");
      $("#editModal").modal();
      $("#inputID").prop('disabled', false);
    });
  }