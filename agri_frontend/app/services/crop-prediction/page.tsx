'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';



interface SoilData {
  N: number;
  P: number;
  K: number;
  pH: number;
  EC: number;
  OC: number;
  S: number;
  Zn: number;
  Fe: number;
  Cu: number;
  Mn: number;
  B: number;
}
interface PredictionResponse {
  yield_per_hectare?: string;
  total_yield?: string;
  profitability?: string;
  techniques?: string;
}

interface PredictionResponse {
  response: string;
}

const crops = ['Arecanut', 'Paddy', 'Maize', 'Wheat', 'Sugarcane'];
const states = ['Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Kerala'];
const seasons = ['Autumn', 'Kharif', 'Rabi', 'Summer', 'Winter'];
const cropSuggestions = ['Millet', 'Barley', 'Soybean', 'Sunflower', 'Peanut'];

export default function CropPredictionPage(){
  const router = useRouter(); 
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [manualQuestion, setManualQuestion] = useState('');
  const [formData, setFormData] = useState({
    crop: crops[0],
    season: seasons[0],
    state: states[0],
    area_hectares: 1,
  });

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        const res = await fetch('/api/soil', { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.data) {
          setSoilData(data.data);
        } else {
          toast.error('Failed to load soil data');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading soil data');
      }
    };
    fetchSoilData();
  }, []);

  const handleSubmit = async () => {
    if (!soilData) {
      toast.error('❌ No soil data available');
      return;
    }

    setLoading(true);
    try {
      const raw = JSON.stringify({
        ...formData,
        soil_health: { ...soilData },
        custom_question: manualQuestion.trim(),
      });

      const response = await fetch('http://localhost:8000/api/predict/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
      });
      console.log('Request body:', raw);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
      });
      console.log("Response", response);
      console.log('Response status:', response.status);

      const responseText = await response.text();

      try {
        const parsed: PredictionResponse = JSON.parse(responseText);

        setResult(parsed);
        toast.success('✅ Prediction successful');
      } catch {
        setResult({ response: responseText });
        toast.success('✅ Response received');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">🌾 CROP YIELD  AI RECOMENDATION</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block mb-1 font-semibold">Crop</label>
          <select
            value={formData.crop}
            onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {crops.map((crop) => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">State</label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Season</label>
          <select
            value={formData.season}
            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {seasons.map((season) => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Area (hectares)</label>
          <input
            type="number"
            value={formData.area_hectares}
            onChange={(e) => setFormData({ ...formData, area_hectares: Number(e.target.value) })}
            className="w-full p-2 border rounded"
            placeholder="e.g. 2.5"
            min={0.1}
            step={0.1}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold">Suggest a Crop (optional)</label>
          <input
            type="text"
            list="suggestions"
            placeholder="Try typing Millet, Sunflower..."
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
          />
          <datalist id="suggestions">
            {cropSuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold">Custom Question (optional)</label>
          <textarea
            value={manualQuestion}
            onChange={(e) => setManualQuestion(e.target.value)}
            placeholder="e.g. What crop is best for this soil in winter?"
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="mb-8">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Predicting...' : 'Get Prediction'}
        </Button>
      </div>

      {soilData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">🧪 Soil Health Data</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
            {Object.entries(soilData).map(([key, value]) => (
              <div key={key} className="p-2 bg-white border rounded shadow-sm text-center">
                <span className="font-semibold">{key}</span>: {value}
              </div>
            ))}
          </div>
        </div>
      )}


      {/* {result && (
        <div className="mt-8 p-4 border rounded bg-green-50 shadow-sm">
          <h2 className="text-xl font-bold mb-3">🌱 Prediction Result</h2>
          <ul className="space-y-2 text-sm">
            {result.yield_per_hectare && (
              <li><strong>Yield per Hectare:</strong> {result.yield_per_hectare}</li>
            )}
            {result.total_yield && (
              <li><strong>Total Yield:</strong> {result.total_yield}</li>
            )}
            {result.profitability && (
              <li><strong>Profitability:</strong> {result.profitability}</li>
            )}
            {result.techniques && (
              <li><strong>Recommended Techniques:</strong> {result.techniques}</li>
            )}
          </ul>
        </div>
      )} */}
      {result?.response && (
        <div className="mt-6 bg-white border border-yellow-300 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl"></span>
            <h2 className="text-xl font-semibold text-yellow-700">AI Prediction Result:</h2>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{result.response}</pre>
          </div>
        </div>
      )}
      <Button 
        variant="outline" 
        onClick={() => router.push('/services')}
        className="mb-8 gap-2 mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1"  viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
        </svg>
        Back 
      </Button> 
    </div>
  );
}
