const typeBox = $('#typeSelector');
const numbered = $('#numbered');
const bullets = $('#bullets');
const box = $('#boxes');

$(document.body).on('change',typeBox,function(e) {
  let optVal= $("#typeSelector option:selected").val();

  if(optVal == 'numbered') {
    $($('#optionDiv').find('ul').get().reverse()).each(function() {
      $(this).replaceWith($('<ol id="mainList">'
      +$(this).html()+'</ol>'));
    });
  }
  else {
    $($('#optionDiv').find('ol').get().reverse()).each(function() {
      $(this).replaceWith($('<ul id="mainList">'
      +$(this).html()+'</ul>'));
    });
  }
});

const arrangeSelector = $('#arrangeSelector');
const list = $('#mainList');
let listItems = list.children('li').get();

let changed = false;
$(document.body).on('change', arrangeSelector, function(e) {
  let optVal= $("#arrangeSelector option:selected").val();
  if(optVal == 'newest to oldest') {
    if(!changed) {
      list.children().each(function(i,li) {
        list.prepend(li);
      });
      changed = true;
    }
  }
  else if(optVal == 'oldest to newest') {
    if(changed) {
      list.children().each(function(i,li) {
        list.prepend(li);
      });
      changed = false;
    }
  }
  else if(optVal == 'alfabetical order') {
    $(function() {
      list.children().detach().sort(function(a, b) {
        return $(a).text().localeCompare($(b).text());
      }).appendTo(list);
    });
  }
});

$('div > p').each(function() {
  console.log("panda");
  $(this).insertAfter($("#commentForm"));
});
