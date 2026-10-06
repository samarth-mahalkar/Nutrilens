#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.multi_api_database import MultiApiProductDatabase

def test_database():
    """Test the database directly"""
    print("Testing MultiApiProductDatabase...")
    
    db = MultiApiProductDatabase()
    
    # Test multiple barcodes
    test_barcodes = [
        "7622210951267",  # Oreo cookies
        "4902430735434",  # KitKat
        "0012345678905",  # Generic US format
        "8901030873663",  # Original test barcode
    ]
    
    for barcode in test_barcodes:
        print(f"\n{'='*50}")
        print(f"Searching for barcode: {barcode}")
        print('='*50)
        
        result = db.get_product_by_barcode(barcode)
        
        print(f"Result: {result}")
        
        if result:
            print("SUCCESS: Product found!")
            print(f"Product Name: {result.get('product_name')}")
            print(f"Brand: {result.get('brand')}")
            print(f"Calories: {result.get('calories')}")
            break  # Stop at first successful result
        else:
            print("FAILED: Product not found")
    
    print(f"\n{'='*50}")
    print("Test completed")

if __name__ == "__main__":
    test_database()
