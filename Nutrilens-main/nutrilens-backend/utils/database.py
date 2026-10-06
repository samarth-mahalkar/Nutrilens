class FakeDB:
    def __init__(self):
        self.products = {
            "8901764112270": {
                "barcode": "8901764112270",
                "name": "Parle-G Biscuits",
                "brand": "Parle",
                "nutrients": {"fat": 10, "sugar": 20, "protein": 4},
            }
        }

    def get_product_by_barcode(self, barcode: str):
        return self.products.get(barcode)
import requests
import pandas as pd
from typing import Dict, Optional

class ProductDatabase:
    def __init__(self):
        """Initialize the database with Open Food Facts API endpoint"""
        self.api_url = "https://world.openfoodfacts.org/api/v0/product/"

    def get_product_by_barcode(self, barcode: str) -> Optional[Dict]:
        """
        Retrieve product information from Open Food Facts API
        Args:
            barcode: Product barcode
        Returns:
            Dictionary containing product information or None if not found
        """
        try:
            # Make API request
            response = requests.get(f"{self.api_url}{barcode}.json")
            print(f"API Response Status: {response.status_code}")  # Debug log

            if response.status_code == 200:
                data = response.json()
                print(f"API Response Data: {data}")  # Debug log

                if data.get('status') == 1:  # Product found
                    product = data['product']
                    return {
                        'barcode': barcode,
                        'product_name': product.get('product_name', 'Unknown'),
                        'brand': product.get('brands', 'Unknown'),
                        'calories': float(product.get('nutriments', {}).get('energy-kcal_100g', 0)),
                        'protein': float(product.get('nutriments', {}).get('proteins_100g', 0)),
                        'carbohydrates': float(product.get('nutriments', {}).get('carbohydrates_100g', 0)),
                        'fats': float(product.get('nutriments', {}).get('fat_100g', 0)),
                        'sugar': float(product.get('nutriments', {}).get('sugars_100g', 0)),
                        'sodium': float(product.get('nutriments', {}).get('sodium_100g', 0)) * 1000,  # Convert to mg
                        'fiber': float(product.get('nutriments', {}).get('fiber_100g', 0)),
                        'vitamins': self._extract_vitamins(product),
                        'health_score': float(product.get('nutriscore_score', 50))
                    }
            return None
        except Exception as e:
            print(f"Error fetching product data: {str(e)}")
            return None

    def _extract_vitamins(self, product: Dict) -> str:
        """Extract vitamin information from product data"""
        vitamins = []
        vitamin_keys = ['vitamin-a', 'vitamin-c', 'vitamin-d', 'vitamin-e', 
                       'vitamin-k', 'vitamin-b1', 'vitamin-b2', 'vitamin-b6', 
                       'vitamin-b9', 'vitamin-b12']

        for key in vitamin_keys:
            if product.get('nutriments', {}).get(f'{key}_100g'):
                vitamins.append(key.upper())

        return ', '.join(vitamins) if vitamins else 'None'

    def search_products_by_name(self, query: str) -> list:
        """
        Search for products by name using Open Food Facts API
        Args:
            query: Search query string
        Returns:
            List of product dictionaries
        """
        try:
            # Use Open Food Facts search API
            search_url = f"https://world.openfoodfacts.org/cgi/search.pl"
            params = {
                'search_terms': query,
                'search_simple': 1,
                'action': 'process',
                'json': 1,
                'page_size': 10
            }
            
            response = requests.get(search_url, params=params)
            print(f"Search API Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                products = []
                
                for product in data.get('products', [])[:5]:  # Limit to 5 results
                    if product.get('code'):  # Make sure product has a barcode
                        product_data = {
                            'barcode': product.get('code', ''),
                            'product_name': product.get('product_name', 'Unknown'),
                            'brand': product.get('brands', 'Unknown'),
                            'calories': float(product.get('nutriments', {}).get('energy-kcal_100g', 0)),
                            'protein': float(product.get('nutriments', {}).get('proteins_100g', 0)),
                            'carbohydrates': float(product.get('nutriments', {}).get('carbohydrates_100g', 0)),
                            'fats': float(product.get('nutriments', {}).get('fat_100g', 0)),
                            'sugar': float(product.get('nutriments', {}).get('sugars_100g', 0)),
                            'sodium': float(product.get('nutriments', {}).get('sodium_100g', 0)) * 1000,
                            'fiber': float(product.get('nutriments', {}).get('fiber_100g', 0)),
                            'vitamins': self._extract_vitamins(product),
                            'health_score': float(product.get('nutriscore_score', 50))
                        }
                        products.append(product_data)
                
                return products
            
            return []
        except Exception as e:
            print(f"Error searching products: {str(e)}")
            return []

    def search_products(self, query: str) -> pd.DataFrame:
        """Search products by name or brand"""
        return self.df[
            self.df['product_name'].str.contains(query, case=False) |
            self.df['brand'].str.contains(query, case=False)
        ]
