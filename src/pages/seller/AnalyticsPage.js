import React, { useState } from 'react';
import './AnalyticsPage.css';
import comicData from '../../comic_volumes_20.json';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  // Generate fictional sales data based on actual comics
  const topSellingComics = [
    { title: "Batman Vol 1", copies: 42, revenue: 1260, id: "batman-vol-1" },
    { title: "The Sandman", copies: 38, revenue: 950, id: "sandman" },
    { title: "Watchmen", copies: 27, revenue: 810, id: "watchmen" },
    { title: "Spider-Man: Miles Morales", copies: 24, revenue: 720, id: "miles-morales" },
    { title: "X-Men: Dark Phoenix Saga", copies: 19, revenue: 570, id: "dark-phoenix" }
  ];
  
  // Generate fictional monthly revenue data - only last 6 months
  const monthlyRevenue = [
    { month: 'Jul', revenue: 4100 },
    { month: 'Aug', revenue: 4600 },
    { month: 'Sep', revenue: 5200 },
    { month: 'Oct', revenue: 4900 },
    { month: 'Nov', revenue: 5800 },
    { month: 'Dec', revenue: 6500 }
  ];
  
  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...monthlyRevenue.map(item => item.revenue));
  
  // Generate fictional customer data
  const customerStats = {
    total: 248,
    new: 37,
    returning: 211,
    averageSpend: 42.75
  };
  
  // Generate fictional inventory stats
  const inventoryStats = {
    total: 156,
    lowStock: 12,
    outOfStock: 3,
    topGenre: "Superhero"
  };
  
  // Find actual comics from the JSON data for recommendations
  const getRecommendedComics = () => {
    // Filter for comics with high prices that might be valuable to stock
    return comicData
      .filter(comic => parseFloat(comic.Price.replace('$', '')) > 20)
      .slice(0, 3)
      .map(comic => ({
        title: comic.Title,
        price: comic.Price,
        author: comic.Author,
        publisher: comic.Publisher
      }));
  };
  
  const recommendedComics = getRecommendedComics();

  // Render the revenue chart bars
  const renderRevenueChart = () => {
    return (
      <div className="revenue-chart-container">
        <div className="revenue-chart-bars">
          {monthlyRevenue.map((item, index) => (
            <div className="revenue-chart-column" key={index}>
              <div className="revenue-chart-bar-container">
                <div 
                  className="revenue-chart-bar" 
                  style={{ height: `${(item.revenue / maxRevenue) * 70}%` }}
                  data-value={`$${item.revenue.toLocaleString()}`}
                ></div>
              </div>
              <div className="revenue-chart-label">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="analytics-page">
      <div className="comic-panel-background"></div>
      
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics</h1>
        <p className="analytics-subtitle">Track your sales performance</p>
        
        <div className="time-range-selector">
          <button 
            className={`time-button ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`time-button ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`time-button ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="analytics-summary">
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h3>Total Revenue</h3>
            <p className="summary-value">${timeRange === 'week' ? '1,245' : timeRange === 'month' ? '5,800' : '42,850'}</p>
            <p className="summary-change positive">+12.4% from last {timeRange}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📦</div>
          <div className="summary-content">
            <h3>Comics Sold</h3>
            <p className="summary-value">{timeRange === 'week' ? '42' : timeRange === 'month' ? '187' : '1,456'}</p>
            <p className="summary-change positive">+8.7% from last {timeRange}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">👥</div>
          <div className="summary-content">
            <h3>New Customers</h3>
            <p className="summary-value">{timeRange === 'week' ? '8' : timeRange === 'month' ? '37' : '248'}</p>
            <p className="summary-change positive">+5.2% from last {timeRange}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">⭐</div>
          <div className="summary-content">
            <h3>Avg. Rating</h3>
            <p className="summary-value">4.8/5</p>
            <p className="summary-change positive">+0.2 from last {timeRange}</p>
          </div>
        </div>
      </div>
      
      <div className="analytics-grid">
        <div className="analytics-card revenue-chart">
          <h3>Last 6 Months Revenue</h3>
          {renderRevenueChart()}
        </div>
        
        <div className="analytics-card top-comics">
          <h3>Top Selling Comics</h3>
          <div className="top-comics-list">
            {topSellingComics.map((comic, index) => (
              <div className="top-comic-item" key={index}>
                <div className="top-comic-rank">{index + 1}</div>
                <div className="top-comic-info">
                  <h4>{comic.title}</h4>
                  <p>{comic.copies} copies sold · ${comic.revenue} revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="analytics-card customer-stats">
          <h3>Customer Insights</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <p className="stat-value">{customerStats.total}</p>
              <p className="stat-label">Total Customers</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">{customerStats.new}</p>
              <p className="stat-label">New This Month</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">{customerStats.returning}</p>
              <p className="stat-label">Returning</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">${customerStats.averageSpend}</p>
              <p className="stat-label">Avg. Order Value</p>
            </div>
          </div>
        </div>
        
        <div className="analytics-card inventory-stats">
          <h3>Inventory Status</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <p className="stat-value">{inventoryStats.total}</p>
              <p className="stat-label">Total Items</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">{inventoryStats.lowStock}</p>
              <p className="stat-label">Low Stock</p>
            </div>
            <div className="stat-item">
              <p className="stat-value">{inventoryStats.outOfStock}</p>
              <p className="stat-label">Out of Stock</p>
            </div>
          </div>
        </div>
        
        <div className="analytics-card recommendations">
          <h3>Recommended to Stock</h3>
          <div className="recommendations-list">
            {recommendedComics.map((comic, index) => (
              <div className="recommendation-item" key={index}>
                <div className="recommendation-icon">💡</div>
                <div className="recommendation-info">
                  <h4>{comic.title}</h4>
                  <p>{comic.author} · {comic.publisher} · {comic.price}</p>
                  <p className="recommendation-reason">High demand based on market trends</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 