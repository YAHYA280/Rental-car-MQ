// src/components/dashboard/bookings/types.ts
export interface BookingData {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    image: string;
    whatsappNumber?: string;
    licensePlate?: string;
  };
  dates: {
    pickup: string;
    return: string;
    pickupTime: string;
    returnTime: string;
  };
  locations: {
    pickup: string;
    return: string;
  };
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  totalAmount: number;
  dailyRate: number;
  days: number;
  createdAt: string;
  source: "admin" | "website"; // Track booking source
  notes?: string;
}

export interface BookingFormData {
  customerId: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupLocation: string;
  returnLocation: string;
  notes?: string;
}

export interface CarData {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  available: boolean;
  licensePlate: string;
  whatsappNumber?: string;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}

// Utility functions for booking management
export const calculateDays = (
  pickupDate: string,
  returnDate: string
): number => {
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  const diffTime = Math.abs(returnD.getTime() - pickup.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
};

export const isVehicleAvailable = (
  bookings: BookingData[],
  carId: string,
  pickupDate: string,
  returnDate: string
): boolean => {
  const conflictingBookings = bookings.filter(
    (booking) =>
      booking.car.id === carId &&
      (booking.status === "confirmed" || booking.status === "active") &&
      !(
        new Date(returnDate) <= new Date(booking.dates.pickup) ||
        new Date(pickupDate) >= new Date(booking.dates.return)
      )
  );
  return conflictingBookings.length === 0;
};

export const updateCarAvailability = (
  cars: CarData[],
  bookings: BookingData[]
): CarData[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return cars.map((car) => {
    const activeBooking = bookings.find(
      (booking) =>
        booking.car.id === car.id &&
        (booking.status === "confirmed" || booking.status === "active") &&
        new Date(booking.dates.pickup) <= today &&
        new Date(booking.dates.return) >= today
    );
    return {
      ...car,
      available: !activeBooking,
    };
  });
};
