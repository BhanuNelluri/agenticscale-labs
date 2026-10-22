// ============================================================================
// CENTRAL MASTER REGISTRY CONFIGURATION
// ============================================================================
const MASTER_SHEET_ID = "1JF8zJVjWer-n9RMO6Zuwzcvdu2NdSY5iPQgzVWmy1Vc";

// Template IDs verified against the live spreadsheets' tab names (Oct 2026).
const TEMPLATE_SHEETS = {
  "Clinics & Healthcare": "1GwtYXeKoez2JM5WSIdfRZPLaX0tT_dgSsuQbOfGAuXs",          // Clinic_Profiles, Doctors_Staff, Services_Catalog, LOGS_Clinics
  "HVAC & Home Services": "1JGUe6Yn41X7PbVyNstJV1pGeFapRu4zdS0hHPLI1B-o",          // HVAC_Profiles, Technicians, Jobs_Services, LOGS_HomeServices
  "Salons & MedSpas": "1zdoc_ZGBogFQoFYZr_qCVWQuN4XkmhIjgpuza-LoLUA",              // MedSpa_Profiles, Aestheticians_Staff, Treatments_Catalog, LOGS_MedSpa
  "Gyms & Fitness Studios": "1rfwKQhzZaW2Et9Rw00h7KRIonQNVGPI4xJ-VTUk9YCw",        // Gym_Profiles, Coaches_Trainers, Membership_Plans, LOGS_Fitness
  "Auto Repair & Detailing": "1bGakf7rqPeKbsVlRXNrl2c9l758I8lNPqorbf5Nwhm8",       // Auto_Profiles, Mechanics_Techs, Service_Packages, LOGS_Auto
  "Veterinary Clinics": "1Lgyv6Nd-hNB9dw341RScke4Ewby91HJPF9ksAoE95Ag",            // Vet_Profiles, Veterinarians_Staff, Vet_Services, LOGS_Vet
  "Real Estate & Property Management": "1GPwk2qjC7DmNrlISZiTZMmhxQHLxf1jSzsMDDebkIT4" // RealEstate_Profiles, Agents_LeasingStaff, Property_Listings, LOGS_RealEstate
};

const RETELL_AGENT_MAP = {
  "Clinics & Healthcare": "agent_clinic_v1_prod",
  "HVAC & Home Services": "agent_hvac_v1_prod",
  "Salons & MedSpas": "agent_salon_v1_prod",
  "Gyms & Fitness Studios": "agent_gym_v1_prod",
  "Auto Repair & Detailing": "agent_auto_v1_prod",
  "Veterinary Clinics": "agent_vet_v1_prod",
  "Real Estate & Property Management": "agent_realestate_v1_prod"
};

const LOG_TAB_MAP = {
  "Clinics & Healthcare": "LOGS_Clinics",
  "HVAC & Home Services": "LOGS_HomeServices",
  "Salons & MedSpas": "LOGS_MedSpa",
  "Gyms & Fitness Studios": "LOGS_Fitness",
  "Auto Repair & Detailing": "LOGS_Auto",
  "Veterinary Clinics": "LOGS_Vet",
  "Real Estate & Property Management": "LOGS_RealEstate"
};

const DEFAULT_PLAN = "Growth Pro ($299/mo)";

// ============================================================================
// WEBHOOK CONTROLLER
// ============================================================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "register") {
      return handleRegister(data);
    } else if (action === "login") {
      return handleLogin(data);
    } else if (action === "updateRegistry") {
      return handleUpdateRegistry(data);
    } else if (action === "writeRecord") {
      return handleWriteRecord(data);
    } else if (action === "updateRecord") {
      return handleUpdateRecord(data);
    } else if (action === "deleteRecord") {
      return handleDeleteRecord(data);
    } else if (action === "saveProfile") {
      return handleSaveProfile(data);
    } else if (action === "fetchDashboard") {
      return handleFetchDashboard(data);
    }

    return jsonResponse({ status: "error", message: "Invalid action type" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// ============================================================================
// ============================================================================
// CRYPTO / HASHING HELPERS (SHA-256 for secure password hashing)
// ============================================================================
function hashPassword(password) {
  const rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  var output = "";
  for (var i = 0; i < rawHash.length; i++) {
    var byteValue = rawHash[i];
    if (byteValue < 0) byteValue += 256;
    var byteString = byteValue.toString(16);
    if (byteString.length == 1) byteString = "0" + byteString;
    output += byteString;
  }
  return output;
}

// VALUE HELPERS (nullability / Sheets coercion guards)
// ============================================================================
function cleanString(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

// Treats empty cells and Sheets error values (e.g. "#ERROR!" from a "+..." string parsed as a formula) as blank.
function isBlankValue(value) {
  const s = cleanString(value);
  return s === "" || /^#(ERROR|REF|NAME|VALUE|N\/A|NUM|DIV)/i.test(s);
}

function firstNonBlank() {
  for (let i = 0; i < arguments.length; i++) {
    if (!isBlankValue(arguments[i])) {
      return cleanString(arguments[i]);
    }
  }
  return "";
}

function normalizeEmail(value) {
  return cleanString(value).toLowerCase();
}

function normalizePhone(value) {
  return cleanString(value).replace(/[\s().-]/g, "");
}

function generateInboundNumber() {
  const digits = String(Math.floor(1000000 + Math.random() * 9000000));
  return "+1 (800) " + digits.substring(0, 3) + "-" + digits.substring(3);
}

// Appends a row without letting Sheets interpret values as formulas/numbers.
// - null/undefined cells become ""
// - cells starting with = + - @ are stored as literal text
// - forceTextCols (0-based) are always stored as text (phone numbers, IDs)
function appendRowSafe(sheet, row, forceTextCols) {
  const textCols = forceTextCols || [];
  const safeRow = row.map(function (cell) {
    return cell === null || cell === undefined ? "" : cell;
  });
  const rowNum = sheet.getLastRow() + 1;
  if (rowNum > sheet.getMaxRows()) {
    sheet.insertRowsAfter(sheet.getMaxRows(), 1);
  }
  safeRow.forEach(function (cell, idx) {
    const risky = typeof cell === "string" && /^[=+\-@]/.test(cell);
    if (risky || textCols.indexOf(idx) !== -1) {
      sheet.getRange(rowNum, idx + 1).setNumberFormat("@");
    }
  });
  sheet.getRange(rowNum, 1, 1, safeRow.length).setValues([safeRow]);
}

// Multi-tenant guard: only spreadsheets provisioned through Phone_Registry may be read or written.
function isRegisteredSpreadsheet(spreadsheetId) {
  const id = cleanString(spreadsheetId);
  if (!id) return false;
  const registries = SpreadsheetApp.openById(MASTER_SHEET_ID).getSheetByName("Phone_Registry").getDataRange().getValues();
  for (let i = 1; i < registries.length; i++) {
    if (cleanString(registries[i][5]) === id) return true;
  }
  return false;
}

// ============================================================================
// HANDLERS
// ============================================================================
function handleRegister(data) {
  const ownerName = cleanString(data.ownerName);
  const email = normalizeEmail(data.email);
  const password = data.password === null || data.password === undefined ? "" : String(data.password);
  const businessName = cleanString(data.businessName);
  const industry = cleanString(data.industry);
  const phone = normalizePhone(data.phone);

  if (!ownerName || !email || !password || !businessName || !industry || !phone) {
    return jsonResponse({ status: "error", message: "Owner name, email, password, business name, industry and phone are all required." });
  }
  if (!TEMPLATE_SHEETS[industry]) {
    return jsonResponse({ status: "error", message: "Unknown industry: " + industry });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const masterSs = SpreadsheetApp.openById(MASTER_SHEET_ID);
    const clientAccountsSheet = masterSs.getSheetByName("Client_Accounts");
    const phoneRegistrySheet = masterSs.getSheetByName("Phone_Registry");

    // Check if account already exists (case-insensitive)
    const accountsData = clientAccountsSheet.getDataRange().getValues();
    for (let i = 1; i < accountsData.length; i++) {
      if (normalizeEmail(accountsData[i][2]) === email) {
        return jsonResponse({ status: "error", message: "Account with this email already exists." });
      }
    }

    // 1. Duplicate pre-formatted industry template sheet
    const templateFile = DriveApp.getFileById(TEMPLATE_SHEETS[industry]);
    const newSheetFile = templateFile.makeCopy(businessName + " - Database");
    const provisionedSheetId = newSheetFile.getId();
    newSheetFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);

    // 2. Provision IDs and Inbound Line (placeholders until the owner saves real Retell values on /deploy)
    const retellAgentId = RETELL_AGENT_MAP[industry] || "agent_default_v1";
    const assignedPhone = generateInboundNumber();
    const clientId = "CLI-" + Date.now();
    const logTabName = LOG_TAB_MAP[industry] || "LOGS_General";

    // 3. Write into Client_Accounts
    // Headers: [Client_ID, Owner_Full_Name, Owner_Email, Owner_Phone, Business_Name, Industry_Category, Web_Portal_Password_Hash, Stripe_Customer_ID, Subscription_Tier, Account_Status, Registered_Date]
    appendRowSafe(clientAccountsSheet, [
      clientId,
      ownerName,
      email,
      phone,
      businessName,
      industry,
      hashPassword(password),
      "cus_free_trial",
      DEFAULT_PLAN,
      "ACTIVE",
      new Date()
    ], [3]);

    // 4. Write into Phone_Registry
    // Headers: [Phone_Number, Client_ID, Business_Name, Industry_Category, Retell_Agent_ID, Industry_Spreadsheet_ID, Log_Tab_Name, Account_Status, Subscription_Plan, Client_Primary_Email, Created_At]
    appendRowSafe(phoneRegistrySheet, [
      assignedPhone,
      clientId,
      businessName,
      industry,
      retellAgentId,
      provisionedSheetId,
      logTabName,
      "ACTIVE",
      DEFAULT_PLAN,
      email,
      new Date()
    ], [0]);

    return jsonResponse({
      status: "success",
      user: {
        clientId: clientId,
        email: email,
        ownerName: ownerName,
        businessName: businessName,
        industry: industry,
        phone: phone,
        spreadsheetId: provisionedSheetId,
        retellAgentId: retellAgentId,
        assignedPhone: assignedPhone
      }
    });
  } finally {
    lock.releaseLock();
  }
}

function handleLogin(data) {
  const email = normalizeEmail(data.email);
  const password = data.password === null || data.password === undefined ? "" : String(data.password);

  if (!email || !password) {
    return jsonResponse({ status: "error", message: "Email and password are required." });
  }

  const masterSs = SpreadsheetApp.openById(MASTER_SHEET_ID);
  const accounts = masterSs.getSheetByName("Client_Accounts").getDataRange().getValues();
  const registries = masterSs.getSheetByName("Phone_Registry").getDataRange().getValues();

  for (let i = 1; i < accounts.length; i++) {
    // Owner_Email is column index 2 (C), Web_Portal_Password_Hash is column index 6 (G)
    const storedHash = String(accounts[i][6]);
    const inputHash = hashPassword(password);
    if (normalizeEmail(accounts[i][2]) === email && (storedHash === password || storedHash === inputHash)) {
      const clientId = cleanString(accounts[i][0]);
      const industry = cleanString(accounts[i][5]);

      let registry = null;
      for (let j = 1; j < registries.length; j++) {
        if (cleanString(registries[j][1]) === clientId) {
          registry = registries[j];
          break;
        }
      }

      if (!registry || isBlankValue(registry[5])) {
        return jsonResponse({ status: "error", message: "Account found but no provisioned database exists for it. Please contact support." });
      }

      return jsonResponse({
        status: "success",
        user: {
          clientId: clientId,
          ownerName: cleanString(accounts[i][1]),
          email: normalizeEmail(accounts[i][2]),
          phone: cleanString(accounts[i][3]),
          businessName: cleanString(accounts[i][4]),
          industry: industry,
          spreadsheetId: cleanString(registry[5]),
          // Fall back so these are never empty/#ERROR! even for legacy rows
          retellAgentId: firstNonBlank(registry[4], RETELL_AGENT_MAP[industry]),
          assignedPhone: firstNonBlank(registry[0], accounts[i][3])
        }
      });
    }
  }

  return jsonResponse({ status: "error", message: "Invalid email or password." });
}

// Persists the real Retell Agent ID + inbound number entered on the /deploy page.
function handleUpdateRegistry(data) {
  const clientId = cleanString(data.clientId);
  const email = normalizeEmail(data.email);
  const retellAgentId = cleanString(data.retellAgentId);
  const assignedPhone = cleanString(data.assignedPhone);

  if (!clientId || !email) {
    return jsonResponse({ status: "error", message: "clientId and email are required." });
  }
  if (!/^agent_[A-Za-z0-9_-]+$/.test(retellAgentId)) {
    return jsonResponse({ status: "error", message: "Invalid Retell Agent ID. It must start with 'agent_'." });
  }
  if (!/^\+?[0-9\s().-]{7,20}$/.test(assignedPhone)) {
    return jsonResponse({ status: "error", message: "Invalid inbound phone number." });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const masterSs = SpreadsheetApp.openById(MASTER_SHEET_ID);
    const accounts = masterSs.getSheetByName("Client_Accounts").getDataRange().getValues();
    const phoneRegistrySheet = masterSs.getSheetByName("Phone_Registry");
    const registries = phoneRegistrySheet.getDataRange().getValues();

    let ownsClient = false;
    for (let i = 1; i < accounts.length; i++) {
      if (cleanString(accounts[i][0]) === clientId && normalizeEmail(accounts[i][2]) === email) {
        ownsClient = true;
        break;
      }
    }
    if (!ownsClient) {
      return jsonResponse({ status: "error", message: "Account not found." });
    }

    for (let j = 1; j < registries.length; j++) {
      if (cleanString(registries[j][1]) === clientId) {
        // Phone_Number = column A (1), Retell_Agent_ID = column E (5)
        phoneRegistrySheet.getRange(j + 1, 1).setNumberFormat("@").setValue(assignedPhone);
        phoneRegistrySheet.getRange(j + 1, 5).setNumberFormat("@").setValue(retellAgentId);
        return jsonResponse({ status: "success", retellAgentId: retellAgentId, assignedPhone: assignedPhone });
      }
    }

    return jsonResponse({ status: "error", message: "Phone registry entry not found for this account." });
  } finally {
    lock.releaseLock();
  }
}

function handleWriteRecord(data) {
  if (!data.spreadsheetId || !data.tabName || !Array.isArray(data.rowArray)) {
    return jsonResponse({ status: "error", message: "spreadsheetId, tabName and rowArray are required." });
  }
  if (!isRegisteredSpreadsheet(data.spreadsheetId)) {
    return jsonResponse({ status: "error", message: "Unknown spreadsheet." });
  }

  const targetSs = SpreadsheetApp.openById(data.spreadsheetId);
  const sheet = targetSs.getSheetByName(data.tabName);

  if (!sheet) {
    return jsonResponse({ status: "error", message: "Tab not found: " + data.tabName });
  }

  // Schema guard: the row must have exactly one value per header column of the target tab.
  const headerCount = sheet.getLastColumn();
  if (headerCount > 0 && data.rowArray.length !== headerCount) {
    return jsonResponse({
      status: "error",
      message: "Schema mismatch for " + data.tabName + ": expected " + headerCount + " columns but received " + data.rowArray.length + "."
    });
  }

  appendRowSafe(sheet, data.rowArray);
  return jsonResponse({ status: "success", message: "Row appended successfully." });
}

function handleUpdateRecord(data) {
  if (!data.spreadsheetId || !data.tabName || !data.recordId || !Array.isArray(data.rowArray)) {
    return jsonResponse({ status: "error", message: "spreadsheetId, tabName, recordId and rowArray are required." });
  }
  if (!isRegisteredSpreadsheet(data.spreadsheetId)) {
    return jsonResponse({ status: "error", message: "Unknown spreadsheet." });
  }

  const targetSs = SpreadsheetApp.openById(data.spreadsheetId);
  const sheet = targetSs.getSheetByName(data.tabName);
  if (!sheet) {
    return jsonResponse({ status: "error", message: "Tab not found: " + data.tabName });
  }

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (cleanString(values[i][0]) === cleanString(data.recordId)) {
      sheet.getRange(i + 1, 1, 1, data.rowArray.length).setValues([data.rowArray]);
      return jsonResponse({ status: "success", message: "Record updated successfully." });
    }
  }

  return jsonResponse({ status: "error", message: "Record ID not found." });
}

function handleDeleteRecord(data) {
  if (!data.spreadsheetId || !data.tabName || !data.recordId) {
    return jsonResponse({ status: "error", message: "spreadsheetId, tabName and recordId are required." });
  }
  if (!isRegisteredSpreadsheet(data.spreadsheetId)) {
    return jsonResponse({ status: "error", message: "Unknown spreadsheet." });
  }

  const targetSs = SpreadsheetApp.openById(data.spreadsheetId);
  const sheet = targetSs.getSheetByName(data.tabName);
  if (!sheet) {
    return jsonResponse({ status: "error", message: "Tab not found: " + data.tabName });
  }

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (cleanString(values[i][0]) === cleanString(data.recordId)) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ status: "success", message: "Record deleted successfully." });
    }
  }

  return jsonResponse({ status: "error", message: "Record ID not found." });
}

