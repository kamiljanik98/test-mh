"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

const slides = [
  {
    title: "Welcome to Music Hub",
    description:
      "Your ultimate music companion. Easily upload, organize, and explore your personal audio collection in one seamless platform. Whether you're a casual listener or a professional creator, Music Hub empowers you to connect with your sound like never before.",
    subpoints: [
      "Centralized audio library for all your files",
      "Personalized dashboard with quick access",
      "Connect with a vibrant community of creators",
    ],
  },
  {
    title: "Upload & Organize Your Tracks",
    description:
      "Quickly upload your beats, loops, or full tracks with our intuitive drag-and-drop system. Organize your music with flexible tags and smart folders to keep your creative workflow smooth and efficient.",
    subpoints: [
      "Effortless drag-and-drop uploads",
      "Advanced tagging and metadata management",
      "Auto-generated waveform previews for easy navigation",
    ],
  },
  {
    title: "Discover Curated Content",
    description:
      "Explore daily updated playlists, trending audio loops, and handpicked tracks from creators worldwide. Discover new inspirations and expand your musical horizons effortlessly.",
    subpoints: [
      "Fresh daily charts to keep you updated",
      "Featured loops and stems selected by experts",
      "Follow your favorite creators and get notified",
    ],
  },
  {
    title: "Collaborate & Share Seamlessly",
    description:
      "Create private or public collections, invite collaborators, and share your work with customizable access controls. Get real-time feedback and grow your audience with ease.",
    subpoints: [
      "Invite-only collections for team projects",
      "Shareable links with configurable permissions",
      "Integrated feedback system for community interaction",
    ],
  },
];

export default function OnboardingPanel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setVisible(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <div
      className={twMerge(
        "bg-green-600 text-white p-6 md:p-12 shadow-lg select-none",
        "w-full max-w-md mx-auto my-6 md:rounded-r-3xl",
        "flex flex-col justify-between",
        "min-h-[320px]",
        "md:h-full md:max-w-none md:mx-0 md:my-0",
      )}
    >
      {/* Logo and Title (md+) */}
      <div className="hidden md:flex items-center gap-2">
        <Image src="/logo.svg" width={40} height={40} alt="Logo" />
        <h2 className="text-2xl font-semibold">Music Hub</h2>
      </div>

      {/* Slide Content */}
      <div
        key={index}
        className={twMerge(
          "transition-opacity duration-500 ease-in-out",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">{slide.title}</h1>
        <p className="mt-4 text-sm md:text-lg text-white/90 leading-relaxed">{slide.description}</p>
        <ul className="mt-4 md:mt-6 space-y-1 md:space-y-2 text-white/80 list-disc list-inside text-xs md:text-sm">
          {slide.subpoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Footer with navigation dots (md+) */}
      <div className="hidden md:flex items-center justify-between mt-8">
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setVisible(false);
                setTimeout(() => {
                  setIndex(i);
                  setVisible(true);
                }, 300);
              }}
              aria-label={`Slide ${i + 1}`}
              className={twMerge(
                "w-4 h-4 rounded-full transition duration-300 cursor-pointer",
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
        <p className="text-sm opacity-80 select-text">
          © {new Date().getFullYear()} Music Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
