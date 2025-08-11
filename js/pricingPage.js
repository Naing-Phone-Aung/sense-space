// Pricing plans data
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

const featureComparison = [
  {
    name: "Free",
    price: "$0",
    billing: "Per user/month, billed annually",
    bestFor: "Hobby projects",
    features: {
      planningTools: "Yes",
      templates: "Limited",
      projectLimit: "Up to 3 projects",
      dragDropInterface: "Basic",
      visualization3D: false,
      highResExport: false,
      support: "Basic email support",
    },
    buttonText: "Get started for Free",
  },
  {
    name: "Monthly Plan",
    price: "$9.99",
    billing: "Per user/month, billed annually",
    bestFor: "Small business",
    features: {
      planningTools: "Yes",
      templates: "Full access",
      projectLimit: "Unlimited",
      dragDropInterface: "Full-featured",
      visualization3D: "Yes",
      highResExport: "Yes",
      support: "Priority email support",
    },
    buttonText: "Get started with Pro",
  },
  {
    name: "Annual Plan",
    price: "$99.90",
    billing: "Per user/year, billed annually",
    bestFor: "Small business",
    features: {
      planningTools: "Yes",
      templates: "Full access",
      projectLimit: "Unlimited",
      dragDropInterface: "Full-featured",
      visualization3D: "Yes",
      highResExport: "Yes",
      support: "Priority email support",
    },
    buttonText: "Get started with Pro",
  },
];

const featuresList = [
  { key: "price", label: "Price" },
  { key: "bestFor", label: "Best For" },
  { key: "planningTools", label: "Access to Planning Tools" },
  { key: "templates", label: "Library of Templates" },
  { key: "projectLimit", label: "Project Saving Limit" },
  { key: "dragDropInterface", label: "Drag-and-Drop Interface" },
  { key: "visualization3D", label: "3D Visualization" },
  { key: "highResExport", label: "High-Resolution Export" },
  { key: "support", label: "Customer Support" },
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
});

const getFeatureValue = (plan, key) => {
  if (key === "price") return plan.price;
  if (key === "bestFor") return plan.bestFor;
  const value = plan.features[key];
  if (typeof value === "boolean")
    return !value
      ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
      : `
      `;
  return value;
};

const generateTable = () => {
  let table = `
      <table class="w-full text-[15px] text-left text-ink/60">
        <thead class="text-ink">
          <tr>
            <th class="py-3">Features</th>
            ${featureComparison
              .map((plan) => `<th class="py-3">${plan.name}</th>`)
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${featuresList
            .map(
              (feature) => `
            <tr class="border-b border-gray-100">
              <th class="py-4 text-ink font-semibold">${feature.label}</th>
              ${featureComparison
                .map(
                  (plan) => `
                <td class="py-4">
                 ${
                   plan.features[feature.key]
                     ? `
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-[#00f66f] inline-block">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>`
                     : ""
                 }<span class="text-ink/80"> ${getFeatureValue(plan, feature.key)}</span></td>

              `
                )
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  document.getElementById("feature-comparison-container").innerHTML = table;
};

generateTable();
