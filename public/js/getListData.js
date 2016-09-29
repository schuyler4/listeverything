console.log("panda");
console.log("hello");

const form = document.querySelector('#listForm');
let data = getFormData(form)
console.log(JSON.stringify(data))

$('#listForm').submit(function(e) {
  $.ajax({

  });
});
