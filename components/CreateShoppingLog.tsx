'use client'

import { createNewEntry } from "@/utils/api";
import { useState } from "react";

const shoppingCategories = [
  "Clothing",
  "Electronics",
  "Home & Garden",
  "Books",
  "Toys & Games",
  "Health & Beauty",
  "Sports & Outdoors",
  "Automotive",
  "Furniture",
  "Other"
];

const CreateShoppingLog = () => {
  const [category, setCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isSecondHand, setIsSecondHand] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await createNewEntry({
      category,
      itemName,
      price,
      quantity,
      isSecondHand,
      date,
      note,
    }, 'shopping');
    setIsLoading(false);
  };

  return (
    <form className="space-y-6 p-8" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div>
        <label htmlFor="category" className="block mb-2 font-semibold">Category</label>
        <select
          id="category"
          className="w-full border rounded px-3 py-2"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {shoppingCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="itemName" className="block mb-2 font-semibold">Item Name</label>
        <input
          type="text"
          id="itemName"
          className="w-full border rounded px-3 py-2"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          placeholder="Enter item name"
        />
      </div>
      <div>
        <label htmlFor="price" className="block mb-2 font-semibold">Price ($)</label>
        <input
          type="number"
          id="price"
          className="w-full border rounded px-3 py-2"
          value={price}
          onChange={e => setPrice(e.target.value)}
          min="0"
          step="0.01"
          placeholder="Enter price"
        />
      </div>
      <div>
        <label htmlFor="quantity" className="block mb-2 font-semibold">Quantity</label>
        <input
          type="number"
          id="quantity"
          className="w-full border rounded px-3 py-2"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          min="1"
          step="1"
        />
      </div>
      <div>
        <label htmlFor="isSecondHand" className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isSecondHand"
            checked={isSecondHand}
            onChange={e => setIsSecondHand(e.target.checked)}
            className="rounded"
          />
          <span className="font-semibold">Second-hand/Used item</span>
        </label>
      </div>
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
        <label htmlFor="note" className="block mb-2 font-semibold">Note</label>
        <input
          type="text"
          id="note"
          className="w-full border rounded px-3 py-2"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note about your purchase..."
        />
      </div>
      <button
        type="submit"
        className="bg-emerald-600 text-white px-6 py-2 rounded font-semibold hover:bg-emerald-700 transition"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Shopping Log"}
      </button>
    </form>
  );
};

export default CreateShoppingLog;