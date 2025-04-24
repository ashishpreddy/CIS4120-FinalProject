import React, { useState, useEffect } from 'react';
import './OrdersPage.css';
import comicData from '../../comic_volumes_20.json';

// Import fallback image
import defaultCover from '../../assets/batman-vol-1-1.jpg';

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [comicImages, setComicImages] = useState({});
  // Add notification state
  const [notification, setNotification] = useState(null);
  
  // Use state for orders instead of a constant
  const [orders, setOrders] = useState([
    {
      id: 'ORD-10001',
      date: '03/15/2023',
      customer: 'Alex Johnson',
      customerId: 'C1001',
      address: '123 Comic Lane, New York, NY 10001',
      items: [
        {
          id: 'ITEM-1001',
          title: 'Batman Vol. 1 #1',
          price: '$29.99',
          quantity: 1,
          image: ''
        },
        {
          id: 'ITEM-1002',
          title: 'Saga Vol. 1 #1',
          price: '$24.99',
          quantity: 2,
          image: ''
        }
      ],
      total: '79.97',
      status: 'pending',
      paymentMethod: 'Credit Card',
      notes: ''
    },
    {
      id: 'ORD-10002',
      date: '03/14/2023',
      customer: 'Sam Wilson',
      customerId: 'C1002',
      address: '456 Hero Ave, Los Angeles, CA 90001',
      items: [
        {
          id: 'ITEM-2001',
          title: 'The Walking Dead Vol. 1 #1',
          price: '$19.99',
          quantity: 1,
          image: ''
        }
      ],
      total: '19.99',
      status: 'processing',
      paymentMethod: 'PayPal',
      notes: ''
    },
    {
      id: 'ORD-10003',
      date: '03/10/2023',
      customer: 'Jamie Lee',
      customerId: 'C1003',
      address: '789 Marvel St, Chicago, IL 60007',
      items: [
        {
          id: 'ITEM-3001',
          title: 'Amazing Spider-Man Vol. 1 #1',
          price: '$22.99',
          quantity: 1,
          image: ''
        },
        {
          id: 'ITEM-3002',
          title: 'X-Men Vol. 1 #1',
          price: '$24.99',
          quantity: 1,
          image: ''
        }
      ],
      total: '47.98',
      status: 'shipped',
      paymentMethod: 'Credit Card',
      notes: ''
    },
    {
      id: 'ORD-10004',
      date: '03/05/2023',
      customer: 'Taylor Kim',
      customerId: 'C1004',
      address: '321 DC Blvd, Miami, FL 33101',
      items: [
        {
          id: 'ITEM-4001',
          title: 'Superman Vol. 1 #1',
          price: '$17.99',
          quantity: 1,
          image: ''
        }
      ],
      total: '17.99',
      status: 'delivered',
      paymentMethod: 'PayPal',
      notes: ''
    },
    {
      id: 'ORD-10005',
      date: '03/01/2023',
      customer: 'Jordan Smith',
      customerId: 'C1005',
      address: '654 Gotham Rd, Seattle, WA 98101',
      items: [
        {
          id: 'ITEM-5001',
          title: 'Batman Vol. 1 #1',
          price: '$14.99',
          quantity: 1,
          image: ''
        }
      ],
      total: '14.99',
      status: 'returned',
      paymentMethod: 'Credit Card',
      notes: 'Customer received damaged item'
    },
    {
      id: 'ORD-10006',
      date: '03/16/2023',
      customer: 'Morgan Chen',
      customerId: 'C1006',
      address: '987 Comic Blvd, Boston, MA 02108',
      items: [
        {
          id: 'ITEM-6001',
          title: 'Saga Vol. 1 #1',
          price: '$9.99',
          quantity: 1,
          image: ''
        },
        {
          id: 'ITEM-6002',
          title: 'Invincible Vol. 1 #1',
          price: '$9.99',
          quantity: 1,
          image: ''
        }
      ],
      total: '19.98',
      status: 'pending',
      paymentMethod: 'PayPal',
      notes: ''
    },
    {
      id: 'ORD-10007',
      date: '03/13/2023',
      customer: 'Casey Jones',
      customerId: 'C1007',
      address: '456 Turtle St, Philadelphia, PA 19102',
      items: [
        {
          id: 'ITEM-7001',
          title: 'Fantastic Four Vol. 1 #1',
          price: '$16.99',
          quantity: 1,
          image: ''
        }
      ],
      total: '16.99',
      status: 'processing',
      paymentMethod: 'Credit Card',
      notes: ''
    },
    {
      id: 'ORD-10008',
      date: '03/09/2023',
      customer: 'Riley Parker',
      customerId: 'C1008',
      address: '789 Hero Lane, San Francisco, CA 94103',
      items: [
        {
          id: 'ITEM-8001',
          title: 'Invincible Vol. 1 #1',
          price: '$12.99',
          quantity: 3,
          image: ''
        }
      ],
      total: '38.97',
      status: 'shipped',
      paymentMethod: 'PayPal',
      notes: ''
    }
  ]);
  
  // Improved function to get image path from comic data
  const getImagePath = (comicTitle) => {
    try {
      // Find the comic in the JSON data by doing a more flexible match
      const comic = comicData.find(c => {
        // Try exact match first
        if (c.Title === comicTitle) return true;
        
        // Try partial matches (case insensitive)
        const normalizedTitle = comicTitle.toLowerCase();
        const normalizedDataTitle = c.Title ? c.Title.toLowerCase() : '';
        
        return normalizedDataTitle.includes(normalizedTitle) || 
               normalizedTitle.includes(normalizedDataTitle);
      });
      
      if (comic && comic.CoverImage) {
        // Extract just the filename from the path in the JSON
        const filename = comic.CoverImage.split('/').pop();
        // Try to require the image from assets
        return require(`../../assets/${filename}`);
      }
      throw new Error('Comic not found');
    } catch (error) {
      console.log('Error loading image for', comicTitle, error);
      // If image not found, return default cover
      return defaultCover;
    }
  };
  
  // Load comic images from the JSON data
  useEffect(() => {
    const imageMap = {};
    comicData.forEach(comic => {
      if (comic.Title) {
        // Store the image path using the same function we use for rendering
        try {
          imageMap[comic.Title] = getImagePath(comic.Title);
        } catch (e) {
          imageMap[comic.Title] = defaultCover;
        }
      }
    });
    setComicImages(imageMap);
  }, []);
  
  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });
  
  // Count orders by status
  const orderCounts = {
    all: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    processing: orders.filter(order => order.status === 'processing').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    returned: orders.filter(order => order.status === 'returned').length
  };
  
  // Handle order status change with notification and update order status
  const handleStatusChange = (orderId, newStatus) => {
    // Update the orders array with the new status
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    // Update the orders state
    setOrders(updatedOrders);
    
    // Show notification
    showNotification(`Order ${orderId} has been updated to ${newStatus}`);
    
    // If the current tab is not 'all', switch to the new status tab
    if (activeTab !== 'all') {
      setActiveTab(newStatus);
    }
    
    // Close the expanded order view
    setExpandedOrder(null);
  };
  
  // Function to handle cancel order
  const handleCancelOrder = (orderId) => {
    // Update the orders array with cancelled status
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'returned', notes: order.notes + ' Order cancelled by seller.' };
      }
      return order;
    });
    
    // Update the orders state
    setOrders(updatedOrders);
    
    // Show notification
    showNotification(`Order ${orderId} has been cancelled`);
    
    // If the current tab is not 'all', switch to the returned tab
    if (activeTab !== 'all') {
      setActiveTab('returned');
    }
    
    // Close the expanded order view
    setExpandedOrder(null);
  };
  
  // Function to handle contact customer
  const handleContactCustomer = (orderId, customerName) => {
    console.log(`Contacting customer for order ${orderId}`);
    showNotification(`Sending message to ${customerName}`);
  };
  
  // Function to show notification
  const showNotification = (message) => {
    setNotification(message);
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  // Render status badge with appropriate color
  const renderStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      returned: 'status-returned'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Improved render item image function
  const renderItemImage = (item) => {
    // Try to find a matching comic in our data
    const matchingComic = comicData.find(comic => {
      const itemTitle = item.title.toLowerCase();
      const comicTitle = comic.Title ? comic.Title.toLowerCase() : '';
      
      return comicTitle === itemTitle || 
             comicTitle.includes(itemTitle) || 
             itemTitle.includes(comicTitle);
    });
    
    let imageSrc = defaultCover;
    if (matchingComic) {
      try {
        // Use the cover image from the matching comic
        const filename = matchingComic.CoverImage.split('/').pop();
        imageSrc = require(`../../assets/${filename}`);
      } catch (error) {
        console.log('Error loading specific image:', error);
      }
    }
    
    return (
      <div className="item-image">
        <img 
          src={imageSrc} 
          alt={item.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.parentNode.innerHTML = '<div class="placeholder-image"><span>📚</span></div>';
          }}
        />
      </div>
    );
  };

  return (
    <div className="orders-page">
      <div className="comic-panel-background"></div>
      
      {/* Add notification display */}
      {notification && (
        <div className="notification-popup">
          <p>{notification}</p>
        </div>
      )}
      
      <div className="orders-header">
        <h1 className="orders-title">Orders</h1>
        <p className="orders-subtitle">Manage your comic sales</p>
      </div>
      
      <div className="orders-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
          <span className="tab-count">{orderCounts.all}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
          <span className="tab-count">{orderCounts.pending}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'processing' ? 'active' : ''}`}
          onClick={() => setActiveTab('processing')}
        >
          Processing
          <span className="tab-count">{orderCounts.processing}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'shipped' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipped')}
        >
          Shipped
          <span className="tab-count">{orderCounts.shipped}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
          <span className="tab-count">{orderCounts.delivered}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'returned' ? 'active' : ''}`}
          onClick={() => setActiveTab('returned')}
        >
          Returned
          <span className="tab-count">{orderCounts.returned}</span>
        </button>
      </div>
      
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No {activeTab} orders found</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                <div className="order-header-left">
                  <h3 className="order-id">{order.id}</h3>
                  <p className="order-date">{order.date}</p>
                </div>
                <div className="order-header-right">
                  <p className="order-customer">{order.customer}</p>
                  <p className="order-total">${order.total}</p>
                  {renderStatusBadge(order.status)}
                  <span className="expand-icon">
                    {expandedOrder === order.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>
              
              {expandedOrder === order.id && (
                <div className="order-details">
                  <div className="order-details-section">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> {order.customer}</p>
                    <p><strong>ID:</strong> {order.customerId}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  </div>
                  
                  <div className="order-details-section">
                    <h4>Order Items</h4>
                    <div className="order-items">
                      {order.items.map(item => (
                        <div className="order-item" key={item.id}>
                          {renderItemImage(item)}
                          <div className="item-details">
                            <h5>{item.title}</h5>
                            <p>Price: {item.price} × {item.quantity}</p>
                            <p>Subtotal: ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {order.notes && (
                    <div className="order-details-section">
                      <h4>Notes</h4>
                      <p>{order.notes}</p>
                    </div>
                  )}
                  
                  <div className="order-actions">
                    {order.status === 'pending' && (
                      <>
                        <button 
                          className="action-button process-button"
                          onClick={() => handleStatusChange(order.id, 'processing')}
                        >
                          Process Order
                        </button>
                        <button 
                          className="action-button cancel-button"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel Order
                        </button>
                      </>
                    )}
                    
                    {order.status === 'processing' && (
                      <button 
                        className="action-button ship-button"
                        onClick={() => handleStatusChange(order.id, 'shipped')}
                      >
                        Mark as Shipped
                      </button>
                    )}
                    
                    {order.status === 'shipped' && (
                      <button 
                        className="action-button deliver-button"
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                      >
                        Mark as Delivered
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <button 
                        className="action-button return-button"
                        onClick={() => handleStatusChange(order.id, 'returned')}
                      >
                        Process Return
                      </button>
                    )}
                    
                    <button 
                      className="action-button contact-button"
                      onClick={() => handleContactCustomer(order.id, order.customer)}
                    >
                      Contact Customer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage; 