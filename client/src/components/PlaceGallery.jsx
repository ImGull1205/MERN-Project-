import { useState } from "react";
import Image from "../pages/Image.jsx";

export default function PlaceGallery({ place }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? place.photos.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === place.photos.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative">
      {/* Slideshow */}
      <div className="relative max-w-5xl mx-auto">
        <Image
          src={place.photos?.[currentIndex]}
          alt={`Photo ${currentIndex + 1} of ${place.title}`}
          className="w-full h-auto object-cover rounded-lg"
        />

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-black py-2 px-4 rounded-full shadow-lg hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-black py-2 px-4 rounded-full shadow-lg hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Thumbnails Below */}
      <div className="flex justify-center gap-4 mt-4">
        {place.photos?.map((photo, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-lg overflow-hidden ${index === currentIndex ? "border-4 border-blue-500" : ""}`}
            onClick={() => setCurrentIndex(index)}
          >
            <Image
              src={photo}
              alt={`Thumbnail ${index + 1} of ${place.title}`}
              className="w-20 h-20 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
