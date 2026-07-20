import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ArrowLeft, Bookmark, Share2, Download } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { usePhoneReviews, useAverageRating, useAddReview } from "@/hooks/usePhoneReviews";
import { usePricing } from "@/hooks/usePricing";
import { supabase } from "@/integrations/supabase/client";
import { savePhone, removePhone, isPhoneSaved, fetchSavedPhones } from "@/lib/phoneService";
import phonesData from "@/data/phones.json";
import ReviewForm from "./ReviewForm";
import { toast } from "sonner";

const PhoneDetailsPage = () => {
  const { phoneId } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { data: reviews, isLoading: reviewsLoading } = usePhoneReviews(phoneId || "");
  const { data: avgRating } = useAverageRating(phoneId || "");
  const { data: pricing } = usePricing(phoneId || "");
  const addReviewMutation = useAddReview();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const foundPhone = phonesData.find((p: any) => p.id === phoneId);
    setPhone(foundPhone);
  }, [phoneId]);

  useEffect(() => {
    if (user && phoneId) {
      checkIfSaved();
    }
  }, [user, phoneId]);

  const checkIfSaved = async () => {
    if (!user) return;
    const saved = await isPhoneSaved(user.id, phoneId || "");
    setIsSaved(saved);
  };

  const handleSavePhone = async () => {
    if (!user) {
      toast.error("Please log in to save phones");
      return;
    }

    if (isSaved) {
      await removePhone(user.id, phoneId || "");
      setIsSaved(false);
      toast.success("Phone removed from bookmarks");
    } else {
      await savePhone(user.id, phoneId || "");
      setIsSaved(true);
      toast.success("Phone saved to bookmarks");
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/phone/${phoneId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleExportPDF = () => {
    const content = `
      ${phone?.brand} ${phone?.model}
      Price: $${phone?.price_usd}
      
      Camera: ${phone?.camera_score}/10
      Performance: ${phone?.performance_score}/10
      Battery: ${phone?.battery_score}/10
      Display: ${phone?.display_score}/10
      Build: ${phone?.build_quality_score}/10
      
      RAM: ${phone?.ram_gb}GB
      Storage: ${phone?.storage_gb}GB
      Battery: ${phone?.battery_mah}mAh
      Screen: ${phone?.screen_size_inches}"
      Chipset: ${phone?.chipset}
      OS: ${phone?.os}
      
      Summary: ${phone?.summary}
    `;
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", `${phone?.model}-specs.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Specs exported!");
  };

  if (!phone) return <div>Loading...</div>;

  const radarData = [
    { name: "Camera", value: phone.camera_score },
    { name: "Performance", value: phone.performance_score },
    { name: "Battery", value: phone.battery_score },
    { name: "Display", value: phone.display_score },
    { name: "Build", value: phone.build_quality_score },
  ];

  const priceHistoryData = pricing?.map((p: any) => ({
    retailer: p.retailer,
    price: p.price,
  })) || [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {phone.brand} {phone.model}
                </h1>
                <Badge className="mb-4">{phone.os}</Badge>
                <p className="text-muted-foreground">{phone.summary}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary mb-2">${phone.price_usd}</div>
                <div className="flex gap-2">
                  <Button
                    variant={isSaved ? "default" : "outline"}
                    size="sm"
                    onClick={handleSavePhone}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Specs */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">RAM</p>
                <p className="text-xl font-semibold">{phone.ram_gb}GB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Storage</p>
                <p className="text-xl font-semibold">{phone.storage_gb}GB</p>
              </div>
              <div>
                <p className="text-muted-foreground">Battery</p>
                <p className="text-xl font-semibold">{phone.battery_mah}mAh</p>
              </div>
              <div>
                <p className="text-muted-foreground">Screen</p>
                <p className="text-xl font-semibold">{phone.screen_size_inches}"</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Chipset</p>
                <p className="text-xl font-semibold">{phone.chipset}</p>
              </div>
            </div>
          </Card>

          {/* Radar Chart */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Performance Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={90} domain={[0, 10]} />
                <Radar name="Score" dataKey="value" stroke="hsl(160, 90%, 42%)" fill="hsl(160, 90%, 42%)" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Rating */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Rating</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold">{avgRating || "No ratings"}</span>
            </div>
            <p className="text-sm text-muted-foreground">{reviews?.length || 0} reviews</p>
          </Card>

          {/* Pricing */}
          {priceHistoryData.length > 0 && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Pricing</h2>
              <div className="space-y-2">
                {priceHistoryData.map((p: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-sm">{p.retailer}</span>
                    <span className="font-semibold">${p.price}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <Card className="p-6 mt-6">
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            {user && <TabsTrigger value="write">Write Review</TabsTrigger>}
          </TabsList>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {reviews?.map((review: any) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{review.title}</h3>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>
              ))}
              {(!reviews || reviews.length === 0) && (
                <p className="text-muted-foreground">No reviews yet. Be the first!</p>
              )}
            </div>
          </TabsContent>
          {user && (
            <TabsContent value="write" className="mt-4">
              <ReviewForm
                phoneId={phoneId || ""}
                userId={user.id}
                onSuccess={() => {
                  toast.success("Review posted!");
                }}
              />
            </TabsContent>
          )}
        </Tabs>
      </Card>
    </div>
  );
};

export default PhoneDetailsPage;
