'use client'

import { updateEntry } from "@/utils/api";
import { useState } from "react";


const activityTypes = [
  "Car",
  "Bike",
  "Public Transit",
  "Walking",
  "Other"
];
// @ts-expect-error Database returns null but component expects undefined
const Editor = ({ log }) => {
  const [activityType, setActivityType] = useState(log?.activityType || "");
  const [distance, setDistance] = useState(log?.distance || "");
  const [date, setDate] = useState(log?.date ? new Date(log.date).toISOString().slice(0, 10) : "");
  const [note, setNote] = useState(log?.note || "");
  const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  await updateEntry(log.id, {
    activityType,
    distance,
    date,
    note,
  });
  setIsLoading(false);
};

  return (
    <form className="space-y-6 p-8" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div>
        <label className="block mb-2 font-semibold">Activity Type</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={activityType}
          onChange={e => setActivityType(e.target.value)}
        >
          <option value="">Select type</option>
          {activityTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2 font-semibold">Distance (miles)</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={distance}
          onChange={e => setDistance(e.target.value)}
          min="0"
          step="any"
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold">Date</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold">Note</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note..."
        />
      </div>
        <button
        type="submit"
        className="bg-emerald-600 text-white px-6 py-2 rounded font-semibold hover:bg-emerald-700 transition"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Activity"}
      </button>
    </form>
  );
};

export default Editor;