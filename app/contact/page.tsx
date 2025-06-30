"use client";
export const dynamic = "force-dynamic";
import type React from "react";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import ETrikeLoader from "@/components/ui/etrike-loader";
import Footer from "@/components/layout/footer";
import { useETrikeToast } from "@/components/ui/toast-container";

export default function ContactPage() {
  const toast = useETrikeToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Message Sent Successfully! 📧",
          "Thank you for your message! We'll get back to you within 24 hours.",
          {
            label: "View FAQ",
            onClick: () => {
              document
                .getElementById("faq-section")
                ?.scrollIntoView({ behavior: "smooth" });
            },
          }
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(
          "Failed to Send Message",
          data.message || "Please check your information and try again.",
          {
            label: "Try Again",
            onClick: () => {
              document.getElementById("name")?.focus();
            },
          }
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        "Connection Error",
        "Unable to send your message. Please check your internet connection and try again.",
        {
          label: "Retry",
          onClick: () => handleSubmit(e),
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <ETrikeLoader />
        </div>
      ) : (
        <>
          <Header />
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                Get In Touch
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Contact
                <span className="block bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  Us
                </span>
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
                Ready to go electric? We're here to help you find the perfect
                electric vehicle for your needs.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Form */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-2 border-orange-200 focus:border-orange-500"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-2 border-orange-200 focus:border-orange-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-2 border-orange-200 focus:border-orange-500"
                          placeholder="+63 XXX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="h-12 w-full rounded-xl border-2 border-orange-200 focus:border-orange-500 px-4 bg-white"
                        >
                          <option value="">Select a subject</option>
                          <option value="product-inquiry">
                            Product Inquiry
                          </option>
                          <option value="sales">Sales</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-orange-200 focus:border-orange-500 px-4 py-3 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 h-12 rounded-xl font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Get in Touch
                  </h2>
                  <div className="space-y-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Our Office
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          123 Electric Avenue
                          <br />
                          Makati City, Metro Manila
                          <br />
                          Philippines 1200
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Phone Numbers
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Sales: +63 (02) 123-4567
                          <br />
                          Support: +63 (02) 765-4321
                          <br />
                          Mobile: +63 917 123 4567
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Email Addresses
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          General: info@yamaaraw.com
                          <br />
                          Sales: sales@yamaaraw.com
                          <br />
                          Support: support@yamaaraw.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Business Hours
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Monday - Friday: 8:00 AM - 6:00 PM
                          <br />
                          Saturday: 9:00 AM - 4:00 PM
                          <br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq-section" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-orange-100 text-orange-600 border-orange-200">
                  FAQ
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question:
                      "What is the warranty period for your electric vehicles?",
                    answer:
                      "All our electric vehicles come with a comprehensive 2-year warranty covering battery, motor, and electrical components.",
                  },
                  {
                    question: "Do you offer financing options?",
                    answer:
                      "Yes, we partner with leading financial institutions to offer flexible financing options with competitive interest rates.",
                  },
                  {
                    question: "How long does it take to charge the battery?",
                    answer:
                      "Charging time varies by model, but typically ranges from 4-8 hours for a full charge using standard household outlets.",
                  },
                  {
                    question: "Do you provide after-sales service?",
                    answer:
                      "We have over 100 service centers nationwide and provide comprehensive after-sales support.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <MessageSquare className="w-5 h-5 text-orange-500 mr-3" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed ml-8">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}
