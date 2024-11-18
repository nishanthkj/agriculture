"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send the form data to your server or API
    console.log("Form submitted", formData);
  };

  return (
    <section className="relative bg-green-50 h-auto py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-200 opacity-20 z-0"></div>

      {/* Decorative elements for a more dynamic background */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      <div className="container mx-auto px-6 lg:px-12 z-10 relative flex flex-col items-center">
        {/* Left Section (Form) */}
        <div className="w-full bg-white p-6 shadow-md rounded-lg max-w-lg">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-green-800 mb-6">
            Get in Touch!
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-green-800 font-medium text-sm"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-green-800 font-medium text-sm"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-green-800 font-medium text-sm"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                rows="4"
                placeholder="Enter your message"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Section (Text) */}
        <div className="w-full text-center mt-8 lg:mt-12 lg:px-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            We’d Love to Hear From You!
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            Whether you have questions, feedback, or want to collaborate with
            us, don't hesitate to reach out. Your thoughts matter to us.
          </p>
          <p className="text-sm text-gray-700 mb-6">
            Neuro Kodes is always looking for new ways to improve and connect
            with the agricultural community. Let us know how we can assist you.
          </p>
        </div>
      </div>
    </section>
  );
}
