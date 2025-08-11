class SideBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <nav
      class="fixed top-0 z-40 w-full bg-milk border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="w-[99%] mx-auto">
      <!-- Toast Container -->
    <div id="toast-container" class="fixed top-5 right-5 z-50 space-y-4"></div>
        <div class="px-3 py-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                class="inline-flex items-center p-2 px-4 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span class="sr-only">Open sidebar</span>
                <svg
                  class="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a
                href="homePage.html"
                class="text-2xl font-medium flex items-center gap-2 font-petrov-sans-regular"
              >
                <img
                  src="/public/assets/images/brand-logo.png"
                  class="size-8"
                  alt=""
                />sense</a
              >
            </div>
            <div class="flex gap-3 items-center">
              <div
                class="text-black ring-2 ring-gray-300 rounded-full font-normal p-0.5 inline-flex text-center items-center size-11"
              >
                <div
                  class="relative text-[15px] inline-flex items-center justify-center size-10 overflow-hidden bg-sky-100 rounded-full dark:bg-gray-600"
                >
                  <span
                    id="admin-user-initials"
                    class="font-medium text-sky-600 text-sm dark:text-gray-300"
                  ></span>
                </div>
              </div>
              <div>
                <p id="admin-name" class="font-medium text-gray-600"></p>
                <p id="admin-email" class="text-gray-500 text-sm"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <aside
      id="logo-sidebar"
      class="fixed top-0 text-ink left-0 z-20 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <!-- general -->
      <div class="h-full px-3 overflow-y-auto bg-white dark:bg-gray-800">
        <div class="my-2">
          <p class="text-xs text-gray-500 tracking-wider font-mona font-medium">
            GENERAL
          </p>
          <ul class="space-y-0.5 my-3">
            <li>
              <a
                href="adminDashboardPage.html"
                class="flex items-center p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"
                  />
                  <path
                    d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"
                  />
                </svg>

                <span class="ms-3 font-normal">Dashboard</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- template -->
        <div class="my-2">
          <p class="text-xs text-gray-500 tracking-wider font-mona font-medium">
            TOOLS
          </p>
          <ul class="space-y-0.5 my-3">
            <li>
              <a
                href="adminRoomTemplateListPage.html"
                class="flex items-center p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z"
                  />
                  <path
                    d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z"
                  />
                  <path
                    d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z"
                  />
                </svg>
                <span class="ms-3 font-normal">Room Templates</span>
              </a>
            </li>
            <li>
              <a
                href="adminSensoryObjectListPage.html"
                class="flex items-center p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    d="M10.362 1.093a.75.75 0 0 0-.724 0L2.523 5.018 10 9.143l7.477-4.125-7.115-3.925ZM18 6.443l-7.25 4v8.25l6.862-3.786A.75.75 0 0 0 18 14.25V6.443ZM9.25 18.693v-8.25l-7.25-4v7.807a.75.75 0 0 0 .388.657l6.862 3.786Z"
                  />
                </svg>

                <span class="ms-3 font-normal">Sensory Objects</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- customers -->
        <div class="my-2">
          <p class="text-xs text-gray-500 tracking-wider font-mona font-medium">
            CUSTOMERS
          </p>
          <ul class="space-y-0.5 my-3">
            <li>
              <a
                href="adminCustomerListPage.html"
                class="flex items-center p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z"
                  />
                </svg>

                <span class="ms-3 font-normal">Customer List</span>
              </a>
            </li>
            <li>
              <a
                href="adminSubscriptionBoardPage.html"
                class="flex items-center p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z"
                  />
                </svg>
                <span class="ms-3 font-normal">Subscriptions</span>
              </a>
            </li>
            <li>
              <a
                href="adminAnnouncementsPage.html"
                class="flex items-center p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 0 0 1.28.53l3.58-3.579a.78.78 0 0 1 .527-.224 41.202 41.202 0 0 0 5.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0 0 10 2Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clip-rule="evenodd"
                  />
                </svg>

                <div class="flex items-center justify-between w-full">
                  <span class="ms-4 font-normal">Announcements</span>
                 
                </div>
              </a>
            </li>
          </ul>
        </div>

        <!-- support -->
        <div class="my-2">
          <p class="text-xs text-gray-500 tracking-wider font-mona font-medium">
            SUPPORT
          </p>
          <ul class="space-y-0.5 my-3">
            
            <li>
              <button
              
                id="admin-logout-button"
                class="flex items-center w-full text-red-600 p-2 px-4 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  class="size-5 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                  />
                </svg>
                <span class="ms-3 font-normal">Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
    `;
  }
}

customElements.define("side-bar", SideBar);

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
}

function deleteCookie(name) {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

window.addEventListener("DOMContentLoaded", () => {
  const tokenExists = document.cookie
    .split("; ")
    .some((row) => row.startsWith("token="));

  const afterLoginUI = document.getElementById("afterLoginUI");
  const beforeLoginUI = document.getElementById("beforeLoginUI");

  if (tokenExists) {
    if (afterLoginUI) afterLoginUI.classList.remove("hidden");
    if (beforeLoginUI) beforeLoginUI.classList.add("hidden");
  } else {
    if (afterLoginUI) afterLoginUI.classList.add("hidden");
    if (beforeLoginUI) beforeLoginUI.classList.remove("hidden");
  }
});

const userInfoString = getCookie("user_info");
if (userInfoString) {
  try {
    const user = JSON.parse(userInfoString);
    const userNameEl = document.querySelector("#admin-name");
    const userEmailEl = document.querySelector("#admin-email");
    const userPlanEl = document.querySelector("#admin-plan");

    const name = user.name || "";
    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join("");
    document.querySelector("#admin-user-initials").textContent = initials;

    if (userNameEl) userNameEl.textContent = user.name || "Name";
    if (userEmailEl) userEmailEl.textContent = user.email || "Email";
    if (userPlanEl) userPlanEl.textContent = user.plan || "Basic Plan";
  } catch (e) {
    console.error("Invalid user_info cookie:", e);
  }
}

const logoutBtn = document.querySelector("#admin-logout-button");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    deleteCookie("user_info");
    deleteCookie("token");
    showToast("Logout successful!", "success");
    setTimeout(() => {
      window.location.href = "homePage.html";
    }, 1500);
  });
}

const current = window.location.pathname.split("/").pop();
document.querySelectorAll("aside a").forEach((link) => {
  if (link.getAttribute("href") === current) {
    link.classList.add("bg-gray-100", "dark:bg-gray-700");
  }
});
