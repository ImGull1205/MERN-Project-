import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, Tag, Row, Col, Avatar } from "antd";
import { StarTwoTone, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("/api/bookings")
      .then(({ data }) => {
        setBookings(data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);

  const removeBooking = async (id) => {
    try {
      await axios.delete(`/api/bookings/${id}`);
      setBookings(prev => prev.filter(booking => booking._id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="text-2xl font-bold flex items-center gap-4 mb-6">
        <StarTwoTone className="text-2xl" />
        <span>Booking History</span>
      </div>

      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={bookings}
        renderItem={(booking) => (
          <List.Item
            className="border border-gray-400 p-6 shadow-md rounded-2xl mb-10"
            key={booking._id}
            extra={
              <div className="flex flex-col items-end gap-4">
                <img
                  width={272}
                  alt={booking.place.title}
                  src={booking.place.photos?.[0]}
                  className="object-cover h-48 rounded-lg"
                />
                
              </div>
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={booking.place.photos?.[0]} />}
              title={
                <Link to={`/detail/${booking.place._id}`}>
                  {booking.place.title}
                </Link>
              }
              description={
                <div>
                  <div className="text-gray-500">
                    Booking Date:{" "}
                    {new Date(booking.activationDate).toLocaleDateString()}
                  </div>
                  <div className="text-gray-500">
                    Price: {booking.totalPrice} ${" "}
                  </div>
                </div>
              }
            />
            <div>
              <Row gutter={10} className="flex items-center">
                <strong className="mr-2">Tickets:</strong>
                {booking.tickets.map((ticket, index) => (
                  <Col key={index} span={4} className="flex items-center">
                    <Tag color="blue">{ticket.type}</Tag>
                  </Col>
                ))}
                <strong className="mx-2">Quantities:</strong>
                {booking.tickets.map((ticket, index) => (
                  <Col key={index} span={4} className="flex items-center">
                    <Tag color="blue">{ticket.quantity}</Tag>
                  </Col>
                ))}
                <DeleteOutlined 
                  onClick={() => removeBooking(booking._id)}
                  className="text-red-500 hover:text-red-600 p-2 "
                />
              </Row>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookingHistory;