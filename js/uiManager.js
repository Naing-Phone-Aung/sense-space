import * as THREE from "three";
import {
  TransformCommand,
  ChangeColorCommand,
  SetLockCommand,
  ChangeLightColorCommand,
} from "./command.js";
import { CONFIG } from "./config.js";

export class UIManager {
  constructor(app) {
    this.app = app;
    this.isDragging = false;
    this.modelManifestData = null;
    this.activeObjectForInspector = null; // the currentlu selected obj
    this.inspectorTransformCache = null; // temp backup of obj state for undo
    this.currentCategoryIndex = null; // track which model category is open
    this.dom = {
      // hold refereence from html element
      musicDropdownToggle: document.getElementById("music-dropdown-toggle"),
      musicControlsContainer: document.getElementById(
        "music-controls-container"
      ),
      musicArrowIcon: document.getElementById("music-arrow-icon"),
      toolsDropdownToggle: document.getElementById("tools-dropdown-toggle"),
      toolsControlsContainer: document.getElementById(
        "tools-controls-container"
      ),
      toolsArrowIcon: document.getElementById("tools-arrow-icon"),
      musicSelect: document.getElementById("music-select"),
      playMusicBtn: document.getElementById("play-music-btn"),
      pauseMusicBtn: document.getElementById("pause-music-btn"),
      cancelActionBtn: document.getElementById("cancel-action-btn"),
      modelLimitModal: document.getElementById("model-limit-modal"),
      cancelModelLimitBtn: document.getElementById("cancel-model-limit-btn"),
      container: document.getElementById("Canvas-container"),
      generateRoomBtn: document.getElementById("GenerateRoom"),
      projectTitle: document.getElementById("projectTitle"),
      saveProjectBtn: document.getElementById("saveProjectBtn"),
      saveCloudBtn: document.getElementById("saveCloudBtn"),
      exportSceneBtn: document.getElementById("exportSceneBtn"),
      importSceneInput: document.getElementById("importSceneInput"),
      importModelInput: document.getElementById("importModelInput"),
      inspectorLockToggle: document.getElementById("inspector-lock-toggle"),
      iconUnlocked: document.getElementById("icon-unlocked"),
      iconLocked: document.getElementById("icon-locked"),
      inspectorTransformFields: document.getElementById(
        "inspector-transform-fields"
      ),
      getFloorLengthMeters: document.getElementById("GetFloorLengthMeters"),
      getFloorWidthMeters: document.getElementById("GetFloorWidthMeters"),
      getWallHeightMeters: document.getElementById("GetWallHeightMeters"),
      getFloorLengthFeet: document.getElementById("GetFloorLengthFeet"),
      getFloorWidthFeet: document.getElementById("GetFloorWidthFeet"),
      getWallHeightFeet: document.getElementById("GetWallHeightFeet"),
      libraryContainer: document.getElementById("model-library-container"),
      libraryTitle: document.getElementById("library-title"),
      librarySubtitle: document.getElementById("library-subtitle"),
      backToCategoriesBtn: document.getElementById("back-to-categories-btn"),
      libraryContentArea: document.getElementById("library-content-area"),
      modelSearchContainer: document.getElementById("model-search-container"),
      modelSearchInput: document.getElementById("model-search-input"),
      leftSidebar: document.getElementById("leftSidebar"),
      sidebarToggleBtn: document.getElementById("sidebarToggleBtn"),
      sidebarHeader: document.getElementById("sidebarHeader"),
      sidebarLogo: document.getElementById("sidebarLogo"),
      sidebarContent: document.querySelectorAll(".sidebar-content"),
      btnViewTop: document.getElementById("btn-view-top"),
      btnViewFront: document.getElementById("btn-view-front"),
      btnViewLeft: document.getElementById("btn-view-left"),
      btnViewPerspective: document.getElementById("btn-view-perspective"),
      btnDeselect: document.getElementById("btn-deselect"),
      btnTransform: document.getElementById("btn-transform"),
      btnRotate: document.getElementById("btn-rotate"),
      btnScale: document.getElementById("btn-scale"),
      btnLightBg: document.getElementById("btn-light-bg"),
      btnDarkBg: document.getElementById("btn-dark-bg"),
      lightingDropdownToggle: document.getElementById(
        "lighting-dropdown-toggle"
      ),
      lightingControlsContainer: document.getElementById(
        "lighting-controls-container"
      ),
      lightingArrowIcon: document.getElementById("lighting-arrow-icon"),
      resetLightingBtn: document.getElementById("reset-lighting-btn"),
      btnToggleHemisphere: document.getElementById("btn-toggle-hemisphere"),
      btnToggleDirectional: document.getElementById("btn-toggle-directional"),
      hemisphereSkyColorInput: document.getElementById(
        "hemisphere-sky-color-input"
      ),
      hemisphereGroundColorInput: document.getElementById(
        "hemisphere-ground-color-input"
      ),
      directionalColorInput: document.getElementById("directional-color-input"),
      btnToggleSnap: document.getElementById("btn-toggle-snap"),
      walkviewBtn: document.getElementById("walkview-btn"),
      walkViewModal: document.getElementById("walk-view-modal"),
      closeWalkModalBtn: document.getElementById("close-walk-modal-btn"),
      shortcutsBtn: document.getElementById("shortcuts-btn"),
      shortcutsModal: document.getElementById("shortcuts-modal"),
      settingsBtn: document.getElementById("settings-btn"),
      closeShortcutsModalBtn: document.getElementById(
        "close-shortcuts-modal-btn"
      ),
      settingsModal: document.getElementById("settings-modal"),
      closeSettingsModalBtn: document.getElementById(
        "close-settings-modal-btn"
      ),
      toggleSoundEffects: document.getElementById("toggle-sound-effects"),
      btnZoomIn: document.getElementById("btn-zoom-in"),
      btnZoomOut: document.getElementById("btn-zoom-out"),
      zoomPercentage: document.getElementById("zoom-percentage"),
      inspectorContainer: document.getElementById("inspector-container"),
      inspectorObjectName: document.getElementById("inspector-object-name"),
      inspectorPosX: document.getElementById("inspector-pos-x"),
      inspectorPosY: document.getElementById("inspector-pos-y"),
      inspectorPosZ: document.getElementById("inspector-pos-z"),
      inspectorRotX: document.getElementById("inspector-rot-x"),
      inspectorRotY: document.getElementById("inspector-rot-y"),
      inspectorRotZ: document.getElementById("inspector-rot-z"),
      inspectorScaleX: document.getElementById("inspector-scale-x"),
      inspectorScaleY: document.getElementById("inspector-scale-y"),
      inspectorScaleZ: document.getElementById("inspector-scale-z"),
      surfaceInspectorContainer: document.getElementById(
        "surface-inspector-container"
      ),
      surfaceInspectorTitle: document.getElementById("surface-inspector-title"),
      surfaceColorInput: document.getElementById("surface-color-input"),
      surfaceColorText: document.getElementById("surface-color-text"),
      resetSurfaceTextureBtn: document.getElementById(
        "reset-surface-texture-btn"
      ),
      confirmActionModal: document.getElementById("confirm-action-modal"),
      confirmModalTitle: document.getElementById("confirm-modal-title"),
      confirmModalMessage: document.getElementById("confirm-modal-message"),
      confirmActionBtn: document.getElementById("confirm-action-btn"),
      cancelActionBtn: document.getElementById("cancel-action-btn"),
    };
    this.dragOverClasses = [
      "outline-white",
      "outline-white",
      "outline-offset-[-8px]",
      "bg-white",
    ];
  }

