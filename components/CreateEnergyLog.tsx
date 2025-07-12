'use client'

import { createNewEntry } from "@/utils/api";
import { useState } from "react";

const energyTypes = [
  "Electricity",
  "Natural Gas",
  "Heating Oil",
  "Propane",
  "Solar",
  "Other"
];

const CreateEnergyLog = () => {
  const [energyType, setEnergyType] = useState("");
  const [usage, setUsage] = useState("");
  const [unit, setUnit] = useState("kWh");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await createNewEntry({
      energyType,
      usage,
      unit,
      date,
      note,
    }, 'energy');
    setIsLoading(false);
  };

  return (
    <form className="space-y-6 p-8" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div>
        <label className="block mb-2 font-semibold">Energy Type</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={energyType}
          onChange={e => setEnergyType(e.target.value)}
        >
          <option value="">Select energy type</option>
          {energyTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2 font-semibold">Usage Amount</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={usage}
          onChange={e => setUsage(e.target.value)}
          min="0"
          step="any"
          placeholder="Enter usage amount"
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold">Unit</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={unit}
          onChange={e => setUnit(e.target.value)}
        >
          <option value="kWh">kWh (Kilowatt Hours)</option>
          <option value="therms">Therms</option>
          <option value="gallons">Gallons</option>
          <option value="cubic_feet">Cubic Feet</option>
        </select>
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
          placeholder="Add a note about your energy usage..."
        />
      </div>
      <button
        type="submit"
        className="bg-emerald-600 text-white px-6 py-2 rounded font-semibold hover:bg-emerald-700 transition"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Energy Log"}
      </button>
    </form>
  );
};

export default CreateEnergyLog;