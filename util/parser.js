/**
 * Parses 100 items per page
 * @param {requestedFields, response}
 * @returns {object} Parsed transactions
 */
const parseTransactions = (requestedFields, response) => {
  return response.map((transaction) => {
    let row = [];
    requestedFields.asArray().forEach((field) => {
      switch (field.getId()) {
        case "accountName":
          return row.push(transaction.BankAccount.Name);
        case "transactionType":
          return row.push(transaction.Type);
        case "transactionDate":
          // Parse Xero DateString from 'YYYY-MM-DDTHH:MM:SS' to 'YYYYMMDD'
          return row.push(
            Utilities.formatDate(
              new Date(transaction.DateString),
              "GMT",
              "yyyyMMdd"
            )
          );
        case "isReconciled":
          return row.push(transaction.IsReconciled);
        case "status":
          return row.push(transaction.Status);
        case "subTotal":
          return row.push(transaction.SubTotal);
        case "totalTax":
          return row.push(transaction.TotalTax);
        case "total":
          return row.push(transaction.Total);
        default:
          return row.push("");
      }
    });
    return { values: row };
  });
};

/**
 * No Pagination
 * @param {requestedFields, response}
 * @returns {object} Parsed bank transfers
 */
const parseTransfers = (requestedFields, response) => {
  return response.map((transfer) => {
    let row = [];
    requestedFields.asArray().forEach((field) => {
      switch (field.getId()) {
        case "BankTransferID":
          return row.push(transfer.BankTransferID);
        case "FromBankAccount":
          return row.push(transfer.FromBankAccount.Name);
        case "ToBankAccount":
          return row.push(transfer.ToBankAccount.Name);
        case "transferDate":
          return row.push(
            Utilities.formatDate(
              new Date(transfer.DateString),
              "GMT",
              "yyyyMMdd"
            )
          );
        case "amount":
          return row.push(transfer.Amount);
        default:
          return row.push("");
      }
    });
    return { values: row };
  });
};

/**
 * Parses 100 items per page
 * @param {requestedFields, response}
 * @returns {object} Parsed invoices
 */
const parseInvoices = (requestedFields, response) => {
  return response.map((invoice) => {
    let row = [];
    requestedFields.asArray().forEach((field) => {
      switch (field.getId()) {
        case "invoiceNumber":
          return row.push(invoice.InvoiceNumber);
        case "invoiceType":
          return row.push(invoice.Type);
        case "contactName":
          return row.push(invoice.Contact.Name);
        case "invoiceDate":
          return row.push(
            Utilities.formatDate(
              new Date(invoice.DateString),
              "GMT",
              "yyyyMMdd"
            )
          );
        case "dueDate":
          return row.push(
            Utilities.formatDate(
              new Date(invoice.DueDateString),
              "GMT",
              "yyyyMMdd"
            )
          );
        case "status":
          return row.push(invoice.Status);
        case "amountDue":
          return row.push(invoice.AmountDue);
        case "amountPaid":
          return row.push(invoice.AmountPaid);
        case "SubTotal":
          return row.push(invoice.SubTotal);
        case "totalTax":
          return row.push(invoice.TotalTax);
        case "total":
          return row.push(invoice.Total);
        default:
          return row.push("");
      }
    });
    return { values: row };
  });
};

/**
 * No pagination
 * @param {requestedFields, response}
 * @returns {object} Parsed items
 */
const parseItems = (requestedFields, response) => {
  return response.map((item) => {
    let row = [];
    requestedFields.asArray().forEach((field) => {
      switch (field.getId()) {
        case "Name":
          return row.push(item.Name);
        case "AccountCode":
          return row.push(item.SalesDetails.AccountCode);
        case "TaxType":
          return row.push(item.SalesDetails.TaxType);
        case "isSold":
          return row.push(item.IsSold);
        case "isPurchased":
          return row.push(item.IsPurchased);
        case "UnitPrice":
          return row.push(item.SalesDetails.UnitPrice);
        default:
          return row.push("");
      }
    });
    return { values: row };
  });
};

/**
 * No pagination
 * @param {requestedFields, response}
 * @returns {object} Parsed Profit and Loss
 */
