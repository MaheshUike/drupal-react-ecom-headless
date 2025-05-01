import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import { authService } from '../services/api';

// Mock order data
const MOCK_ORDERS = [
  {
    id: '1092563',
    date: '2025-05-15T10:30:00Z',
    status: 'delivered',
    items: [
      {
        id: 1,
        title: "Men's Casual T-Shirt",
        price: 29.99,
        quantity: 1,
        image: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        id: 3,
        title: "Casual Sneakers",
        price: 79.99,
        quantity: 1,
        image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        id: 5,
        title: "Denim Jacket",
        price: 69.99,
        quantity: 1,
        image: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      }
    ],
    total: 129.99,
    shipping: 4.99,
    tax: 10.40,
    address: {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    paymentMethod: 'Visa ending in 4242',
    trackingNumber: '1Z999AA10123456784',
    deliveryDate: '2025-05-18T00:00:00Z'
  },
  {
    id: '1087452',
    date: '2025-04-22T14:15:00Z',
    status: 'shipped',
    items: [
      {
        id: 2,
        title: "Women's Summer Dress",
        price: 49.99,
        quantity: 1,
        image: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      }
    ],
    total: 59.99,
    shipping: 4.99,
    tax: 5.01,
    address: {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    paymentMethod: 'Visa ending in 4242',
    trackingNumber: '1Z999AA10123456785',
    estimatedDelivery: '2025-04-28T00:00:00Z'
  },
  {
    id: '1082347',
    date: '2025-03-10T09:45:00Z',
    status: 'delivered',
    items: [
      {
        id: 4,
        title: "Leather Backpack",
        price: 89.99,
        quantity: 1,
        image: "https://images.pexels.com/photos/1545998/pexels-photo-1545998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      }
    ],
    total: 89.98,
    shipping: 0, // Free shipping
    tax: 7.20,
    address: {
      fullName: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    paymentMethod: 'Visa ending in 4242',
    trackingNumber: '1Z999AA10123456786',
    deliveryDate: '2025-03-15T00:00:00Z'
  }
];

// Status labels and colors
const STATUS_MAP = {
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
  shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const navigate = useNavigate();
  
  // Check if user is authenticated and fetch orders
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          // Redirect to login if not authenticated
          navigate('/login', { state: { from: '/orders' } });
          return;
        }
        
        // In a real app, this would fetch orders from API
        // const response = await orderService.getUserOrders();
        // setOrders(response.data);
        
        // Using mock data for demo
        setTimeout(() => {
          setOrders(MOCK_ORDERS);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching orders:', error);
        navigate('/login', { state: { from: '/orders' } });
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.id.includes(searchQuery) || 
    order.items.some((item: any) => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  // Format date to readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // If showing a specific order detail
  if (selectedOrder) {
    const order = orders.find(o => o.id === selectedOrder);
    if (!order) {
      return <div>Order not found</div>;
    }
    
    const status = STATUS_MAP[order.status as keyof typeof STATUS_MAP];
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ChevronRight size={16} className="transform rotate-180 mr-1" />
            <span>Back to Orders</span>
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Order #{order.id}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-start border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 mr-4">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-800 font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tracking Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Shipping Information</h2>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tracking Number</h3>
                <p className="text-gray-800">{order.trackingNumber}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
                <p className="text-gray-800">{order.address.fullName}</p>
                <p className="text-gray-800">{order.address.address}</p>
                <p className="text-gray-800">
                  {order.address.city}, {order.address.state} {order.address.zipCode}
                </p>
                <p className="text-gray-800">{order.address.country}</p>
              </div>
              
              {order.status === 'delivered' ? (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Delivered On</h3>
                  <p className="text-gray-800">{formatDate(order.deliveryDate)}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
                  <p className="text-gray-800">{formatDate(order.estimatedDelivery)}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h2>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Order Date</span>
                  <span className="text-gray-800">{formatDate(order.date)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Order Number</span>
                  <span className="text-gray-800">#{order.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-800">{order.paymentMethod}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${(order.total - order.shipping - order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">
                    {order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium mt-4">
                  <span className="text-gray-800">Total</span>
                  <span className="text-gray-800">${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => window.open(`https://www.ups.com/track?tracknum=${order.trackingNumber}`, '_blank')}
                >
                  Track Package
                </Button>
                
                {order.status !== 'delivered' && (
                  <Button
                    variant="outline"
                    fullWidth
                  >
                    Cancel Order
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  fullWidth
                >
                  Need Help?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Order History</h1>
      
      {orders.length > 0 ? (
        <>
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const status = STATUS_MAP[order.status as keyof typeof STATUS_MAP];
                
                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="mb-2 md:mb-0">
                        <div className="flex items-center">
                          <h2 className="text-lg font-medium text-gray-800">Order #{order.id}</h2>
                          <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Placed on {formatDate(order.date)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-800">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {order.items.slice(0, 3).map((item: any, index: number) => (
                        <div key={item.id} className="flex">
                          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 mr-3">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-gray-800 text-sm font-medium">{item.title}</p>
                            <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            +{order.items.length - 3} more items
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-end mt-6 pt-4 border-t border-gray-100 space-y-2 sm:space-y-0 sm:space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://www.ups.com/track?tracknum=${order.trackingNumber}`, '_blank')}
                      >
                        Track Order
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any orders matching your search.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Package size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">
            When you place orders, they will appear here.
          </p>
          <Button onClick={() => navigate('/products')}>Start Shopping</Button>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;