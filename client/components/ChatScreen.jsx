"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { chatBridge } from "./chatBridge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== "" || screenshots.length > 0) {
      const newMessage = {
        id: Date.now(),
        parts: inputMessage,
        screenshots: screenshots.map((file) => URL.createObjectURL(file)),
        role: "user",
      };

      setMessages([...messages, newMessage]);
      setInputMessage("");
      setScreenshots([]);
      setIsLoading(true);

      let partsOnly = false;
      let messagesToSend = await processMessages(messages, partsOnly);
      partsOnly = true;
      let promptToSend = await processMessages([newMessage], partsOnly);

      // Send message and receive response
      let response = await chatBridge(promptToSend[0], messagesToSend);
      const botResponse = {
        id: Date.now() + 1,
        parts: response.response,
        role: "model",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setIsLoading(false);
    }
  };

  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files);
    setScreenshots(files);
  };

  const openCarousel = (messageIndex, imgIndex) => {
    setCarouselIndex(imgIndex);
    setShowCarousel(messageIndex);
  };

  const closeCarousel = () => {
    setShowCarousel(false);
  };

  const prevImage = () => {
    if (carouselIndex > 0) {
      setCarouselIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextImage = (message) => {
    if (carouselIndex < message.screenshots.length - 1) {
      setCarouselIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, messageIndex) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-neutral-950 text-white"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.parts}
              </ReactMarkdown>
              {message.screenshots && message.screenshots.length > 0 && (
                <div className="mt-2 mb-2 grid grid-cols-2 gap-2">
                  {message.screenshots.slice(0, 3).map((screenshot, index) => (
                    <div
                      key={index}
                      onClick={() => openCarousel(messageIndex, index)}
                    >
                      <Image
                        src={screenshot}
                        alt={`screenshot-${index}`}
                        width={100}
                        height={100}
                        className="w-full h-24 object-cover rounded cursor-pointer"
                      />
                    </div>
                  ))}

                  {message.screenshots.length > 3 && (
                    <div
                      className="relative w-full h-24 rounded overflow-hidden cursor-pointer"
                      onClick={() => openCarousel(messageIndex, 3)}
                    >
                      <Image
                        src={message.screenshots[3]}
                        alt="screenshot-3"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                      {message.screenshots.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg">
                          +{message.screenshots.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-950 text-white px-4 py-2 rounded-lg">
              <LoadingAnimation />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 sm:px-6">
        <div className="flex space-x-3">
          <button
            onClick={() => fileInputRef.current.click()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            📎
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleScreenshotUpload}
            className="hidden"
            disabled={isLoading}
          />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Describe Testing Instructions
          </button>
        </div>
        {screenshots.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {screenshots.length} screenshot(s) ready to send
            </p>
          </div>
        )}
      </div>

      {/* Carousel Modal */}
      {showCarousel !== false && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="relative bg-white p-4 rounded-lg w-11/12 max-w-xs md:max-w-md lg:max-w-xl mx-auto flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeCarousel}
            >
              ✖
            </button>
            <div className="flex justify-between items-center w-full mt-6 mb-6">
              <button
                className="text-gray-600 hover:text-gray-900 text-2xl p-3"
                onClick={prevImage}
                disabled={carouselIndex === 0}
              >
                ⬅
              </button>
              <div className="flex justify-center w-full">
                <Image
                  src={messages[showCarousel].screenshots[carouselIndex]}
                  alt={`carousel-screenshot-${carouselIndex}`}
                  width={400}
                  height={400}
                  className="max-h-80 object-contain"
                />
              </div>
              <button
                className="text-gray-600 hover:text-gray-900 text-2xl p-3"
                onClick={() => nextImage(messages[showCarousel])}
                disabled={
                  carouselIndex ===
                  messages[showCarousel].screenshots.length - 1
                }
              >
                ➡
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingAnimation() {
  return (
    <div className="flex space-x-1">
      <div
        className="w-2 h-2 bg-white rounded-full animate-bounce"
        style={{ animationDelay: "0s" }}
      ></div>
      <div
        className="w-2 h-2 bg-white rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-2 h-2 bg-white rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
}

async function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function convertBlobUrlToBase64(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function processMessages(messages, partsOnly = false) {
  return Promise.all(
    messages.map(async ({ role, parts, screenshots }) => {
      let newParts = [parts];

      // Convert screenshots to base64 if they exist
      if (screenshots && screenshots.length > 0) {
        const base64Screenshots = await Promise.all(
          screenshots.map(async (url) => {
            const base64DataUrl = await convertBlobUrlToBase64(url); // Convert blob URL to base64
            return base64DataUrl.split(",")[1]; // Strip the metadata (data:image/png;base64,)
          })
        );

        // Create new parts array with the original text as the first element
        newParts = [parts, ...base64Screenshots];
      }

      if (partsOnly) {
        return newParts; // Return the array of parts only
      }

      return { role, parts: newParts }; // Return object with role and parts
    })
  );
}
