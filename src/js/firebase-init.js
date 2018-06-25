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

function logout() {
  auth.signOut()
    .then(()=> {
      console.log("Sign Out");
      localStorage.removeItem('userUid');
      window.location.assign('signin.html')
    })
    .catch((err)=> {
      console.log(err);
    });
}