function handleSaveProfile(data) {
  if (!data.spreadsheetId || !data.tabName || !Array.isArray(data.rowArray)) {
    return jsonResponse({ status: "error", message: "spreadsheetId, tabName and rowArray are required." });
  }
  if (!isRegisteredSpreadsheet(data.spreadsheetId)) {
    return jsonResponse({ status: "error", message: "Unknown spreadsheet." });
  }

  const targetSs = SpreadsheetApp.openById(data.spreadsheetId);
  const sheet = targetSs.getSheetByName(data.tabName);
  if (!sheet) {
    return jsonResponse({ status: "error", message: "Tab not found: " + data.tabName });
  }

  const lastRow = sheet.getLastRow();
  const headerCount = sheet.getLastColumn() || data.rowArray.length;

  // Pad or trim rowArray to match exact header width
  let rowToSave = data.rowArray.slice(0, headerCount);
  while (rowToSave.length < headerCount) {
    rowToSave.push("");
  }

  if (lastRow >= 2) {
    sheet.getRange(2, 1, 1, headerCount).setValues([rowToSave]);
  } else {
    appendRowSafe(sheet, rowToSave);
  }

  return jsonResponse({ status: "success", message: "Profile saved successfully." });
}


function handleFetchDashboard(data) {
  if (!isRegisteredSpreadsheet(data.spreadsheetId)) {
    return jsonResponse({ status: "error", message: "Unknown spreadsheet." });
  }

  const targetSs = SpreadsheetApp.openById(data.spreadsheetId);
  const result = {};

  targetSs.getSheets().forEach(function (s) {
    result[s.getName()] = s.getDataRange().getValues();
  });

  return jsonResponse({ status: "success", data: result });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
