// src/components/dashboard/cars/components/CarsTable.tsx - Fixed with unified types
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Settings,
  Phone,
} from "lucide-react";

// Import unified types from the correct location
import { CarData } from "@/components/types";

interface CarsTableProps {
  cars: CarData[];
  onViewDetails: (car: CarData) => void;
  onEditCar: (car: CarData) => void;
  onDeleteCar: (carId: string) => void;
}

const CarsTable: React.FC<CarsTableProps> = ({
  cars,
  onViewDetails,
  onEditCar,
  onDeleteCar,
}) => {
  const t = useTranslations("dashboard");

  const getStatusBadge = (available: boolean) => {
    return available ? (
      <Badge className="bg-green-100 text-green-800">
        {t("cars.statusBadges.available")}
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        {t("cars.statusBadges.rented")}
      </Badge>
    );
  };

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType.toLowerCase()) {
      case "electric":
        return "⚡";
      case "hybrid":
        return "🔋";
      default:
        return "⛽";
    }
  };

  // FIXED: Get proper image URL using unified types
  const getImageUrl = (car: CarData) => {
    // Priority: mainImage dataUrl > image field > fallback
    if (car.mainImage?.dataUrl) {
      return car.mainImage.dataUrl;
    }
    if (car.image) {
      return car.image.startsWith("http")
        ? car.image
        : car.image.startsWith("data:")
        ? car.image // Already a data URL
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${
            car.image
          }`;
    }
    return "/cars/car1.jpg"; // Fallback placeholder
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("cars.table.car")}</TableHead>
          <TableHead>{t("cars.table.details")}</TableHead>
          <TableHead>{t("cars.table.pricing")}</TableHead>
          <TableHead>{t("cars.table.caution")}</TableHead>
          <TableHead>WhatsApp</TableHead>
          <TableHead>{t("cars.table.status")}</TableHead>
          <TableHead>{t("cars.table.lastTechnicalVisit")}</TableHead>
          <TableHead>{t("cars.table.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 relative rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(car)}
                    alt={`${car.brand} ${car.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/cars/car1.jpg";
                    }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {car.brand} {car.name}
                  </p>
                  <p className="text-sm text-gray-600">{car.year}</p>
                  <p className="text-xs text-gray-500">{car.licensePlate}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  {car.seats} {t("cars.table.seats")}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{getFuelIcon(car.fuelType)}</span>
                  {car.fuelType}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Settings className="h-4 w-4" />
                  {car.transmission}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <p className="font-semibold text-gray-900">€{car.price}</p>
              <p className="text-sm text-gray-600">{t("cars.table.perDay")}</p>
            </TableCell>
            <TableCell>
              <p className="font-semibold text-gray-900">€{car.caution}</p>
              <p className="text-sm text-gray-600">{t("cars.table.deposit")}</p>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Phone className="h-4 w-4" />
                <a
                  href={`https://wa.me/${car.whatsappNumber?.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {car.whatsappNumber}
                </a>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(car.available)}</TableCell>
            <TableCell>
              <p className="text-sm text-gray-600">
                {car.lastTechnicalVisit
                  ? new Date(car.lastTechnicalVisit).toLocaleDateString()
                  : "N/A"}
              </p>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("common.actions")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewDetails(car)}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t("cars.actions.viewDetails")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditCar(car)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("cars.actions.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDeleteCar(car.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("cars.actions.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CarsTable;
