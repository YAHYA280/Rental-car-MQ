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
      gradient: "from-pink-400 to-red-400",
    },
    {
      id: 2,
      name: t("customers.michael.name"),
      role: t("customers.michael.role"),
      rating: 5,
      image: "👨‍🦱",
      testimonial: t("customers.michael.text"),
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      id: 3,
      name: t("customers.emma.name"),
      role: t("customers.emma.role"),
      rating: 5,
      image: "👩‍🎓",
      testimonial: t("customers.emma.text"),
      gradient: "from-green-400 to-emerald-400",
    },
  ];

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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedContainer
              key={testimonial.id}
              delay={index * 0.2}
              className="h-full"
            >
              <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <Quote className="w-full h-full transform rotate-12" />
                </div>

                <CardContent className="p-8 relative">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Quote className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-gray-700 mb-6 leading-relaxed text-lg italic">
                    `&quot;{testimonial.testimonial}`&quot;
                  </blockquote>

                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${testimonial.gradient} flex items-center justify-center text-2xl mr-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
