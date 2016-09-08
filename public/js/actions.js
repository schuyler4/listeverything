$("#like").submit(function(e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: '/like',
    data: {id: $("#likeidInput").val()},
    succsess: function(id) {
     console.log("succsess");
    },
    error: function() {
     console.log("error");
    }
  });
  let text = $('#popularity').text().toString();
  let number = parseInt(text);
  $("#popularity").text(number + 1)
});

$("#dislike").submit(function(e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: '/dislike',
    data: {id: $("#dislikeidInput").val()},
    succsess: function(id) {
      console.log("succsess");
    },
    error: function() {
      console.log("error");
    }
  });
    let text = $('#popularity').text().toString();
    let number = parseInt(text);
    $("#popularity").text(number - 1)
});

$("#comment").submit(function(e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/comment",
    data: {id: $("#commentid").val(), comment: $("#thecomment").val()},
    succsess: function(id) {
      console.log("succsess");
    },
    error: function() {
      console.log("error");
    }
  });
  let text = $('#thecomment').val();
  $('#commentBox').append('<p>' + text + '</p>');
  $('#thecomment').val('');
});

$('#update').submit(function(e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/addItems",
    data: {id: $("#updateid").val(),newItems: $('#newItems').val()},
    succsess: function(id) {
      console.log("succsess");
    },
    error: function () {
      console.log("error");
    }
  });
  let item = $('#newItems').val();
  $('#mainList').append('<h2><li>' + item + '</li></h2>');
  $("#newItems").val('');
});
