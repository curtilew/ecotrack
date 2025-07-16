'use client'

import { createNewEntry } from "@/utils/api";
import { useState } from "react";


const activityTypes = [
  "Car",
  "Bike",
  "Public Transit",
  "Walking",
  "Other"
];

const CreateTransLog = () => {
  const [activityType, setActivityType] = useState("");
  const [distance, setDistance] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  await createNewEntry( {
    activityType,
    distance,
    date,
    note,
  }, 'transportation');
  setIsLoading(false);
};

  return (
    <form className="space-y-6 p-8" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div>
        <label htmlFor='activityType' className="block mb-2 font-semibold">Activity Type</label>
        <select
          id='activityType'
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
        <label htmlFor='distance' className="block mb-2 font-semibold">Distance (miles)</label>
        <input
          id='distance'
          type="number"
          className="w-full border rounded px-3 py-2"
          value={distance}
          onChange={e => setDistance(e.target.value)}
          min="0"
          step="any"
        />
      </div>
      <div>
        <label htmlFor='date' className="block mb-2 font-semibold">Date</label>
        <input
          id='date'
          type="date"
          className="w-full border rounded px-3 py-2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor='note' className="block mb-2 font-semibold">Note</label>
        <input
          id='note'
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

export default CreateTransLog;