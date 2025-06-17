import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import ToggleView from './ToggleView';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function CountryDetail({ country, source }) {
  const [info, setInfo]       = useState(null);
  const [history, setHistory] = useState(null);
  const [view, setView]       = useState('chart');

  useEffect(() => {
    if (source === 'local') {
      // LOCAL JSON backend using API_BASE
      axios.get(`${API_BASE}/country/${country}`)
        .then(res => {
          setInfo(res.data);
          setHistory(res.data.history);
        })
        .catch(console.error);
    } else {
      // REMOTE: disease.sh

      // 1) Fetch historical timeline
      axios.get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`)
        .then(res => {
          const { cases, recovered, deaths } = res.data.timeline;

          // 2) Sort raw dates chronologically
          const rawDates = Object.keys(cases).sort((a, b) => {
            const fmt = r => {
              const [m,d,yy] = r.split('/');
              return new Date(`20${yy}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`);
            };
            return fmt(a) - fmt(b);
          });

          // 3) Carry‑forward last non‑zero values
          let lastRecNonZero = 0;
          let lastDeathNonZero = 0;
          const hist = rawDates.map(raw => {
            const [m, d, yy] = raw.split('/');
            const iso = `20${yy}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
            const cCount = Number(cases[raw]) || 0;

            const recRaw = Number(recovered[raw] ?? 0);
            const recCount = recRaw > 0 ? recRaw : lastRecNonZero;
            if (recRaw > 0) lastRecNonZero = recRaw;

            const dthRaw = Number(deaths[raw] ?? 0);
            const deathCount = dthRaw > 0 ? dthRaw : lastDeathNonZero;
            if (dthRaw > 0) lastDeathNonZero = dthRaw;

            return {
              date:      iso,
              cases:     cCount,
              recovered: recCount,
              deaths:    deathCount
            };
          });

          setHistory(hist);
        })
        .catch(console.error);

      // 4) Fetch current totals
      axios.get(`https://disease.sh/v3/covid-19/countries/${country}`)
        .then(res => {
          setInfo({
            totalCases:  res.data.cases,
            activeCases: res.data.active,
            recovered:   res.data.recovered,
            deaths:      res.data.deaths,
            vaccinated:  res.data.todayVaccinated ?? 0
          });
        })
        .catch(console.error);
    }
  }, [country, source]);

  if (!info || !history) {
    return <p className="text-center dark:text-gray-100">Loading...</p>;
  }

  // Prepare bar data
  const barData = history.slice(1).map((d, i) => ({
    date:     d.date,
    newCases: d.cases - history[i].cases
  }));

  // Stats cards
  const stats = [
    ['Total',     info.totalCases],
    ['Active',    info.activeCases],
    ['Recovered', info.recovered],
    ['Deaths',    info.deaths],
    ['Vaccinated',info.vaccinated]
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
      <h2 className="text-2xl mb-4 dark:text-gray-100">{country}</h2>

      {/* Top‑line stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        {stats.map(([label,val])=>(
          <div
            key={label}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-gray-900 dark:text-gray-100"
          >
            <h3 className="text-sm">{label}</h3>
            <p className="text-lg font-semibold">{val.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <ToggleView view={view} onChange={setView} />

      {view==='chart' ? (
        <>
          {/* Cumulative Line Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={history}
              margin={{ top:20, right:30, left:60, bottom:5 }}
            >
              <XAxis dataKey="date" stroke="#888"/>
              <YAxis
                width={80}
                stroke="#888"
                domain={[0,'dataMax']}
                tickFormatter={v=>v.toLocaleString()}
                interval="preserveStartEnd"
              />
              <Tooltip formatter={v=>v.toLocaleString()}/>
              <Legend/>
              <Line type="monotone" dataKey="cases"     name="Cases"     stroke="#8884d8"/>
              <Line type="monotone" dataKey="recovered" name="Recovered" stroke="#82ca9d"/>
              <Line type="monotone" dataKey="deaths"    name="Deaths"    stroke="#ff7300"/>
            </LineChart>
          </ResponsiveContainer>

          {/* Daily New Cases Bar Chart */}
          <ResponsiveContainer width="100%" height={150} className="mt-4">
            <BarChart
              data={barData}
              margin={{ top:10, right:20, left:60, bottom:5 }}
            >
              <XAxis dataKey="date" stroke="#888"/>
              <YAxis
                width={80}
                stroke="#888"
                domain={[0,'dataMax']}
                tickFormatter={v=>v.toLocaleString()}
                interval="preserveStartEnd"
              />
              <Tooltip formatter={v=>v.toLocaleString()}/>
              <Bar dataKey="newCases" name="New Cases"/>
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <table className="w-full text-left mt-4">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-2 py-1">Date</th>
              <th className="px-2 py-1">Cases</th>
              <th className="px-2 py-1">Recovered</th>
              <th className="px-2 py-1">Deaths</th>
            </tr>
          </thead>
          <tbody>
            {history.map(d=>(
              <tr
                key={d.date}
                className="even:bg-gray-50 dark:even:bg-gray-800 odd:bg-white dark:odd:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <td className="px-2 py-1">{d.date}</td>
                <td className="px-2 py-1">{d.cases.toLocaleString()}</td>
                <td className="px-2 py-1">{d.recovered.toLocaleString()}</td>
                <td className="px-2 py-1">{d.deaths.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
