"use client"

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const growthStages = ['Seedling', 'Tillering', 'Flowering', 'Maturity']
const weatherOptions = ['Sunny', 'Rainy', 'Humid', 'Dry', 'Cloudy']

export default function PestPredictionForm() {
  const [formData, setFormData] = useState({
    message: '',
    cropType: '',
    location: '',
    observedSymptoms: '',
    growthStage: '',
    weather: ''
  })
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          observedSymptoms: formData.observedSymptoms.split(',').map(s => s.trim())
        })
      })

      if (!response.ok) throw new Error('Prediction failed')
      const data = await response.json()
      setPrediction(data)
    } catch (err) {
      setError(err.message || 'Prediction error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">🐛PEST PREDICTION</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border">
        {/* Crop & Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Crop Type*</label>
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Crop</option>
              {['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'].map(crop => (
                <option key={crop} value={crop.toLowerCase()}>{crop}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Location*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
              placeholder="Village or District"
            />
          </div>
        </div>

        {/* Growth & Weather */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Growth Stage</label>
            <select
              name="growthStage"
              value={formData.growthStage}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Stage</option>
              {growthStages.map(stage => (
                <option key={stage} value={stage.toLowerCase()}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Weather</label>
            <select
              name="weather"
              value={formData.weather}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Select Weather</option>
              {weatherOptions.map(w => (
                <option key={w} value={w.toLowerCase()}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem & Symptoms */}
        <div>
          <label className="block mb-1 text-sm font-semibold">Problem Description*</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded-lg"
            placeholder="Briefly describe what you're seeing on the crop"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold">Observed Symptoms</label>
          <input
            type="text"
            name="observedSymptoms"
            value={formData.observedSymptoms}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="e.g., yellow leaves, stunted growth (comma separated)"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium flex justify-center items-center ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Predict Pest'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {prediction && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border transition-all">
          <h2 className="text-2xl font-bold mb-4 text-green-700">PEDICTION RESULT</h2>

          <div className="mb-4">
            <h3 className="font-semibold">Identified Pest:</h3>
            <p className="whitespace-pre-line">{prediction.prediction}</p>
            <p className="text-sm text-gray-600">Confidence: <strong>{prediction.confidenceLevel}</strong></p>
          </div>

          {prediction.preventionMethods?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold">Prevention Methods:</h3>
              <ul className="list-disc pl-5">
                {prediction.preventionMethods.map((method, i) => <li key={i}>{method}</li>)}
              </ul>
            </div>
          )}

          {prediction.treatmentOptions?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold">Treatment Options:</h3>
              <ul className="list-disc pl-5">
                {prediction.treatmentOptions.map((opt, i) => <li key={i}>{opt}</li>)}
              </ul>
            </div>
          )}

          {prediction.relatedPests?.length > 0 && (
            <div>
              <h3 className="font-semibold">Related Pests:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {prediction.relatedPests.map((pest, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {pest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
