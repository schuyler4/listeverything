$(document).ready(function() {
  $('#listButton').click(function() {
    $('#inputs').append
    ("<input type='text' name='items' class='form-control'" +
     "id='newItems'/><br>");
  });
  $('#removeListButton').click(function() {
    $('#anotherItem').remove()
  })
});
