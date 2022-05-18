import {
    initializeApp
} from 'firebase/app';

import {
    getAuth,
    signOut
} from "firebase/auth";

import config from "./FirebaseConfig"

const app = initializeApp(config)
const auth = getAuth()

signOut(auth).then(() => {
    window.location.href = './../index.html'
}).catch((error) => {
    console.log(error)
});
