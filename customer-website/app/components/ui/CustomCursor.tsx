"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 400, damping: 30, mass: 0.5 };
  const dotX = useSpring(mouseX, springConfig);
  const dotY = useSpring(mouseY, springConfig);

  const ringSpringConfig = { stiffness: 120, damping: 22, mass: 0.8 };
  const ringX = useSpring(mouseX, ringSpringConfig);
  const ringY = useSpring(mouseY, ringSpringConfig);

  useEffect(() => {
    const updatePos = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const updatePointer = () => {
      const el = document.elementFromPoint(mouseX.get(), mouseY.get());
      if (!el) return;
      const tag = el.tagName.toLowerCase();
      const isInteractive =
        tag === "button" || tag === "a" || tag === "input" ||
        tag === "textarea" || el.classList.contains("magnetic") ||
        window.getComputedStyle(el).cursor === "pointer";
      setIsPointer(isInteractive);
    };

    const onLeave  = () => setIsHidden(true);
    const onEnter  = () => setIsHidden(false);
    const onDown   = () => setIsPressed(true);
    const onUp     = () => setIsPressed(false);

    window.addEventListener("mousemove", updatePos);
    window.addEventListener("mousemove", updatePointer);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", updatePos);
      window.removeEventListener("mousemove", updatePointer);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: "1px solid rgba(212,175,55,0.5)",
          borderRadius: "50%",
        }}
        animate={{
          width: isPointer ? 56 : isPressed ? 28 : 36,
          height: isPointer ? 56 : isPressed ? 28 : 36,
          opacity: isHidden ? 0 : 1,
          borderColor: isPointer ? "#D4AF37" : "rgba(212,175,55,0.5)",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 5,
          height: 5,
          backgroundColor: "#D4AF37",
          borderRadius: "50%",
        }}
        animate={{
          scale: isPressed ? 0.5 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
