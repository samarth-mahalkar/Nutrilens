import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Camera, Keyboard, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCamera } from "@/hooks/useCamera";
import { BarcodeInput } from "@/components/BarcodeInput";
import { apiService, ProductResponse } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Scanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    videoRef,
    isStreaming,
    isLoading,
    error: cameraError,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showBarcodeInput, setShowBarcodeInput] = useState(false);

  // Check if camera is supported
  const isCameraSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

  useEffect(() => {
    console.log('Scanner useEffect triggered');
    // Start camera when component mounts
    if (isCameraSupported) {
      console.log('Camera supported, starting camera...');
      // Small delay to ensure video element is mounted
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      console.log('Camera not supported');
    }

    // Cleanup camera when component unmounts
    return () => {
      console.log('Scanner cleanup - stopping camera');
      stopCamera();
    };
  }, [isCameraSupported]); // Removed startCamera and stopCamera from dependencies

  // Debug the camera state
  useEffect(() => {
    console.log('Camera state changed:', {
      isStreaming,
      isCameraSupported,
      error: cameraError
    });
  }, [isStreaming, isCameraSupported, cameraError]);

  const handleProductResult = (product: ProductResponse) => {
    // Navigate to results page with product data
    navigate("/nutrition-results", {
      state: {
        barcode: product.barcode,
        productName: product.name,
        brand: product.brand,
        protein: product.nutrients.protein,
        fat: product.nutrients.fat,
        sugar: product.nutrients.sugar,
        healthScore: product.health_score,
        raw_product_data: product.raw_product_data,
        nutri_score: product.nutri_score,
        // Calculate calories from nutrients (approximate)
        calories: Math.round(
          (product.nutrients.protein * 4) + 
          (product.nutrients.fat * 9) + 
          (product.nutrients.sugar * 4)
        )
      }
    });
  };

  const handleError = (error: string) => {
    setIsScanning(false);
    toast({
      title: "Scan Failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleUploadFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    toast({
      title: "Analyzing...",
      description: "Scanning your image for product information.",
    });

    try {
      const product = await apiService.scanImage(file);
      handleProductResult(product);
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Failed to scan image');
    }
  };

  const handleCameraCapture = async () => {
    if (!capturePhoto) {
      toast({
        title: "Camera Error",
        description: "Camera capture is not available.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    toast({
      title: "Capturing...",
      description: "Taking photo and analyzing...",
    });

    try {
      const photoFile = await capturePhoto();
      if (!photoFile) {
        throw new Error('Failed to capture photo');
      }

      const product = await apiService.scanImage(photoFile);
      handleProductResult(product);
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Failed to capture and scan image');
    }
  };

  const handleBarcodeSubmit = async (barcode: string) => {
    setIsScanning(true);
    try {
      const product = await apiService.scanByBarcode(barcode);
      setShowBarcodeInput(false);
      handleProductResult(product);
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Failed to find product');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 pt-12">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full shadow-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white rounded-full shadow-md"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-6 pt-24">
        
        {/* Camera Frame */}
        <div className="relative mb-12">
          <div className="w-80 h-96 bg-white rounded-3xl shadow-2xl overflow-hidden relative">
            {/* Camera feed - always render video element */}
            {isCameraSupported ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
                />
                {!isStreaming && (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center absolute top-0 left-0">
                    {isLoading ? (
                      <div className="text-center text-gray-500 p-6">
                        <Camera className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                        <p className="text-sm">Starting camera...</p>
                      </div>
                    ) : cameraError ? (
                      <div className="text-center text-gray-500 p-6">
                        <Camera className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">{cameraError}</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 p-6">
                        <Camera className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Camera ready</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {cameraError ? (
                  <div className="text-center text-gray-500 p-6">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Camera not available</p>
                    <p className="text-sm opacity-75">Use upload instead</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Loading camera...</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="font-medium">Analyzing...</p>
                </div>
              </div>
            )}

            {/* Scanning frame overlay */}
            <div className="absolute inset-8 border-2 border-white/80 rounded-2xl pointer-events-none">
              {/* Corner highlights */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-blue-500 rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-blue-500 rounded-br-xl"></div>
            </div>
          </div>

          {/* Info card */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-lg px-6 py-3 flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Point camera at product
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          {/* Capture Button */}
          <Button
            onClick={handleCameraCapture}
            disabled={isScanning || !isStreaming}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-medium text-lg shadow-lg disabled:opacity-50"
          >
            <Camera className="h-5 w-5 mr-2" />
            Capture Photo
          </Button>

          {/* Upload Button */}
          <Button
            onClick={handleUploadFromGallery}
            variant="outline"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200 py-4 rounded-2xl font-medium shadow-md"
            disabled={isScanning}
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload from Gallery
          </Button>

          {/* Manual Entry Button */}
          <Button
            onClick={() => setShowBarcodeInput(true)}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-800 hover:bg-white/50 py-3 rounded-xl font-medium"
            disabled={isScanning}
          >
            <Keyboard className="h-4 w-4 mr-2" />
            Enter barcode manually
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Manual Barcode Input Dialog */}
      <Dialog open={showBarcodeInput} onOpenChange={setShowBarcodeInput}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Enter Barcode</DialogTitle>
          </DialogHeader>
          <BarcodeInput 
            onScan={handleBarcodeSubmit} 
            isLoading={isScanning}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scanner;