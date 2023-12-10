function myFunction1() {
    console.log("Function called");
    var navbar = document.getElementById("navbar");
    var isNavbarResponsive = navbar.classList.contains("responsive");

    if (!isNavbarResponsive) {
        navbar.classList.add("responsive");
        document.addEventListener("click", closeNavbarOnClickOutside);
    } else {
        navbar.classList.remove("responsive");
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }
}

function closeNavbarOnClickOutside(event) {
    var navbar = document.getElementById("navbar");
    var icon = document.getElementById("navbarButton");

    if (!navbar.contains(event.target) && event.target !== icon) {
        navbar.className = "navbar";
        document.removeEventListener("click", closeNavbarOnClickOutside);
    }
}