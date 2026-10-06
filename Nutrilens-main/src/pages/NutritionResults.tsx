import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Star, Award, TrendingUp, Leaf } from "lucide-react";
import NutriScoreDisplay from "@/components/NutriScoreDisplay";

interface NutritionData {
  barcode?: string;
  productName?: string;
  brand?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  sugar?: number;
  healthScore?: number;
  scannedImage?: string;
  raw_product_data?: any;
  nutri_score?: {
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    score: number;
    category: string;
    breakdown: any;
  };
}

const NutritionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state or use defaults with real-looking product data
  const data: NutritionData = location.state || {
    productName: "Sprite",
    brand: "Sprite",
    barcode: "5449000012203",
    calories: 12,
    protein: 0,
    carbs: 3.1,
    fat: 0,
    sugar: 3.1,
    healthScore: 85,
    nutri_score: {
      grade: 'B' as const,
      score: 2,
      category: 'beverages',
      breakdown: {
        negative: {
          energy: { points: 0, value: 12 },
          sugars: { points: 2, value: 3.1 },
          saturatedFat: { points: 0, value: 0 },
          salt: { points: 0, value: 0.01 }
        },
        positive: {
          fiber: { points: 0, value: 0 },
          protein: { points: 0, value: 0 },
          fruitsVegetables: { points: 0, value: 0 }
        }
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: `${data.productName} - Nutrition Info`,
        text: `Check out the nutrition information for ${data.productName}`,
        url: window.location.href,
      });
    }
  };

  const findRecipes = () => {
    // Navigate to recipes page or external link
    window.open(`https://www.google.com/search?q=${encodeURIComponent(data.productName || '')}+healthy+recipes`, '_blank');
  };

  // Get product image or fallback
  const getProductImage = () => {
    if (data.raw_product_data?.image_url) {
      return data.raw_product_data.image_url;
    }
    if (data.raw_product_data?.image_front_url) {
      return data.raw_product_data.image_front_url;
    }
    // Default placeholder based on product type
    return `https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop&crop=center`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg text-gray-800">Product Detail</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="rounded-full hover:bg-gray-100"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-6">
        
        {/* Product Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            {/* Product Image */}
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={getProductImage()}
                alt={data.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a simple colored background with icon
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div class="text-2xl">🥤</div>
                    </div>
                  `;
                }}
              />
            </div>
            
            {/* Product Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {data.productName || "Unknown Product"}
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                {data.brand && `by ${data.brand}`}
              </p>
              
              {/* Quick Stats */}
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{data.calories || 0}</div>
                  <div className="text-xs text-gray-500">kcal</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{data.protein || 0}g</div>
                  <div className="text-xs text-gray-500">protein</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{data.fat || 0}g</div>
                  <div className="text-xs text-gray-500">fat</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutri-Score - Prominently displayed */}
        {data.nutri_score && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 pb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                <Award className="h-6 w-6 mr-2 text-blue-500" />
                Nutri-Score Rating
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Official nutritional quality assessment
              </p>
            </div>
            
            <div className="px-6 pb-6">
              <NutriScoreDisplay 
                grade={data.nutri_score.grade}
                score={data.nutri_score.score}
                category={data.nutri_score.category}
                breakdown={data.nutri_score.breakdown}
                showDetails={false}
              />
            </div>
          </div>
        )}

        {/* Find Recipes Button */}
        <Button
          onClick={findRecipes}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-2xl font-medium text-lg shadow-lg"
        >
          <Leaf className="h-5 w-5 mr-2" />
          Find recipes with {data.productName}
        </Button>

        {/* Nutritional Facts */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
            Nutritional Facts
          </h3>
          
          <div className="space-y-4">
            {/* Calories */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Calories</span>
              <span className="font-bold text-gray-900">{data.calories || 0} kcal</span>
            </div>
            
            {/* Protein */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Protein</span>
              <span className="font-bold text-gray-900">{data.protein || 0}g</span>
            </div>
            
            {/* Carbs */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Carbs</span>
              <span className="font-bold text-gray-900">{data.carbs || 0}g</span>
            </div>
            
            {/* Fat */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Fat</span>
              <span className="font-bold text-gray-900">{data.fat || 0}g</span>
            </div>
            
            {/* Sugar */}
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Sugar</span>
              <span className="font-bold text-gray-900">{data.sugar || 0}g</span>
            </div>
          </div>
        </div>

        {/* Health Score */}
        {data.healthScore !== undefined && (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Health Score</h3>
                <p className="text-gray-600 text-sm">Based on nutritional content</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{data.healthScore}/100</div>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">
                    {data.healthScore >= 80 ? 'Excellent' : 
                     data.healthScore >= 60 ? 'Good' : 
                     data.healthScore >= 40 ? 'Fair' : 'Poor'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Info */}
        {data.barcode && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm text-gray-600 text-center">
              Barcode: <span className="font-mono">{data.barcode}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionResults;