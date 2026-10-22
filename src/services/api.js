const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxBTL6xjL1jqa3yf6qhzBWdY27kzsDAkEcTtI6Mod-oatH_cg_XcMznI0tpPIEkOdgV6w/exec";

export async function apiRegister(formData) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "register", ...formData })
  });
  return response.json();
}

export async function apiLogin(email, password) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "login", email, password })
  });
  return response.json();
}

export async function apiUpdateRegistry(clientId, email, retellAgentId, assignedPhone) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "updateRegistry", clientId, email, retellAgentId, assignedPhone })
  });
  return response.json();
}

// Throws when the backend reports an error so dashboards never show a failed write as saved.
export async function apiWriteRecord(spreadsheetId, tabName, rowArray) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "writeRecord", spreadsheetId, tabName, rowArray })
  });
  const result = await response.json();
  if (!result || result.status !== "success") {
    throw new Error(result?.message || "Failed to write record.");
  }
  return result;
}

export async function apiUpdateRecord(spreadsheetId, tabName, recordId, rowArray) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "updateRecord", spreadsheetId, tabName, recordId, rowArray })
  });
  const result = await response.json();
  if (!result || result.status !== "success") {
    throw new Error(result?.message || "Failed to update record.");
  }
  return result;
}

export async function apiDeleteRecord(spreadsheetId, tabName, recordId) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "deleteRecord", spreadsheetId, tabName, recordId })
  });
  const result = await response.json();
  if (!result || result.status !== "success") {
    throw new Error(result?.message || "Failed to delete record.");
  }
  return result;
}

export async function apiSaveProfile(spreadsheetId, tabName, rowArray) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "saveProfile", spreadsheetId, tabName, rowArray })
  });
  const result = await response.json();
  if (!result || result.status !== "success") {
    throw new Error(result?.message || "Failed to save profile.");
  }
  return result;
}

export async function apiFetchDashboard(spreadsheetId) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "fetchDashboard", spreadsheetId })
  });
  return response.json();
}
