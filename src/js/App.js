import "AppStyles"

import {
    getInputs,
    initValidation,
    resetFormControls,
    checkValidityState
} from "./Validation"

import LoginImage from 'Images/login_illustration.svg'
import SignUpImage from 'Images/signup_illustration.svg'

import {
    initializeApp
} from 'firebase/app';

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup
} from "firebase/auth";

import config from './FirebaseConfig'
import Swal from 'sweetalert2'
import party from "party-js";

window.onload = function () {
    document.getElementById('overlayRightImage').src = SignUpImage
    document.getElementById('overlayLeftImage').src = LoginImage
}

const setLoginInterface = function () {
    container.classList.remove("right-panel-active")
    resetFormControls(signUpFields)
    signUpForm.reset()
}

let intervals = [];
const app = initializeApp(config),
    googleProvider = new GoogleAuthProvider(),
    facebookProvider = new FacebookAuthProvider(),
    auth = getAuth(),
    signUpButton = document.getElementById('signUp'),
    signInButton = document.getElementById('signIn'),
    container = document.getElementById('container'),
    signInForm = document.getElementById('signInForm'),
    signUpForm = document.getElementById('signUpForm'),
    googleAuthButton = document.getElementById('googleAuthButton'),
    facebookAuthButton = document.getElementById('facebookAuthButton'),
    signInFields = {
        signInEmail: false,
        signInPassword: false
    },
    signUpFields = {
        signUpEmail: false,
        signUpPassword: false
    }

Object.preventExtensions(signInFields)
Object.preventExtensions(signUpFields)

initValidation(getInputs('#signInForm .form-control input'), signInFields)

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active")
    initValidation(getInputs('#signUpForm .form-control input'), signUpFields, document.getElementById('signUpButton'))
    resetFormControls(signInFields)
    signInForm.reset()
});

signInButton.addEventListener('click', setLoginInterface);

signInForm.addEventListener('submit', function (e) {
    e.preventDefault()

    if (!checkValidityState(signInFields)) {
        Swal.fire({
            title: 'Invalid form',
            text: 'it seems that the form has been compromised, please refresh the page and try again.',
            icon: 'error',
            confirmButtonColor: '#e74c3c',
        })

        return;
    }

    const data = new FormData(this);

    signInWithEmailAndPassword(auth, data.get('signInEmail'), data.get('signInPassword'))
        .then((userCredential) => {
            Swal.fire({
                title: 'Success authentication',
                text: 'You have successfully signed in with email and password.',
                icon: 'success',
                confirmButtonText: 'Great!',
                confirmButtonColor: '#2ecc71',
                willClose: function () {
                    signInForm.reset();
                    resetFormControls(signInFields)
                }
            })
        })
        .catch((error) => {
            console.error(error.message)
            Swal.fire({
                title: 'Something went wrong',
                text: 'Something went wrong with your credentials, please try again with valid credentials.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
            })
        });
})

signUpForm.addEventListener('submit', function (e) {
    e.preventDefault()

    if (!checkValidityState(signUpFields)) {
        Swal.fire({
            title: 'Invalid form',
            text: 'it seems that the form has been compromised, please refresh the page and try again.',
            icon: 'error',
            confirmButtonColor: '#e74c3c',
        })

        return;
    }

    const data = new FormData(this);

    createUserWithEmailAndPassword(auth, data.get('signUpEmail'), data.get('signUpPassword'))
        .then((userCredential) => {
            Swal.fire({
                title: 'Success registration',
                text: 'You have successfully signed up.',
                icon: 'success',
                confirmButtonText: 'Great!',
                confirmButtonColor: '#2ecc71',
                willClose: function () {
                    setLoginInterface()
                }
            })
        })
        .catch((error) => {
            console.error(error.message)
            Swal.fire({
                title: 'Something went wrong',
                text: 'Something went wrong with your credentials, please try again with valid credentials.',
                icon: 'error',
                confirmButtonColor: '#e74c3c',
            })
        });
})

googleAuthButton.addEventListener('click', e => {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            console.log(result)

            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential.accessToken
            const user = result.user

            if (token && user) {
                Swal.fire({
                    title: 'Success Google Login',
                    text: 'You have successfully login with Google, now you will be redirected to the home page.',
                    icon: 'success',
                    confirmButtonText: 'Great!',
                    confirmButtonColor: '#2ecc71',
                    timer: 2000,
                    timerProgressBar: true,
                })

                setTimeout(() => window.location.href = './../home.html', 2000)
            }
        }).catch((error) => {
            console.log(error)
            const errorCode = error.code
            const errorMessage = error.message
            const email = error.email
            const credential = GoogleAuthProvider.credentialFromError(error)
        });
})

facebookAuthButton.addEventListener('click', e => {
    signInWithPopup(auth, facebookProvider)
        .then((result) => {
            console.log(result)

            const user = result.user
            const credential = FacebookAuthProvider.credentialFromResult(result)
            const accessToken = credential.accessToken

            if (accessToken && user) {
                Swal.fire({
                    title: 'Success Facebook Login',
                    text: 'You have successfully login with Facebook, now you will be redirected to the home page.',
                    icon: 'success',
                    confirmButtonText: 'Great!',
                    confirmButtonColor: '#2ecc71',
                    timer: 2000,
                    timerProgressBar: true,
                })

                setTimeout(() => window.location.href = './../home.html', 2000)
            }
        })
        .catch((error) => {
            console.log(error)
            const errorCode = error.code
            const errorMessage = error.message
            const email = error.email
            const credential = FacebookAuthProvider.credentialFromError(error)
        });
})
