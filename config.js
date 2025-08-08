/**
 * @param {object} request The request data from Google Data Studio
 * @returns {object} config
 */
const getConfig = (request) => {
  let cc = DataStudioApp.createCommunityConnector();
  let config = cc.getConfig();

  config
    .newInfo()
    .setId("xeroBaseInformation")
    .setText(
      "The Xero Connector by itGenius allows you to pull information from Xero to utilize in Data Studio"
    );

  config
    .newInfo()
    .setId("importantNote")
    .setText(
      "Data Studio connectors can currently only handle queries that take less thank 6 minutes to run. It is also advisable to have a maximum of 5-6 graphs per dashboard to ensure no performance issues will be encountered."
    );

  let tenants = getTenants();
  let organizations = [];

  tenants.forEach((tenant) => {
    let organization = getOrganization(tenant.tenantId);
    organizations = [
      ...organizations,
      {
        id: tenant.tenantId,
        name: organization,
      },
    ];
  });

  let org = config
    .newSelectSingle()
    .setId("organization")
    .setName("Select your Organization");

  organizations.forEach((organization) => {
    org.addOption(
      config
        .newOptionBuilder()
        .setLabel(organization.name.Organisations[0].Name)
        .setValue(organization.id)
    );
  });

  config
    .newSelectSingle()
    .setId("dataType")
    .setName("Select the Xero data to retrieve")
    .setHelpText(
      "A new data source must be created if you would like multiple pieces of data from Xero to appear in Google Data Studio"
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Bank Transactions")
        .setValue("BankTransactions")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Bank Transfers")
        .setValue("BankTransfers")
    )
    .addOption(
      config.newOptionBuilder().setLabel("Invoices").setValue("Invoices")
    )
    .addOption(
      config.newOptionBuilder().setLabel("Items").setValue("Items")
    )
    .addOption(
      config
        .newOptionBuilder()
        .setLabel("Reports - Profit and Loss")
        .setValue("Reports/ProfitAndLoss")
    );

  config.setDateRangeRequired(true);
  return config.build();
};
