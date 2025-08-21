import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CarBookers - Premium Car Rental Service",
  description:
    "Premium car rental service in Morocco. Rent luxury and economy cars with the best rates.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
