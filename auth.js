/**
 * Returns the Auth Type of this connector
 * @returns {object}
 */
const getAuthType = () => {
  let cc = DataStudioApp.createCommunityConnector();
  return cc.newAuthTypeResponse().setAuthType(cc.AuthType.OAUTH2).build();
};

const isAdminUser = () => {
  return false;
};

/**
 * Resets the auth service.
 */
const resetAuth = () => {
  getOAuthService().reset();
};

/**
 * Returns true if the auth service has access.
 * @return {boolean} True if the auth service has access.
 */
const isAuthValid = () => {
  return getOAuthService().hasAccess();
};

/**
 * The OAuth callback.
 * @param {object} request The request data received from the OAuth flow.
 * @return {HtmlOutput} The HTML output to show to the user.
 */
const authCallback = (request) => {
  var authorized = getOAuthService().handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput("Success! You can close this tab.");
  } else {
    return HtmlService.createHtmlOutput("Denied. You can close this tab");
  }
};

/**
 * Gets the 3P authorization URL.
 * @return {string} The authorization URL.
 * @see https://developers.google.com/apps-script/reference/script/authorization-info
 */
const get3PAuthorizationUrls = () => {
  return getOAuthService().getAuthorizationUrl();
};
