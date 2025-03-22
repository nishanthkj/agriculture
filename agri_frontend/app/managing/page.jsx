"use client";

import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Google Maps Styles (optional for a better map experience)
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function ManagingPage() {
  const [stocks, setStocks] = useState([
    { id: 1, name: "Corn", quantity: 120, location: "Farm A" },
    { id: 2, name: "Wheat", quantity: 200, location: "Farm B" },
  ]);

  const [workers, setWorkers] = useState([
    { id: 1, name: "John Doe", role: "Manager", farm: "Farm A" },
    { id: 2, name: "Jane Smith", role: "Worker", farm: "Farm B" },
  ]);

  const [stockName, setStockName] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockLocation, setStockLocation] = useState("");

  const [workerName, setWorkerName] = useState("");
  const [workerRole, setWorkerRole] = useState("");
  const [workerFarm, setWorkerFarm] = useState("");

  // Map center data, no setter function required if map center is static
  const mapCenter = {
    lat: 37.7749, // Latitude of San Francisco (example)
    lng: -122.4194, // Longitude of San Francisco
  };

  const addStock = () => {
    const newStock = {
      id: stocks.length + 1,
      name: stockName,
      quantity: stockQuantity,
      location: stockLocation,
    };
    setStocks([...stocks, newStock]);
    setStockName("");
    setStockQuantity("");
    setStockLocation("");
  };

  const addWorker = () => {
    const newWorker = {
      id: workers.length + 1,
      name: workerName,
      role: workerRole,
      farm: workerFarm,
    };
    setWorkers([...workers, newWorker]);
    setWorkerName("");
    setWorkerRole("");
    setWorkerFarm("");
  };

  const deleteStock = (id) => {
    setStocks(stocks.filter((stock) => stock.id !== id));
  };

  const deleteWorker = (id) => {
    setWorkers(workers.filter((worker) => worker.id !== id));
  };

  return (
    <section className="relative bg-gray-50 py-12">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Manage Stocks & Workers
        </h1>

        {/* Stocks Management */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Manage Stocks
          </h2>
          <div className="mb-6">
            {/* Stock Form */}
            <input
              type="text"
              className="p-4 border-2 border-gray-300 rounded-lg mb-4 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Stock Name"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
            />
            <input
              type="number"
              className="p-4 border-2 border-gray-300 rounded-lg mb-4 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Quantity"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
            <input
              type="text"
              className="p-4 border-2 border-gray-300 rounded-lg mb-4 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Location"
              value={stockLocation}
              onChange={(e) => setStockLocation(e.target.value)}
            />
            <button
              onClick={addStock}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Stock
            </button>
          </div>

          {/* Stocks Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left">Stock Name</th>
                  <th className="px-6 py-3 text-left">Quantity</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.id} className="border-b">
                    <td className="px-6 py-4">{stock.name}</td>
                    <td className="px-6 py-4">{stock.quantity}</td>
                    <td className="px-6 py-4">{stock.location}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteStock(stock.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workers Management */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Manage Workers
          </h2>
          <div className="mb-6">
            {/* Worker Form */}
            <input
              type="text"
              className="p-4 border-2 border-gray-300 rounded-lg mb-4 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Worker Name"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
            />
            <input
              type="text"
              className="p-4 border-2 border-gray-300 rounded-lg mb-4 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Role"
              value={workerRole}
              onChange={(e) => setWorkerRole(e.target.value)}
            />
            <input
              type="text"
              className="p-4 border-2 border-gray-300 rounded-lg mb-4 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Farm"
              value={workerFarm}
              onChange={(e) => setWorkerFarm(e.target.value)}
            />
            <button
              onClick={addWorker}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Worker
            </button>
          </div>

          {/* Workers Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left">Worker Name</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Farm</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker) => (
                  <tr key={worker.id} className="border-b">
                    <td className="px-6 py-4">{worker.name}</td>
                    <td className="px-6 py-4">{worker.role}</td>
                    <td className="px-6 py-4">{worker.farm}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteWorker(worker.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Map of the Area
          </h2>
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={12}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </section>
  );
}
