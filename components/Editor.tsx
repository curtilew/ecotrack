'use client'

import { updateEntry } from "@/utils/api";
import { useState } from "react";
// @ts-expect-error dynamic log type lookup
const Editor = ({ log }) => {
  const [formData, setFormData] = useState({
    // Transportation
    activityType: log?.activityType || "",
    distance: log?.distance || "",
    // Energy  
    energyType: log?.energyType || "",
    usage: log?.usage || "",
    unit: log?.unit || "",
    // Food
    foodType: log?.foodType || "",
    quantity: log?.quantity || "",
    mealType: log?.mealType || "",
    // Shopping
    category: log?.category || "",
    itemName: log?.itemName || "",
    price: log?.price || "",
    isSecondHand: log?.isSecondHand || false,
    // Common
    date: log?.date ? new Date(log.date).toISOString().slice(0, 10) : "",
    note: log?.note || ""
  });

  const [isLoading, setIsLoading] = useState(false);
// @ts-expect-error log may not have a logType property
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await updateEntry(log.id, formData, log.logType);
    setIsLoading(false);
  };

  return (
    <form className="space-y-4 p-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      
      {/* Transportation Fields */}
      {log.logType === 'transportation' && (
        <>
          <div>
            <label className="block mb-1 font-medium">Activity Type</label>
            <select 
              className="w-full border rounded px-3 py-2"
              value={formData.activityType}
              onChange={e => handleChange('activityType', e.target.value)}
            >
              <option value="">Select type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Public Transit">Public Transit</option>
              <option value="Walking">Walking</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Distance (miles)</label>
            <input 
              type="number" 
              className="w-full border rounded px-3 py-2"
              value={formData.distance}
              onChange={e => handleChange('distance', e.target.value)}
            />
          </div>
        </>
      )}

      {/* Energy Fields */}
      {log.logType === 'energy' && (
        <>
          <div>
            <label className="block mb-1 font-medium">Energy Type</label>
            <select 
              className="w-full border rounded px-3 py-2"
              value={formData.energyType}
              onChange={e => handleChange('energyType', e.target.value)}
            >
              <option value="">Select type</option>
              <option value="Electricity">Electricity</option>
              <option value="Natural Gas">Natural Gas</option>
              <option value="Heating Oil">Heating Oil</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Usage</label>
            <input 
              type="number" 
              className="w-full border rounded px-3 py-2"
              value={formData.usage}
              onChange={e => handleChange('usage', e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Unit</label>
            <select 
              className="w-full border rounded px-3 py-2"
              value={formData.unit}
              onChange={e => handleChange('unit', e.target.value)}
            >
              <option value="">Select unit</option>
              <option value="kWh">kWh</option>
              <option value="therms">therms</option>
              <option value="gallons">gallons</option>
            </select>
          </div>
        </>
      )}

      {/* Food Fields */}
      {log.logType === 'food' && (
        <>
          <div>
            <label className="block mb-1 font-medium">Food Type</label>
            <select 
              className="w-full border rounded px-3 py-2"
              value={formData.foodType}
              onChange={e => handleChange('foodType', e.target.value)}
            >
              <option value="">Select type</option>
              <option value="Beef">Beef</option>
              <option value="Chicken">Chicken</option>
              <option value="Fish">Fish</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input 
              type="number" 
              className="w-full border rounded px-3 py-2"
              value={formData.quantity}
              onChange={e => handleChange('quantity', e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Meal Type</label>
            <select 
              className="w-full border rounded px-3 py-2"
              value={formData.mealType}
              onChange={e => handleChange('mealType', e.target.value)}
            >
              <option value="">Select meal</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
        </>
      )}

      {/* Shopping Fields */}
      {log.logType === 'shopping' && (
        <>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select 
              className="w-full border rounded px-3 py-2"
              value={formData.category}
              onChange={e => handleChange('category', e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Food">Food</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Item Name</label>
            <input 
              type="text" 
              className="w-full border rounded px-3 py-2"
              value={formData.itemName}
              onChange={e => handleChange('itemName', e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input 
              type="number" 
              className="w-full border rounded px-3 py-2"
              value={formData.price}
              onChange={e => handleChange('price', e.target.value)}
            />
          </div>
          <div>
            <input 
              type="checkbox" 
              checked={formData.isSecondHand}
              onChange={e => handleChange('isSecondHand', e.target.checked)}
            />
            <label className="ml-2">Second-hand</label>
          </div>
        </>
      )}

      {/* Common Fields */}
      <div>
        <label className="block mb-1 font-medium">Date</label>
        <input 
          type="date" 
          className="w-full border rounded px-3 py-2"
          value={formData.date}
          onChange={e => handleChange('date', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block mb-1 font-medium">Note</label>
        <input 
          type="text" 
          className="w-full border rounded px-3 py-2"
          value={formData.note}
          onChange={e => handleChange('note', e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default Editor;