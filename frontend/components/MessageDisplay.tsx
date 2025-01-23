import { useMessages } from "@/context/useMessage";
import React, { useEffect, useState } from "react";

const MessageDisplay: React.FC = () => {
  const { message, type, setMessage } = useMessages();
  const [isVisible, setIsVisible] = useState(false); // Visibility management of the message

  useEffect(() => {
    if (message) {
      setIsVisible(true); // Show the message

      const timeoutId = setTimeout(() => {
        setIsVisible(false); // Hide the message with a delay before removing it
      }, 4500); // Wait for the animation to finish before hiding the message

      const removeMessageTimeoutId = setTimeout(() => {
        setMessage(null, type); // Remove the message after the transition
      }, 5000); // Remove after 5 seconds to ensure the animation is complete

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(removeMessageTimeoutId);
      };
    }
  }, [message, setMessage, type]);

  // Styles based on the message type
  const messageStyles = {
    success: "bg-green-500 text-white border-green-700",
    error: "bg-red-500 text-white border-red-700",
    info: "bg-blue-500 text-white border-blue-700",
    warning: "bg-yellow-500 text-black border-yellow-700",
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
      {message && (
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          } ${type ? messageStyles[type] : "bg-gray-500 text-white border-gray-700"} 
          border rounded-lg p-4 shadow-lg`}
        >
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  );
};

export default MessageDisplay;