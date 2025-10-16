import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertCircle, Heart, User, Calendar, Clock, Activity, FileText, RefreshCw, Printer } from "lucide-react";
import { motion } from "framer-motion";

interface LocationState {
  analysis: string;
  symptoms: string;
  gender: string;
  age: string;
  duration: string;
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    // Redirect if no analysis data
    if (!state?.analysis) {
      navigate("/symptom-checker");
    }
  }, [state, navigate]);

  if (!state?.analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-2 border-primary/30 backdrop-blur-sm bg-white/95">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-teal-500 to-purple-600 text-white">
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <Heart className="w-8 h-8 animate-pulse" />
                Health Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-inner space-y-4">
                <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-bold text-primary">{state.age} years</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                    <User className="w-4 h-4 text-teal-600" />
                    <span className="text-muted-foreground">Gender:</span>
                    <span className="font-bold text-primary capitalize">{state.gender}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-bold text-primary">{state.duration}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  Reported Symptoms
                </h3>
                <p className="text-foreground bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg border-2 border-teal-300 shadow-sm font-medium">
                  {state.symptoms}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  AI Health Analysis
                </h3>
                <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6 rounded-xl border-l-4 border-purple-500 shadow-lg">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed text-lg font-medium">
                    {state.analysis}
                  </p>
                </div>
              </div>

              <Alert className="border-2 border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <AlertTitle className="text-orange-900 font-bold">Important Medical Disclaimer</AlertTitle>
                <AlertDescription className="text-orange-800 font-medium">
                  This analysis is provided for informational purposes only and is not a substitute for 
                  professional medical advice, diagnosis, or treatment. Always seek the advice of your 
                  physician or other qualified health provider with any questions you may have regarding 
                  a medical condition.
                </AlertDescription>
              </Alert>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex items-center gap-2 border-2 hover:bg-blue-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>
                <Button
                  onClick={() => navigate('/symptom-checker')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Check New Symptoms
                </Button>
                <Button
                  onClick={() => window.print()}
                  variant="secondary"
                  className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-900 border-2 border-purple-300"
                >
                  <Printer className="w-4 h-4" />
                  Print Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
