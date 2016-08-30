
const typeBox = $('#typeSelector');
const numbered = $('#numbered');
const bullets = $('#bullets');
const box = $('#boxes');

$(document.body).on('change',typeBox,function (e) {
  let optVal= $("#typeSelector option:selected").val();

  if(optVal == 'numbered') {
    $($('#optionDiv').find('ul').get().reverse()).each(function() {
      $(this).replaceWith($('<ol>'+$(this).html()+'</ol>'))
    });
  }
  else {
    $($('#optionDiv').find('ol').get().reverse()).each(function() {
      $(this).replaceWith($('<ul>'+$(this).html()+'</ul>'))
    });
  }
});
