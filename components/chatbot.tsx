"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, MapPin, Phone, Clock, User, MessageCircle, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAuthToken } from "@/lib/auth"
import { useETrikeToast } from "@/components/ui/toast-container"
import ETrikeLoader from "@/components/ui/etrike-loader"

interface Message {
  id: string
  text: string
  isBot: boolean
  isAdmin?: boolean
  timestamp: Date
  type?: "text" | "location" | "faq" | "products" | "quick-reply" | "search"
  data?: any
  user?: {
    id: number
    name: string
    email: string
  }
}

interface Product {
  id: string
  name: string
  model: string
  price: number
  original_price?: number
  category: string
  in_stock: boolean
  featured: boolean
  description: string
  image?: string
}

interface Conversation {
  id: number
  user_id: number
  admin_id?: number
  status: string
  subject?: string
  last_message_at?: string
  messages: any[]
  admin?: {
    id: number
    name: string
    email: string
  }
}

const FAQ_DATA = [
  {
    question: "What is the warranty period for E-Trikes?",
    answer:
      "All our E-Trikes come with a comprehensive 2-year warranty covering motor, battery, and electrical components. Frame warranty is 5 years.",
  },
  {
    question: "How long does the battery last?",
    answer:
      "Our E-Trike batteries typically last 40-60km on a single charge, depending on the model and usage conditions. Battery life is 3-5 years with proper maintenance.",
  },
  {
    question: "Do you offer financing options?",
    answer:
      "Yes! We offer flexible financing plans with 0% interest for qualified buyers. Down payment starts at 20% with terms up to 36 months.",
  },
  {
    question: "What maintenance is required?",
    answer:
      "Regular maintenance includes battery charging, tire pressure checks, and periodic brake adjustments. We recommend professional servicing every 6 months.",
  },
  {
    question: "Can I test drive before buying?",
    answer:
      "We encourage test drives. Visit our showroom to experience different models. Please bring a valid driver's license.",
  },
  {
    question: "Do you provide delivery service?",
    answer:
      "Yes, we offer free delivery within Metro Manila and Bulacan. For other areas, delivery fees may apply based on distance.",
  },
]

const QUICK_REPLIES = ["Show me prices", "Store location", "FAQ", "Financing options", "Test drive", "Contact info"]

