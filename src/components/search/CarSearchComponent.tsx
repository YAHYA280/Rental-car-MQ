// src/components/search/CarSearchComponent.tsx - Fixed interface
"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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

// Fixed interface - added the missing compact prop
interface CarSearchProps {
  className?: string;
  onSearch?: (data: SearchFormData) => void;
  compact?: boolean; // This was missing - now added
}

const CarSearchComponent: React.FC<CarSearchProps> = ({
  className = "",
  onSearch,
  compact = false,
}) => {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();

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

    // Create URL parameters for the vehicles page
    const params = new URLSearchParams();
    if (searchData.pickupLocation)
      params.set("pickup", searchData.pickupLocation);
    if (searchData.dropoffLocation)
      params.set("dropoff", searchData.dropoffLocation);
    if (searchData.pickupDate) params.set("pickupDate", searchData.pickupDate);
    if (searchData.pickupTime) params.set("pickupTime", searchData.pickupTime);
    if (searchData.returnDate) params.set("returnDate", searchData.returnDate);
    if (searchData.returnTime) params.set("returnTime", searchData.returnTime);
    if (searchData.differentDropoff) params.set("differentDropoff", "true");
    if (searchData.driverAge) params.set("driverAge", searchData.driverAge);

    // Call the optional callback
    if (onSearch) {
      onSearch(searchData);
    }

    // Navigate to vehicles page with search parameters (only if not compact)
    if (!compact) {
      const queryString = params.toString();
      router.push(`/vehicles${queryString ? `?${queryString}` : ""}`);
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
    return t("selectPeriod");
  };

  // Compact version for vehicle detail page
  if (compact) {
    return (
      <div className={`bg-gray-50 rounded-xl p-4 ${className}`}>
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {/* Pickup Location */}
            <div>
              <Label className="text-xs font-medium mb-1 block">
                {t("pickupLocation")}
              </Label>
              <div className="flex items-center gap-2 p-2 bg-white rounded-md border">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Input
                  type="text"
                  placeholder={t("placeholders.pickupLocation")}
                  value={searchData.pickupLocation}
                  onChange={(e) =>
                    handleInputChange("pickupLocation", e.target.value)
                  }
                  className="border-0 p-0 text-sm"
                  required
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <Label className="text-xs font-medium mb-1 block">
                {t("rentalPeriod")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal p-2 h-auto"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{getDateRangeText()}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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

            {/* Times */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-medium mb-1 block">
                  {t("pickupTime")}
                </Label>
                <Select
                  value={searchData.pickupTime}
                  onValueChange={(value) =>
                    handleInputChange("pickupTime", value)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={t("placeholders.selectTime")} />
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
              <div>
                <Label className="text-xs font-medium mb-1 block">
                  {t("returnTime")}
                </Label>
                <Select
                  value={searchData.returnTime}
                  onValueChange={(value) =>
                    handleInputChange("returnTime", value)
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder={t("placeholders.selectTime")} />
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

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full bg-carbookers-red-600 hover:bg-carbookers-red-700 text-white"
          >
            <Search className="h-4 w-4 mr-2" />
            {t("searchButton")}
          </Button>
        </form>
      </div>
    );
  }

  // Full version for hero section
  return (
    <div className={`relative ${className}`}>
      {/* Glass Morphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-carbookers-red-950/30 via-carbookers-red-900/20 to-carbookers-red-800/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"></div>

      <div className="relative z-10 p-8">
        <form onSubmit={handleSearchSubmit} className="space-y-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              <span className="text-white">{t("title")}</span>
            </h3>
            <p className="text-gray-200 text-lg opacity-90">{t("subtitle")}</p>
          </div>

          {/* Main Search Container */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-4 divide-x divide-gray-200/50">
              {/* Pickup Location */}
              <div className="p-6 flex flex-col justify-between h-24">
                <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-2 block font-semibold">
                  {t("pickupLocation")}
                </Label>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-carbookers-red-600 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder={t("placeholders.pickupLocation")}
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
                <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-2 block font-semibold">
                  {t("rentalPeriod")}
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
                      <CalendarIcon className="h-5 w-5 text-carbookers-red-600 mr-3 flex-shrink-0" />
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
                <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-2 block font-semibold">
                  {t("pickupTime")}
                </Label>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-carbookers-red-600 flex-shrink-0" />
                  <Select
                    value={searchData.pickupTime}
                    onValueChange={(value) =>
                      handleInputChange("pickupTime", value)
                    }
                  >
                    <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full">
                      <SelectValue placeholder={t("placeholders.selectTime")} />
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
                <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-2 block font-semibold">
                  {t("returnTime")}
                </Label>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-carbookers-red-600 flex-shrink-0" />
                  <Select
                    value={searchData.returnTime}
                    onValueChange={(value) =>
                      handleInputChange("returnTime", value)
                    }
                  >
                    <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full">
                      <SelectValue placeholder={t("placeholders.selectTime")} />
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
                <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-3 block font-semibold">
                  {t("pickupLocation")}
                </Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-h-[48px]">
                  <MapPin className="h-5 w-5 text-carbookers-red-600 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder={t("placeholders.pickupLocation")}
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
                <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-3 block font-semibold">
                  {t("rentalPeriod")}
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
                      <CalendarIcon className="h-5 w-5 text-carbookers-red-600 mr-3 flex-shrink-0" />
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
                  <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-3 block font-semibold">
                    {t("pickupTime")}
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-h-[48px]">
                    <Clock className="h-4 w-4 text-carbookers-red-600 flex-shrink-0" />
                    <Select
                      value={searchData.pickupTime}
                      onValueChange={(value) =>
                        handleInputChange("pickupTime", value)
                      }
                    >
                      <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full min-w-0">
                        <SelectValue
                          placeholder={t("placeholders.selectTime")}
                        />
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
                  <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-3 block font-semibold">
                    {t("returnTime")}
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-h-[48px]">
                    <Clock className="h-4 w-4 text-carbookers-red-600 flex-shrink-0" />
                    <Select
                      value={searchData.returnTime}
                      onValueChange={(value) =>
                        handleInputChange("returnTime", value)
                      }
                    >
                      <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full min-w-0">
                        <SelectValue
                          placeholder={t("placeholders.selectTime")}
                        />
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
              className="bg-gradient-to-r from-carbookers-red-600 to-carbookers-red-500 hover:from-carbookers-red-700 hover:to-carbookers-red-600 text-white font-bold text-lg px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 flex items-center gap-3"
            >
              <Search className="h-6 w-6" />
              {t("searchButton")}
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
                className="w-5 h-5 rounded bg-white/20 border-white/30 text-carbookers-red-600 focus:ring-carbookers-red-600 focus:ring-2"
              />
              <label
                htmlFor="different-office"
                className="text-sm text-gray-200 font-medium cursor-pointer"
              >
                {t("differentDropoff")}
              </label>
            </div>

            {/* Driver's Age Selection */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-sm text-gray-200 font-medium">
                {t("driverAge")}:
              </span>
              <div className="flex gap-2">
                {ageRanges.map((age) => (
                  <button
                    key={age.value}
                    type="button"
                    onClick={() => handleInputChange("driverAge", age.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      searchData.driverAge === age.value
                        ? "bg-gradient-to-r from-carbookers-red-700 to-carbookers-red-600 text-white shadow-lg"
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
              <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-3 block font-semibold">
                {t("dropoffLocation")}
              </Label>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-carbookers-red-600" />
                <Input
                  type="text"
                  placeholder={t("placeholders.dropoffLocation")}
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
