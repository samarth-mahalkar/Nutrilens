# 🥗 Nutrilens - Smart Nutrition Scanner

**Scan. Learn. Grow Healthier.**

Nutrilens is a full-stack nutrition scanning application that empowers users to make informed food choices by scanning product barcodes and receiving instant, detailed nutrition information with AI-powered health scores.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-green.svg)](https://www.python.org/)

---

## ✨ Features

### 🔍 Multiple Scanning Methods
- **📸 Live Camera Scanning** - Real-time camera feed with instant barcode capture
- **🖼️ Image Upload** - Upload product photos from your device
- **⌨️ Manual Entry** - Direct barcode input for quick lookups

### 🎯 Comprehensive Nutrition Analysis
- **Nutri-Score** - Official A-E grading system (2023 algorithm)
- **Health Score** - 0-100 rating based on nutritional quality
- **Detailed Breakdown** - Calories, protein, fats, sugars, and more
- **Product Information** - Name, brand, images, and ingredients

### 🌐 Extensive Product Database
- Integration with **OpenFoodFacts API** (millions of products worldwide)
- Automatic product recognition
- Fallback to local database for common items

### 🎨 Modern User Interface
- Beautiful gradient designs
- Responsive layout (mobile & desktop)
- Real-time backend health monitoring
- Product category browsing
- Search functionality

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Frontend (React + TypeScript)         │
│  ┌──────────────────────────────────────────┐  │
│  │  Camera/Upload → Scanner → API Service   │  │
│  │       ↓                        ↓          │  │
│  │  Nutrition Results ← Product Data        │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                       ↓
              HTTP REST API (Port 8002)
                       ↓
┌─────────────────────────────────────────────────┐
│           Backend (FastAPI + Python)            │
│  ┌──────────────────────────────────────────┐  │
│  │  Barcode Scanner (pyzbar + OpenCV)       │  │
│  │           ↓                               │  │
│  │  OpenFoodFacts API Integration           │  │
│  │           ↓                               │  │
│  │  Nutri-Score 2023 Algorithm              │  │
│  │           ↓                               │  │
│  │  Health Score Calculator                 │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm/bun
- **Python** 3.8+
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Nutrilens
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd nutrilens-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn pydantic requests python-multipart pyzbar Pillow opencv-python

# Start the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8002
```

Backend will run on `http://localhost:8002`

### 3. Frontend Setup

```bash
# In a new terminal, from project root
npm install  # or: bun install

# Start development server
npm run dev  # or: bun run dev
```

Frontend will run on `http://localhost:8080`

### 4. Test the Application

1. Open `http://localhost:8080` in your browser
2. Click "Start Scanning" to begin
3. Choose scanning method:
   - Use camera to scan a product barcode
   - Upload an image with a barcode
   - Enter a barcode manually (try: `5449000012203` for Sprite)

---

## 📁 Project Structure

```
Nutrilens/
├── src/                          # Frontend source code
│   ├── pages/                    # Page components
│   │   ├── Index.tsx            # Landing page
│   │   ├── Scanner.tsx          # Barcode scanning interface
│   │   ├── NutritionResults.tsx # Results display
│   │   ├── Auth.tsx             # Authentication
│   │   └── Profile.tsx          # User profile
│   ├── components/              # Reusable components
│   │   ├── BackendHealthCheck.tsx
│   │   ├── BarcodeInput.tsx
│   │   ├── NutriScoreDisplay.tsx
│   │   ├── ProductCard.tsx
│   │   └── ui/                  # shadcn/ui components
│   ├── services/                # API services
│   │   └── api.ts               # Backend API client
│   ├── hooks/                   # Custom React hooks
│   │   └── useCamera.ts         # Camera management
│   └── utils/                   # Utility functions
│       └── nutriScore.ts        # Nutri-Score calculation
│
├── nutrilens-backend/           # Backend source code
│   ├── main.py                  # FastAPI application
│   ├── utils/
│   │   ├── barcode_scanner.py   # Barcode detection
│   │   ├── health_rating.py     # Nutri-Score & health scoring
│   │   └── database.py          # Database utilities
│   └── data/
│       └── users.json           # User data (if needed)
│
├── public/                      # Static assets
├── package.json                 # Frontend dependencies
├── vite.config.ts              # Vite configuration
└── tailwind.config.ts          # Tailwind CSS configuration
```

---

## 🔌 API Endpoints

### Backend API (Port 8002)

| Endpoint | Method | Description | Request | Response |
|----------|--------|-------------|---------|----------|
| `/health` | GET | Health check | - | `{"status": "healthy"}` |
| `/scan-image` | POST | Scan barcode from image | `multipart/form-data` (file) | Product details |
| `/scan/{barcode}` | GET | Lookup by barcode | Barcode string | Product details |

### Response Schema

```typescript
{
  barcode: string;
  name: string;
  brand: string;
  nutrients: {
    fat: number;
    sugar: number;
    protein: number;
  };
  health_score: number;  // 0-100
  nutriscore: {
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    score: number;
    negative_points: number;
    positive_points: number;
  };
  raw_product_data: object;
}
```

---

## 🧪 Technology Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library (Radix UI)
- **React Router 6** - Navigation
- **TanStack Query** - Data fetching
- **Lucide React** - Icons

### Backend
- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **pyzbar** - Barcode decoding
- **Pillow & OpenCV** - Image processing
- **Requests** - HTTP client
- **Uvicorn** - ASGI server

### External Services
- **OpenFoodFacts API** - Product database
- **Supabase** (optional) - Authentication & database

---

## 🧮 Nutri-Score Algorithm

Nutrilens implements the **official Nutri-Score 2023 algorithm**:

### Calculation Method
1. **Negative Points** (0-40)
   - Energy (kJ per 100g)
   - Sugars (g per 100g)
   - Saturated fats (g per 100g)
   - Salt/Sodium (g per 100g)

2. **Positive Points** (0-15)
   - Fiber (g per 100g)
   - Protein (g per 100g)
   - Fruits/Vegetables/Legumes (%)

3. **Final Score**
   ```
   Score = Negative Points - Positive Points
   ```

4. **Grade Assignment**
   - A: Score ≤ -1 (Best)
   - B: Score 0-2
   - C: Score 3-10
   - D: Score 11-18
   - E: Score ≥ 19 (Worst)

### Category-Specific Adjustments
- Beverages have different thresholds
- Cheese, fats/oils have modified calculations
- Red meat products use adjusted protein scoring

---

## 🎨 Features in Detail

### Camera Scanning
- Environment-facing camera (rear camera on mobile)
- 1280x720 resolution for optimal barcode detection
- Multiple preprocessing techniques:
  - Contrast enhancement
  - Sharpness adjustment
  - Rotation detection (90°, 180°, 270°)
  - Grayscale conversion
  - OpenCV thresholding

### Image Processing Pipeline
```
Image Upload → PIL/OpenCV → Enhancement → Barcode Detection → API Lookup
```

### Health Score Calculation
The health score (0-100) is derived from:
- Nutri-Score grade
- Macronutrient balance
- Presence of additives
- Processing level

---

## 🔧 Configuration

### Backend Configuration
Edit `nutrilens-backend/main.py`:
```python
# Change API ports
API_PORT = 8002

# CORS origins
allow_origins=[
    "http://localhost:8080",
    "http://localhost:3000",
    # Add your domains
]
```

### Frontend Configuration
Edit `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8002';
```

---

## 🧪 Testing

### Test the Backend
```bash
cd nutrilens-backend

# Health check
curl http://localhost:8002/health

# Test barcode lookup
curl http://localhost:8002/scan/5449000012203

# Run test scripts
python test_api.py
python test_database.py
```

### Frontend Testing
```bash
npm run build  # Production build
npm run preview  # Preview production build
```

---

## 📱 Supported Platforms

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Desktop applications
- ✅ Progressive Web App (PWA) compatible

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **OpenFoodFacts** - For providing the comprehensive product database
- **shadcn/ui** - For the beautiful component library
- **FastAPI** - For the excellent Python web framework
- **pyzbar** - For barcode detection capabilities

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your Email]

---

## 🗺️ Roadmap

- [ ] User authentication with Supabase
- [ ] Product scanning history
- [ ] Personalized dietary recommendations
- [ ] Allergen alerts and warnings
- [ ] Meal planning integration
- [ ] Offline mode with local database
- [ ] Multiple language support
- [ ] Mobile app (React Native)
- [ ] AI-powered ingredient analysis
- [ ] Community reviews and ratings

---

**Made with ❤️ for healthier living**

*Last updated: February 18, 2026*
