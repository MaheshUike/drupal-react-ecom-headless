import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import Button from '../components/ui/Button';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useShoppingCart();
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const navigate = useNavigate();
  
  const shipping = 4.99;
  const tax = cartTotal * 0.08;
  const discountAmount = isPromoApplied ? cartTotal * (promoDiscount / 100) : 0;
  const orderTotal = cartTotal + shipping + tax - discountAmount;
  
  const handleApplyPromo = () => {
    // In a real app, this would validate against a backend service
    if (promoCode.toLowerCase() === "discount15") {
      setIsPromoApplied(true);
      setPromoDiscount(15);
    } else {
      // Show error message
      alert("Invalid promo code");
    }
  };
  
  const handleRemovePromo = () => {
    setIsPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode("");
  };
  
  const handleCheckout = () => {
    navigate("/checkout");
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <ShoppingCart size={32} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products">
            <Button 
              variant="primary" 
              size="lg"
              rightIcon={<ArrowRight size={18} />}
            >
              Start Shopping
            </Button>
          </Link>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-medium text-gray-800 mb-4">You might be interested in</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Featured products would go here */}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in Cart
            </h2>
          </div>
          
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <Link to={`/products/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
                
                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                    <div>
                      <Link 
                        to={`/products/${item.id}`}
                        className="text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-gray-500 mt-1">Variant: {item.variant}</p>
                      )}
                    </div>
                    <div className="text-gray-800 font-medium mt-2 sm:mt-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} className={item.quantity <= 1 ? "text-gray-300" : "text-gray-600"} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            updateQuantity(item.id, val);
                          }
                        }}
                        className="w-12 text-center border-y border-gray-300 py-1 text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                      >
                        <Plus size={14} className="text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors flex items-center"
                    >
                      <Trash2 size={16} className="mr-1" />
                      <span className="text-sm">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              to="/products" 
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <ShoppingCart size={16} className="mr-2" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax</span>
                <span className="text-gray-800">${tax.toFixed(2)}</span>
              </div>
              
              {isPromoApplied && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    Discount ({promoDiscount}%)
                    <button 
                      onClick={handleRemovePromo}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-800">Total</span>
                <span className="text-xl font-bold text-gray-800">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Promo Code */}
            {!isPromoApplied && (
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="bg-gray-100 text-gray-800 rounded-r-md px-4 py-2 hover:bg-gray-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Try "DISCOUNT15" for 15% off your order
                </p>
              </div>
            )}
            
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCheckout}
              rightIcon={<ArrowRight size={18} />}
            >
              Proceed to Checkout
            </Button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By proceeding, you agree to our <Link to="/terms" className="underline">Terms & Conditions</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;