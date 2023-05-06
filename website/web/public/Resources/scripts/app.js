$(document).ready(function () {
    $('#navbar').load('navbar.html');
    $('#navbar-landing').load('navbar-landing.html');
    $('#navbar-admin').load('navbar-admin.html');
    $('#footer').load('footer.html');
    $('#modals').load('modals.html');
});

function nightToggle() {
    var element = document.body;
    element.dataset.bsTheme = element.dataset.bsTheme == "light" ? "dark" : "light";
}
// fetch('/users/me')
//   .then(res => {
//     if (res.status === 401) {
//       throw new Error('Not authenticated');
//     }
    
//     return res.json();
//   })
//   .then(user => {
//     // Use user data
//   })
//   .catch(error => {
//     // Handle error
//   });