document.addEventListener("DOMContentLoaded", () => {
  const projectsGrid = document.getElementById("projects-grid");
  const modal = document.getElementById("delete-confirm-modal");
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  const cancelDeleteBtn = document.getElementById("cancel-delete-btn");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop().split(";").shift());
  }

  const token = getCookie("token");

  function showConfirmModal() {
    return new Promise((resolve) => {
      modal.classList.remove("hidden");

      const onConfirm = () => {
        modal.classList.add("hidden");
        resolve(true);
        cleanup();
      };

      const onCancel = () => {
        modal.classList.add("hidden");
        resolve(false);
        cleanup();
      };

      const cleanup = () => {
        confirmDeleteBtn.removeEventListener("click", onConfirm);
        cancelDeleteBtn.removeEventListener("click", onCancel);
      };

      confirmDeleteBtn.addEventListener("click", onConfirm);
      cancelDeleteBtn.addEventListener("click", onCancel);
    });
  }

  function formatHumanReadableDate(dateString) {
    if (!dateString) return "Just now";
    const date = new Date(dateString.replace(" ", "T"));
    if (isNaN(date)) return dateString;

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" }); // e.g., "July"
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours || 12; 

    const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${day} ${month} ${year} ${hours}:${paddedMinutes} ${ampm}`;
  }

  const createNewProjectCard = () => `
        <a href="CreationPage.html" class="group py-16 border-2 flex flex-col border-dashed border-gray-300 rounded-lg space-y-5 items-center justify-center text-ink/60 hover:border-blue-500 hover:text-blue-500 transition-all duration-300" aria-label="Create a new project">
            <div class="flex-grow flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            </div>
            <p class="text-sm font-medium">New project</p>
        </a>`;

  const createProjectCard = (project) => {
    const editUrl = `CreationPage.html?project_id=${project.id}`;

    const thumbnailUrl =
      project.thumbnail_url || "/public/assets/images/livingroom.png";
    console.log(project);
    return `
            <div class="bg-white border border-gray-200 rounded-lg p-4 flex flex-col group" data-project-id="${
              project.id
            }">
                <div class="relative flex-grow">
                    <a href="${editUrl}" class="block bg-gray-100 rounded-md h-full w-full overflow-hidden">
                        <img src="${thumbnailUrl}" alt="${
      project.project_name
    }" class="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300">
                    </a>
                </div>
                <div class="py-3 flex-shrink-0">
                    <h3 class="font-medium text-sm text-ink truncate">${
                      project.project_name || "Untitled Project"
                    }</h3>
                    <p class="text-xs text-ink/60">${formatHumanReadableDate(project.updated_at)}</p>
                </div>
               <div class="flex justify-between gap-2">
                    <a href="${editUrl}" class="bg-blue-50 text-blue-500 text-center w-full py-2 font-medium text-sm rounded-md hover:bg-blue-100 transition-colors">Edit Project</a>
                     <button data-project-id="${
                       project.id
                     }" class="delete-project-btn bg-red-50 text-red-500 text-sm text-center p-2 rounded-md hover:bg-red-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                            <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                        </svg>
                     </button>
                </div>
            </div>`;
  };

  async function handleDeleteProject(projectId) {
    const confirmed = await showConfirmModal();
    if (!confirmed) {
      return;
    }

    const userInfoString = getCookie("user_info");
    if (!token || !userInfoString) {
      alert("Authentication error. Please log in again.");
      return;
    }

    const user = JSON.parse(userInfoString);

    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/admin_deleteProject.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            projectId: projectId,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        showToast(result.message, "success");
        const cardToRemove = projectsGrid.querySelector(
          `div[data-project-id="${projectId}"]`
        );
        if (cardToRemove) {
          cardToRemove.remove();
        }
      } else {
        throw new Error(result.message || "Failed to delete the project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(`Error: ${error.message}`);
    }
  }

  function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll(".delete-project-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const projectId = button.dataset.projectId;
        handleDeleteProject(projectId);
      });
    });
  }

  async function loadProjects() {
    if (!projectsGrid) return;

    const userInfoString = getCookie("user_info");

    if (!token || !userInfoString) {
      projectsGrid.innerHTML = `<div class="col-span-full text-center p-10 bg-gray-100 rounded-lg"><p class="text-gray-600">Please <a href="loginPage.html" class="text-blue-600 font-medium underline">log in</a> to see your projects.</p></div>`;
      return;
    }

    try {
      const user = JSON.parse(userInfoString);
      if (!user || !user.id) {
        throw new Error("User ID not found in session data.");
      }

      const API_URL = `${CONFIG.API_BASE_URL}/user_viewProjects.php?user_id=${user.id}`;

      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch projects");
      }

      const projects = await response.json();

      projectsGrid.innerHTML = createNewProjectCard();
      projects.forEach((project) => {
        projectsGrid.insertAdjacentHTML(
          "beforeend",
          createProjectCard(project)
        );
      });
      addDeleteEventListeners();
    } catch (error) {
      console.error("Error loading projects:", error);
      projectsGrid.innerHTML = `<div class="col-span-full bg-red-50 text-red-700 p-4 rounded-lg"><p>Could not load your projects: ${error.message}</p></div>`;
    }
  }

  loadProjects();
});
