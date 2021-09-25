document.addEventListener('DOMContentLoaded', () => {

    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    if ($navbarBurgers.length > 0) {

      $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {
  
          const target = el.dataset.target;
          const $target = document.getElementById(target);

          el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
  
        });
      });
    }
  });

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  var $nav = $(".navbar");
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    $nav.css("background-color", "#1b1b1b");   
  } else {
    $nav.css("background-color", "transparent");
  }
}


if(localStorage.getItem('cookieSeen') != 'shown'){
  $(".cookie-banner").delay(2000).fadeIn();
  localStorage.setItem('cookieSeen','shown')

  setTimeout(function () {
    $(".cookie-banner").delay(8000).fadeOut();
  })
}

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

function openTabs(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
