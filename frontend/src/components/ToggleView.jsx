export default function ToggleView({ view,onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {['chart','table'].map(v=>(
        <button
          key={v}
          onClick={()=>onChange(v)}
          className={`px-3 py-1 rounded ${view===v?'bg-blue-600 text-white':'bg-white dark:bg-gray-700'}`}
        >{v.charAt(0).toUpperCase()+v.slice(1)}</button>
      ))}
    </div>
  );
}
