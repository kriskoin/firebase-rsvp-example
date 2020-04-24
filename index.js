// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRSVP');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

var rsvpListener = null;
var guestbookListener = null;

// Add Firebase project configuration object here
// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAiisW8esed77FkKsiFbyTDrqPDEXv5nZ4",
    authDomain: "demo1-715fb.firebaseapp.com",
    databaseURL: "https://demo1-715fb.firebaseio.com",
    projectId: "demo1-715fb",
    storageBucket: "demo1-715fb.appspot.com",
    messagingSenderId: "818358867874",
    appId: "1:818358867874:web:0f12ec8b1a71533f3e44fb"
  };

 firebase.initializeApp(firebaseConfig);

// FirebaseUI config
const uiConfig = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInOptions: [
    // Email / Password Provider.
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl){
      // Handle sign-in.
      // Return false to avoid redirect.
      return false;
    }
  }
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

startRsvpButton.addEventListener("click",()=>{
  if (firebase.auth().currentUser){
    firebase.auth().signOut();
  }else{
     ui.start("#firebaseui-auth-container",uiConfig);
  }
});

firebase.auth().onAuthStateChanged(
(user) =>{
      if(user){
        startRsvpButton.textContent = "LOGOUT";
        guestbookContainer.style.display="block";
        subscribeGuestbook()
      }else{
        startRsvpButton.textContent ="RSVP";
        guestbookContainer.style.display="none";
        unsubscribGestbook()
      }
});



form.addEventListener("submit", (e) => {
// Prevent the default form redirect
e.preventDefault();
// Write a new message to the database collection "guestbook"
firebase.firestore().collection("guestbook").add({
  text: input.value,
  timestamp: Date.now(),
  name: firebase.auth().currentUser.displayName,
  userId: firebase.auth().currentUser.uid
})
// clear message input field
input.value = ""; 
// Return false to avoid redirect
return false;
}); 

function subscribeGuestbook(){
  guestbookListener = firebase.firestore().collection("guestbook").orderBy("timestamp","desc")
  .onSnapshot((snaps)=>{
    guestbook.innerHTML="";
    snaps.forEach((doc)=>{
      const entry = document.createElement("p");
      entry.textContent= doc.data().name+ ": "+doc.data().text;
      guestbook.appendChild(entry);
    });
  });

}

function unsubscribGestbook(){
  if(guestbookListener != null){
    guestbookListener();
    guestbookListener=null;
  }
}