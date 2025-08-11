class UserSideBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav
      class="fixed top-0 z-40 w-full bg-milk border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="w-[99%] mx-auto">
        <!-- Toast Container -->
        <div
          id="toast-container"
          class="fixed top-5 right-5 z-50 space-y-4"
        ></div>
        <div class="px-3 py-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                class="inline-flex items-center p-2 px-4 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
              <a
                href="homePage.html"
                class="text-2xl font-medium flex items-center gap-2 font-petrov-sans-regular"
              >
                <img src="/public/assets/images/brand-logo.png" class="size-8" alt="Sense Logo"/>sense
              </a>
            </div>

            <!-- Right side with Notification Bell and User Profile -->
            <div class="flex items-center gap-5">
              
              <!-- ===== START: Notification Bell Section ===== -->
              <div class="relative" id="notification-container">
                <button type="button" id="notification-bell-btn" class="relative text-ink hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="currentColor">
                    <path d="M180-204.62v-59.99h72.31v-298.47q0-80.69 49.81-142.69 49.8-62 127.88-79.31V-810q0-20.83 14.57-35.42Q459.14-860 479.95-860q20.82 0 35.43 14.58Q530-830.83 530-810v24.92q78.08 17.31 127.88 79.31 49.81 62 49.81 142.69v298.47H780v59.99H180Zm300-293.07Zm-.07 405.38q-29.85 0-51.04-21.24-21.2-21.24-21.2-51.07h144.62q0 29.93-21.26 51.12-21.26 21.19-51.12 21.19Zm-167.62-172.3h335.38v-298.47q0-69.46-49.11-118.57-49.12-49.12-118.58-49.12-69.46 0-118.58 49.12-49.11 49.11-49.11 118.57v298.47Z"/>
                  </svg>
                  <span id="notification-indicator" class="hidden absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                <div id="notification-dropdown" class="hidden absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div class="px-4 py-3 border-b border-gray-200 "><h3 class="text-lg font-medium text-ink">Notifications</h3></div>
                  <div id="announcement-list" class="max-h-96 overflow-y-auto"><p class="p-4 text-gray-500">Loading...</p></div>
                </div>
              </div>
              <!-- ===== END: Notification Bell Section ===== -->

              <div class="flex gap-3 items-center">
                <div class="text-black ring-2 ring-gray-300 rounded-full font-normal p-0.5 inline-flex text-center items-center size-11">
                  <div class="relative text-[15px] inline-flex items-center justify-center size-10 overflow-hidden bg-sky-100 rounded-full">
                    <span id="user-initials" class="font-medium text-sky-600 text-sm"></span>
                  </div>
                </div>
                <div>
                  <p id="user-name" class="font-medium text-gray-600"></p>
                  <p id="user-email" class="text-gray-500 text-sm"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <aside
      id="logo-sidebar"
      class="fixed top-0 text-ink left-0 z-20 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
      aria-label="Sidebar"
    >
        <!-- Your existing aside content goes here -->
        <div class="h-full px-3 overflow-y-auto bg-white dark:bg-gray-800">
            <a href="pricingPage.html"><div class="px-4 py-3 border-[1.5px] duration-200 bg-amber-50 border-gray-100 rounded-md"><p class="text-center font-semibold text-lg">Go <span class="text-amber-500">Pro</span></p><p class="text-ink/80 text-sm">Get 3x for better experiences</p></div></a>
            <p class="text-xs pt-5 text-gray-500 tracking-wider font-mona font-medium">MAIN</p>
            <div class="my-2"><ul class="space-y-0.5 my-3"><li><a href="workspaceDashboardPage.html" class="flex items-center p-2 px-4 text-ink rounded-lg hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /></svg><span class="ms-3 font-normal">Home</span></a></li></ul></div>
            <div class="my-2"><p class="text-xs text-gray-500 tracking-wider font-mona font-medium">TOOLS</p><ul class="space-y-0.5 my-3"><li><a href="modelLibraryPage.html" class="flex items-center p-2 px-4 text-ink rounded-lg hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" /></svg><span class="ms-3 font-normal">3D Models</span></a></li><li><a href="roomTemplateListPage.html" class="flex items-center p-2 px-4 text-ink rounded-lg hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" /><path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" /><path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" /></svg><span class="ms-3 font-normal">Room Templates</span></a></li><li><a href="aboutTutorialPage.html" class="flex items-center p-2 px-4 text-ink rounded-lg hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5"><path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" /></svg><span class="ms-3 font-normal">Learn</span></a></li></ul></div>
            <div class="my-2"><p class="text-xs text-gray-500 tracking-wider font-mona font-medium">SUPPORT</p><ul class="space-y-0.5 my-3"><li><a href="helpCenterPage.html" class="flex items-center p-2 px-4 text-ink rounded-lg hover:bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg><span class="ms-3 font-normal">Help Center</span></a></li></ul></div>
        </div>
    </aside>

    <!-- ===== START: ANNOUNCEMENT DETAIL MODAL (Initially Hidden) ===== -->
    <div id="announcement-detail-modal" class="hidden fixed inset-0 z-50 overflow-y-auto">
        <div id="announcement-modal-overlay" class="fixed inset-0 bg-black/50"></div>
        <div class="relative flex items-center justify-center min-h-screen p-4">
            <div class="relative bg-white rounded-sm shadow-xl w-full max-w-2xl">
                <div class="flex items-start justify-between p-5 ">
                    <h3 id="announcement-modal-title" class="text-2xl font-medium text-ink"></h3>
                    <button type="button" id="announcement-modal-close-btn" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-ink rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
                <div class="p-6 space-y-4">
                    <p id="announcement-modal-meta" class="text-sm text-gray-500"></p>
                    <p id="announcement-modal-content" class="text-base leading-relaxed text-gray-600 whitespace-pre-wrap"></p>
                </div>
            </div>
        </div>
    </div>
    <!-- ===== END: ANNOUNCEMENT DETAIL MODAL ===== -->
    `;
  }
}

customElements.define("user-side-bar", UserSideBar);

document.addEventListener("DOMContentLoaded", () => {
  const bellButton = document.getElementById("notification-bell-btn");
  const dropdown = document.getElementById("notification-dropdown");
  const listContainer = document.getElementById("announcement-list");
  const indicator = document.getElementById("notification-indicator");
  const notificationContainer = document.getElementById(
    "notification-container"
  );

  const detailModal = document.getElementById("announcement-detail-modal");
  const modalOverlay = document.getElementById("announcement-modal-overlay");
  const modalCloseBtn = document.getElementById("announcement-modal-close-btn");
  const modalTitle = document.getElementById("announcement-modal-title");
  const modalMeta = document.getElementById("announcement-modal-meta");
  const modalContent = document.getElementById("announcement-modal-content");

  let announcementsData = []; 

  async function fetchAnnouncements() {
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/get_announcements.php`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      if (result.status === "success") {
        announcementsData = result.data; 
        renderAnnouncements(announcementsData);
      } else {
        throw new Error(result.message || "Failed to get announcements");
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      if (listContainer) {
        listContainer.innerHTML =
          '<p class="p-4 text-red-500">Could not load announcements.</p>';
      }
    }
  }

  function renderAnnouncements(announcements) {
    if (!listContainer) return;
    listContainer.innerHTML = "";

    if (!announcements || announcements.length === 0) {
      listContainer.innerHTML =
        '<p class="p-4 text-gray-500">No new announcements.</p>';
      if (indicator) indicator.classList.add("hidden");
      return;
    }

    if (indicator) indicator.classList.remove("hidden");

    announcements.forEach((ann) => {
      const item = document.createElement("a");
      item.href = "#";
      item.className =
        "block announcement-item px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 cursor-pointer";
      item.dataset.announcementId = ann.id;

      const postDate = new Date(ann.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      item.innerHTML = `
          <p class="font-medium text-ink pointer-events-none">${ann.caption}</p>
          <p class="text-xs text-gray-500 mb-1 pointer-events-none">By ${ann.post_writer} on ${postDate}</p>
          <p class="text-gray-600 line-clamp-2 pointer-events-none">${ann.content}</p>
      `;
      listContainer.appendChild(item);
    });
  }

  function openDetailModal(announcement) {
    if (!detailModal) return;
    modalTitle.textContent = announcement.caption;
    modalContent.textContent = announcement.content;
    const postDate = new Date(announcement.created_at).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    modalMeta.textContent = `Posted by ${announcement.post_writer} on ${postDate}`;
    detailModal.classList.remove("hidden");
  }

  function closeDetailModal() {
    if (detailModal) detailModal.classList.add("hidden");
  }

  if (bellButton) {
    bellButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (dropdown) dropdown.classList.toggle("hidden");
    });
  }

  window.addEventListener("click", (event) => {
    if (dropdown && !dropdown.classList.contains("hidden")) {
      dropdown.classList.add("hidden");
    }
  });

  if (notificationContainer) {
    notificationContainer.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  if (listContainer) {
    listContainer.addEventListener("click", (event) => {
      const clickedItem = event.target.closest(".announcement-item");
      if (!clickedItem) return;

      event.preventDefault(); 
      const announcementId = clickedItem.dataset.announcementId;
      const announcementData = announcementsData.find(
        (a) => a.id == announcementId
      );

      if (announcementData) {
        openDetailModal(announcementData);
        if (dropdown) dropdown.classList.add("hidden"); 
      }
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeDetailModal);
  if (modalOverlay) modalOverlay.addEventListener("click", closeDetailModal);

  fetchAnnouncements();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop().split(";").shift());
  }

  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    const typeClasses = {
      success: "bg-green-100 border-green-400 text-green-700",
      error: "bg-red-100 border-red-400 text-red-700",
      info: "bg-blue-100 border-blue-400 text-blue-700",
    };
    toast.className = `border-l-4 p-4 ${
      typeClasses[type] || typeClasses.info
    } shadow-md rounded-md`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `<p class="font-bold">${
      type.charAt(0).toUpperCase() + type.slice(1)
    }</p><p>${message}</p>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = "opacity 0.5s ease-out";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  const tokenExists = document.cookie
    .split("; ")
    .some((row) => row.startsWith("token="));
  if (
    !tokenExists &&
    !window.location.pathname.endsWith("loginPage.html") &&
    !window.location.pathname.endsWith("homePage.html")
  ) {
    window.location.href = "loginPage.html";
  }

  const userInfoString = getCookie("user_info");
  if (userInfoString) {
    try {
      const user = JSON.parse(userInfoString);
      const userNameEl = document.querySelector("#user-name");
      const userEmailEl = document.querySelector("#user-email");
      const userInitialsEl = document.querySelector("#user-initials");
      const name = user.name || "";
      const initials = name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .slice(0, 2)
        .join("");
      if (userInitialsEl) userInitialsEl.textContent = initials;
      if (userNameEl) userNameEl.textContent = user.name || "User";
      if (userEmailEl)
        userEmailEl.textContent = user.email || "user@example.com";
    } catch (e) {
      console.error("Invalid user_info cookie:", e);
    }
  }

  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("aside a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("bg-gray-100", "dark:bg-gray-700", "font-semibold");
    }
  });
});
