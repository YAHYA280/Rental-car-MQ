"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail } from "lucide-react";
import AnimatedContainer from "@/components/ui/animated-container";

const CTASection = () => {
  const t = useTranslations("cta");
  const tNewsletter = useTranslations("newsletter");
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <section className="relative py-20 bg-black text-white overflow-hidden">
      {/* Background Car Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23000" width="1200" height="600"/><path d="M100 400 Q300 350 500 400 T900 400" stroke="%23333" stroke-width="2" fill="none"/><rect x="200" y="380" width="120" height="40" rx="20" fill="%23444"/><rect x="700" y="380" width="120" height="40" rx="20" fill="%23444"/><ellipse cx="240" cy="420" rx="25" ry="25" fill="%23666"/><ellipse cx="280" cy="420" rx="25" ry="25" fill="%23666"/><ellipse cx="740" cy="420" rx="25" ry="25" fill="%23666"/><ellipse cx="780" cy="420" rx="25" ry="25" fill="%23666"/></svg>')`,
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - CTA Content */}
          <div className="space-y-8">
            <AnimatedContainer direction="left">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                {t("title")}
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                {t("subtitle")}
              </p>
            </AnimatedContainer>

            <AnimatedContainer direction="left" delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4 text-lg"
                >
                  {t("browseVehicles")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg"
                >
                  {t("contactUs")}
                </Button>
              </div>
            </AnimatedContainer>

            {/* Contact Info */}
            <AnimatedContainer direction="left" delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg">{t("phone")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-lg">{t("email")}</span>
                </div>
              </div>
            </AnimatedContainer>
          </div>

          {/* Right Side - Newsletter */}
          <div className="lg:pl-12">
            <AnimatedContainer direction="right">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-4">
                  {tNewsletter("title")}
                </h3>
                <p className="text-gray-300 mb-6">{tNewsletter("subtitle")}</p>

                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder={tNewsletter("placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 flex-1"
                      required
                    />
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-semibold"
                    >
                      {tNewsletter("subscribe")}
                    </Button>
                  </div>
                </form>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
