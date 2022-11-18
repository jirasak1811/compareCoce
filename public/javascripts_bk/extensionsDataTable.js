$(function () {
  var table = $("#datatable-extensions").DataTable({
    "searching": true
  });

  // https://datatables.net/reference/api/column().search()#Examples
  $('#name').on( 'keyup', function () {
    table
        .columns( 2 )
        .search( this.value )
        .draw();
  } );

  $('#example2').DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": false,
    "ordering": true,
    "info": true,
    "autoWidth": false
  });
});