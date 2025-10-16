import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Activity, AlertCircle } from "lucide-react";
import { z } from "zod";
import SymptomTagInput from "@/components/SymptomTagInput";
import medicalBg from "@/assets/medical-bg.jpg";

const ageSchema = z.number().min(1).max(120);
const durationSchema = z.string().trim().min(1).max(100);

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("");

  const validateForm = (): boolean => {
    try {
      if (symptoms.length < 2) {
        toast.error("Please add at least 2 symptoms for analysis");
        return false;
      }
      
      if (!gender) {
        toast.error("Please select your gender");
        return false;
      }

      const ageNum = parseInt(age);
      if (!age || isNaN(ageNum)) {
        toast.error("Please enter a valid age");
        return false;
      }
      ageSchema.parse(ageNum);

      durationSchema.parse(duration);

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const symptomsText = symptoms.join(", ");
      const { data, error } = await supabase.functions.invoke("analyze-symptoms", {
        body: {
          symptoms: symptomsText,
          gender,
          age: parseInt(age),
          duration,
        },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("Too many requests. Please try again in a few moments.");
        } else if (error.message?.includes("402")) {
          toast.error("Service temporarily unavailable. Please try again later.");
        } else {
          toast.error("Failed to analyze symptoms. Please try again.");
        }
        return;
      }

      // Navigate to results with the analysis data
      navigate("/results", {
        state: {
          analysis: data.analysis,
          symptoms: symptomsText,
          gender,
          age,
          duration,
        },
      });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen px-4 py-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${medicalBg})` }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">AI Health Advisor</h1>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">AI Symptom Checker</CardTitle>
            <CardDescription>
              Please provide detailed information about your symptoms for accurate analysis
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <SymptomTagInput symptoms={symptoms} onSymptomsChange={setSymptoms} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    min="1"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    type="text"
                    placeholder="e.g., 3 days"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Medical Disclaimer:</strong> This AI tool provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? "Analyzing..." : "Analyze Symptoms"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomChecker;
