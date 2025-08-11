document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const roleInputs = document.querySelectorAll('input[name="role"]');
  const statusInputs = document.querySelectorAll('input[name="status"]');
  const subscriptionInputs = document.querySelectorAll(
    'input[name="subscription"]'
  );

  const getUserIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  };

  const userId = getUserIdFromURL();
  if (!userId) {
    alert("User ID not found in URL");
    return;
  }

  let userData;
  try {
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/admin_viewUsersProfile.php?id=${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch user data");
    userData = await response.json();
  } catch (error) {
    console.error(error);
    showToast("Failed to load user data", "error");
    return;
  }

  console.log(userData);
  usernameInput.value = userData?.user.username || "";
  emailInput.value = userData?.user.email || "";

  roleInputs.forEach((input) => {
    input.checked = input.value === userData?.user.role;
  });

  statusInputs.forEach((input) => {
    input.checked = input.value === userData?.user.status;
  });

  subscriptionInputs.forEach((input) => {
    input.checked = input.value === userData?.user.subscription;
  });

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const status = document.querySelector(
      'input[name="status"]:checked'
    )?.value;
    const subscription = document.querySelector(
      'input[name="subscription"]:checked'
    )?.value;

    const updatedData = {
      id: userId,
      username,
      email,
      role,
      status,
      subscription,
    };

    console.log(updatedData);

    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_updateUser.php?id=${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error("Failed to update user");

      const result = await response.json();
      showToast("User updated successfully", "success");
      setTimeout(() => {
        window.location.href = "adminCustomerListPage.html";
      }, 1500);
    } catch (error) {
      console.error(error);
      showToast("Error updating user", "error");
    }
  });
});
