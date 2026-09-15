"use client";
import { useState } from "react";
import { complaintLetter, type Complaint } from "@/lib/complaint";
const initial: Complaint = {
  name: "",
  bank: "",
  issue: "Failed transaction",
  date: "",
  amount: "",
  reference: "",
  details: "",
  resolution: "",
  previous: "",
  contact: "",
};
export default function ComplaintLetter() {
  const [fields, setFields] = useState(initial);
  const [letter, setLetter] = useState("");
  const [message, setMessage] = useState("");
  const change = (key: keyof Complaint, value: string) =>
    setFields({ ...fields, [key]: value });
  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setMessage("Letter copied.");
    } catch {
      setMessage("Select the letter text and copy it manually.");
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([letter], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "bank-complaint.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="tool-panel">
      <p>
        Drafted in your browser. Your details are not sent to NairaSavvy or
        saved when you leave. Do not enter PINs, passwords, OTPs or full card
        numbers.
      </p>
      <form
        className="no-print"
        onSubmit={(e) => {
          e.preventDefault();
          const draft = complaintLetter(fields);
          if (!draft) {
            setMessage(
              "Complete the required fields using a valid date and amount.",
            );
            return;
          }
          setLetter(draft);
          setMessage("Draft generated. Review and edit it before sending.");
        }}
      >
        <div className="form-grid">
          {(
            [
              ["name", "Your name"],
              ["bank", "Bank or institution"],
              ["date", "Transaction date"],
              ["amount", "Amount in dispute (₦)"],
              ["reference", "Transaction reference (optional)"],
              ["contact", "Contact method (optional)"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                className="input"
                type={
                  key === "date" ? "date" : key === "amount" ? "number" : "text"
                }
                min={key === "amount" ? "0" : undefined}
                step={key === "amount" ? "0.01" : undefined}
                maxLength={200}
                required={!["reference", "contact"].includes(key)}
                value={fields[key]}
                onChange={(e) => change(key, e.target.value)}
              />
            </label>
          ))}
          <label>
            Issue
            <select
              className="input"
              value={fields.issue}
              onChange={(e) => change("issue", e.target.value)}
            >
              {[
                "Failed transaction",
                "Unexpected charge",
                "Account access",
                "Other complaint",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        {(
          [
            ["details", "What happened?", true],
            ["resolution", "What resolution are you requesting?", true],
            ["previous", "Previous complaints, dates and references", false],
          ] as const
        ).map(([key, label, required]) => (
          <label key={key} style={{ display: "block", margin: "20px 0" }}>
            {label}
            <textarea
              className="input"
              rows={3}
              maxLength={3000}
              required={required}
              value={fields[key]}
              onChange={(e) => change(key, e.target.value)}
            />
          </label>
        ))}
        <button className="btn-primary">Generate / update draft</button>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setFields(initial);
            setLetter("");
            setMessage("Fields cleared.");
          }}
        >
          Reset
        </button>
      </form>
      <p role="status">{message}</p>
      {letter && (
        <section>
          <label htmlFor="complaint-draft">
            Review and edit your letter
            <textarea
              id="complaint-draft"
              className="input"
              rows={22}
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
            />
          </label>
          <div className="no-print">
            <button className="btn-primary" onClick={download}>
              Download letter (.txt)
            </button>
            <button className="text-button" onClick={copy}>
              Copy letter
            </button>
          </div>
          <p>
            Add evidence and send the letter using a contact channel you verify
            directly with your bank. This tool does not send it.
          </p>
        </section>
      )}
    </div>
  );
}
