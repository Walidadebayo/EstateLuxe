"use client";

import { useState, useEffect, useRef } from "react";
import {
  Attachment,
  Chat,
  ChatActionExecuteEvent,
  ChatMessageSendEvent,
  ChatMessageTemplateProps,
  type ChatMessageProps,
} from "@progress/kendo-react-conversational-ui";
import { Button } from "@progress/kendo-react-buttons";
import { Popup } from "@progress/kendo-react-popup";
import { Bot, MessageSquare, Info } from "lucide-react";

import { mockProperties } from "@/lib/mock-data";
import type { PropertyType } from "@/lib/types";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { SvgIcon } from "@progress/kendo-react-common";
import { homeIcon, xIcon } from "@progress/kendo-svg-icons";
import getAIResponse from "@/lib/ai-service";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the user
const user = {
  id: 1,
  name: "User",
  avatarUrl:
    "https://www.shareicon.net/download/2015/08/07/81317_man_512x512.png",
};

// Define the AI assistant
const bot = {
  id: 0,
  name: "EstateLuxeAI",
  avatarUrl:
    "https://pixcap.com/cdn/library/template/1730133919120/thumbnail/AI_Research_3D_Icon_transparent_400_emp.webp",
};

// Define message types
interface ExtendedChatMessage extends ChatMessageProps {
  author: typeof bot | typeof user;
  suggestedActions?: Array<{
    type: string;
    title: string;
    value: string;
  }>;
  attachments?: Attachment[];
  typing?: boolean;
  timestamp?: Date;
  text?: string;
}

