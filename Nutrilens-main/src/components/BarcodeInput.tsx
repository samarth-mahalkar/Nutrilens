import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";

interface BarcodeInputProps {
  onScan: (barcode: string) => Promise<void>;
  isLoading: boolean;
}

export const BarcodeInput = ({ onScan, isLoading }: BarcodeInputProps) => {
  const [barcode, setBarcode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim() && !isLoading) {
      await onScan(barcode.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Search className="h-5 w-5" />
          Manual Barcode Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="barcode">Enter Barcode Number</Label>
            <Input
              id="barcode"
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g., 7622210992741"
              disabled={isLoading}
              className="text-center text-lg"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!barcode.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Scan Product
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
