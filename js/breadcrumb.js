class BreadcrumbComponent extends HTMLElement {
  connectedCallback() {
    const links = JSON.parse(this.getAttribute("links") || "[]");
    const current = this.getAttribute("current") || "";

    const listItems = [];

    // Home link
    listItems.push(`
      <li class="inline-flex items-center">
        <a href="homePage.html" class="text-ink text-base font-medium hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white pe-4">Home</a>
      </li>
    `);

    // Dynamic links
    links.forEach(link => {
      listItems.push(`
        <li>
          <div class="flex items-center">
            <span class="mx-1 text-gray-500">/</span>
            <a href="${link.path}" class="text-ink hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white px-3">${link.title}</a>
          </div>
        </li>
      `);
    });

    // Current page
    if (current) {
      listItems.push(`
        <li>
          <div class="flex items-center">
            <span class="mx-1 text-gray-500">/</span>
            <span class="text-gray-600 dark:text-zinc-400 cursor-pointer px-3">${current}</span>
          </div>
        </li>
      `);
    }

    this.innerHTML = `
      <nav class="flex py-3 my-10 text-ink rounded-lg dark:bg-zinc-800 dark:border-zinc-700" aria-label="Breadcrumb">
        <ol class="inline-flex items-center  rtl:space-x-reverse">
          ${listItems.join("")}
        </ol>
      </nav>
    `;
  }
}

customElements.define("breadcrumb-component", BreadcrumbComponent);
