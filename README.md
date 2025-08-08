

# Xero Data Studio Community Connector

This project is a [Google Data Studio](https://developers.google.com/datastudio) Community Connector for Xero Accounting. It allows you to connect your Xero account to Data Studio and visualize accounting data such as bank transactions, invoices, items, bank transfers, and profit & loss reports.

## Features

- Connect to Xero using OAuth2 authentication.
- Select from multiple Xero endpoints (Bank Transactions, Bank Transfers, Invoices, Items, Profit & Loss).
- Handles pagination and date filtering for large datasets.
- Designed for easy deployment as a Google Apps Script Data Studio connector.

## File Structure

- `auth.js` — Handles OAuth2 authentication and token management.
- `config.js` — Builds the configuration UI for selecting organization and data type.
- `schema.js` — Defines schema for each endpoint.
- `data.js` — Fetches and parses data from the Xero API.
- `util/service.js` — Configures the OAuth2 service (**update with your credentials**).
- `util/xero-api.js` — Helper functions for Xero API requests.
- `util/parser.js` — Functions to parse API responses.
- `util/util.js` — Utility functions for date handling.
- `util/constants.js` — Month mapping for date parsing.
- `appsscript.json` / `.clasp.json` — Project and deployment configuration.

## Setup & Deployment

1. **Xero API Credentials:**  
   - Replace `YOUR_XERO_CLIENT_ID`, `YOUR_XERO_CLIENT_SECRET`, and `YOUR_SCRIPT_REDIRECT_URI` in `util/service.js` with your actual credentials.
   - **Do not commit your real credentials to version control.**

2. **Google Apps Script Project:**  
   - Deploy the scripts as a new Apps Script project.
   - Set up OAuth2 library as a dependency.

3. **Deploy as Data Studio Connector:**  
   - In the Apps Script editor, click **Deploy > New deployment**.
   - Set the necessary scopes and deploy.

4. **Use in Data Studio:**  
   - Add the connector to your Data Studio account.
   - Authenticate with Xero and select your organization and data type.

## Security

- **Never commit real client IDs, secrets, or sensitive credentials to version control.**
- Use placeholders in code and supply credentials securely at runtime.

## License


