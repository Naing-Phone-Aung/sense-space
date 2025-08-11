(() => { //use IIFE -> runs as soon as it is defined (self exe annonymous function)
  const publicPages = [
    "homePage.html",
    "loginPage.html",
    "registerPage.html",
    "pricingPage.html",
    "aboutIntroductionPage.html",
    "aboutTutorialPage.html",
    "helpCenterPage.html",
    "privacyPolicyPage.html",
    "termsAndConditionsPage.html",
    "modelLibraryPage.html",
  ];

  const loginPage = "loginPage.html"; 

  function getCookie(name) {
    const parts = `; ${document.cookie}`.split(`; ${name}=`);
    // if the split resulted in two parts, return the second part
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return null;
  }

  const token = getCookie("token");
  // example: for the URL "http://example.com/dashboard", window.location.pathname will be "/dashboard"
  // and the result of window.location.pathname.split("/") will be [ "", "dashboard" ]
  // so the current page will be "dashboard"
  const currentPage = window.location.pathname.split("/").pop();

  // Check if the current page is in our list of public pages.
  const isPublicPage = publicPages.includes(currentPage);

  if (!token && !isPublicPage) {
    window.location.href = loginPage;
  }
})();
