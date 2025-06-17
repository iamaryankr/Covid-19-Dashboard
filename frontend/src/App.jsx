import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalSummary  from './components/GlobalSummary';
import CountryList    from './components/CountryList';
import CountryDetail  from './components/CountryDetail';
import DarkModeToggle from './components/DarkModeToggle';
import useInterval    from './hooks/useInterval';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8','#82ca9d','#ffc658','#ff7f50','#8dd1e1'];

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [summary, setSummary]   = useState(null);
  const [list, setList]         = useState([]);
  const [selected, setSelected] = useState(null);
  const [source, setSource]     = useState('remote');

  const fetchData = () => {
    if (source === 'local') {
      axios.get(`${API_BASE}/summary`).then(r => setSummary(r.data));
      axios.get(`${API_BASE}/countries`).then(r => setList(r.data));
    } else {
      axios.get('https://disease.sh/v3/covid-19/all')
        .then(r => setSummary({
          totalCases:  r.data.cases,
          activeCases: r.data.active,
          recovered:   r.data.recovered,
          deaths:      r.data.deaths,
          vaccinated:  r.data.tests || 0
        }));
      axios.get('https://disease.sh/v3/covid-19/countries')
        .then(r => setList(r.data.map(i => ({
          country:     i.country,
          totalCases:  i.cases,
          activeCases: i.active,
          recovered:   i.recovered,
          deaths:      i.deaths,
          vaccinated:  i.tests || 0
        }))));
    }
  };

  useEffect(fetchData, [source]);
  useInterval(fetchData, 300000);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <header className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">COVID-19 Dashboard</h1>
        <div className="flex gap-2">
          <select
            value={source}
            onChange={e => setSource(e.target.value)}
            className="border border-gray-300 px-2 rounded bg-white text-gray-900
                       dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="local">Local</option>
            <option value="remote">disease.sh</option>
          </select>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-blue-600 text-white rounded dark:bg-blue-500"
          >
            Refresh
          </button>
          <DarkModeToggle />
        </div>
      </header>

      {summary && <GlobalSummary data={summary} />}

      {/* Pie Chart Section with Title */}
      <section className="my-6">
        <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
          Top 5 Countries by Total COVID‑19 Cases
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[...list].sort((a, b) => b.totalCases - a.totalCases).slice(0, 5)}
              dataKey="totalCases"
              nameKey="country"
              outerRadius={80}
            >
              {list.slice(0, 5).map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={value => value.toLocaleString()}
              headerFormatter={(label) => `Country: ${label}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <div className="flex flex-col md:flex-row gap-4">
        <CountryList list={list} onSelect={setSelected} />
        <div className="md:w-2/3">
          {selected ? (
            <CountryDetail country={selected.country} source={source} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Select a country
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
