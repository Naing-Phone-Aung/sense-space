export class AuthManager {
  constructor(app) {
    this.app = app; 
  }

  _getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  isPremium() {
    const userInfoCookie = this._getCookie("user_info");
    if (!userInfoCookie) {
      return false;
    }

    try {
      const decodedCookie = decodeURIComponent(userInfoCookie);
      const userInfo = JSON.parse(decodedCookie);
      // Returns true only if the subscription status is exactly "premium"
      return userInfo && userInfo.subscription === "premium";
    } catch (error) {
      console.error("Failed to parse user_info cookie:", error);
      return false; 
    }
  }

  isModelLimitEnforced() {
    return !this.isPremium();
  }
}
