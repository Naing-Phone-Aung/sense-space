function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Format date as "DD MM YYYY HH:MM AM/PM"
function formatDate(dateString) {
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

const premiumLogo = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 fill-amber-400">
      <path d="M11.25 3v4.046a3 3 0 0 0-4.277 4.204H1.5v-6A2.25 2.25 0 0 1 3.75 3h7.5ZM12.75 3v4.011a3 3 0 0 1 4.239 4.239H22.5v-6A2.25 2.25 0 0 0 20.25 3h-7.5ZM22.5 12.75h-8.983a4.125 4.125 0 0 0 4.108 3.75.75.75 0 0 1 0 1.5 5.623 5.623 0 0 1-4.875-2.817V21h7.5a2.25 2.25 0 0 0 2.25-2.25v-6ZM11.25 21v-5.817A5.623 5.623 0 0 1 6.375 18a.75.75 0 0 1 0-1.5 4.126 4.126 0 0 0 4.108-3.75H1.5v6A2.25 2.25 0 0 0 3.75 21h7.5Z" />
      <path d="M11.085 10.354c.03.297.038.575.036.805a7.484 7.484 0 0 1-.805-.036c-.833-.084-1.677-.325-2.195-.843a1.5 1.5 0 0 1 2.122-2.12c.517.517.759 1.36.842 2.194ZM12.877 10.354c-.03.297-.038.575-.036.805.23.002.508-.006.805-.036.833-.084-1.677-.325 2.195-.843A1.5 1.5 0 0 0 13.72 8.16c-.518.518-.76 1.362-.843 2.194Z" />
    </svg>`;

const freeLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4 fill-blue-400">
  <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
</svg>
`;

function toSentenceCase(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function createUserRow(user) {
  const row = document.createElement("tr");
  row.classList.add("bg-white", "border-b", "border-gray-200", "text-ink");
  const formattedCreatedAt = formatDate(user.created_at);
  row.innerHTML = `
    <td scope="row" class="px-6 py-4 whitespace-nowrap">#${user.id}</td>
    <td scope="row" class="px-6 py-4 whitespace-nowrap">
      <div class="flex flex-col">
        <p class="text-sm">${user.username}</p>
        <p class="text-sm text-ink/50">${user.email}</p>
      </div>
    </td>
    <td class="px-6 py-4 text-nowrap">${formattedCreatedAt}</td>
    <td class="px-6 py-4">${toSentenceCase(user.role)}</td>
    <td class="px-6 py-4">
      <span class="text-sm me-2 px-2.5 py-1 rounded-xs ${
        user.status === "active"
          ? "bg-green-50 text-green-600"
          : "bg-red-100 text-red-800"
      }">${toSentenceCase(user.status)}</span>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-center gap-2 bg-gray-100 me-2 px-2.5 py-1 rounded-xs w-fit">
        ${user.subscription === "free" ? freeLogo : premiumLogo}
        ${toSentenceCase(user.subscription)}
      </div>
    </td>
    <td class="px-6 py-4">
      <div class="flex items-baseline gap-5 text-gray-700">
        <a href="adminEditUserPage.html?id=${user.id}" class="cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </a>
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

async function fetchAndInsertUsers(page = 1, searchQuery = "") {
  const token = getCookie("token");
  const userTableBody = document.getElementById("usersTableBody");
  const totalUsersElement = document.getElementById("total-users");

  userTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Loading...</td></tr>`;

  try {
    let url = `${CONFIG.API_BASE_URL}/admin_viewUsersProfile.php?page=${page}`;
    if (searchQuery) {
      url = `${
        CONFIG.API_BASE_URL
      }/admin_searchUser.php?action=search&q=${encodeURIComponent(
        searchQuery
      )}&page=${page}`;
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    userTableBody.innerHTML = "";

    if (data.users && data.users.length > 0) {
      data.users.forEach((user) =>
        userTableBody.appendChild(createUserRow(user))
      );
    } else {
      userTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500">No users found.</td></tr>`;
    }

    if (totalUsersElement && data.pagination) {
      totalUsersElement.textContent = `Total Users - ${data.pagination.total_users}`;
    }

    if (data.pagination) {
      renderPagination(data.pagination);
    } else {
      document.querySelector("nav ul").innerHTML = "";
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    userTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Error loading data.</td></tr>`;
  }
}

async function deleteUser(userId, rowElement) {
  // if (!confirm(`Are you sure you want to delete user #${userId}?`)) return;
  try {
    const token = getCookie("token");
    if (!token) {
      showToast("Authentication error.", "error");
      return;
    }
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/admin_deleteUser.php?id=${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    if (response.ok && result.status === "success") {
      showToast(result.message, "success");
      rowElement.remove();
    } else {
      throw new Error(result.message || "Failed to delete user.");
    }
  } catch (error) {
    showToast(error.message, "error");
  }
}

/**
 * THIS IS THE CORRECTED FUNCTION TO MATCH THE SCREENSHOT
 */
function renderPagination(pagination) {
  const paginationContainer = document.querySelector("nav ul");
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const { current_page, total_pages, has_prev, has_next } = pagination;

  // Do not render pagination if there is only one page
  if (total_pages <= 1) {
    return;
  }

  // Previous Button
  const prevClass = has_prev
    ? ""
    : "opacity-50 cursor-not-allowed pointer-events-none";
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<li><a href="#" data-page="${
      current_page - 1
    }" class="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${prevClass}"><span class="sr-only">Previous</span><svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/></svg></a></li>`
  );

  for (let i = 1; i <= total_pages; i++) {
    const activeClass =
      i === current_page
        ? "z-10 text-gray-500 border border-gray-300 bg-gray-100"
        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700";
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `<li><a href="#" data-page="${i}" class="flex items-center justify-center px-4 h-10 leading-tight ${activeClass}" ${
        i === current_page ? 'aria-current="page"' : ""
      }>${i}</a></li>`
    );
  }

  // Next Button
  const nextClass = has_next
    ? ""
    : "opacity-50 cursor-not-allowed pointer-events-none";
  paginationContainer.insertAdjacentHTML(
    "beforeend",
    `<li><a href="#" data-page="${
      current_page + 1
    }" class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${nextClass}"><span class="sr-only">Next</span><svg class="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg></a></li>`
  );

  addPaginationEventListeners();
}

function addPaginationEventListeners() {
  document.querySelectorAll("nav ul a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (
        link.classList.contains("cursor-not-allowed") ||
        link.hasAttribute("aria-current")
      ) {
        return; // Do nothing if the link is disabled or already active
      }
      const page = parseInt(link.dataset.page);
      if (!isNaN(page) && page > 0) {
        const searchQuery = document
          .getElementById("default-search")
          .value.trim();
        history.pushState(
          { page, q: searchQuery },
          ``,
          `${window.location.pathname}?page=${page}&q=${encodeURIComponent(
            searchQuery
          )}`
        );
        fetchAndInsertUsers(page, searchQuery);
      }
    });
  });
}

window.addEventListener("popstate", (event) => {
  const page = event.state?.page || 1;
  const searchQuery = event.state?.q || "";
  document.getElementById("default-search").value = searchQuery;
  fetchAndInsertUsers(page, searchQuery);
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("page")) || 1;
  const currentSearchQuery = urlParams.get("q") || "";

  const searchInput = document.getElementById("default-search");
  searchInput.value = currentSearchQuery;

  fetchAndInsertUsers(currentPage, currentSearchQuery);

  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = searchInput.value.trim();
      history.pushState(
        { page: 1, q: query },
        ``,
        `${window.location.pathname}?page=1&q=${encodeURIComponent(query)}`
      );
      fetchAndInsertUsers(1, query);
    }, 300);
  });

  document
    .getElementById("usersTableBody")
    .addEventListener("click", (event) => {
      const deleteButton = event.target.closest(".delete-btn");
      if (deleteButton) {
        const row = deleteButton.closest("tr");
        const userId = row
          .querySelector("td")
          .textContent.trim()
          .replace("#", "");
        if (userId) deleteUser(userId, row);
      }
    });
});