const parsePNL = (requestedFields, rawResponse) => {
  let reports = rawResponse.Rows;
  let dateHeaders = [];
  reports[0].Cells.forEach((cell) => {
    if (cell.Value != "") {
      let str = cell.Value.split(" ");
      let date = new Date(`20${str[2]}`, months[str[1]], str[0]);
      let reportDate = Utilities.formatDate(date, "GMT", "yyyyMMdd");
      dateHeaders = [...dateHeaders, reportDate];
    }
  });
  let values = [];
  let placeHolder = [];
  reports.forEach((report) => {
    if (report.RowType != "Header") {
      if (report.Rows.length == 1) {
        // dateHeaders.forEach((dateHeader) => {
        let columns = report.Rows[0].Cells.length;
        if (columns < 3) {
          let res = [];
          requestedFields.asArray().forEach((field) => {
            switch (field.getId()) {
              case "Name":
                res = [...res, report.Title];
                break;
              case "Attribute":
                res = [...res, report.RowType];
                break;
              case "ReportDate":
                let str = reports[0].Cells[1].Value.split(" ");
                let date = new Date(`20${str[2]}`, months[str[1]], str[0]);
                let reportDate = Utilities.formatDate(date, "GMT", "yyyyMMdd");

                res = [...res, reportDate];
                break;
              case "Product":
                res = [...res, report.Rows[0].Cells[0].Value];
                break;
              case "Value":
                res = [...res, report.Rows[0].Cells[1].Value];
                break;
              default:
                res = [...res, ""];
            }
          });
          values = [...values, { values: res }];
        } else {
          columns--; // remove 1st column as we only need the columns that has the int values
          for (let i = 0; i < columns; i++) {
            let res = [];
            requestedFields.asArray().forEach((field) => {
              switch (field.getId()) {
                case "Name":
                  res = [...res, report.Title];
                  break;
                case "Attribute":
                  res = [...res, report.RowType];
                  break;
                case "ReportDate":
                  let str = reports[0].Cells[i + 1].Value.split(" ");
                  let date = new Date(`20${str[2]}`, months[str[1]], str[0]);
                  let reportDate = Utilities.formatDate(
                    date,
                    "GMT",
                    "yyyyMMdd"
                  );

                  res = [...res, reportDate];
                  break;
                case "Product":
                  res = [...res, report.Rows[0].Cells[0].Value];
                  break;
                case "Value":
                  res = [...res, report.Rows[0].Cells[i + 1].Value]; // start at index + 1 as 0 is for the product
                  break;
                default:
                  res = [...res, ""];
              }
            });
            values = [...values, { values: res }];
          }
        }
        // });
      } else {
        report.Rows.forEach((row) => {
          if (row.RowType == "Row") {
            let columns = report.Rows[0].Cells.length - 1; // remove 1st column as we only need the columns that has the int values
            for (let i = 0; i < columns; i++) {
              let placeHolderRow = [];
              requestedFields.asArray().forEach((field) => {
                switch (field.getId()) {
                  case "Name":
                    placeHolderRow = [...placeHolderRow, report.Title];
                    break;
                  case "Attribute":
                    placeHolderRow = [...placeHolderRow, report.RowType];
                    break;
                  case "ReportDate":
                    let str = reports[0].Cells[i + 1].Value.split(" ");
                    let date = new Date(`20${str[2]}`, months[str[1]], str[0]);
                    let reportDate = Utilities.formatDate(
                      date,
                      "GMT",
                      "yyyyMMdd"
                    );

                    placeHolderRow = [...placeHolderRow, reportDate];
                    break;
                  case "Product":
                    placeHolderRow = [...placeHolderRow, row.Cells[0].Value];
                    break;
                  case "Value":
                    placeHolderRow = [
                      ...placeHolderRow,
                      row.Cells[i + 1].Value, // start at index + 1 as 0 is for the product
                    ];
                    break;
                  default:
                    placeHolderRow = [...placeHolderRow, ""];
                }
              });
              placeHolder = [...placeHolder, { values: placeHolderRow }];
            }
          }
        });
      }
    }
  });

  values = [...values, ...placeHolder];
  return values;
};