  init() {
    // called once at the start to set everything up
    this.bindEventListeners(); // connect all buttons and inputs to their functions.
    this.bindInspectorInputEvents(); // binds the inspector input events
    this.bindSurfaceInspectorEvents(); //binds surface(wall/floor) inspector events
    this.bindLightingInspectorEvents(); // lighting inspector
    this.syncDimensionInputs(); // meter and feet input updates
    this.loadModelManifest(); // fetch model data from server
    this.updateZoomDisplay(); // update the zoom percentage
    this.updateUIFromSettings();
    this.updateLightingInspectorUI(); // sets initial colors for the lighting controls
  }

  updateLockStateUI(object) {
    if (!object) return;

    const isLocked = object.userData.isLocked || false;

    // Update Gizmo Visibility in ControlsManager
    if (this.app.controlsManager.transformControls.object === object) {
      if (isLocked) {
        this.app.controlsManager.transformControls.detach(); //hide gizmo
      } else {
        this.app.controlsManager.transformControls.attach(object); //show gizmo
      }
    }
    //refersh the inscpetor panel to show lock icon
    this.updateInspector(object);
  }

  updateUIFromSettings() {
    // update uielelment based on user settings
    if (this.dom.toggleSoundEffects) {
      this.dom.toggleSoundEffects.checked =
        this.app.audioManager.isEffectsSoundEnabled;
    }
  }

  updateZoomDisplay() {
    if (this.dom.zoomPercentage) {
      const percentage = this.app.controlsManager.getCurrentZoomPercentage();
      this.dom.zoomPercentage.textContent = `${percentage}%`;
    }
  }

  // make the meter and feet dimension input automatically updateeach other
  syncDimensionInputs() {
    const METERS_TO_FEET = 3.28084;
    const FEET_TO_METERS = 0.3048;

    // convert meter values to feet and update the UI
    const metersToFeet = () => {
      const lengthM = parseFloat(this.dom.getFloorLengthMeters.value);
      const widthM = parseFloat(this.dom.getFloorWidthMeters.value);
      const heightM = parseFloat(this.dom.getWallHeightMeters.value);

      // Update feet inputs only if the meter value is a valid number
      if (!isNaN(lengthM))
        this.dom.getFloorLengthFeet.value = (lengthM * METERS_TO_FEET).toFixed(
          2
        );
      if (!isNaN(widthM))
        this.dom.getFloorWidthFeet.value = (widthM * METERS_TO_FEET).toFixed(2);
      if (!isNaN(heightM))
        this.dom.getWallHeightFeet.value = (heightM * METERS_TO_FEET).toFixed(
          2
        );
    };

    // convert feet values to meters and update the UI
    const feetToMeters = () => {
      const lengthF = parseFloat(this.dom.getFloorLengthFeet.value);
      const widthF = parseFloat(this.dom.getFloorWidthFeet.value);
      const heightF = parseFloat(this.dom.getWallHeightFeet.value);

      // Update meter inputs only if the feet value is a valid number
      if (!isNaN(lengthF))
        this.dom.getFloorLengthMeters.value = (
          lengthF * FEET_TO_METERS
        ).toFixed(2);
      if (!isNaN(widthF))
        this.dom.getFloorWidthMeters.value = (widthF * FEET_TO_METERS).toFixed(
          2
        );
      if (!isNaN(heightF))
        this.dom.getWallHeightMeters.value = (heightF * FEET_TO_METERS).toFixed(
          2
        );
    };

    metersToFeet(); //run once at the start

    this.dom.getFloorLengthMeters.addEventListener("input", metersToFeet);
    this.dom.getFloorWidthMeters.addEventListener("input", metersToFeet);
    this.dom.getWallHeightMeters.addEventListener("input", metersToFeet);

    this.dom.getFloorLengthFeet.addEventListener("input", feetToMeters);
    this.dom.getFloorWidthFeet.addEventListener("input", feetToMeters);
    this.dom.getWallHeightFeet.addEventListener("input", feetToMeters);
  }

