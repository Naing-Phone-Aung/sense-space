document.addEventListener("DOMContentLoaded", () => {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift());
    }
  }

  function displayPageMessage(type, message) {
    const successEl = document.getElementById("success-message");
    const errorEl = document.getElementById("error-message");

    successEl.classList.add("hidden");
    errorEl.classList.add("hidden");

    if (type === "success") {
      successEl.textContent = message;
      successEl.classList.remove("hidden");
    } else if (type === "error") {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
    }
  }


  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `toast toast-${type}`; // Use classes for styling
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
  }

  const token = getCookie("token");
  const userInfoString = getCookie("user_info");

  if (!token || !userInfoString) {
    console.error("Authentication required. Redirecting to login.");
    showToast("You must be logged in to view this page.", "error");
    setTimeout(() => {
      window.location.href = "loginPage.html";
    }, 1500);
    return; 
  }

  let user;
  try {
    user = JSON.parse(userInfoString);
  } catch (e) {
    console.error("Failed to parse user_info cookie:", e);
    showToast("Your session data is corrupted. Please log in again.", "error");
    setTimeout(() => {
      window.location.href = "loginPage.html";
    }, 1500);
    return;
  }

  if (!user || !user.id) {
    console.error("User ID not found in cookie. Cannot proceed.");
    showToast("Invalid session data. Please log in again.", "error");
    setTimeout(() => {
      window.location.href = "loginPage.html";
    }, 1500);
    return;
  }

  const userNameDisplay = document.getElementById("user-name-display");
  const userInitialsDisplay = document.getElementById("user-initials-display");

  if (userNameDisplay && user.name) {
    userNameDisplay.textContent = `${user.name} / Change Password`;
  }
  if (userInitialsDisplay && user.name) {
    const nameParts = user.name.split(" ");
    const initials =
      (nameParts[0]?.charAt(0) || "") +
      (nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : "");
    userInitialsDisplay.textContent = initials.toUpperCase();
  }

  const passwordForm = document.getElementById("password-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", handlePasswordChange);
  } else {
    showToast("Password change form not found", "error");
  }

  async function handlePasswordChange(event) {
    event.preventDefault();

    const saveButton = document.getElementById("change-password-button");
    saveButton.disabled = true;
    saveButton.textContent = "Updating...";

    const currentPassword = document.getElementById(
      "current-password-input"
    ).value;
    const newPassword = document.getElementById("new-password-input").value;
    const confirmPassword = document.getElementById(
      "confirm-password-input"
    ).value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      displayPageMessage("error", "All password fields are required.");
      saveButton.disabled = false;
      saveButton.textContent = "Update Password";
      return;
    }

    if (newPassword !== confirmPassword) {
      displayPageMessage("error", "New passwords do not match.");
      saveButton.disabled = false;
      saveButton.textContent = "Update Password";
      return;
    }

    const API_ENDPOINT = `${CONFIG.API_BASE_URL}/change_password.php`;
    const requestBody = {
      userId: user.id,
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An unknown error occurred.");
      }
      passwordForm.reset();
      displayPageMessage(
        "success",
        "Password updated successfully! You will now be logged out."
      );
      deleteCookie("user_info");
      deleteCookie("token");
      setTimeout(() => {
        window.location.href = "loginPage.html";
      }, 1500);
    } catch (error) {
      displayPageMessage("error", error.message);
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Update Password";
    }
  }
});
