let form = document.getElementById("form");
let usernameEl = document.getElementById("username");
let emailEl = document.getElementById("email");
let passwordEl = document.getElementById("password");
let password2El = document.getElementById("password2");
let loaderEl = document.querySelector('.loader');
let loaderText = loaderEl.querySelector('div');
let errorEl = document.querySelector('.error');

form.addEventListener("submit", e => {
  e.preventDefault();

  if (passwordEl.value !== password2El.value) {
    errorEl.innerText = `Password doesn't match`;
    return false;
  }
  loaderEl.style.display = 'block';
  loaderText.innerText = 'Creating your account please wait...';
  let userObject = {
    username: usernameEl.value,
    email: emailEl.value,
    password: passwordEl.value
  };
  
  auth.createUserWithEmailAndPassword(userObject.email, userObject.password)
    .then(data => {
      let uid = data.user.uid;
      localStorage.setItem('userUid',uid);      
      console.log("User Created with id " + uid);
      delete userObject.password;
      db.collection("users")
        .doc(uid)
        .set(userObject)
        .then(() => {
          window.location.assign("index.html");
        });
      console.log(userObject);
    })
    .catch((err)=>{
        errorEl.innerText = err.message;
        loaderEl.style.display = 'none';        
    })
});
