import streamlit as st
from utils.barcode_scanner import detect_barcode
from utils.database import FakeDB  # If you want to use your DB logic
import requests
from PIL import Image
import io

# === Constants ===
MAX_IMAGE_SIZE = 8 * 1024 * 1024  # 8 MB
OPENFOODFACTS_API = "https://world.openfoodfacts.org/api/v0/product"

def fetch_from_openfoodfacts(barcode: str):
    try:
        resp = requests.get(f"{OPENFOODFACTS_API}/{barcode}.json", timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == 1:
                prod = data["product"]
                return {
                    "barcode": barcode,
                    "name": prod.get("product_name", "Unknown"),
                    "brand": prod.get("brands", "Unknown"),
                    "nutrients": prod.get("nutriments", {}),
                }
    except Exception as e:
        st.error(f"Error fetching OpenFoodFacts: {e}")
    return None

def calculate_health_score(product: dict) -> int:
    score = 100
    if product["nutrients"].get("sugar", 0) > 15:
        score -= 20
    if product["nutrients"].get("fat", 0) > 10:
        score -= 10
    return max(score, 0)

def main():
    st.title("Nutrilens Barcode Scanner (Streamlit)")
    st.write("Upload a food product image with a barcode to get product info and health score.")


    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
    if uploaded_file is not None:
        image_bytes = uploaded_file.read()
        if len(image_bytes) > MAX_IMAGE_SIZE:
            st.error("Image too large (max 8MB).")
            return
        try:
            image = Image.open(io.BytesIO(image_bytes))
            st.image(image, caption="Uploaded Image", use_container_width=True)
        except Exception:
            st.error("Invalid image file.")
            return

        st.info("Tip: Make sure the barcode is clear, well-lit, and not blurry for best results.")
        barcode = detect_barcode(image_bytes)
        if not barcode:
            st.warning("Barcode not detected in image. Try another image or adjust the barcode's visibility.")
            return
        st.success(f"Detected Barcode: {barcode}")

        # Lookup DB first, then OpenFoodFacts
        db = FakeDB()
        product = db.get_product_by_barcode(barcode)
        if not product:
            product = fetch_from_openfoodfacts(barcode)

        if not product:
            st.error(f"Product not found for barcode {barcode}.")
            return

        product["health_score"] = calculate_health_score(product)
        st.subheader("Product Information:")
        st.json(product)
        st.progress(product["health_score"])

if __name__ == "__main__":
    main()
