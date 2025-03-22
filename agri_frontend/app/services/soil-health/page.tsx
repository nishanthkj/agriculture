'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

// State → City mapping
const statesWithCities: { [state: string]: string[] } = {
  "Andhra Pradesh": ["Vijayawada", "Visakhapatnam", "Guntur", "Nellore"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  "Goa": ["Panaji", "Vasco da Gama", "Margao", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Haryana": ["Gurgaon", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Manali", "Solan", "Dharamshala"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
  "Meghalaya": ["Shillong", "Tura", "Jowai"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Noida", "Agra"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Haldwani"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Durgapur"]
}

export default function SoilForm() {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    ph: '',
    rainfall: '',
    state: '',
    city: ''
  })

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    console.log('Submitted:', formData)
    const payload = {
      ...formData,
      userId: 'replace-with-auth-user-id' // Replace this dynamically later
    }

    const res = await fetch('/api/soil', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const result = await res.json()
    console.log(result)
    // Call your API here
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Soil & Weather Form</h1>

      <div>
        <Label>Nitrogen</Label>
        <Input
          type="number"
          placeholder="Enter Nitrogen"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nitrogen', e.target.value)}
        />
      </div>

      <div>
        <Label>Phosphorous</Label>
        <Input
          type="number"
          placeholder="Enter Phosphorous"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('phosphorous', e.target.value)}
        />
      </div>

      <div>
        <Label>Potassium</Label>
        <Input
          type="number"
          placeholder="Enter Potassium"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('potassium', e.target.value)}
        />
      </div>

      <div>
        <Label>pH</Label>
        <Input
          type="number"
          placeholder="Enter pH"
          step="0.1"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('ph', e.target.value)}
        />
      </div>

      <div>
        <Label>Rainfall</Label>
        <Input
          type="number"
          placeholder="Enter Rainfall"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('rainfall', e.target.value)}
        />
      </div>

      <div>
        <Label>State</Label>
        <Select onValueChange={(value: string) => {
          handleChange('state', value)
          handleChange('city', '') // reset city when state changes
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statesWithCities).map(state => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>City</Label>
        <Select
          disabled={!formData.state}
          onValueChange={(value: string) => handleChange('city', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={formData.state ? "Select City" : "Select State first"} />
          </SelectTrigger>
          <SelectContent>
            {formData.state &&
              statesWithCities[formData.state].map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full mt-4" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  )
}
