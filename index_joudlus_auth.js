import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase, onChildAdded, remove, ref, orderByChild, child, push, set, onValue, query } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "---------------------------------------",
  authDomain: "---------------------------------------",
  databaseURL: "---------------------------------------",
  projectId: "---------------------------------------",
  storageBucket: "---------------------------------------",
  messagingSenderId: "---------------------------------------",
  appId: "---------------------------------------",
  measurementId: "---------------------------------------"
};
const app = initializeApp(firebaseConfig);
const username = prompt("Sisesta oma nimi");
const db=getDatabase();

// Sisselogimine
const provider = new GoogleAuthProvider();
const auth = getAuth();
window.lahku = function(){
  signOut(auth)
};
window.sisene = function(){
  signInWithPopup(auth, provider)
};


signInWithPopup(auth, provider)
.then((result) => {
  // The signed-in user info.
  const user = result.user;
  // ...
  console.log(result.user)
}).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  //...
});


signOut(auth).then(() => {
// Sign-out successful.
}).catch((error) => {
// An error happened.
});


onAuthStateChanged(auth, (user) => {
if (user) {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/firebase.User
  kiht1.innerHTML = "Sisse logitud: "+user.displayName+"<br /><input type='button' value = 'lahku' onclick = 'lahku()' />"

  const uid = user.uid;
  // ...
} else {
  kiht1.innerHTML = "Välja logitud"+"<input type='button' value = 'sisene' onclick = 'sisene()' />"
  // User is signed out
  // ...
}
});



document.getElementById("test-form").addEventListener("submit", performaceSensitiveFunc);
let arvuKasv = 1;
let time = 0
function performaceSensitiveFunc(a) {
  a.preventDefault();

  let start = 5000;

  // Joudluse katsetamise jaoks andmete kogumine
  const joudlusInput = document.getElementById("test-n-times");
  const nKorda = joudlusInput.value;
  
  // Teeb kohad andmebaasis vabaks
  remove(ref(db, "joudlus/"));

  console.log(String(nKorda) + " proovi teha")
  setTimeout(() => {
    const topUserPostsRef = query(ref(db, 'joudlus/' + String(nKorda)), orderByChild('username'))
    onValue(topUserPostsRef, (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        time = Date.now() - start
        if (time < 1000) {
          console.log(data);
          console.log(String(time) + " ms");
        }
      }
    });
    
    // Pool sekundit pausi (et kõik eelnev saaks eemaldatud õigeks ajaks) ning siis lisab sõnumid
    setTimeout(() => {
      start = Date.now();
      for (let times2 = 0; times2 <= (nKorda-1); times2++) {
        set(ref(db, "joudlus/" + arvuKasv), {
          username: `joudluseTest${String(arvuKasv)}`,
          message: `joudluseTest${String(arvuKasv)}`,
      });
        arvuKasv++;
      };
    }, 500);

    arvuKasv = 1;

    }, 2000);
};

document.getElementById("message-form").addEventListener("submit", sendMessage);

function sendMessage(e) {
  e.preventDefault();

  // Sõnumi jaoks andmete kogumine
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // Sõnumi "kast" tühjaks
  messageInput.value = "";

  // Kerib automaatselt lehe lõppu
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // Lisab sõnumi andmebaasi
  set(ref(db, "messages/" + timestamp), {
    username: username,
    message: message
  });

};

const fetchChat = ref(db, "messages");
onChildAdded(fetchChat, function (snapshot) {
  const messages = snapshot.val();
  const message = `<li class=${
    username === messages.username ? "sent" : "receive"
  }><span>${messages.username}: </span>${messages.message}</li>`;
  // kuva sõnum rakenduses
  document.getElementById("messages").innerHTML += message;
});