  showShortcutsModal() {
    if (this.dom.shortcutsModal) {
      this.dom.shortcutsModal.classList.remove("hidden");
    }
  }

  showModelLimitModal() {
    if (this.dom.modelLimitModal) {
      this.dom.modelLimitModal.classList.remove("hidden");
    }
  }

  hideModelLimitModal() {
    if (this.dom.modelLimitModal) {
      this.dom.modelLimitModal.classList.add("hidden");
    }
  }

  hideShortcutsModal() {
    if (this.dom.shortcutsModal) {
      this.dom.shortcutsModal.classList.add("hidden");
    }
  }

  showWalkViewModal() {
    if (this.dom.walkViewModal) {
      this.dom.walkViewModal.classList.remove("hidden");
    }
  }

  hideWalkViewModal() {
    if (this.dom.walkViewModal) {
      this.dom.walkViewModal.classList.add("hidden");
    }
  }

  showSettingsModal() {
    // Check if the settings modal element exists in our DOM object to prevent errors.
    if (this.dom.settingsModal) {
      // If it exists, remove the 'hidden' CSS class to make it visible.
      this.dom.settingsModal.classList.remove("hidden");
    }
  }

  hideSettingsModal() {
    if (this.dom.settingsModal) {
      this.dom.settingsModal.classList.add("hidden");
    }
  }

  showConfirmModal(
    title,
    message,
    confirmText = "Confirm",
    confirmClass = "bg-red-600",
    hoverClass = "hover:bg-red-700"
  ) {
    return new Promise((resolve) => {
      this.dom.confirmModalTitle.textContent = title;
      this.dom.confirmModalMessage.textContent = message;
      this.dom.confirmActionBtn.textContent = confirmText;
      this.dom.confirmActionBtn.className = `w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${confirmClass} ${hoverClass}`;
      this.dom.confirmActionModal.classList.remove("hidden");

      const onConfirm = () => {
        this.dom.confirmActionModal.classList.add("hidden");
        resolve(true);
        cleanup();
      };

      const onCancel = () => {
        this.dom.confirmActionModal.classList.add("hidden");
        resolve(false);
        cleanup();
      };

      const cleanup = () => {
        this.dom.confirmActionBtn.removeEventListener("click", onConfirm);
        this.dom.cancelActionBtn.removeEventListener("click", onCancel);
      };

      this.dom.confirmActionBtn.addEventListener("click", onConfirm);
      this.dom.cancelActionBtn.addEventListener("click", onCancel);
    });
  }

