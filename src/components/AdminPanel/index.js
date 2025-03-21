
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from '../../api/axiosSetup'
import axios from "axios";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [editingCode, setEditingCode] = useState(null);

  const nameRef = useRef();
  const descriptionRef = useRef();
  const priceRef = useRef();
  const quantityRef = useRef();
  const categoryRef = useRef();
  const imageUrlRef = useRef();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://ecommerce-backend-app-eunq.onrender.com/api/auth/products',{
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      price: priceRef.current.value,
      quantity: quantityRef.current.value,
      category: categoryRef.current.value,
      imageUrl: imageUrlRef.current.value,
    };

    console.log("editingCode",editingCode);

    try {
      const token = localStorage.getItem('token');
      if (editingCode) {
        
        const response = await axios.get('https://ecommerce-backend-app-eunq.onrender.com/api/auth/products',{
          headers: { Authorization: `Bearer ${token}` },
        });

        await axios.put(
          `https://ecommerce-backend-app-eunq.onrender.com/api/auth/updateProduct/${editingCode}`,
          newProduct,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          'https://ecommerce-backend-app-eunq.onrender.com/api/auth/registerProduct',
          newProduct,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchProducts();
      clearForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    nameRef.current.value = product.name;
    descriptionRef.current.value = product.description;
    priceRef.current.value = product.price;
    quantityRef.current.value = product.quantity;
    categoryRef.current.value = product.category;
    imageUrlRef.current.value = product.imageUrl;
    setEditingCode(product.productCode);
  };

  const handleDelete = async (productCode) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://ecommerce-backend-app-eunq.onrender.com/api/auth/deleteProduct/${productCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProducts();
      clearForm();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const clearForm = () => {
    nameRef.current.value = '';
    descriptionRef.current.value = '';
    priceRef.current.value = '';
    quantityRef.current.value = '';
    categoryRef.current.value = '';
    imageUrlRef.current.value = '';
    setEditingCode(null);
  };

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>
      <form onSubmit={handleFormSubmit} className="mb-4">
        <div className="form-group">
          <input type="text" ref={nameRef} placeholder="Name" className="form-control mb-2" required />
          <input type="text" ref={descriptionRef} placeholder="Description" className="form-control mb-2" required />
          <input type="number" ref={priceRef} placeholder="Price" className="form-control mb-2" required />
          <input type="number" ref={quantityRef} placeholder="Quantity" className="form-control mb-2" required />
          <input type="text" ref={categoryRef} placeholder="Category" className="form-control mb-2" required />
          <input type="text" ref={imageUrlRef} placeholder="Image URL" className="form-control mb-2" />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingCode ? 'Update Product' : 'Add Product'}
        </button>
        {editingCode && (
          <button type="button" onClick={clearForm} className="btn btn-secondary ml-2">
            Cancel Edit
          </button>
        )}
      </form>

      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Image URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.productCode}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.category}</td>
                <td>{product.imageUrl}</td>
                <td>
                  <button onClick={() => handleEdit(product)} className="btn btn-sm btn-warning mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.productCode)} className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No products available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
