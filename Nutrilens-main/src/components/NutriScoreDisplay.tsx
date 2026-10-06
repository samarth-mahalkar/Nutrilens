import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info, Award } from 'lucide-react';

interface NutriScoreProps {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  score: number;
  category: string;
  breakdown?: any;
  showDetails?: boolean;
}

const NutriScoreDisplay: React.FC<NutriScoreProps> = ({ 
  grade, 
  score, 
  category, 
  breakdown, 
  showDetails = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const gradeColors = {
    A: 'bg-green-600 border-green-700',
    B: 'bg-green-500 border-green-600', 
    C: 'bg-yellow-500 border-yellow-600',
    D: 'bg-orange-500 border-orange-600',
    E: 'bg-red-600 border-red-700'
  };

  const gradeDescriptions = {
    A: 'Excellent nutritional quality',
    B: 'Good nutritional quality', 
    C: 'Average nutritional quality',
    D: 'Poor nutritional quality',
    E: 'Very poor nutritional quality'
  };

  const getCategoryDisplayName = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'general_food': return 'General Food';
      case 'cheese': return 'Cheese';
      case 'red_meat': return 'Red Meat';
      case 'fats_oils_nuts': return 'Fats/Oils/Nuts';
      case 'beverages': return 'Beverage';
      default: return 'General Food';
    }
  };

  const allGrades = ['A', 'B', 'C', 'D', 'E'] as const;

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 shadow-xl border-2 border-blue-200">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Award className="h-8 w-8" />
            Nutri-Score Rating
          </CardTitle>
          <Info className="h-6 w-6" />
        </div>
        <p className="text-blue-100 text-lg">
          Official European nutritional quality rating
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Grade Scale */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex bg-white rounded-xl p-3 space-x-2 shadow-lg">
              {allGrades.map((g) => (
                <div
                  key={g}
                  className={`
                    flex items-center justify-center w-16 h-16 rounded-xl font-bold text-white text-2xl
                    transition-all duration-300 border-3 shadow-md
                    ${grade === g 
                      ? `${gradeColors[g]} scale-125 shadow-2xl z-10 ring-4 ring-white` 
                      : 'bg-gray-300 border-gray-400 scale-90 opacity-50'
                    }
                  `}
                  style={{
                    transform: grade === g ? 'scale(1.25)' : 'scale(0.9)',
                    zIndex: grade === g ? 10 : 1
                  }}
                >
                  {g}
                </div>
              ))}
            </div>
          </div>
          
          {/* Current Grade Info */}
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center px-8 py-4 rounded-2xl ${gradeColors[grade]} text-white font-bold text-2xl shadow-lg`}>
              <Award className="mr-3 h-8 w-8" />
              Grade {grade} • Score: {score}
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">
                {gradeDescriptions[grade]}
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md">
                <span className="text-sm font-medium text-gray-600">
                  Category: {getCategoryDisplayName(category)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Toggle */}
        {showDetails && breakdown && (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between text-lg py-3 bg-white hover:bg-gray-50 shadow-md"
            >
              <span className="font-semibold">View Detailed Breakdown</span>
              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>

            {isExpanded && (
              <div className="bg-white rounded-xl p-6 space-y-6 shadow-lg border-2 border-gray-100">
                {/* Negative Points */}
                <div>
                  <h4 className="font-bold text-xl text-red-700 mb-4 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-3"></span>
                    Negative Points (Higher = Worse)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {breakdown.negative && Object.entries(breakdown.negative).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                        <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-bold text-red-700 text-lg">+{value.points || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Positive Points */}
                <div>
                  <h4 className="font-bold text-xl text-green-700 mb-4 flex items-center">
                    <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
                    Positive Points (Higher = Better)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {breakdown.positive && Object.entries(breakdown.positive).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                        <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-bold text-green-700 text-lg">-{value.points || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Score */}
                <div className="border-t-2 pt-4">
                  <div className="flex justify-between items-center bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-xl font-bold text-xl shadow-md">
                    <span className="text-gray-800">Final Nutri-Score:</span>
                    <span className={`text-2xl ${score <= 0 ? 'text-green-600' : score <= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {score}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Text */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-xl border-2 border-blue-200">
          <p className="text-sm text-gray-700 font-medium text-center">
            🏆 Nutri-Score rates foods from A (best) to E (worst) based on nutritional quality. 
            Lower scores indicate healthier products. This is the official EU nutritional rating system.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutriScoreDisplay;
