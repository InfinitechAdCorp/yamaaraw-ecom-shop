"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Search,
  Download,
  AlertCircle,
  Eye,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Reply,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCurrentUser, getAuthToken } from "@/lib/auth";
import { useETrikeToast } from "@/components/ui/toast-container";

interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  admin_notes?: string;
  assigned_to?: string;
  replied_at?: string;
  reply_message?: string;
  reply_from?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminContactInquiries() {
  const router = useRouter();
  const toast = useETrikeToast();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Reply modal state
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(
    null
  );
  const [replyMessage, setReplyMessage] = useState("");
  const [replyFrom, setReplyFrom] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<ContactInquiry | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }

    fetchInquiries();
  }, [router, currentPage, searchTerm, statusFilter, priorityFilter]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Check if NEXT_PUBLIC_LARAVEL_API_URL is defined
      if (!process.env.NEXT_PUBLIC_LARAVEL_API_URL) {
        setError(
          "NEXT_PUBLIC_LARAVEL_API_URL is not defined in the environment variables."
        );
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: itemsPerPage.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/contact-inquiries?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const paginatedData = result.data;
        setInquiries(
          Array.isArray(paginatedData.data) ? paginatedData.data : []
        );
        setCurrentPage(paginatedData.current_page || 1);
        setTotalPages(paginatedData.last_page || 1);
        setTotalCount(paginatedData.total || 0);
      } else {
        throw new Error(result.message || "Failed to fetch inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setError("Failed to fetch inquiries. Please try again.");
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      const token = getAuthToken();
      if (!token) {
        toast.error("Error", "Authentication required");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/contact-inquiries/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Success", "Status updated successfully");
        await fetchInquiries();
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error", "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleReply = async () => {
    if (!selectedInquiry || !replyMessage.trim() || !replyFrom.trim()) {
      toast.error("Error", "Please fill in all required fields");
      return;
    }

    try {
      setSendingReply(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Error", "Authentication required");
        return;
      }

      // Save reply to database
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/contact-inquiries/${selectedInquiry.id}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reply_message: replyMessage,
            reply_from: replyFrom,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Send email
        const emailResponse = await fetch("/api/email/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inquiry: selectedInquiry,
            replyMessage,
            replyFrom,
          }),
        });

        if (emailResponse.ok) {
          toast.success("Success", "Reply sent successfully via email");
        } else {
          toast.warning(
            "Partial Success",
            "Reply saved but email failed to send"
          );
        }

        setReplyModalOpen(false);
        setReplyMessage("");
        setReplyFrom("");
        setSelectedInquiry(null);
        await fetchInquiries();
      } else {
        throw new Error(result.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Error", "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async () => {
    if (!inquiryToDelete) return;

    try {
      setDeleting(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Error", "Authentication required");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/admin/contact-inquiries/${inquiryToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Success", "Inquiry deleted successfully");
        setDeleteModalOpen(false);
        setInquiryToDelete(null);
        await fetchInquiries();
      } else {
        throw new Error(result.message || "Failed to delete inquiry");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Error", "Failed to delete inquiry");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Subject",
      "Message",
      "Status",
      "Priority",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...inquiries.map((inquiry) =>
        [
          `"${inquiry.name}"`,
          `"${inquiry.email}"`,
          `"${inquiry.phone || ""}"`,
          `"${inquiry.subject}"`,
          `"${inquiry.message.replace(/"/g, '""')}"`,
          `"${inquiry.status}"`,
          `"${inquiry.priority}"`,
          `"${new Date(inquiry.created_at).toLocaleDateString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-inquiries-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const statuses = ["all", "new", "in_progress", "resolved", "closed"];
  const priorities = ["all", "low", "medium", "high", "urgent"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
          <section className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                Admin Dashboard
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Contact Inquiries
              </h1>
              <p className="text-blue-100">
                Manage customer inquiries and support requests
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Mail className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Stats Cards */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">New</p>
                    <p className="text-3xl font-bold">
                      {Array.isArray(inquiries)
                        ? inquiries.filter((i) => i.status === "new").length
                        : 0}
                    </p>
                  </div>
                  <Mail className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">In Progress</p>
                    <p className="text-3xl font-bold">
                      {Array.isArray(inquiries)
                        ? inquiries.filter((i) => i.status === "in_progress")
                            .length
                        : 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Resolved</p>
                    <p className="text-3xl font-bold">
                      {Array.isArray(inquiries)
                        ? inquiries.filter((i) => i.status === "resolved")
                            .length
                        : 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Urgent</p>
                    <p className="text-3xl font-bold">
                      {Array.isArray(inquiries)
                        ? inquiries.filter((i) => i.priority === "urgent")
                            .length
                        : 0}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-lg border-2 border-blue-200 focus:border-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-4 rounded-lg border-2 border-blue-200 focus:border-blue-500 bg-white min-w-[150px]"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Status"
                      : status.replace("_", " ").charAt(0).toUpperCase() +
                        status.replace("_", " ").slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-10 px-4 rounded-lg border-2 border-blue-200 focus:border-blue-500 bg-white min-w-[150px]"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority === "all"
                      ? "All Priorities"
                      : priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={handleExport}
                disabled={inquiries.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Badge className="bg-blue-100 text-blue-600 border-blue-200">
                {totalCount} Inquir{totalCount !== 1 ? "ies" : "y"}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiries Table */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No inquiries found
              </h3>
              <p className="text-gray-600">
                No inquiries match your current filters.
              </p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">
                    Contact Inquiries ({totalCount})
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Show:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        handleItemsPerPageChange(Number(e.target.value))
                      }
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Customer
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Subject
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Priority
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Status
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Date
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 bg-gray-50">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inquiry) => (
                        <tr
                          key={inquiry.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {inquiry.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {inquiry.name}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {inquiry.email}
                                </div>
                                {inquiry.phone && (
                                  <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {inquiry.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="max-w-xs">
                              <div className="font-medium text-gray-900 truncate">
                                {inquiry.subject}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {inquiry.message}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              className={`${getPriorityColor(inquiry.priority)} text-xs`}
                            >
                              {inquiry.priority.charAt(0).toUpperCase() +
                                inquiry.priority.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={inquiry.status}
                              onChange={(e) =>
                                handleStatusUpdate(inquiry.id, e.target.value)
                              }
                              disabled={updatingStatus === inquiry.id}
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(inquiry.status)} ${
                                updatingStatus === inquiry.id
                                  ? "opacity-50"
                                  : ""
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(
                                  inquiry.created_at
                                ).toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Contact Inquiry Details
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-700">
                                          Name
                                        </label>
                                        <p className="text-gray-900">
                                          {inquiry.name}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-700">
                                          Email
                                        </label>
                                        <p className="text-gray-900">
                                          {inquiry.email}
                                        </p>
                                      </div>
                                      {inquiry.phone && (
                                        <div>
                                          <label className="text-sm font-medium text-gray-700">
                                            Phone
                                          </label>
                                          <p className="text-gray-900">
                                            {inquiry.phone}
                                          </p>
                                        </div>
                                      )}
                                      <div>
                                        <label className="text-sm font-medium text-gray-700">
                                          Subject
                                        </label>
                                        <p className="text-gray-900">
                                          {inquiry.subject}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">
                                        Message
                                      </label>
                                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                        {inquiry.message}
                                      </p>
                                    </div>
                                    {inquiry.reply_message && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-700">
                                          Reply
                                        </label>
                                        <p className="text-gray-900 bg-blue-50 p-3 rounded-lg">
                                          {inquiry.reply_message}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                          Replied by {inquiry.reply_from} on{" "}
                                          {inquiry.replied_at &&
                                            new Date(
                                              inquiry.replied_at
                                            ).toLocaleString()}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedInquiry(inquiry);
                                  setReplyFrom("admin@yamaaraw.com");
                                  setReplyModalOpen(true);
                                }}
                                className="border-green-200 text-green-600 hover:bg-green-50"
                              >
                                <Reply className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setInquiryToDelete(inquiry);
                                  setDeleteModalOpen(true);
                                }}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center space-x-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </Button>

                        <div className="flex items-center space-x-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const pageNumber =
                                Math.max(
                                  1,
                                  Math.min(totalPages - 4, currentPage - 2)
                                ) + i;
                              if (pageNumber > totalPages) return null;

                              return (
                                <Button
                                  key={pageNumber}
                                  variant={
                                    pageNumber === currentPage
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNumber)}
                                  className="w-10 h-10 p-0"
                                >
                                  {pageNumber}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center space-x-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Reply Modal */}
      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Inquiry</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Original Message
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>From:</strong> {selectedInquiry.name} (
                  {selectedInquiry.email})
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Subject:</strong> {selectedInquiry.subject}
                </p>
                <p className="text-gray-700">{selectedInquiry.message}</p>
              </div>

              <div>
                <label
                  htmlFor="replyFrom"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reply From *
                </label>
                <Input
                  id="replyFrom"
                  type="email"
                  value={replyFrom}
                  onChange={(e) => setReplyFrom(e.target.value)}
                  placeholder="admin@yamaaraw.com"
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="replyMessage"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reply Message *
                </label>
                <textarea
                  id="replyMessage"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-blue-500 px-4 py-3 resize-none"
                  placeholder="Type your reply here..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setReplyModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleReply} disabled={sendingReply}>
                  {sendingReply ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Reply className="w-4 h-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          {inquiryToDelete && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 mb-2">
                  You are about to permanently delete this inquiry:
                </p>
                <div className="bg-white rounded p-3 border border-red-100">
                  <p className="font-medium text-gray-900">
                    {inquiryToDelete.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {inquiryToDelete.email}
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {inquiryToDelete.subject}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. All
                  data associated with this inquiry will be permanently removed.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setInquiryToDelete(null);
                  }}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Permanently
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