export default function GlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [chatMode, setChatMode] = useState<"bot" | "admin">("bot")
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const toast = useETrikeToast()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken()
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    if (isOpen && chatMode === "bot" && messages.length === 0) {
      // Welcome message for bot
      setTimeout(() => {
        addBotMessage("Hi there! 👋 I'm Darlene, your YAMAARAW assistant. How can I help you today?", "text")
      }, 500)
    }
  }, [isOpen, chatMode])

  useEffect(() => {
    if (isOpen && chatMode === "admin" && isAuthenticated) {
      initializeAdminChat()
    }
  }, [isOpen, chatMode, isAuthenticated])

  // Enhanced polling for new messages in admin chat
  useEffect(() => {
    if (chatMode === "admin" && conversation && isOpen) {
      // Clear any existing interval
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }

      // Start polling every 2 seconds for real-time updates
      pollIntervalRef.current = setInterval(() => {
        fetchMessages(true) // Pass true for silent fetch
      }, 2000)

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
      }
    } else {
      // Clear polling when not in admin mode or no conversation
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [chatMode, conversation, isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  const initializeAdminChat = async () => {
    if (!isAuthenticated) {
      addSystemMessage("Please log in to chat with our support team.")
      return
    }

    setIsLoadingChat(true)
    try {
      const token = getAuthToken()
      const response = await fetch("/api/chatbot/chat?action=get_conversation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        setConversation(data.data.conversation)
        loadMessagesFromConversation(data.data.conversation)

        if (data.data.conversation.status === "waiting") {
          addSystemMessage("You're connected to our support team. An admin will be with you shortly.")
        } else if (data.data.conversation.admin) {
          addSystemMessage(`You're now chatting with ${data.data.conversation.admin.name} from our support team.`)
        }
        toast.success("Connected", "Connected to support chat")
      } else {
        addSystemMessage("Failed to connect to support chat. Please try again.")
        toast.error("Connection Failed", "Could not connect to support chat")
      }
    } catch (error) {
      console.error("Failed to initialize admin chat:", error)
      addSystemMessage("Failed to connect to support chat. Please try again.")
      toast.error("Connection Failed", "Could not connect to support chat")
    } finally {
      setIsLoadingChat(false)
    }
  }

  const loadMessagesFromConversation = (conv: Conversation) => {
    const chatMessages: Message[] = conv.messages.map((msg: any) => ({
      id: msg.id.toString(),
      text: msg.message,
      isBot: false,
      isAdmin: msg.is_admin,
      timestamp: new Date(msg.created_at),
      user: msg.user,
    }))
    setMessages(chatMessages)

    // Set the last message ID for tracking
    if (chatMessages.length > 0) {
      setLastMessageId(chatMessages[chatMessages.length - 1].id)
    }
  }

  const fetchMessages = async (silent = false) => {
    if (!conversation || !isAuthenticated) return

    try {
      const token = getAuthToken()
      const response = await fetch(`/api/chatbot/chat?action=get_messages&conversation_id=${conversation.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success && data.data.data) {
        const newMessages: Message[] = data.data.data.reverse().map((msg: any) => ({
          id: msg.id.toString(),
          text: msg.message,
          isBot: false,
          isAdmin: msg.is_admin,
          timestamp: new Date(msg.created_at),
          user: msg.user,
        }))

        // Check if there are actually new messages
        const currentLastMessageId = newMessages.length > 0 ? newMessages[newMessages.length - 1].id : null

        if (currentLastMessageId && currentLastMessageId !== lastMessageId) {
          setMessages(newMessages)
          setLastMessageId(currentLastMessageId)

          // Auto-scroll to bottom when new messages arrive
          setTimeout(scrollToBottom, 100)

          // Show notification for new messages if not silent and chat is closed
          if (!silent && newMessages.length > messages.length) {
            setHasNewMessage(true)
            if (!isOpen) {
              toast.info("New Message", "You have a new message from support")
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      if (!silent) {
        toast.error("Error", "Failed to fetch messages")
      }
    }
  }

  const sendAdminMessage = async (message: string) => {
    if (!conversation || !isAuthenticated) return

    try {
      const token = getAuthToken()
      const response = await fetch("/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "send_message",
          conversation_id: conversation.id,
          message,
          message_type: "text",
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Immediately fetch messages to show the sent message
        setTimeout(() => fetchMessages(true), 300)
        toast.success("Message Sent", "Your message has been sent")
      } else {
        addSystemMessage("Failed to send message. Please try again.")
        toast.error("Send Failed", "Could not send message")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      addSystemMessage("Failed to send message. Please try again.")
      toast.error("Send Failed", "Could not send message")
    }
  }

  const addSystemMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      isAdmin: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }

  const switchChatMode = (mode: "bot" | "admin") => {
    setChatMode(mode)
    setMessages([])
    setShowQuickReplies(mode === "bot")
    setHasNewMessage(false)
    setLastMessageId(null)

    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
  }

  // Fetch products from API
  const fetchProducts = async (action = "products", params = {}) => {
    try {
      setIsLoadingProducts(true)
      const searchParams = new URLSearchParams(params)
      const response = await fetch(`/api/chatbot?action=${action}&${searchParams.toString()}`)
      const data = await response.json()
      if (data.success) {
        return data.data
      } else {
        console.error("Failed to fetch products:", data.message)
        return []
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      return []
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const addBotMessage = (text: string, type = "text", data?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      type: type as any,
      data,
    }
    setMessages((prev) => [...prev, message])
  }

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }

  const simulateTyping = (callback: () => void, delay = 1000) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      callback()
    }, delay)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    if (chatMode === "admin") {
      addUserMessage(inputValue)
      sendAdminMessage(inputValue)
    } else {
      addUserMessage(inputValue)
      const userInput = inputValue.toLowerCase()
      setShowQuickReplies(false)
      simulateTyping(() => {
        processUserInput(userInput)
      })
    }

    setInputValue("")
  }

  const processUserInput = async (input: string) => {
    if (input.includes("price") || input.includes("cost") || input.includes("how much")) {
      await showProductPrices()
    } else if (input.includes("location") || input.includes("address") || input.includes("where")) {
      showStoreLocation()
    } else if (input.includes("faq") || input.includes("question") || input.includes("help")) {
      showFAQ()
    } else if (input.includes("financing") || input.includes("payment") || input.includes("installment")) {
      showFinancingInfo()
    } else if (input.includes("test drive") || input.includes("try")) {
      showTestDriveInfo()
    } else if (input.includes("contact") || input.includes("phone") || input.includes("call")) {
      showContactInfo()
    } else if (input.includes("warranty")) {
      addBotMessage(
        "All our E-Trikes come with a comprehensive 2-year warranty covering motor, battery, and electrical components. Frame warranty is 5 years. Would you like to know more about our warranty terms?",
      )
    } else if (input.includes("battery")) {
      addBotMessage(
        "Our E-Trike batteries typically last 40-60km on a single charge and have a lifespan of 3-5 years with proper maintenance. We use high-quality lithium-ion batteries. Need more battery specifications?",
      )
    } else if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      addBotMessage(
        "Hello! Great to hear from you! 😊 I'm here to help with any questions about our YAMAARAW E-Trikes. What would you like to know?",
      )
    } else if (input.includes("thank") || input.includes("thanks")) {
      addBotMessage("You're very welcome! 😊 Is there anything else I can help you with today?")
    } else {
      addBotMessage(
        "I'd be happy to help! I can assist you with product prices, store location, FAQ, financing options, or any other questions about our YAMAARAW E-Trikes. What interests you most?",
      )
    }

    setTimeout(() => setShowQuickReplies(true), 1000)
  }

  const showProductPrices = async () => {
    addBotMessage("Let me fetch our current YAMAARAW E-Trike models and prices for you...")
    const products = await fetchProducts("products")
    if (products.length > 0) {
      addBotMessage("Here are our current YAMAARAW E-Trike models and prices:", "products", products)
      setTimeout(() => {
        addBotMessage(
          `We have ${products.length} models available. All prices are subject to change and may vary based on customization. Would you like to know about financing options or schedule a test drive?`,
        )
      }, 1500)
    } else {
      addBotMessage(
        "I'm sorry, I couldn't fetch the current product prices at the moment. Please try again later or contact our store directly.",
      )
    }
  }

  const showStoreLocation = () => {
    const locationData = {
      address: "DRT Highway, Brgy. Cutcot, Pulilan, Bulacan, Bulacan, Philippines, 3005",
      hours: "Monday - Saturday: 8:00 AM - 6:00 PM\nSunday: 9:00 AM - 5:00 PM",
      phone: "+63 917 123 4567",
      email: "info@yamaaraw.ph",
    }
    addBotMessage("Here's our YAMAARAW store location and contact details:", "location", locationData)
    setTimeout(() => {
      addBotMessage(
        "We're easily accessible from major highways in Bulacan. Free parking available! Would you like directions or want to schedule a visit?",
      )
    }, 1500)
  }

  const showFAQ = () => {
    addBotMessage("Here are some frequently asked questions about YAMAARAW E-Trikes:", "faq", FAQ_DATA)
    setTimeout(() => {
      addBotMessage("Do any of these answer your question? If you need more specific information, feel free to ask!")
    }, 2000)
  }

  const showFinancingInfo = () => {
    addBotMessage(
      "💳 **YAMAARAW Financing Options:**\n\n✅ 0% Interest for qualified buyers\n✅ Down payment starts at 20%\n✅ Terms up to 36 months\n✅ Quick approval process\n✅ Flexible payment schedules\n✅ In-house financing available\n\nWould you like to apply or need more details about requirements?",
    )
  }

  const showTestDriveInfo = () => {
    addBotMessage(
      "🚗 **Test Drive Information:**\n\n✅ Free test drives available\n✅ Multiple YAMAARAW models to try\n✅ Bring valid driver's license\n✅ No appointment needed\n✅ Expert guidance provided\n✅ Test different terrains\n\nVisit us during business hours for your test drive experience!",
    )
  }

  const showContactInfo = () => {
    addBotMessage(
      "📞 **YAMAARAW Contact Information:**\n\n**Phone:** +63 917 123 4567\n**Email:** info@yamaaraw.ph\n**Website:** www.yamaaraw.ph\n**Address:** DRT Highway, Brgy. Cutcot, Pulilan, Bulacan\n\n**Business Hours:**\nMon-Sat: 8:00 AM - 6:00 PM\nSunday: 9:00 AM - 5:00 PM\n\nFeel free to call or visit us anytime!",
    )
  }

  const handleQuickReply = async (reply: string) => {
    addUserMessage(reply)
    setShowQuickReplies(false)
    simulateTyping(() => {
      processUserInput(reply.toLowerCase())
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const renderMessage = (message: Message) => {
    if (message.type === "products") {
      return (
        <div className="space-y-3">
          <p className="font-medium text-gray-800">{message.text}</p>
          {isLoadingProducts ? (
            <div className="flex items-center space-x-2 text-orange-600">
              <ETrikeLoader />
              <span>Loading products...</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {message.data.map((product: Product) => (
                <div key={product.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base truncate">{product.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">Model: {product.model}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <div className="text-xl font-bold text-orange-600">{formatPrice(product.price)}</div>
                      {product.original_price && product.original_price > product.price && (
                        <div className="text-sm text-gray-500 line-through">{formatPrice(product.original_price)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-orange-500 text-white text-xs">{product.category}</Badge>
                    {product.featured && <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>}
                    <Badge
                      className={`text-xs ${product.in_stock ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  {product.description && <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (message.type === "location") {
      return (
        <div className="space-y-3">
          <p className="font-medium text-gray-800">{message.text}</p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Store Address</h4>
                <p className="text-gray-700 text-sm">{message.data.address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                <p className="text-gray-700 text-sm whitespace-pre-line">{message.data.hours}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Phone</h4>
                <p className="text-gray-700 text-sm">{message.data.phone}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (message.type === "faq") {
      return (
        <div className="space-y-3">
          <p className="font-medium text-gray-800">{message.text}</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {message.data.map((faq: any, index: number) => (
              <details key={index} className="bg-orange-50 border border-orange-200 rounded-lg">
                <summary className="p-3 cursor-pointer font-medium text-gray-900 hover:bg-orange-100 rounded-lg">
                  {faq.question}
                </summary>
                <div className="px-3 pb-3 text-gray-700 text-sm">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      )
    }

    return <p className="whitespace-pre-line">{message.text}</p>
  }

  // Clear new message indicator when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false)
    }
  }, [isOpen])

  return (
    <>
      {/* Chat Button - Positioned to work with your floating layout */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 animate-pulse"
          }`}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="text-lg">👩‍💼</div>
              </div>
              <div
                className={`absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center ${hasNewMessage ? "animate-bounce" : ""}`}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
          )}
        </Button>
      </div>

      {/* Chat Window - Positioned to not interfere with other floating elements */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] sm:h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-orange-200 z-[9998] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  {chatMode === "bot" ? (
                    <div className="text-xl">👩‍💼</div>
                  ) : (
                    <User className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{chatMode === "bot" ? "Darlene" : "Support Chat"}</h3>
                  <p className="text-orange-100 text-sm">
                    {chatMode === "bot"
                      ? "YAMAARAW Assistant • Online"
                      : conversation?.admin
                        ? `${conversation.admin.name} • Online`
                        : "Waiting for admin..."}
                  </p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {/* Chat Mode Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => switchChatMode("bot")}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  chatMode === "bot" ? "bg-white text-orange-600" : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                <Bot className="w-4 h-4 inline mr-1" />
                AI Assistant
              </button>
              <button
                onClick={() => switchChatMode("admin")}
                disabled={!isAuthenticated}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors relative ${
                  chatMode === "admin"
                    ? "bg-white text-orange-600"
                    : "bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Live Support
                {hasNewMessage && chatMode !== "admin" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50">
            {isLoadingChat && (
              <div className="flex items-center justify-center py-8">
                <ETrikeLoader />
                <span className="ml-2 text-gray-600">Connecting to support...</span>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot || message.isAdmin ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-3 rounded-2xl ${
                    message.isBot || message.isAdmin
                      ? "bg-white border border-orange-200 text-gray-800"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  }`}
                >
                  {/* Show sender name for admin chat */}
                  {chatMode === "admin" && (message.isAdmin || message.user) && (
                    <div className="text-xs font-medium mb-1 opacity-75">
                      {message.isAdmin ? "Support Team" : message.user?.name || "You"}
                    </div>
                  )}

                  {renderMessage(message)}
                  <div
                    className={`text-xs mt-2 ${message.isBot || message.isAdmin ? "text-gray-500" : "text-orange-100"}`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-orange-200 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies - Only for bot mode */}
            {showQuickReplies && messages.length > 0 && chatMode === "bot" && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors border border-orange-300"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 border-t border-orange-200 bg-white">
            {chatMode === "admin" && !isAuthenticated ? (
              <div className="text-center text-gray-500 text-sm">Please log in to chat with our support team.</div>
            ) : (
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={chatMode === "bot" ? "Type your message..." : "Message support..."}
                  className="flex-1 p-2 sm:p-3 text-sm sm:text-base border border-orange-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2 text-center">
              {chatMode === "bot" ? "Powered by YAMAARAW AI Assistant" : "YAMAARAW Live Support"}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
