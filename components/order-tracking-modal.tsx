"use client";

import { useState, useEffect } from "react";
import {
  X,
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ETrikeLoader from "@/components/ui/etrike-loader";

interface TrackingTimelineItem {
  status: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  tracking_number?: string;
}

interface TrackingInfo {
  order_number: string;
  status: string;
  timeline: TrackingTimelineItem[];
  estimated_delivery?: string;
}

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}

export default function OrderTrackingModal({
  isOpen,
  onClose,
  orderId,
}: OrderTrackingModalProps) {
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchTrackingInfo();
    }
  }, [isOpen, orderId]);

  const fetchTrackingInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      const response = await fetch(`/api/orders/${orderId}/track`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setTrackingInfo(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch tracking information");
      }
    } catch (error) {
      console.error("Error fetching tracking info:", error);
      setError("Failed to fetch tracking information. Please try again.");
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
      return null;
    }
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) {
      return <Clock className="w-5 h-5 text-gray-400" />;
    }

    switch (status) {
      case "pending":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "processing":
        return <Package className="w-5 h-5 text-purple-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Order Tracking</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ETrikeLoader />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error Loading Tracking
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchTrackingInfo} variant="outline">
                Try Again
              </Button>
            </div>
          ) : trackingInfo ? (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    #{trackingInfo.order_number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Track your order status
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(trackingInfo.status)} px-3 py-1`}
                >
                  <span className="capitalize">{trackingInfo.status}</span>
                </Badge>
              </div>

              {/* Estimated Delivery */}
              {trackingInfo.estimated_delivery && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Estimated Delivery
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            trackingInfo.estimated_delivery
                          ).toLocaleDateString("en-PH", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Order Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingInfo.timeline.map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.completed
                                ? "bg-white border-2 border-current"
                                : "bg-gray-100"
                            }`}
                          >
                            {getStatusIcon(item.status, item.completed)}
                          </div>
                          {index < trackingInfo.timeline.length - 1 && (
                            <div
                              className={`w-0.5 h-8 mt-2 ${item.completed ? "bg-green-300" : "bg-gray-200"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}
                            >
                              {item.title}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString("en-PH", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p
                            className={`text-sm mt-1 ${item.completed ? "text-gray-600" : "text-gray-400"}`}
                          >
                            {item.description}
                          </p>
                          {item.tracking_number && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                Tracking: {item.tracking_number}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button
                  onClick={fetchTrackingInfo}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Refresh Status
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
