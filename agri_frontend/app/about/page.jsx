"use client";

import { useState, useEffect } from "react";
import { FaGithub, FaBullseye, FaRocket } from "react-icons/fa";
import Image from "next/image";
import Shivamurthy from "@/assets/Shivamurthy.png";

export default function AboutPage() {
  const [githubData, setGithubData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch GitHub profiles for all team members
  useEffect(() => {
    // Static team data with GitHub links inside useEffect
    const teamMembers = [
      {
        name: "Nishanth K J",
        role: "Lead, Full Stack Developer & AI/ML Specialist",
        github: "https://github.com/nishanthkj",
      },
      {
        name: "Skanda P M",
        role: "UI/UX & Graphic Designer",
        github: "https://github.com/Sk2003pm",
      },
      {
        name: "Likith D",
        role: "UI/UX & Frontend Developer",
        github: "https://github.com/likithsurya23",
      },
      {
        name: "Harshavardhan T",
        role: "Backend Developer & Domain Expertise in AI/ML",
        github: "https://github.com/S-harshavardhana",
      },
    ];

    const fetchGithubProfiles = async () => {
      const data = await Promise.all(
        teamMembers.map(async (member) => {
          const response = await fetch(
            `https://api.github.com/users/${member.github.split("/").pop()}`
          );
          const profileData = await response.json();
          return {
            name: member.name,
            role: member.role,
            avatarUrl: profileData.avatar_url,
            bio: profileData.bio,
            publicRepos: profileData.public_repos,
            githubUrl: member.github,
          };
        })
      );
      setGithubData(data);
      setLoading(false);
    };

    fetchGithubProfiles();
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <section className="relative bg-gray-50 py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-green-200 opacity-20 z-0"></div>

      {/* Decorative elements for a more dynamic background */}
      <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      <div className="container mx-auto px-6 lg:px-12 z-10 relative">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          About Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaRocket className="mr-2 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-gray-600 mb-4">
              At Neuro Kodes, we aim to empower farmers with the tools and
              knowledge necessary to optimize agricultural processes. Our goal
              is to provide cutting-edge solutions for crop prediction, soil
              health analysis, and pest management, helping farmers achieve
              higher productivity with lower risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBullseye className="mr-2 text-green-600" />
              Our Vision
            </h2>
            <p className="text-gray-600 mb-4">
              We envision a future where agriculture is data-driven and
              sustainable. By leveraging technology, we aim to make farming
              smarter and more efficient for the benefit of communities,
              economies, and the environment.
            </p>
          </div>
        </div>

        {/* Combined Team and Guide Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Our Team
          </h2>

          {loading ? (
            <div className="text-center">
              <div className="loader"></div> {/* Loader */}
              <p className="text-center text-gray-600">
                Loading team members...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Guide Card First */}
              <div className="bg-white p-6 shadow-lg rounded-lg text-center transition-transform transform hover:scale-105">
                <Image
                  src={Shivamurthy}
                  alt="Dr. Shivamurthy RC"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                  width={96}
                  height={96}
                />
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Dr.Shivamurthy R.C
                </h3>
                <p className="text-gray-600 mb-4">
                  Dr.Shivamurthy R.C is our esteemed team guide and a researcher&apos;s
                  mentor.
                </p>
              </div>

              {/* Team Members */}
              {githubData.map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-6 shadow-lg rounded-lg text-center transition-transform transform hover:scale-105"
                >
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                    width={96}
                    height={96}
                  />
                  <div className="font-semibold text-lg text-gray-800 mb-2">
                    {member.name}
                  </div>
                  <p className="text-gray-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 mb-4">
                    Public Repos: {member.publicRepos}
                  </p>
                  <div className="mt-4 flex justify-center items-center space-x-2">
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub className="text-gray-800 hover:text-blue-600 text-2xl" />
                    </a>
                    <span className="text-gray-800 text-lg">GitHub</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Join Us Section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Join Us on Our Journey
          </h3>
          <p className="text-gray-600">
            We believe in collaboration and innovation. If you&apos;re passionate
            about transforming agriculture with technology, we would love to
            have you on our team. Get in touch to learn more about how you can
            be a part of our mission.
          </p>
        </div>
      </div>
    </section>
  );
}
