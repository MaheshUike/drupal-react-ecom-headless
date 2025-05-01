import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, ArrowRight } from 'lucide-react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import Button from '../components/ui/Button';

type CheckoutStep = 'shipping' | 'payment' | 'review';

// Mock data for country list
const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia',
  'Germany', 'France', 'Japan', 'Brazil', 'India'
];

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useShoppingCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();
  
  // Form states
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  // Extra costs
  const shipping = shippingMethod === 'express' ? 14.99 : 4.99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shipping + tax;
  
  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (cartItems.length === 0 && !isOrderComplete) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate, isOrderComplete]);
  
  // Update form handlers
  const updateShippingForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
  };
  
  const updatePaymentForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Step navigation
  const nextStep = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('review');
    }
  };
  
  const prevStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else if (currentStep === 'review') {
      setCurrentStep('payment');
    }
  };
  
  // Place order function
  const placeOrder = async () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call to your backend
    // which would then communicate with Drupal Commerce
    setTimeout(() => {
      // Generate a random order ID
      const newOrderId = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderId(newOrderId);
      setIsOrderComplete(true);
      clearCart();
      setIsLoading(false);
    }, 1500);
  };
  
  // If order is complete, show thank you page
  if (isOrderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle size={36} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You for Your Order!</h1>
            <p className="text-gray-600 mb-4">
              Your order has been placed successfully and is being processed.
            </p>
            <p className="text-gray-800 font-medium mb-8">
              Order ID: <span className="font-bold">{orderId}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/orders')}
              >
                View Order
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/products')}
                rightIcon={<ArrowRight size={18} />}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h2 className="text-lg font-medium text-gray-800 mb-4">What Happens Next?</h2>
            <ul className="space-y-3">
              <li className="flex">
                <div className="mr-3 text-indigo-600">1.</div>
                <p>You'll receive an order confirmation email with details of your purchase.</p>
              </li>
              <li className="flex">
                <div className="mr-3 text-indigo-600">2.</div>
                <p>Your order will be processed and prepared for shipping.</p>
              </li>
              <li className="flex">
                <div className="mr-3 text-indigo-600">3.</div>
                <p>Once shipped, you'll receive tracking information via email.</p>
              </li>
              <li className="flex">
                <div className="mr-3 text-indigo-600">4.</div>
                <p>You can check your order status anytime in your account dashboard.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
      
      {/* Checkout Progress */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 'shipping' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <Truck size={18} />
            </div>
            <span className="mt-2 text-sm font-medium">Shipping</span>
          </div>
          
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full bg-indigo-600 ${
              currentStep === 'shipping' ? 'w-0' : currentStep === 'payment' ? 'w-1/2' : 'w-full'
            }`}></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 'payment' ? 'bg-indigo-600 text-white' : 
              currentStep === 'review' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <CreditCard size={18} />
            </div>
            <span className="mt-2 text-sm font-medium">Payment</span>
          </div>
          
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full bg-indigo-600 ${
              currentStep === 'review' ? 'w-full' : 'w-0'
            }`}></div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === 'review' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              <CheckCircle size={18} />
            </div>
            <span className="mt-2 text-sm font-medium">Review</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Checkout Forms */}
        <div className="lg:col-span-2">
          {/* Shipping Information Step */}
          {currentStep === 'shipping' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingForm.firstName}
                    onChange={updateShippingForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingForm.lastName}
                    onChange={updateShippingForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingForm.email}
                    onChange={updateShippingForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={updateShippingForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingForm.address}
                  onChange={updateShippingForm}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingForm.city}
                    onChange={updateShippingForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingForm.state}
                    onChange={updateShippingForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingForm.zipCode}
                    onChange={updateShippingForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={shippingForm.country}
                    onChange={updateShippingForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-800 mb-4">Shipping Method</h3>
                <div className="space-y-3">
                  <label className="flex items-start p-4 border rounded-md cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">Standard Shipping</span>
                        <span className="font-medium text-gray-800">$4.99</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivery in 5-7 business days</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-4 border rounded-md cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-800">Express Shipping</span>
                        <span className="font-medium text-gray-800">$14.99</span>
                      </div>
                      <p className="text-sm text-gray-500">Delivery in 1-3 business days</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Information Step */}
          {currentStep === 'payment' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-6">Payment Information</h2>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="creditCard"
                    checked={true}
                    readOnly
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="creditCard" className="ml-2 text-gray-800">
                    Credit Card
                  </label>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentForm.cardName}
                    onChange={updatePaymentForm}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={updatePaymentForm}
                    placeholder="0000 0000 0000 0000"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentForm.expiryDate}
                      onChange={updatePaymentForm}
                      placeholder="MM/YY"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentForm.cvv}
                      onChange={updatePaymentForm}
                      placeholder="123"
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="saveCard"
                    name="saveCard"
                    checked={paymentForm.saveCard}
                    onChange={updatePaymentForm}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                  />
                  <label htmlFor="saveCard" className="ml-2 text-gray-700 text-sm">
                    Save card for future purchases
                  </label>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 mb-2">
                  Your card will be charged ${orderTotal.toFixed(2)} when you place the order.
                </p>
                <p className="text-sm text-gray-500">
                  All transactions are secure and encrypted.
                </p>
              </div>
            </div>
          )}
          
          {/* Order Review Step */}
          {currentStep === 'review' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-6">Review Your Order</h2>
              
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-800 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="mb-1">{shippingForm.firstName} {shippingForm.lastName}</p>
                  <p className="mb-1">{shippingForm.address}</p>
                  <p className="mb-1">{shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}</p>
                  <p className="mb-1">{shippingForm.country}</p>
                  <p className="mb-1">{shippingForm.email}</p>
                  <p>{shippingForm.phone}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-800 mb-3">Payment Information</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="mb-1">{paymentForm.cardName}</p>
                  <p className="mb-1">
                    •••• •••• •••• 
                    {paymentForm.cardNumber.slice(-4) || '****'}
                  </p>
                  <p>Expires: {paymentForm.expiryDate || 'MM/YY'}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-800 mb-3">
                  Items ({cartItems.length})
                </h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.title}</p>
                        {item.variant && (
                          <p className="text-sm text-gray-500">Variant: {item.variant}</p>
                        )}
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between">
            {currentStep !== 'shipping' && (
              <Button 
                variant="outline" 
                onClick={prevStep}
              >
                Back
              </Button>
            )}
            
            {currentStep === 'review' ? (
              <Button 
                variant="primary" 
                onClick={placeOrder}
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Place Order
              </Button>
            ) : (
              <Button 
                variant="primary"
                onClick={nextStep}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-800 mb-6">Order Summary</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
              </p>
              <div className="max-h-48 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden mr-3">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm text-gray-800 ml-3">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Shipping
                  {shippingMethod === 'express' && (
                    <span className="text-sm text-gray-500 ml-1">(Express)</span>
                  )}
                </span>
                <span className="text-gray-800">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-800">${tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-800">Total</span>
                <span className="text-lg font-bold text-gray-800">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center">
                By placing your order, you agree to our <a href="#" className="text-indigo-600 hover:text-indigo-800">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-800">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;