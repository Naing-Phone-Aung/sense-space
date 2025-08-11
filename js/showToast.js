function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `
    toast
    flex items-center w-full z-50 max-w-xs px-4 py-2 text-sm text-gray-500 bg-white rounded-lg shadow 
    dark:text-gray-400 opacity-0 transition-opacity duration-300
  `;

  const icon =
    type === "success"
      ? `
    <div class="inline-flex items-center rounded-full justify-center w-8 h-8">
      <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#60F233"><path d="m423.23-309.85 268.92-268.92L650-620.92 423.23-394.15l-114-114L267.08-466l156.15 156.15ZM480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100Z"/></svg>
    </div>`
      : `
    <div class="inline-flex items-center rounded-full justify-center w-8 h-8 text-red-500 ">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 102 0V7zm0 6a1 1 0 10-2 0 1 1 0 002 0z" clip-rule="evenodd"/>
      </svg>
    </div>`;

  toast.innerHTML = `
    ${icon}
    <div class="ms-3 text-base font-inter text-ink">${message}</div>
  `;

  let container = document.getElementById("toast-container");

  // Create the toast container if it doesn't exist
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed top-5 right-5  z-50 space-y-2";
    document.body.appendChild(container);
  }

  container.appendChild(toast);

  // Trigger fade-in
  requestAnimationFrame(() => {
    toast.classList.add("opacity-100");
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 4500);
}
