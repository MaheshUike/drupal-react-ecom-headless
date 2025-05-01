import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, Heart, Share, Star, ShoppingCart } from 'lucide-react';
import Button from '../components/ui/Button';
import { useShoppingCart } from '../context/ShoppingCartContext';

// Mock product data for demo
const PRODUCT = {
  id: 1,
  title: "Men's Casual T-Shirt",
  description: "This comfortable and stylish t-shirt is perfect for everyday wear. Made from high-quality cotton with a modern fit and excellent durability.",
  price: 29.99,
  originalPrice: 39.99,
  discount: 25,
  rating: 4.5,
  reviews: 124,
  images: [
    "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/3775120/pexels-photo-3775120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  ],
  category: "Men's Clothing",
  variants: {
    colors: ["Black", "White", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  inStock: true,
  stockQuantity: 25,
  features: [
    "100% Premium Cotton",
    "Relaxed fit",
    "Pre-shrunk fabric",
    "Crewneck",
    "Machine washable"
  ],
  details: {
    material: "100% Cotton",
    fit: "Regular fit",
    care: "Machine wash cold, tumble dry low",
    imported: true
  },
  relatedProducts: [2, 3, 5, 6]
};

const RELATED_PRODUCTS = [
  {
    id: 2,
    title: "Women's Summer Dress",
    price: 49.99,
    image: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Women's Clothing",
    isNew: true
  },
  {
    id: 3,
    title: "Casual Sneakers",
    price: 79.99,
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Footwear"
  },
  {
    id: 5,
    title: "Denim Jacket",
    price: 69.99,
    image: "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Men's Clothing"
  },
  {
    id: 6,
    title: "Women's Blouse",
    price: 39.99,
    image: "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Women's Clothing",
    isSale: true,
    discountPercentage: 20
  }
];

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useShoppingCart();
  
  // Simulate API call to fetch product data
  useEffect(() => {
    setIsLoading(true);
    
    // In a real application, this would be an API call
    // productService.getProductById(productId)
    setTimeout(() => {
      setProduct(PRODUCT);
      setMainImage(PRODUCT.images[0]);
      setSelectedColor(PRODUCT.variants.colors[0]);
      setSelectedSize(PRODUCT.variants.sizes[2]); // Default to 'L'
      setRelatedProducts(RELATED_PRODUCTS);
      setIsLoading(false);
    }, 500);
  }, [productId]);
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= (product?.stockQuantity || 10)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        variant: `${selectedSize}, ${selectedColor}`
      }, quantity);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex items-center text-sm">
          <Link to="/" className="text-gray-500 hover:text-indigo-600">Home</Link>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
          <Link to="/products" className="text-gray-500 hover:text-indigo-600">Products</Link>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-gray-500 hover:text-indigo-600">
            {product.category}
          </Link>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>
      </div>
      
      {/* Product Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          <div className="rounded-lg overflow-hidden bg-gray-100 mb-4 aspect-square">
            <img 
              src={mainImage} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setMainImage(image)}
                className={`rounded-md overflow-hidden bg-gray-100 aspect-square ${
                  mainImage === image ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.title} view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : i < product.rating 
                          ? 'text-yellow-400 fill-current opacity-50' 
                          : 'text-gray-300'
                      } 
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{product.rating}</span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <Link to="#reviews" className="text-gray-600 hover:text-indigo-600">
                {product.reviews} reviews
              </Link>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="ml-2 text-sm font-medium text-red-500">Save {product.discount}%</span>
                </>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
          </div>
          
          {/* Product Options */}
          <div className="space-y-6">
            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">Color</h3>
                <span className="text-gray-500 text-sm">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      selectedColor === color
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">Size</h3>
                <Link to="#size-guide" className="text-indigo-600 text-sm hover:text-indigo-800">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 flex items-center justify-center border rounded-md ${
                      selectedSize === size
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} className={quantity <= 1 ? "text-gray-300" : "text-gray-600"} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0 && val <= (product?.stockQuantity || 10)) {
                      setQuantity(val);
                    }
                  }}
                  className="w-16 text-center border-y border-gray-300 py-2 focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                  disabled={quantity >= (product?.stockQuantity || 10)}
                >
                  <Plus size={16} className={quantity >= (product?.stockQuantity || 10) ? "text-gray-300" : "text-gray-600"} />
                </button>
                <span className="ml-4 text-sm text-gray-500">
                  {product.inStock 
                    ? `${product.stockQuantity} available` 
                    : 'Out of stock'}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                onClick={handleAddToCart}
                disabled={!product.inStock}
                leftIcon={<ShoppingCart size={18} />}
              >
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setIsFavorite(!isFavorite)}
                leftIcon={<Heart size={18} fill={isFavorite ? "currentColor" : "none"} />}
                className={isFavorite ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}
              >
                Save
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                leftIcon={<Share size={18} />}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button className="px-6 py-3 border-b-2 border-indigo-500 text-indigo-600 font-medium">
              Product Details
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              Shipping & Returns
            </button>
            <button className="px-6 py-3 text-gray-500 hover:text-gray-700">
              Reviews
            </button>
          </div>
        </div>
        
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-2 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Product Details</h3>
              <div className="space-y-3">
                {Object.entries(product.details).map(([key, value]: [string, any]) => (
                  <div key={key} className="grid grid-cols-2">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">You Might Also Like</h2>
          <Link 
            to="/products" 
            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            <span>View All</span>
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <div 
              key={product.id}
              className="group relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link to={`/products/${product.id}`}>
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-4">
                  {product.category && (
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  )}
                  <h3 className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="mt-2 font-semibold text-gray-800">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;