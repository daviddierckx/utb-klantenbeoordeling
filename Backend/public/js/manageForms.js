function showContent(button, contentClass, contentId) {
  $(button).parent().children(".selected-content").removeClass("selected-content");
  $(button).addClass("selected-content");
  $(contentClass).stop().slideUp();
  $(contentId).stop().slideDown()
}

function addForm(el) {
  const formId = "formList-" + $(".form-list").length;
  const questionId = "question-" + formId;
  $(".form-list").append(`<div class="tab-content" id="tab-content-${formId}">
                            <label for="page-name-${formId}">Formulier verkorte-naam(voor in de URL, hier mogen geen spaties in
                              zitten)</label>
                            <input class="js-form-name" type="text" id="page-name-${formId}" value="" placeholder="Formulier naam">
                        
                            <label for="page-title-${formId}">Formulier titel</label>
                            <input class="js-form-title" type="text" id="page-title-${formId}" value="" placeholder="Formulier titel">
                        
                            <label for="page-subtitle-${formId}">Formulier sub-titel</label>
                            <input class="js-form-subtitle" type="text" id="page-subtitle-${formId}" value="" placeholder="Formulier ondertitel">
                        
                            <div class="tab-titles">
                                <div class="tab-title" onclick="addPage(this);">Nieuwe pagina</div>
                            </div>
                        
                            <div class="tab-container">
                              <div class="tab-content page-content" id="page-content-${formId}-{{pageId}}">
                                <div class="question-container">
                                  <label for="question-type-${questionId}" class="sr-only">Vraag type</label>
                                  <label for="question-label-${questionId}" class="sr-only">Vraag titel</label>
                                  <label>Vraag 1</label>
                                  <input class="js-question-label" type="text" id="question-label-${questionId}" value="" placeholder="Welke titel heeft de vraag?">
                                  <select class="js-question-type" id="question-type-${questionId}">
                                      <option value="date">Datum</option>
                                      <option value="small_text">Klein stukje tekst</option>
                                      <option value="big_text">Groot tekst vlak</option>
                                      <option value="radio">Multiple choice</option>
                                      <option value="rating">1-5 rating met sterren</option>
                                  </select>
                                </div>
                                <button type="button" onclick="addQuestion(this)">Vraag toevoegen</button>
                              </div>
                            </div>
                            <button type="button" onclick="saveForm(this)" style="float: left">Formulier opslaan</button>
                        </div>`);
  $(el).before(`<div class="tab-title" id="tab-title-${formId}" onclick="showContent(this, '.tab-content', '#tab-content-${formId}');">Nieuw formulier</div>`);
  showContent(`#tab-title-${formId}`, '.tab-content', `#tab-content-${formId}`);
}


function addPage(el) {
  const questionId = "question-c-" + $(el).parent().parent().find(".form-pages").children().length;
  $(el).parent().parent().find(".form-pages").append(`
      <div class="tab-content page-content" id="page-content-${questionId}">
        <div class="question-container">
          <label for="question-type-${questionId}" class="sr-only">Vraag type</label>
          <label for="question-label-${questionId}" class="sr-only">Vraag titel</label>
          <label>Vraag 1</label>
          <input class="js-question-label" type="text" id="question-label-${questionId}" value="" placeholder="Welke titel heeft de vraag?">
          <select class="js-question-type" id="question-type-${questionId}">
              <option value="date">Datum</option>
              <option value="small_text">Klein stukje tekst</option>
              <option value="big_text">Groot tekst vlak</option>
              <option value="radio">Multiple choice</option>
              <option value="rating">1-5 rating met sterren</option>
          </select>
        </div>
        <button type="button" onclick="addQuestion(this)">Vraag toevoegen</button>
      </div>
  `);
  $(el).before(`<div class="tab-title" id="page-title-${questionId}" onclick="showContent(this, '.page-content', '#page-content-${questionId}');">Nieuwe pagina</div>`);
  showContent(`#page-title-${questionId}`, '.page-content', `#page-content-${questionId}`);
}

function addQuestion(el) {
  const questionCount = $(el).parent().children().length;
  const questionId = "ABC-" + $(el).parent().attr('id') + questionCount;
  $(el).before(`<div class="question-container">
                    <label for="question-type-${questionId}" class="sr-only">Vraag type</label>
                    <label for="question-label-${questionId}" class="sr-only">Vraag titel</label>
                    <label>Vraag ${questionCount}</label>
                    <input class="js-question-label" type="text" id="question-label-${questionId}" value="" placeholder="Welke titel heeft de vraag?">
                    <select class="js-question-type" id="question-type-${questionId}">
                        <option value="date">Datum</option>
                        <option value="small_text">Klein stukje tekst</option>
                        <option value="big_text">Groot tekst vlak</option>
                        <option value="radio">Multiple choice</option>
                        <option value="rating">1-5 rating met sterren</option>
                    </select>
                </div>`);
}

function saveForm(el) {
  const $formElmt = $(el).parent();
  const pages = [];
  $formElmt.find(".page-content").each((_, pageElmnt) => {
    const page = [];
    $(pageElmnt).find(".question-container").each((_, questionElmnt) => {
      const $labelElmt = $(questionElmnt).find(".js-question-label");
      const questionLabel = $labelElmt.val();
      const questionType = $(questionElmnt).find(".js-question-type").val();
      page.push({
        required: true,
        type: questionType,
        id: $labelElmt.data("question-id"),
        label: questionLabel
      });
    });
    pages.push(page);
  });
  const finalForm = {
    name: $formElmt.find(".js-form-name").val(),
    title: $formElmt.find(".js-form-title").val(),
    subtitle: $formElmt.find(".js-form-subtitle").val(),
    pages: pages
  };

  // finalForm needs to be submitted
  console.log(finalForm);
  return post("../../admin/forms/update/" + finalForm.name, {data: JSON.stringify(finalForm)});
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
