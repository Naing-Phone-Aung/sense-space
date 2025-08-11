class NavBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<div class="w-full font-inter bg-white z-30 shadow-gray-200 shadow-2xs sticky top-0">
  <nav class="w-[90%] mx-auto py-2.5">
    <div class="flex justify-between items-center">
      <a href="homePage.html" class="text-2xl font-medium flex items-center gap-2 font-petrov-sans-regular"
        > <img src="../public/assets/images/brand-logo.png" class="size-8" alt="" />sense</a
      >

      <!-- MOBILE MENU BUTTON -->
      <button
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none"
      >
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      <div class="hidden md:flex items-center">
        <!-- about menu -->
        <div>
          <button
            id="aboutDropdownHoverButton"
            data-dropdown-toggle="dropdownHover"
            data-dropdown-trigger="hover"
            class="text-ink focus:outline-none hover:text-blue-500 font-normal rounded-lg text-[15px] px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            About
            <svg
              class="w-2.5 h-2.5 ms-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdownHover"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
          >
            <ul
              class="py-2 text-sm text-ink dark:text-gray-200"
              aria-labelledby="aboutDropdownHoverButton"
            >
              <li>
                <a
                  href="aboutIntroductionPage.html"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Introduction</a
                >
              </li>
              <li>
                <a
                  href="aboutTutorialPage.html"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Tutorial</a
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- my space menu -->
        <div>
          <button
            id="mySpaceDropdownHoverButton"
            data-dropdown-toggle="dropdownHoverMySpace"
            data-dropdown-trigger="hover"
            class="text-ink focus:outline-none hover:text-blue-500 font-normal rounded-lg text-[15px] px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            My Space
            <svg
              class="w-2.5 h-2.5 ms-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdownHoverMySpace"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700"
          >
            <ul
              class="py-2 text-sm text-ink dark:text-gray-200"
              aria-labelledby="mySpaceDropdownHoverButton"
            >
              <li>
                <a
                  href="CreationPage.html"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >Create Space</a
                >
              </li>       
              <li>
                <a
                  href="modelLibraryPage.html"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >3D Models</a
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- pricing menu  -->
        <div class="px-5 py-2.5">
          <a href="pricingPage.html" class="text-[15px] font-normal hover:text-blue-500"
            >Pricing</a
          >
        </div>

        <!-- help center menu  -->
        <div class="px-5 py-2.5">
          <a
            href="helpCenterPage.html"
            class="text-[15px] font-normal hover:text-blue-500"
            >Help Center</a
          >
        </div>
      </div>

      <div class="flex items-center">
        <div id="afterLoginUI" class="flex items-center space-x-4">
          <!-- user account menu  -->
          <div>
            <button
              id="myAccountDropdownHoverButton"
              data-dropdown-toggle="dropdownHoverMyAccount"
              data-dropdown-trigger="hover"
              class="text-ink ring-2 ring-gray-300 rounded-full focus:outline-none hover:text-amber-500 font-normal p-0.5 text-[15px] text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              <div
                class="relative inline-flex items-center justify-center size-9 overflow-hidden bg-amber-100 rounded-full dark:bg-gray-600"
              >
                <span
                  id="user-initials"
                  class="font-medium text-amber-500 text-sm dark:text-gray-300"
                ></span>
              </div>
            </button>
            <div
              id="dropdownHoverMyAccount"
              class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg border-gray-500 w-4xs dark:bg-gray-700"
            >
              <ul
                class="py-2 text-[15px] text-ink dark:text-gray-200"
                aria-labelledby="myAccountDropdownHoverButton"
              >
                <li class="px-4 py-2 ">
                  <p id="user-name" class="font-normal"></p>
                  <p id="user-email"></p>
                </li>

                <li id="user-plan" class="px-4 py-2   ">
                 <p id="plan-name"></p>
                </li>
                <a href="userSettingDashboardPage.html"><li  class="px-4 py-2 hover:bg-gray-100">Settings</li></a>
                <li
                  id="logout-button"
                  class="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                >
                  Log out
                </li>
              </ul>
            </div>
          </div>
          <!-- project button  -->
          <div>
            <a
              href="workspaceDashboardPage.html"
              class="flex px-5 rounded-full py-2 border border-blue-200 text-blue-500  transition-colors text-[15px] font-semibold hover:bg-blue-500 hover:text-white duration-200 gap-2.5 items-center"
            >
              <p class="">Workspace</p>
            </a>
          </div>
          
        </div>
      </div>

      <!-- User Area (Update JS logic for login state) -->
      <div id="beforeLoginUI" class="flex items-center space-x-2">
        <!-- Default: Not logged in -->
        <a href="loginPage.html" class="px-5 py-2  hover:text-blue-600 hover:underline duration-300 font-normal text-[15px] rounded-md">Log in</a>
        <a
          href="registerPage.html"
          class="px-5 py-2 bg-ink hover:shadow-sm font-normal  text-white text-[15px] rounded-md"
          >Start for Free</a
        >
      </div>
    </div>
  </nav>
</div>

    `;
  }
}
customElements.define("nav-bar", NavBar);

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
    const userNameEl = document.querySelector("#user-name");
    const userEmailEl = document.querySelector("#user-email");
    const userPlanEl = document.querySelector("#user-plan");

    const name = user.name || "";
    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join("");
    document.querySelector("#user-initials").textContent = initials;

    if (userNameEl) userNameEl.textContent = user.name || "Name";
    if (userEmailEl) userEmailEl.textContent = user.email || "Email";
    if (userPlanEl)
      userPlanEl.textContent =
        user.subscription === "free" ? "Free Plan" : "Premium Plan";
    if (user.subscription === "free") {
      userPlanEl.classList.add("text-blue-500", "bg-blue-50");
    } else {
      userPlanEl.classList.add("text-amber-500", "bg-amber-50");
    }
  } catch (e) {
    console.error("Invalid user_info cookie:", e);
  }
}

const logoutBtn = document.querySelector("#logout-button");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    deleteCookie("user_info");
    deleteCookie("token");
    window.location.href = "homePage.html";
  });
}
