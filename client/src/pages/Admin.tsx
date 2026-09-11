import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [data, setData] = useState<{ openItems: any[]; systemComponents: any[] }>({
    openItems: [],
    systemComponents: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setSaving(false);
    alert('Changes saved successfully!');
  };

  if (loading) return <div className="p-6">Loading admin panel...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Content Management Admin</h1>
      
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">System Components</h2>
        {data.systemComponents.map((comp, index) => (
          <div key={comp.id || index} className="flex gap-2 items-center">
            <input
              type="text"
              value={comp.name}
              onChange={e => {
                const newComps = [...data.systemComponents];
                newComps[index].name = e.target.value;
                setData({ ...data, systemComponents: newComps });
              }}
              className="border p-2 rounded flex-1"
            />
            <input
              type="text"
              value={comp.status}
              onChange={e => {
                const newComps = [...data.systemComponents];
                newComps[index].status = e.target.value;
                setData({ ...data, systemComponents: newComps });
              }}
              className="border p-2 rounded w-32"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {saving ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
}