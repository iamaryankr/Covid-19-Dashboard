import React from 'react';

export default function GlobalSummary({ data }) {
  const cards = [
    ['Total Cases',  data.totalCases],
    ['Active Cases', data.activeCases],
    ['Recovered',    data.recovered],
    ['Deaths',       data.deaths],
    ['Vaccinated',   data.vaccinated]
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow
      text-gray-900 dark:text-gray-100">
      {cards.map(([label,val])=>(
        <div key={label} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-sm">{label}</h2>
          <p className="text-xl">
            {typeof val==='number' ? val.toLocaleString() : '–'}
          </p>
        </div>
      ))}
    </div>
  );
}
