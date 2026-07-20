import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { updateUserPreferences, getUserPreferences, fetchSavedPhones } from "@/lib/phoneService";
import { toast } from "sonner";
import SavedRecommendations from "./SavedRecommendations";
import phonesData from "@/data/phones.json";

interface UserProfileProps {
  userId: string;
  onClose: () => void;
}

const UserProfile = ({ userId, onClose }: UserProfileProps) => {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [savedPhones, setSavedPhones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    const prefs = await getUserPreferences(userId);
    setTheme(prefs.theme || "dark");
    setLanguage(prefs.language || "en");

    const savedIds = await fetchSavedPhones(userId);
    const saved = phonesData.filter((p: any) => savedIds.includes(p.id));
    setSavedPhones(saved);
    setLoading(false);
  };

  const handleSavePreferences = async () => {
    const success = await updateUserPreferences(userId, theme, language);
    if (success) {
      toast.success("Preferences saved!");
    } else {
      toast.error("Failed to save preferences");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-card rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Account Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="saved">Saved Phones</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Theme</label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSavePreferences} className="w-full">
              Save Preferences
            </Button>
          </TabsContent>

          <TabsContent value="saved" className="mt-4">
            {loading ? (
              <p>Loading...</p>
            ) : savedPhones.length === 0 ? (
              <p className="text-muted-foreground">No saved phones yet</p>
            ) : (
              <div className="space-y-2">
                {savedPhones.map((phone: any) => (
                  <div key={phone.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                    <div>
                      <p className="font-semibold">{phone.brand} {phone.model}</p>
                      <p className="text-sm text-muted-foreground">${phone.price_usd}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <SavedRecommendations userId={userId} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile;
