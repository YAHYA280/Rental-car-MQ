"use client";

import React, { useState, useMemo } from "react";
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
  AlertCircle,
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
  const locale = useLocale();
  const router = useRouter();

  const PICKUP_LOCATIONS = [
    "Tangier Airport",
    "Tangier City Center",
    "Tangier Port",
    "Hotel Pickup",
    "Custom Location",
  ];

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
  const [showValidation, setShowValidation] = useState(false);

  // Validation logic
  const validation = useMemo(() => {
    const errors: string[] = [];
    let isValid = true;
    let rentalDays = 0;

    // Check pickup location
    if (!searchData.pickupLocation.trim()) {
      errors.push(
        locale === "fr" ? "Lieu de prise requis" : "Pickup location required"
      );
      isValid = false;
    }

    // Check dates and calculate rental period
    if (!searchData.pickupDate || !searchData.returnDate) {
      errors.push(
        locale === "fr"
          ? "Période de location requise"
          : "Rental period required"
      );
      isValid = false;
    } else {
      const pickupDateObj = new Date(searchData.pickupDate);
      const returnDateObj = new Date(searchData.returnDate);
      const timeDiff = returnDateObj.getTime() - pickupDateObj.getTime();
      rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (rentalDays < 1) {
        errors.push(
          locale === "fr"
            ? "Minimum 1 jour de location"
            : "Minimum 1 day rental"
        );
        isValid = false;
      }
    }

    // Check pickup time
    if (!searchData.pickupTime) {
      errors.push(
        locale === "fr" ? "Heure de prise requise" : "Pickup time required"
      );
      isValid = false;
    }

    // Check return time
    if (!searchData.returnTime) {
      errors.push(
        locale === "fr" ? "Heure de retour requise" : "Return time required"
      );
      isValid = false;
    }

    // Check dropoff location if different location is selected
    if (searchData.differentDropoff && !searchData.dropoffLocation.trim()) {
      errors.push(
        locale === "fr" ? "Lieu de retour requis" : "Dropoff location required"
      );
      isValid = false;
    }

    return {
      isValid,
      errors,
      rentalDays,
    };
  }, [searchData, locale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Show validation if form is invalid
    if (!validation.isValid) {
      setShowValidation(true);
      setTimeout(() => setShowValidation(false), 5000);
      return;
    }

    // Call the optional callback
    if (onSearch) {
      onSearch(searchData);
    }

    // Navigate to vehicles page with search parameters
    const query: Record<string, string> = {};

    // Map search parameters to backend expected format
    if (searchData.pickupLocation) query.pickup = searchData.pickupLocation;
    if (searchData.dropoffLocation) query.dropoff = searchData.dropoffLocation;
    if (searchData.pickupDate) query.pickupDate = searchData.pickupDate;
    if (searchData.pickupTime) query.pickupTime = searchData.pickupTime;
    if (searchData.returnDate) query.returnDate = searchData.returnDate;
    if (searchData.returnTime) query.returnTime = searchData.returnTime;
    if (searchData.differentDropoff) query.differentDropoff = "true";
    if (searchData.driverAge) query.driverAge = searchData.driverAge;

    router.push({
      pathname: "/vehicles",
      query: Object.keys(query).length > 0 ? query : undefined,
    });
  };

  const handleInputChange = (
    field: keyof SearchFormData,
    value: string | boolean
  ) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Hide validation when user starts fixing issues
    if (showValidation) {
      setShowValidation(false);
    }
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      handleInputChange("pickupDate", format(range.from, "yyyy-MM-dd"));
    }
    if (range?.to) {
      handleInputChange("returnDate", format(range.to, "yyyy-MM-dd"));
    }
    // Hide validation when user selects dates
    if (showValidation) {
      setShowValidation(false);
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

  // Validation message component
  const ValidationMessage = () => {
    if (!showValidation || validation.errors.length === 0) return null;

    return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800 mb-1">
              {locale === "fr"
                ? "Veuillez corriger les erreurs suivantes:"
                : "Please fix the following errors:"}
            </p>
            <ul className="text-sm text-red-700 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Search Button Component
  const SearchButton = () => (
    <Button
      type="submit"
      disabled={!validation.isValid}
      className={`w-full font-bold text-lg px-12 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0 flex items-center gap-3 ${
        validation.isValid
          ? "bg-gradient-to-r from-carbookers-red-600 to-carbookers-red-500 hover:from-carbookers-red-700 hover:to-carbookers-red-600 text-white transform hover:scale-105"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      <Search className="h-6 w-6" />
      {t("searchButton")}
      {validation.rentalDays > 0 && validation.isValid && (
        <span className="text-sm opacity-90">
          ({validation.rentalDays} {locale === "fr" ? "jours" : "days"})
        </span>
      )}
    </Button>
  );

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-carbookers-red-950/30 via-carbookers-red-900/20 to-carbookers-red-800/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"></div>

      <div className="relative z-10 p-8">
        <form onSubmit={handleSearchSubmit} className="space-y-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              <span className="text-white">{t("title")}</span>
            </h3>
            <p className="text-gray-200 text-lg opacity-90">{t("subtitle")}</p>
          </div>

          <ValidationMessage />

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="hidden lg:grid lg:grid-cols-4 divide-x divide-gray-200/50">
              <div className="p-6 flex flex-col justify-between h-24">
                <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-2 block font-semibold">
                  {t("pickupLocation")} *
                </Label>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-carbookers-red-600 flex-shrink-0" />
                  <Select
                    value={searchData.pickupLocation}
                    onValueChange={(value) =>
                      handleInputChange("pickupLocation", value)
                    }
                  >
                    <SelectTrigger className="border-0 p-0 text-gray-900 focus:ring-0 font-medium h-auto bg-transparent text-sm w-full">
                      <SelectValue
                        placeholder={t("placeholders.pickupLocation")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PICKUP_LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        !dateRange && "text-gray-500",
                        showValidation &&
                          validation.rentalDays < 1 &&
                          "text-red-600"
                      )}
                    >
                      <CalendarIcon className="h-5 w-5 text-carbookers-red-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-900 font-medium truncate">
                        {getDateRangeText()}
                      </span>
                      {validation.rentalDays > 0 && (
                        <span className="ml-auto text-xs text-gray-500">
                          {validation.rentalDays}{" "}
                          {locale === "fr" ? "jours" : "days"}
                        </span>
                      )}
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
                  {t("pickupTime")} *
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
                  {t("returnTime")} *
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

            <div className="lg:hidden p-6 space-y-6">
              <div>
                <Label className="text-xs text-carbookers-red-800 uppercase tracking-wide mb-3 block font-semibold">
                  {t("pickupLocation")} *
                </Label>
                <div
                  className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-h-[48px] ${
                    showValidation && !searchData.pickupLocation.trim()
                      ? "border border-red-300"
                      : ""
                  }`}
                >
                  <MapPin className="h-5 w-5 text-carbookers-red-600 flex-shrink-0" />
                  <Select
                    value={searchData.pickupLocation}
                    onValueChange={(value) =>
                      handleInputChange("pickupLocation", value)
                    }
                  >
                    <SelectTrigger className="border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 font-medium bg-transparent text-sm w-full min-w-0">
                      <SelectValue
                        placeholder={t("placeholders.pickupLocation")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PICKUP_LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
                        !dateRange && "text-gray-500",
                        showValidation &&
                          validation.rentalDays < 1 &&
                          "border border-red-300"
                      )}
                    >
                      <CalendarIcon className="h-5 w-5 text-carbookers-red-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-900 font-medium text-sm">
                        {getDateRangeText()}
                      </span>
                      {validation.rentalDays > 0 && (
                        <span className="ml-auto text-xs text-gray-500">
                          {validation.rentalDays} {locale === "fr" ? "j" : "d"}
                        </span>
                      )}
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
                    {t("pickupTime")} *
                  </Label>
                  <div
                    className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-h-[48px] ${
                      showValidation && !searchData.pickupTime
                        ? "border border-red-300"
                        : ""
                    }`}
                  >
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
                    {t("returnTime")} *
                  </Label>
                  <div
                    className={`flex items-center gap-2 p-3 bg-gray-50 rounded-lg min-h-[48px] ${
                      showValidation && !searchData.returnTime
                        ? "border border-red-300"
                        : ""
                    }`}
                  >
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
            <SearchButton />
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
                {t("dropoffLocation")} *
              </Label>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-carbookers-red-600" />
                <Select
                  value={searchData.dropoffLocation}
                  onValueChange={(value) =>
                    handleInputChange("dropoffLocation", value)
                  }
                >
                  <SelectTrigger className="border-0 p-0 text-gray-900 placeholder:text-gray-500 focus:ring-0 font-medium bg-transparent">
                    <SelectValue
                      placeholder={t("placeholders.dropoffLocation")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {PICKUP_LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {showValidation &&
                searchData.differentDropoff &&
                !searchData.dropoffLocation.trim() && (
                  <p className="text-xs text-red-600 mt-1">
                    {locale === "fr"
                      ? "Lieu de retour requis"
                      : "Dropoff location required"}
                  </p>
                )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CarSearchComponent;
