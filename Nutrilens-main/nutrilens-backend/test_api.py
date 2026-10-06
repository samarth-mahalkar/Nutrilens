#!/usr/bin/env python3

import requests
import json

def test_openfoodfacts_api(barcode):
    """Test OpenFoodFacts API directly"""
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    print(f"Testing URL: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
            
            if data.get('status') == 1 and 'product' in data:
                product = data['product']
                print(f"\nProduct found: {product.get('product_name', 'Unknown')}")
                print(f"Brand: {product.get('brands', 'Unknown')}")
                return True
            else:
                print("Product not found in OpenFoodFacts")
                return False
        else:
            print(f"API request failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    # Test with a common barcode
    test_barcodes = [
        "8901030873663",  # Common Indian product
        "7622210951267",  # Oreo cookies
        "4902430735434",  # KitKat
        "0123456789012"   # Invalid barcode
    ]
    
    for barcode in test_barcodes:
        print(f"\n{'='*50}")
        print(f"Testing barcode: {barcode}")
        print('='*50)
        test_openfoodfacts_api(barcode)
