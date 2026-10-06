export interface NutritionData {
  energy_kj: number;
  sugars_g: number;
  saturated_fat_g: number;
  salt_g: number;
  fiber_g: number;
  protein_g: number;
  fruits_vegetables_legumes_percent: number;
  total_fat_g?: number; // For oils/fats ratio calculation
}

export enum ProductCategory {
  GENERAL_FOOD = 'general_food',
  CHEESE = 'cheese',
  RED_MEAT = 'red_meat',
  FATS_OILS_NUTS = 'fats_oils_nuts',
  BEVERAGES = 'beverages'
}

export interface NutriScoreResult {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  score: number;
  negativePoints: number;
  positivePoints: number;
  category: ProductCategory;
  breakdown: {
    energy: number;
    sugars: number;
    saturatedFat: number;
    salt: number;
    fiber: number;
    protein: number;
    fruitsVegLegumes: number;
  };
}

// Negative points thresholds for energy (kJ per 100g/ml)
const ENERGY_THRESHOLDS = [
  { min: 0, max: 335, points: 0 },
  { min: 335, max: 670, points: 1 },
  { min: 670, max: 1005, points: 2 },
  { min: 1005, max: 1340, points: 3 },
  { min: 1340, max: 1675, points: 4 },
  { min: 1675, max: 2010, points: 5 },
  { min: 2010, max: 2345, points: 6 },
  { min: 2345, max: 2680, points: 7 },
  { min: 2680, max: 3015, points: 8 },
  { min: 3015, max: 3350, points: 9 },
  { min: 3350, max: Infinity, points: 10 }
];

// Negative points thresholds for sugars (g per 100g/ml)
const SUGAR_THRESHOLDS = [
  { min: 0, max: 4.5, points: 0 },
  { min: 4.5, max: 9, points: 1 },
  { min: 9, max: 13.5, points: 2 },
  { min: 13.5, max: 18, points: 3 },
  { min: 18, max: 22.5, points: 4 },
  { min: 22.5, max: 27, points: 5 },
  { min: 27, max: 31, points: 6 },
  { min: 31, max: 36, points: 7 },
  { min: 36, max: 40, points: 8 },
  { min: 40, max: 45, points: 9 },
  { min: 45, max: Infinity, points: 10 }
];

// Negative points thresholds for saturated fat (g per 100g/ml)
const SATURATED_FAT_THRESHOLDS = [
  { min: 0, max: 1, points: 0 },
  { min: 1, max: 2, points: 1 },
  { min: 2, max: 3, points: 2 },
  { min: 3, max: 4, points: 3 },
  { min: 4, max: 5, points: 4 },
  { min: 5, max: 6, points: 5 },
  { min: 6, max: 7, points: 6 },
  { min: 7, max: 8, points: 7 },
  { min: 8, max: 9, points: 8 },
  { min: 9, max: 10, points: 9 },
  { min: 10, max: Infinity, points: 10 }
];

// Negative points thresholds for salt (mg per 100g/ml)
const SALT_THRESHOLDS = [
  { min: 0, max: 90, points: 0 },
  { min: 90, max: 180, points: 1 },
  { min: 180, max: 270, points: 2 },
  { min: 270, max: 360, points: 3 },
  { min: 360, max: 450, points: 4 },
  { min: 450, max: 540, points: 5 },
  { min: 540, max: 630, points: 6 },
  { min: 630, max: 720, points: 7 },
  { min: 720, max: 810, points: 8 },
  { min: 810, max: 900, points: 9 },
  { min: 900, max: Infinity, points: 10 }
];

// Positive points thresholds for fiber (g per 100g)
const FIBER_THRESHOLDS = [
  { min: 0, max: 0.9, points: 0 },
  { min: 0.9, max: 1.9, points: 1 },
  { min: 1.9, max: 2.8, points: 2 },
  { min: 2.8, max: 3.7, points: 3 },
  { min: 3.7, max: 4.7, points: 4 },
  { min: 4.7, max: Infinity, points: 5 }
];

// Positive points thresholds for protein (g per 100g)
const PROTEIN_THRESHOLDS = [
  { min: 0, max: 1.6, points: 0 },
  { min: 1.6, max: 3.2, points: 1 },
  { min: 3.2, max: 4.8, points: 2 },
  { min: 4.8, max: 6.4, points: 3 },
  { min: 6.4, max: 8.0, points: 4 },
  { min: 8.0, max: Infinity, points: 5 }
];

