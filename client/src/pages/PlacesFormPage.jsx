import PhotosUploader from "./PhotosUploader.jsx";
import Features from "./Features.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useLocation, Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

export default function PlacesFormPage() {
  const { state } = useLocation();
  const placeData = state?.placeData;
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState(placeData?.title || "");
  const [addedPhotos, setAddedPhotos] = useState(placeData?.photos || []);
  const [description, setDescription] = useState(placeData?.description || "");
  const [features, setFeatures] = useState(
    placeData?.features?.split(", ") || []
  );
  const [extraInfo, setExtraInfo] = useState(placeData?.extraInfo || "");
  const [locationData, setLocationData] = useState(
    placeData?.location || {
      province: "",
      district: "",
      street: "",
      houseNumber: "",
    }
  );
  const [tickets, setTickets] = useState(
    placeData?.tickets || [{ type: "", price: "" }]
  );
  const [redirect, setRedirect] = useState(false);

  function inputHeader(text) {
    return (
      <h2 className="text-xl text-app_yellow font-semibold mb-2">{text}</h2>
    );
  }

  function inputDescription(text) {
    return <p className="text-gray-400 text-sm mb-4">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  const handleLocationChange = (field, value) => {
    setLocationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTicketChange = (index, field, value) => {
    setTickets((prevTickets) => {
      const updatedTickets = [...prevTickets];
      updatedTickets[index][field] = value;
      return updatedTickets;
    });
  };

  const addTicket = () => {
    setTickets((prev) => [...prev, { type: "", price: "" }]);
  };

  const removeTicket = (index) => {
    setTickets((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title) newErrors.title = "Vui lòng nhập tiêu đề";
    if (!locationData.province)
      newErrors.province = "Vui lòng nhập tỉnh/thành phố";
    if (!locationData.district) newErrors.district = "Vui lòng nhập quận/huyện";
    if (!locationData.street) newErrors.street = "Vui lòng nhập tên đường";
    if (!locationData.houseNumber)
      newErrors.houseNumber = "Vui lòng nhập tên nhà";
    if (!addedPhotos.length) newErrors.photos = "Vui lòng thêm ít nhất 1 ảnh";
    if (tickets.length > 0) {
      const invalidTickets = tickets.some(
        (ticket) => !ticket.type || !ticket.price
      );
      if (invalidTickets) {
        newErrors.tickets = "Vui lòng điền đầy đủ thông tin cho tất cả các vé";
      }
    }
    if (!description) newErrors.description = "Vui lòng nhập mô tả";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function savePlace(ev) {
    ev.preventDefault();
    if (!validateForm()) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      const data = {
        title,
        province: locationData.province,
        district: locationData.district,
        street: locationData.street,
        houseNumber: locationData.houseNumber,
        photos: addedPhotos,
        description,
        features: features.join(", "),
        extraInfo,
        tickets,
      };

      if (placeData?._id) {
        await axios.put("/api/places", {
          id: placeData._id,
          ...data,
        });
      } else {
        await axios.post("/api/places", data);
      }
      setRedirect(true);
    } catch (error) {
      console.error("Error saving place:", error.response?.data || error);
    }
  }

    if (redirect) {
      return <Navigate to={"/myplaces"} />;
    }

  const inputClass =
    "w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-app_blue focus:outline-none";
  const buttonClass =
    "bg-app_blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <form onSubmit={savePlace} className="max-w-4xl mx-auto space-y-6">
        <div className="p-2 flex justify-center item-center">
          <Link
            to="/"
            className="bg-app_blue rounded-full py-2.5 px-4 inline-flex items-center gap-3 w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-app_yellow shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
            <span className="text-app_yellow font-bold text-base flex-1 text-center">
              SUNSHINE
            </span>
          </Link>
        </div>

        <div>
          {preInput("Title", "Your place's title. Short and catchy")}
          <input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="Title, for example: My lovely apt"
            className={`${inputClass} ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title}</span>
          )}
        </div>

        <div className="space-y-4">
          {inputHeader("Location")}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={locationData.province}
                onChange={(ev) =>
                  handleLocationChange("province", ev.target.value)
                }
                placeholder="Province"
                className={`${inputClass} ${
                  errors.province ? "border-red-500" : ""
                }`}
              />
              {errors.province && (
                <span className="text-red-500 text-sm">{errors.province}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                value={locationData.district}
                onChange={(ev) =>
                  handleLocationChange("district", ev.target.value)
                }
                placeholder="District"
                className={`${inputClass} ${
                  errors.district ? "border-red-500" : ""
                }`}
              />
              {errors.district && (
                <span className="text-red-500 text-sm">{errors.district}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                value={locationData.street}
                onChange={(ev) =>
                  handleLocationChange("street", ev.target.value)
                }
                placeholder="Street"
                className={`${inputClass} ${
                  errors.street ? "border-red-500" : ""
                }`}
              />
              {errors.street && (
                <span className="text-red-500 text-sm">{errors.street}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                value={locationData.houseNumber}
                onChange={(ev) =>
                  handleLocationChange("houseNumber", ev.target.value)
                }
                placeholder="House Number"
                className={`${inputClass} ${
                  errors.houseNumber ? "border-red-500" : ""
                }`}
              />
              {errors.houseNumber && (
                <span className="text-red-500 text-sm">
                  {errors.houseNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {preInput("Photos", "More = better")}
          <div>
            <PhotosUploader
              addedPhotos={addedPhotos}
              onChange={setAddedPhotos}
            />
            {errors.photos && (
              <span className="text-red-500 text-sm">{errors.photos}</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {preInput("Description", "Description of the place")}
          <textarea
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            className={`${inputClass} ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <span className="text-red-500 text-sm">{errors.description}</span>
          )}
        </div>

        <div className="space-y-4">
          {preInput("Features", "Select all the features of your place")}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Features selected={features} onChange={setFeatures} />
          </div>
        </div>

        <div className="space-y-4">
          {inputHeader("Tickets")}
          {tickets.map((ticket, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr,1fr,auto] items-center gap-4"
            >
              <input
                type="text"
                value={ticket.type}
                onChange={(ev) =>
                  handleTicketChange(index, "type", ev.target.value)
                }
                placeholder="Ticket type"
                className={`${inputClass} ${
                  errors.tickets ? "border-red-500" : ""
                }`}
              />
              <input
                type="number"
                value={ticket.price}
                onChange={(ev) =>
                  handleTicketChange(index, "price", ev.target.value)
                }
                placeholder="Price"
                className={`${inputClass} ${
                  errors.tickets ? "border-red-500" : ""
                }`}
              />
              <DeleteOutlined
                onClick={() => removeTicket(index)}
                className="text-red-500 hover:text-red-600 p-2 border border-app_blue rounded cursor-pointer"
              />
            </div>
          ))}
          <div className="flex justify-between space-y-2">
          <button
            type="button"
            onClick={addTicket}
            className={`${buttonClass} w-full md:w-auto`}
          >
            Add Ticket
          </button>
          {errors.tickets && (
            <span className="text-red-500 text-sm ">{errors.tickets}</span>
          )}
        </div>
        </div>
        <div className="space-y-4">
          {preInput("Extra info", "House rules, etc")}
          <textarea
            value={extraInfo}
            onChange={(ev) => setExtraInfo(ev.target.value)}
            className={`${inputClass} resize-none h-32`}
          />
        </div>

        <div className="flex justify-between">
          <button className={`${buttonClass} w-full md:w-auto`}>Save</button>
          <Link to="/myplaces" className={`${buttonClass} w-full md:w-auto`}>
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
