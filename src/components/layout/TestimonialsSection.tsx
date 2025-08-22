"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import AnimatedContainer from "@/components/ui/animated-container";

const TestimonialsSection = () => {
  const t = useTranslations("testimonials");

  const testimonials = [
    {
      id: 1,
      name: t("customers.sarah.name"),
      role: t("customers.sarah.role"),
      rating: 5,
      image: "👩‍💼",
      testimonial: t("customers.sarah.text"),
      initial: "S",
    },
    {
      id: 2,
      name: t("customers.michael.name"),
      role: t("customers.michael.role"),
      rating: 5,
      image: "👨‍🦱",
      testimonial: t("customers.michael.text"),
      initial: "M",
    },
    {
      id: 3,
      name: t("customers.emma.name"),
      role: t("customers.emma.role"),
      rating: 5,
      image: "👩‍🎓",
      testimonial: t("customers.emma.text"),
      initial: "E",
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      role: "Travel Photographer",
      rating: 5,
      image: "👨‍💻",
      testimonial:
        "Exceptional service from start to finish. The vehicle was pristine and the rental process was incredibly smooth.",
      initial: "A",
    },
    {
      id: 5,
      name: "Fatima Al-Zahra",
      role: "Business Owner",
      rating: 4,
      image: "👩‍💼",
      testimonial:
        "Great selection of cars and competitive prices. The staff was very helpful in finding the perfect vehicle for my needs.",
      initial: "F",
    },
    {
      id: 6,
      name: "Omar Benali",
      role: "Tour Guide",
      rating: 5,
      image: "👨‍🎓",
      testimonial:
        "I've used many rental services, but this one stands out. Professional, reliable, and excellent customer support.",
      initial: "O",
    },
    {
      id: 7,
      name: "Yasmine Cherkaoui",
      role: "Marketing Manager",
      rating: 5,
      image: "👩‍🎨",
      testimonial:
        "The luxury cars are in perfect condition and the booking process is so easy. Highly recommend for special occasions.",
      initial: "Y",
    },
    {
      id: 8,
      name: "Karim Sedki",
      role: "Event Planner",
      rating: 4,
      image: "👨‍💼",
      testimonial:
        "Excellent fleet quality and punctual service. They made our corporate event transportation seamless and professional.",
      initial: "K",
    },
    {
      id: 9,
      name: "Laila Moussaoui",
      role: "Architect",
      rating: 5,
      image: "👩‍🔬",
      testimonial:
        "Premium service at reasonable prices. The vehicles are well-maintained and the team is always responsive to requests.",
      initial: "L",
    },
    {
      id: 10,
      name: "Youssef Tazi",
      role: "Film Director",
      rating: 5,
      image: "🎬",
      testimonial:
        "Outstanding experience for our film production. The cars looked amazing on camera and the service was flawless.",
      initial: "T",
    },
    {
      id: 11,
      name: "Nadia Alaoui",
      role: "Wedding Planner",
      rating: 5,
      image: "👰‍♀️",
      testimonial:
        "Perfect for weddings! The luxury fleet made our special day even more memorable. Professional drivers and immaculate vehicles.",
      initial: "N",
    },
    {
      id: 12,
      name: "Rachid Bennani",
      role: "Corporate Executive",
      rating: 5,
      image: "👨‍💼",
      testimonial:
        "Reliable partner for all our business trips. The premium service and attention to detail sets them apart from competitors.",
      initial: "R",
    },
    {
      id: 13,
      name: "Salma Idrissi",
      role: "Fashion Designer",
      rating: 4,
      image: "👩‍🎨",
      testimonial:
        "Stylish cars that complement any occasion. The booking app is user-friendly and customer service is top-notch.",
      initial: "S",
    },
    {
      id: 14,
      name: "Mehdi Ouali",
      role: "Tech Entrepreneur",
      rating: 5,
      image: "👨‍💻",
      testimonial:
        "Innovation meets luxury! The digital experience is seamless and the vehicle quality exceeds expectations every time.",
      initial: "M",
    },
    {
      id: 15,
      name: "Amina Zerouali",
      role: "Real Estate Agent",
      rating: 5,
      image: "🏢",
      testimonial:
        "Impressed my clients with the premium vehicles. Professional service that helps me maintain my reputation for excellence.",
      initial: "A",
    },
  ];

  // Duplicate testimonials for infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedContainer direction="down" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedContainer>

        {/* Testimonials Infinite Scroll */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-responsive gap-6">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-80"
              >
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative border-0">
                  {/* Half Black, Half Red Border */}
                  <div className="absolute inset-0 p-[2px] bg-gradient-to-r from-black via-black to-carbookers-red-600 rounded-xl">
                    <div className="h-full w-full bg-white rounded-[10px]"></div>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                    <Quote className="w-full h-full transform rotate-12" />
                  </div>

                  <CardContent className="p-6 relative z-10">
                    {/* Horizontal layout: Quote icon and content */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Quote Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-carbookers-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Quote className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center ml-auto">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-gray-700 mb-4 leading-relaxed text-sm">
                      &quot;{testimonial.testimonial} &quot;
                    </blockquote>

                    {/* Author Info - Horizontal layout */}
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center text-sm font-bold text-gray-700 group-hover:scale-110 transition-transform duration-300">
                          {testimonial.initial}
                        </div>
                      </div>

                      {/* Name and Role */}
                      <div className="flex-grow min-w-0">
                        <div className="font-bold text-gray-900 text-sm truncate">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600 text-xs truncate">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-animation {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-responsive {
          animation: scroll-animation 5s linear infinite;
        }

        .animate-scroll-responsive:hover {
          animation-play-state: paused;
        }

        /* Desktop - 35s duration */
        @media (min-width: 768px) {
          .animate-scroll-responsive {
            animation: scroll-animation 35s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
