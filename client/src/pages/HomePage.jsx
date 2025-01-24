import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  StarTwoTone,
  LikeOutlined,
  StarOutlined,
  MessageOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Avatar, List, Space, Button, Drawer } from "antd";
import FilterWidget from "../components/FilterWidget";

const removeDiacritics = (str) => {
  const diacritics = {
    a: ['á', 'à', 'ả', 'ã', 'ạ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
    e: ['é', 'è', 'ẻ', 'ẽ', 'ẹ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
    i: ['í', 'ì', 'ỉ', 'ĩ', 'ị'],
    o: ['ó', 'ò', 'ỏ', 'õ', 'ọ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
    u: ['ú', 'ù', 'ủ', 'ũ', 'ụ', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
    y: ['ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
    d: ['đ'],
  };

  for (let letter in diacritics) {
    diacritics[letter].forEach((diacritic) => {
      str = str.replace(new RegExp(diacritic, 'g'), letter);
    });
  }
  
  return str;
};

const HomePage = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Fetch filtered places based on query parameters
    const queryParams = new URLSearchParams(location.search);
    const searchParams = {
      province: queryParams.get('province'),
      district: queryParams.get('district'),
      street: queryParams.get('street'),
      features: queryParams.get('features'),
      tickets: queryParams.get('ticketTypes'),
      priceMin: queryParams.get('minPrice'),
      priceMax: queryParams.get('maxPrice'),
      searchQuery: queryParams.get('searchQuery'),
    };

    axios.get('/api/places', { params: searchParams })
      .then(({ data }) => {
        setPlaces(data);
        setFilteredPlaces(data);  
      })
      .catch((error) => {
        console.error('Error fetching places:', error);
      });
  }, [location.search]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('searchQuery');
    if (searchQuery) {
      const normalizedSearchQuery = removeDiacritics(searchQuery.toLowerCase());

      const filtered = places.filter((place) => {
        const normalizedTitle = removeDiacritics(place.title.toLowerCase());
        const normalizedDescription = removeDiacritics(place.description.toLowerCase());

        return (
          normalizedTitle.includes(normalizedSearchQuery) ||
          normalizedDescription.includes(normalizedSearchQuery)
        );
      });
      setFilteredPlaces(filtered);
    } else {
      setFilteredPlaces(places); 
    }
  }, [location.search, places]);

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const handleFilterToggle = () => {
    setFilterVisible(!filterVisible);
  };

  const handleFilteredPlaces = (filteredData) => {
    setFilteredPlaces(filteredData);
    setFilterVisible(false);  
  };

  return (
    <div className=" p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold flex items-center gap-4 ">
          <StarTwoTone className="text-2xl" />
          <span>Hot destinations</span>
        </div>
        <Button
          icon={<FilterOutlined />}
          onClick={handleFilterToggle}
          type="primary"
        >
          Filters
        </Button>
      </div>

      {/* Filter Drawer */}
      <Drawer
        title="Filter Options"
        placement="right"
        closable={true}
        onClose={handleFilterToggle}
        visible={filterVisible}
        width={400}
      >
        <FilterWidget onFilter={handleFilteredPlaces} />
      </Drawer>

      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={filteredPlaces}  
        renderItem={(item) => (
          <List.Item
            className="border border-gray-400 p-6 shadow-md rounded-2xl mb-10"  
            key={item.title}
            actions={[
              <IconText
                icon={StarOutlined}
                text="156"
                key="list-vertical-star-o"
              />,
              <IconText
                icon={LikeOutlined}
                text="156"
                key="list-vertical-like-o"
              />,
              <IconText
                icon={MessageOutlined}
                text="2"
                key="list-vertical-message"
              />,
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

export default HomePage;
