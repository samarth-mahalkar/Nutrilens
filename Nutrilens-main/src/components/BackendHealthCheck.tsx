import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

export const BackendHealthCheck = () => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const [message, setMessage] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = async () => {
    setIsRefreshing(true);
    setStatus('checking');
    try {
      const response = await apiService.healthCheck();
      setStatus('healthy');
      setMessage(response.message || 'Backend is running');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to connect to backend');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      default:
        return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <Badge variant={getStatusVariant()} className="flex items-center gap-2">
        {getStatusIcon()}
        Backend: {status === 'checking' ? 'Checking...' : status}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={checkHealth}
        disabled={isRefreshing}
        className="h-8 w-8"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
      {message && (
        <span className="text-sm text-muted-foreground">
          {message}
        </span>
      )}
    </div>
  );
};