  async loadModelManifest() {
    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/get_models_for_app.php`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.modelManifestData = await response.json();
      this.showCategoryView();
    } catch (error) {
      console.error("Could not load model data from the cloud:", error);
      this.dom.libraryContentArea.innerHTML = `<p class="col-span-2 text-red-500 text-xs">Could not load model library from the server. Please check the console for details.</p>`;
    }
  }

  setButtonState(button, text, disabled) {
    if (button) {
      button.innerHTML = text;
      button.disabled = disabled;
    }
  }

  async handleSaveCloud() {
    const button = this.dom.saveCloudBtn;
    const originalContent = button.innerHTML;
    this.setButtonState(button, "Saving...", true);
    const thumbnailDataUrl = await this.app.sceneManager.captureThumbnail(); //get the thumbnail img
    try {
      const { blob, filename } = await this.app.sceneManager.exportGLB(); // export the scene to glb file format
      const token = this.app.authManager._getCookie("token");
      const userInfoString = this.app.authManager._getCookie("user_info");

      if (!userInfoString || !token) {
        throw new Error(
          "Authentication error: Please log in to save projects."
        );
      }

      // decode and parse locally just to get the user ID for the form
      const userInfo = JSON.parse(decodeURIComponent(userInfoString));
      if (!userInfo || !userInfo.id) {
        throw new Error("Authentication error: User ID not found in session.");
      }

      // to sent to server
      const formData = new FormData();
      formData.append("sceneFile", blob, filename);
      formData.append("userId", userInfo.id);
      formData.append("userInfo", userInfoString);
      formData.append("thumbnail", thumbnailDataUrl);

      if (this.app.currentProjectId) {
        formData.append("projectId", this.app.currentProjectId);
      }

      // send the data to the server save endpoint
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_saveProjectToS3.php`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMsg = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || "Failed to save project.";
        } catch (e) {
          console.error("Could not parse error JSON from server.");
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();

      // if it is new project, update the URL in the browser bar with th enew project ID
      if (result.projectId && !this.app.currentProjectId) {
        this.app.currentProjectId = result.projectId;
        const newUrl = `${window.location.pathname}?project_id=${result.projectId}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
      }
      showToast(result.message || "Project saved!", "success");
      setTimeout(() => {
        window.location.href = "workspaceDashboardPage.html";
      }, 1000);
    } catch (error) {
      console.error("Failed to save to cloud:", error);
      showToast(`Error: ${error.message}`, "error");
    } finally {
      this.setButtonState(button, originalContent, false);
    }
  }

  // display the main category view in the model library
  showCategoryView() {
    this.dom.libraryTitle.textContent = "Models";
    this.dom.librarySubtitle.textContent = "Select a category to view models.";
    this.dom.librarySubtitle.classList.remove("hidden");
    this.dom.backToCategoriesBtn.classList.add("hidden");
    this.dom.modelSearchContainer.classList.remove("hidden");
    this.dom.libraryContentArea.innerHTML = "";
    this.currentCategoryIndex = null;

    if (!this.modelManifestData) return;

    this.modelManifestData.forEach((category, index) => {
      const categoryCard = this.createCategoryCardElement(category, index);
      this.dom.libraryContentArea.appendChild(categoryCard);
    });
  }

  displayModelsForCategory(categoryIndex) {
    this.currentCategoryIndex = categoryIndex;
    const category = this.modelManifestData[categoryIndex];
    if (!category) return;

    const isTextureCategory = category.categoryName === "Textures";

    this.dom.libraryTitle.textContent = category.categoryName;
    this.dom.librarySubtitle.textContent = isTextureCategory
      ? "Drag textures onto walls or the floor."
      : "Drag and drop models into the scene.";
    this.dom.librarySubtitle.classList.remove("hidden");
    this.dom.backToCategoriesBtn.classList.remove("hidden");
    this.dom.modelSearchContainer.classList.remove("hidden");
    this.dom.libraryContentArea.innerHTML = "";

    // filter models in the category based on the user input
    const searchTerm = this.dom.modelSearchInput.value.toLowerCase().trim();
    const allModels = category.models || [];
    const filteredModels = allModels.filter((model) =>
      model.name.toLowerCase().includes(searchTerm)
    );

    //if there are model to show
    if (filteredModels.length > 0) {
      filteredModels.forEach((model) => {
        const modelElement = this.createModelElement(model, isTextureCategory);
        this.dom.libraryContentArea.appendChild(modelElement);
      });
    } else {
      const itemType = isTextureCategory ? "textures" : "models";
      if (searchTerm) {
        this.dom.libraryContentArea.innerHTML = `<p class="col-span-2 text-ink/60 text-xs italic">No ${itemType} found for "${searchTerm}".</p>`;
      } else {
        this.dom.libraryContentArea.innerHTML = `<p class="col-span-2 text-ink/60 text-xs italic">No ${itemType} in this category.</p>`;
      }
    }
  }

  // global seach
  performGlobalSearch(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.dom.libraryContentArea.innerHTML = "";
    let modelsFound = 0;

    this.dom.libraryTitle.textContent = "Search Results";
    this.dom.librarySubtitle.classList.add("hidden");
    this.dom.backToCategoriesBtn.classList.remove("hidden"); // Show back button to exit search

    this.modelManifestData.forEach((category) => {
      const isTextureCategory = category.categoryName === "Textures";
      if (category.models) {
        const filteredModels = category.models.filter((model) =>
          model.name.toLowerCase().includes(lowerCaseSearchTerm)
        );

        filteredModels.forEach((model) => {
          const modelElement = this.createModelElement(
            model,
            isTextureCategory
          );
          this.dom.libraryContentArea.appendChild(modelElement);
          modelsFound++;
        });
      }
    });

    if (modelsFound === 0) {
      this.dom.libraryContentArea.innerHTML = `<p class="col-span-2 text-ink/60 text-xs italic">No models found for "${searchTerm}".</p>`;
    }
  }

  createCategoryCardElement(categoryData, index) {
    const card = document.createElement("div");
    card.className = "bg-[#F3F3F3] rounded-sm ";
    card.dataset.categoryIndex = index;
    const title = document.createElement("h3");
    title.className = "ms-2 mt-2";
    title.textContent = categoryData.categoryName;
    const imgContainer = document.createElement("div");
    imgContainer.className =
      "flex-grow flex bg-[#F3F3F3] items-center justify-center mt-2";
    const img = document.createElement("img");
    img.src = categoryData.categoryImage;
    img.alt = categoryData.categoryName;
    img.className = "max-h-24 w-auto object-contain";
    imgContainer.appendChild(img);
    card.appendChild(title);
    card.appendChild(imgContainer);
    card.addEventListener("click", () => {
      this.dom.modelSearchInput.value = "";
      this.displayModelsForCategory(index);
    });
    return card;
  }

  createModelElement(modelData, isTexture = false) {
    const container = document.createElement("div");
    const card = document.createElement("div");
    card.className = "bg-white cursor-grab w-full ";
    const img = document.createElement("img");
    img.src = modelData.thumbnailUrl;
    img.alt = modelData.name;
    img.draggable = true;
    img.className = "w-full aspect-square rounded-sm";

    img.dataset.modelUrl = modelData.modelUrl;
    img.dataset.itemType = isTexture ? "texture" : "model";

    this.bindDragEventsToModel(img);
    card.appendChild(img);
    const nameLabel = document.createElement("p");
    nameLabel.className = "text-xs mt-1 text-gray-600 truncate";
    nameLabel.textContent = modelData.name;
    nameLabel.title = modelData.description;
    container.appendChild(card);
    container.appendChild(nameLabel);
    return container;
  }

  // attaches drag and drop event listeners to a library item
  bindDragEventsToModel(element) {
    // use a tiny, invisible image as the drag ghost to show our own 3D preview instead
    const invisibleDragImage = new Image(1, 1);
    invisibleDragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    element.addEventListener("dragstart", (e) => {
      //set the browser's default drag image
      e.dataTransfer.setDragImage(invisibleDragImage, 0, 0);

      const url = e.target.dataset.modelUrl;
      const itemType = e.target.dataset.itemType;
      const data = JSON.stringify({ url: url, type: itemType });

      e.dataTransfer.setData("text/plain", data);
      e.dataTransfer.effectAllowed = "copy";
      this.isDragging = true;

      if (itemType === "model") {
        // if the item is 3D model
        this.app.sceneManager.createPreviewModel(url);
      }
    });
  }

  bindEventListeners() {
    if (this.dom.btnViewTop)
      this.dom.btnViewTop.addEventListener("click", () =>
        this.app.controlsManager.setCameraView("top")
      );
    if (this.dom.btnViewFront)
      this.dom.btnViewFront.addEventListener("click", () =>
        this.app.controlsManager.setCameraView("front")
      );
    if (this.dom.btnViewLeft)
      this.dom.btnViewLeft.addEventListener("click", () =>
        this.app.controlsManager.setCameraView("left")
      );
    if (this.dom.btnViewPerspective)
      this.dom.btnViewPerspective.addEventListener("click", () =>
        this.app.controlsManager.setCameraView("perspective")
      );

    if (this.dom.inspectorLockToggle) {
      this.dom.inspectorLockToggle.addEventListener("click", () => {
        const object = this.activeObjectForInspector;
        if (!object) return;
        const currentLockedState = object.userData.isLocked || false;
        const newLockedState = !currentLockedState;
        const command = new SetLockCommand(this.app, object, newLockedState);
        this.app.undoManager.execute(command);
      });
    }

    if (this.dom.btnDeselect)
      this.dom.btnDeselect.addEventListener("click", () =>
        this.app.controlsManager.deselectObject()
      );
    if (this.dom.btnTransform)
      this.dom.btnTransform.addEventListener("click", () =>
        this.app.controlsManager.transformControls.setMode("translate")
      );
    if (this.dom.btnRotate)
      this.dom.btnRotate.addEventListener("click", () =>
        this.app.controlsManager.transformControls.setMode("rotate")
      );
    if (this.dom.btnScale)
      this.dom.btnScale.addEventListener("click", () =>
        this.app.controlsManager.transformControls.setMode("scale")
      );
    if (this.dom.btnLightBg)
      this.dom.btnLightBg.addEventListener("click", () =>
        this.app.setBackgroundColor(0xf0f0f0)
      );
    if (this.dom.btnDarkBg)
      this.dom.btnDarkBg.addEventListener("click", () =>
        this.app.setBackgroundColor(0x1a1a1a)
      );

    if (this.dom.resetLightingBtn) {
      this.dom.resetLightingBtn.addEventListener("click", () => {
        this.app.resetLighting();
      });
    }

    if (this.dom.lightingDropdownToggle) {
      this.dom.lightingDropdownToggle.addEventListener("click", () => {
        this.dom.lightingControlsContainer.classList.toggle("hidden");
        this.dom.lightingArrowIcon.classList.toggle("rotate-180");
      });
    }

    if (this.dom.musicDropdownToggle) {
      this.dom.musicDropdownToggle.addEventListener("click", () => {
        this.dom.musicControlsContainer.classList.toggle("hidden");
        this.dom.musicArrowIcon.classList.toggle("rotate-180");
      });
    }

    if (this.dom.toolsDropdownToggle) {
      this.dom.toolsDropdownToggle.addEventListener("click", () => {
        this.dom.toolsControlsContainer.classList.toggle("hidden");
        this.dom.toolsArrowIcon.classList.toggle("rotate-180");
      });
    }

    if (this.dom.btnToggleHemisphere)
      this.dom.btnToggleHemisphere.addEventListener("click", () => {
        const isActive = this.app.toggleHemiLight();
        this.dom.btnToggleHemisphere.classList.toggle("bg-blue-200", isActive);
      });
    if (this.dom.btnToggleDirectional)
      this.dom.btnToggleDirectional.addEventListener("click", () => {
        const isActive = this.app.toggleDirLight();
        this.dom.btnToggleDirectional.classList.toggle("bg-blue-200", isActive);
      });
    if (this.dom.btnToggleSnap) {
      this.dom.btnToggleSnap.addEventListener("click", () => {
        const isSnappingActive = this.app.controlsManager.toggleSnapping();
        this.dom.btnToggleSnap.classList.toggle("active", isSnappingActive);
        this.dom.btnToggleSnap.classList.toggle(
          "bg-gray-100",
          !isSnappingActive
        );
        this.dom.btnToggleSnap.classList.toggle(
          "bg-gray-200",
          isSnappingActive
        );
      });
    }

    if (this.dom.playMusicBtn) {
      this.dom.playMusicBtn.addEventListener("click", () => {
        const selectedMusic = this.dom.musicSelect.value;
        this.app.audioManager.playMusic(selectedMusic);
      });
    }

    if (this.dom.pauseMusicBtn) {
      this.dom.pauseMusicBtn.addEventListener("click", () => {
        this.app.audioManager.pauseMusic();
      });
    }

    if (this.dom.backToCategoriesBtn)
      this.dom.backToCategoriesBtn.addEventListener("click", () => {
        this.dom.modelSearchInput.value = ""; // Clear search on back
        this.showCategoryView();
      });

    if (this.dom.modelSearchInput) {
      this.dom.modelSearchInput.addEventListener("input", () => {
        const searchTerm = this.dom.modelSearchInput.value.trim();
        // If a category is active, filter within that category.
        if (this.currentCategoryIndex !== null) {
          this.displayModelsForCategory(this.currentCategoryIndex);
        }
        // Otherwise, if there's a search term, perform a global search.
        else if (searchTerm) {
          this.performGlobalSearch(searchTerm);
        }
        // If no category is active and the search is empty, show all categories.
        else {
          this.showCategoryView();
        }
      });
    }

    if (this.dom.resetSurfaceTextureBtn) {
      this.dom.resetSurfaceTextureBtn.addEventListener("click", () => {
        if (this.activeObjectForInspector) {
          this.app.sceneManager.resetObjectTexture(
            this.activeObjectForInspector
          );
        }
      });
    }

    if (this.dom.sidebarToggleBtn)
      this.dom.sidebarToggleBtn.addEventListener("click", () => {
        this.dom.sidebarContent.forEach((el) => el.classList.toggle("hidden"));
        this.dom.sidebarLogo.classList.toggle("hidden");
        this.dom.sidebarHeader.classList.toggle("justify-between");
        this.dom.sidebarHeader.classList.toggle("justify-center");
        this.dom.leftSidebar.classList.toggle("w-60");
        this.dom.leftSidebar.classList.toggle("w-8");
        setTimeout(() => {
          this.app.onWindowResize();
        }, 100);
      });

    if (this.dom.generateRoomBtn) {
      this.dom.generateRoomBtn.addEventListener("click", async () => {
        const userConfirmed = await this.showConfirmModal(
          "Generate New Room",
          "This will clear the current scene and cannot be undone.",
          "Generate",
          "bg-red-600",
          "hover:bg-red-700"
        );
        if (userConfirmed) {
          this.app.sceneManager.generateInitialRoom();
        }
      });
    }
    if (this.dom.exportSceneBtn)
      this.dom.exportSceneBtn.addEventListener("click", () => {
        const filename = this.dom.projectTitle.value;
        this.app.sceneManager.saveScene(filename);
      });
    if (this.dom.importSceneInput)
      this.dom.importSceneInput.addEventListener("change", (e) =>
        this.app.sceneManager.loadSceneFromFile(e)
      );
    if (this.dom.importModelInput)
      this.dom.importModelInput.addEventListener("change", (e) =>
        this.app.sceneManager.loadModelFromFile(e)
      );
    if (this.dom.saveCloudBtn)
      this.dom.saveCloudBtn.addEventListener("click", () =>
        this.handleSaveCloud()
      );

    document.addEventListener("dragend", () => {
      if (this.isDragging) {
        this.app.sceneManager.removePreviewModel();
      }
      this.isDragging = false;
    });

    this.dom.container.addEventListener("dragenter", (e) => {
      e.preventDefault();
      if (this.isDragging) {
        this.dom.container.classList.add(...this.dragOverClasses);
      }
    });
    this.dom.container.addEventListener("dragleave", (e) => {
      if (
        e.relatedTarget === null ||
        !this.dom.container.contains(e.relatedTarget)
      ) {
        this.dom.container.classList.remove(...this.dragOverClasses);
        if (this.app.sceneManager.previewModel) {
          this.app.sceneManager.previewModel.visible = false;
        }
      }
    });
    this.dom.container.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (this.isDragging && this.app.sceneManager.previewModel) {
        this.app.sceneManager.updatePreviewModelPosition(e);
      }
    });
    this.dom.container.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dom.container.classList.remove(...this.dragOverClasses);
      const dataString = e.dataTransfer.getData("text/plain");
      this.isDragging = false;

      if (dataString) {
        try {
          const data = JSON.parse(dataString);
          if (data.type === "model") {
            this.app.sceneManager.addModelAtDropPoint(data.url, e);
          } else if (data.type === "texture") {
            this.app.sceneManager.applyTextureAtDropPoint(data.url, e);
          }
        } catch (error) {
          console.error("Error parsing drop data:", error);
          this.app.sceneManager.removePreviewModel();
        }
      } else {
        this.app.sceneManager.removePreviewModel();
      }
    });

    if (this.dom.walkviewBtn) {
      this.dom.walkviewBtn.addEventListener("click", () => {
        this.app.controlsManager.setWalkView();
        this.showWalkViewModal();
      });
    }
    if (this.dom.closeWalkModalBtn) {
      this.dom.closeWalkModalBtn.addEventListener("click", () =>
        this.hideWalkViewModal()
      );
    }
    if (this.dom.shortcutsBtn) {
      this.dom.shortcutsBtn.addEventListener("click", () =>
        this.showShortcutsModal()
      );
    }
    if (this.dom.closeShortcutsModalBtn) {
      this.dom.closeShortcutsModalBtn.addEventListener("click", () =>
        this.hideShortcutsModal()
      );
    }
    if (this.dom.settingsBtn) {
      this.dom.settingsBtn.addEventListener("click", () =>
        this.showSettingsModal()
      );
    }
    if (this.dom.closeSettingsModalBtn) {
      this.dom.closeSettingsModalBtn.addEventListener("click", () =>
        this.hideSettingsModal()
      );
    }
    if (this.dom.toggleSoundEffects) {
      this.dom.toggleSoundEffects.addEventListener("change", (event) => {
        this.app.audioManager.setEffectsSoundEnabled(event.target.checked);
      });
    }
    if (this.dom.btnZoomIn) {
      this.dom.btnZoomIn.addEventListener("click", () =>
        this.app.controlsManager.zoomIn()
      );
    }
    if (this.dom.btnZoomOut) {
      this.dom.btnZoomOut.addEventListener("click", () =>
        this.app.controlsManager.zoomOut()
      );
    }
    if (this.dom.cancelModelLimitBtn) {
      this.dom.cancelModelLimitBtn.addEventListener("click", () =>
        this.hideModelLimitModal()
      );
    }
  }

  bindInspectorInputEvents() {
    const inputs = [
      this.dom.inspectorPosX,
      this.dom.inspectorPosY,
      this.dom.inspectorPosZ,
      this.dom.inspectorRotX,
      this.dom.inspectorRotY,
      this.dom.inspectorRotZ,
      this.dom.inspectorScaleX,
      this.dom.inspectorScaleY,
      this.dom.inspectorScaleZ,
    ];
    inputs.forEach((input) => {
      if (!input) return;
      input.addEventListener("focus", () => {
        const object = this.activeObjectForInspector;
        if (object) {
          this.inspectorTransformCache = {
            position: object.position.clone(),
            quaternion: object.quaternion.clone(),
            scale: object.scale.clone(),
          };
        }
      });
      input.addEventListener("change", () => {
        this.updateObjectFromInspector();
      });
    });
  }

  bindSurfaceInspectorEvents() {
    let oldColorCache = null;
    // when the user clicks the color picker, save the current color(for undo)
    const onColorFocus = () => {
      const object = this.activeObjectForInspector;
      if (object && object.material) {
        oldColorCache = object.material.color.clone();
      }
    };
    // when the user picks a new color, create an undoable command with the old and new colors.
    const onColorChange = () => {
      const object = this.activeObjectForInspector;
      if (!object || !oldColorCache) return;

      const newColor = new THREE.Color(this.dom.surfaceColorInput.value);
      const command = new ChangeColorCommand(
        this.app,
        object,
        oldColorCache,
        newColor
      );
      this.app.undoManager.execute(command);
      oldColorCache = null;
    };

    this.dom.surfaceColorInput.addEventListener("focus", onColorFocus);
    this.dom.surfaceColorInput.addEventListener("change", onColorChange);

    this.dom.surfaceColorInput.addEventListener("input", () => {
      this.dom.surfaceColorText.value = this.dom.surfaceColorInput.value;
    });

    this.dom.surfaceColorText.addEventListener("focus", onColorFocus);
    this.dom.surfaceColorText.addEventListener("change", () => {
      const object = this.activeObjectForInspector;
      if (!object || !oldColorCache) return;

      try {
        const newColor = new THREE.Color(this.dom.surfaceColorText.value);
        const command = new ChangeColorCommand(
          this.app,
          object,
          oldColorCache,
          newColor
        );
        this.app.undoManager.execute(command);
      } catch (e) {
        console.error("Invalid color string:", this.dom.surfaceColorText.value);
        this.updateSurfaceInspectorUI(object);
      }
      oldColorCache = null;
    });
  }

  updateObjectFromInspector() {
    const object = this.activeObjectForInspector;
    if (!object || !this.inspectorTransformCache) return;

    //read the new pos, rotation and scale values from the input fields
    const newPos = new THREE.Vector3(
      parseFloat(this.dom.inspectorPosX.value),
      parseFloat(this.dom.inspectorPosY.value),
      parseFloat(this.dom.inspectorPosZ.value)
    );
    const newRot = new THREE.Euler(
      parseFloat(this.dom.inspectorRotX.value) * (Math.PI / 180),
      parseFloat(this.dom.inspectorRotY.value) * (Math.PI / 180),
      parseFloat(this.dom.inspectorRotZ.value) * (Math.PI / 180),
      "YXZ"
    );

    const newScale = new THREE.Vector3(
      parseFloat(this.dom.inspectorScaleX.value),
      parseFloat(this.dom.inspectorScaleY.value),
      parseFloat(this.dom.inspectorScaleZ.value)
    );

    const newTransform = {
      position: newPos,
      quaternion: new THREE.Quaternion().setFromEuler(newRot),
      scale: newScale,
    };

    object.position.copy(newTransform.position);
    object.quaternion.copy(newTransform.quaternion);
    object.scale.copy(newTransform.scale);
    object.updateMatrixWorld();
    const command = new TransformCommand(
      this.app,
      object,
      this.inspectorTransformCache,
      newTransform
    );
    this.app.undoManager.execute(command);
    this.inspectorTransformCache = null;
  }

  showTextureCategory() {
    if (!this.modelManifestData) {
      this.loadModelManifest().then(() => this.showTextureCategory());
      return;
    }

    const textureCategoryIndex = this.modelManifestData.findIndex(
      (cat) => cat.categoryName === "Textures"
    );

    if (textureCategoryIndex !== -1) {
      this.displayModelsForCategory(textureCategoryIndex);
    } else {
      this.showCategoryView();
    }
  }

  updateLightingInspectorUI() {
    if (!this.app.hemiLight || !this.app.directionalLight) return;

    this.dom.hemisphereSkyColorInput.value = `#${this.app.hemiLight.color.getHexString()}`;
    this.dom.hemisphereGroundColorInput.value = `#${this.app.hemiLight.groundColor.getHexString()}`;
    this.dom.directionalColorInput.value = `#${this.app.directionalLight.color.getHexString()}`;
  }

  bindLightingInspectorEvents() {
    let oldColorCache = null;

    const handleColorChange = (light, propertyName, newColorValue) => {
      if (!light || oldColorCache === null) return;

      const newColor = new THREE.Color(newColorValue);
      const command = new ChangeLightColorCommand(
        this.app,
        light,
        propertyName,
        oldColorCache,
        newColor
      );
      this.app.undoManager.execute(command);
      oldColorCache = null;
    };

    this.dom.hemisphereSkyColorInput.addEventListener("focus", () => {
      oldColorCache = this.app.hemiLight.color.clone();
    });
    this.dom.hemisphereSkyColorInput.addEventListener("change", (e) => {
      handleColorChange(this.app.hemiLight, "color", e.target.value);
    });

    this.dom.hemisphereGroundColorInput.addEventListener("focus", () => {
      oldColorCache = this.app.hemiLight.groundColor.clone();
    });
    this.dom.hemisphereGroundColorInput.addEventListener("change", (e) => {
      handleColorChange(this.app.hemiLight, "groundColor", e.target.value);
    });

    this.dom.directionalColorInput.addEventListener("focus", () => {
      oldColorCache = this.app.directionalLight.color.clone();
    });
    this.dom.directionalColorInput.addEventListener("change", (e) => {
      handleColorChange(this.app.directionalLight, "color", e.target.value);
    });
  }

  updateSurfaceInspectorUI(object) { // update for walls floors with the select object into
    if (!object || (!object.userData.isWall && !object.userData.isFloor)) {
      if (this.dom.resetSurfaceTextureBtn)
        this.dom.resetSurfaceTextureBtn.classList.add("hidden");
      return;
    }
    const objectType = object.userData.isWall ? "Wall" : "Floor";
    this.dom.surfaceInspectorTitle.textContent = `${objectType} Paint Palette`;

    const currentColor = object.material.color.getHexString();
    this.dom.surfaceColorInput.value = `#${currentColor}`;
    this.dom.surfaceColorText.value = `#${currentColor}`;

    if (this.dom.resetSurfaceTextureBtn) {
      if (object.material.map) {
        this.dom.resetSurfaceTextureBtn.classList.remove("hidden");
      } else {
        this.dom.resetSurfaceTextureBtn.classList.add("hidden");
      }
    }
  }

  updateInspector(object) {
    this.activeObjectForInspector = object;

    this.dom.inspectorContainer.classList.add("hidden");
    this.dom.surfaceInspectorContainer.classList.add("hidden");
    this.dom.libraryContainer.classList.add("hidden");

    if (object) {
      if (object.userData.isWall || object.userData.isFloor) {
        this.dom.surfaceInspectorContainer.classList.remove("hidden");
        this.updateSurfaceInspectorUI(object);
        this.dom.libraryContainer.classList.remove("hidden");
        this.showTextureCategory();
      } else {
        this.dom.inspectorContainer.classList.remove("hidden");
        this.dom.libraryContainer.classList.add("hidden");

        this.dom.inspectorObjectName.textContent =
          object.userData.fileName || object.name || "Selected Object";

        const isLocked = object.userData.isLocked || false;
        this.dom.iconLocked.classList.toggle("hidden", !isLocked);
        this.dom.iconUnlocked.classList.toggle("hidden", isLocked);
        this.dom.inspectorTransformFields.style.opacity = isLocked ? 0.5 : 1;
        this.dom.inspectorTransformFields.style.pointerEvents = isLocked
          ? "none"
          : "auto";

        this.dom.inspectorPosX.value = object.position.x.toFixed(3);
        this.dom.inspectorPosY.value = object.position.y.toFixed(3);
        this.dom.inspectorPosZ.value = object.position.z.toFixed(3);
        const euler = new THREE.Euler().setFromQuaternion(
          object.quaternion,
          "YXZ"
        );
        this.dom.inspectorRotX.value = (euler.x * (180 / Math.PI)).toFixed(1);
        this.dom.inspectorRotY.value = (euler.y * (180 / Math.PI)).toFixed(1);
        this.dom.inspectorRotZ.value = (euler.z * (180 / Math.PI)).toFixed(1);
        this.dom.inspectorScaleX.value = object.scale.x.toFixed(3);
        this.dom.inspectorScaleY.value = object.scale.y.toFixed(3);
        this.dom.inspectorScaleZ.value = object.scale.z.toFixed(3);
      }
    } else {
      this.dom.libraryContainer.classList.remove("hidden");
      this.showCategoryView();
    }
  }
}
