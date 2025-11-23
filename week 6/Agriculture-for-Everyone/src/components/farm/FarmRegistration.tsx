import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { CheckCircle, AlertCircle } from "lucide-react";

const farmSchema = z.object({
  name: z.string().min(2, "Farm name must be at least 2 characters").max(100),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  area_ha: z.number().positive("Area must be a positive number"),
  soil_type: z.string().min(1, "Soil type is required").max(50),
});

export const FarmRegistration = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    area_ha: "",
    soil_type: "loamy",
    has_irrigation: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      // Validate that all required fields are filled
      if (!formData.name.trim()) {
        toast({ title: "Validation error", description: "Farm name is required", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      if (!formData.latitude) {
        toast({ title: "Validation error", description: "Latitude is required", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      if (!formData.longitude) {
        toast({ title: "Validation error", description: "Longitude is required", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      if (!formData.area_ha) {
        toast({ title: "Validation error", description: "Farm area is required", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      if (!formData.soil_type) {
        toast({ title: "Validation error", description: "Soil type is required", variant: "destructive" });
        setLoading(false);
        return;
      }

      const data = {
        name: formData.name.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        area_ha: parseFloat(formData.area_ha),
        soil_type: formData.soil_type,
      };

      farmSchema.parse(data);

      const { error } = await supabase.from("farms").insert({
        user_id: user.id,
        ...data,
        has_irrigation: formData.has_irrigation,
      });

      if (error) throw error;

      // Verify farm was saved
      const { data: savedFarms, error: verifyError } = await supabase
        .from("farms")
        .select("id, name")
        .eq("user_id", user.id)
        .eq("name", formData.name.trim())
        .order("created_at", { ascending: false })
        .limit(1);

      if (verifyError || !savedFarms || savedFarms.length === 0) {
        throw new Error("Farm was not saved. Please try again.");
      }

      setRegistrationSuccess(true);
      toast({ 
        title: "✅ Farm Stored Successfully!", 
        description: `"${formData.name}" has been saved to your account and will not be lost.`,
        className: "bg-green-50 border-green-200"
      });
      
      // Small delay to show success message before redirecting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation error", description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({
          title: "Registration failed",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {registrationSuccess ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-600" />
              Farm Registered Successfully!
            </>
          ) : (
            <>
              <AlertCircle className="h-6 w-6 text-primary" />
              Register Your Farm
            </>
          )}
        </CardTitle>
        <CardDescription>
          {registrationSuccess 
            ? "Your farm data is safely stored in our database."
            : "Tell us about your farm to get personalized climate-smart recommendations"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {registrationSuccess ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✓ {formData.name} has been saved</p>
              <p className="text-green-700 text-sm mt-2">
                Your farm details are now stored and can be accessed anytime.
              </p>
            </div>
            <Button 
              onClick={() => {
                if (onSuccess) onSuccess();
                else navigate("/dashboard");
              }}
              className="w-full"
            >
              Continue to Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Farm Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Green Valley Farm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g., -1.2921"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g., 36.8219"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area_ha">Farm Area (hectares) *</Label>
              <Input
                id="area_ha"
                type="number"
                step="0.01"
                value={formData.area_ha}
                onChange={(e) => setFormData({ ...formData, area_ha: e.target.value })}
                placeholder="e.g., 2.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soil_type">Soil Type *</Label>
              <Select
                value={formData.soil_type}
                onValueChange={(value) => setFormData({ ...formData, soil_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="silty">Silty</SelectItem>
                  <SelectItem value="peaty">Peaty</SelectItem>
                  <SelectItem value="chalky">Chalky</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="irrigation"
              checked={formData.has_irrigation}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, has_irrigation: checked })
              }
            />
            <Label htmlFor="irrigation">Farm has irrigation system</Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving to Database..." : "Register & Store Farm"}
          </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};