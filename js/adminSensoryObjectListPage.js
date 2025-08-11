const categoryColors = {};

function getCategoryColor(category) {
  if (categoryColors[category]) {
    return categoryColors[category];
  }

  const hue = Math.floor(Math.random() * 360);

  const backgroundColor = `hsl(${hue}, 80%, 95%)`;
  const textColor = `hsl(${hue}, 70%, 35%)`;

  const colors = { bg: backgroundColor, text: textColor };
  categoryColors[category] = colors;
  return colors;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

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

function toSentenceCase(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createObjectRow(object) {
  const row = document.createElement("tr");
  row.dataset.id = object.id;
  row.classList.add(
    "bg-white",
    "border-b",
    "dark:bg-gray-800",
    "dark:border-gray-700",
    "border-gray-200",
    "text-ink"
  );

  const formattedCreatedAt = formatDate(object.created_at);
  const modelFileName = object.storage_url ? object.storage_url.split("/").pop() : "N/A";
  // --- ADDED: Get USDZ filename ---
  const usdzFileName = object.usdz_storage_url ? object.usdz_storage_url.split("/").pop() : "N/A";
  const colors = getCategoryColor(object.category);

  // --- MODIFIED: Added new <td> for USDZ URL ---
  row.innerHTML = `
    <td scope="row" class="px-6 py-4 whitespace-nowrap dark:text-white">
      #${object.id}
    </td>
    <td scope="row" class="px-6 py-4 dark:text-white">
      <div class="flex flex-col">
        <p class="text-sm font-semibold">${object.name}</p>
        <p class="text-sm text-ink/60 truncate" style="max-width: 25ch;">${object.description || ""}</p>
      </div>
    </td>
    <td class="px-6 py-4">
      <span class="text-sm me-2 px-2.5 py-1 rounded-xs" style="background-color: ${colors.bg}; color: ${colors.text};">
        ${toSentenceCase(object.category)}
      </span>
    </td>
    <td class="px-6 py-4">
        ${
          object.thumbnail
            ? `<a href="${object.thumbnail}" target="_blank" rel="noopener noreferrer">
                <img src="${object.thumbnail}" alt="Thumbnail for ${object.name}" class="h-12 w-12 mx-auto object-cover rounded-md hover:scale-110 transition-transform">
             </a>`
            : "<span>No Image</span>"
        }
    </td>
    <td class="px-6 py-4 text-sm text-ink/80" style="max-width: 200px; word-break: break-all;">
        ${
          object.storage_url
            ? `<a href="${object.storage_url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                ${modelFileName}
            </a>`
            : "<span>No File</span>"
        }
    </td>
    <!-- ADDED USDZ FILE CELL -->
    <td class="px-6 py-4 text-sm text-ink/80" style="max-width: 200px; word-break: break-all;">
        ${
          object.usdz_storage_url
            ? `<a href="${object.usdz_storage_url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                ${usdzFileName}
            </a>`
            : "<span>No File</span>"
        }
    </td>
    <td class="px-6 py-4 text-nowrap">
        <div class="flex flex-col">
            <p class=" text-ink">${formattedCreatedAt}</p>
        </div>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-baseline gap-5 text-gray-700">
        <button type="button" class="cursor-pointer" onclick="window.location.href='adminEditSensoryObjectPage.html?id=${object.id}'">
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

function updateObjectsInformation(info) {
  const totalCountElement = document.getElementById("totalObjectsCount");
  const categoryStatsContainer = document.getElementById("categoryStatsContainer");

  if (totalCountElement) {
    totalCountElement.textContent = info.total_objects || 0;
  }

  if (categoryStatsContainer) {
    categoryStatsContainer.innerHTML = "";
    if (info.categories && Object.keys(info.categories).length > 0) {
      for (const [category, count] of Object.entries(info.categories)) {
        const statElement = document.createElement("div");
        statElement.className = "flex justify-between items-center text-sm";
        statElement.innerHTML = `
          <span class="text-gray-600">${toSentenceCase(category)}</span>
          <span class="font-semibold text-gray-800">${count}</span>
        `;
        categoryStatsContainer.appendChild(statElement);
      }
    } else {
      categoryStatsContainer.innerHTML = '<p class="text-sm text-gray-500">No categories found.</p>';
    }
  }
}

async function fetchAndInsertObjects(page = 1, searchQuery = "") {
  const token = getCookie("token");
  const objectsTableBody = document.getElementById("objectsTableBody");
  const totalObjectsElement = document.getElementById("total-sensory-objects");

  if (!token) {
    console.error("Authorization token not found in cookies.");
    // --- MODIFIED: colspan is now 8 ---
    objectsTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-red-500">Authentication Error: Please log in.</td></tr>`;
    return;
  }

  try {
    let url = `${CONFIG.API_BASE_URL}/admin_viewSensoryObjects.php?page=${page}`;
    if (searchQuery) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    objectsTableBody.innerHTML = "";

    if (result.data && result.data.length > 0) {
      result.data.forEach((object) => {
        const row = createObjectRow(object);
        objectsTableBody.appendChild(row);
      });
    } else {
      // --- MODIFIED: colspan is now 8 ---
      objectsTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-gray-500">No objects found.</td></tr>`;
    }

    if (totalObjectsElement && result.pagination) {
      totalObjectsElement.textContent = `Total Objects - ${result.pagination.total_items}`;
    }

    if (result.pagination) {
      renderPagination(result.pagination);
    }

    if (result.information) {
      updateObjectsInformation(result.information);
    }
  } catch (error) {
    console.error("Error fetching object data:", error);
    // --- MODIFIED: colspan is now 8 ---
    objectsTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-red-500">Error loading data. Please check the console.</td></tr>`;
  }
}

async function deleteObject(objectId, rowElement) {
  const apiUrl = `${CONFIG.API_BASE_URL}/admin_deleteSensoryObject.php?id=${objectId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete object from the server.");
    }

    showToast(result.message, "success");
    rowElement.remove();

    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    const searchQuery = urlParams.get("q") || "";
    fetchAndInsertObjects(page, searchQuery);
  } catch (error) {
    console.error("Error deleting object:", error);
    showToast(`Deletion failed: ${error.message}`, "error");
  }
}

function renderPagination(pagination) {
  const paginationContainer = document.querySelector(".mt-10 ul");
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const { current_page, total_pages, has_prev, has_next } = pagination;

  const prevClass = has_prev ? "" : "opacity-50 cursor-not-allowed pointer-events-none";
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<li><a href="#" data-page="${current_page - 1}" class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${prevClass}"><span class="sr-only">Previous</span><svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/></svg></a></li>`
  );

  for (let i = 1; i <= total_pages; i++) {
    const activeClass = i === current_page ? "z-10 text-gray-500 border border-gray-300 bg-gray-100" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700";
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<li><a href="#" data-page="${i}" class="flex items-center justify-center px-4 h-10 leading-tight ${activeClass}" ${i === current_page ? 'aria-current="page"' : ""}>${i}</a></li>`
    );
  }

  const nextClass = has_next ? "" : "opacity-50 cursor-not-allowed pointer-events-none";
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<li><a href="#" data-page="${current_page + 1}" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${nextClass}"><span class="sr-only">Next</span><svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg></a></li>`
  );

  addPaginationEventListeners();
}

