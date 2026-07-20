import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface Phone {
  id: string;
  brand: string;
  model: string;
  price_usd: number;
  camera_score: number;
  performance_score: number;
  battery_score: number;
  display_score: number;
  build_quality_score: number;
  ram_gb: number;
  storage_gb: number;
  battery_mah: number;
  screen_size_inches: number;
  chipset: string;
  os: string;
  summary: string;
}

interface PhoneComparisonProps {
  phones: Phone[];
  onClose: () => void;
}

const PhoneComparison = ({ phones, onClose }: PhoneComparisonProps) => {
  if (phones.length === 0) return null;

  const chartData = [
    {
      name: "Camera",
      ...phones.reduce((acc, phone) => ({ ...acc, [phone.model]: phone.camera_score }), {}),
    },
    {
      name: "Performance",
      ...phones.reduce((acc, phone) => ({
        ...acc,
        [phone.model]: phone.performance_score,
      }), {}),
    },
    {
      name: "Battery",
      ...phones.reduce((acc, phone) => ({ ...acc, [phone.model]: phone.battery_score }), {}),
    },
    {
      name: "Display",
      ...phones.reduce((acc, phone) => ({ ...acc, [phone.model]: phone.display_score }), {}),
    },
    {
      name: "Build",
      ...phones.reduce((acc, phone) => ({
        ...acc,
        [phone.model]: phone.build_quality_score,
      }), {}),
    },
  ];

  const specs = [
    { label: "Price", key: "price_usd", format: (v: number) => `$${v}` },
    { label: "RAM", key: "ram_gb", format: (v: number) => `${v}GB` },
    { label: "Storage", key: "storage_gb", format: (v: number) => `${v}GB` },
    { label: "Battery", key: "battery_mah", format: (v: number) => `${v}mAh` },
    { label: "Screen Size", key: "screen_size_inches", format: (v: number) => `${v}"` },
    { label: "Chipset", key: "chipset", format: (v: string) => v },
    { label: "OS", key: "os", format: (v: string) => v },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl bg-card rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Phone Comparison</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Scores Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Performance Scores</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              {phones.map((phone, idx) => (
                <Bar key={phone.id} dataKey={phone.model} fill={`hsl(${idx * 60}, 70%, 50%)`} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Specifications Table */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Specifications</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left">Spec</th>
                  {phones.map((phone) => (
                    <th key={phone.id} className="p-3 text-center font-semibold">
                      <div className="font-bold">{phone.brand}</div>
                      <div className="text-sm text-muted-foreground">{phone.model}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, idx) => (
                  <tr
                    key={spec.label}
                    className={idx % 2 === 0 ? "bg-secondary/20" : ""}
                  >
                    <td className="p-3 font-semibold">{spec.label}</td>
                    {phones.map((phone) => (
                      <td key={phone.id} className="p-3 text-center">
                        {spec.format(
                          phone[spec.key as keyof Phone] as any
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {phones.map((phone) => (
            <div key={phone.id} className="bg-secondary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3">
                {phone.brand} {phone.model}
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-green-500 mb-1">Strengths:</p>
                  <ul className="text-sm space-y-1">
                    {phone.camera_score >= 8.5 && <li>• Exceptional camera</li>}
                    {phone.performance_score >= 9 && <li>• Top-tier performance</li>}
                    {phone.battery_score >= 8.5 && <li>• Outstanding battery</li>}
                    {phone.display_score >= 9 && <li>• Stunning display</li>}
                    {phone.build_quality_score >= 9 && <li>• Premium build</li>}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-500 mb-1">Considerations:</p>
                  <ul className="text-sm space-y-1">
                    {phone.price_usd > 1000 && <li>• Premium pricing</li>}
                    {phone.battery_score < 7 && <li>• Battery could be better</li>}
                    {phone.camera_score < 7 && <li>• Camera not primary strength</li>}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onClose} className="w-full">Close Comparison</Button>
      </Card>
    </div>
  );
};

export default PhoneComparison;
