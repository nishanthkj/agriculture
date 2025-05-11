// FRONTEND: app/services/soil-health/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const requiredFields = [
  'N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B'
];

type SoilFormType = Record<typeof requiredFields[number] | 'fertilityClass' | 'confidence', string>;

export default function SoilHealthPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<SoilFormType>>({});
  const [loading, setLoading] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await fetch('/api/soil', { credentials: 'include' });
        const result = await res.json();
        if (result.success && result.data) {
          setFormData(result.data);
          setIsExisting(true);
        }
      } catch (err) {
        console.error('Failed to load existing soil data:', err);
      }
    };
    fetchExisting();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    console.log("🔄 Submitting form...");
    const missingFields = requiredFields.filter(
      (key) => !formData[key] || isNaN(parseFloat(formData[key]!))
    );
    if (missingFields.length > 0) {
      toast.error(`Please fill all fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      console.log("📡 Sending prediction request to Django...");
      const predictionRes = await fetch('http://localhost:8000/api/soil/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(
          Object.fromEntries(requiredFields.map(key => [key, parseFloat(formData[key]!)])
          ))
      });
      const prediction = await predictionRes.json();
      console.log("✅ Prediction result:", prediction);

      setFormData((prev) => ({
        ...prev,
        fertilityClass: prediction.fertility_class,
        confidence: prediction.confidence.toString(),
      }));

      console.log("📦 Saving to DB...");
      const dbRes = await fetch('/api/soil', {
        method: isExisting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...Object.fromEntries(requiredFields.map(k => [k, parseFloat(formData[k]!)])),
          fertilityClass: prediction.fertility_class,
          confidence: prediction.confidence,
        })
      });
      const dbResult = await dbRes.json();
      console.log("✅ DB result:", dbResult);

      if (dbRes.ok) {
        toast.success('✅ Data saved successfully');
        setIsExisting(true);
      } else {
        toast.error('❌ Failed to store data');
        console.error(dbResult);
      }
    } catch (err) {
      toast.error('❌ Server error');
      console.error("🔥 Error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">🧪 SOIL FERTILITY FORM</h1>
      {formData.fertilityClass && (
        <div className="mt-6 text-lg text-green-700 font-medium">
          🌾 Fertility Class: <strong>{formData.fertilityClass}</strong><br />
          🎯 Confidence: <strong>{formData.confidence}</strong>
        </div>
      )}
      {requiredFields.map((key) => (
        <div key={key} className="mb-4">
          <Label htmlFor={key}>{key}</Label>
          <Input
            id={key}
            name={key}
            type="number"
            step="0.01"
            placeholder={`Enter ${key}`}
            value={formData[key] || ''}
            onChange={handleChange}
          />
        </div>
      ))}
      <Button onClick={handleSubmit} disabled={loading} className="w-full mt-4">
        {loading ? 'Processing...' : isExisting ? 'Update Record' : 'Submit'}
      </Button>

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