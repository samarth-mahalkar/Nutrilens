import React from 'react';
import { ArrowRight, Scan, BarChart3, Star, Shield, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-food-scanning.jpg';
import productInsights from '../assets/product-insights.jpg';
import healthyProducts from '../assets/healthy-products-grid.jpg';
import nutrilensIcon from '../assets/Nutrilensicon.png';
import scanone from '../assets/scanone.png';
import erase from '../assets/erase.png';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { BackendHealthCheck } from '../components/BackendHealthCheck';

const Index = () => {
  const handleProductSearch = (query: string) => {
    console.log('Searching for products:', query);
    // Implement search functionality here
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Backend Health Check */}
      <div className="fixed top-20 right-4 z-50 bg-card/90 backdrop-blur-sm rounded-lg shadow-lg">
        <BackendHealthCheck />
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden pt-16" id="hero">
        {/* Floating Healthy Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-20 float-animation">🥕</div>
          <div className="absolute top-32 right-16 text-5xl opacity-30 float-animation-delayed">🥗</div>
          <div className="absolute bottom-32 left-20 text-4xl opacity-25 float-animation">🍎</div>
          <div className="absolute bottom-20 right-32 text-5xl opacity-20 float-animation-delayed">🥑</div>
          <div className="absolute top-1/2 left-1/4 text-3xl opacity-15 float-animation">📊</div>
          <div className="absolute top-1/3 right-1/4 text-4xl opacity-25 float-animation-delayed">🔍</div>
        </div>

        <div className="container-max section-padding relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in-up">
              <h1 className="heading-hero text-white mb-6">
                Scan. Learn. 
                <span className="text-primary-glow"> Grow</span> Healthier.
              </h1>
              <p className="text-large text-white/90 mb-8 max-w-lg">
                Discover what's really in your food. Get instant nutrition insights, health scores, and personalized recommendations for healthier living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/scanner">
                  <button className="btn-hero">
                    Start Scanning<ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img 
              src={nutrilensIcon} 
              alt="Food scanning with Nutrilens app" 
              className="w-full max-w-md rounded-3xl shadow-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scan Your Product Section */}
      <section className="py-16 md:py-24 bg-background" id="features">
        <div className="container-max section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Scan className="w-8 h-8 text-primary" />
              </div>
              <h2 className="heading-section text-foreground mb-6">
                Simply Scan Any Product
              </h2>
              <p className="text-large text-muted-foreground mb-8">
                Point your camera at any barcode and instantly unlock comprehensive nutrition information. Our AI-powered system recognizes millions of products and provides real-time analysis.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">Instant barcode recognition</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">Works with 99% of packaged foods</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground font-medium">Offline scanning capability</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl"></div>
                <img 
                  src={erase} 
                  alt="Barcode scanning interface" 
                  className="relative w-full max-w-md rounded-3xl shadow-card"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Insights Section */}
      <section className="py-16 md:py-24 card-beige">
        <div className="container-max section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center lg:order-1">
              <img 
                src={productInsights} 
                alt="Product health insights and nutrition score" 
                className="w-full max-w-md rounded-3xl shadow-card"
              />
            </div>
            <div className="lg:order-2">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="heading-section text-card-beige-foreground mb-6">
                Get Instant Health Insights
              </h2>
              <p className="text-large text-muted-foreground mb-8">
                Every scan reveals detailed nutrition breakdown, ingredient analysis, and personalized health scores. Understand exactly what you're consuming and how it impacts your wellness goals.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <Star className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold text-card-foreground mb-2">Health Score</h3>
                  <p className="text-sm text-muted-foreground">A-F rating based on nutrition quality</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft">
                  <Shield className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold text-card-foreground mb-2">Allergen Alerts</h3>
                  <p className="text-sm text-muted-foreground">Instant warnings for your dietary needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Products Section */}
      <section className="py-16 md:py-24 bg-background" id="products">
        <div className="container-max section-padding">
          <div className="text-center mb-12">
            <h2 className="heading-section text-foreground mb-6">
              Discover Top Rated Products
            </h2>
            <p className="text-large text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our curated selection of the healthiest products across different categories, all rated and reviewed by our nutrition experts.
            </p>
            
            {/* Search Bar */}
            <SearchBar 
              placeholder="Search for healthy products..."
              onSearch={handleProductSearch}
              showFilters={true}
              className="mb-12"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ProductCard
              emoji="🥛"
              name="Dairy"
              description="Milk, yogurt, cheese & more with high nutritional value"
              productCount="120+ products"
              rating={4}
            />
            <ProductCard
              emoji="🍪"
              name="Snacks"
              description="Healthy snack alternatives for guilt-free munching"
              productCount="85+ products"
              rating={5}
            />
            <ProductCard
              emoji="🌾"
              name="Grains"
              description="Rice, pasta, cereals & bread for wholesome meals"
              productCount="95+ products"
              rating={4}
            />
            <ProductCard
              emoji="🥫"
              name="Pantry"
              description="Canned goods & essentials for your healthy kitchen"
              productCount="150+ products"
              rating={5}
            />
          </div>

          <div className="flex justify-center">
            <img 
              src={healthyProducts} 
              alt="Grid of healthy food products" 
              className="w-full max-w-4xl rounded-3xl shadow-card"
            />
          </div>
        </div>
      </section>

      {/* Why Nutrilens Section */}
      <section className="py-16 md:py-24 bg-gradient-beige" id="about">
        <div className="container-max section-padding">
          <div className="text-center mb-16">
            <h2 className="heading-section text-card-beige-foreground mb-6">
              Why Choose Nutrilens?
            </h2>
            <p className="text-large text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to make healthy eating accessible and informed. Here's what makes us different.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-card-beige-foreground mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Get nutrition insights in under 3 seconds. Our advanced AI processes millions of products instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-card-beige-foreground mb-4">Privacy First</h3>
              <p className="text-muted-foreground">
                Your data stays yours. We don't track your purchases or share personal information with third parties.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-card-beige-foreground mb-4">Expert Approved</h3>
              <p className="text-muted-foreground">
                All ratings reviewed by certified nutritionists and backed by the latest research in food science.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link to="/scanner">
              <button className="btn-hero">
                Start Scanning <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              Join thousands who've transformed their health with Nutrilens
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;