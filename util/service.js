/**
 * Returns the configured OAuth Service.
 * @return {Service} The OAuth Service
 */
const getOAuthService = () => {
  return OAuth2.createService("Xero")
    .setAuthorizationBaseUrl(
      "https://login.xero.com/identity/connect/authorize"
    )
    .setTokenUrl("https://identity.xero.com/connect/token")
    .setClientId("YOUR_XERO_CLIENT_ID_HERE")
    .setClientSecret("YOUR_XERO_CLIENT_SECRET_HERE")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setCache(CacheService.getUserCache())
    .setParam("access_type", "offline")
    .setRedirectUri(
      "YOUR_GOOGLE_APPS_SCRIPT_REDIRECT_URI_HERE"
    )
    .setCallbackFunction("authCallback")
    .setScope(
      "openid profile email accounting.reports.read accounting.transactions.read accounting.settings offline_access"
    );
};
