"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, User, Clock, MessageCircle, CheckCircle, AlertCircle, XCircle, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAuthToken } from "@/lib/auth"
import { useETrikeToast } from "@/components/ui/toast-container"
import ETrikeLoader from "@/components/ui/etrike-loader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Message {
  id: number
  conversation_id: number
  message: string
  is_admin: boolean
  created_at: string
  user?: {
    id: number
    name: string
    email: string
  }
}

interface Conversation {
  id: number
  user_id: number
  admin_id?: number
  status: "waiting" | "active" | "closed"
  subject?: string
  last_message_at: string
  created_at: string
  user: {
    id: number
    name: string
    email: string
  }
  admin?: {
    id: number
    name: string
    email: string
  }
  messages_count: number
  unread_count: number
}

interface ChatStats {
  total_conversations: number
  active_conversations: number
  waiting_conversations: number
  closed_conversations: number
  open_conversations: number
  total_messages: number
  unread_messages: number
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isEndingChat, setIsEndingChat] = useState(false)
  const [stats, setStats] = useState<ChatStats | null>(null)
  const [lastMessageId, setLastMessageId] = useState<number | null>(null)
  const [lastConversationUpdate, setLastConversationUpdate] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("open")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const conversationsPollingRef = useRef<NodeJS.Timeout | null>(null)
  const messagesPollingRef = useRef<NodeJS.Timeout | null>(null)
  const toast = useETrikeToast()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    fetchConversations()
    fetchStats()
  }, [statusFilter])

  // Polling for conversations list (every 10 seconds)
  useEffect(() => {
    conversationsPollingRef.current = setInterval(() => {
      fetchConversations(true)
      fetchStats()
    }, 10000)

    return () => {
      if (conversationsPollingRef.current) {
        clearInterval(conversationsPollingRef.current)
      }
    }
  }, [statusFilter])

  // Polling for messages when a conversation is selected (every 2 seconds)
  useEffect(() => {
    if (selectedConversation) {
      if (messagesPollingRef.current) {
        clearInterval(messagesPollingRef.current)
      }
      messagesPollingRef.current = setInterval(() => {
        fetchMessages(selectedConversation.id, true)
      }, 2000)

      return () => {
        if (messagesPollingRef.current) {
          clearInterval(messagesPollingRef.current)
        }
      }
    } else {
      if (messagesPollingRef.current) {
        clearInterval(messagesPollingRef.current)
      }
    }
  }, [selectedConversation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationsPollingRef.current) {
        clearInterval(conversationsPollingRef.current)
      }
      if (messagesPollingRef.current) {
        clearInterval(messagesPollingRef.current)
      }
    }
  }, [])

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true)
      const token = getAuthToken()
      if (!token) {
        toast.error("Error", "Authentication token not found")
        return
      }

      const response = await fetch(`/api/chatbot/chat?action=admin_conversations&status=${statusFilter}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        const newConversations = data.data.data || []
        const currentUpdate = JSON.stringify(
          newConversations.map((c: Conversation) => ({
            id: c.id,
            last_message_at: c.last_message_at,
            messages_count: c.messages_count,
            status: c.status,
          })),
        )

        if (currentUpdate !== lastConversationUpdate) {
          setConversations(newConversations)
          setLastConversationUpdate(currentUpdate)
          if (!silent && newConversations.some((c: Conversation) => c.status === "waiting")) {
            toast.info("New Chat", "New customer chat waiting for response")
          }
        }
      } else {
        console.error("Failed to fetch conversations:", data.message)
        if (!silent) {
          toast.error("Error", data.message || "Failed to load conversations")
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
      if (!silent) {
        toast.error("Error", "Failed to load conversations")
      }
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch("/api/chatbot/chat?action=admin_stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const fetchMessages = async (conversationId: number, silent = false) => {
    try {
      if (!silent) setIsLoadingMessages(true)
      const token = getAuthToken()
      if (!token) {
        if (!silent) {
          toast.error("Error", "Authentication token not found")
        }
        return
      }

      const response = await fetch(`/api/chatbot/chat?action=get_messages&conversation_id=${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success && data.data.data) {
        const newMessages = data.data.data.reverse()
        const currentLastMessageId = newMessages.length > 0 ? newMessages[newMessages.length - 1].id : null

        if (currentLastMessageId !== lastMessageId) {
          setMessages(newMessages)
          setLastMessageId(currentLastMessageId)
          setTimeout(scrollToBottom, 100)
        }
      } else {
        console.error("Failed to fetch messages:", data.message)
        if (!silent) {
          toast.error("Error", data.message || "Failed to load messages")
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      if (!silent) {
        toast.error("Error", "Failed to load messages")
      }
    } finally {
      if (!silent) setIsLoadingMessages(false)
    }
  }

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMessages([])
    setLastMessageId(null)
    await fetchMessages(conversation.id)
    if (conversation.status === "waiting") {
      await assignConversation(conversation.id)
    }
  }

  const assignConversation = async (conversationId: number) => {
    try {
      const token = getAuthToken()
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "assign_conversation",
          conversation_id: conversationId,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Assigned", "Conversation assigned to you")
        fetchConversations(true)
        fetchStats()
      }
    } catch (error) {
      console.error("Failed to assign conversation:", error)
      toast.error("Error", "Failed to assign conversation")
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    try {
      const token = getAuthToken()
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "admin_send_message",
          conversation_id: selectedConversation.id,
          message: newMessage,
          message_type: "text",
        }),
      })

      const data = await response.json()
      if (data.success) {
        setNewMessage("")
        setTimeout(() => fetchMessages(selectedConversation.id, true), 300)
        if (inputRef.current) {
          inputRef.current.focus()
        }
      } else {
        toast.error("Error", data.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      toast.error("Error", "Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const endChat = async (conversationId: number) => {
    setIsEndingChat(true)
    try {
      const token = getAuthToken()
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "end_conversation",
          conversation_id: conversationId,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Chat Ended", "Chat has been ended successfully")
        // Clear selected conversation and refresh data
        setSelectedConversation(null)
        setMessages([])
        fetchConversations(true)
        fetchStats()
      } else {
        toast.error("Error", data.message || "Failed to end chat")
      }
    } catch (error) {
      console.error("Failed to end chat:", error)
      toast.error("Error", "Failed to end chat")
    } finally {
      setIsEndingChat(false)
    }
  }

  const updateConversationStatus = async (conversationId: number, status: string) => {
    try {
      const token = getAuthToken()
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "update_conversation_status",
          conversation_id: conversationId,
          status,
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Updated", `Conversation marked as ${status}`)
        fetchConversations(true)
        fetchStats()
        if (status === "closed") {
          setSelectedConversation(null)
          setMessages([])
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Error", "Failed to update conversation status")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <MessageCircle className="w-4 h-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <ETrikeLoader />
        <span className="ml-2">Loading chat dashboard...</span>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Stats Bar */}
      {stats && (
        <div className="bg-white border-b px-6 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Total: {stats.total_conversations}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Waiting: {stats.waiting_conversations}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Active: {stats.active_conversations}</span>
            </div>
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Messages: {stats.total_messages}</span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="flex-1 flex min-h-0">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversations ({conversations.length})
              </h2>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-20 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => selectConversation(conversation)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                    selectedConversation?.id === conversation.id
                      ? "bg-orange-50 border border-orange-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-sm truncate">{conversation.user.name}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {getStatusIcon(conversation.status)}
                      <Badge className={`text-xs px-2 py-0 ${getStatusColor(conversation.status)}`}>
                        {conversation.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-2 truncate">{conversation.user.email}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(conversation.last_message_at)}
                    </span>
                    <span>{conversation.messages_count} msgs</span>
                  </div>

                  {conversation.unread_count > 0 && (
                    <div className="mt-2">
                      <Badge className="bg-red-500 text-white text-xs px-2 py-0">{conversation.unread_count} new</Badge>
                    </div>
                  )}
                </div>
              ))}

              {conversations.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No {statusFilter === "all" ? "" : statusFilter} conversations</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {statusFilter === "open"
                      ? "All conversations are closed"
                      : `No ${statusFilter} conversations found`}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConversation.user.name}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(selectedConversation.status)}`}>
                      {selectedConversation.status}
                    </Badge>
                    {selectedConversation.status !== "closed" && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isEndingChat}
                              className="flex items-center gap-2"
                            >
                              {isEndingChat ? <ETrikeLoader /> : <PhoneOff className="w-4 h-4" />}
                              End Chat
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>End Chat Session</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to end this chat session with {selectedConversation.user.name}?
                                This will close the conversation and notify the customer that the chat has ended.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => endChat(selectedConversation.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                End Chat
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateConversationStatus(selectedConversation.id, "closed")}
                        >
                          Close
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-12">
                    <ETrikeLoader />
                    <span className="ml-2">Loading messages...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.is_admin ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.is_admin ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.message}</p>
                          <p className={`text-xs mt-2 ${message.is_admin ? "text-orange-100" : "text-gray-500"}`}>
                            {new Date(message.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && !isLoadingMessages && (
                      <div className="text-center text-gray-500 py-16">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              {selectedConversation.status !== "closed" && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      disabled={isSending}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim() || isSending} className="px-6">
                      {isSending ? <ETrikeLoader /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
