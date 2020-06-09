/* eslint disable */

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form .form');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const logoutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.querySelector('#book-tour');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(
        document.querySelector('[data-locations]').dataset.locations
    );
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        console.log(email, password);
        await login(email, password);
    });
}

if (userDataForm) {
    userDataForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.querySelector('#name').value);
        form.append('email', document.querySelector('#email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        console.log(form);
        await updateSettings('data', form);
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldPassword = document.querySelector('#password-current').value;
        const password = document.querySelector('#password').value;
        const passwordConfirm = document.querySelector('#password-confirm')
            .value;
        document.querySelector('.btn--save-password').textContent =
            'Updating...';
        await updateSettings('password', {
            oldPassword,
            password,
            passwordConfirm,
        });
        document.querySelector('#password-current').value = '';
        document.querySelector('#password').value = '';
        document.querySelector('#password-confirm').value = '';
        document.querySelector('.btn--save-password').textContent =
            'Save password';
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
    showAlert('success', alertMessage, 10);
}
