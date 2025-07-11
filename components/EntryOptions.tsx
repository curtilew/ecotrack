'use client'

import { createNewEntry } from "@/utils/api"
import { useRouter } from "next/navigation"

const EntryOptions = () => {

    const router = useRouter()

    const handleOnClickTransportation = async () => { //********************************* */
      // const data = await createNewEntry();
      router.push(`/activitylog`);
    };

return (
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
    {/* Transportation */}
    <div 
      className="h-14 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-100"
      onClick={handleOnClickTransportation}
    >
      <div className="px-6 py-8 text-center">
        {/* <div className="text-4xl mb-3">🚗</div> */}
        <span className="text-xl font-semibold text-gray-800">Transportation</span>
      </div>
    </div>

    {/* Energy */}
    <div 
      className="h-14 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-100"
    //   onClick={handleOnClickEnergy}
    >
      <div className="px-6 py-8 text-center">
        {/* <div className="text-4xl mb-3">⚡</div> */}
        <span className="text-xl font-semibold text-gray-800">Energy</span>
      </div>
    </div>

    {/* Food */}
    <div 
      className="h-14 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-100"
    //   onClick={handleOnClickFood}
    >
      <div className="px-6 py-8 text-center">
        {/* <div className="text-4xl mb-3">🍽️</div> */}
        <span className="text-xl font-semibold text-gray-800">Food</span>
      </div>
    </div>

    {/* Shopping */}
    <div 
      className="h-14 cursor-pointer overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-100"
    //   onClick={handleOnClickShopping}
    >
      <div className="px-6 py-8 text-center">
        {/* <div className="text-4xl mb-3">🛒</div> */}
        <span className="text-xl font-semibold text-gray-800">Shopping</span>
      </div>
    </div>
  </div>
);
}

export default EntryOptions