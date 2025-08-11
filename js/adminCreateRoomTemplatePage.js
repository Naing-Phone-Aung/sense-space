document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-template-form");
  const thumbnailInput = document.getElementById("thumbnail");
  const modelInput = document.getElementById("storage_url");
  const thumbnailDropzone = document.getElementById(
    "dropzone-content-thumbnail"
  );
  const modelDropzone = document.getElementById("dropzone-content-model");
  const submitButton = form.querySelector('button[type="submit"]');
  if (!form) {
    return;
  }

  const updateDropzoneUI = (dropzoneElement, file) => {
    if (file) {
      dropzoneElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 mb-4 text-green-500">
          <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
        </svg>
        <p class="font-semibold text-gray-700">File Selected:</p>
        <p class="text-sm text-gray-500">${file.name}</p>
      `;
    }
  };

  thumbnailInput.addEventListener("change", (e) =>
    updateDropzoneUI(thumbnailDropzone, e.target.files[0])
  );
  modelInput.addEventListener("change", (e) =>
    updateDropzoneUI(modelDropzone, e.target.files[0])
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Creating...";

    const formData = new FormData(form);

    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_addRoomTemplate.php`,
        {
          method: "POST",
         
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        showToast(result.message, "success");
       
        setTimeout(() => {
          window.location.href = "adminRoomTemplateListPage.html";
        }, 1500);
      } else {
        throw new Error(result.message || "An unknown server error occurred.");
      }
    } catch (error) {
      console.error("Error creating template:", error);
      showToast(error.message, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Create Template";
    }
  });
});
