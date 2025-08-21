"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Search,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

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
  const t = useTranslations("search");
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

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

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

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      handleInputChange("pickupDate", format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      handleInputChange("returnDate", format(range.to, "yyyy-MM-dd"));
    }
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const ageRanges = [
    { value: "19-20", label: "19-20" },
    { value: "21-24", label: "21-24" },
    { value: "25+", label: "25+" },
  ];

  const getDateRangeText = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, "MMM dd")} - ${format(
        dateRange.to,
        "MMM dd, yyyy"
      )}`;
    } else if (dateRange?.from) {
      return format(dateRange.from, "MMM dd, yyyy");
    }
    return t("selectPeriod") || "Select dates";
  };

  return (
    <div className={`relative ${className}`}>
      {/* Glass Morphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3D0000]/20 via-[#950101]/10 to-[#FF0000]/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"></div>

      <div className="relative z-10 p-8">
        <form onSubmit={handleSearchSubmit} className="space-y-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              <span className="text-white">Find Your Perfect</span>{" "}
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Rental Car
              </span>
            </h3>
            <p className="text-gray-200 text-lg opacity-90">
              Choose from our premium fleet
            </p>
          </div>

          {/* Main Search Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-4 divide-x divide-gray-200/50">
              {/* Pickup Location */}
              <div className="p-6 flex flex-col justify-between h-24">
                <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-2 block font-semibold">
                  Pickup Location
                </Label>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#950101] flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Enter pickup location"
                    value={searchData.pickupLocation}
                    onChange={(e) =>
                      handleInputChange("pickupLocation", e.target.value)
                    }
                    className="border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 font-medium bg-transparent text-sm w-full"
                    required
                  />
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="p-6 flex flex-col justify-between h-24">
                <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-2 block font-semibold">
                  Rental Period
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-medium p-0 h-auto bg-transparent hover:bg-gray-50 text-sm",
                        !dateRange && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="h-5 w-5 text-[#950101] mr-3 flex-shrink-0" />
                      <span className="text-gray-900 font-medium truncate">
                        {getDateRangeText()}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Pickup Time */}
              <div className="p-6 flex flex-col justify-between h-24">
                <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-2 block font-semibold">
                  Pickup Time
                </Label>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#950101] flex-shrink-0" />
                  <Select
                    value={searchData.pickupTime}
                    onValueChange={(value) =>
                      handleInputChange("pickupTime", value)
                    }
                  >
                    <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full">
                      <SelectValue placeholder="Select time" />
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

              {/* Return Time */}
              <div className="p-6 flex flex-col justify-between h-24">
                <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-2 block font-semibold">
                  Return Time
                </Label>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#950101] flex-shrink-0" />
                  <Select
                    value={searchData.returnTime}
                    onValueChange={(value) =>
                      handleInputChange("returnTime", value)
                    }
                  >
                    <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full">
                      <SelectValue placeholder="Select time" />
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
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden p-6 space-y-6">
              {/* Pickup Location */}
              <div>
                <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-3 block font-semibold">
                  Pickup Location
                </Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-h-[48px]">
                  <MapPin className="h-5 w-5 text-[#950101] flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Enter pickup location"
                    value={searchData.pickupLocation}
                    onChange={(e) =>
                      handleInputChange("pickupLocation", e.target.value)
                    }
                    className="border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 font-medium bg-transparent text-sm w-full min-w-0"
                    required
                  />
                </div>
              </div>

              {/* Date Range Picker - Mobile */}
              <div>
                <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-3 block font-semibold">
                  Rental Period
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left font-medium p-3 bg-gray-50 rounded-lg min-h-[48px] hover:bg-gray-100 transition-colors",
                        !dateRange && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="h-5 w-5 text-[#950101] mr-3 flex-shrink-0" />
                      <span className="text-gray-900 font-medium text-sm">
                        {getDateRangeText()}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={1}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Pickup Time */}
                <div>
                  <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-3 block font-semibold">
                    Pickup Time
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-h-[48px]">
                    <Clock className="h-4 w-4 text-[#950101] flex-shrink-0" />
                    <Select
                      value={searchData.pickupTime}
                      onValueChange={(value) =>
                        handleInputChange("pickupTime", value)
                      }
                    >
                      <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full min-w-0">
                        <SelectValue placeholder="Time" />
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

                {/* Return Time */}
                <div>
                  <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-3 block font-semibold">
                    Return Time
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-h-[48px]">
                    <Clock className="h-4 w-4 text-[#950101] flex-shrink-0" />
                    <Select
                      value={searchData.returnTime}
                      onValueChange={(value) =>
                        handleInputChange("returnTime", value)
                      }
                    >
                      <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full min-w-0">
                        <SelectValue placeholder="Time" />
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
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-gradient-to-r from-red-600 via-[#950101] to-[#FF0000] hover:from-[#950101] hover:via-[#FF0000] hover:to-[#3D0000] text-white font-bold text-lg px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
            >
              <Search className="h-6 w-6" />
              Search Cars
            </Button>
          </div>

          {/* Secondary Options */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-white">
            {/* Return to Different Office Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="different-office"
                checked={searchData.differentDropoff}
                onChange={(e) =>
                  handleInputChange("differentDropoff", e.target.checked)
                }
                className="w-5 h-5 rounded bg-white/20 border-white/30 text-[#FF0000] focus:ring-[#FF0000] focus:ring-2"
              />
              <label
                htmlFor="different-office"
                className="text-sm text-gray-200 font-medium cursor-pointer"
              >
                Return to different location
              </label>
            </div>

            {/* Driver's Age Selection */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-sm text-gray-200 font-medium">
                Driver Age:
              </span>
              <div className="flex gap-2">
                {ageRanges.map((age) => (
                  <button
                    key={age.value}
                    type="button"
                    onClick={() => handleInputChange("driverAge", age.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      searchData.driverAge === age.value
                        ? "bg-gradient-to-r from-[#3D0000] to-[#950101] text-white shadow-lg"
                        : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
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
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <Label className="text-xs text-[#3D0000] uppercase tracking-wide mb-3 block font-semibold">
                Return Location
              </Label>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-[#950101]" />
                <Input
                  type="text"
                  placeholder="Enter return location"
                  value={searchData.dropoffLocation}
                  onChange={(e) =>
                    handleInputChange("dropoffLocation", e.target.value)
                  }
                  className="border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 font-medium bg-transparent"
                  required={searchData.differentDropoff}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CarSearchComponent;
