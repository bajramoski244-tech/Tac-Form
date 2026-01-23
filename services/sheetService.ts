import { LeadFormData, SubmittedLead, BudgetOption } from '../types';

const STORAGE_KEY = 'tac_leads_db';

// --- GOOGLE SHEETS INTEGRATION INSTRUCTIONS ---
// 1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/1xausDfRQQZU9oUQWJYAA6v75K7P19bm3oNvuCeHmZL8/edit?usp=sharing
// 2. Click "Extensions" > "Apps Script"
// 3. Paste the following code into the script editor (Code.gs):
/*
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date().toLocaleString("mk-MK");
    
    sheet.appendRow([
      timestamp,
      data.rooms.join(", "),
      data.goal,
      data.quality,
      data.budget,
      data.service,
      data.urgency,
      data.city,
      data.name,
      data.phone,
      data.qualified ? "YES" : "NO",
      data.notes
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"result":"success"})).setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": e})).setMimeType(ContentService.MimeType.JSON);
  }
}
*/
// 4. Click "Deploy" > "New deployment"
// 5. Select type: "Web app"
// 6. Set "Execute as": "Me"
// 7. Set "Who has access": "Anyone" (This is crucial for the form to work without login)
// 8. Click "Deploy" and Copy the "Web app URL"
// 9. Paste the URL into the variable below:

export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw.../exec";



/**
 * Determines if a lead is qualified based on the budget.
 * Rule: 150-250 den is NOT qualified.
 */
export const checkQualification = (budget: BudgetOption | ''): boolean => {
  if (budget === '150 – 250 ден') return false;
  return true;
};

/**
 * Saves the lead to LocalStorage AND (if configured) sends it to Google Sheets via Apps Script.
 */
export const saveLead = async (
  data: LeadFormData,
  notes: string
): Promise<SubmittedLead> => {

  const qualified = checkQualification(data.budget);

  const newLead: SubmittedLead = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    qualified,
    notes
  };

  if (GOOGLE_SCRIPT_URL) {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rooms: newLead.rooms,        // array
          goal: newLead.goal,
          quality: newLead.quality,
          budget: newLead.budget,
          service: newLead.service,
          urgency: newLead.urgency,
          city: newLead.city,
          name: newLead.name,
          phone: newLead.phone,
          qualified: newLead.qualified, // boolean
          notes: newLead.notes || ""
        })
      });
    } catch (err) {
      console.error("Google Sheets send failed:", err);
    }
  }

  // ✅ VERY IMPORTANT
  return newLead;
};


export const getLeads = (): SubmittedLead[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const generateCSV = (leads: SubmittedLead[]): string => {
  const headers = [
    'Timestamp',
    'Qualified',
    'Name',
    'Phone',
    'City',
    'Rooms',
    'Goal',
    'Quality',
    'Budget/m2',
    'Service',
    'Urgency',
    'Notes'
  ];

  const rows = leads.map(lead => [
    `"${new Date(lead.timestamp).toLocaleString('mk-MK')}"`,
    lead.qualified ? 'YES' : 'NO',
    `"${lead.name}"`,
    `"${lead.phone}"`,
    `"${lead.city}"`,
    `"${lead.rooms.join(', ')}"`,
    `"${lead.goal}"`,
    `"${lead.quality}"`,
    `"${lead.budget}"`,
    `"${lead.service}"`,
    `"${lead.urgency}"`,
    `"${lead.notes}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

export const downloadCSV = () => {
  const leads = getLeads();
  const csvContent = generateCSV(leads);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `tac_leads_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};