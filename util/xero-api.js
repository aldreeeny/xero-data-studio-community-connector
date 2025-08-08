/**
 * Retrieves all tenants from your organization
 * @returns {object} Array of tenant objects
 */
const getTenants = () => {
  const tenantUrl = "https://api.xero.com/connections";

  let service = getOAuthService();
  let token = service.getAccessToken();

  let response = UrlFetchApp.fetch(tenantUrl, {
    method: "get",
    muteHttpExceptions: false,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let parsedResponse = JSON.parse(response.getContentText());
  return parsedResponse;
};

/**
 * Retrieves the organization name
 * @param {string} tenantId Required to retrieve organization data
 * @returns {string} Name of the organzation
 */
const getOrganization = (tenantId) => {
  const orgUrl = "https://api.xero.com/api.xro/2.0/Organisations";

  let service = getOAuthService();
  let token = service.getAccessToken();

  let response = UrlFetchApp.fetch(orgUrl, {
    method: "get",
    muteHttpExceptions: false,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Xero-tenant-id": tenantId,
    },
  });

  let parsedResponse = JSON.parse(response.getContentText());
  return parsedResponse;
};

/**
 * Fetch Xero API Data
 * @param {url, dataType, tenantId}
 * @returns {object} Parsed Data
 */
const getApiData = (url, dataType, tenantId) => {
  let service = getOAuthService();
  let token = service.getAccessToken();

  let response = UrlFetchApp.fetch(url, {
    method: "get",
    muteHttpExceptions: false,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Xero-tenant-id": tenantId,
    },
  });

  // Parse into array of data
  let parsedResponse = JSON.parse(response.getContentText());
  let parsedData = parsedResponse[dataType];
  return parsedData;
};
