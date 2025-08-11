document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("edit-template-form");
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  const thumbnailInput = document.getElementById("thumbnail"); // Assuming you add this to your HTML
  const storageUrlInput = document.getElementById("storage_url");

  const currentThumbnailDisplay = document.getElementById(
    "current-thumbnail-display"
  );
  const currentFileDisplay = document.getElementById("current-file-display");

  const thumbnailDropzone = document.getElementById(
    "dropzone-content-thumbnail"
  ); 
  const modelDropzone = document.getElementById("dropzone-content"); // Or a more specific ID

  const submitButton = document.getElementById("submit-button");

  
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get("id");

  if (!templateId) {
    showToast("No template ID found in URL.", "error");
    form.style.display = "none";
    return;
  }

  const populateForm = async () => {
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_viewRoomTemplates.php?id=${templateId}`
      );
      const result = await response.json();

      if (response.ok && result.data) {
        const template = result.data;
        nameInput.value = template.name;
        descriptionInput.value = template.description || "";

        if (template.thumbnail) {
          currentThumbnailDisplay.innerHTML = `
                        <p class="text-sm text-gray-600 mb-2">Current Thumbnail:</p>
                        <img src="${template.thumbnail}" alt="Current Thumbnail" class="h-24 rounded">`;
        }

        if (template.storage_url) {
          const fileName = template.storage_url.split("/").pop();
          currentFileDisplay.innerHTML = `<p class="text-sm text-gray-600">Current Model: <span class="font-medium text-gray-800">${fileName}</span></p>`;
        }
      } else {
        throw new Error(result.error || "Failed to fetch template data");
      }
    } catch (error) {
      showToast(`Failed to load data: ${error.message}`, "error");
      form.style.display = "none";
    }
  };

  const updateDropzoneUI = (dropzoneElement, file) => {
    if (file) {
      dropzoneElement.innerHTML = `
                <p class="font-semibold text-gray-700">New File Selected:</p>
                <p class="text-sm text-gray-500">${file.name}</p>`;
    }
  };
  thumbnailInput.addEventListener("change", (e) =>
    updateDropzoneUI(thumbnailDropzone, e.target.files[0])
  );
  storageUrlInput.addEventListener("change", (e) =>
    updateDropzoneUI(modelDropzone, e.target.files[0])
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = "Updating...";

    const formData = new FormData(form);

    
    if (thumbnailInput.files.length === 0) {
      formData.delete("thumbnail");
    }
    if (storageUrlInput.files.length === 0) {
      formData.delete("storage_url");
    }

    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_updateRoomTemplates.php?id=${templateId}`,
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
        throw new Error(result.message || "An unknown error occurred.");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Update Template";
    }
  });

 
  populateForm();
});
