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

      let messagesToSend = messages.map(({ role, parts }) => ({ role, parts }));
      // Here you would typically send the message to your LLM backend
      let response = await chatBridge(newMessage.parts, messagesToSend);
      console.log(response);
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          parts: response.response,
          role: "model",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 1000);
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 sm:px-6">
        <div className="flex space-x-3">
          <button
            onClick={() => fileInputRef.current.click()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
          />
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 text-gray-900"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send
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
