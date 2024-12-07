"use client";

import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../app/axios/instance"; // Import axios instance
import ReactMarkdown from 'react-markdown';

type Message = {
  id: number;
  user_message?: string;
  bot_reply?: string;
  user_id: number;
  created_at?: string;
};

type RequestData = {
  request_id: number; // We will store this value to send with each message
};

export default function Chat() {
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [requestData, setRequestData] = useState<RequestData | null>(null); // Store request_id
  const [isFirstMessageSent, setIsFirstMessageSent] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Fetch messages and request ID when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get("/messages/2"); // Adjust the endpoint as needed
        const fetchedMessages = response.data.map((msg: any) => ({
          id: Date.now(), // You can use a unique id if available
          user_message: msg.sender === "user" ? msg.content : undefined,
          bot_reply: msg.sender === "bot" ? msg.content : undefined,
          created_at: msg.timestamp,
          user_id: msg.sender === "user" ? 1 : 2, // Set user_id based on sender
        }));
        setMessages(fetchedMessages); // Set the fetched messages
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);


  // Scroll to the latest message whenever the message list updates
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handlePromptSend = async () => {
    if (prompt.trim()) {
      // If it's the first message, create a new request
      if (!isFirstMessageSent) {
        try {
          const response = await axiosInstance.post("/create_request/", {
            title: prompt, // Set the prompt as the title of the request
            status: "Готов",
          });

          const { request_id } = response.data; // Dynamically set request_id from response
          setRequestData({ request_id }); // Set the request_id in the state
          setIsFirstMessageSent(true); // Mark that the first message has been sent

          // Add the first user message after creating the request
          const newMessage: Message = {
            id: Date.now(),
            user_message: prompt,
            user_id: 1,
            created_at: new Date().toISOString(),
          };

          setMessages((prev) => [
            ...prev,
            newMessage,
          ]);

          // Proceed with sending the user's message to the bot
          const botResponse = await axiosInstance.post("/chatbot", {
            request_id: request_id, // Use the dynamically fetched request_id
            user_message: prompt,
          });

          const botReply = botResponse.data.bot_reply;

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              bot_reply: botReply,
              user_id: 2,
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (error) {
          console.error("Error creating request or sending message:", error);
        }
      } else {
        // If the request already exists, just send the user's message
        const newMessage: Message = {
          id: Date.now(),
          user_message: prompt,
          user_id: 1,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [
          ...prev,
          newMessage,
        ]);

        try {
          const response = await axiosInstance.post("/chatbot", {
            request_id: requestData?.request_id, // Send the existing request_id
            user_message: prompt,
          });

          const botReply = response.data.bot_reply;

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              bot_reply: botReply,
              user_id: 2,
              created_at: new Date().toISOString(),
            },
          ]);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }

      setPrompt(""); // Clear input field
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePromptSend();
    }
  };

  return (
    <div className="form mx-auto rounded-lg flex flex-col h-screen relative mt-[-60px]">
        <div className="bg-[#02050c] px-[10%] py-5 pb-[100px] rounded-md shadow-md flex-grow overflow-y-auto h-[60%] relative">
            {!messages.length && (
                <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[20px] text-600 text-gray-200 text-center">
                    Добро пожаловать в чат! <br/> Здесь вы можете написать свой запрос и система подберет лучших кандидатов по вашим требованиям.
                </p>
                </div>
            )}


        {/* Выводим сообщения */}
        {messages.map((msg, index) => (
          <div key={index}>
            {/* Сообщение от пользователя */}
            {msg.user_message && (
              <div className="flex justify-end mb-4">
                <div className="px-4 py-2 rounded-lg max-w-[60%] bg-[#524be7] text-white">
                  <ReactMarkdown>{msg.user_message}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Ответ от бота */}
            {msg.bot_reply && (
              <div className="flex justify-start mb-4">
                <div className="px-4 py-2 rounded-lg max-w-[60%] bg-gray-700 text-gray-200">
                  <ReactMarkdown>{msg.bot_reply.replace(/12345678!!!/g, "").trim()}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={lastMessageRef}></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-[5px] pb-[50px] bg-[#02050c] flex items-center justify-center w-full">
        <div className="w-[90%] flex items-center justify-center">
          <div className="relative w-full">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow p-3 w-full border border-white-300 rounded-md resize-none shadow-sm text-sm mr-2 rounded-full bg-[#030712] "
              rows={1}
              placeholder="Напишите ваш запрос здесь..."
            ></textarea>
            <button
              type="button"
              onClick={handlePromptSend}
              className="absolute right-[0.55%] bottom-[17.5%] bg-[#524be7] text-white px-2 py-1 rounded bg-[] hover:bg-[#524be7]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="fill-white w-[20px]">
                <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
