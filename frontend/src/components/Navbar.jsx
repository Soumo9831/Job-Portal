import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import logo from "../assets/job-search.png";

const navItems = [
  { label: "Home", icon: "🏠", path: "/home" },
  { label: "Jobs", icon: "💼", path: "/jobs" },
  { label: "Browse", icon: "🔍", path: "/browse" },
];

const Navbar = () => {
  const navRefs = useRef([]);
  const canvasRef = useRef(null);

  // 3D Tilt Effect for Nav Items
  useEffect(() => {
    navRefs.current.forEach((nav) => {
      const handleMouseMove = (e) => {
        const rect = nav.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -y / 20;
        const rotateY = x / 20;
        gsap.to(nav, {
          rotationX,
          rotationY,
          transformPerspective: 500,
          ease: "power2.out",
          duration: 0.2,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(nav, {
          rotationX: 0,
          rotationY: 0,
          ease: "power2.out",
          duration: 0.2,
        });
      };

      nav.addEventListener("mousemove", handleMouseMove);
      nav.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        nav.removeEventListener("mousemove", handleMouseMove);
        nav.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);

  // Mini Flame Trail Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 80; // Navbar height

    const trail = [];
    const maxTrailLength = 15;

    const addTrailPoint = (x, y) => {
      trail.push({ x, y, opacity: 0.8, size: Math.random() * 4 + 2 });
      if (trail.length > maxTrailLength) {
        trail.shift();
      }
    };

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trail.forEach((point) => {
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.size);
        gradient.addColorStop(0, `rgba(57, 255, 20, ${point.opacity})`);
        gradient.addColorStop(1, `rgba(57, 255, 20, 0)`);
        ctx.beginPath();
        ctx.ellipse(point.x, point.y, point.size, point.size * 1.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        point.opacity -= 0.1;
        point.size = Math.max(1, point.size - 0.2);
      });
    };

    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      drawTrail();
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      addTrailPoint(mouseX, mouseY);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = 80;
    });

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Staggered animation for nav items
  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      },
    },
  };

  const navItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <motion.div
      className="w-screen sticky top-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-2xl border-b border-[#39ff14]/20"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Flame Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-auto z-0 opacity-50"
      ></canvas>

      <div className="flex items-center justify-between px-8 py-4 relative z-10">
        {/* Left - Logo + Title */}
        <motion.div
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative">
            <img
              src={logo}
              alt="logo"
              className="w-10 h-10 object-contain rounded-full border-2 border-[#39ff14]/50 
                         group-hover:shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300"
            />
            {/* Rotating neon border */}
            <div
              className="absolute inset-0 rounded-full border-2 border-[#39ff14]/30 animate-spin-slow 
                         group-hover:border-[#39ff14]/70"
            ></div>
          </div>
          <span
            className="text-2xl font-extrabold text-[#39ff14] drop-shadow-[0_0_5px_rgba(57,255,20,0.5)] 
                       group-hover:text-[#1b3c34] transition-colors duration-300"
          >
            Job Portal
          </span>
        </motion.div>

        {/* Right - Nav Links */}
        <motion.div
          className="flex items-center gap-8 text-[#39ff14] font-semibold"
          variants={navContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              ref={(el) => (navRefs.current[index] = el)}
              variants={navItemVariants}
              className="relative group"
              whileHover={{ y: -2, scale: 1.05, textShadow: "0 0 10px rgba(57, 255, 20, 0.7)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to={item.path}
                className="flex items-center gap-1 hover:text-[#1b3c34] transition duration-300 
                           ring-1 ring-[#39ff14]/20 group-hover:ring-[#39ff14]/50 rounded-md px-2 py-1"
              >
                <span>{item.icon}</span> {item.label}
              </Link>
              {/* Neon underline on hover */}
              <span
                className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-[#39ff14] transition-all duration-300 
                           group-hover:w-full group-hover:shadow-[0_0_8px_rgba(57,255,20,0.7)]"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Navbar;