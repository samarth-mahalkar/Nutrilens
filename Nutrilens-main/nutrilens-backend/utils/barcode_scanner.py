from pyzbar.pyzbar import decode
from PIL import Image, ImageEnhance, ImageFilter
import io
import  cv2
import numpy as np
from typing import Optional


def detect_barcode(image_data) -> Optional[str]:
    """
    Detect and decode barcode from image data with enhanced preprocessing
    Args:
        image_data: Image data (can be bytes or PIL Image)
    Returns:
        Barcode string if found, None otherwise
    """
    try:
        # Convert to PIL Image if needed
        if isinstance(image_data, bytes):
            image = Image.open(io.BytesIO(image_data))
        else:
            image = image_data

        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Try multiple preprocessing approaches
        preprocessed_images = [
            image,  # Original image
            enhance_image_for_barcode(image),  # Enhanced image
            image.convert('L'),  # Grayscale
            enhance_image_for_barcode(image.convert('L'))  # Enhanced grayscale
        ]

        # Try different rotations for the enhanced images
        for img in preprocessed_images:
            # Try original orientation
            barcodes = decode(img)
            if barcodes:
                return barcodes[0].data.decode('utf-8')
            
            # Try 90-degree rotations
            for angle in [90, 180, 270]:
                rotated = img.rotate(angle, expand=True)
                barcodes = decode(rotated)
                if barcodes:
                    return barcodes[0].data.decode('utf-8')
        
        return None
    except Exception as e:
        print(f"Error detecting barcode: {str(e)}")
        return None

def enhance_image_for_barcode(image):
    """
    Apply image enhancements to improve barcode detection
    """
    try:
        # Increase contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2.0)
        
        # Increase sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(2.0)
        
        # Apply unsharp mask filter
        image = image.filter(ImageFilter.UnsharpMask(radius=1, percent=150, threshold=3))
        
        return image
    except Exception as e:
        print(f"Error enhancing image: {str(e)}")
        return image

def opencv_preprocess(image_data):
    """
    Extra preprocessing with OpenCV for tougher barcodes
    """
    try:
        if isinstance(image_data, bytes):
            file_bytes = np.asarray(bytearray(image_data), dtype=np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        else:
            img = cv2.cvtColor(np.array(image_data), cv2.COLOR_RGB2BGR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        return Image.fromarray(thresh)
    except Exception as e:
        print(f"Error in OpenCV preprocessing: {str(e)}")
        return None
