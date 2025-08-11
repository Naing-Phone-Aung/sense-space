document.addEventListener("DOMContentLoaded", () => {
  // --- GET REFERENCES TO DOM ELEMENTS ---
  const form = document.getElementById("edit-sensory-object-form");
  const submitButton = form.querySelector('button[type="submit"]');

  // Input elements
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  const thumbnailInput = document.getElementById("thumbnail");
  const storageUrlInput = document.getElementById("storage_url");
  const usdzInput = document.getElementById("usdz_storage_url"); // <-- ADDED

  // Dropzone display elements
  const thumbnailDropzone = document.getElementById("dropzone-content-thumbnail");
  const storageUrlDropzone = document.getElementById("dropzone-content-storage-url");
  const usdzDropzone = document.getElementById("dropzone-content-usdz-storage-url"); // <-- ADDED
  
  // Current file display elements
  const currentThumbnailDisplay = document.getElementById("current-thumbnail-display");
  const currentStorageUrlDisplay = document.getElementById("current-storage-url-display");
  const currentUsdzStorageUrlDisplay = document.getElementById("current-usdz-storage-url-display"); // <-- ADDED

  // Category elements
  const categorySelect = document.getElementById("category-select");
  const newCategoryWrapper = document.getElementById("new-category-wrapper");
  const newCategoryInput = document.getElementById("new-category-input");

  // Get Object ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const objectId = urlParams.get("id");

  if (!objectId) {
    showToast("No object ID found in URL. Cannot edit.", "error");
    form.style.display = "none";
    return;
  }

  // --- POPULATE FORM WITH EXISTING DATA ---
  const populateForm = async () => {
    try {
      const [objectResponse, categoriesResponse] = await Promise.all([
        fetch(`${CONFIG.API_BASE_URL}/admin_viewSensoryObjects.php?id=${objectId}`),
        fetch(`${CONFIG.API_BASE_URL}/admin_get_categories.php`),
      ]);

      const objectResult = await objectResponse.json();
      const categoriesResult = await categoriesResponse.json();

      // Populate categories dropdown
      if (categoriesResponse.ok && categoriesResult.status === "success") {
        categorySelect.innerHTML = "";
        categoriesResult.data.forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          categorySelect.appendChild(option);
        });
        categorySelect.innerHTML += '<option value="new_category">-- Create a new category --</option>';
      } else {
        throw new Error(categoriesResult.message || "Failed to load categories.");
      }

      // Populate form with object data
      if (objectResponse.ok && objectResult.data) {
        const object = objectResult.data;
        nameInput.value = object.name;
        descriptionInput.value = object.description || "";
        categorySelect.value = object.category;

        // Display current files
        if (object.thumbnail) {
          currentThumbnailDisplay.innerHTML = `
            <p class="text-sm text-gray-600 mb-2">Current Thumbnail:</p>
            <img src="${object.thumbnail}" alt="Current Thumbnail" class="h-24 w-auto rounded-lg shadow-md">`;
        }
        if (object.storage_url) {
          const fileName = object.storage_url.split("/").pop();
          currentStorageUrlDisplay.innerHTML = `<p class="text-sm text-gray-600 mb-2">Current Model: <span class="font-medium text-gray-800">${fileName}</span></p>`;
        }
        // <-- ADDED USDZ DISPLAY LOGIC -->
        if (object.usdz_storage_url) {
          const fileName = object.usdz_storage_url.split("/").pop();
          currentUsdzStorageUrlDisplay.innerHTML = `<p class="text-sm text-gray-600 mb-2">Current USDZ Model: <span class="font-medium text-gray-800">${fileName}</span></p>`;
        } else {
          currentUsdzStorageUrlDisplay.innerHTML = `<p class="text-sm text-gray-500 mb-2">No USDZ model uploaded.</p>`
        }
        // <-- END ADDED LOGIC -->
      } else {
        throw new Error(objectResult.error || "Failed to fetch object data");
      }
    } catch (error) {
      showToast(`Failed to load page data: ${error.message}`, "error");
      form.style.display = "none";
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-green-500">
              <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
            </svg>
            <p class="font-semibold text-gray-700">New File Selected:</p>
            <p class="text-sm text-gray-500">${file.name}</p>
        </div>
      `;
    }
  };
  
  thumbnailInput.addEventListener("change", (e) => updateDropzoneUI(thumbnailDropzone, e.target.files[0]));
  storageUrlInput.addEventListener("change", (e) => updateDropzoneUI(storageUrlDropzone, e.target.files[0]));
  usdzInput.addEventListener("change", (e) => updateDropzoneUI(usdzDropzone, e.target.files[0])); // <-- ADDED EVENT LISTENER

  // --- FORM SUBMISSION ---
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = "Saving Changes...";

    const formData = new FormData(form);

    // Handle category logic
    let categoryValue = categorySelect.value;
    if (categoryValue === "new_category") {
      categoryValue = newCategoryInput.value.trim();
    }

    if (!categoryValue) {
      showToast("Please select or create a category.", "error");
      submitButton.disabled = false;
      submitButton.textContent = "Save Changes";
      return;
    }
    formData.set("category", categoryValue);

    // If no new file is selected for an input, remove it from the form data
    // so the backend doesn't try to process an empty file.
    if (thumbnailInput.files.length === 0) {
      formData.delete("thumbnail");
    }
    if (storageUrlInput.files.length === 0) {
      formData.delete("storage_url");
    }
    // <-- ADDED USDZ FILE DELETION LOGIC -->
    if (usdzInput.files.length === 0) {
      formData.delete("usdz_storage_url");
    }
    // <-- END ADDED LOGIC -->

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/admin_updateSensoryObject.php?id=${objectId}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        showToast(result.message, "success");
        setTimeout(() => {
          window.location.href = "adminSensoryObjectListPage.html";
        }, 2000);
      } else {
        throw new Error(result.message || "An unknown error occurred.");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Save Changes";
    }
  });

  // --- INITIALIZE PAGE ---
  populateForm();
});