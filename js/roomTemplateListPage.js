import { AuthManager } from "./authManager.js"; 

document.addEventListener("DOMContentLoaded", () => {
  const templatesGrid = document.getElementById("templates-grid");
  const premiumModal = document.getElementById("premium-modal");
  const cancelPremiumBtn = document.getElementById("cancel-premium-modal-btn");

  const showPremiumModal = () => premiumModal.classList.remove("hidden");
  const hidePremiumModal = () => premiumModal.classList.add("hidden");

  if (cancelPremiumBtn) {
    cancelPremiumBtn.addEventListener("click", hidePremiumModal);
  }

  const createTemplateCard = (template) => {
    const thumbnailUrl =
      template.thumbnailUrl || "/public/assets/images/livingroom.png";

    return `
      <div class="bg-white border border-gray-200  p-4 flex flex-col group cursor-pointer template-card" 
           data-template-id="${template.id}" 
           data-template-url="CreationPage.html?template_url=${encodeURIComponent(
             template.modelUrl
           )}">
          <div class="relative flex-grow pointer-events-none">
              <div class="block bg-gray-100 h-full w-full overflow-hidden">
                  <img src="${thumbnailUrl}" alt="${
      template.name
    }" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300">
              </div>
          </div>
          <div class="py-3 flex-shrink-0 pointer-events-none">
              <h3 class="font-medium text-sm text-ink truncate">${
                template.name || "Untitled Template"
              }</h3>
              <p class="text-xs text-ink/60 line-clamp-2">${
                template.description || "No description available."
              }</p>
          </div>
      </div>`;
  };

  function addTemplateClickListeners() {
    const authManager = new AuthManager();
    const cards = document.querySelectorAll(".template-card");

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (authManager.isPremium()) {
          const url = card.dataset.templateUrl;
          if (url) {
            window.location.href = url;
          }
        } else {
          showPremiumModal();
        }
      });
    });
  }

  async function loadTemplates() {
    if (!templatesGrid) return;

    templatesGrid.innerHTML = `<p class="col-span-full text-center p-10 text-gray-600">Loading templates...</p>`;

    try {
      const API_URL = `${CONFIG.API_BASE_URL}/get_room_templates.php`;
      const response = await fetch(API_URL);
      if (!response.ok)
        throw new Error("Failed to fetch templates from the server.");
      const templates = await response.json();

      if (templates.length === 0) {
        templatesGrid.innerHTML = `<p class="col-span-full text-center p-10 text-gray-600">No room templates are available at the moment.</p>`;
        return;
      }

      templatesGrid.innerHTML = "";
      templates.forEach((template) => {
        if (template.modelUrl) {
          templatesGrid.insertAdjacentHTML(
            "beforeend",
            createTemplateCard(template)
          );
        }
      });

      addTemplateClickListeners();
    } catch (error) {
      console.error("Error loading templates:", error);
      templatesGrid.innerHTML = `<div class="col-span-full bg-red-50 text-red-700 p-4 "><p>Could not load templates: ${error.message}</p></div>`;
    }
  }

  loadTemplates();
});
