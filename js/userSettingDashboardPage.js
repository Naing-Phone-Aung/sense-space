function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getCookie("token");
  const userInfoString = getCookie("user_info");

  if (!token || !userInfoString) {
    console.error("Authentication required. Redirecting to login.");
    alert("You must be logged in to view this page.");
    window.location.href = "loginPage.html";
    return; 
  }

  let user;
  try {
    user = JSON.parse(userInfoString);
  } catch (e) {
    console.error("Failed to parse user_info cookie:", e);
    alert("Your session data is corrupted. Please log in again.");
    window.location.href = "loginPage.html";
    return;
  }

  const userId = user.id;

  if (!userId) {
    console.error("User ID not found in cookie. Cannot fetch profile.");
    window.location.href = "loginPage.html";
    return;
  }

  document.getElementById("user-id-input").value = userId;

  fetchUserProfile(userId, token);

  const settingsForm = document.getElementById("settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", handleProfileUpdate);
  }
});

async function fetchUserProfile(userId, token) {
  const API_ENDPOINT = `${CONFIG.API_BASE_URL}/admin_viewUsersProfile.php?id=${userId}`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const apiResponse = await response.json();
    const userData = apiResponse.user;
    console.log(userData);

    populatePageData(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    displayMessage(
      "error",
      "Could not load your profile. Please try refreshing the page."
    );
  }
}

function populatePageData(userData) {
  if (!userData) return;

  const name = userData.username || "";
  const email = userData.email || "";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");

  document.getElementById("user-initials-display").textContent = initials;
  document.getElementById(
    "user-name-display"
  ).textContent = `${name} / General`;

  document.getElementById("name-input").value = name;
  document.getElementById("email-input").value = email;
}

async function handleProfileUpdate(event) {
  event.preventDefault();

  const saveButton = document.getElementById("save-button");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  const userId = document.getElementById("user-id-input").value;
  const newName = document.getElementById("name-input").value;
  console.log(newName);

  const API_ENDPOINT = `${CONFIG.API_BASE_URL}/admin_updateUser.php?id=${userId}`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newName,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const updatedApiResponse = await response.json();
    const updatedUser = updatedApiResponse.user;

    displayMessage("success", "Your profile has been updated successfully!");


    const userInfoCookie = JSON.parse(getCookie("user_info"));
    userInfoCookie.name = updatedUser.username;
    document.cookie = `user_info=${JSON.stringify(userInfoCookie)}; path=/`;
  } catch (error) {
    console.error("Error updating profile:", error);
    displayMessage("error", `Failed to update profile: ${error.message}`);
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save Changes";
  }
}

function displayMessage(type, message) {
  const successEl = document.getElementById("success-message");
  const errorEl = document.getElementById("error-message");

  successEl.classList.add("hidden");
  errorEl.classList.add("hidden");

  const targetEl = type === "success" ? successEl : errorEl;
  targetEl.textContent = message;
  targetEl.classList.remove("hidden");

  setTimeout(() => {
    targetEl.classList.add("hidden");
  }, 5000);
}
