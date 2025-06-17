import React, { useState } from 'react';

export default function CountryList({ list, onSelect }) {
  const [f, setF] = useState('');
  const filtered = list
    .filter(c => c.country.toLowerCase().includes(f.toLowerCase()))
    .sort((a,b) => b.totalCases - a.totalCases);

  return (
    <div className="md:w-1/3">
      <input
        className="w-full p-2 mb-2 border border-gray-300 rounded 
        bg-white text-gray-900 
        dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        placeholder="Search..."
        value={f} onChange={e=>setF(e.target.value)}
      />
      <ul className="max-h-[70vh] overflow-auto">
        {filtered.map((c,i)=>(
          <li
            key={c.country}
            onClick={()=>onSelect(c)}
            className={`p-2 flex justify-between cursor-pointer
              ${i<5? 'border-l-4 border-red-500':''}
              bg-white dark:bg-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-700
              text-gray-900 dark:text-gray-100
            `}
          >
            <span>{c.country}</span>
            <span>{ typeof c.totalCases==='number' ? c.totalCases.toLocaleString():'–' }</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
