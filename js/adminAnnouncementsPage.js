document.addEventListener("DOMContentLoaded", () => {
  const tableContainer = document.querySelector(".relative.overflow-x-scroll");
  const paginationContainer = document.querySelector("nav ul");
  const searchForm = document.querySelector("form");
  const searchInput = document.getElementById("default-search");
  const totalCountElement = document.getElementById("total-users");
  const createButton = document.querySelector(
    'a[href="adminCreateUserPage.html"]'
  );

  let currentPage = 1;
  let currentSearchQuery = "";
  let debounceTimer;

  function correctUI() {
    if (createButton) {
      createButton.querySelector("p").textContent = "Create New Announcement";
      createButton.removeAttribute("href");
      createButton.id = "create-announcement-btn";
      createButton.style.cursor = "pointer";
    }
    if (searchInput) {
      searchInput.placeholder = "Search by caption...";
    }
    if (tableContainer) {
      tableContainer.innerHTML = "";
    }
  }

  function showModal(announcement = null) {
    const existingModal = document.getElementById("announcement-modal");
    if (existingModal) existingModal.remove();

    const isUpdate = announcement !== null;
    const modalTitle = isUpdate
      ? "Edit Announcement"
      : "Create New Announcement";
    const announcementId = isUpdate ? announcement.id : "";
    const caption = isUpdate ? announcement.caption : "";
    const content = isUpdate ? announcement.content : "";

    const modalHTML = `
      <div id="announcement-modal">
          <div id="modal-overlay" class="fixed inset-0 bg-black/50 z-40"></div>
          <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl p-4">
              <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-xl font-semibold text-ink dark:text-white">${modalTitle}</h3>
                      <button type="button" id="modal-close-btn" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-ink rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                      </button>
                  </div>
                  <form id="announcement-form" class="p-4 md:p-5">
                      <input type="hidden" id="announcement-id" name="id" value="${announcementId}">
                      <div class="grid gap-4 mb-4">
                          <div>
                              <label for="caption" class="block mb-2 text-sm font-medium text-ink">Caption</label>
                              <input type="text" name="caption" id="caption" class="bg-gray-50 border border-gray-300 text-ink text-sm rounded-lg block w-full p-2.5" placeholder="Enter title" required value="${caption}">
                          </div>
                          <div>
                              <label for="content" class="block mb-2 text-sm font-medium text-ink">Content</label>
                              <textarea id="content" name="content" rows="6" class="block p-2.5 w-full text-sm text-ink bg-gray-50 rounded-lg border border-gray-300" placeholder="Write content..." required>${content}</textarea>
                          </div>
                      </div>
                      <button type="submit" class="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Announcement</button>
                  </form>
              </div>
          </div>
      </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    document
      .getElementById("modal-close-btn")
      .addEventListener("click", closeModal);
    document
      .getElementById("modal-overlay")
      .addEventListener("click", closeModal);
    document
      .getElementById("announcement-form")
      .addEventListener("submit", handleFormSubmit);
  }

  function closeModal() {
    const modal = document.getElementById("announcement-modal");
    if (modal) modal.remove();
  }

  async function fetchAnnouncements(page = 1, search = "") {
    tableContainer.innerHTML = `<p class="text-center p-10">Loading...</p>`;
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/get_announcements.php?q=${search}&page=${page}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      if (result.status === "success") {
        renderTable(result.data);
        renderPagination(result.pagination);
        updateTotalCount(result.pagination.total_items);
      } else {
        tableContainer.innerHTML = `<p class="text-center p-10 text-red-500">${result.message}</p>`;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      tableContainer.innerHTML = `<p class="text-center p-10 text-red-500">Failed to load data. Please try again.</p>`;
      showToast("Failed to fetch announcements.", "error");
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const isUpdate = !!data.id;
    const url = isUpdate
      ? `${CONFIG.API_BASE_URL}/update_announcement.php?id=${data.id}`
      : `${CONFIG.API_BASE_URL}/create_announcement.php`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === "success") {
        showToast(result.message, "success");
        closeModal();
        fetchAnnouncements(currentPage, currentSearchQuery);
      } else {
        showToast(result.message || "An error occurred.", "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast("Failed to save announcement.", "error");
    }
  }

  async function deleteAnnouncement(id) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/delete_announcement.php?id=${id}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.status === "success") {
        showToast("Announcement deleted successfully.", "success");
        fetchAnnouncements(currentPage, currentSearchQuery);
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete announcement.", "error");
    }
  }

  // --- HELPER FUNCTION FOR DATE FORMATTING ---
  function formatDateTime(dateString) {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options)
      .format(date)
      .replace(",", "");
  }

  // --- RENDERING ---
  function renderTable(announcements) {
    if (!announcements || announcements.length === 0) {
      tableContainer.innerHTML = `<p class="text-center p-10">No announcements found.</p>`;
      return;
    }

    const tableHTML = `
      <table class="w-full text-sm text-left text-gray-500 table-fixed">
          <thead class="text-sm font-semibold text-ink/80 uppercase bg-gray-50">
              <tr class="border-[1.5px] border-gray-200">
                  <th scope="col" class="px-6 py-3 w-6/12">Posts</th>
                  <th scope="col" class="px-6 py-3 w-2/12 text-center">Posted By</th>
                  <th scope="col" class="px-6 py-3 w-3/12">Created At</th>
                  <th scope="col" class="px-6 py-3 w-1/12 text-center">Actions</th>
              </tr>
          </thead>
          <tbody>
              ${announcements
                .map(
                  (ann) => `
                  <tr class="bg-white border-b border-gray-200">
                      <td class="px-6 py-4 text-base font-medium text-ink">
                        ${ann.caption}
                        <br>
                        <p class="text-ink/50 line-clamp-1 text-sm">${
                          ann.content
                        }</p>
                      </td>
                      <td class="px-6 py-4 text-ink text-center">${
                        ann.post_writer
                      }</td>
                      <td class="px-6 py-4 text-ink">${formatDateTime(
                        ann.created_at
                      )}</td>
                      <td class="px-6 py-4 text-center">
                          <div class="flex justify-center items-center space-x-2">
                              <button data-id="${
                                ann.id
                              }" class="edit-btn font-medium text-blue-600 hover:text-blue-800">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                  </svg>
                              </button>
                              <button data-id="${
                                ann.id
                              }" class="delete-btn font-medium text-red-600 hover:text-red-800">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                              </button>
                          </div>
                      </td>
                  </tr>
              `
                )
                .join("")}
          </tbody>
      </table>`;

    tableContainer.innerHTML = tableHTML;

    // ===== START: CORRECTED EVENT LISTENERS =====
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Use .closest() to ensure we get the button element
        const button = e.target.closest(".edit-btn");
        if (!button) return; // Safety check

        const id = button.dataset.id;
        const annData = announcements.find((a) => a.id == id);
        if (annData) {
          showModal(annData);
        }
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Use .closest() here as well for consistency and safety
        const button = e.target.closest(".delete-btn");
        if (!button) return; // Safety check

        const id = button.dataset.id;
        deleteAnnouncement(id);
      });
    });
    // ===== END: CORRECTED EVENT LISTENERS =====
  }

  function renderPagination(pagination) {
    paginationContainer.innerHTML = "";
    if (pagination.total_pages <= 1) return;

    paginationContainer.innerHTML += `<li><a href="#" data-page="${
      pagination.current_page - 1
    }" class="page-link flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 ${
      !pagination.has_prev ? "pointer-events-none opacity-50" : ""
    }">Previous</a></li>`;

    for (let i = 1; i <= pagination.total_pages; i++) {
      const isCurrent = i === pagination.current_page;
      paginationContainer.innerHTML += `<li><a href="#" data-page="${i}" class="page-link flex items-center justify-center px-4 h-10 leading-tight ${
        isCurrent
          ? "text-blue-600 border border-blue-300 bg-blue-50"
          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
      }">${i}</a></li>`;
    }

    paginationContainer.innerHTML += `<li><a href="#" data-page="${
      pagination.current_page + 1
    }" class="page-link flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 ${
      !pagination.has_next ? "pointer-events-none opacity-50" : ""
    }">Next</a></li>`;
  }

  function updateTotalCount(totalItems) {
    if (totalCountElement) {
      totalCountElement.textContent = `Total: ${totalItems} Announcements`;
    }
  }

  // --- EVENT LISTENERS ---
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    currentSearchQuery = searchInput.value;
    currentPage = 1;
    fetchAnnouncements(currentPage, currentSearchQuery);
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      currentSearchQuery = searchInput.value;
      currentPage = 1;
      fetchAnnouncements(currentPage, currentSearchQuery);
    }, 500);
  });

  paginationContainer.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target.closest(".page-link");
    if (target) {
      const page = parseInt(target.dataset.page, 10);
      if (page !== currentPage) {
        currentPage = page;
        fetchAnnouncements(currentPage, currentSearchQuery);
      }
    }
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#create-announcement-btn")) {
      showModal();
    }
  });

  correctUI();
  fetchAnnouncements();
});
