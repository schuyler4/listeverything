/*$(function () {

  $("#search").autocomplete({
      console.log("hello")
      source: function (request, response) {
         $.ajax({
            url: "/listOflists",
            type: "GET",
            data: request,
            success: function (data) {
               response($.map(data, function (el) {
                  return {
                     label: el.fullname,
                     value: el._id
                  };
                  }));
               }
            });
         },

         minLength: 3,

         focus: function (event, ui) {
            this.value = ui.item.label;
            event.preventDefault();
         },
         select: function (event, ui) {
            this.value = ui.item.label;
            $(this).next("#search").val(ui.item.value);
            event.preventDefault();
         }
  });

});*/
