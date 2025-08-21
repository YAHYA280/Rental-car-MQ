"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calendar, Clock, Search, RotateCcw } from "lucide-react";

interface SearchFormData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  differentDropoff: boolean;
  driverAge: string;
}

interface CarSearchProps {
  className?: string;
  onSearch?: (data: SearchFormData) => void;
}

const CarSearchComponent: React.FC<CarSearchProps> = ({
  className = "",
  onSearch,
}) => {
  const t = useTranslations("hero");
  const [searchData, setSearchData] = useState<SearchFormData>({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    differentDropoff: false,
    driverAge: "",
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search data:", searchData);
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const handleInputChange = (
    field: keyof SearchFormData,
    value: string | boolean
  ) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate time options
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const ageRanges = [
    { value: "19-20", label: "19-20" },
    { value: "21-24", label: "21-24" },
    { value: "25+", label: "25+" },
  ];

  return (
    <div
      className={`bg-gray-900/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-700 shadow-2xl ${className}`}
    >
      <form onSubmit={handleSearchSubmit} className="space-y-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            Find exactly what you are looking for
          </h3>
        </div>

        {/* Main Search Row */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 bg-white rounded-lg overflow-hidden shadow-lg">
          {/* Pickup Location */}
          <div className="lg:col-span-2 p-4 border-r border-gray-200 lg:border-r">
            <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
              Pick-up office
            </Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Airport, city ..."
                value={searchData.pickupLocation}
                onChange={(e) =>
                  handleInputChange("pickupLocation", e.target.value)
                }
                className="border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 font-medium"
                required
              />
            </div>
          </div>

          {/* Pickup Date */}
          <div className="p-4 border-r border-gray-200 lg:border-r">
            <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
              Pick up
            </Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={searchData.pickupDate}
                onChange={(e) =>
                  handleInputChange("pickupDate", e.target.value)
                }
                className="border-0 p-0 text-gray-900 focus:ring-0 font-medium text-sm"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div className="p-4 border-r border-gray-200 lg:border-r">
            <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
              Time
            </Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <Select
                value={searchData.pickupTime}
                onValueChange={(value) =>
                  handleInputChange("pickupTime", value)
                }
                required
              >
                <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto">
                  <SelectValue placeholder="17:00" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Return Date */}
          <div className="p-4 border-r border-gray-200 lg:border-r">
            <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
              Return
            </Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={searchData.returnDate}
                onChange={(e) =>
                  handleInputChange("returnDate", e.target.value)
                }
                className="border-0 p-0 text-gray-900 focus:ring-0 font-medium text-sm"
                min={
                  searchData.pickupDate ||
                  new Date().toISOString().split("T")[0]
                }
                required
              />
            </div>
          </div>

          {/* Return Time */}
          <div className="p-4 border-r border-gray-200 lg:border-r">
            <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
              Time
            </Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <Select
                value={searchData.returnTime}
                onValueChange={(value) =>
                  handleInputChange("returnTime", value)
                }
                required
              >
                <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto">
                  <SelectValue placeholder="17:00" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <div className="p-2">
            <Button
              type="submit"
              className="w-full h-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search
            </Button>
          </div>
        </div>

        {/* Secondary Options Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-white">
          {/* Return to Different Office Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="different-office"
                checked={searchData.differentDropoff}
                onChange={(e) =>
                  handleInputChange("differentDropoff", e.target.checked)
                }
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 focus:ring-yellow-400 focus:ring-2"
              />
              <label
                htmlFor="different-office"
                className="ml-2 text-sm text-gray-300"
              >
                Return to a different office
              </label>
            </div>
          </div>

          {/* Driver's Age Selection */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Driver's age:</span>
            <div className="flex gap-2">
              {ageRanges.map((age) => (
                <button
                  key={age.value}
                  type="button"
                  onClick={() => handleInputChange("driverAge", age.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    searchData.driverAge === age.value
                      ? age.value === "25+"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
                        : "bg-gray-700 text-white border border-gray-600"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dropoff Location (when different office is selected) */}
        {searchData.differentDropoff && (
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <Label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
              Drop-off office
            </Label>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Airport, city ..."
                value={searchData.dropoffLocation}
                onChange={(e) =>
                  handleInputChange("dropoffLocation", e.target.value)
                }
                className="border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 font-medium"
                required={searchData.differentDropoff}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CarSearchComponent;
