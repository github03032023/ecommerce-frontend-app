import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ProductList from '../ProductList';

const ProductsDBData = ({ searchQuery }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios.get('http://localhost:5000/api/auth/fetchProducts')
      .then((response) => {
        console.log("response: ", response?.data);
        setData(response?.data.products);
      })
      .catch((err) => {
        console.log("error : ", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  // Filter products based on search query
  const filteredData = data.filter(product =>
    product.name.toLowerCase().includes(searchQuery) // Assumes product name exists
  );



  return (
    <ProductList products={filteredData} />
  )
};

export default ProductsDBData