// Positive points thresholds for fruits/vegetables/legumes (%)
const FRUITS_VEG_THRESHOLDS = [
  { min: 0, max: 40, points: 0 },
  { min: 40, max: 60, points: 1 },
  { min: 60, max: 80, points: 2 },
  { min: 80, max: Infinity, points: 5 }
];

// Beverage energy thresholds (different from foods)
const BEVERAGE_ENERGY_THRESHOLDS = [
  { min: 0, max: 0, points: 0 },
  { min: 0, max: 30, points: 1 },
  { min: 30, max: 60, points: 2 },
  { min: 60, max: 90, points: 3 },
  { min: 90, max: 120, points: 4 },
  { min: 120, max: 150, points: 5 },
  { min: 150, max: 180, points: 6 },
  { min: 180, max: 210, points: 7 },
  { min: 210, max: 240, points: 8 },
  { min: 240, max: 270, points: 9 },
  { min: 270, max: Infinity, points: 10 }
];

function getPointsFromThresholds(value: number, thresholds: any[]): number {
  for (const threshold of thresholds) {
    if (value >= threshold.min && value < threshold.max) {
      return threshold.points;
    }
  }
  return thresholds[thresholds.length - 1].points;
}

function calculateNegativePoints(
  nutrition: NutritionData, 
  category: ProductCategory
): { total: number; breakdown: any } {
  let energyPoints = 0;
  let sugarPoints = 0;
  let saturatedFatPoints = 0;
  let saltPoints = 0;

  // Energy calculation
  if (category === ProductCategory.BEVERAGES) {
    energyPoints = getPointsFromThresholds(nutrition.energy_kj, BEVERAGE_ENERGY_THRESHOLDS);
  } else {
    energyPoints = getPointsFromThresholds(nutrition.energy_kj, ENERGY_THRESHOLDS);
  }

  // Sugar calculation
  sugarPoints = getPointsFromThresholds(nutrition.sugars_g, SUGAR_THRESHOLDS);

  // Saturated fat calculation
  if (category === ProductCategory.FATS_OILS_NUTS && nutrition.total_fat_g && nutrition.total_fat_g > 0) {
    // Use saturated fat / total fat ratio for oils/fats
    const ratio = (nutrition.saturated_fat_g / nutrition.total_fat_g) * 100;
    saturatedFatPoints = getPointsFromThresholds(ratio, SATURATED_FAT_THRESHOLDS);
  } else {
    saturatedFatPoints = getPointsFromThresholds(nutrition.saturated_fat_g, SATURATED_FAT_THRESHOLDS);
  }

  // Salt calculation (convert from g to mg)
  const saltMg = nutrition.salt_g * 1000;
  saltPoints = getPointsFromThresholds(saltMg, SALT_THRESHOLDS);

  const total = energyPoints + sugarPoints + saturatedFatPoints + saltPoints;

  return {
    total,
    breakdown: {
      energy: energyPoints,
      sugars: sugarPoints,
      saturatedFat: saturatedFatPoints,
      salt: saltPoints
    }
  };
}

function calculatePositivePoints(
  nutrition: NutritionData, 
  category: ProductCategory,
  negativePoints: number
): { total: number; breakdown: any } {
  let fiberPoints = 0;
  let proteinPoints = 0;
  let fruitsVegPoints = 0;

  // Fiber calculation
  fiberPoints = getPointsFromThresholds(nutrition.fiber_g, FIBER_THRESHOLDS);

  // Protein calculation
  proteinPoints = getPointsFromThresholds(nutrition.protein_g, PROTEIN_THRESHOLDS);
  
  // Red meat protein cap
  if (category === ProductCategory.RED_MEAT) {
    proteinPoints = Math.min(proteinPoints, 2);
  }

  // Fruits/vegetables/legumes calculation
  fruitsVegPoints = getPointsFromThresholds(nutrition.fruits_vegetables_legumes_percent, FRUITS_VEG_THRESHOLDS);

  // Special rule: If N ≥ 11 and fruit/veg points < 5 → proteins are ignored
  if (negativePoints >= 11 && fruitsVegPoints < 5) {
    proteinPoints = 0;
  }

  const total = fiberPoints + proteinPoints + fruitsVegPoints;

  return {
    total,
    breakdown: {
      fiber: fiberPoints,
      protein: proteinPoints,
      fruitsVegLegumes: fruitsVegPoints
    }
  };
}

