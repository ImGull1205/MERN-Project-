import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PlaceGallery from "../components/PlaceGallery";
import BookingWidget from "../components/BookingWidget";
import { UserContext } from "../components/UserContext";
import 'flowbite';

export default function LocationDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewPoint, setReviewPoint] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [averageRating, setAverageRating] = useState(false);
  const { user } = useContext(UserContext);
  const [userReview, setUserReview] = useState(null);

  const fetchPlace = async () => {
    try {
      const response = await axios.get(`/api/places/${id}`);
      const { place, reviews } = response.data;
      setPlace(place);
      setReviews(reviews);
      
      const averageRating = reviews.reduce((sum, review) => sum + review.point, 0) / reviews.length;
      setAverageRating(averageRating);
 
      const existingReview = reviews.find((review) => review.user._id === user?._id);
      if (existingReview) {
        setUserReview(existingReview);
        setReviewPoint(existingReview.point);
        setReviewText(existingReview.comment);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching place data:", error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchPlace();
  }, [id, user]);

  const handleReviewSubmit = async () => {
    if (!user) {
      alert("You need to be logged in to submit a review.");
      return;
    }
 
    if (!reviewText || reviewPoint === 0) {
      setError("Please provide a rating and a comment.");
      return;
    }
 
    try {
      if (isEditing && userReview) {
        await axios.put("/api/reviews", {
          placeId: id,
          reviewId: userReview._id,
          point: reviewPoint,
          comment: reviewText,
        });
        window.location.reload();
      } else {
        await axios.post("/api/reviews", {
          placeId: id,
          point: reviewPoint,
          comment: reviewText,
        });
      }
      
      // Refresh data 
      await fetchPlace();
 
      // Reset form
      setReviewPoint(0);
      setReviewText("");
      setError(null);
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Error submitting review.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!place) {
    return <p>Place not found.</p>;
  }

  

  const { title, description, location,features,extraInfo } = place;
  const { province, district, street, houseNumber } = location || {};

  return (
    <div>
      <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              <PlaceGallery place={place} />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {title}
              </h1>
              {reviews.length > 0 && (
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`h-5 w-5 ${index < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-500 dark:text-gray-400">
          {averageRating.toFixed(1)} / 5
        </span>
      </div>
    )}
              <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />
              

              
              <p className="mb-6 text-gray-500 dark:text-gray-400">
  {description}
</p>

{location && (
  <div className="mb-6 text-gray-500 dark:text-gray-400">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location:</h3>
    <p>{location.houseNumber}, {location.street}</p>
    <p>{location.district}, {location.province}</p>
  </div>
)}

{features && (
  <div className="mb-6 text-gray-500 dark:text-gray-400">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features:</h3>
    <ul className="list-disc list-inside">
      {features.split(',').map((feature, index) => (
        <li key={index} className="capitalize">{feature.trim()}</li>
      ))}
    </ul>
  </div>
)}

{extraInfo && (
  <div className="mb-6 text-gray-500 dark:text-gray-400">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Extra Info:</h3>
    <p>{extraInfo}</p>
  </div>
)}

            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div>
            <BookingWidget place={place} />
          </div>
        </div>
      </section>

      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Write a Review</h2>
              {error && <p className="text-red-500">{error}</p>}
              <div className="my-4">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
                ></textarea>
              </div>

              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((point) => (
                  <button
                    key={point}
                    onClick={() => setReviewPoint(point)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${reviewPoint >= point ? "bg-yellow-500" : "bg-gray-300"}`}
                  >
                    {point}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleReviewSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {isEditing ? "Edit Review" : "Submit Review"}
                </button>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Reviews
            </h2>

            {reviews.slice(0, 5).map((review) => (
              <div key={review._id} className="mb-4 p-4 border rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`h-5 w-5 ${index < review.point ? "text-yellow-500" : "text-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                      </svg>
                    ))}
                  </div>
                  <p className="ml-2 text-gray-500 dark:text-gray-400">{review.user.name}</p>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{review.comment}</p>
              </div>
            ))}

            {reviews.length > 5 && (
              <button className="text-blue-500">Show more</button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

