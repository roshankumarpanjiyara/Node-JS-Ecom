
function togglePassword() {
    // const input = document.getElementById('confirmPasswordInput');
    const input = document.getElementById('passwordInput');
    const eyeIcon = document.getElementById('eyeIcon');
    if (input.type === "password") {
        input.type = "text";
        eyeIcon.innerHTML = `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>`; // eye-off
    } else {
        input.type = "password";
        eyeIcon.innerHTML = `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>`; // eye
    }
}

document.getElementById("togglePassword").addEventListener("click", togglePassword);
