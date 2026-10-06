import requests
from typing import Any, Dict, Optional, List
import logging

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

class MultiApiProductDatabase:
    def __init__(self):
        """Initialize with multiple API endpoints for better coverage"""
        self.apis: List[Dict[str, Any]] = [
            {
                'name': 'OpenFoodFacts',
                'url_template': 'https://world.openfoodfacts.org/api/v0/product/{barcode}.json',
                'parser': self._parse_openfoodfacts
            },
            {
                'name': 'UPCItemDB',
                'url_template': 'https://api.upcitemdb.com/prod/trial/lookup?upc={barcode}',
                'parser': self._parse_upcitemdb
            },
            {
                'name': 'EAN-Search',
                'url_template': 'https://api.ean-search.org/api?token=your_token&op=barcode-lookup&ean={barcode}&format=json',
                'parser': self._parse_eansearch
            }
        ]
        
    def get_product_by_barcode(self, barcode: str) -> Optional[Dict[str, Any]]:
        """
        Try multiple normalized barcode variants across APIs until a product is found
        """
        candidates = self._normalized_candidates(barcode)
        logging.info(f"Trying barcode candidates: {candidates}")

        for candidate in candidates:
            for api in self.apis:
                try:
                    logging.info(f"Querying {api['name']} for barcode {candidate}...")
                    product = self._query_api(api, candidate)
                    if product:
                        logging.info(f"✅ Found product in {api['name']} using {candidate}")
                        # Ensure the response keeps the originally requested code for UI continuity
                        product['barcode'] = candidate
                        return product
                except Exception as e:
                    logging.error(f"Error with {api['name']}: {e}")

        logging.warning("❌ Product not found in any API for any candidate")
        return None

    def _normalized_candidates(self, barcode: str) -> List[str]:
        """Generate common EAN/UPC variants to improve hit rate.
        Rules:
        - If UPC-A (12 digits), try as-is and with a leading '0' (EAN-13 form)
        - If EAN-13 starting with '0', also try without the leading zero (some sources store UPC-12)
        - If length 14 and starts with leading zeros, try trimming leading zeros down to 13/12
        - Always keep the original first
        """
        s = ''.join(ch for ch in barcode if ch.isdigit())
        candidates: List[str] = []

        def add(c: str):
            if c and c not in candidates:
                candidates.append(c)

        add(s)

        # UPC-A (12) -> EAN-13 with leading 0
        if len(s) == 12:
            add('0' + s)

        # EAN-13 starting with 0 -> also try without it (UPC-12)
        if len(s) == 13 and s.startswith('0'):
            add(s[1:])

        # Length 14 with leading zeros -> try trimming
        if len(s) == 14 and s.startswith('0'):
            # trim one and two zeros
            add(s[1:])
            if s.startswith('00'):
                add(s[2:])

        # Also try stripping a single leading zero in general
        if len(s) > 0 and s.startswith('0'):
            add(s.lstrip('0'))

        return candidates
    
    def _query_api(self, api: Dict[str, Any], barcode: str) -> Optional[Dict[str, Any]]:
        """Query a specific API"""
        url = api['url_template'].format(barcode=barcode)
        
        # Skip EAN-Search if no token configured
        if 'your_token' in url:
            logging.debug("Skipping EAN-Search (no token configured)")
            return None
            
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data: Dict[str, Any] = response.json()
            result: Optional[Dict[str, Any]] = api['parser'](data, barcode)
            return result
                
        except Exception as e:
            logging.error(f"{api['name']} request failed: {e}")
        
        return None
    
    def _parse_openfoodfacts(self, data: Dict[str, Any], barcode: str) -> Optional[Dict[str, Any]]:
        """Parse OpenFoodFacts API response"""
        if data.get('status') == 1:
            product = data['product']
            
            result = {
                'barcode': barcode,
                'product_name': product.get('product_name', 'Unknown'),
                'brand': product.get('brands', 'Unknown'),
                'calories': float(product.get('nutriments', {}).get('energy-kcal_100g', 0)),
                'protein': float(product.get('nutriments', {}).get('proteins_100g', 0)),
                'carbohydrates': float(product.get('nutriments', {}).get('carbohydrates_100g', 0)),
                'fats': float(product.get('nutriments', {}).get('fat_100g', 0)),
                'sugar': float(product.get('nutriments', {}).get('sugars_100g', 0)),
                'sodium_mg': float(product.get('nutriments', {}).get('sodium_100g', 0)) * 1000,
                'fiber': float(product.get('nutriments', {}).get('fiber_100g', 0)),
                'vitamins': self._extract_vitamins_openfoodfacts(product),
                'health_score': product.get('nutriscore_score'),  # None if not present
                'source': 'OpenFoodFacts'
            }
            return result
        return None
    
    def _parse_upcitemdb(self, data: Dict[str, Any], barcode: str) -> Optional[Dict[str, Any]]:
        """Parse UPCItemDB API response"""
        if data.get('code') == 'OK' and data.get('items'):
            item = data['items'][0]
            return {
                'barcode': barcode,
                'product_name': item.get('title', 'Unknown'),
                'brand': item.get('brand', 'Unknown'),
                'calories': 0,  # UPCItemDB doesn't provide nutrition info
                'protein': 0,
                'carbohydrates': 0,
                'fats': 0,
                'sugar': 0,
                'sodium_mg': 0,
                'fiber': 0,
                'vitamins': 'N/A',
                'health_score': None,
                'source': 'UPCItemDB',
                'description': item.get('description', ''),
                'category': item.get('category', '')
            }
        return None
    
    def _parse_eansearch(self, data: Dict[str, Any], barcode: str) -> Optional[Dict[str, Any]]:
        """Parse EAN-Search API response"""
        # EAN-Search returns a list of products
        if data.get('products') and isinstance(data['products'], list):
            product = data['products'][0]  # Take first match
            return {
                'barcode': barcode,
                'product_name': product.get('name', 'Unknown'),
                'brand': product.get('vendor', 'Unknown'),
                'calories': 0,  # EAN-Search doesn't provide detailed nutrition
                'protein': 0,
                'carbohydrates': 0,
                'fats': 0,
                'sugar': 0,
                'sodium_mg': 0,
                'fiber': 0,
                'vitamins': 'N/A',
                'health_score': None,
                'source': 'EAN-Search',
                'category': product.get('category', '')
            }
        return None
    
    def _extract_vitamins_openfoodfacts(self, product: Dict[str, Any]) -> str:
        """Extract vitamin information from OpenFoodFacts data"""
        vitamins = []
        vitamin_keys = ['vitamin-a', 'vitamin-c', 'vitamin-d', 'vitamin-e', 
                       'vitamin-k', 'vitamin-b1', 'vitamin-b2', 'vitamin-b6', 
                       'vitamin-b9', 'vitamin-b12']

        for key in vitamin_keys:
            if product.get('nutriments', {}).get(f'{key}_100g'):
                vitamins.append(key.upper())

        return ', '.join(vitamins) if vitamins else 'None'
    
    def search_products_by_name(self, query: str) -> List[Dict[str, Any]]:
        """Search products by name using OpenFoodFacts (most comprehensive for search)"""
        try:
            search_url = "https://world.openfoodfacts.org/cgi/search.pl"
            params = {
                'search_terms': query,
                'search_simple': 1,
                'action': 'process',
                'json': 1,
                'page_size': 10
            }
            
            response = requests.get(search_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            products = []
            
            for product in data.get('products', [])[:5]:
                if product.get('code'):
                    parsed = self._parse_openfoodfacts({'status': 1, 'product': product}, product.get('code'))
                    if parsed:
                        products.append(parsed)
            
            return products
        
        except Exception as e:
            logging.error(f"Error searching products: {e}")
            return []


# ------------------------------
# Example usage
# ------------------------------
if __name__ == "__main__":
    db = MultiApiProductDatabase()
    product = db.get_product_by_barcode("8901030372165")  # Example: Maggi noodles barcode
    print(product)
