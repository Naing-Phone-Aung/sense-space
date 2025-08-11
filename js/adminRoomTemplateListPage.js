function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString.replace(" ", "T"));
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options).replace(",", "");
}

function createTemplateRow(template) {
  const row = document.createElement("tr");
  row.dataset.id = template.id; // Store the ID on the row for easy access
  row.classList.add(
    "bg-white",
    "border-b",
    "dark:bg-gray-800",
    "dark:border-gray-700",
    "border-gray-200",
    "text-ink"
  );

  const formattedCreatedAt = formatDate(template.created_at);
  const modelFileName = template.storage_url
    ? template.storage_url.split("/").pop()
    : "N/A";


  row.innerHTML = `
    <td scope="row" class="px-6 py-4 whitespace-nowrap">#${template.id}</td>
    
    <td scope="row" class="px-6 py-4">
      <div class="flex flex-col">
        <p class="text-sm font-semibold">${template.name}</p>
        <p class="text-sm text-ink/60 truncate" style="max-width: 30ch;">
          ${template.description || "No description"}
        </p>
      </div>
    </td>

    <td class="px-6 py-4">
        ${
          template.thumbnail
            ? `<a href="${template.thumbnail}" target="_blank" rel="noopener noreferrer">
                <img src="${template.thumbnail}" alt="Thumbnail for ${template.name}" class="h-12 w-12 object-cover rounded-md hover:scale-110 transition-transform">
             </a>`
            : `<span class="text-xs text-gray-400">No Image</span>`
        }
    </td>

    <td class="px-6 py-4 text-sm text-ink/80" style="max-width: 200px; word-break: break-all;">
        ${
          template.storage_url
            ? `<a href="${template.storage_url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                ${modelFileName}
            </a>`
            : `<span class="text-xs text-gray-400">No File</span>`
        }
    </td>
    
    <td class="px-6 py-4 text-nowrap">
        <p class="text-ink">${formattedCreatedAt}</p>
    </td>
    
    <td class="px-6 py-4">
      <div class="flex items-center gap-5 text-gray-700">
       <button type="button" class="cursor-pointer" onclick="window.location.href='adminEditRoomTemplatePage.html?id=${
         template.id
       }'">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>
        <button type="button" class="delete-btn cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </td>
  `;
  return row;
}


async function fetchAndInsertTemplates(page = 1, searchQuery = "") {
  const templatesTableBody = document.getElementById("templatesTableBody");
  const totalTemplatesElement = document.getElementById("total-room-templates");

  templatesTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Loading templates...</td></tr>`;

  try {
    let url = `${CONFIG.API_BASE_URL}/admin_viewRoomTemplates.php?page=${page}`;
    if (searchQuery) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    templatesTableBody.innerHTML = ""; // Clear loading message

    if (result.data && result.data.length > 0) {
      result.data.forEach((template) => {
        const row = createTemplateRow(template);
        templatesTableBody.appendChild(row);
      });
    } else {
      templatesTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500">No templates found.</td></tr>`;
    }

    if (totalTemplatesElement && result.pagination) {
      totalTemplatesElement.textContent = `Total Templates - ${result.pagination.total_items}`;
    }

    if (result.pagination) {
      renderPagination(result.pagination);
    }
  } catch (error) {
    console.error("Error fetching template data:", error);
    templatesTableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Error loading data. See console for details.</td></tr>`;
  }
}


async function deleteTemplate(templateId, rowElement) {

  try {
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/admin_deleteRoomTemplate.php?id=${templateId}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok || result.status !== "success") {
      throw new Error(
        result.message || "Failed to delete template from the server."
      );
    }

    showToast(result.message, "success");
    rowElement.remove();

    const totalTemplatesElement = document.getElementById(
      "total-room-templates"
    );
    const currentTotal = parseInt(
      totalTemplatesElement.textContent.split(" - ")[1] || "0"
    );
    if (currentTotal > 0) {
      totalTemplatesElement.textContent = `Total Templates - ${
        currentTotal - 1
      }`;
    }
  } catch (error) {
    console.error("Error deleting template:", error);
    showToast(`Deletion failed: ${error.message}`, "error");
  }
}


function renderPagination(pagination) {
  const paginationContainer = document.querySelector("nav ul");
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const { current_page, total_pages, has_prev, has_next } = pagination;

  const prevClass = has_prev
    ? ""
    : "opacity-50 cursor-not-allowed pointer-events-none";
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<li><a href="#" data-page="${
      current_page - 1
    }" class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${prevClass}"><span class="sr-only">Previous</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/></svg></a></li>`
  );

  for (let i = 1; i <= total_pages; i++) {
    const activeClass =
      i === current_page
        ? "z-10 text-blue-600 border-blue-300 bg-blue-50"
        : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700";
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<li><a href="#" data-page="${i}" class="flex items-center justify-center px-4 h-10 leading-tight ${activeClass}">${i}</a></li>`
    );
  }

  const nextClass = has_next
    ? ""
    : "opacity-50 cursor-not-allowed pointer-events-none";
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<li><a href="#" data-page="${
      current_page + 1
    }" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${nextClass}"><span class="sr-only">Next</span><svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg></a></li>`
  );

  addPaginationEventListeners();
}

function addPaginationEventListeners() {
  document.querySelectorAll("nav ul a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (link.classList.contains("pointer-events-none")) return;
      const page = parseInt(link.dataset.page);
      const searchQuery =
        document.getElementById("default-search")?.value.trim() || "";
      history.pushState(
        { page, q: searchQuery },
        "",
        `${window.location.pathname}?page=${page}${
          searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""
        }`
      );
      fetchAndInsertTemplates(page, searchQuery);
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const templatesTableBody = document.getElementById("templatesTableBody");
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

  const searchInput = document.getElementById("default-search");
  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = searchInput.value.trim();
      history.pushState(
        { page: 1, q: query },
        "",
        `${window.location.pathname}?page=1${
          query ? `&q=${encodeURIComponent(query)}` : ""
        }`
      );
      fetchAndInsertTemplates(1, query);
    }, 300); // Debounce search to avoid excessive API calls
  });

  window.addEventListener("popstate", (event) => {
    const page = event.state?.page || 1;
    const searchQuery = event.state?.q || "";
    searchInput.value = searchQuery;
    fetchAndInsertTemplates(page, searchQuery);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const initialPage = parseInt(urlParams.get("page")) || 1;
  const initialSearch = urlParams.get("q") || "";
  searchInput.value = initialSearch;
  fetchAndInsertTemplates(initialPage, initialSearch);
});
