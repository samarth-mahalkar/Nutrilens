from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import requests
from utils.barcode_scanner import detect_barcode
from utils.database import FakeDB
from utils.health_rating import calculate_nutriscore_2023, calculate_health_score

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001", 
        "http://localhost:3000", 
        "http://localhost:3002",
        "http://localhost:8080",  # Add Vite dev server port
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Constants ===
MAX_IMAGE_SIZE = 8 * 1024 * 1024  # 8 MB
OPENFOODFACTS_API = "https://world.openfoodfacts.org/api/v0/product"

# === Database mock (replace with your DB connection) ===
db = FakeDB()


# === Health Check Endpoint ===
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Nutrilens Backend is running"}


# === Helper Functions ===

# === Response Model ===
class ProductNutrients(BaseModel):
    fat: float
    sugar: float
    protein: float

class ProductResponse(BaseModel):
    barcode: str
    name: str
    brand: str
    nutrients: ProductNutrients
    health_score: int
    nutriscore: Optional[dict] = None  # Add Nutri-Score data
    raw_product_data: Optional[dict] = None  # Include raw data for Nutri-Score calculation

def fetch_from_openfoodfacts(barcode: str) -> Optional[dict]:
    """Fetch product data from OpenFoodFacts API"""
    try:
        resp = requests.get(f"{OPENFOODFACTS_API}/{barcode}.json", timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == 1:
                prod = data["product"]
                nutriments = prod.get("nutriments", {})
                
                # Extract and normalize nutrient data
                nutrients = {
                    "fat": float(nutriments.get("fat_100g", 0)),
                    "sugar": float(nutriments.get("sugars_100g", 0)),
                    "protein": float(nutriments.get("proteins_100g", 0))
                }
                
                return {
                    "barcode": barcode,
                    "name": prod.get("product_name", "Unknown Product"),
                    "brand": prod.get("brands", "Unknown Brand"),
                    "nutrients": nutrients,
                    "raw_product_data": prod  # Include raw data for Nutri-Score
                }
    except Exception as e:
        print(f"Error fetching OpenFoodFacts: {e}")
    return None

# === API Endpoints ===
@app.post("/scan-image", response_model=ProductResponse)
async def scan_image(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=415, detail="Unsupported file type. Please upload an image.")

    # Read and validate file
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="Image too large (max 8MB).")

    # Detect barcode
    barcode = detect_barcode(image_bytes)
    if not barcode:
        raise HTTPException(status_code=400, detail="Barcode not detected in image.")

    # Lookup product in database first, then OpenFoodFacts
    product = db.get_product_by_barcode(barcode)
    if not product:
        product = fetch_from_openfoodfacts(barcode)

    if not product:
        raise HTTPException(status_code=404, detail=f"Product not found for barcode {barcode}.")

    # Calculate Nutri-Score using the proper 2023 algorithm
    raw_data = product.get("raw_product_data", {})
    if raw_data:
        nutriscore_data = calculate_nutriscore_2023(raw_data)
        # Use the proper Nutri-Score as health score (converted to 0-100 scale)
        health_score = int(calculate_health_score(raw_data))
    else:
        # Fallback if no raw data available
        nutriscore_data = calculate_nutriscore_2023(product["nutrients"])
        health_score = int(calculate_health_score(product["nutrients"]))
    
    return ProductResponse(
        barcode=str(product["barcode"]),
        name=str(product["name"]),
        brand=str(product["brand"]),
        nutrients=ProductNutrients(**product["nutrients"]),
        health_score=health_score,
        nutriscore=nutriscore_data,
        raw_product_data=product.get("raw_product_data")
    )


@app.get("/scan/{barcode}", response_model=ProductResponse)
async def scan_barcode(barcode: str):
    # Lookup product in database first, then OpenFoodFacts
    product = db.get_product_by_barcode(barcode)
    if not product:
        product = fetch_from_openfoodfacts(barcode)

    if not product:
        raise HTTPException(status_code=404, detail=f"Product not found for barcode {barcode}.")

    # Calculate Nutri-Score using the proper 2023 algorithm
    raw_data = product.get("raw_product_data", {})
    if raw_data:
        nutriscore_data = calculate_nutriscore_2023(raw_data)
        # Use the proper Nutri-Score as health score (converted to 0-100 scale)
        health_score = int(calculate_health_score(raw_data))
    else:
        # Fallback if no raw data available
        nutriscore_data = calculate_nutriscore_2023(product["nutrients"])
        health_score = int(calculate_health_score(product["nutrients"]))
    
    return ProductResponse(
        barcode=str(product["barcode"]),
        name=str(product["name"]),
        brand=str(product["brand"]),
        nutrients=ProductNutrients(**product["nutrients"]),
        health_score=health_score,
        nutriscore=nutriscore_data,
        raw_product_data=product.get("raw_product_data")
    )
