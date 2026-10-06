from typing import Any, Dict

def calculate_nutriscore_2023(nutrition_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate Nutri-Score 2023 algorithm
    Returns: {
        'score': int,
        'grade': str,
        'negative_points': int,
        'positive_points': int,
        'is_beverage': bool
    }
    """
    
    # Extract nutritional values (per 100g/ml)
    energy_kj = float(nutrition_data.get('energy-kj', nutrition_data.get('energy', 0)))
    if energy_kj == 0:
        # Try alternative field names from OpenFoodFacts
        energy_kj = float(nutrition_data.get('nutriments', {}).get('energy-kj_100g', 0))
        if energy_kj == 0:
            energy_kj = float(nutrition_data.get('nutriments', {}).get('energy', 0))
    
    sugars = float(nutrition_data.get('sugars', nutrition_data.get('sugar', 0)))
    if sugars == 0:
        # Try alternative field names from OpenFoodFacts
        sugars = float(nutrition_data.get('nutriments', {}).get('sugars_100g', 0))
        if sugars == 0:
            sugars = float(nutrition_data.get('nutriments', {}).get('sugars', 0))
    
    saturated_fat = float(nutrition_data.get('saturated-fat', nutrition_data.get('saturated_fat', 0)))
    if saturated_fat == 0:
        # Try alternative field names from OpenFoodFacts
        saturated_fat = float(nutrition_data.get('nutriments', {}).get('saturated-fat_100g', 0))
    
    salt = float(nutrition_data.get('salt', 0))
    if salt == 0:
        # Try alternative field names from OpenFoodFacts
        salt = float(nutrition_data.get('nutriments', {}).get('salt_100g', 0))
    
    sodium = float(nutrition_data.get('sodium', 0))
    if sodium == 0:
        # Try alternative field names from OpenFoodFacts
        sodium = float(nutrition_data.get('nutriments', {}).get('sodium_100g', 0))
        
    protein = float(nutrition_data.get('proteins', nutrition_data.get('protein', 0)))
    if protein == 0:
        # Try alternative field names from OpenFoodFacts
        protein = float(nutrition_data.get('nutriments', {}).get('proteins_100g', 0))
    
    fiber = float(nutrition_data.get('fiber', 0))
    if fiber == 0:
        # Try alternative field names from OpenFoodFacts
        fiber = float(nutrition_data.get('nutriments', {}).get('fiber_100g', 0))
    
    fruits_veg = float(nutrition_data.get('fruits-vegetables-nuts-estimate-from-ingredients_100g', 0))
    if fruits_veg == 0:
        # Try alternative field names from OpenFoodFacts
        fruits_veg = float(nutrition_data.get('nutriments', {}).get('fruits-vegetables-nuts-estimate-from-ingredients_100g', 0))
    
    # Convert sodium to salt if salt is 0
    if salt == 0 and sodium > 0:
        salt = sodium * 2.5 / 1000  # Convert mg sodium to g salt
    
    # Determine if it's a beverage (categories contain beverage indicators)
    categories = nutrition_data.get('categories', '').lower()
    is_beverage = any(term in categories for term in ['beverage', 'drink', 'water', 'soda', 'juice'])
    
    # NEGATIVE POINTS
    negative_points = 0
    
    # Energy points (different for beverages vs food)
    if is_beverage:
        if energy_kj <= 0:
            energy_points = 0
        elif energy_kj <= 30:
            energy_points = 1
        elif energy_kj <= 60:
            energy_points = 2
        elif energy_kj <= 90:
            energy_points = 3
        elif energy_kj <= 120:
            energy_points = 4
        elif energy_kj <= 150:
            energy_points = 5
        elif energy_kj <= 180:
            energy_points = 6
        elif energy_kj <= 210:
            energy_points = 7
        elif energy_kj <= 240:
            energy_points = 8
        elif energy_kj <= 270:
            energy_points = 9
        else:
            energy_points = 10
    else:
        if energy_kj <= 335:
            energy_points = 0
        elif energy_kj <= 670:
            energy_points = 1
        elif energy_kj <= 1005:
            energy_points = 2
        elif energy_kj <= 1340:
            energy_points = 3
        elif energy_kj <= 1675:
            energy_points = 4
        elif energy_kj <= 2010:
            energy_points = 5
        elif energy_kj <= 2345:
            energy_points = 6
        elif energy_kj <= 2680:
            energy_points = 7
        elif energy_kj <= 3015:
            energy_points = 8
        elif energy_kj <= 3350:
            energy_points = 9
        else:
            energy_points = 10
    
    negative_points += energy_points
    
    # Sugar points (different for beverages vs food)
    if is_beverage:
        if sugars <= 0:
            sugar_points = 0
        elif sugars <= 1.5:
            sugar_points = 1
        elif sugars <= 3:
            sugar_points = 2
        elif sugars <= 4.5:
            sugar_points = 3
        elif sugars <= 6:
            sugar_points = 4
        elif sugars <= 7.5:
            sugar_points = 5
        elif sugars <= 9:
            sugar_points = 6
        elif sugars <= 10.5:
            sugar_points = 7
        elif sugars <= 12:
            sugar_points = 8
        elif sugars <= 13.5:
            sugar_points = 9
        else:
            sugar_points = 10
    else:
        if sugars <= 4.5:
            sugar_points = 0
        elif sugars <= 9:
            sugar_points = 1
        elif sugars <= 13.5:
            sugar_points = 2
        elif sugars <= 18:
            sugar_points = 3
        elif sugars <= 22.5:
            sugar_points = 4
        elif sugars <= 27:
            sugar_points = 5
        elif sugars <= 31:
            sugar_points = 6
        elif sugars <= 36:
            sugar_points = 7
        elif sugars <= 40:
            sugar_points = 8
        elif sugars <= 45:
            sugar_points = 9
        else:
            sugar_points = 10
    
    negative_points += sugar_points
    
    # Saturated fat points
    if saturated_fat <= 1:
        sat_fat_points = 0
    elif saturated_fat <= 2:
        sat_fat_points = 1
    elif saturated_fat <= 3:
        sat_fat_points = 2
    elif saturated_fat <= 4:
        sat_fat_points = 3
    elif saturated_fat <= 5:
        sat_fat_points = 4
    elif saturated_fat <= 6:
        sat_fat_points = 5
    elif saturated_fat <= 7:
        sat_fat_points = 6
    elif saturated_fat <= 8:
        sat_fat_points = 7
    elif saturated_fat <= 9:
        sat_fat_points = 8
    elif saturated_fat <= 10:
        sat_fat_points = 9
    else:
        sat_fat_points = 10
    
    negative_points += sat_fat_points
    
    # Salt points (same for beverages and food)
    if salt <= 0.2:
        salt_points = 0
    elif salt <= 0.4:
        salt_points = 1
    elif salt <= 0.6:
        salt_points = 2
    elif salt <= 0.8:
        salt_points = 3
    elif salt <= 1.0:
        salt_points = 4
    elif salt <= 1.2:
        salt_points = 5
    elif salt <= 1.4:
        salt_points = 6
    elif salt <= 1.6:
        salt_points = 7
    elif salt <= 1.8:
        salt_points = 8
    elif salt <= 2.0:
        salt_points = 9
    else:
        salt_points = 20  # Maximum for salt
    
    negative_points += salt_points
    
    # Non-nutritive sweeteners (2023 addition for beverages)
    non_nutritive_sweeteners_points = 0
    if is_beverage:
        # Check for non-nutritive sweeteners in ingredients
        additives = nutrition_data.get('additives_tags', [])
        ingredients_text = nutrition_data.get('ingredients_text', '').lower()
        
        sweetener_count = 0
        # Common non-nutritive sweeteners
        non_nutritive_sweeteners = [
            'en:e950', 'en:e951', 'en:e952', 'en:e954', 'en:e955', 'en:e957', 'en:e959',
            'en:e960', 'en:e961', 'en:e962', 'en:e969', 'aspartam', 'acesulfam',
            'stevia', 'sucralose', 'steviol'
        ]
        
        for sweetener in non_nutritive_sweeteners:
            if sweetener in additives or sweetener in ingredients_text:
                sweetener_count += 1
                break  # Count as 1 if any found
        
        if sweetener_count > 0:
            non_nutritive_sweeteners_points = 4
    
    negative_points += non_nutritive_sweeteners_points
    
    # POSITIVE POINTS
    positive_points = 0
    
    # Protein points
    if protein <= 1.6:
        protein_points = 0
    elif protein <= 3.2:
        protein_points = 1
    elif protein <= 4.8:
        protein_points = 2
    elif protein <= 6.4:
        protein_points = 3
    elif protein <= 8.0:
        protein_points = 4
    elif protein <= 9.6:
        protein_points = 5
    elif protein <= 11.2:
        protein_points = 6
    else:
        protein_points = 7
    
    positive_points += protein_points
    
    # Fiber points
    if fiber <= 0.9:
        fiber_points = 0
    elif fiber <= 1.9:
        fiber_points = 1
    elif fiber <= 2.8:
        fiber_points = 2
    elif fiber <= 3.7:
        fiber_points = 3
    elif fiber <= 4.7:
        fiber_points = 4
    else:
        fiber_points = 5
    
    positive_points += fiber_points
    
    # Fruits/vegetables/legumes points
    if fruits_veg <= 40:
        fvl_points = 0
    elif fruits_veg <= 60:
        fvl_points = 1
    elif fruits_veg <= 80:
        fvl_points = 2
    else:
        fvl_points = 6  # Maximum for fruits/veg
    
    positive_points += fvl_points
    
    # Calculate final score
    final_score = negative_points - positive_points
    
    # Determine grade based on beverage vs food thresholds
    if is_beverage:
        if final_score <= 1:
            grade = 'A'
        elif final_score <= 5:
            grade = 'B'
        elif final_score <= 9:
            grade = 'C'
        elif final_score <= 13:
            grade = 'D'
        else:
            grade = 'E'
    else:
        if final_score <= -1:
            grade = 'A'
        elif final_score <= 2:
            grade = 'B'
        elif final_score <= 10:
            grade = 'C'
        elif final_score <= 18:
            grade = 'D'
        else:
            grade = 'E'
    
    return {
        'score': final_score,
        'grade': grade,
        'negative_points': negative_points,
        'positive_points': positive_points,
        'is_beverage': is_beverage,
        'breakdown': {
            'energy_points': energy_points,
            'sugar_points': sugar_points,
            'saturated_fat_points': sat_fat_points,
            'salt_points': salt_points,
            'non_nutritive_sweeteners_points': non_nutritive_sweeteners_points,
            'protein_points': protein_points,
            'fiber_points': fiber_points,
            'fruits_veg_points': fvl_points
        }
    }

def calculate_health_score(nutrition_data: Dict[str, Any]) -> float:
    """
    Legacy function for backward compatibility
    Now uses Nutri-Score but returns a simplified score
    """
    nutriscore = calculate_nutriscore_2023(nutrition_data)
    
    # Convert Nutri-Score to a 0-100 scale for backward compatibility
    grade_scores = {'A': 90, 'B': 75, 'C': 60, 'D': 40, 'E': 20}
    return float(grade_scores.get(nutriscore['grade'], 50))

def get_health_rating_color(score: float) -> str:
    """Return color based on health score"""
    if score >= 80:
        return "#2E7D32"  # Green
    elif score >= 60:
        return "#FFA000"  # Orange
    else:
        return "#C62828"  # Red

def get_health_rating_text(score: float) -> str:
    """Return descriptive text based on health score"""
    if score >= 80:
        return "Excellent"
    elif score >= 60:
        return "Good"
    else:
        return "Poor"
