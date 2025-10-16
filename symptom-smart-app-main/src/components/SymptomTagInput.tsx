import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Common medical symptoms dictionary for spell checking
const COMMON_SYMPTOMS = [
  "fever", "headache", "cough", "cold", "fatigue", "nausea", "vomiting", 
  "diarrhea", "constipation", "dizziness", "pain", "sore throat", "runny nose",
  "chest pain", "shortness of breath", "abdominal pain", "back pain", "joint pain",
  "muscle pain", "weakness", "chills", "sweating", "rash", "itching", "swelling",
  "bleeding", "bruising", "numbness", "tingling", "blurred vision", "loss of appetite",
  "weight loss", "weight gain", "insomnia", "anxiety", "depression", "confusion",
  "memory loss", "difficulty breathing", "wheezing", "sneezing", "congestion",
  "earache", "eye pain", "toothache", "neck pain", "shoulder pain", "leg pain",
  "foot pain", "hand pain", "stomach ache", "heartburn", "bloating", "cramps"
];

// Calculate Levenshtein distance for spell checking
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Find closest matching symptom
const findClosestMatch = (input: string): { match: string; distance: number } | null => {
  let closestMatch = "";
  let minDistance = Infinity;
  
  for (const symptom of COMMON_SYMPTOMS) {
    const distance = levenshteinDistance(input, symptom);
    if (distance < minDistance && distance <= 2) {
      minDistance = distance;
      closestMatch = symptom;
    }
  }
  
  return minDistance <= 2 ? { match: closestMatch, distance: minDistance } : null;
};

interface SymptomTagInputProps {
  symptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
}

const SymptomTagInput = ({ symptoms, onSymptomsChange }: SymptomTagInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [pendingSymptom, setPendingSymptom] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSymptom();
    }
  };

  const addSymptom = () => {
    const trimmedValue = inputValue.trim().toLowerCase();
    if (!trimmedValue) return;
    
    // Check if symptom already exists
    if (symptoms.includes(trimmedValue)) {
      setInputValue("");
      return;
    }
    
    // Check if it's a known symptom
    const isKnownSymptom = COMMON_SYMPTOMS.includes(trimmedValue);
    
    if (!isKnownSymptom) {
      // Check for spelling suggestions
      const closestMatch = findClosestMatch(trimmedValue);
      
      if (closestMatch && closestMatch.distance > 0) {
        // Show suggestion
        setSuggestion(closestMatch.match);
        setPendingSymptom(trimmedValue);
        return;
      }
    }
    
    // Add the symptom
    onSymptomsChange([...symptoms, trimmedValue]);
    setInputValue("");
    setSuggestion(null);
    setPendingSymptom(null);
  };
  
  const acceptSuggestion = () => {
    if (suggestion && !symptoms.includes(suggestion)) {
      onSymptomsChange([...symptoms, suggestion]);
    }
    setInputValue("");
    setSuggestion(null);
    setPendingSymptom(null);
  };
  
  const ignoreSuggestion = () => {
    if (pendingSymptom && !symptoms.includes(pendingSymptom)) {
      onSymptomsChange([...symptoms, pendingSymptom]);
    }
    setInputValue("");
    setSuggestion(null);
    setPendingSymptom(null);
  };

  const removeSymptom = (symptomToRemove: string) => {
    onSymptomsChange(symptoms.filter((s) => s !== symptomToRemove));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="symptom-input">Enter Your Symptoms *</Label>
      <Input
        id="symptom-input"
        type="text"
        placeholder="Type a symptom and press Enter (e.g., fever, headache, cold)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSymptom}
        className="w-full"
      />
      
      {suggestion && pendingSymptom && (
        <Alert className="border-amber-500 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex flex-col gap-2">
            <span className="text-amber-900">
              Did you mean <strong>"{suggestion}"</strong> instead of "{pendingSymptom}"?
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={acceptSuggestion}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Use "{suggestion}"
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={ignoreSuggestion}
              >
                Keep "{pendingSymptom}"
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      {symptoms.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/50 min-h-[60px]">
          {symptoms.map((symptom) => (
            <Badge
              key={symptom}
              variant="secondary"
              className="text-sm py-1.5 px-3 flex items-center gap-2"
            >
              {symptom}
              <button
                type="button"
                onClick={() => removeSymptom(symptom)}
                className="hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        {symptoms.length} symptom{symptoms.length !== 1 ? "s" : ""} added. Add at least 2 symptoms for analysis.
      </p>
    </div>
  );
};

export default SymptomTagInput;
