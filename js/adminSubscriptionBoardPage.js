document.addEventListener("DOMContentLoaded", () => {
  const subscriptionContainer = document.querySelector(
    ".grid.grid-cols-2 > .col-span-1"
  );

  if (!subscriptionContainer) {
    console.error("Subscription container not found on the page.");
    return;
  }

  const modalElement = document.getElementById("editFeatureModal");
  const modalForm = document.getElementById("editFeatureForm");
  const featureTextInput = document.getElementById("featureTextInput");
  const flowbiteModal = new Modal(modalElement, { backdrop: "static" });

  const openEditModal = (button) => {
    const featureRow = button.closest(".feature-row");
    const featureId = featureRow.dataset.featureId;
    const currentText = featureRow.querySelector("p").textContent;

    featureTextInput.value = currentText;
    modalForm.dataset.editingId = featureId;

    flowbiteModal.show();
  };

  modalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const featureId = modalForm.dataset.editingId;
    const newText = featureTextInput.value.trim();

    if (!newText) {
      showToast("Feature text cannot be empty.", "error");
      return;
    }

    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_updateSubscriptionPlan.php?id=${featureId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feature: newText }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to update feature.");
      }
      console.log(result);
      const originalFeatureRow = subscriptionContainer.querySelector(
        `.feature-row[data-feature-id="${featureId}"]`
      );
      if (originalFeatureRow) {
        originalFeatureRow.querySelector("p").textContent = newText;
      }

      flowbiteModal.hide();
      showToast("Feature updated successfully.", "success");
    } catch (error) {
      console.error("Error updating feature:", error);
      showToast(`Error: ${error.message}`, "error");
    }
  });

  const handleDeleteFeature = async (button) => {
    const featureRow = button.closest(".feature-row");
    const featureId = featureRow.dataset.featureId;
    const featureText = featureRow.querySelector("p").textContent;

    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_deleteSubscriptionData.php?id=${featureId}`,
        { method: "DELETE" }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete feature.");
      }

      featureRow.remove();
      if (typeof showToast === "function") {
        showToast("Feature deleted successfully.", "success");
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
      if (typeof showToast === "function") {
        showToast(`Error: ${error.message}`, "error");
      }
    }
  };

  subscriptionContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.classList.contains("delete-feature-btn")) {
      handleDeleteFeature(button);
    } else if (button.classList.contains("edit-feature-btn")) {
      openEditModal(button);
    }
  });

  const fetchAndRenderSubscriptions = async () => {
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_viewSubscriptionData.php`
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();

      if (result && result.data) {
        renderSubscriptions(result.data);
      } else {
        throw new Error("Invalid data format received from the API.");
      }
    } catch (error) {
      console.error("Failed to fetch subscription data:", error);
      subscriptionContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load subscription plans. Please try again later.</p>`;
    }
  };

  const renderSubscriptions = (subscriptions) => {
    subscriptionContainer.innerHTML = "";
    if (subscriptions.length === 0) {
      subscriptionContainer.innerHTML = `<p class="text-gray-500 text-center">No subscription plans found.</p>`;
      return;
    }
    subscriptions.forEach((plan) => {
      const cardElement = createSubscriptionCard(plan);
      subscriptionContainer.insertAdjacentHTML("beforeend", cardElement);
    });
  };

  const createSubscriptionCard = (plan) => {
    const planStyles = {
      free: {
        bg: "bg-blue-100",
        text: "text-blue-500",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-blue-500">
  <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
</svg>`,
      },
      premium: {
        bg: "bg-amber-100",
        text: "text-amber-500",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 text-amber-500">
  <path d="M11.25 3v4.046a3 3 0 0 0-4.277 4.204H1.5v-6A2.25 2.25 0 0 1 3.75 3h7.5ZM12.75 3v4.011a3 3 0 0 1 4.239 4.239H22.5v-6A2.25 2.25 0 0 0 20.25 3h-7.5ZM22.5 12.75h-8.983a4.125 4.125 0 0 0 4.108 3.75.75.75 0 0 1 0 1.5 5.623 5.623 0 0 1-4.875-2.817V21h7.5a2.25 2.25 0 0 0 2.25-2.25v-6ZM11.25 21v-5.817A5.623 5.623 0 0 1 6.375 18a.75.75 0 0 1 0-1.5 4.126 4.126 0 0 0 4.108-3.75H1.5v6A2.25 2.25 0 0 0 3.75 21h7.5Z" />
  <path d="M11.085 10.354c.03.297.038.575.036.805a7.484 7.484 0 0 1-.805-.036c-.833-.084-1.677-.325-2.195-.843a1.5 1.5 0 0 1 2.122-2.12c.517.517.759 1.36.842 2.194ZM12.877 10.354c-.03.297-.038.575-.036.805.23.002.508-.006.805-.036.833-.084 1.677-.325 2.195-.843A1.5 1.5 0 0 0 13.72 8.16c-.518.518-.76 1.362-.843 2.194Z" />
</svg>`,
      },
    };

    const style = planStyles[plan.slug] || planStyles.default;

    let priceDisplay;
    if (plan.monthly_price > 0) {
      priceDisplay = `<span class="font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-md">S$ ${Number(
        plan.monthly_price
      ).toFixed(2)}</span>`;
    } else {
      priceDisplay = `<span class="font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-md">S$ 0</span>`;
    }

    const featuresHTML = plan.features
      .map(
        (featureObj) => `
      <div class="feature-row flex justify-between items-center py-3 border-b border-zinc-300 last:border-b-0" data-feature-id="${featureObj.id}">
        <p class="text-gray-700 text-sm">${featureObj.feature}</p>
        <div class="space-x-2">
          
          <!-- FIX: Added 'edit-feature-btn' class to make the edit button work -->
          <button type="button" class="edit-feature-btn cursor-pointer" title="Edit Feature" data-feature-id="${featureObj.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-5 text-blue-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>

          <button type="button" class="delete-feature-btn cursor-pointer" title="Delete Feature" data-feature-id="${featureObj.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-5 text-red-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    `
      )
      .join("");

    return `
      <div class="bg-white border border-zinc-100 flex flex-col p-5 col-span-1 rounded-2xl shadow-xs mb-10" data-plan-id="${plan.id}">
        <div class="flex justify-between items-center mb-5">
          <div class="flex items-center space-x-4">
            <div class="${style.bg} p-1.5 rounded-lg">
               ${style.icon}
            </div>
            <div>
              <p class="font-medium font-mona text-ink">${plan.name}</p>
              <p class="text-ink/70 text-xs">${plan.description}</p>
            </div>
          </div>
          <div class="text-right font-normal">
            ${priceDisplay}
          </div>
        </div>
        ${featuresHTML}
      </div>
    `;
  };

  fetchAndRenderSubscriptions();
});
