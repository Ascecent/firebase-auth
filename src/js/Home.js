import {
    initializeApp
} from 'firebase/app';

import {
    getAuth,
    signOut
} from "firebase/auth";

import config from "./FirebaseConfig"

const handleSignOut = () => {
    signOut(auth).then(() => {
        window.location.href = './../index.html'
    }).catch((error) => {
        console.log(error)
    });
}

const app = initializeApp(config),
    auth = getAuth(),
    user = auth.currentUser,
    logOutButton = document.getElementById('logOutButton')

logOutButton.addEventListener('click', handleSignOut)

if (user) {
    document.getElementById('content').innerHTML = 'Welcome: ' + user;
} else {
    handleSignOut();
}
