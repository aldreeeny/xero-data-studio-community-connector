/**
 * @param {object} request The request data from Google Data Studio
 * @returns {object} data
 */
const getData = (request) => {
  const baseUrl = "https://api.xero.com/api.xro/2.0/";
  const cc = DataStudioApp.createCommunityConnector();
  let dataType = request.configParams.dataType;
  let tenantId = request.configParams.organization;
  let url,
    rows,
    apiData = [],
    apiResponse = [];
  let periods = 0;

  let requestedFieldIds = request.fields.map((field) => field.name);
  let requestedFields = getFields(request).forIds(requestedFieldIds);

  // Parse DSCC request date from 'yyyy-MM-dd' to 'YYYY,mm,DD'
  let startDate = new Date(request.dateRange.startDate);
  let endDate = new Date(request.dateRange.endDate);
  let start = Utilities.formatDate(startDate, "GMT", "yyyy,MM,dd");
  let end = Utilities.formatDate(endDate, "GMT", "yyyy,MM,dd");

  // Get paginated API data
  // Only applicable to BankTransactions, Invoices, and PurchaseOrders
  if (
    dataType == "BankTransactions" ||
    dataType == "Invoices" ||
    dataType == "PurchaseOrders"
  ) {
    // Build WHERE header and URI encode
    let where = encodeURIComponent(
      `Date>=DateTime(${start})&&Date<=DateTime(${end})`
    );

    // Loop counter
    let counter = 1;

    do {
      url = `${baseUrl + dataType}?where=${where}&page=${counter}`;
      apiResponse = getApiData(url, dataType, tenantId);
      apiData = [...apiData, ...apiResponse];
      counter++;
    } while (apiResponse.length > 0);
  } else if (
    dataType == "Reports/ProfitAndLoss" ||
    dataType == "Reports/BalanceSheet"
  ) {
    // Profit and loss
    // Get periods based on duration
    periods = Math.floor(
      endDate.getMonth() -
        startDate.getMonth() +
        12 * (endDate.getFullYear() - startDate.getFullYear())
    );

    let startReport = Utilities.formatDate(startDate, "GMT", "yyyy-MM-dd");
    let endReport = Utilities.formatDate(endDate, "GMT", "yyyy-MM-dd");

    // Build the full URL
    url = `${
      baseUrl + dataType
    }?fromDate=${startReport}&toDate=${endReport}&timeframe=MONTH`;

    // Add period if non-zero
    if (periods > 0) {
      url += `&periods=${periods}`;
    }

    if (daysBetween(startDate, endDate) <= 365) {
      apiData = getApiData(url, "Reports", tenantId);
    } else {
      cc.newUserError()
        .setDebugText("Error fetching data from API.")
        .setText(
          "The date range for the P&L Report must be less than 365 days difference."
        )
        .throwException();
    }
  } else if (dataType == "Items") {
    // Items
    url = baseUrl + dataType;
    apiData = getApiData(url, dataType, tenantId);
  } else {
    // For non-paged API endpoints
    // Applicable to BankTransfers

    // Build WHERE header then URI encode
    let where = encodeURIComponent(
      `Date>=DateTime(${start})&&Date<=DateTime(${end})`
    );

    url = `${baseUrl + dataType}?where=${where}`;
    apiData = getApiData(url, dataType, tenantId);
  }

  // Parse API data to tabular format
  if (dataType == "BankTransactions") {
    rows = parseTransactions(requestedFields, apiData);
  } else if (dataType == "BankTransfers") {
    rows = parseTransfers(requestedFields, apiData);
  } else if (dataType == "Invoices") {
    rows = parseInvoices(requestedFields, apiData);
  } else if (dataType == "Items") {
    rows = parseItems(requestedFields, apiData);
  } else if (dataType == "Reports/ProfitAndLoss") {
    rows = parsePNL(requestedFields, apiData[0]);
  } else if (dataType == "Reports/BalanceSheet") {
    rows = parseBalanceSheet(requestedFields, apiData[0]);
  } else if (dataType == "Journals") {
    rows = parseJournals(requestedFields, apiData);
  } else {
    rows = "";
  }

  let data = {
    schema: requestedFields.build(),
    rows: rows,
  };

  return data;
};
