export type Complaint = {
  name: string;
  bank: string;
  issue: string;
  date: string;
  amount: string;
  reference: string;
  details: string;
  resolution: string;
  previous: string;
  contact: string;
};
export function complaintLetter(input: Complaint) {
  const amount = Number(input.amount);
  const date = new Date(input.date);
  if (
    !input.name.trim() ||
    !input.bank.trim() ||
    !input.details.trim() ||
    !input.resolution.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(input.date) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== input.date ||
    !input.amount.trim() ||
    !Number.isFinite(amount) ||
    amount > 1e12 ||
    amount < 0
  )
    return null;
  return `To: Customer Complaints Team, ${input.bank.trim()}\nSubject: ${input.issue} — ${input.reference.trim() || "reference not available"}\n\nDear Customer Complaints Team,\n\nMy name is ${input.name.trim()}. I am requesting an investigation into the following issue.\n\nTransaction date: ${input.date}\nAmount in dispute: NGN ${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\nReference: ${input.reference.trim() || "Not available"}\n\nWhat happened:\n${input.details.trim()}\n\nResolution requested:\n${input.resolution.trim()}\n\nPrevious contact with the bank:\n${input.previous.trim() || "This is my first written complaint."}\n\nPlease acknowledge this complaint, provide a tracking reference, and explain the investigation outcome and expected resolution timeframe in writing. I will retain a copy of this complaint and supporting records.\n\nYours faithfully,\n${input.name.trim()}\n${input.contact.trim() || "[Add a contact method before sending]"}\n\nAttachments: [List relevant receipts, statements and previous correspondence. Remove this line if none.]`;
}
