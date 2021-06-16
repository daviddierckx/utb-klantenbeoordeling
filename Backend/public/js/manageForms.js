function showContent(button, contentClass, contentId) {
  $(button).parent().children(".selected-content").removeClass("selected-content");
  $(button).addClass("selected-content");
  $(contentClass).stop().slideUp();
  $(contentId).stop().slideDown()
}
