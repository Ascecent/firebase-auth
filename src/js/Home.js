import {
    getAuth,
    signOut
} from "firebase/auth";

const auth = getAuth();
signOut(auth).then(() => {
    window.location.href = './../index.html'
}).catch((error) => {
    console.log(error)
});
