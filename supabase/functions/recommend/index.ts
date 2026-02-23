import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Answers {
  usage: string;
  battery: string;
  budget: string;
  secondary: string;
  platform: string;
}

function getBudgetRange(budget: string): [number, number] {
  switch (budget) {
    case 'budget': return [0, 300];
    case 'mid': return [300, 600];
    case 'premium': return [600, 1000];
    case 'ultra': return [1000, 9999];
    default: return [0, 9999];
  }
}

function getWeights(usage: string, battery: string, secondary: string) {
  // Base weights
  const w = { camera: 1, performance: 1, battery: 1, display: 1, build: 1 };

  // Primary usage
  switch (usage) {
    case 'photography': w.camera = 3; break;
    case 'gaming': w.performance = 3; break;
    case 'social': w.camera = 2; w.display = 1.5; break;
    case 'work': w.performance = 2; w.build = 1.5; break;
  }

  // Battery priority
  switch (battery) {
    case 'critical': w.battery = 3; break;
    case 'important': w.battery = 2; break;
    case 'moderate': w.battery = 1.2; break;
    case 'low': w.battery = 0.5; break;
  }

  // Secondary priority
  switch (secondary) {
    case 'display': w.display += 1.5; break;
    case 'build': w.build += 1.5; break;
    case 'camera': w.camera += 1.5; break;
    case 'value': break; // handled separately
  }

  return w;
}

function generateJustification(phone: any, usage: string, secondary: string, rank: number): string {
  const strengths: string[] = [];
  if (phone.camera_score >= 8.5) strengths.push("exceptional camera");
  if (phone.performance_score >= 9) strengths.push("top-tier performance");
  if (phone.battery_score >= 8.5) strengths.push("outstanding battery life");
  if (phone.display_score >= 9) strengths.push("stunning display");
  if (phone.build_quality_score >= 9) strengths.push("premium build quality");

  const top = strengths.slice(0, 2).join(" and ");
  if (rank === 0) return `Best overall match for your needs. Features ${top || "a great balance of features"} at its price point.`;
  if (rank === 1) return `Strong alternative with ${top || "solid all-around specs"}. Worth considering if availability or preference differs.`;
  return `Great value pick offering ${top || "reliable everyday performance"} at a competitive price.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers }: { answers: Answers } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get all phones
    const { data: phones, error } = await supabase
      .from('phones')
      .select('*');

    if (error) throw error;

    const [minPrice, maxPrice] = getBudgetRange(answers.budget);
    const weights = getWeights(answers.usage, answers.battery, answers.secondary);
    const totalWeight = weights.camera + weights.performance + weights.battery + weights.display + weights.build;

    // Filter by platform
    let filtered = phones || [];
    if (answers.platform === 'ios') {
      filtered = filtered.filter(p => p.os === 'iOS');
    } else if (answers.platform === 'android') {
      filtered = filtered.filter(p => p.os === 'Android');
    }

    // Filter by budget (with some flexibility — include phones 10% below min)
    filtered = filtered.filter(p => p.price_usd >= minPrice * 0.9 && p.price_usd <= maxPrice * 1.05);

    // Score each phone
    const scored = filtered.map(phone => {
      const rawScore = (
        phone.camera_score * weights.camera +
        phone.performance_score * weights.performance +
        phone.battery_score * weights.battery +
        phone.display_score * weights.display +
        phone.build_quality_score * weights.build
      ) / totalWeight;

      // Value bonus for "value" secondary priority
      let valueBonus = 0;
      if (answers.secondary === 'value') {
        const avgScore = (phone.camera_score + phone.performance_score + phone.battery_score + phone.display_score + phone.build_quality_score) / 5;
        valueBonus = (avgScore / (phone.price_usd / 100)) * 2;
      }

      const match_score = Math.min(99, ((rawScore + valueBonus) / 10) * 100);

      return { ...phone, match_score };
    });

    // Sort and return all matched phones ranked
    scored.sort((a, b) => b.match_score - a.match_score);
    const top3 = scored.map((phone, i) => ({
      ...phone,
      justification: generateJustification(phone, answers.usage, answers.secondary, i),
    }));

    return new Response(JSON.stringify({ recommendations: top3 }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
