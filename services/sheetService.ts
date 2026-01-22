import { LeadFormData, SubmittedLead, BudgetOption } from '../types';

const STORAGE_KEY = 'tac_leads_db';

/**
 * Determines if a lead is qualified based on the budget.
 * Rule: 150-250 den is NOT qualified.
 */
export const checkQualification = (budget: BudgetOption | ''): boolean => {
  if (budget === '150 – 250 ден') return false;
  return true;
};

/**
 * Simulates saving to Google Sheets by saving to LocalStorage.
 * In a real Next.js app, this would be a fetch POST to an API route.
 */
export const saveLead = async (data: LeadFormData, notes: string): Promise<SubmittedLead> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const qualified = checkQualification(data.budget);
  
  const newLead: SubmittedLead = {
    ...data,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    qualified,
    notes
  };

  // Save to "Database" (LocalStorage for demo)
  const existing = getLeads();
  const updated = [newLead, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

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