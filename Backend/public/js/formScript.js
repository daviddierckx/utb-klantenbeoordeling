function submitForm() {
  console.log("submit KANKER")
  $(".pageButtons").attr("disabled", "true");
}
$(() => {
  const $inputFields = $("input, .form-question");
  const maxProgress = $inputFields.length;
  const progressArray = [];
  $inputFields.on('change', (e) => {
    if (progressArray.indexOf(e.target.id) !== -1) {
      return;
    }
    progressArray.push(e.target.id);
    $(".progress-bar-progress").css({width: (progressArray.length / maxProgress * 100)});
    console.log("change: ", e.target, e.target.id);
  });
});