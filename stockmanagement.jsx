import React, { useState, useEffect } from 'react';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        ProductName: '',
        Description: '',
        Category: '',
        Price: '',
        InitialQuality: '',
    });
    const [updateIndex, setUpdateIndex] = useState(null);

    useEffect(() => {
        renderTable();
    }, []);

    const getProducts = () => {
        const storedProducts = localStorage.getItem('products');
        return storedProducts ? JSON.parse(storedProducts) : [];
    };

    const renderTable = () => {
        const storedProducts = getProducts();
        setProducts(storedProducts);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitProduct = () => {
        const newProduct = {
            ProductName: form.ProductName,
            Description: form.Description,
            Category: form.Category,
            Price: parseFloat(form.Price),
            InitialQuality: parseInt(form.InitialQuality, 10),
            Stock: parseInt(form.InitialQuality, 10),
        };

        if (!newProduct.ProductName || !newProduct.Description || !newProduct.Category || isNaN(newProduct.Price) || isNaN(newProduct.InitialQuality)) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const updatedProducts = [...products, newProduct];
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        renderTable();
        resetForm();
    };

    const resetForm = () => {
        setForm({
            ProductName: '',
            Description: '',
            Category: '',
            Price: '',
            InitialQuality: '',
        });
        setUpdateIndex(null);
    };

    const editProduct = (index) => {
        const productToEdit = products[index];
        setForm(productToEdit);
        setUpdateIndex(index);
    };

    const updateProduct = (e) => {
        e.preventDefault();
        const updatedProducts = products.map((product, index) => {
            if (index === updateIndex) {
                return {
                    ...product,
                    ...form,
                    Price: parseFloat(form.Price),
                    InitialQuality: parseInt(form.InitialQuality, 10),
                    Stock: parseInt(form.InitialQuality, 10),
                };
            }
            return product;
        });

        localStorage.setItem('products', JSON.stringify(updatedProducts));
        renderTable();
        resetForm();
    };

    const removeProduct = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        renderTable();
    };

    const deleteOutOfStock = () => {
        const filteredProducts = products.filter(product => product.Stock > 0);
        localStorage.setItem('products', JSON.stringify(filteredProducts));
        renderTable();
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        overflowX: 'auto', // Prevent horizontal overflow
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
        width: '100%',
        marginBottom: '20px',
    };

    const tableContainerStyle = {
        width: '100%',
        maxWidth: '800px',
        overflowX: 'auto', // Enables horizontal scroll for the table if content overflows
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    return (
        <div style={containerStyle}>
            <fieldset style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                <legend><h2>Add New Product</h2></legend>
                <form onSubmit={updateIndex !== null ? updateProduct : (e) => { e.preventDefault(); submitProduct(); }} style={formStyle}>
                    <input type="text" name="ProductName" placeholder="Product Name" value={form.ProductName} onChange={handleInputChange} required />
                    <input type="text" name="Description" placeholder="Description" value={form.Description} onChange={handleInputChange} required />
                    <input type="text" name="Category" placeholder="Category" value={form.Category} onChange={handleInputChange} required />
                    <input 
                        type="number" 
                        name="Price" 
                        placeholder="Price (M)" 
                        value={form.Price} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <input 
                        type="number" 
                        name="InitialQuality" 
                        placeholder="Initial Quantity" 
                        value={form.InitialQuality} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <button type="submit">{updateIndex !== null ? 'Update Product' : 'Submit'}</button>
                    <input type="reset" value="Reset" onClick={resetForm} />
                </form>
            </fieldset>

            <fieldset style={{ width: '100%', maxWidth: '800px', marginTop: '20px', textAlign: 'center' }}>
                <legend><h2>Data From Local Storage</h2></legend>
                <div style={tableContainerStyle}>
                    <table border="2" style={tableStyle}>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Price (M)</th>
                                <th>Initial Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.ProductName}</td>
                                    <td>{product.Description}</td>
                                    <td>{product.Category}</td>
                                    <td>{`M ${product.Price.toFixed(2)}`}</td> {/* Displaying price with Maloti symbol */}
                                    <td>{product.InitialQuality}</td>
                                    <td>
                                        <button onClick={() => editProduct(index)}>Edit</button>
                                        <button onClick={() => removeProduct(index)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </fieldset>

            <div style={{ marginTop: '20px' }}>
                <h2>Delete Out of Stock Products</h2>
                <button onClick={deleteOutOfStock}>Delete Out of Stock Products</button>
            </div>
        </div>
    );
};

export default InventoryManagement;
