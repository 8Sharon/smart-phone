export const quizSteps = [
  {
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
    question: "Any platform preference?",
    subtitle: "Already in an ecosystem? Let us know.",
    options: [
      { id: "android", label: "Android", description: "Customizable, wide variety of choices", icon: "🤖" },
      { id: "ios", label: "iOS (iPhone)", description: "Seamless Apple ecosystem integration", icon: "🍎" },
      { id: "any", label: "No preference", description: "Show me the best regardless of OS", icon: "🌐" },
    ],
  },
];
