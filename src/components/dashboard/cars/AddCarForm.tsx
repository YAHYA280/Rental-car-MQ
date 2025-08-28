// src/components/dashboard/cars/AddCarForm.tsx
"use client";

import React, { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus } from "lucide-react";

interface AddCarFormProps {
  onClose: () => void;
}

const AddCarForm: React.FC<AddCarFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    transmission: "",
    fuelType: "",
    seats: "",
    doors: "",
    location: "",
    description: "",
    mileage: "",
    features: [] as string[],
  });

  const [newFeature, setNewFeature] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const brands = [
    "Cupra",
    "Dacia",
    "Hyundai",
    "KIA",
    "Mercedes",
    "Opel",
    "Peugeot",
    "Porsche",
    "Renault",
    "SEAT",
    "Volkswagen",
  ];

  const transmissionTypes = ["Manual", "Automatic"];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const seatOptions = ["2", "4", "5", "7", "8+"];
  const doorOptions = ["2", "3", "4", "5"];
  const locations = ["Tangier Airport", "Tangier City Center"];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) => handleInputChange("brand", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Car Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Formentor"
                required
              />
            </div>

            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="e.g., Formentor Sport"
                required
              />
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                placeholder="2024"
                min="2000"
                max="2025"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transmission">Transmission *</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value) =>
                  handleInputChange("transmission", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <Select
                value={formData.fuelType}
                onValueChange={(value) => handleInputChange("fuelType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="seats">Number of Seats *</Label>
              <Select
                value={formData.seats}
                onValueChange={(value) => handleInputChange("seats", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seats" />
                </SelectTrigger>
                <SelectContent>
                  {seatOptions.map((seats) => (
                    <SelectItem key={seats} value={seats}>
                      {seats}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="doors">Number of Doors *</Label>
              <Select
                value={formData.doors}
                onValueChange={(value) => handleInputChange("doors", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doors" />
                </SelectTrigger>
                <SelectContent>
                  {doorOptions.map((doors) => (
                    <SelectItem key={doors} value={doors}>
                      {doors}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange("mileage", e.target.value)}
                placeholder="15000"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing and Location */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Pricing & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Daily Rate (€) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="85"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleInputChange("location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature (e.g., GPS Navigation)"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Description</h3>
          <div>
            <Label htmlFor="description">Car Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the car, its features, and what makes it special..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carbookers-red-600 focus:border-carbookers-red-600 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Upload (Placeholder) */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Images</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload car images</p>
            <p className="text-sm text-gray-500">
              Drag and drop images here, or click to browse
            </p>
            <Button type="button" variant="outline" className="mt-4">
              Choose Images
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-carbookers-red-600 hover:bg-carbookers-red-700"
        >
          Add Car to Fleet
        </Button>
      </div>
    </form>
  );
};

export default AddCarForm;
