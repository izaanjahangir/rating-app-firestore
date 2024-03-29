// Initialize Firebase
var config = {
  apiKey: "AIzaSyBOucyfs1zFf3k2fvGBHTysyaT5ysKsrw4",
  authDomain: "izaan-rating-app.firebaseapp.com",
  projectId: "izaan-rating-app",
  storageBucket: "izaan-rating-app.appspot.com",
  messagingSenderId: "12559725043",
  appId: "1:12559725043:web:c0c7aa712da9ffe8bc2286"
};
firebase.initializeApp(config);

let db = firebase.firestore();
let auth = firebase.auth();
let loaderEl = document.querySelector(".loader");
let loaderText = loaderEl.querySelector('div');

function logout() {
  auth.signOut()
    .then(()=> {
      console.log("Sign Out");
      localStorage.removeItem('userUid');
      
      window.location.assign('/public/signin.html') // This will only work on server
      
      // Use any of these if working locally
      // window.location.assign('public/signin.html')
      // window.location.assign('signin.html')    
    
    })
    .catch((err)=> {
      console.log(err);
    });
}

// Hide the loader from DOM
function hideLoader(){
  loaderEl.style.display = "none";
}

// Show the loader on DOM
function showLoader(){
  loaderEl.style.display = "block";
}

// Show Modal on DOM with transition
function showModal(text){
  let modalTextEl = modalEl.querySelector('p');
  modalTextEl.innerText = text;
  modalEl.style.display = 'block';
  setTimeout( () => modalEl.style.opacity = '1',100);

  // Hide Modal from DOM automatically after 3s
  setTimeout( hideModal, 3000);
}

// Hide Modal from DOM
function hideModal(){
  modalEl.style.display = 'none';
  modalEl.style.opacity = '0'
}

// Prevent user to open app if not logged in
// Prevent user to open signin or signup if logged in
if(localStorage.getItem('userUid') !== null){ 

  if(window.location.pathname === '/public/signin.html' || window.location.pathname === '/public/signup.html'){
      window.location.assign('/index.html');
  }

}else{
  
  if(window.location.pathname === '/' ||window.location.pathname === '/index.html'){
      window.location.assign('/public/signin.html');
  }  
}