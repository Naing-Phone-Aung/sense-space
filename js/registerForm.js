const togglePassword = () => {
  const pass = document.getElementById("password");
  const icon = document.getElementById("eyeIcon");
  if (pass.type === "password") {
    pass.type = "text";
    icon.className = "ph ph-eye";
  } else {
    pass.type = "password";
    icon.className = "ph ph-eye-closed";
  }
};

async function submitForm(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.innerText = "Registering...";
  submitBtn.disabled = true;

  const payload = { email, username, password };

  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.status === 201) {
      showToast("Registration successful!", "success");
      setTimeout(() => {
        window.location.href = "loginPage.html";
      }, 1500);
    } else {
      showToast(json.error, "error");
    }
  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    submitBtn.innerText = "Register";
    submitBtn.disabled = false;
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.querySelector("#togglePasswordIcon");

  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";

  toggleIcon.innerHTML = isPassword
    ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>`;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `
    toast
    flex items-center w-full max-w-xs px-4 py-2 text-sm text-gray-500 bg-white rounded-lg shadow 
    dark:text-gray-400 opacity-0 transition-opacity duration-300
  `;

  const icon =
    type === "success"
      ? `
    <div class="inline-flex items-center rounded-full justify-center w-8 h-8 text-green-500 bg-green-100">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
      </svg>
    </div>`
      : `
    <div class="inline-flex items-center rounded-full justify-center w-8 h-8 text-red-500 bg-red-100">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 102 0V7zm0 6a1 1 0 10-2 0 1 1 0 002 0z" clip-rule="evenodd"/>
      </svg>
    </div>`;

  toast.innerHTML = `
    ${icon}
    <div class="ms-3 text-base font-inter text-ink">${message}</div>
  `;

  const container = document.getElementById("toast-container");
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("opacity-100");
  });

  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 500); // Wait for fade-out to complete
  }, 4500);
}
