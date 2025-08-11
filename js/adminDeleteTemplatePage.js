async function deleteTemplate(templateId, rowElement) {
  // Show a confirmation dialog to prevent accidental deletion
  if (
    !confirm(
      `Are you sure you want to delete template #${templateId}? This action cannot be undone.`
    )
  ) {
    return; // Stop if the user clicks "Cancel"
  }

  const token = getCookie("token");
  if (!token) {
    alert("Authentication error: You are not logged in.");
    return;
  }

  const apiUrl = `${CONFIG.API_BASE_URL}/delete.php?id=${templateId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete template.");
    }

    alert(result.message);
    rowElement.remove();
  } catch (error) {
    console.error("Error deleting template:", error);
    alert(`Deletion failed: ${error.message}`); // Show error message
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const templatesTableBody = document.getElementById("templatesTableBody");

  if (templatesTableBody) {
    templatesTableBody.addEventListener("click", (event) => {
      const deleteButton = event.target.closest(".delete-btn");

      if (deleteButton) {
        const row = event.target.closest("tr");
        const templateId = row.dataset.id;

        if (templateId) {
          deleteTemplate(templateId, row);
        }
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const page = parseInt(urlParams.get("page")) || 1;
  const searchQuery = urlParams.get("q") || "";

  const searchInput = document.getElementById("default-search");
  if (searchInput) {
    if (searchQuery) searchInput.value = searchQuery;
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      history.pushState(
        { page: 1, q: query },
        ``,
        `${window.location.pathname}?page=1${
          query ? `&q=${encodeURIComponent(query)}` : ""
        }`
      );
      fetchAndInsertTemplates(1, query);
    });
  }

  fetchAndInsertTemplates(page, searchQuery);
});
