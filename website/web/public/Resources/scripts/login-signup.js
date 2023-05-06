const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
// const loginedButton = document.getElementById('');
// const signedUpButton = document.getElementById('');
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

function Login() {
    const email = document.getElementById("email21").value;
    const password = document.getElementById("pswd").value;
    const body = { email, password }
    $.post(`/users/login`, body);
}
function SignUp() {
    name = document.getElementById("Name").value;
    email = document.getElementById("email2").value;
    password = document.getElementById('password').value;
    password2 = document.getElementById('password2').value;
  
    const body = {
        name, email, password, password2
    }
    $.post(`/users/register`, body);
}
