import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  StarTwoTone,
  LikeOutlined, 
  StarOutlined,
  MessageOutlined,
  EditOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import { Avatar, List, Space, Button } from "antd";

const MyPlaces = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    loadUserPlaces();
  }, []);

  const loadUserPlaces = async () => {
    try {
      const { data } = await axios.get('/api/user-places');
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching user places:', error);
    }
  };

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold flex items-center gap-4">
          <StarTwoTone className="text-2xl" />
          <span>My Uploaded</span>
        </div>
        <Link to={'/places'}>
          <Button type="primary" icon={<PlusCircleOutlined />}>
            Add New Place
          </Button>
        </Link>
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
        dataSource={places}
        renderItem={(item) => (
          <List.Item
            className="border border-gray-400 p-6 shadow-md rounded-2xl mb-10"
            key={item._id}
            actions={[
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
              <Link 
                to={'/places'}
                state={{ placeData: item }}
                className="text-blue-500 flex items-center"
              >
                <EditOutlined /> Edit
              </Link>
            ]}
            extra={
              <img 
                width={272} 
                alt={item.title} 
                src={item.photos?.[0]} 
                className="object-cover h-48 rounded-lg"
              />
            }
          >
            <List.Item.Meta
              avatar={<Avatar src={item.photos?.[0]} />}
              title={<Link to={`/detail/${item._id}`}>{item.title}</Link>}
              description={item.description}
            />
            <div className="text-gray-500">
              Location: {item.location?.province}, {item.location?.district}, {item.location?.street}, {item.location?.houseNumber}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyPlaces;