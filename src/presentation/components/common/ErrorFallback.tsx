import React from "react";
import { useRouteError } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorFallback: React.FC = () => {
  const error = useRouteError() as Error;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md"
      >
        <h1 className="text-3xl font-bold mb-4 text-red-400">Oops! Something went wrong.</h1>
        <p className="mb-2 text-sm text-gray-300">{error?.message ?? "Unknown error occurred"}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-all duration-200"
        >
          Reload Page
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ErrorFallback;
