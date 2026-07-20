import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneComparison from "@/components/PhoneComparison";
import phonesData from "@/data/phones.json";

const PhoneComparePage = () => {
  const navigate = useNavigate();
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleSelectPhone = (phoneId: string) => {
    if (selectedPhones.includes(phoneId)) {
      setSelectedPhones(selectedPhones.filter((id) => id !== phoneId));
    } else if (selectedPhones.length < 3) {
      setSelectedPhones([...selectedPhones, phoneId]);
    }
  };

  const selectedPhoneObjects = phonesData.filter((p: any) =>
    selectedPhones.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Compare Phones</h1>
        <p className="text-muted-foreground">Select up to 3 phones to compare side-by-side</p>
      </div>

      {/* Selected Phones */}
      {selectedPhones.length > 0 && (
        <Card className="p-6 mb-6 bg-secondary/20">
          <h2 className="font-semibold mb-3">Selected for Comparison ({selectedPhones.length}/3)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {selectedPhoneObjects.map((phone: any) => (
              <div key={phone.id} className="flex justify-between items-center p-3 bg-background rounded">
                <div>
                  <p className="font-semibold">{phone.brand} {phone.model}</p>
                  <p className="text-sm text-muted-foreground">${phone.price_usd}</p>
                </div>
              </div>
            ))}
          </div>
          {selectedPhones.length > 0 && (
            <Button
              onClick={() => setShowComparison(true)}
              className="w-full"
            >
              Compare Now
            </Button>
          )}
        </Card>
      )}

      {/* Phone List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {phonesData.map((phone: any) => (
          <Card
            key={phone.id}
            className="p-4 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => handleSelectPhone(phone.id)}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedPhones.includes(phone.id)}
                disabled={selectedPhones.length >= 3 && !selectedPhones.includes(phone.id)}
              />
              <div className="flex-1">
                <h3 className="font-semibold">{phone.brand} {phone.model}</h3>
                <p className="text-sm text-muted-foreground mb-3">${phone.price_usd}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Camera</p>
                    <p className="font-semibold">{phone.camera_score}/10</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Performance</p>
                    <p className="font-semibold">{phone.performance_score}/10</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showComparison && (
        <PhoneComparison
          phones={selectedPhoneObjects}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export default PhoneComparePage;
