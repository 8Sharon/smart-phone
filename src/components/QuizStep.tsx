import { cn } from "@/lib/utils";

interface QuizOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

interface QuizStepProps {
  question: string;
  subtitle: string;
  options: QuizOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  step: number;
  totalSteps: number;
}

const QuizStep = ({ question, subtitle, options, selectedId, onSelect, step, totalSteps }: QuizStepProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-500",
              i < step ? "bg-primary" : i === step ? "bg-primary/50" : "bg-border"
            )}
          />
        ))}
        <span className="text-xs font-mono text-muted-foreground ml-2">
          {step + 1}/{totalSteps}
        </span>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold font-mono mb-2 text-foreground">
        {question}
      </h2>
      <p className="text-muted-foreground text-sm mb-8">{subtitle}</p>

      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              "w-full text-left p-5 rounded-xl border transition-all duration-300 group",
              selectedId === option.id
                ? "border-primary bg-primary/10 glow-border"
                : "border-border bg-card/50 hover:border-muted-foreground/30 hover:bg-card"
            )}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <div className={cn(
                  "font-medium font-mono text-sm transition-colors",
                  selectedId === option.id ? "text-primary" : "text-foreground"
                )}>
                  {option.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizStep;
