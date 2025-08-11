document.addEventListener("DOMContentLoaded", () => {
  const tutorialLessons = [
    {
      id: 1,
      lesson: "Getting Started Guide",
      publisher: "SENSE Software",
      postDate: "7 Apr 2025",
      youtubeId: "byqRYv7H4e0",
      duration: "00:38",
    },
    {
      id: 2,
      lesson: "Room Creation Walkthrough",
      publisher: "SENSE Software",
      postDate: "29 Apr 2025",
      youtubeId: "ZcNLQw-BEV0",
      duration: "00:27",
    },
    {
      id: 3,
      lesson: "Importing Room Model",
      publisher: "SENSE Software",
      postDate: "7 May 2025",
      youtubeId: "CdpNW7Ovrx4",
      duration: "00:27",
    },
    {
      id: 4,
      lesson: "Camera and Navigation Controls",
      publisher: "SENSE Software",
      postDate: "24 May 2025",
      youtubeId: "or0zG8yk0Qo",
      duration: "00:57",
    },
    {
      id: 5,
      lesson: "Room Settings & Lighting Controls",
      publisher: "SENSE Software",
      postDate: "6 May 2025",
      youtubeId: "b0ce6ziPHjM",
      duration: "00:31",
    },
    {
      id: 6,
      lesson: "Room Textures and Wallpaper",
      publisher: "SENSE Software",
      postDate: "4 May 2025",
      youtubeId: "keV5SoiqaOw",
      duration: "00:39",
    },
    {
      id: 7,
      lesson: "Saving Room Design",
      publisher: "SENSE Software",
      postDate: "9 May 2025",
      youtubeId: "SY0jPv99d8w",
      duration: "00:30",
    },
  ];

  const tutorialsGrid = document.getElementById("tutorials-grid");

  if (tutorialsGrid) {
    tutorialLessons.forEach((tutorial) => {
      const card = document.createElement("div");
     card.className =
        "tutorial-card col-span-1 flex flex-col gap-3 pb-5 rounded-md cursor-pointer";
      card.setAttribute("data-tutorial-id", tutorial.id);

      card.innerHTML = `
        <div class="flex flex-col space-y-2 pointer-events-none h-full"> 
          <div class="relative">
            <img id="tutorial-img" src="/public/assets/images/tutorial-thumbnail-${tutorial.id}.jpg" alt="${tutorial.lesson}" class="rounded-md w-full h-48 object-cover" />
            <p class="absolute bottom-2 right-2 text-white rounded-sm bg-ink/50 px-1 py-0.5 text-sm">${tutorial.duration}</p>
          </div>
          <div class="flex flex-col gap-1">
            <p class="text-lg leading-tight font-medium">${tutorial.lesson}</p>
            <p class="text-sm">${tutorial.publisher}</p>
            <p class="text-sm">${tutorial.postDate}</p>
          </div>
        </div>
      `;
      tutorialsGrid.appendChild(card);
    });

    tutorialsGrid.addEventListener("click", (event) => {
      const clickedCard = event.target.closest(".tutorial-card");
      if (!clickedCard) return;

      const tutorialId = clickedCard.dataset.tutorialId;
      const tutorial = tutorialLessons.find((t) => t.id == tutorialId);
      if (!tutorial || !tutorial.youtubeId) return;

      const iframeHtml = `
        <div class="w-full aspect-video">
          <iframe 
            class="w-full h-full"
            src="https://www.youtube.com/embed/${tutorial.youtubeId}?autoplay=1&si=W7TPqtoNRihQDvRe" 
            title="YouTube video player" 
            frameborder="" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
          </iframe>
           <div class="flex flex-col gap-1 mt-3 ms-1">
            <p class="text-lg leading-tight font-medium">${tutorial.lesson}</p>
            <p class="text-sm">${tutorial.publisher}</p>
            <p class="text-sm">${tutorial.postDate}</p>
          </div>
        </div>
      `;

      clickedCard.innerHTML = iframeHtml;

      clickedCard.className = "col-span-1 overflow-hidden";
    });
  }
});
