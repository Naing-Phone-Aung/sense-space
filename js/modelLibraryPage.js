document.addEventListener("DOMContentLoaded", () => {
  const categoryNav = document.getElementById("category-nav");
  const modelGrid = document.getElementById("model-grid");
  const breadcrumb = document.getElementById("breadcrumb");

  let allModelsData = [];

  const init = async () => {
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/get_models_for_app.php`
      );
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const rawData = await response.json();

      allModelsData = rawData.filter(
        (category) => category.categoryName !== "Textures"
      );

      // 3. Continue with rendering as normal
      renderCategories();
      renderModels("All");
    } catch (error) {
      console.error("Failed to fetch model data:", error);
      modelGrid.innerHTML = `<p class="col-span-full text-center text-red-500">Could not load models. Please check the connection and try again.</p>`;
    }
  };

  function renderCategories() {
    if (!categoryNav) return;
    categoryNav.innerHTML = "";

    const allButton = createCategoryButton("All");
    allButton.classList.add("bg-zinc-100", "text-ink", "font-medium");
    categoryNav.appendChild(allButton);

    allModelsData.forEach((category) => {
      const categoryButton = createCategoryButton(category.categoryName);
      categoryNav.appendChild(categoryButton);
    });
  }

  function renderModels(selectedCategory) {
    if (!modelGrid) return;
    modelGrid.innerHTML = "";

    let modelsToShow = [];
    if (selectedCategory === "All") {
      modelsToShow = allModelsData.flatMap((category) => category.models);
    } else {
      const category = allModelsData.find(
        (cat) => cat.categoryName === selectedCategory
      );
      modelsToShow = category ? category.models : [];
    }

    if (modelsToShow.length === 0) {
      modelGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No models found in this category.</p>`;
      return;
    }

    modelsToShow.forEach((model) => {
      const modelCard = createModelCard(model);
      modelGrid.appendChild(modelCard);
    });
  }

  function createCategoryButton(categoryName) {
    const button = document.createElement("button");
    button.className =
      "w-full text-left px-4 py-2 rounded-lg  text-gray-700 hover:bg-gray-100 transition-colors";
    button.textContent = categoryName;

    button.addEventListener("click", () => {
      document.querySelectorAll("#category-nav button").forEach((btn) => {
        btn.classList.remove("bg-gray-100", "text-ink");
      });
      button.classList.add("bg-gray-100", "text-ink");
      breadcrumb.textContent = `3D Model / ${categoryName}`;
      renderModels(categoryName);
    });

    return button;
  }

  function createModelCard(model) {
    const card = document.createElement("div");
    card.className =
      "group relative cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-xl transition-shadow";
    card.innerHTML = `
      <img src="${model.thumbnailUrl}" alt="${model.name}" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <p class="text-white  font-medium">${model.name}</p>
      </div>
    `;
    card.addEventListener("click", () => showDetailModal(model));
    return card;
  }

  function showDetailModal(model) {
    const existingModal = document.getElementById("detail-modal");
    if (existingModal) existingModal.remove();

    const basePath = window.location.pathname.substring(
      0,
      window.location.pathname.lastIndexOf("/")
    );
    const arViewerUrl = new URL(
      `${basePath}/ar-viewer.html`,
      window.location.origin
    );
    arViewerUrl.searchParams.set("usdz", model.usdzModelUrl);
    arViewerUrl.searchParams.set("glb", model.modelUrl);

    const modal = document.createElement("div");
    modal.id = "detail-modal";
    modal.className =
      "fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50 animate-fade-in";
    modal.innerHTML = `
      <div class="bg-white rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-slide-up">
        <div class="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-4 relative">
          <model-viewer src="${model.modelUrl}" 
                        ios-src="${model.usdzModelUrl || ""}" 
                        alt="${model.name}" 
                        camera-controls 
                        auto-rotate 
                        ar
                        shadow-intensity="1"
                        style="width: 100%; height: 400px;"></model-viewer>
        </div>
        <div class="w-full md:w-1/2 p-6 flex flex-col">
          <h3 class="text-lg font-medium mb-2 text-ink">${model.name}</h3>
          <p class="text-ink/80 text-base mb-4 flex-grow overflow-y-auto ">${
            model.description || "No description available."
          }</p>
          <div class="text-center mt-auto border-t pt-4">
            <p class="font-medium text-zinc mb-2">View AR with Mobile Devices</p>
            <div id="qrcode" class="flex justify-center items-center p-1 bg-white mx-auto w-44 h-44"></div>
            <p class="text-sm text-ink/80 mt-2">Scan this code with your phone's camera</p>
          </div>
        </div>
        
      </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    new QRCode(document.getElementById("qrcode"), {
      text: arViewerUrl.href,
      width: 160,
      height: 160,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

    const closeModal = () => {
      const modalEl = document.getElementById("detail-modal");
      if (modalEl) modalEl.remove();
      document.body.style.overflow = "auto";
    };

    modal.addEventListener("click", (e) => {
      if (e.target.id === "detail-modal") closeModal();
    });
    document
      .getElementById("close-modal-btn")
      .addEventListener("click", closeModal);
  }

  init();
});
