import { useRef, useState, useCallback } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const startCamera = useCallback(async () => {
    console.log('Starting camera...');
    if (!videoRef.current) {
      console.log('Video ref is null - video element not ready');
      setError('Video element not ready');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      console.log('Stream obtained successfully:', stream);
      
      // Double-check video ref is still available
      if (!videoRef.current) {
        console.log('Video ref became null after getting stream');
        stream.getTracks().forEach(track => track.stop());
        setError('Video element no longer available');
        setIsLoading(false);
        return;
      }
      
      console.log('Setting stream to video element...');
      videoRef.current.srcObject = stream;
      
      // Wait for video to load metadata
      videoRef.current.onloadedmetadata = () => {
        console.log('Video metadata loaded');
        setIsStreaming(true);
        setIsLoading(false);
      };
      
      videoRef.current.onerror = () => {
        console.error('Video element error');
        setError('Failed to display video');
        setIsLoading(false);
      };

    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      console.log('Camera stopped');
    }
  }, []);

  const capturePhoto = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current) {
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.8);
    });
  }, []);

  return {
    videoRef,
    isStreaming,
    isLoading,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
  };
};
