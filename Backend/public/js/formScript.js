function submitForm() {
  console.log("submit KANKER")
  $(".pageButtons").attr("disabled", "true");
}

$(() => {
  const radioButtonNames = [];
  $("input[type='radio']").each((i, e) => {
    if (radioButtonNames.indexOf(e.name ?? e.id) !== -1) {
      return;
    }
    radioButtonNames.push(e.name ?? e.id);
  });

  const maxProgress = $(".form-question").length + $("input:not([type='radio'])").length + radioButtonNames.length;
  const progressArray = [];
  $('textarea').bind('input propertychange', function () {
    $(this).change();
  });
  $("input, .form-question").on('change', (e) => {
    if (progressArray.indexOf(e.target.name ?? e.target.id) !== -1) {
      return;
    }
    progressArray.push(e.target.name ?? e.target.id);
    $(".progress-bar-progress").css({width: (progressArray.length / maxProgress * 100) + "%"});
  });
});