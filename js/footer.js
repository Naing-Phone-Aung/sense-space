class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="bg-ink text-white">
      <footer class="font-inter w-[90%] mx-auto">
        <div class="grid grid-cols-7 py-10 mt-auto justify-between gap-20">
          <div class="grid col-span-4 grid-cols-3 gap-8">
            <div class="col-span-1 flex flex-col gap-10">
              <div>
                <h4 class="mb-5">About</h4>
                <ul class="space-y-1 text-sm">
                  <li>
                    <a href="aboutIntroductionPage.html" class="hover:underline">Introduction</a>
                  </li>
                  <li>
                    <a href="aboutTutorialPage.html" class="hover:underline">Tutorials</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-span-1 flex flex-col gap-10">
              <div>
                <h4 class="mb-5">My Space</h4>
                <ul class="space-y-1 text-sm">
                  <li>
                    <a href="workspaceDashboardPage.html" class="hover:underline"> Workspace </a>
                  </li>
                  <li>
                    <a href="CreationPage.html" class="hover:underline"> Export </a>
                  </li>
                  <li>
                    <a href="CreationPage.html" class="hover:underline"> Import </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="mt-6 mb-5">Legal</h4>
                <ul class="space-y-1 text-sm">
                  <li>
                    <a href="termsAndConditionsPage.html" class="hover:underline">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="privacyPolicyPage.html" class="hover:underline">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="col-span-1 flex flex-col gap-10">
              <div>
                <h4 class="mb-5">Contact</h4>
                <ul class="space-y-1 text-sm">
                  <li>
                    <span>sense@gmail.com</span>
                  </li>
                  <li>
                    <span>Singapore</span>
                  </li>
                  <li>
                    <span>432, Clementi Rd 650312</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="mb-5">Help Center</h4>
                <ul class="space-y-1 text-sm">
                  <li>
                    <a href="helpCenterPage.html" class="hover:underline"> Faq </a>
                  </li>
                  <li>
                    <a href="helpCenterPage.html" class="hover:underline">
                      Contact us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-span-3">
            <h4 class="mb-5">Get In Touch With Us</h4>
            <p class="mb-10 text-sm">
              Stay updated with the latest in space planning and design by
              subscribing to the Sense Space Planning Tool newsletter.
            </p>
            <form
              class="flex items-center text-sm rounded-full p-1 bg-white text-ink"
            >
              <input
                type="email"
                placeholder="Email"
                class="flex-grow px-4 py-2 bg-transparent border-0 focus:ring-0 placeholder-ink"
              />
              <button
                type="submit"
                class="text-sm font-medium px-4 py-2 rounded-full text-white bg-ink"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div class="py-5">
          <div
            class="mx-auto flex flex-col md:flex-row items-center justify-between text-sm gap-4"
          >
            <div class="flex items-center space-x-4">
              <span class="font-petrov-sans-regular text-2xl">Sense</span>
              <div class="w-px h-6 bg-white"></div>
              <span id="footer-year">© 2025 Sense. All Rights Reserved</span>
            </div>
            <div class="flex space-x-6">
              <a href="privacyPolicyPage.html" class="hover:underline">
                Privacy Policy
              </a>
              <a href="termsAndConditionsPage.html" class="hover:underline">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>`;
  }
}

customElements.define("footer-bar", Footer);
