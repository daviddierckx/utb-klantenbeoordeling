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
                                  <label><span class="question-question">Vraag 1</span><span class="move-question-up"><i
                                            class="fa fa-arrow-up"></i></span><span class="move-question-down"><i
                                            class="fa fa-arrow-down"></i></span></label>
                                  <input class="js-question-label" type="text" id="question-label-${questionId}" value="" placeholder="Welke titel heeft de vraag?">
                                  <select class="js-question-type" id="question-type-${questionId}">
                                      <option value="date">Datum</option>
                                      <option value="small_text">Klein stukje tekst</option>
                                      <option value="big_text">Groot tekst vlak</option>
                                      <option value="radio">Multiple choice</option>
                                      <option value="rating">1-5 rating met sterren</option>
                                  </select>
                                </div>
                                <button type="button" class="btn" onclick="addQuestion(this)">Vraag toevoegen</button>
                              </div>
                            </div>
                            <button type="button" class="btn" onclick="saveForm(this)" style="float: left">Formulier opslaan</button>
                        </div>`);
  $(el).before(`<div class="tab-title" id="tab-title-${formId}" onclick="showContent(this, '.tab-content', '#tab-content-${formId}');">Nieuw formulier</div>`);
  showContent(`#tab-title-${formId}`, '.tab-content', `#tab-content-${formId}`);
  setEventHandlers();
}


function addPage(el) {
  const questionId = "question-c-" + $(el).parent().parent().find(".form-pages").children().length;
  $(el).parent().parent().find(".form-pages").append(`
      <div class="tab-content page-content" id="page-content-${questionId}">
        <div class="question-container">
          <label for="question-type-${questionId}" class="sr-only">Vraag type</label>
          <label for="question-label-${questionId}" class="sr-only">Vraag titel</label>
          <label><span class="question-question">Vraag 1</span><span class="move-question-up"><i
                          class="fa fa-arrow-up"></i></span><span class="move-question-down"><i
                          class="fa fa-arrow-down"></i></span></label>
          <input class="js-question-label" type="text" id="question-label-${questionId}" value="" placeholder="Welke titel heeft de vraag?">
          <select class="js-question-type" id="question-type-${questionId}">
              <option value="date">Datum</option>
              <option value="small_text">Klein stukje tekst</option>
              <option value="big_text">Groot tekst vlak</option>
              <option value="radio">Multiple choice</option>
              <option value="rating">1-5 rating met sterren</option>
          </select>
        </div>
        <button type="button" class="btn" onclick="addQuestion(this)">Vraag toevoegen</button>
      </div>
  `);
  $(el).before(`<div class="tab-title" id="page-title-${questionId}" onclick="showContent(this, '.page-content', '#page-content-${questionId}');">Nieuwe pagina</div>`);
  showContent(`#page-title-${questionId}`, '.page-content', `#page-content-${questionId}`);
  setEventHandlers();
}

function addQuestion(el) {
  const questionCount = $(el).parent().children().length;
  const questionId = "ABC-" + $(el).parent().attr('id') + questionCount;
  $(el).before(`<div class="question-container">
                    <label for="question-type-${questionId}" class="sr-only">Vraag type</label>
                    <label for="question-label-${questionId}" class="sr-only">Vraag titel</label>
                    <label><span class="question-question">Vraag ${questionCount}</span><span class="move-question-up"><i
                                            class="fa fa-arrow-up"></i></span><span class="move-question-down"><i
                                            class="fa fa-arrow-down"></i></span></label>
                    <input class="js-question-label" type="text" id="question-label-${questionId}" value="" placeholder="Welke titel heeft de vraag?">
                    <select class="js-question-type" id="question-type-${questionId}">
                        <option value="date">Datum</option>
                        <option value="small_text">Klein stukje tekst</option>
                        <option value="big_text">Groot tekst vlak</option>
                        <option value="radio">Multiple choice</option>
                        <option value="rating">1-5 rating met sterren</option>
                    </select>
                </div>`);
  setEventHandlers();
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
      let options = undefined;
      if (questionType === "radio") {
        options = $(questionElmnt).find(".js-question-options").val().split(',');
      }
      page.push({
        required: true,
        type: questionType,
        id: $labelElmt.data("question-id"),
        label: questionLabel,
        options: options
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
  const existingForm = $formElmt.find(".js-form-name").data('existing') ?? false

  // finalForm needs to be submitted
  console.log(finalForm);
  if (existingForm) {
    return post("../../admin/forms/update/" + finalForm.name, {data: JSON.stringify(finalForm)});
  } else {
    return post("../../admin/forms/create/" + finalForm.name, {data: JSON.stringify(finalForm)});
  }
}

function fixQuestionIndexes() {
  $(".page-content").children().each((index, elmt) => {
    $(elmt).find(".question-question").text(`Vraag ${$(elmt).index() + 1}`);
  });
}

function setEventHandlers() {
  $(".js-question-type:not(.has-handlers)").addClass("has-handlers").on('change', (event) => {
    const $elmnt = $(event.target);
    const $radioInput = $elmnt.parent().find(".js-question-options");
    const hasRadioInput = $radioInput.length >= 1
    if (!hasRadioInput && $elmnt.val() === "radio") {
      $elmnt.parent().append(`<label for="question-options-${$elmnt.data('question-id')}">Welke opties heeft deze vraag?(onderscheidend met een ,)</label>
                              <input class="js-question-options" style="width: 100%;" data-question-id="${$elmnt.data('question-id')}" type="text"
                                     id="question-options-${$elmnt.data('question-id')}"
                                     value="" placeholder="Welke opties heeft de vraag?(onderscheidend met een ,)">`)
    } else if (hasRadioInput && $elmnt.val() !== "radio") {
      $radioInput.prev().remove();
      $radioInput.remove();
    }
  });

  $(".move-question-up:not(.has-handlers)").addClass("has-handlers").on('click', (event) => {
    $elmnt = $(event.target).parent().parent().parent();
    $target = $elmnt.prev();
    $target.insertAfter($elmnt);
    $elmnt.stop().fadeOut().fadeIn();
    $target.stop().fadeOut().fadeIn();
    fixQuestionIndexes();
  });

  $(".move-question-down:not(.has-handlers)").addClass("has-handlers").on('click', (event) => {
    $elmnt = $(event.target).parent().parent().parent();
    $target = $elmnt.next();
    if ($elmnt.index() < $elmnt.parent().children.length) {
      $target.insertBefore($elmnt);
      $target.stop().fadeOut().fadeIn();
    }
    $elmnt.stop().fadeOut().fadeIn();
    fixQuestionIndexes();
  });
}

$(setEventHandlers);

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


// Get the modal
var modal = document.getElementById("infoModal");

// Get the button that opens the modal
var btn = document.getElementById("infoModalButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}