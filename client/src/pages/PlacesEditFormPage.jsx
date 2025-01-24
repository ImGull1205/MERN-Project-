import PhotosUploader from "./PhotosUploader.jsx";
import Features from "./Features.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams, Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

export default function PlacesEditFormPage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState({
    province: '',
    district: '',
    street: '',
    houseNumber: '',
  });
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [tickets, setTickets] = useState([{ type: '', price: '' }]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) return;
  
   
    const fetchPlaceData = async () => {
      try {
        const response = await axios.get(`/api/places/${id}`);
        const { place } = response.data;
        setTitle(place.title);
        setLocation(place.location || {
          province: '',
          district: '',
          street: '',
          houseNumber: '',
        });
        setAddedPhotos(place.photos || []);
        setDescription(place.description || '');
        setFeatures(place.features ? place.features.split(',').map(feature => feature.trim()) : []);
        setTickets(place.tickets || [{ type: '', price: '' }]);
        setExtraInfo(place.extraInfo || '');
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    };
  
    fetchPlaceData();
  }, [id]);

  const handleLocationChange = (field, value) => {
    setLocation((prev) => ({ ...prev, [field]: value }));
  };

  const handleTicketChange = (index, field, value) => {
    setTickets((prevTickets) => {
      const updatedTickets = [...prevTickets];
      updatedTickets[index][field] = value;
      return updatedTickets;
    });
  };

  const addTicket = () => {
    setTickets((prev) => [...prev, { type: '', price: '' }]);
  };

  const removeTicket = (index) => {
    setTickets((prev) => prev.filter((_, i) => i !== index));
  };

  async function updatePlace(ev) {
    ev.preventDefault();
    const placeData = {
      id,
      title,
      province: location.province,       
      district: location.district,       
      street: location.street,           
      houseNumber: location.houseNumber,
      addedPhotos,
      description,
      features: features.join(', '),
      extraInfo,
      tickets,
    };

    await axios.put(`/api/places`, placeData); // Update API endpoint
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to="/myplaces" />;
  }

  const inputClass =
    "w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-app_blue focus:outline-none";
  const buttonClass =
    "bg-app_blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {loading ? (
        <p className="text-center text-gray-400">Loading place data...</p>
      ) : (
        <form onSubmit={updatePlace} className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-center text-app_yellow">
            Edit Place Information
          </h1>
          <div className="p-2 flex justify-center item-center">
            <Link
              to="/"
              className="bg-app_blue rounded-full py-2.5 px-4 inline-flex items-center gap-3 w-full justify-center"
            >
              <span className="text-app_yellow font-bold text-base flex-1 text-center">
                SUNSHINE
              </span>
            </Link>
          </div>
          {/* Title */}
          <label className="block text-app_yellow">Title</label>
          <input
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="Title, for example: My lovely apt"
            className={inputClass}
          />

          {/* Location */}
          <div className="space-y-4">
            <label className="block text-app_yellow">Location</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={location.province}
                onChange={(ev) => handleLocationChange('province', ev.target.value)}
                placeholder="Province"
                className={inputClass}
              />
              <input
                type="text"
                value={location.district}
                onChange={(ev) => handleLocationChange('district', ev.target.value)}
                placeholder="District"
                className={inputClass}
              />
              <input
                type="text"
                value={location.street}
                onChange={(ev) => handleLocationChange('street', ev.target.value)}
                placeholder="Street"
                className={inputClass}
              />
              <input
                type="text"
                value={location.houseNumber}
                onChange={(ev) => handleLocationChange('houseNumber', ev.target.value)}
                placeholder="House Number"
                className={inputClass}
              />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <label className="block text-app_yellow">Photos</label>
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <label className="block text-app_yellow">Description</label>
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              className={`${inputClass} resize-none h-32`}
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            <label className="block text-app_yellow">Features</label>
            <Features selected={features} onChange={setFeatures} />
          </div>

          {/* Tickets */}
          <div className="space-y-4">
            <label className="block text-app_yellow">Tickets</label>
            {tickets.map((ticket, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr,1fr,auto] items-center gap-4"
              >
                <input
                  type="text"
                  value={ticket.type}
                  onChange={(ev) =>
                    handleTicketChange(index, 'type', ev.target.value)
                  }
                  placeholder="Ticket type"
                  className={inputClass}
                />
                <input
                  type="number"
                  value={ticket.price}
                  onChange={(ev) =>
                    handleTicketChange(index, 'price', ev.target.value)
                  }
                  placeholder="Price"
                  className={inputClass}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTicket}
              className={`${buttonClass} w-full md:w-auto`}
            >
              Add Ticket
            </button>
          </div>

          {/* Extra Info */}
          <div className="space-y-4">
            <label className="block text-app_yellow">Extra Info</label>
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
              className={`${inputClass} resize-none h-32`}
            />
          </div>

          {/* Save and Cancel */}
          <div className="flex justify-between">
            <button className={`${buttonClass} w-full md:w-auto`}>
              Save Changes
            </button>
            <Link to="/" className={`${buttonClass} w-full md:w-auto`}>
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
