import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhoneSearchProps {
  onSearch: (query: string) => void;
}

const PhoneSearch = ({ onSearch }: PhoneSearchProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
      <Input
        placeholder="Search phones by name, brand, or model..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-2 top-2"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default PhoneSearch;
