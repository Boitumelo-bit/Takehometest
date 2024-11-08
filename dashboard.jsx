import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { Line } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Import images from assets
import food1 from './assets/food1.jpg';
import food2 from './assets/food2.jpg';
import food3 from './assets/food3.jpg';
import food4 from './assets/food4.jpg';
import food5 from './assets/food5.jpg';
import food6 from './assets/food6.jpg';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InventoryDashboard = () => {
    const [products, setProducts] = useState([]);
    const [totalStock, setTotalStock] = useState(0);
    const [lowStockAlert, setLowStockAlert] = useState('');
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Stock Levels',
                data: [],
                fill: false,
                borderColor: '#4caf50',
                tension: 0.1,
            },
        ],
    });

    useEffect(() => {
        const getProducts = () => {
            const products = localStorage.getItem('products');
            return products ? JSON.parse(products) : [];
        };

        const renderStockTable = () => {
            const products = getProducts();
            let totalStock = 0;
            const lowStockProducts = [];
            const stockLevels = [];
            const productNames = [];

            products.forEach((product) => {
                totalStock += product.Stock;
                if (product.Stock < 10) {
                    lowStockProducts.push(product.ProductName);
                }
                stockLevels.push(product.Stock);
                productNames.push(product.ProductName);
            });

            setProducts(products);
            setTotalStock(totalStock);
            setLowStockAlert(lowStockProducts.length > 0 ? `Low stock alert for: ${lowStockProducts.join(', ')}` : '');

            setChartData({
                labels: productNames,
                datasets: [
                    {
                        label: 'Stock Levels',
                        data: stockLevels,
                        fill: false,
                        borderColor: '#4caf50',
                        tension: 0.1,
                    },
                ],
            });
        };

        renderStockTable();
    }, []);

    const getStockPercentage = (stock) => {
        return Math.min((stock / totalStock) * 100, 100);
    };

    const formatPrice = (price) => {
        return `M ${price.toFixed(2)}`;
    };

    return (
        <div>
            <h1>Inventory Dashboard</h1>
            <div id="lowStockAlert">
                {lowStockAlert && <p>{lowStockAlert}</p>}
            </div>

            {/* Trending Items Section */}
            <div id="trendingItems">
                <h2>What’s Trending Today</h2>
                <div className="trending-images">
                    <img src={food2} alt="Trending Item 1" className="trending-item" />
                    <img src={food3} alt="Trending Item 2" className="trending-item" />
                    <img src={food4} alt="Trending Item 3" className="trending-item" />
                </div>
            </div>

            {/* Items of the Month Section */}
            <div id="itemsOfTheMonth">
                <h2>Items of the Month</h2>
                <div className="monthly-items">
                    <img src={food1} alt="Item of the Month 1" className="monthly-item" />
                    <img src={food5} alt="Item of the Month 2" className="monthly-item" />
                    <img src={food6} alt="Item of the Month 3" className="monthly-item" />
                </div>
            </div>

            <div id="stockChart">
                <h2>Stock Levels Graph</h2>
                {chartData.labels.length > 0 && chartData.datasets[0].data.length > 0 ? (
                    <Line data={chartData} />
                ) : (
                    <p>No data to display for the chart</p>
                )}
            </div>

            <table id="stockTable">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Stock Level</th>
                        <th>Price (M)</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.ProductName}</td>
                            <td>{product.Category}</td>
                            <td>{product.Stock}</td>
                            <td>
                                <div className="stock-circle">
                                    <div
                                        className="circle"
                                        style={{
                                            background: `conic-gradient(#4caf50 ${getStockPercentage(product.Stock)}%, #ddd 0%)`
                                        }}
                                    >
                                        <span>{Math.round(getStockPercentage(product.Stock))}%</span>
                                    </div>
                                </div>
                            </td>
                            <td>{formatPrice(product.Price)}</td>
                            <td>{product.Description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="summary">
                <p>Total Stock: <strong>{totalStock}</strong></p>
            </div>
        </div>
    );
};

export default InventoryDashboard;
