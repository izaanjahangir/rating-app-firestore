let form = document.getElementById("form");
let emailEl = document.getElementById("email");
let passwordEl = document.getElementById("password");
let loaderEl = document.querySelector('.loader');
let loaderText = loaderEl.querySelector('div');
let errorEl = document.querySelector('.error');
form.addEventListener("submit", e => {
  e.preventDefault();

  loaderEl.style.display = 'block';
  loaderText.innerText = 'Loggin in please wait...';
  
  auth.signInWithEmailAndPassword(emailEl.value, passwordEl.value)
    .then(data => {
      let uid = data.user.uid;
      localStorage.setItem('userUid',uid);
      console.log("User Created with id " + uid);
      window.location.assign('index.html');
    })
    .catch((err)=>{
        errorEl.innerText = err.message;
        loaderEl.style.display = 'none';        
    })
});
