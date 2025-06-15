"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to extract content text from the nested API response
  const extractContentText = (data: unknown): string => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed = data as any;
      if (parsed?.output?.[0]?.content?.[0]?.text) {
        return parsed.output[0].content[0].text;
      }
      return typeof data === "string" ? data : JSON.stringify(data, null, 2);
    } catch {
      return typeof data === "string" ? data : JSON.stringify(data, null, 2);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch("https://xhexhi.app.n8n.cloud/webhook/lmao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      setResponse({
        success: res.ok,
        data: data,
      });
    } catch (error) {
      setResponse({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Email Agent
              </CardTitle>
              <CardDescription className="text-lg mt-2 text-gray-600">
                Send a message to get your email insights
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex gap-3"
            >
              <Input
                placeholder="Type your message here... (e.g., 'emails today')"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </motion.div>

            <AnimatePresence mode="wait">
              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`border-2 ${
                      response.success
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        {response.success ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        )}
                        <Badge
                          variant={response.success ? "default" : "destructive"}
                        >
                          {response.success ? "Success" : "Error"}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {response.success ? (
                          <div>
                            <h3 className="font-semibold text-lg mb-3 text-gray-800">
                              Email Summary:
                            </h3>
                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                              <div className="prose prose-sm max-w-none text-gray-700">
                                <ReactMarkdown
                                  components={{
                                    h1: ({ children }) => (
                                      <h1 className="text-xl font-bold mb-4 text-gray-800">
                                        {children}
                                      </h1>
                                    ),
                                    h2: ({ children }) => (
                                      <h2 className="text-lg font-semibold mb-3 text-gray-800">
                                        {children}
                                      </h2>
                                    ),
                                    h3: ({ children }) => (
                                      <h3 className="text-base font-semibold mb-2 text-gray-800">
                                        {children}
                                      </h3>
                                    ),
                                    strong: ({ children }) => (
                                      <strong className="font-semibold text-gray-900">
                                        {children}
                                      </strong>
                                    ),
                                    em: ({ children }) => (
                                      <em className="italic text-gray-600">
                                        {children}
                                      </em>
                                    ),
                                    ul: ({ children }) => (
                                      <ul className="list-disc pl-6 mb-4 space-y-1">
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="list-decimal pl-6 mb-4 space-y-1">
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => (
                                      <li className="text-gray-700 leading-relaxed">
                                        {children}
                                      </li>
                                    ),
                                    p: ({ children }) => (
                                      <p className="mb-3 leading-relaxed">
                                        {children}
                                      </p>
                                    ),
                                    hr: () => (
                                      <hr className="my-6 border-gray-200" />
                                    ),
                                  }}
                                >
                                  {extractContentText(response.data)}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-semibold text-lg mb-2 text-red-800">
                              Error:
                            </h3>
                            <p className="text-red-700 bg-white rounded-lg p-3 border border-red-200">
                              {response.error}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-blue-600 text-lg font-medium"
                >
                  Sending your message...
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          Built with React, Next.js, and shadcn/ui ✨
        </motion.div>
      </motion.div>
    </div>
  );
}