function getGradeFromScore(score: number, category: ProductCategory): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (category === ProductCategory.BEVERAGES) {
    // Beverage thresholds
    if (score <= 1) return 'A';
    if (score <= 5) return 'B';
    if (score <= 9) return 'C';
    if (score <= 13) return 'D';
    return 'E';
  } else {
    // Food thresholds
    if (score <= -1) return 'A';
    if (score <= 2) return 'B';
    if (score <= 10) return 'C';
    if (score <= 18) return 'D';
    return 'E';
  }
}

export function calculateNutriScore(
  nutrition: NutritionData,
  category: ProductCategory = ProductCategory.GENERAL_FOOD
): NutriScoreResult {
  // Calculate negative points
  const negativeResult = calculateNegativePoints(nutrition, category);
  
  // Calculate positive points
  const positiveResult = calculatePositivePoints(nutrition, category, negativeResult.total);
  
  // Calculate final score
  const score = negativeResult.total - positiveResult.total;
  
  // Get grade
  const grade = getGradeFromScore(score, category);

  return {
    grade,
    score,
    negativePoints: negativeResult.total,
    positivePoints: positiveResult.total,
    category,
    breakdown: {
      energy: negativeResult.breakdown.energy,
      sugars: negativeResult.breakdown.sugars,
      saturatedFat: negativeResult.breakdown.saturatedFat,
      salt: negativeResult.breakdown.salt,
      fiber: positiveResult.breakdown.fiber,
      protein: positiveResult.breakdown.protein,
      fruitsVegLegumes: positiveResult.breakdown.fruitsVegLegumes
    }
  };
}

// Helper function to determine product category from product data
export function determineProductCategory(productName: string, productData: any): ProductCategory {
  const name = productName.toLowerCase();
  const categories = productData?.categories_tags || [];
  
  // Check OpenFoodFacts categories first
  const categoryString = categories.join(' ').toLowerCase();
  
  if (categoryString.includes('cheese') || categoryString.includes('fromage') || 
      name.includes('cheese') || name.includes('fromage')) {
    return ProductCategory.CHEESE;
  }
  
  if (categoryString.includes('meat') || categoryString.includes('beef') || 
      categoryString.includes('pork') || categoryString.includes('lamb') ||
      name.includes('meat') || name.includes('beef') || name.includes('pork') || 
      name.includes('lamb') || name.includes('sausage') || name.includes('bacon')) {
    return ProductCategory.RED_MEAT;
  }
  
  if (categoryString.includes('oil') || categoryString.includes('butter') || 
      categoryString.includes('margarine') || categoryString.includes('nuts') ||
      name.includes('oil') || name.includes('butter') || name.includes('margarine') || 
      name.includes('nuts') || name.includes('seeds')) {
    return ProductCategory.FATS_OILS_NUTS;
  }
  
  if (categoryString.includes('beverage') || categoryString.includes('drink') ||
      categoryString.includes('juice') || categoryString.includes('soda') ||
      name.includes('drink') || name.includes('juice') || name.includes('soda') || 
      name.includes('water') || name.includes('tea') || name.includes('coffee')) {
    return ProductCategory.BEVERAGES;
  }
  
  return ProductCategory.GENERAL_FOOD;
}

// Convert OpenFoodFacts data to our nutrition format
export function convertOpenFoodFactsToNutrition(productData: any): NutritionData {
  const nutriments = productData.nutriments || {};
  
  return {
    energy_kj: nutriments['energy-kj_100g'] || nutriments['energy_kj'] || 
               (nutriments['energy-kcal_100g'] * 4.184) || 0, // Convert kcal to kJ if needed
    sugars_g: nutriments['sugars_100g'] || nutriments.sugars || 0,
    saturated_fat_g: nutriments['saturated-fat_100g'] || nutriments['saturated-fat'] || 0,
    salt_g: nutriments['salt_100g'] || nutriments.salt || 0,
    fiber_g: nutriments['fiber_100g'] || nutriments.fiber || 0,
    protein_g: nutriments['proteins_100g'] || nutriments.proteins || 0,
    fruits_vegetables_legumes_percent: nutriments['fruits-vegetables-nuts-estimate-from-ingredients_100g'] || 
                                      nutriments['fruits-vegetables-nuts-estimate-from-ingredients'] || 0,
    total_fat_g: nutriments['fat_100g'] || nutriments.fat || 0
  };
}
