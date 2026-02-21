import { useState } from "react";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import QuizStep from "@/components/QuizStep";
import ResultsSection from "@/components/ResultsSection";
import { quizSteps } from "@/lib/quizData";

type AppState = "hero" | "quiz" | "loading" | "results";

const Index = () => {
  const [state, setState] = useState<AppState>("hero");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any[]>([]);

  const answerKeys = ["usage", "battery", "budget", "secondary", "platform"];

  const handleStart = () => {
    setState("quiz");
    setStep(0);
    setAnswers({});
  };

  const handleSelect = (id: string) => {
    setAnswers((prev) => ({ ...prev, [answerKeys[step]]: id }));
  };

  const handleNext = async () => {
    if (step < quizSteps.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Submit
      setState("loading");
      try {
        const { data, error } = await supabase.functions.invoke("recommend", {
          body: { answers },
        });
        if (error) throw error;
        setResults(data.recommendations);
        setState("results");
      } catch (e: any) {
        toast.error("Failed to get recommendations. Please try again.");
        setState("quiz");
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else setState("hero");
  };

  if (state === "hero") {
    return <HeroSection onStart={handleStart} />;
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
          <p className="font-mono text-muted-foreground text-sm">Analyzing your preferences...</p>
        </div>
      </div>
    );
  }

  if (state === "results") {
    return <ResultsSection phones={results} onRestart={handleStart} />;
  }

  // Quiz state
  const currentStep = quizSteps[step];
  const currentAnswer = answers[answerKeys[step]] || null;

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full">
          <QuizStep
            question={currentStep.question}
            subtitle={currentStep.subtitle}
            options={currentStep.options}
            selectedId={currentAnswer}
            onSelect={handleSelect}
            step={step}
            totalSteps={quizSteps.length}
          />

          <div className="max-w-2xl mx-auto px-6 mt-8 flex justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono disabled:opacity-30"
            >
              {step === quizSteps.length - 1 ? "Get Results" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
