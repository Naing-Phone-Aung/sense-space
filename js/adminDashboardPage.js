const container = document.getElementById("overview-container");

const totalCustomerIcon = `
  <div class="bg-blue-100 w-fit p-1.5 rounded-lg text-blue-600">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-5"
      >
      <path
      fill-rule="evenodd"
      d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
      clip-rule="evenodd"
      />
      <path
      d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z"
      />
    </svg>
  </div>
`;
const totalActiveUserIcon = `
  <div class="bg-blue-100 w-fit p-1.5 rounded-lg text-blue-600">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
  <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" /></svg>
  </div>
`;
const suspendUserIcon = `
  <div class="bg-blue-100 w-fit p-1.5 rounded-lg text-blue-600">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
    <path d="M10.375 2.25a4.125 4.125 0 1 0 0 8.25 4.125 4.125 0 0 0 0-8.25ZM10.375 12a7.125 7.125 0 0 0-7.124 7.247.75.75 0 0 0 .363.63 13.067 13.067 0 0 0 6.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 0 0 .364-.63l.001-.12v-.002A7.125 7.125 0 0 0 10.375 12ZM16 9.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" />
    </svg>
  </div>
`;

function calculatePercentageChange(current, previous) {
  if (previous === 0) {
    // Handle cases where previous value is 0 to avoid division by zero
    return current > 0 ? "+100%" : "0%";
  }
  const change = ((current - previous) / previous) * 100;
  const rounded = change.toFixed(1);
  return `${change > 0 ? "+" : ""}${rounded}%`;
}


fetch(`${CONFIG.API_BASE_URL}/admin_viewUsersProfile.php`)
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    if (!data || !data.information || typeof data.information !== 'object') {
      console.error("Invalid data structure: data.information is missing or not an object.");
      return;
    }

    const { active_user, suspended_user } = data.information;

    const overviewList = [
      {
        id: 1,
        title: "Total Users",
        total: `${active_user + suspended_user}`,
        icon: totalCustomerIcon,
        inPercentage: "+97%",
      },
      {
        id: 2,
        title: "Total Active Users",
        total: `${active_user}`,
        icon: totalActiveUserIcon,
        inPercentage: "+22%",
      },
      {
        id: 3,
        title: "Total Suspended Users",
        total: `${suspended_user}`,
        icon: suspendUserIcon,
        inPercentage: "-3%",
      },
    ];

    container.innerHTML = ''; 

    overviewList.forEach((item) => {
      const card = document.createElement("div");
      card.className =
        "bg-white flex flex-col p-5 col-span-1 space-y-5 rounded-2xl shadow-xs";

      card.innerHTML = `
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
              ${item.icon}    
            <p class="font-medium font-mona text-ink">${item.title}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
               viewBox="0 0 24 24" stroke-width="1.5" 
               stroke="currentColor" class="size-7">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 
                .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 
                .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 
                .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <div class="text-ink flex flex-col space-y-3">
          <h4 class="font-semibold text-4xl">${item.total}</h4>
          <div class="font-inter flex items-center">
            <span class="${
              item.inPercentage.startsWith("+")
                ? "bg-green-50 text-green-900"
                : "bg-red-50 text-red-900"
            } font-medium text-sm me-2 px-2 py-1 rounded-full">
              ${item.inPercentage}
            </span>
            <p class="text-gray-700 text-sm">from last month</p>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Error fetching user data:", error);
    if (container) {
        container.innerHTML = '<p class="text-red-500">Failed to load user overview data. Please try again later.</p>';
    }
  });