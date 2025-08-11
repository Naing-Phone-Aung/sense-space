document.addEventListener("DOMContentLoaded", () => {
  // --- GET REFERENCES TO DOM ELEMENTS ---
  const form = document.getElementById("add-sensory-object-form");
  const submitButton = form.querySelector('button[type="submit"]');
  const thumbnailInput = document.getElementById("thumbnail");
  const storageUrlInput = document.getElementById("storage_url");
  const usdzInput = document.getElementById("usdz_storage_url");
  const thumbnailDropzone = document.getElementById("dropzone-content-thumbnail");
  const storageUrlDropzone = document.getElementById("dropzone-content-storage-url");
  const usdzDropzone = document.getElementById("dropzone-content-usdz-storage-url");
  const categorySelect = document.getElementById("category-select");
  const newCategoryWrapper = document.getElementById("new-category-wrapper");
  const newCategoryInput = document.getElementById("new-category-input");

  // --- CATEGORY HANDLING ---
  const populateCategories = async () => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/admin_get_categories.php`); 
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Server error');

      if (result.status === "success") {
        categorySelect.innerHTML = '<option value="" selected disabled>Select a category</option>';
        result.data.forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          categorySelect.appendChild(option);
        });
        categorySelect.innerHTML += '<option value="new_category">-- Create a new category --</option>';
      } else {
        throw new Error(result.message || "Failed to load categories.");
      }
    } catch (error) {
      categorySelect.innerHTML = "<option selected disabled>Could not load categories</option>";
      showToast(`Error loading categories: ${error.message}`, "error");
    }
  };

  categorySelect.addEventListener("change", () => {
    if (categorySelect.value === "new_category") {
      newCategoryWrapper.classList.remove("hidden");
      newCategoryInput.required = true; 
    } else {
      newCategoryWrapper.classList.add("hidden");
      newCategoryInput.required = false; 
    }
  });

  // --- UI HANDLING FOR FILE DROPZONES ---
  const updateDropzoneUI = (dropzoneElement, file) => {
    if (file) {
      dropzoneElement.innerHTML = `
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 text-green-500">
              <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
            </svg>
            <p class="font-semibold text-gray-700">File Selected:</p>
            <p class="text-sm text-gray-500">${file.name}</p>
        </div>
      `;
    }
  };
  thumbnailInput.addEventListener("change", (e) => updateDropzoneUI(thumbnailDropzone, e.target.files[0]));
  storageUrlInput.addEventListener("change", (e) => updateDropzoneUI(storageUrlDropzone, e.target.files[0]));
  usdzInput.addEventListener("change", (e) => updateDropzoneUI(usdzDropzone, e.target.files[0]));

  // --- FORM SUBMISSION ---
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = "Creating...";

    const formData = new FormData(form);

    let categoryValue = categorySelect.value;
    if (categoryValue === "new_category") {
      categoryValue = newCategoryInput.value.trim();
    }

    if (!categoryValue) {
      showToast("Please select or create a category.", "error");
      submitButton.disabled = false;
      submitButton.textContent = "Create Sensory Object";
      return;
    }

    formData.set("category", categoryValue);

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/admin_addSensoryObject.php`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // THIS IS THE CRITICAL FIX: Check if the HTTP response status is OK (2xx)
      if (!response.ok) {
        // If the server responded with an error code (4xx, 5xx), throw an error with the message from the backend.
        throw new Error(result.message || `Server responded with status: ${response.status}`);
      }

      // If we reach here, it means the response was OK and the backend confirmed success.
      showToast(result.message, "success");
      setTimeout(() => {
        window.location.href = "adminSensoryObjectListPage.html";
      }, 2000);

    } catch (error) {
      // This will now catch network errors AND server-side errors reported in the JSON.
      console.error("Submission Failed:", error);
      showToast(`Error: ${error.message}`, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Create Sensory Object";
    }
  });

  populateCategories();
});