document.addEventListener('DOMContentLoaded', function () {
  function changeNavbarScroll() {
    const navbarElement = document.querySelector('.navbar');
    if (navbarElement) {
      if (window.scrollY === 0) {
        navbarElement.classList.remove('navbar-scrolled');
      } else {
        navbarElement.classList.add('navbar-scrolled');
      }
    }
  }

  document.addEventListener('scroll', changeNavbarScroll);

  changeNavbarScroll();
});
