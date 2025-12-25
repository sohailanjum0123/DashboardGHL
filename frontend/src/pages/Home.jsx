import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../components/layout/HomeHeader";

// Carousel data
const carouselAds = [
  {
    title: "🚀 GoHighLevel Automation",
    description:
      "Automate leads, pipelines, SMS, email, and follow-ups with GoHighLevel.",
    cta: "Start Now",
  },
  {
    title: "📈 Funnels & CRM",
    description:
      "Create funnels, manage contacts, and close more deals in one place.",
    cta: "Start Now",
  },
  {
    title: "💼 White-Label SaaS",
    description:
      "Launch your own SaaS business using GoHighLevel white-label tools.",
    cta: "Start Now",
  },
];

// 10 Addons data
const addons = [
  {
    title: "Clone Custom Fields",
    desc: "Duplicate custom fields easily for your workflows.",
  },
  {
    title: "Delete Custom Fields",
    desc: "Remove unnecessary custom fields quickly.",
  },
  {
    title: "Bulk Delete",
    desc: "Delete multiple records or fields in one click.",
  },
  {
    title: "Custom Values",
    desc: "Set custom values for contacts or pipelines.",
  },
  { title: "Automation", desc: "Automate tasks, emails, and follow-ups." },
  {
    title: "Marketing Campaigns",
    desc: "Run email and SMS campaigns seamlessly.",
  },
  {
    title: "Pipelines & Deals",
    desc: "Manage your sales pipeline efficiently.",
  },
  { title: "White-Label SaaS", desc: "Launch your own branded SaaS platform." },
  {
    title: "Reporting & Analytics",
    desc: "Track your performance with powerful reports.",
  },
  {
    title: "Integrations",
    desc: "Connect with external apps like Zapier, Stripe, and more.",
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto slide for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselAds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <HomeHeader />
      <div className="p-6 max-w-7xl mx-auto space-y-12">
        {/* Carousel Section */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Recommended for You
          </h1>

          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {carouselAds.map((ad, index) => (
                <div
                  key={index}
                  className="min-w-full p-8 flex flex-col justify-center"
                >
                  <h2 className="text-2xl font-bold text-gray-800">
                    {ad.title}
                  </h2>
                  <p className="text-gray-600 mt-3 max-w-xl">
                    {ad.description}
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="mt-6 w-fit bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition"
                  >
                    {ad.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselAds.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeIndex === index ? "bg-yellow-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Addons Slider/Grid Section */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            GHL Addons
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {addons.map((addon, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md border p-5 hover:scale-105 transform transition"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {addon.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2">{addon.desc}</p>
                <a
                  href="https://www.gohighlevel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-4 text-sm font-medium text-white bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Explore
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
