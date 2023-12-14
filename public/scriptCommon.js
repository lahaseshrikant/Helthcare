function myFunction1() {
  var navbar = document.getElementById("navbar");
  var isNavbarResponsive = navbar.classList.contains("responsive");
  toggleMenu(isNavbarResponsive);
}

function toggleMenu(isNavbarResponsive) {
  var navbar = document.getElementById("navbar");

  if (!isNavbarResponsive) {
    navbar.classList.add("responsive");
    document.addEventListener("click", closeNavbarOnClickOutside);
  } else {
    navbar.classList.remove("responsive");
    document.removeEventListener("click", closeNavbarOnClickOutside);
  }

  checkLoginStatus();
}

function closeNavbarOnClickOutside(event) {
  var navbar = document.getElementById("navbar");
  var icon = document.getElementById("navbarButton");

  if (!navbar.contains(event.target) && event.target !== icon) {
    navbar.className = "navbar";
    document.removeEventListener("click", closeNavbarOnClickOutside);
  }
}