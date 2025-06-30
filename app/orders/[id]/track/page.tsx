"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Truck, Package, CheckCircle, Clock, MapPin, ArrowLeft, User, AlertCircle } from 'lucide-react';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ETrikeLoader from "@/components/ui/etrike-loader";
import { getCurrentUser } from "@/lib/auth";

interface TrackingInfo {
  order_number: string;
  status: string;
  tracking_number?: string;
  events: Array<{
    id: number;
    status: string;
    description: string;
    location: string;
    timestamp: string;
    admin_notes?: string;
    courier_name?: string;
  }>;
}

export default function TrackOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    fetchTrackingInfo();
  }, [orderId, router]);

  const fetchTrackingInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_LARAVEL_API_URL;
      const response = await fetch(`${apiUrl}/orders/${orderId}/track`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Tracking API response:", data);

      if (data.success) {
        const trackingData = {
          ...data.data,
          events: data.data?.events || [],
        };
        setTracking(trackingData);
      } else {
        throw new Error(data.message || "Failed to fetch tracking information");
      }
    } catch (error) {
      console.error("Error fetching tracking info:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load tracking information";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAuthToken = () => {
    try {
      const sessionData = localStorage.getItem("session");
      if (!sessionData) return null;
      const session = JSON.parse(sessionData);
      return session.token || null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }

    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "shipped":
      case "out_for_delivery":
        return <Truck className="w-6 h-6 text-orange-600" />;
      case "processing":
        return <Package className="w-6 h-6 text-red-600" />;
      case "confirmed":
        return <CheckCircle className="w-6 h-6 text-orange-600" />;
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case "cancelled":
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "processing":
        return "bg-red-100 text-red-800 border-red-200";
      case "confirmed":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Your order has been received and is awaiting confirmation.";
      case "confirmed":
        return "Your order has been confirmed and is being prepared.";
      case "processing":
        return "Your order is being processed and prepared for shipment.";
      case "shipped":
        return "Your order has been shipped and is on its way to you.";
      case "delivered":
        return "Your order has been successfully delivered.";
      case "cancelled":
        return "Your order has been cancelled.";
      default:
        return "Order status is being updated.";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <ETrikeLoader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Tracking Information
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button
                onClick={fetchTrackingInfo}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/orders/${orderId}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Order Details
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Tracking Information Not Available
            </h1>
            <p className="text-gray-600 mb-6">
              No tracking information is available for this order yet.
            </p>
            <Button onClick={() => router.push(`/orders/${orderId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Order Details
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Track Your Order
              </h1>
              <p className="text-slate-300">Order #{tracking.order_number}</p>
            </div>
            <Badge
              className={`${getStatusColor(tracking.status)} text-lg px-4 py-2`}
            >
              {tracking.status.replace("_", " ").charAt(0).toUpperCase() +
                tracking.status.replace("_", " ").slice(1)}
            </Badge>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/orders/${orderId}`)}
            className="text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Order Details
          </Button>
        </div>

        {/* Current Status Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getStatusIcon(
                    tracking.status,
                    tracking.status === "delivered"
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {tracking.status.replace("_", " ").charAt(0).toUpperCase() +
                    tracking.status.replace("_", " ").slice(1)}
                </h3>
                <p className="text-gray-600 max-w-md">
                  {getStatusDescription(tracking.status)}
                </p>
                {tracking.tracking_number && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Tracking Number</p>
                    <p className="font-mono font-semibold text-gray-900">
                      {tracking.tracking_number}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {[
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
              ].map((status, index) => {
                const isActive =
                  [
                    "pending",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                  ].indexOf(tracking.status.toLowerCase()) >= index;
                const isCurrent = tracking.status.toLowerCase() === status;

                return (
                  <div
                    key={status}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        isActive
                          ? isCurrent
                            ? "bg-orange-500 text-white"
                            : "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {getStatusIcon(status, isActive && !isCurrent)}
                    </div>
                    <span
                      className={`text-xs font-medium ${isActive ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    {index < 4 && (
                      <div
                        className={`hidden sm:block w-full h-0.5 mt-5 -ml-full ${
                          [
                            "pending",
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                          ].indexOf(tracking.status.toLowerCase()) > index
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tracking Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tracking.events && tracking.events.length > 0 ? (
              <div className="relative">
                {tracking.events.map((event, index) => {
                  const isCompleted =
                    index < tracking.events.length - 1 ||
                    tracking.status === "delivered";
                  const isLast = index === tracking.events.length - 1;

                  return (
                    <div
                      key={event.id}
                      className="relative flex items-start gap-4 pb-8"
                    >
                      {/* Timeline Line */}
                      {!isLast && (
                        <div className="absolute left-3 top-8 w-0.5 h-full bg-gray-200"></div>
                      )}

                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.status, isCompleted)}
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {event.description}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString(
                              "en-PH",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        {event.courier_name && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <User className="w-3 h-3" />
                            <span>Handled by: {event.courier_name}</span>
                          </div>
                        )}

                        {event.admin_notes && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
                            <p className="text-sm text-orange-800">
                              <strong>Note:</strong> {event.admin_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Tracking Events Yet
                </h3>
                <p className="text-gray-600">
                  Order history will appear here once your order is processed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order or need assistance,
                feel free to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/contact")}
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/orders")}
                >
                  View All Orders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