export default function AiAssistant() {
  const router = useRouter();
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState("");
  const chatButtonRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Initial greeting when chat is opened
  useEffect(() => {
    if (showChat && messages.length === 0) {
      const initialMessage: ExtendedChatMessage = {
        author: bot,
        timestamp: new Date(),
        text: "Hello! I'm EstateLuxeAI, your real estate assistant. How can I help you today?",
        suggestedActions: [
          {
            type: "reply",
            title: "Find properties",
            value: "I want to find properties",
          },
          {
            type: "reply",
            title: "Property advice",
            value: "I need advice about real estate",
          },
          {
            type: "reply",
            title: "Mortgage calculator",
            value: "Help me calculate mortgage payments",
          },
          {
            type: "reply",
            title: "What can i do?",
            value: "What can you do?",
          },
        ],
        item: {
          author: bot,
          selectionIndex: 0,
        },
        onRequestSelection: () => {},
        isFirstItemInGroup: false,
        isLastItemInGroup: false,
        isOnlyItemInGroup: false,
        selected: false,
      };
      setMessages([initialMessage]);

      // Add initial message to chat history
      setChatHistory(
        "EstateLuxeAI: Hello! I'm EstateLuxeAI, your real estate assistant. How can I help you today?",
      );
    }
  }, [showChat, messages.length, pathname]);

  const handleSendMessage = async (event: ChatMessageSendEvent) => {
    const userMessage: ExtendedChatMessage = {
      author: user,
      timestamp: new Date(),
      text: event.message.text,
      item: {
        author: user,
        selectionIndex: 0,
      },
      onRequestSelection: () => {},
      isFirstItemInGroup: false,
      isLastItemInGroup: false,
      isOnlyItemInGroup: false,
      selected: false,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Add user message to chat history
    const updatedHistory = `${chatHistory}\nUser: ${userMessage.text}`;
    setChatHistory(updatedHistory);

    // Show typing indicator
    // setIsProcessing(true);
    const typingMessage: ExtendedChatMessage = {
      author: bot,
      timestamp: new Date(),
      text: "",
      typing: true,
      item: {
        author: bot,
        selectionIndex: 0,
      },
      onRequestSelection: () => {},
      isFirstItemInGroup: false,
      isLastItemInGroup: false,
      isOnlyItemInGroup: false,
      selected: false,
    };
    setMessages([...newMessages, typingMessage]);

    // Process the user's message and generate a response using the API
    try {
      // const response = await fetch("/api/ai-service", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ userMessage: userMessage.text, chatHistory }),
      // });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }
      // const data = await response.json();
      // console.log("AI response:", data);

      const fullText = await getAIResponse({
        userMessage: userMessage.text,
        chatHistory,
      });

      // Complete the response
      // setIsProcessing(false);

      // Update chat history with AI response
      setChatHistory(`${updatedHistory}\nEstateLuxeAI: ${fullText}`);

      // Replace typing message with final message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;

        // Check if we need to add property attachments
        const propertyAttachments = getPropertyAttachmentsIfNeeded(
          // fullText,
          userMessage.text || "",
        );

        updatedMessages[lastIndex] = {
          item: {
            author: bot,
            selectionIndex: 0,
          },
          author: bot,
          timestamp: new Date(),
          text: fullText,
          typing: false,
          attachments: propertyAttachments,
          suggestedActions: getSuggestedActionsForResponse(
            fullText,
            userMessage.text || "",
          ),
          onRequestSelection: () => {},
          isFirstItemInGroup: false,
          isLastItemInGroup: false,
          isOnlyItemInGroup: false,
          selected: false,
        };
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      // setIsProcessing(false);
    }
  };

  const handleSuggestedActionClick = async (event: ChatActionExecuteEvent) => {
    const { value } = event.action;
    const userMessage: ExtendedChatMessage = {
      author: user,
      timestamp: new Date(),
      text: value,
      item: {
        author: user,
        selectionIndex: 0,
      },
      onRequestSelection: () => {},
      isFirstItemInGroup: false,
      isLastItemInGroup: false,
      isOnlyItemInGroup: false,
      selected: false,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Add user message to chat history
    const updatedHistory = `${chatHistory}\nUser: ${value}`;
    setChatHistory(updatedHistory);

    // Show typing indicator
    // setIsProcessing(true);
    const typingMessage: ExtendedChatMessage = {
      author: bot,
      timestamp: new Date(),
      text: "",
      typing: true,
      item: {
        author: bot,
        selectionIndex: 0,
      },
      onRequestSelection: () => {},
      isFirstItemInGroup: false,
      isLastItemInGroup: false,
      isOnlyItemInGroup: false,
      selected: false,
    };
    setMessages([...newMessages, typingMessage]);

    // Process the suggested action and generate a response using the API
    try {
      const response = await fetch("/api/ai-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage: value, chatHistory }),
      });

      const data = await response.json();
      const fullText = data.response;

      // Complete the response
      // setIsProcessing(false);

      // Update chat history with AI response
      setChatHistory(`${updatedHistory}\nEstateLuxeAI: ${fullText}`);

      // Replace typing message with final message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;

        // Check if we need to add property attachments
        const propertyAttachments = getPropertyAttachmentsIfNeeded(
          // fullText,
          value,
        );

        updatedMessages[lastIndex] = {
          item: {
            author: bot,
            selectionIndex: 0,
          },
          author: bot,
          timestamp: new Date(),
          text: fullText,
          typing: false,
          attachments: propertyAttachments,
          suggestedActions: getSuggestedActionsForResponse(fullText, value),
          onRequestSelection: () => {},
          isFirstItemInGroup: false,
          isLastItemInGroup: false,
          isOnlyItemInGroup: false,
          selected: false,
        };
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      // setIsProcessing(false);
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    setShowPopover(false);
  };

  const handlePopoverOpen = () => {
    if (!showChat) {
      setShowPopover(true);
    }
  };

  const handlePopoverClose = () => {
    setShowPopover(false);
  };

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
    setShowChat(false);
  };

  // Function to get property attachments if needed based on the AI response and user query
  const getPropertyAttachmentsIfNeeded = (
    userQuery: string,
  ): Attachment[] | undefined => {
    const userQueryLower = userQuery.toLowerCase();

    // Check if the query is about finding properties
    if (
      (userQueryLower.includes("find") ||
        userQueryLower.includes("show") ||
        userQueryLower.includes("list")) &&
      (userQueryLower.includes("property") ||
        userQueryLower.includes("properties") ||
        userQueryLower.includes("home") ||
        userQueryLower.includes("house"))
    ) {
      const recommendedProperties = getRecommendedProperties(5);

      return recommendedProperties.map((property) => ({
        content: createPropertyCard(property, handlePropertyClick),
        contentType: "component",
      }));
    }

    // Check if the query is about properties under a certain price
    if (
      (userQueryLower.includes("under") ||
        userQueryLower.includes("below") ||
        userQueryLower.includes("less than")) &&
      (userQueryLower.includes("$") ||
        userQueryLower.includes("dollar") ||
        userQueryLower.match(/\d+k/) ||
        userQueryLower.match(/\d+,\d+/))
    ) {
      // Extract price limit (simplified)
      let priceLimit = 500000; // Default

      // Try to extract a price from the query
      const priceMatch = userQueryLower.match(/\$(\d+[,\d]*)/);
      if (priceMatch) {
        priceLimit = Number.parseInt(priceMatch[1].replace(/,/g, ""));

        // Check if it's in thousands (e.g., $500k)
        if (userQueryLower.includes("k") && priceLimit < 1000) {
          priceLimit *= 1000;
        }
      }

      const affordableProperties = mockProperties
        .filter((p) => p.price < priceLimit)
        .slice(0, 3);

      return affordableProperties.map((property) => ({
        content: createPropertyCard(property, handlePropertyClick),
        contentType: "component",
      }));
    }

    return undefined;
  };

  // Function to get suggested actions based on the AI response and user query
  const getSuggestedActionsForResponse = (
    aiResponse: string,
    userQuery: string,
  ) => {
    const userQueryLower = userQuery.toLowerCase();
    const aiResponseLower = aiResponse.toLowerCase();

    // Default suggested actions
    let suggestedActions = [
      {
        type: "reply",
        title: "Find properties",
        value: "I want to find properties",
      },
      {
        type: "reply",
        title: "Property advice",
        value: "I need advice about real estate",
      },
    ];

    // If the query is about finding properties
    if (
      (userQueryLower.includes("find") || userQueryLower.includes("show")) &&
      (userQueryLower.includes("property") || userQueryLower.includes("home"))
    ) {
      suggestedActions = [
        {
          type: "reply",
          title: "Show more properties",
          value: "Show me more properties",
        },
        {
          type: "reply",
          title: "Filter by price",
          value: "I want to filter properties by price",
        },
      ];
    }

    // If the query is about mortgage calculations
    else if (
      userQueryLower.includes("mortgage") ||
      userQueryLower.includes("calculate") ||
      userQueryLower.includes("payment")
    ) {
      suggestedActions = [
        {
          type: "reply",
          title: "Calculate for $500,000",
          value:
            "Calculate mortgage for $500,000 with 20% down payment and 4.5% interest rate",
        },
        {
          type: "reply",
          title: "Show affordable homes",
          value: "Show me homes I can afford with a $2,500 monthly payment",
        },
      ];
    }

    // If the query is about real estate advice
    else if (
      userQueryLower.includes("advice") ||
      userQueryLower.includes("tip") ||
      userQueryLower.includes("recommend")
    ) {
      suggestedActions = [
        {
          type: "reply",
          title: "More advice",
          value: "Give me more real estate advice",
        },
        {
          type: "reply",
          title: "First-time buyer tips",
          value: "What should first-time home buyers know?",
        },
      ];
    }

    // If AI response indicates certain keywords
    if (
      aiResponseLower.includes("property") ||
      aiResponseLower.includes("home")
    ) {
      suggestedActions.push({
        type: "reply",
        title: "Show more properties",
        value: "Show me more properties",
      });
    }

    return suggestedActions;
  };

  // Function to get recommended properties
  const getRecommendedProperties = (
    count: number,
    offset = false,
  ): PropertyType[] => {
    const startIndex = offset ? 3 : 0;
    return mockProperties.slice(startIndex, startIndex + count);
  };

  // Function to create a property card component
  const createPropertyCard = (
    property: PropertyType,
    onClick: (id: string) => void,
  ) => {
    return (
      <div
        className="property-card rounded-lg mb-2 hover:shadow-md hover:p-2 transition-all cursor-pointer h-full"
        onClick={() => onClick(property.id)}
      >
        <div className="">
          <Image
            width={300}
            height={200}
            src={property.image || `/placeholder.svg`}
            alt={property.name}
            className="object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-sm truncate">{property.name}</h3>
            <p className="text-xs text-foreground">{property.location}</p>
            <div className="flex justify-between text-xs mt-1">
              <span className="flex items-center gap-1">
                <SvgIcon icon={homeIcon} /> {property.bedrooms}bd/
                {property.bathrooms}ba
              </span>
              <span className="font-bold text-primary">
                ${property.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Custom message template to handle typing indicator
  const messageTemplate = (props: ChatMessageTemplateProps) => {
    const message = props.item;

    return (
      <div className="k-chat-bubble">
        <span>{message.text}</span>
      </div>
    );
  };

  // disable body scroll when chat is open and isMobile
  useEffect(() => {
    if (showChat && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showChat, isMobile]);

  // Close chat when navigating to a different page
  useEffect(() => {
    const handleRouteChange = () => {
      setShowChat(false);
      setShowPopover(false);
    };

    window.addEventListener("locationchange", handleRouteChange);
    return () => {
      window.removeEventListener("locationchange", handleRouteChange);
      setShowChat(false);
      setShowPopover(false);
    };
  }, [pathname]);

  return (
    pathname !== "/ai-assistant" && (
      <>
        {/* Chat button */}
        <div
          ref={chatButtonRef}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center z-50"
        >
          <Button
            className="shadow-lg !rounded-full w-14 h-14 hover:scale-110 transition-transform duration-300"
            themeColor="primary"
            onClick={toggleChat}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            {showChat ? <SvgIcon icon={xIcon} /> : <MessageSquare size={24} />}
          </Button>
        </div>

        {/* Popover hint */}
        <Popup
          anchor={chatButtonRef.current as HTMLElement | null}
          show={showPopover}
          anchorAlign={{
            horizontal: "center",
            vertical: "top",
          }}
          popupAlign={{
            horizontal: "center",
            vertical: "bottom",
          }}
          className="mb-2 rounded-2xl "
        >
          <div className="p-1 bg-background dark:bg-[#1f2937]">
            <p className="text-xs">Chat with EstateLuxeAI</p>
          </div>
        </Popup>

        {/* Chat window */}
        {showChat && (
          <div
            className={`fixed right-0
            ${
              !isMobile
                ? "md:w-[400px] lg:w-[500px] bottom-24"
                : "w-full h-screen"
            }
             bg-white dark:bg-[#1f2937] rounded-lg shadow-lg z-50`}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bot className="text-primary" size={20} />
                <span className="text-lg font-semibold">
                  EstateLuxeAI Assistant
                </span>
              </div>
              <Button
                fillMode="flat"
                startIcon={<SvgIcon icon={xIcon} />}
                onClick={toggleChat}
                className="p-1"
              />
            </div>
            <div className="p-4 h-full">
              <Chat
                user={user}
                messages={messages}
                onMessageSend={handleSendMessage}
                placeholder="Type your question..."
                width="100%"
                onActionExecute={handleSuggestedActionClick}
                messageTemplate={messageTemplate}
              />
            </div>
            <span className="flex items-center justify-center gap-1 w-full text-xs text-gray-500 mb-2">
              <Info size={12} /> Powered by Google Gemini
            </span>
          </div>
        )}
      </>
    )
  );
}
