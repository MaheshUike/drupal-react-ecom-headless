import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

// Mock products data for demo
const PRODUCTS = [
  {
    id: 1,
    title: "Men's Casual T-Shirt",
    price: 29.99,
    image: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Men's Clothing",
    isSale: true,
    discountPercentage: 15
  },
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
    id: 4,
    title: "Leather Backpack",
    price: 89.99,
    image: "https://images.pexels.com/photos/1545998/pexels-photo-1545998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Accessories",
    isNew: true
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
  },
  {
    id: 7,
    title: "Running Shoes",
    price: 99.99,
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Footwear",
    isNew: true
  },
  {
    id: 8,
    title: "Sunglasses",
    price: 59.99,
    image: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Accessories"
  }
];

// Categories for filter
const CATEGORIES = [
  "All Categories",
  "Men's Clothing",
  "Women's Clothing",
  "Footwear",
  "Accessories"
];

// Price ranges for filter
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: 1000 },
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 & Above", min: 100, max: 1000 }
];

// Sort options
const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z", value: "name_asc" },
  { label: "Name: Z to A", value: "name_desc" }
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  
  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category') || "All Categories";
    const priceRange = searchParams.get('priceRange') || "0";
    const sort = searchParams.get('sort') || "newest";
    const sale = searchParams.get('onSale') === "true";
    const newItems = searchParams.get('new') === "true";
    const search = searchParams.get('search') || "";
    
    // Set filter states
    setSelectedCategory(category);
    setSelectedPriceRange(PRICE_RANGES[parseInt(priceRange)]);
    setSelectedSort(SORT_OPTIONS.find(option => option.value === sort) || SORT_OPTIONS[0]);
    setShowOnlySale(sale);
    setShowOnlyNew(newItems);
    
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [searchParams]);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
    );
    
    // Filter by sale
    if (showOnlySale) {
      filtered = filtered.filter(product => product.isSale);
    }
    
    // Filter by new
    if (showOnlyNew) {
      filtered = filtered.filter(product => product.isNew);
    }
    
    // Filter by search term
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (selectedSort.value) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
      default:
        // Assuming the array is already sorted by newest
        break;
    }
    
    setFilteredProducts(filtered);
  }, [
    products, 
    selectedCategory, 
    selectedPriceRange, 
    selectedSort, 
    showOnlySale, 
    showOnlyNew,
    searchParams
  ]);
  
  const applyFilters = () => {
    const newParams = new URLSearchParams();
    
    if (selectedCategory !== "All Categories") {
      newParams.set('category', selectedCategory);
    }
    
    const priceRangeIndex = PRICE_RANGES.findIndex(range => range === selectedPriceRange);
    if (priceRangeIndex > 0) {
      newParams.set('priceRange', priceRangeIndex.toString());
    }
    
    if (selectedSort.value !== "newest") {
      newParams.set('sort', selectedSort.value);
    }
    
    if (showOnlySale) {
      newParams.set('onSale', 'true');
    }
    
    if (showOnlyNew) {
      newParams.set('new', 'true');
    }
    
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      newParams.set('search', searchTerm);
    }
    
    setSearchParams(newParams);
    setIsFilterOpen(false);
  };
  
  const resetFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedPriceRange(PRICE_RANGES[0]);
    setSelectedSort(SORT_OPTIONS[0]);
    setShowOnlySale(false);
    setShowOnlyNew(false);
    
    const searchTerm = searchParams.get('search');
    const newParams = new URLSearchParams();
    if (searchTerm) {
      newParams.set('search', searchTerm);
    }
    
    setSearchParams(newParams);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with title and active filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {searchParams.get('search')
                ? `Search results for "${searchParams.get('search')}"`
                : selectedCategory !== "All Categories"
                  ? selectedCategory
                  : "All Products"}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
            </button>
            
            <div className="relative">
              <select
                value={selectedSort.value}
                onChange={(e) => {
                  const newSort = SORT_OPTIONS.find(option => option.value === e.target.value);
                  if (newSort) {
                    setSelectedSort(newSort);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('sort', newSort.value);
                    setSearchParams(newParams);
                  }
                }}
                className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Active filters */}
        {(selectedCategory !== "All Categories" || 
          selectedPriceRange !== PRICE_RANGES[0] || 
          showOnlySale || 
          showOnlyNew) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCategory !== "All Categories" && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => {
                    setSelectedCategory("All Categories");
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('category');
                    setSearchParams(newParams);
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {selectedPriceRange !== PRICE_RANGES[0] && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm">
                <span>Price: {selectedPriceRange.label}</span>
                <button
                  onClick={() => {
                    setSelectedPriceRange(PRICE_RANGES[0]);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('priceRange');
                    setSearchParams(newParams);
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {showOnlySale && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm">
                <span>On Sale</span>
                <button
                  onClick={() => {
                    setShowOnlySale(false);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('onSale');
                    setSearchParams(newParams);
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {showOnlyNew && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm">
                <span>New Arrivals</span>
                <button
                  onClick={() => {
                    setShowOnlyNew(false);
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('new');
                    setSearchParams(newParams);
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm hover:bg-red-200"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      
      {/* Filter sidebar (mobile) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium">Filters</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Category filter */}
                  <div>
                    <h3 className="font-medium mb-3">Category</h3>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="radio"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price range filter */}
                  <div>
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="space-y-2">
                      {PRICE_RANGES.map((range) => (
                        <label key={range.label} className="flex items-center">
                          <input
                            type="radio"
                            checked={selectedPriceRange === range}
                            onChange={() => setSelectedPriceRange(range)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional filters */}
                  <div>
                    <h3 className="font-medium mb-3">Other Filters</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showOnlySale}
                          onChange={() => setShowOnlySale(!showOnlySale)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                        />
                        <span className="ml-2 text-gray-700">On Sale</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showOnlyNew}
                          onChange={() => setShowOnlyNew(!showOnlyNew)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                        />
                        <span className="ml-2 text-gray-700">New Arrivals</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-200 flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    onClick={applyFilters}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Product Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium text-gray-800 mb-2">No products found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria.</p>
          <Button variant="outline" onClick={resetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;