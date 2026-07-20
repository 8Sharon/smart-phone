import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export interface Filters {
  usage: string;
  battery: string;
  budget: string;
  secondary: string;
  platform: string;
}

interface QuizProps {
  onComplete: (filters: Filters) => void;
  onCancel: () => void;
}

const QUIZ_STEPS = [
  {
    id: "usage",
    question: "What do you use your phone for most?",
    subtitle: "Pick your primary use case — this shapes our core recommendation.",
    options: [
      { id: "photography", label: "Photography & Video", description: "Social media, vlogging, capturing moments", icon: "📸" },
      { id: "gaming", label: "Gaming & Performance", description: "Heavy games, multitasking, power user", icon: "🎮" },
      { id: "social", label: "Social & Browsing", description: "Social media, messaging, streaming", icon: "💬" },
      { id: "work", label: "Work & Productivity", description: "Email, docs, video calls, business apps", icon: "💼" },
    ],
  },
  {
    id: "battery",
    question: "How important is battery life?",
    subtitle: "Be honest — do you carry a charger everywhere?",
    options: [
      { id: "critical", label: "It's everything", description: "I need all-day battery, no exceptions", icon: "🔋" },
      { id: "important", label: "Pretty important", description: "I want to get through a full day easily", icon: "⚡" },
      { id: "moderate", label: "Moderate", description: "I can top up during the day if needed", icon: "🔌" },
      { id: "low", label: "Not a priority", description: "I'm always near a charger anyway", icon: "🤷" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget range?",
    subtitle: "We'll find the best value within your price bracket.",
    options: [
      { id: "budget", label: "Under $300", description: "Best bang for buck, essential features", icon: "💰" },
      { id: "mid", label: "$300 — $600", description: "Great balance of features and price", icon: "💵" },
      { id: "premium", label: "$600 — $1000", description: "Flagship experience, top-tier specs", icon: "💎" },
      { id: "ultra", label: "$1000+", description: "The absolute best, no compromises", icon: "👑" },
    ],
  },
  {
    id: "secondary",
    question: "What matters most after your primary use?",
    subtitle: "Your secondary priority helps us break ties.",
    options: [
      { id: "display", label: "Beautiful Display", description: "Vivid colors, high refresh rate, bright screen", icon: "🖥️" },
      { id: "build", label: "Premium Build", description: "Metal/glass, water resistance, durability", icon: "🛡️" },
      { id: "camera", label: "Versatile Camera", description: "Wide, ultra-wide, zoom — I want it all", icon: "📷" },
      { id: "value", label: "Best Value", description: "Most features per dollar spent", icon: "🏷️" },
    ],
  },
  {
    id: "platform",
    question: "Any platform preference?",
    subtitle: "Already in an ecosystem? Let us know.",
    options: [
      { id: "android", label: "Android", description: "Customizable, wide variety of choices", icon: "🤖" },
      { id: "ios", label: "iOS (iPhone)", description: "Seamless Apple ecosystem integration", icon: "🍎" },
      { id: "any", label: "No preference", description: "Show me the best regardless of OS", icon: "🌐" },
    ],
  },
];

const Quiz = ({ onComplete, onCancel }: QuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Filters>({
    usage: "",
    battery: "",
    budget: "",
    secondary: "",
    platform: "",
  });

  const step = QUIZ_STEPS[currentStep];
  const isAnswered = answers[step.id as keyof Filters] !== "";
  const isLastStep = currentStep === QUIZ_STEPS.length - 1;

  const handleSelectOption = (optionId: string) => {
    setAnswers({
      ...answers,
      [step.id]: optionId,
    });
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(answers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-card rounded-lg p-6 md:p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold">Find Your Perfect Phone</h2>
            <Badge variant="secondary">{currentStep + 1}/{QUIZ_STEPS.length}</Badge>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / QUIZ_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-2">{step.question}</h3>
          <p className="text-muted-foreground">{step.subtitle}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {step.options.map((option) => (
            <Card
              key={option.id}
              onClick={() => handleSelectOption(option.id)}
              className={`p-4 cursor-pointer transition-all border-2 ${
                answers[step.id as keyof Filters] === option.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{option.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{option.label}</h4>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {answers[step.id as keyof Filters] === option.id && (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1 gap-2"
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Get Recommendations
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;
