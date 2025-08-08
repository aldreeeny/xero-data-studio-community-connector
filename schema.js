/**
 * @param {object} request The request data from Google Data Studio
 * @returns {object} Object which contains schema fields
 */
const getSchema = (request) => {
  let fields = getFields(request).build();
  return { schema: fields };
};

/**
 * @param {object} request The request data passed from getSchema
 * @returns {object} fields The fields based on the request.
 */
const getFields = (request) => {
  let cc = DataStudioApp.createCommunityConnector();
  let fields = cc.getFields();
  let types = cc.FieldType;
  let aggregations = cc.AggregationType;

  if (request.configParams == undefined || request.configParams == null) {
    DataStudioApp.createCommunityConnector()
      .newUserError()
      .setDebugText("Configuration Error")
      .setText("You must select your Organization and a Xero data to retrieve.")
      .throwException();
  }

  if (request.configParams.dataType == "BankTransactions") {
    // Bank Transactions Schema
    fields
      .newDimension()
      .setId("accountName")
      .setName("Bank Account Name")
      .setType(types.TEXT)
      .setDescription("The bank account name.");

    fields
      .newDimension()
      .setId("transactionType")
      .setName("Type")
      .setType(types.TEXT)
      .setDescription("The bank transaction type.");

    fields
      .newDimension()
      .setId("transactionDate")
      .setName("Date")
      .setType(types.YEAR_MONTH_DAY)
      .setDescription("The Date of transaction - YYYY-MM-DD.");

    fields
      .newDimension()
      .setId("isReconciled")
      .setName("Reconciled")
      .setType(types.BOOLEAN)
      .setDescription("Boolean to show if transaction is reconciled	.");

    fields
      .newDimension()
      .setId("status")
      .setName("Status")
      .setType(types.TEXT)
      .setDescription("Bank transaction status code.");

    fields
      .newMetric()
      .setId("subTotal")
      .setName("Subtotal")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("Total of bank transaction excluding taxes.");

    fields
      .newMetric()
      .setId("totalTax")
      .setName("Total Tax")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("Total tax on bank transaction.");

    fields
      .newMetric()
      .setId("total")
      .setName("Total")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("Total of bank transaction tax inclusive.");
  } else if (request.configParams.dataType == "BankTransfers") {
    // Bank Transfers Schema
    fields
      .newDimension()
      .setId("BankTransferID")
      .setName("Transfer ID")
      .setType(types.TEXT)
      .setDescription("The identifier of the Bank Transfer.");

    fields
      .newDimension()
      .setId("FromBankAccount")
      .setName("From Bank Account")
      .setType(types.TEXT)
      .setDescription("The source of the bank transfer.");

    fields
      .newDimension()
      .setId("ToBankAccount")
      .setName("To Bank Account")
      .setType(types.TEXT)
      .setDescription("The receipient of the bank transfer.");

    fields
      .newDimension()
      .setId("transferDate")
      .setName("Transfer Date")
      .setType(types.YEAR_MONTH_DAY)
      .setDescription("The date of the Transfer YYYY-MM-DD.");

    fields
      .newMetric()
      .setId("amount")
      .setName("Amount")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("The amount of the bank transfer.");
  } else if (request.configParams.dataType == "Invoices") {
    // Invoices schema
    fields
      .newDimension()
      .setId("invoiceNumber")
      .setName("Number")
      .setType(types.TEXT)
      .setDescription("The tracking number of the invoice");

    fields
      .newDimension()
      .setId("invoiceType")
      .setName("Type")
      .setType(types.TEXT)
      .setDescription("The type of invoice, ACCREC or ACCPAY.");

    fields
      .newDimension()
      .setId("contactName")
      .setName("Contact Name")
      .setType(types.TEXT)
      .setDescription("The name of the contact in the invoice.");

    fields
      .newDimension()
      .setId("invoiceDate")
      .setName("Date")
      .setType(types.YEAR_MONTH_DAY)
      .setDescription("The date of the invoice.");

    fields
      .newDimension()
      .setId("dueDate")
      .setName("Due Date")
      .setType(types.YEAR_MONTH_DAY)
      .setDescription("The due date of the invoice.");

    fields
      .newDimension()
      .setId("status")
      .setName("Status")
      .setType(types.TEXT)
      .setDescription("The status of the invoice.");

    fields
      .newMetric()
      .setId("amountDue")
      .setName("Amount Due")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("Amount due in AUD.");

    fields
      .newMetric()
      .setId("amountPaid")
      .setName("Amount Paid")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("Amount paid in AUD.");

    fields
      .newMetric()
      .setId("SubTotal")
      .setName("Subtotal")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("The amount excluding tax.");

    fields
      .newMetric()
      .setId("totalTax")
      .setName("Total Tax")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("The tax amount.");

    fields
      .newMetric()
      .setId("total")
      .setName("Total")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("The total amount including tax.");
  } else if (request.configParams.dataType == "Items") {
    // Purchase items schema
    fields
      .newDimension()
      .setId("Name")
      .setName("Name")
      .setType(types.TEXT)
      .setDescription("The name of the item.");

    fields
      .newDimension()
      .setId("AccountCode")
      .setName("Account Code")
      .setType(types.TEXT)
      .setDescription("The inventory asset account code for the item.");

    fields
      .newDimension()
      .setId("TaxType")
      .setName("Tax Type")
      .setType(types.TEXT)
      .setDescription("The Xero tax type.");

    fields
      .newDimension()
      .setId("isSold")
      .setName("Sold")
      .setType(types.BOOLEAN)
      .setDescription("Is the item available on sales transactions.");

    fields
      .newDimension()
      .setId("isPurchased")
      .setName("Purchased")
      .setType(types.BOOLEAN)
      .setDescription("Is the item available on purchase transactions.");

    fields
      .newMetric()
      .setId("UnitPrice")
      .setName("Unit Price")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("The unit price of the item.");
  } else if (request.configParams.dataType == "Reports/ProfitAndLoss") {
    // Reports schema
    fields
      .newDimension()
      .setId("Name")
      .setName("Name")
      .setType(types.TEXT)
      .setDescription("The name of the report item.");

    fields
      .newDimension()
      .setId("Attribute")
      .setName("Attribute")
      .setType(types.TEXT)
      .setDescription("The name of the report attribute.");

    fields
      .newDimension()
      .setId("Product")
      .setName("Product")
      .setType(types.TEXT)
      .setDescription("The name of the product.");

    fields
      .newDimension()
      .setId("ReportDate")
      .setName("Date")
      .setType(types.YEAR_MONTH_DAY)
      .setDescription("The date of report - YYYY-MM-DD.");

    fields
      .newMetric()
      .setId("Value")
      .setName("Value")
      .setType(types.NUMBER)
      .setAggregation(aggregations.SUM)
      .setDescription("The value of the attribute.");
  }

  return fields;
};
