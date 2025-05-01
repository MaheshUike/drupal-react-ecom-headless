import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { contentService, productService } from '../services/api';

interface Banner {
  id: string;
  attributes: {
    title: string;
    field_banner_image: {
      uri: {
        url: string;
      };
    };
    field_banner_link: string;
    field_banner_text: string;
  }
}

interface Product {
  id: string;
  attributes: {
    title: string;
    field_price: number;
    field_image: {
      uri: {
        url: string;
      };
    };
    field_category: {
      name: string;
    };
    field_is_new: boolean;
    field_is_sale: boolean;
    field_discount_percentage: number;
  }
}

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [bannersData, productsData, categoriesData] = await Promise.all([
          contentService.getBanners(),
          productService.getProducts({ featured: true }),
          productService.getProductCategories()
        ]);

        setBanners(bannersData);
        setFeaturedProducts(productsData);
        setCategories(categoriesData);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching content:', error);
        setIsLoaded(true);
      }
    };

    fetchContent();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const mainBanner = banners[0]?.attributes;

  return (
    <div>
      {/* Hero Banner */}
      {mainBanner && (
        <section className="relative">
          <div className="relative h-[70vh] overflow-hidden">
            <img 
              src={`${import.meta.env.VITE_DRUPAL_API_URL}${mainBanner.field_banner_image.uri.url}`}
              alt={mainBanner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-lg">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeIn">
                    {mainBanner.title}
                  </h1>
                  <p className="text-xl text-white mb-6 animate-fadeIn animation-delay-200">
                    {mainBanner.field_banner_text}
                  </p>
                  <div className="animate-fadeIn animation-delay-400">
                    <Link to={mainBanner.field_banner_link}>
                      <Button 
                        variant="primary" 
                        size="lg" 
                        rightIcon={<ArrowRight size={16} />}
                      >
                        Shop Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Find what you're looking for by category</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/products?category=${encodeURIComponent(category.attributes.name)}`}
                className="group relative rounded-lg overflow-hidden"
              >
                <div className="aspect-square">
                  <img 
                    src={`${import.meta.env.VITE_DRUPAL_API_URL}${category.attributes.field_image.uri.url}`}
                    alt={category.attributes.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <h3 className="text-xl font-semibold text-white px-4 py-2 bg-black bg-opacity-50 rounded-md">
                      {category.attributes.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked products just for you</p>
            </div>
            <Link to="/products" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors">
              <span>View All</span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={parseInt(product.id)}
                title={product.attributes.title}
                price={product.attributes.field_price}
                image={`${import.meta.env.VITE_DRUPAL_API_URL}${product.attributes.field_image.uri.url}`}
                category={product.attributes.field_category.name}
                isNew={product.attributes.field_is_new}
                isSale={product.attributes.field_is_sale}
                discountPercentage={product.attributes.field_discount_percentage}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Sign Up & Get 15% Off</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
            Join our newsletter to receive updates on new arrivals, special offers, and exclusive promotions.
          </p>
          <div className="max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow rounded-l-md sm:rounded-r-none rounded-r-md sm:rounded-l-md py-3 px-4 mb-2 sm:mb-0 focus:outline-none"
              />
              <Button
                variant="primary"
                size="lg"
                className="bg-gray-900 hover:bg-black rounded-l-none sm:rounded-l-none rounded-r-md"
                type="submit"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;