"use client";
import Map from "@/components/Map"; // Adjust the path if necessary

export default function ServicesPage() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Our Services with Map
        </h1>

        {/* Climate and Price Charts */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Climate History Data
          </h2>
          {/* Your Climate Chart Component Here */}
        </div>

        {/* Price Chart */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Price History Data
          </h2>
          {/* Your Price Chart Component Here */}
        </div>

        {/* Google Map */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Map of the Area
          </h2>
          <Map />
        </div>
      </div>
    </section>
  );
}
