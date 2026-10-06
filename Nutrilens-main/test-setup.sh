#!/bin/bash

echo "🧪 Testing NutriLens Frontend Setup..."
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js version: $(node --version)"
else
    echo "❌ Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "✅ npm version: $(npm --version)"
else
    echo "❌ npm is not installed"
    exit 1
fi

# Check if project dependencies are installed
if [ -d "node_modules" ]; then
    echo "✅ Dependencies are installed"
else
    echo "⚠️  Dependencies not found. Run 'npm install' first."
fi

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ Environment file exists"
    if grep -q "VITE_API_BASE_URL" .env; then
        echo "✅ Backend URL configured"
    else
        echo "⚠️  Backend URL not configured in .env"
    fi
else
    echo "❌ .env file not found"
fi

# Check key files exist
echo ""
echo "📁 Checking project files..."

files=(
    "src/services/api.ts"
    "src/hooks/useCamera.ts"
    "src/components/BarcodeInput.tsx"
    "src/components/BackendHealthCheck.tsx"
    "src/pages/Scanner.tsx"
    "src/pages/NutritionResults.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file"
    fi
done

echo ""
echo "🚀 Ready to start! Run the following commands:"
echo ""
echo "1. Start your FastAPI backend:"
echo "   uvicorn main:app --reload"
echo ""
echo "2. Start the frontend development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📱 Features available:"
echo "   • Camera-based barcode scanning"
echo "   • Image upload scanning"
echo "   • Manual barcode entry"
echo "   • Real-time backend health check"
echo "   • Comprehensive nutrition results"
