import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, CreditCard, Heart, Settings, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import { authService } from '../services/api';

// Interface for user profile data
interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  defaultAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderCount: number;
  wishlistCount: number;
}

// Mock user data
const MOCK_USER: UserProfile = {
  uid: '123456',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  defaultAddress: {
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  },
  orderCount: 5,
  wishlistCount: 12
};

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is authenticated and fetch profile data
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          // Redirect to login if not authenticated
          navigate('/login', { state: { from: '/account' } });
          return;
        }
        
        // In a real app, this would fetch user profile from API
        // const response = await apiClient.get('/user/profile');
        // setUserProfile(response.data);
        
        // Using mock data for demo
        setTimeout(() => {
          setUserProfile(MOCK_USER);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/login', { state: { from: '/account' } });
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!userProfile) {
    return null; // This should never happen due to redirect in useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <User size={32} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800">{userProfile.name}</h2>
                <p className="text-gray-500">{userProfile.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User size={18} className="mr-3" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'orders'
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package size={18} className="mr-3" />
                <span>Orders</span>
                <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {userProfile.orderCount}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'payment'
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard size={18} className="mr-3" />
                <span>Payment Methods</span>
              </button>
              
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'wishlist'
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart size={18} className="mr-3" />
                <span>Wishlist</span>
                <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {userProfile.wishlistCount}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'settings'
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings size={18} className="mr-3" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<LogOut size={18} />}
            onClick={handleLogout}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-800">Personal Information</h2>
                  <Button variant="outline">Edit Profile</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Full Name</h3>
                    <p className="text-gray-800">{userProfile.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                    <p className="text-gray-800">{userProfile.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Phone Number</h3>
                    <p className="text-gray-800">{userProfile.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Account ID</h3>
                    <p className="text-gray-800">{userProfile.uid}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-800">Default Shipping Address</h2>
                    <Button variant="outline">Edit Address</Button>
                  </div>
                  
                  {userProfile.defaultAddress ? (
                    <div>
                      <p className="text-gray-800 mb-1">{userProfile.name}</p>
                      <p className="text-gray-800 mb-1">{userProfile.defaultAddress.address}</p>
                      <p className="text-gray-800 mb-1">
                        {userProfile.defaultAddress.city}, {userProfile.defaultAddress.state} {userProfile.defaultAddress.zipCode}
                      </p>
                      <p className="text-gray-800">{userProfile.defaultAddress.country}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't added any addresses yet.</p>
                      <Button>Add New Address</Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-800">Order History</h2>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/orders')}
                  >
                    View All Orders
                  </Button>
                </div>
                
                {userProfile.orderCount > 0 ? (
                  <div className="space-y-4">
                    {/* Mock order data */}
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium text-gray-800">Order #1092563</p>
                          <p className="text-sm text-gray-500">Placed on May 15, 2025</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-600">3 items</p>
                        <p className="font-medium text-gray-800">$129.99</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium text-gray-800">Order #1087452</p>
                          <p className="text-sm text-gray-500">Placed on April 22, 2025</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Shipped
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-600">1 item</p>
                        <p className="font-medium text-gray-800">$59.99</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium text-gray-800">Order #1082347</p>
                          <p className="text-sm text-gray-500">Placed on March 10, 2025</p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Delivered
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-gray-600">2 items</p>
                        <p className="font-medium text-gray-800">$89.98</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Package size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">When you place orders, they will appear here.</p>
                    <Button onClick={() => navigate('/products')}>Start Shopping</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-800">Saved Payment Methods</h2>
                  <Button>Add Payment Method</Button>
                </div>
                
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <CreditCard size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No payment methods saved</h3>
                  <p className="text-gray-500 mb-6">You haven't saved any payment methods yet.</p>
                  <Button>Add Payment Method</Button>
                </div>
              </div>
            )}
            
            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-800">My Wishlist</h2>
                </div>
                
                {userProfile.wishlistCount > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mock wishlist items */}
                    <div className="border border-gray-200 rounded-md p-4 flex">
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-4">
                        <img 
                          src="https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                          alt="Denim Jacket" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-medium text-gray-800">Denim Jacket</h3>
                          <p className="text-gray-500 text-sm">Men's Clothing</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-800">$69.99</p>
                          <Button variant="outline" size="sm">Add to Cart</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-4 flex">
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden mr-4">
                        <img 
                          src="https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                          alt="Running Shoes" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-medium text-gray-800">Running Shoes</h3>
                          <p className="text-gray-500 text-sm">Footwear</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-800">$99.99</p>
                          <Button variant="outline" size="sm">Add to Cart</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Heart size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6">Save items you like by clicking the heart icon on product pages.</p>
                    <Button onClick={() => navigate('/products')}>Browse Products</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="text-base font-medium text-gray-800 mb-1">Email Notifications</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage your email preferences</p>
                    
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                        />
                        <span className="ml-2 text-gray-700">Order confirmations and updates</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                        />
                        <span className="ml-2 text-gray-700">Promotions and new arrivals</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={false}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                        />
                        <span className="ml-2 text-gray-700">Product recommendations</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="text-base font-medium text-gray-800 mb-1">Change Password</h3>
                    <p className="text-sm text-gray-500 mb-4">Update your password</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="current-password"
                          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="new-password"
                          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirm-password"
                          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      
                      <Button>Update Password</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium text-gray-800 mb-1">Delete Account</h3>
                    <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all your data</p>
                    
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;