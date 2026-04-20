// ============================================================
// PROPTRACK — Google Apps Script Backend
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet
// 2. Extensions → Apps Script
// 3. Delete default code, paste this entire file
// 4. Click Save (Ctrl+S)
// 5. Click "Deploy" → "New Deployment"
// 6. Type: Web App
// 7. Execute as: Me
// 8. Who has access: Anyone
// 9. Click Deploy → Copy the Web App URL
// 10. Paste that URL in PropTrack tool
// ============================================================

const SHEET_NAME = 'Leads';
const HEADERS = ['id','name','phone','email','source','property','proptype','budget','commission','status','followup','notes','createdAt','updatedAt'];

// ============================================================
// GET — Fetch all leads
// ============================================================
function doGet(e) {
  try {
    const action = e.parameter.action;
    const callback = e.parameter.callback; // JSONP support

    if (action === 'getAll') {
      const leads = getAllLeads();
      const result = { success: true, data: leads };
      if (callback) {
        return ContentService
          .createTextOutput(`${callback}(${JSON.stringify(result)})`)
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
      }
      return jsonResponse(result);
    }

    const result = { success: false, error: 'Unknown action' };
    if (callback) {
      return ContentService
        .createTextOutput(`${callback}(${JSON.stringify(result)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return jsonResponse(result);

  } catch (err) {
    const result = { success: false, error: err.toString() };
    const callback = e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(`${callback}(${JSON.stringify(result)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return jsonResponse(result);
  }
}

// ============================================================
// POST — Add / Update / Delete leads
// ============================================================
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === 'addLead') {
      const lead = addLead(payload.data);
      return jsonResponse({ success: true, data: lead });
    }

    if (action === 'updateLead') {
      const lead = updateLead(payload.data);
      return jsonResponse({ success: true, data: lead });
    }

    if (action === 'deleteLead') {
      deleteLead(payload.id);
      return jsonResponse({ success: true });
    }

    if (action === 'bulkAdd') {
      // For importing existing local data to sheet
      const leads = payload.data.map(l => addLead(l));
      return jsonResponse({ success: true, data: leads, count: leads.length });
    }

    return jsonResponse({ success: false, error: 'Unknown action' });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ============================================================
// SHEET HELPERS
// ============================================================
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    // Create sheet with headers if it doesn't exist
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);

    // Style header row
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setBackground('#1a1a2e')
      .setFontColor('#e8b84b');

    // Set column widths
    sheet.setColumnWidth(2, 150); // name
    sheet.setColumnWidth(3, 130); // phone
    sheet.setColumnWidth(5, 100); // source
    sheet.setColumnWidth(6, 200); // property
    sheet.setColumnWidth(10, 100); // status
    sheet.setColumnWidth(12, 250); // notes
  }

  return sheet;
}

function getAllLeads() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) return []; // Only header, no data

  const data = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();

  return data
    .filter(row => row[0] !== '') // Skip empty rows
    .map(row => {
      const obj = {};
      HEADERS.forEach((h, i) => { obj[h] = row[i] ? String(row[i]) : ''; });
      return obj;
    });
}

function addLead(data) {
  const sheet = getSheet();
  const id = data.id || generateId();
  const now = new Date().toISOString();

  const row = HEADERS.map(h => {
    if (h === 'id') return id;
    if (h === 'createdAt') return data.createdAt || now;
    if (h === 'updatedAt') return now;
    return data[h] || '';
  });

  sheet.appendRow(row);
  return { ...data, id, createdAt: row[12], updatedAt: now };
}

function updateLead(data) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) return null;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const rowIndex = ids.indexOf(data.id);

  if (rowIndex === -1) return null;

  const sheetRow = rowIndex + 2; // +2 for header and 0-index
  const now = new Date().toISOString();

  const row = HEADERS.map(h => {
    if (h === 'updatedAt') return now;
    return data[h] !== undefined ? data[h] : '';
  });

  sheet.getRange(sheetRow, 1, 1, HEADERS.length).setValues([row]);
  return { ...data, updatedAt: now };
}

function deleteLead(id) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) return;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  const rowIndex = ids.indexOf(id);

  if (rowIndex === -1) return;

  sheet.deleteRow(rowIndex + 2);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============================================================
// CORS HELPER
// ============================================================
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
