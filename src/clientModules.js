import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
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

  window.addEventListener('scroll', changeNavbarScroll);
}
