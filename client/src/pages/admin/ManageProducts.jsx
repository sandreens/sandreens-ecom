import React, { useState } from 'react';
import { createProduct } from '../../services/productService';

const ManageProducts = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        category: '',
        stock: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct(formData);
            setMessage('Product added successfully!');
            setFormData({ name: '', price: '', description: '', imageUrl: '', category: '', stock: '' });
        } catch (error) {
            setMessage('Failed to add product. ' + error.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
            
            {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Price ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Image URL (Cloudinary)</label>
                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"></textarea>
                    </div>
                </div>
                
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default ManageProducts;
