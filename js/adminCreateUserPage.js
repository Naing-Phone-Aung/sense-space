document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const role = document.querySelector('input[name="role"]:checked').value;
    const subscription = document.querySelector('input[name="subscription"]:checked').value;

    const data = {
      username,
      email,
      password,
      role,
      subscription
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/admin_createUser.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(result.message, "success");
        form.reset();
      } else {
        showToast(result.error, "error");
      }
    } catch (error) {
      showToast("An error occurred", "error");
    }
  });
});
