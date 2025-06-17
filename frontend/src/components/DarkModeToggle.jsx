import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    // On first load, try reading saved preference, else default to true
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Apply or remove the class
    document.documentElement.classList.toggle('dark', dark);
    // Persist for next time
    localStorage.setItem('darkMode', JSON.stringify(dark));
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="px-3 py-1 bg-white dark:bg-gray-700 rounded"
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
