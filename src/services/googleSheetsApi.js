// Google Apps Script Webhook Endpoint URL
const APPS_SCRIPT_WEBHOOK_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL";

export async function authenticateUser(email, password) {
  const response = await fetch(APPS_SCRIPT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password }),
  });
  return response.json();
}

export async function registerAdminUser(userData) {
  const response = await fetch(APPS_SCRIPT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "register", ...userData }),
  });
  return response.json();
}

export async function fetchSheetData(spreadsheetId, tabName) {
  const response = await fetch(`${APPS_SCRIPT_WEBHOOK_URL}?spreadsheetId=${spreadsheetId}&tab=${tabName}`);
  return response.json();
}

export async function updateSheetRecord(spreadsheetId, tabName, recordData) {
  const response = await fetch(APPS_SCRIPT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "updateRecord", spreadsheetId, tabName, recordData }),
  });
  return response.json();
}