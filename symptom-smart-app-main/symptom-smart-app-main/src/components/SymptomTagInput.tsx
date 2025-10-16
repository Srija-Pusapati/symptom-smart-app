import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface SymptomTagInputProps {
  symptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
}

const SymptomTagInput = ({ symptoms, onSymptomsChange }: SymptomTagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSymptom();
    }
  };

  const addSymptom = () => {
    const trimmedValue = inputValue.trim().toLowerCase();
    if (trimmedValue && !symptoms.includes(trimmedValue)) {
      onSymptomsChange([...symptoms, trimmedValue]);
      setInputValue("");
    }
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
