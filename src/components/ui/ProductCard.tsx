import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useShoppingCart } from '../../context/ShoppingCartContext';

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  isSale?: boolean;
  discountPercentage?: number;
};

const ProductCard = ({
  id,
  title,
  price,
  image,
  category,
  isNew = false,
  isSale = false,
  discountPercentage
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useShoppingCart();
  
  const originalPrice = discountPercentage 
    ? Math.round((price / (1 - discountPercentage / 100)) * 100) / 100
    : null;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, price, image });
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div
      className="group relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Badge */}
      {(isNew || isSale) && (
        <div className="absolute top-2 left-2 z-10">
          {isNew && (
            <span className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded-md mr-2">
              New
            </span>
          )}
          {isSale && (
            <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-md">
              Sale
            </span>
          )}
        </div>
      )}
      
      {/* Favorite Button */}
      <button
        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all duration-300 ${
          isFavorite ? 'bg-red-100 text-red-500' : 'bg-white text-gray-400 opacity-70 hover:opacity-100'
        }`}
        onClick={handleToggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
      </button>
      
      {/* Product Image */}
      <Link to={`/products/${id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Quick Add Overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 py-3 px-4 transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center justify-center space-x-2 transition-colors"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        {category && (
          <p className="text-xs text-gray-500 mb-1">{category}</p>
        )}
        <Link to={`/products/${id}`} className="block">
          <h3 className="text-sm sm:text-base font-medium text-gray-800 hover:text-indigo-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center">
          <span className="font-semibold text-gray-800">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {discountPercentage && (
            <span className="ml-2 text-xs text-red-500">
              {discountPercentage}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;