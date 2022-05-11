import "Styles"
import firebaseIcon from "Images/firebase-icon.png"
import { getInputs, initValidation, resetFormControls, checkValidityState } from "./Validation"
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import config from './FirebaseConfig'
import Swal from 'sweetalert2'
import party from "party-js";
import anime from 'animejs/lib/anime.es.js';

window.onload = function () {
    anime({
        targets: '.page-loader-svg .polymorph',
        points: [
            {
                value: [
                    '70 24 119.574 60.369 100.145 117.631 50.855 101.631 3.426 54.369',
                    '70 41 118.574 59.369 111.145 132.631 60.855 84.631 20.426 60.369']
            },
            { value: '70 6 119.574 60.369 100.145 117.631 39.855 117.631 55.426 68.369' },
            { value: '70 57 136.574 54.369 89.145 100.631 28.855 132.631 38.426 64.369' },
            { value: '70 24 119.574 60.369 100.145 117.631 50.855 101.631 3.426 54.369' }
        ],
        easing: 'easeOutQuad',
        duration: 2000,
        loop: true
    });

    setTimeout(function () {
        anime({
            targets: '.page-loader-container',
            opacity: 0,
            easing: 'easeInOutQuad',
            complete: function () {
                document.getElementById('page-loader').style.display = 'none';
            },
        });
    }, 2000)
}

const fields = {
    email: false,
    password: false
}

document.getElementById('icon').src = firebaseIcon
Object.preventExtensions(fields)
initValidation(getInputs(), fields)
const imageEmitter = document.getElementById('image-emitter')
const contentEmitter = document.getElementById('content-emitter')
const loginForm = document.getElementById('login_form')

const app = initializeApp(config);
const auth = getAuth();
let intervals = [];

loginForm.addEventListener('submit', function (e) {
    e.preventDefault()

    if (!checkValidityState(fields)) {
        Swal.fire({
            title: 'Invalid form',
            text: 'it seems that the form has been compromised, please refresh the page and try again.',
            icon: 'error',
            confirmButtonColor: '#e74c3c',
        })

        return;
    }

    const data = new FormData(this);

    signInWithEmailAndPassword(auth, data.get('email'), data.get('password'))
        .then((userCredential) => {
            let timer = 500;

            [contentEmitter, imageEmitter].forEach(emitter => {
                intervals.push(
                    setInterval(function () {
                        party.confetti(emitter, {
                            count: party.variation.range(20, 60),
                            size: party.variation.range(0.8, 1.2),
                        })
                    }, timer)
                );

                timer += 500;
            })

            Swal.fire({
                title: 'Success authentication',
                text: 'You have successfully signed in with email and password.',
                icon: 'success',
                confirmButtonText: 'Great!',
                confirmButtonColor: '#2ecc71',
                willClose: function () {
                    intervals.forEach(interval => {
                        clearInterval(interval);
                    })

                    intervals = [];
                    loginForm.reset();
                    resetFormControls(fields)
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