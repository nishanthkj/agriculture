"use client";
import Climate from "@/components/Climate/Climate"; // Correct the import path
import Price from "@/components/Price/Price"; // Correct the import path

export default function ServicesPage() {
  const services = [
    {
      name: "Crop Prediction",
      description: "Get precise predictions for crop yields and growth.",
      href: "/services/crop-prediction",
    },
    {
      name: "Pest Prediction",
      description: "Identify and manage potential pest infestations.",
      href: "/services/pest-prediction",
    },
    {
      name: "Soil Health",
      description: "Monitor and improve soil health for sustainable farming.",
      href: "/services/soil-health",
    },
  ];

  return (
    <section className="relative bg-green-50 py-12">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Climate History Chart and Price History Chart side by side */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Climate History Chart */}
          <div className="w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Climate History Data
            </h2>
            <Climate />
          </div>

          {/* Price History Chart */}
          <div className="w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Price History Data
            </h2>
            <Price />
          </div>
        </div>

        {/* Services Section */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-12">
          Our Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {service.name}
              </h2>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <a href={service.href} className="text-blue-600 hover:underline">
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
