import React, { useEffect, useState } from 'react';
import { Trash2, Edit2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { WeatherSearch } from '../types/weather';

export const WeatherHistory: React.FC = () => {
  const [searches, setSearches] = useState<WeatherSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSearches = async () => {
    try {
      const { data, error } = await supabase
        .from('weather_searches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSearches(data || []);
    } catch (err) {
      console.error('Error fetching searches:', err);
      setError('Failed to load weather history');
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weather_searches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSearches(searches.filter(search => search.id !== id));
    } catch (err) {
      console.error('Error deleting search:', err);
      setError('Failed to delete search');
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    try {
      let content: string;
      const filename = `weather-history.${format}`;

      if (format === 'json') {
        content = JSON.stringify(searches, null, 2);
      } else {
        const headers = ['Location', 'Start Date', 'End Date', 'Created At'];
        const rows = searches.map(search => [
          search.location,
          search.start_date,
          search.end_date,
          new Date(search.created_at).toLocaleString()
        ]);
        content = [headers, ...rows].map(row => row.join(',')).join('\n');
      }

      const blob = new Blob([content], { type: `text/${format}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  useEffect(() => {
    fetchSearches();
  }, []);

  if (loading) return <div className="text-gray-600">Loading history...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Weather Search History</h3>
        <div className="flex gap-2">
          <button
            onClick={() => exportData('json')}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
          >
            <Download size={16} />
            JSON
          </button>
          <button
            onClick={() => exportData('csv')}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
          >
            <Download size={16} />
            CSV
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {searches.map(search => (
          <div key={search.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{search.location}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(search.start_date).toLocaleDateString()} - {new Date(search.end_date).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Searched on {new Date(search.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteSearch(search.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Delete search"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};