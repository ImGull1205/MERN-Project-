import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState} from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import LocationDetail from "./pages/LocationDetail";
import BookingHistory from "./pages/BookingHistory";
import PlacesFormPage from "./pages/PlacesFormPage";
import ResetPasswordPage from "./pages/ForgotPassword"
import MyPlaces from "./pages/MyPlace";
import axios from "axios";
import { UserContextProvider } from "./components/UserContext";

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query); 
  };

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout onSearch={handleSearch} />}>
          <Route index element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/detail/:id" element={<LocationDetail />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="/myplaces" element={<MyPlaces />} />
        </Route>
        <Route path="/forgotpassword" element={<ResetPasswordPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/places" element={<PlacesFormPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;