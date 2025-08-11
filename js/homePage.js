const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    billing: "Per user/month, billed annually",
    description: "For your hobby projects",
    features: [
      "Access to planning tools",
      "Limited library of templates",
      "Save up to 3 projects",
      "Add up to 10 models",
      "No access to room templates",
      "Basic customer support via email",
    ],
    buttonText: "Get started for Free",
    highlight: false,
  },
  {
    name: "Monthly Plan",
    price: "$9.99",
    billing: "Per user/month, billed annually",
    description: "Great for small business",
    features: [
      "Unlimited projects for planning tools",
      "Full access to templates and resources",
      "Save unlimited projects",
      "3D visualization of your space designs",
      "Export in high-resolution formats",
      "Access to all room templates",
      "Fast response from help center",
    ],
    buttonText: "Get started with Pro",
    highlight: false,
  },
  {
    name: "Annual Plan",
    price: "$99.9",
    billing: "Per user/year, billed annually",
    description: "Great for small business",
    features: [
      "Unlimited projects for planning tools",
      "Full access to templates and resources",
      "Save unlimited projects",
      "3D visualization of your space designs",
      "Export in high-resolution formats",
      "Access to all room templates",
      "Fast response from help center",
    ],
    buttonText: "Get started with Pro",
    highlight: true,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#pricing-cards");
  if (container) {
    pricingPlans.forEach((plan) => {
      const card = document.createElement("div");
      const isHighlight = plan.highlight;

      card.className =
        "col-span-1 font-normal font-inter p-5 rounded-2xl shadow-sm flex flex-col " +
        (isHighlight
          ? "bg-ink text-white"
          : " border border-gray-300 text-black bg-gray-50");

      const featureItems = plan.features
        .map(
          (el) => `
          <div class="flex gap-3 mt-5 items-start">
            <div class="p-1 rounded-full bg-gray-100">
              <svg class="${
                isHighlight ? "text-ink" : ""
              }" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,66.34a8,8,0,0,0-11.32,0L104,180.69,37.66,114.34a8,8,0,0,0-11.32,11.32l72,72a8,8,0,0,0,11.32,0l128-128A8,8,0,0,0,229.66,66.34Z"/></svg>
            </div>
            <p>${el}</p>
          </div>
        `
        )
        .join("");

      card.innerHTML = `
          <p class="text-xl ">${plan.name}</p>
          <p class="text-5xl font-medium font-petrov-sans-book tracking-wide mt-3">${
            plan.price
          }</p>
          <p class="text-sm mt-3">${plan.billing}</p>
          <p class="mt-6">${plan.description}</p>
          ${featureItems}
          <div class="mt-auto">
            <button class="${
              isHighlight ? "text-ink bg-white" : "text-white bg-ink"
            } px-4 rounded-xl text-lg py-2 w-full mt-5">
              ${plan.buttonText}
            </button>
          </div>
        `;

      container.appendChild(card);
    });
  }

  const videoPlaceholder = document.getElementById("video-placeholder");

  if (videoPlaceholder) {
    // Corrected video embed code
    videoPlaceholder.innerHTML = `
        <div class="aspect-video max-w-3xl mx-auto mt-5">
          <iframe  
            class="w-full h-full"
            src="https://www.youtube.com/embed/efuiKYFroeo?si=MdzTjvFdCK6cYeM4" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer;
            autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>
        </div>
      `;
  }
});