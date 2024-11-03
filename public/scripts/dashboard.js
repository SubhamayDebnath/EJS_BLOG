const addEventOnElements = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
};
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const sidebar = document.querySelector(".side-bar");
const toggleNavbar = function () {
    sidebar.classList.toggle("active");
};
addEventOnElements(navTogglers, "click", toggleNavbar);

(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()
