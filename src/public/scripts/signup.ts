const signupForm = document.querySelector<HTMLFormElement>('form');

signupForm?.addEventListener('submit', submitOnlyIfMatchingPasswords);

function submitOnlyIfMatchingPasswords(e: Event): void {
    const passwords = [...document.querySelectorAll<HTMLInputElement>('.password')];
    const isMatchingPasswords = passwords.every(
        (password) => password.value === passwords[0].value
    );

    if (!isMatchingPasswords) {
        e.preventDefault();

        displayPasswordMismatchError();
    }
}
function displayPasswordMismatchError(): void {
    const existingMismatchError = document.querySelector<HTMLParagraphElement>('#mismatch-error');
    if (existingMismatchError) return;

    const error = document.createElement('p');
    error.id = 'mismatch-error';
    error.style.cssText = 'color: #fca5a5; text-align: center';
    error.textContent = 'Passwords do not match';

    const form = document.querySelector<HTMLFormElement>('form');
    form?.appendChild(error);
}
