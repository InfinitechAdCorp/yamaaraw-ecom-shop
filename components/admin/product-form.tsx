"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Upload,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Eye,
  Search,
  Users,
  Briefcase,
  Heart,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductData } from "@/lib/api";

interface ProductFormProps {
  product?: ProductData | null;
  onSubmit: (data: ProductData) => void;
  onClose: () => void;
}

const availableColors = [
  { name: "Gray", value: "#9CA3AF" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#84CC16" },
  { name: "Neon Green", value: "#39FF14" },
  { name: "Red", value: "#EF4444" },
  { name: "Black", value: "#000000" },
  { name: "Yellow", value: "#EAB308" },
  { name: "White", value: "#FFFFFF" },
  { name: "Dark Blue", value: "#00008B" },
];

// Cleaned up and organized ideal for options
const idealForCategories = {
  personal: {
    icon: Users,
    title: "Personal Use",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    options: [
      "Urban Commuters",
      "Employees",
      "Senior Citizens",
      "Families with Children",
      "Students",
      "Eco-conscious Riders",
      "Short-distance Commuters",
      "Tech-savvy Users",
      "Value-conscious Buyers",
    ],
  },
  business: {
    icon: Briefcase,
    title: "Business & Commercial",
    color: "bg-green-50 border-green-200 text-green-700",
    options: [
      "Delivery Services",
      "Small Business Owners",
      "Market Vendors",
      "Construction Projects",
      "Agricultural Operations",
      "Landscaping Services",
      "Municipal Departments",
      "Utility Services",
    ],
  },
  community: {
    icon: Heart,
    title: "Community & Tourism",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    options: [
      "Barangay Transport",
      "Community Services",
      "Tourism Operators",
      "Resort Operations",
      "Campus Transport",
      "Real Estate Tours",
      "VIP Guest Mobility",
      "Assisted Transport",
    ],
  },
  specialized: {
    icon: Zap,
    title: "Specialized Use",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    options: [
      "Large Families",
      "Caregivers",
      "Facility Management",
      "Eco-conscious Institutions",
      "Dual-purpose Riders",
      "Heavy Cargo Transport",
    ],
  },
};

export default function ProductForm({
  product,
  onSubmit,
  onClose,
}: ProductFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    category: "",
    model: "",
    images: [],
    ideal_for: [],
    specifications: {
      dimensions: "",
      battery_type: "",
      motor_power: "",
      main_features: "",
      front_rear_suspension: "",
      front_tires: "",
      rear_tires: "",
    },
    colors: [],
    in_stock: true,
    featured: false,
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        images: product.images || [],
        ideal_for: product.ideal_for || [],
        colors: product.colors || [],
        specifications: {
          dimensions: product.specifications?.dimensions || "",
          battery_type: product.specifications?.battery_type || "",
          motor_power: product.specifications?.motor_power || "",
          main_features: product.specifications?.main_features || "",
          front_rear_suspension:
            product.specifications?.front_rear_suspension || "",
          front_tires: product.specifications?.front_tires || "",
          rear_tires: product.specifications?.rear_tires || "",
        },
      });
    }
  }, [product]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);

    if (files) {
      const previews: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            previews.push(event.target.result as string);
            if (previews.length === files.length) {
              setPreviewImages(previews);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setPreviewImages([]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number.parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecificationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [field]: value },
    }));
  };

  const handleIdealForChange = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      ideal_for: (prev.ideal_for || []).includes(option)
        ? (prev.ideal_for || []).filter((item) => item !== option)
        : [...(prev.ideal_for || []), option],
    }));
  };

  const handleColorToggle = (color: { name: string; value: string }) => {
    setFormData((prev) => ({
      ...prev,
      colors: (prev.colors || []).some((c) => c.value === color.value)
        ? (prev.colors || []).filter((c) => c.value !== color.value)
        : [...(prev.colors || []), color],
    }));
  };

  const handleAddImages = async () => {
    if (selectedFiles) {
      try {
        const uploadFormData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
          uploadFormData.append("images[]", file);
        });

        const token =
          localStorage.getItem("authToken") ||
          (() => {
            try {
              const sessionData = localStorage.getItem("session");
              if (sessionData) {
                const session = JSON.parse(sessionData);
                return session.token;
              }
            } catch (error) {
              console.error("Error getting auth token:", error);
            }
            return null;
          })();

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          const urls = data.urls || data.images || [];
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), ...urls],
          }));
          setSelectedFiles(null);
          setPreviewImages([]);
          const fileInput = document.getElementById(
            "image-upload"
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";
        } else {
          console.error("Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleRemovePreview = (index: number) => {
    if (selectedFiles) {
      const dt = new DataTransfer();
      Array.from(selectedFiles).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setSelectedFiles(dt.files.length > 0 ? dt.files : null);
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSubmitting(true);
    console.log("Form submitted manually - Starting submission...");

    try {
      if (selectedFiles && selectedFiles.length > 0) {
        const submitFormData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (key === "images") {
            (value as string[]).forEach((img) => {
              submitFormData.append("existing_images[]", img);
            });
          } else if (key === "specifications") {
            submitFormData.append(key, JSON.stringify(value));
            console.log("Specifications JSON:", JSON.stringify(value));
          } else if (key === "colors") {
            submitFormData.append(key, JSON.stringify(value));
            console.log("Colors JSON:", JSON.stringify(value));
          } else if (key === "ideal_for") {
            submitFormData.append(key, JSON.stringify(value));
            console.log("Ideal For JSON:", JSON.stringify(value));
          } else {
            submitFormData.append(key, String(value));
          }
        });

        Array.from(selectedFiles).forEach((file) => {
          submitFormData.append("images[]", file);
        });

        console.log("=== FIXED FormData entries ===");
        for (const [key, value] of submitFormData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }

        await onSubmit(submitFormData as any);
      } else {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "Basic Info", description: "Product details" },
    { number: 2, title: "Images", description: "Product photos" },
    { number: 3, title: "Specifications", description: "Technical details" },
    { number: 4, title: "Options", description: "Colors & features" },
  ];

  // Filter options based on search term
  const getFilteredOptions = (options: string[]) => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">
                {product ? "Edit Product" : "Create New Product"}
              </h2>
              <p className="text-orange-100 text-sm">Step {currentStep} of 4</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-3 sm:px-6 py-2 sm:py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex items-center min-w-0 flex-shrink-0"
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                    currentStep >= step.number
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <div className="ml-2 sm:ml-3 hidden sm:block">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-6 sm:w-12 h-0.5 mx-2 sm:mx-4 ${currentStep > step.number ? "bg-orange-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div
            className="flex-1 overflow-y-auto p-3 sm:p-4"
            style={{ maxHeight: "calc(95vh - 200px)" }}
          >
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-orange-600 text-lg">
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          className="h-10 text-sm"
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Model *
                        </label>
                        <Input
                          name="model"
                          value={formData.model}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          className="h-10 text-sm"
                          placeholder="Enter model number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        rows={3}
                        className="w-full rounded-lg border-2 border-gray-200 focus:border-orange-500 px-3 py-2 resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter product description"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          className="h-10 w-full rounded-lg border-2 border-gray-200 focus:border-orange-500 px-3 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select category</option>
                          <option value="E-Bike">E-Bike</option>
                          <option value="E-Trike">E-Trike</option>
                          <option value="E-Scooter">E-Scooter</option>
                          <option value="E-Motorcycle">E-Motorcycle</option>
                          <option value="E-Dump">E-Dump</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₱) *
                        </label>
                        <Input
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          min="0"
                          step="0.01"
                          className="h-10 text-sm"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Original Price (₱)
                        </label>
                        <Input
                          name="original_price"
                          type="number"
                          value={formData.original_price || ""}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="0"
                          step="0.01"
                          className="h-10 text-sm"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Images */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-orange-600 text-lg flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Product Images with Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <Input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelection}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer text-orange-600 hover:text-orange-700 font-medium text-base ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        Click to upload images or drag and drop
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, GIF up to 2MB each
                      </p>
                    </div>

                    {/* Preview Selected Images */}
                    {previewImages.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-gray-700 flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Selected Images Preview
                          </h4>
                          <Button
                            type="button"
                            onClick={handleAddImages}
                            disabled={isSubmitting}
                            className="bg-green-500 hover:bg-green-600 text-sm shadow-lg"
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload {previewImages.length} Image
                            {previewImages.length > 1 ? "s" : ""}
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          {previewImages.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2 border-blue-300 shadow-md group-hover:shadow-lg transition-shadow"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemovePreview(index)}
                                disabled={isSubmitting}
                                className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-transparent text-white text-xs px-2 py-1 rounded-b-lg">
                                Preview
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Uploaded Images */}
                    {(formData.images || []).length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-base font-semibold text-gray-700 flex items-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Uploaded Images
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {(formData.images || []).map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Product ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRemoveImage(index)}
                                disabled={isSubmitting}
                                className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-transparent text-white text-xs px-2 py-1 rounded-b-lg">
                                Uploaded
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Specifications */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-orange-600 text-lg">
                      Technical Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dimensions
                        </label>
                        <Input
                          value={formData.specifications?.dimensions || ""}
                          onChange={(e) =>
                            handleSpecificationChange(
                              "dimensions",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          className="h-11 text-sm"
                          placeholder="e.g., 1820 × 680 × 1170 mm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Battery Type
                        </label>
                        <Input
                          value={formData.specifications?.battery_type || ""}
                          onChange={(e) =>
                            handleSpecificationChange(
                              "battery_type",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          className="h-11 text-sm"
                          placeholder="e.g., 72V / 38Ah"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Motor Power
                        </label>
                        <Input
                          value={formData.specifications?.motor_power || ""}
                          onChange={(e) =>
                            handleSpecificationChange(
                              "motor_power",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          className="h-11 text-sm"
                          placeholder="e.g., 2000W"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Main Features
                        </label>
                        <Input
                          value={formData.specifications?.main_features || ""}
                          onChange={(e) =>
                            handleSpecificationChange(
                              "main_features",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          className="h-11 text-sm"
                          placeholder="e.g., Bluetooth audio and anti-theft system"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Front/Rear Suspension
                        </label>
                        <Input
                          value={
                            formData.specifications?.front_rear_suspension || ""
                          }
                          onChange={(e) =>
                            handleSpecificationChange(
                              "front_rear_suspension",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          className="h-11 text-sm"
                          placeholder='e.g., 27" hydraulic shock absorbers'
                        />
                      </div>
                    </div>

                    {/* Tire Specifications */}
                    <div className="border-t pt-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                        🛞 Tire Specifications
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Front Tires
                          </label>
                          <Input
                            value={formData.specifications?.front_tires || ""}
                            onChange={(e) =>
                              handleSpecificationChange(
                                "front_tires",
                                e.target.value
                              )
                            }
                            disabled={isSubmitting}
                            className="h-11 text-sm"
                            placeholder="e.g., 110/70-12"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rear Tires
                          </label>
                          <Input
                            value={formData.specifications?.rear_tires || ""}
                            onChange={(e) =>
                              handleSpecificationChange(
                                "rear_tires",
                                e.target.value
                              )
                            }
                            disabled={isSubmitting}
                            className="h-11 text-sm"
                            placeholder="e.g., 120/70-12"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Enhanced Colors & Options */}
            {currentStep === 4 && (
              <div className="space-y-4">
                {/* Colors */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-orange-600 text-lg">
                      Available Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-7 gap-3">
                      {availableColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleColorToggle(color)}
                          disabled={isSubmitting}
                          className={`relative w-12 h-12 rounded-full border-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
                            (formData.colors || []).some(
                              (c) => c.value === color.value
                            )
                              ? "border-orange-500 scale-110 ring-4 ring-orange-200"
                              : "border-gray-300 hover:border-orange-300"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {(formData.colors || []).some(
                            (c) => c.value === color.value
                          ) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 bg-orange-500 rounded-full shadow-lg"></div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.colors || []).map((color, index) => (
                        <Badge
                          key={index}
                          className="bg-orange-100 text-orange-700 border-orange-300 px-3 py-1"
                        >
                          {color.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Ideal For Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-orange-600 text-lg">
                      Target Audience
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search target audience..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(idealForCategories).map(
                      ([key, category]) => {
                        const filteredOptions = getFilteredOptions(
                          category.options
                        );
                        if (filteredOptions.length === 0) return null;

                        const IconComponent = category.icon;
                        return (
                          <div
                            key={key}
                            className={`border-2 rounded-xl p-4 ${category.color}`}
                          >
                            <h4 className="font-semibold mb-3 flex items-center text-sm">
                              <IconComponent className="w-4 h-4 mr-2" />
                              {category.title}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {filteredOptions.map((option) => (
                                <label
                                  key={option}
                                  className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors ${
                                    isSubmitting
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={(
                                      formData.ideal_for || []
                                    ).includes(option)}
                                    onChange={() =>
                                      handleIdealForChange(option)
                                    }
                                    disabled={isSubmitting}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 disabled:opacity-50"
                                  />
                                  <span className="text-sm text-gray-800 font-medium">
                                    {option}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}

                    {/* Selected Summary */}
                    {(formData.ideal_for || []).length > 0 && (
                      <div className="border-t pt-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">
                          Selected ({(formData.ideal_for || []).length}):
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {(formData.ideal_for || []).map((item, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 border-blue-300"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Product Status & Submit */}
                <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-orange-600 font-bold text-lg">
                        Product Status
                      </h3>
                      <div className="flex space-x-8">
                        <label
                          className={`flex items-center space-x-3 cursor-pointer ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="in_stock"
                            checked={formData.in_stock}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 disabled:opacity-50"
                          />
                          <span className="text-base text-gray-700 font-medium">
                            In Stock
                          </span>
                        </label>
                        <label
                          className={`flex items-center space-x-3 cursor-pointer ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 disabled:opacity-50"
                          />
                          <span className="text-base text-gray-700 font-medium">
                            Featured Product
                          </span>
                        </label>
                      </div>

                      <div className="border-t pt-4 text-center">
                        <div className="text-2xl mb-3">🚀</div>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg px-8 py-4 shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                              {product
                                ? "Updating Product..."
                                : "Creating Product..."}
                            </>
                          ) : (
                            <>
                              {product
                                ? "💾 UPDATE PRODUCT NOW"
                                : "✨ CREATE PRODUCT NOW"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex justify-between items-center p-4 border-t bg-gray-50 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className="flex items-center px-4 py-2"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                size="sm"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              {currentStep < 4 && (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex items-center px-6 py-2"
                  size="sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
