// src/components/about/ContactMapSection.tsx
"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedContainer from "@/components/ui/animated-container";
import { MapPin, Phone, Clock, MessageCircle, Mail, User } from "lucide-react";

const ContactMapSection = () => {
  const t = useTranslations("aboutPage");
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coordinates for Tangier location: 35°45'04.5"N 5°49'50.2"W
  const latitude = 35.75125;
  const longitude = -5.830611;
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.123456789!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ1JzA0LjUiTiA1wrA0OSc1MC4yIlc!5e0!3m2!1sen!2sma!4v1642123456789!5m2!1sen!2sma`;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWhatsAppSubmit = () => {
    const message = `${locale === "fr" ? "Bonjour" : "Hello"}! 

${locale === "fr" ? "Nom" : "Name"}: ${formData.name}
${locale === "fr" ? "Email" : "Email"}: ${formData.email}
${locale === "fr" ? "Téléphone" : "Phone"}: ${formData.phone}
${locale === "fr" ? "Sujet" : "Subject"}: ${formData.subject}

${locale === "fr" ? "Message" : "Message"}: ${formData.message}

${locale === "fr" ? "Merci de me contacter!" : "Thank you for contacting me!"}`;

    const phoneNumber = "+212612077309";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: locale === "fr" ? "Adresse" : "Address",
      details: "RUE 8 ENNASR LOT 635 TANGER",
      subtitle: locale === "fr" ? "Tanger, Maroc" : "Tangier, Morocco",
    },
    {
      icon: Phone,
      title: locale === "fr" ? "Téléphone" : "Phone",
      details: "+212612077309",
      subtitle: locale === "fr" ? "Disponible 24/7" : "Available 24/7",
    },
    {
      icon: Clock,
      title: locale === "fr" ? "Horaires" : "Hours",
      details: "9:00 - 18:00",
      subtitle: locale === "fr" ? "Lun - Dim" : "Mon - Sun",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <AnimatedContainer direction="down" className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-carbookers-red-100 text-carbookers-red-600 rounded-full text-sm font-medium mb-4">
            {locale === "fr" ? "Contactez-Nous" : "Contact Us"}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {locale === "fr" ? "Trouvez-Nous à Tanger" : "Find Us in Tangier"}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {locale === "fr"
              ? "Visitez notre showroom à Tanger ou contactez-nous pour toute question. Notre équipe est là pour vous aider."
              : "Visit our showroom in Tangier or contact us for any questions. Our team is here to help you."}
          </p>
        </AnimatedContainer>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <AnimatedContainer
              key={index}
              delay={index * 0.1}
              className="h-full"
            >
              <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-carbookers-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-900 font-medium mb-1">
                    {info.details}
                  </p>
                  <p className="text-gray-600 text-sm">{info.subtitle}</p>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>

        {/* Main Content - Map and Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form - Now comes first on mobile */}
          <AnimatedContainer
            direction="left"
            delay={0.3}
            className="lg:order-2"
          >
            <Card className="border-0 shadow-xl bg-white h-full">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-carbookers-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {locale === "fr"
                      ? "Envoyez-nous un Message"
                      : "Send us a Message"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {locale === "fr"
                      ? "Nous vous répondrons rapidement"
                      : "We'll get back to you quickly"}
                  </p>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  {/* Name */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      {locale === "fr" ? "Nom Complet" : "Full Name"} *
                    </Label>
                    <div className="relative">
                      <User className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={
                          locale === "fr" ? "Votre nom" : "Your name"
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Email *
                    </Label>
                    <div className="relative">
                      <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={
                          locale === "fr" ? "votre@email.com" : "your@email.com"
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      {locale === "fr" ? "Téléphone" : "Phone"}
                    </Label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+212..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      {locale === "fr" ? "Sujet" : "Subject"} *
                    </Label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={
                        locale === "fr"
                          ? "Sujet de votre message"
                          : "Subject of your message"
                      }
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Message *
                    </Label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={
                        locale === "fr" ? "Votre message..." : "Your message..."
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carbookers-red-600 focus:border-carbookers-red-600 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    disabled={
                      !formData.name ||
                      !formData.email ||
                      !formData.subject ||
                      !formData.message
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {locale === "fr"
                      ? "Envoyer via WhatsApp"
                      : "Send via WhatsApp"}
                  </Button>

                  {/* Alternative Contact */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600 mb-3">
                      {locale === "fr"
                        ? "Ou contactez-nous directement:"
                        : "Or contact us directly:"}
                    </p>
                    <div className="flex flex-col gap-2">
                      <a
                        href="tel:+212612077309"
                        className="flex items-center justify-center gap-2 text-carbookers-red-600 hover:text-carbookers-red-700 font-medium text-sm"
                      >
                        <Phone className="h-4 w-4" />
                        +212612077309
                      </a>
                      <a
                        href="https://wa.me/212612077309"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Direct
                      </a>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AnimatedContainer>

          {/* Map - Now more balanced size */}
          <AnimatedContainer
            direction="right"
            delay={0.5}
            className="lg:order-1"
          >
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="relative h-[350px] w-full">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MELHOR QUE NADA Location"
                  className="absolute inset-0 rounded-lg"
                ></iframe>

                {/* Overlay with coordinates */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-carbookers-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        MELHOR QUE NADA
                      </p>
                      <p className="text-xs text-gray-600">
                        35°45&apos;04.5&apos;N 5°49&apos;50.2&apos;W
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address overlay at bottom */}
              </div>
            </Card>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;
