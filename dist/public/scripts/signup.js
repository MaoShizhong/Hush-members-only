"use strict";
const signupForm = document.querySelector('form');
signupForm === null || signupForm === void 0 ? void 0 : signupForm.addEventListener('submit', submitOnlyIfMatchingPasswords);
function submitOnlyIfMatchingPasswords(e) {
    const passwords = [...document.querySelectorAll('.password')];
    const isMatchingPasswords = passwords.every((password) => password.value === passwords[0].value);
    if (!isMatchingPasswords) {
        e.preventDefault();
        displayPasswordMismatchError();
    }
}
function displayPasswordMismatchError() {
    const existingMismatchError = document.querySelector('#mismatch-error');
    if (existingMismatchError)
        return;
    const error = document.createElement('p');
    error.id = 'mismatch-error';
    error.style.cssText = 'color: #fca5a5; text-align: center';
    error.textContent = 'Passwords do not match';
    const form = document.querySelector('form');
    form === null || form === void 0 ? void 0 : form.appendChild(error);
}
