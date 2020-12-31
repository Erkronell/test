$(document).ready(function () {
  $(".slider").bxSlider({
    mode: "fade",
    auto: true,
    pager: false,
  });
});
$(document).ready(function () {
  $(".slider2").bxSlider({
    slideWidth: 200,
    slideMargin: 15,
    minSlides: 5,
    maxSlides: 8,
    infiniteLoop: true,
    controls: false,
    pager: false,
    shrinkItems: true,
  });
});