function addPaginationEventListeners() {
  document.querySelectorAll(".mt-10 ul a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (link.classList.contains("pointer-events-none")) return;
      const page = parseInt(link.dataset.page);
      const searchQuery = document.getElementById("default-search")?.value.trim() || "";
      history.pushState({ page, q: searchQuery }, ``, `${window.location.pathname}?page=${page}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`);
      fetchAndInsertObjects(page, searchQuery);
    });
  });
}

window.addEventListener("popstate", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const page = parseInt(urlParams.get("page")) || 1;
  const searchQuery = urlParams.get("q") || "";
  fetchAndInsertObjects(page, searchQuery);
});

document.addEventListener("DOMContentLoaded", () => {
  const objectsTableBody = document.getElementById("objectsTableBody");
  if (objectsTableBody) {
    objectsTableBody.addEventListener("click", (event) => {
      const deleteButton = event.target.closest(".delete-btn");
      if (deleteButton) {
        const row = event.target.closest("tr");
        const objectId = row.dataset.id;
        if (objectId) {
          // You might want to add a confirmation dialog here
          if (confirm(`Are you sure you want to delete object #${objectId}?`)) {
             deleteObject(objectId, row);
          }
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
      history.pushState({ page: 1, q: query }, ``, `${window.location.pathname}?page=1${query ? `&q=${encodeURIComponent(query)}` : ""}`);
      fetchAndInsertObjects(1, query);
    });
  }

  fetchAndInsertObjects(page, searchQuery);
});