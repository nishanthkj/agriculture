"use client";

import { useEffect, useState } from "react";
import LoginRequired from "@/components/LoginRequired/LoginRequired";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
//import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import dayjs from "dayjs";

interface WeatherData {
  location: { name: string; region: string };
  current: { temp_c: number; condition: { text: string }; time: string };
}

interface MarketPriceEntry {
  commodity: string;
  value: number;
  state?: string;
  market?: string;
  variety?: string;
  arrival_date?: string;
}

export default function ServicesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPriceEntry[]>([]);
  const [showAllPrices, setShowAllPrices] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/profile", { method: "GET", credentials: "include" });
        if (res.ok) {
          setIsAuthenticated(true);
          fetchClimate();
          fetchPrices();
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Authentication failed", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const fetchClimate = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
          const data = await res.json();
          const time = data.current_weather.time;
          setWeather({
            location: { name: `Lat: ${lat.toFixed(2)}`, region: `Lon: ${lon.toFixed(2)}` },
            current: {
              temp_c: data.current_weather.temperature,
              condition: { text: `Wind: ${data.current_weather.windspeed} km/h` },
              time: dayjs(time).format('MMMM D, YYYY h:mm A')
            }
          });
        } catch {
          toast.error("Failed to fetch weather data");
        }
      });
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await fetch("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10");
      const data = await res.json();
      const prices: MarketPriceEntry[] = data.records.map((entry: Record<string, string>) => ({
        commodity: entry["commodity"],
        value: parseFloat(entry["modal_price"] || entry["min_price"] || "0"),
        state: entry["state"],
        market: entry["market"],
        variety: entry["variety"],
        arrival_date: entry["arrival_date"]
      }));
      setMarketPrices(prices);
    } catch {
      toast.error("Failed to fetch price data");
    }
  };

  const displayedPrices = showAllPrices ? marketPrices : marketPrices.slice(0, 5);

  return isAuthenticated === null ? (
    <div />
  ) : isAuthenticated === false ? (
    <LoginRequired />
  ) : (
    <section className="relative bg-green-50 py-12">
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* WEATHER */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">🌤️ Live Weather Info</h2>
          {weather ? (
            <div className="space-y-2 text-sm text-center">
              <p><strong>📍 Location:</strong> {weather.location.name}, {weather.location.region}</p>
              <p><strong>🌡 Temperature:</strong> {weather.current.temp_c}°C</p>
              <p><strong>💨 Condition:</strong> {weather.current.condition.text}</p>
              <p><strong>🕒 Time:</strong> {weather.current.time}</p>
            </div>
          ) : <p className="text-center">Loading weather data...</p>}
        </div>

        {/* PRICE TABLE */}
        <div className="bg-white rounded-lg shadow p-6 overflow-x-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Price Data</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Market</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedPrices.map((price, idx) => (
                <TableRow key={idx}>
                  <TableCell>{price.commodity}</TableCell>
                  <TableCell>₹{price.value.toFixed(2)}</TableCell>
                  <TableCell>{price.market}</TableCell>
                  <TableCell>{price.arrival_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!showAllPrices && (
            <div className="text-center mt-4">
              <button
                className="text-blue-600 hover:underline text-sm"
                onClick={() => setShowAllPrices(true)}
              >
                Show more
              </button>
            </div>
          )}
        </div>

        {/* SMART SERVICES */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 mt-16">
          🌿 Our Smart Farming Services
        </h1>
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl px-4">
            {[
              {
                name: "Soil Health",
                icon: "🧪",
                description: "Monitor and improve soil health for sustainable farming.",
                href: "/services/soil-health",
                bgColor: "bg-amber-50",
              },
              {
                name: "Crop Prediction",
                icon: "🌾",
                description: "Get precise predictions for crop yields and growth.",
                href: "/services/crop-prediction",
                bgColor: "bg-amber-50",
              },
              {
                name: "Pest Prediction",
                icon: "🐛",
                description: "Identify likely pests affecting your crops and get prevention advice.",
                href: "/services/pest-prediction",
                bgColor: "bg-amber-50",
              },
            ].map((service, index) => (
              <div key={index} className={`${service.bgColor} p-6 rounded-2xl border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-md group`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl p-3 rounded-lg bg-white shadow-sm group-hover:scale-105 transition-transform">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h2>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <a href={service.href} 
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors">
                      Learn More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
