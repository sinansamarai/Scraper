
$.get("/articles", function(data) {
  // For each one
  if(data.length){

    $("#savedArticles").empty();
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      var row = $("<div>").addClass("row " + data[i]._id);
      var title = $("<h4>").attr("data-id", data[i]._id).html(data[i].title);
      var link  = $("<h4>").html(data[i].link);
      var button = $("<button>").addClass("btn btn-danger delete").html("delete");
      button.attr("data-id",data[i]._id);
      var bttn = $("<button>").addClass("btn btn-success saveNote").html("Note");
      bttn.attr("data-id",data[i]._id);
      row.append(link);
      row.append(title);
      row.append(button);
      row.append(bttn);
      $("#savedArticles").append(row);
    }
  }
  else {
    $("#savedArticles").append("<h1> No DATA </h1>");
   }
});


$(document).on("click", ".saveNote", function() {

  var thisId = $(this).attr("data-id");
  $(".notes").remove();
  $("#exampleModalLabel").attr("data-id",thisId);
  $("#exampleModalLabel").html("Note ID: " + thisId);
  $.get("/articles/"+thisId, function(data) {
    $('#myModal').modal('toggle');
    var modal = $("<div>").addClass("modal-body notes");
    var btn = $("<button>").html("delete");
    btn.addClass("btn btn-danger dbase");
    btn.attr("data-id",thisId);
    modal.html(data.note.body);
    $(".modal-content").append(modal);
    modal.append(btn);
    $('input[name="getId"]').val("");
  });
});



  $(document).on("click", "#ModalNote", function() {
    var data = {body: $('input[name="getId"]').val()};
    var thisId = $("#exampleModalLabel").attr("data-id");
    $('input[name="getId"]').val("");

  $.ajax({
    method: "POST",
    url: "/articles/"+thisId,
    data: data
  })
    // With that done, add the note information to the page
    .done(function(data) {

      console.log(data);
      console.log(data._id);
      $(".notes").remove();
      var modal = $("<div>").addClass("modal-body notes");
      var btn = $("<button>").html("delete");
      btn.addClass("btn btn-danger dbase");
      btn.attr("data-id",thisId);
      modal.html(data.body);
      $(".modal-content").append(modal);
      modal.append(btn);
    });
  });

//delete article from list
  $(document).on("click", ".delete", function() {

    var thisId = $(this).attr("data-id");
    console.log(thisId);

    $.ajax({
      method: "DELETE",
      url: "/articles/"+thisId,
    })
      .done(function(data) {
          $("."+thisId).remove();
        });
  });

// delete note from specific article
  $(document).on("click", ".dbase", function() {

    var thisId = $(this).attr("data-id");

    $.ajax({
      method: "DELETE",
      url: "/notes/"+thisId,
    })
      .done(function(data) {
          $(".notes").remove();
        });
  });
