'use client'

import { createNewEntry } from "@/utils/api";
import { useState } from "react";

const foodTypes = [
  "Beef",
  "Pork",
  "Chicken",
  "Fish",
  "Dairy",
  "Vegetables",
  "Fruits",
  "Grains",
  "Processed Foods",
  "Other"
];

const CreateFoodLog = () => {
  const [foodType, setFoodType] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("servings");
  const [mealType, setMealType] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await createNewEntry({
      foodType,
      quantity,
      unit,
      mealType,
      date,
      note,
    }, 'food');
    setIsLoading(false);
  };

  return (
    <form className="space-y-6 p-8" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div>
        <label htmlFor="date" className="block mb-2 font-semibold">Date</label>
        <input
          type="date"
          id="date"
          className="w-full border rounded px-3 py-2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="foodType" className="block mb-2 font-semibold">Food Type</label>
        <select
          id="foodType"
          className="w-full border rounded px-3 py-2"
          value={foodType}
          onChange={e => setFoodType(e.target.value)}
        >
          <option value="">Select food type</option>
          {foodTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity" className="block mb-2 font-semibold">Quantity</label>
        <input
          type="number"
          id="quantity"
          className="w-full border rounded px-3 py-2"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          min="0"
          step="any"
          placeholder="Enter quantity"
        />
      </div>
      <div>
        <label htmlFor="unit" className="block mb-2 font-semibold">Unit</label>
        <select
          id="unit"
          className="w-full border rounded px-3 py-2"
          value={unit}
          onChange={e => setUnit(e.target.value)}
        >
          <option value="servings">Servings</option>
          <option value="pounds">Pounds</option>
          <option value="ounces">Ounces</option>
          <option value="cups">Cups</option>
          <option value="pieces">Pieces</option>
        </select>
      </div>
      <div>
        <label htmlFor="mealType" className="block mb-2 font-semibold">Meal Type</label>
        <select
          id="mealType"
          className="w-full border rounded px-3 py-2"
          value={mealType}
          onChange={e => setMealType(e.target.value)}
        >
          <option value="">Select meal type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>
      </div>
      {/* <div>
        <label htmlFor="date" className="block mb-2 font-semibold">Date</label>
        <input
          type="date"
          id="date"
          className="w-full border rounded px-3 py-2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div> */}
      <div>
        <label htmlFor="note" className="block mb-2 font-semibold">Note</label>
        <input
          type="text"
          id="note"
          className="w-full border rounded px-3 py-2"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note about your food consumption..."
        />
      </div>
      <button
        type="submit"
        className="bg-emerald-600 text-white px-6 py-2 rounded font-semibold hover:bg-emerald-700 transition"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Food Log"}
      </button>
    </form>
  );
};

export default CreateFoodLog;