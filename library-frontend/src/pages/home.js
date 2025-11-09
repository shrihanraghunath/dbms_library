import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Bookmark, Library } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center text-center px-6">
      {/* Animated header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl sm:text-6xl font-extrabold text-indigo-700 drop-shadow-md mb-4"
      >
        📚 Welcome to Your Library System
      </motion.h1>

      {/* Inspirational quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg sm:text-xl italic text-gray-700 max-w-2xl mb-10"
      >
        “A library is not a luxury but one of the necessities of life.” <br /> — Henry Ward Beecher
      </motion.p>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl"
      >
        <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition">
          <BookOpen className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-800">Explore Books</h3>
          <p className="text-gray-600 mt-2">
            Dive into thousands of titles and discover new worlds through reading.
          </p>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition">
          <Users className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-800">Manage Members</h3>
          <p className="text-gray-600 mt-2">
            Add, view, and manage members seamlessly in your digital library.
          </p>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition">
          <Bookmark className="w-12 h-12 text-pink-500 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-800">Track Borrowings</h3>
          <p className="text-gray-600 mt-2">
            Easily issue, return, and monitor borrowed books in real time.
          </p>
        </div>

        <div className="bg-white/90 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition">
          <Library className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-gray-800">Smart Library Tools</h3>
          <p className="text-gray-600 mt-2">
            Use utilities, functions, and automation to simplify management.
          </p>
        </div>
      </motion.div>

      
    </div>
  );
}
