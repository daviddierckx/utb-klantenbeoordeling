function submitForm() {
  $(".pageButtons").attr("disabled", "true");
  const submitValues = [];
  $("input:not([type='radio']), .form-question").each((i, e) => {
    const questionId = e.id.replace('question-', "")
    submitValues.push({
      questionId: questionId,
      answer: $(e).val()
    })
  });
  radioButtonNames.forEach((val) => {
    const questionId = val.replace('question-', "")
    submitValues.push({
      questionId: questionId,
      answer: $(`input[name='${val}']:checked`).val()
    })
  })

  post("../../beoordelingsformulier/" + formName, {answers: JSON.stringify(submitValues)});
}

function post(path, params, method = 'post') {
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

const radioButtonNames = [];
$(() => {
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