import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";

// Scroll Progress Indicator Component
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-800 origin-left z-50"
      style={{ scaleX }}
    />
  );
};

// Floating Action Button Component
export const FloatingActionButton = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);
  const scale = useTransform(scrollY, [0, 300], [0.8, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-zinc-700 to-zinc-800 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center z-40 backdrop-blur-sm border border-white/20 transition-all duration-200 cursor-pointer"
      style={{ opacity, scale }}
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8 }}
    >
      <ArrowUp className="w-6 h-6" />
    </motion.button>
  );
};