$("#modeSwitcher").change(function (e) {
  //if checked than change to dark mode
  if ($(this).prop("checked") == true) {
    $("html").attr("data-theme", "dark");
  } else {
    $("html").attr("data-theme", "light");
  }
});
