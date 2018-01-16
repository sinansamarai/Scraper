


// Whenever someone SAVE A Note
$(document).on("click", ".saveArticle", function() {
  // Empty the notes from the note section
  console.log("hello");
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  var data = {title: $("#title"+thisId).text(), link:$("#link"+thisId).text()};
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/articles/",
    data: data
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log("data done app.js");
      console.log(data);
      console.log(thisId);
      $("#articleRow"+thisId).remove();
    });
});

// When you click the SCRAPE button
$("#scrape").on("click", function() {

  $.ajax({
    method: "GET",
    url: "/scrape",
  })
    // With that done
    .done(function(data) {

      // Empty the notes section
      $("#articles").empty();

      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        var row = $("<div>").addClass("row");
        row.attr("id", "articleRow"+i);
        var title = $("<h4>").html(data[i].title);
        title.attr("id", "title"+i);
        var link  = $("<h4>").html(data[i].link);
        link.attr("id", "link"+i);
        var button = $("<button>").addClass("btn btn-success saveArticle").html("Save");
        button.attr("data-id",i);
        row.append(link);
        row.append(title);
        row.append(button);
        $("#articles").append(row);
        //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      }
      $("#numberArticles").html("Articles added");
      $('#scrp').modal('toggle');
    });
});
