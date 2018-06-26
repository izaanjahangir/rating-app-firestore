// Initialize Firebase
var config = {
  apiKey: "AIzaSyCogkN2O23QaN1YLQD01MISy2COFbsLoYQ",
  authDomain: "izaan-assignment3.firebaseapp.com",
  databaseURL: "https://izaan-assignment3.firebaseio.com",
  projectId: "izaan-assignment3",
  storageBucket: "izaan-assignment3.appspot.com",
  messagingSenderId: "741576388039"
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
      window.location.assign('public/signin.html')
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