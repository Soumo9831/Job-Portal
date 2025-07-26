import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";

// Animation variants for staggered text
const textVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const RecruiterHome = () => {
  const canvasRef = useRef(null);
  const buttonRefs = useRef([]);

  // Flames of Green Lights Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 200;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2;
        this.baseSize = this.size;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.opacity = 0.3;
        this.flameStrength = 0;
      }

      update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 250;
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 6;
          this.flameStrength = Math.min(this.flameStrength + 0.25, 2);
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force;
          this.y -= Math.sin(angle) * force * 1.5;
          this.size = this.baseSize * (1 + this.flameStrength * 1.5);
          this.opacity = Math.min(0.9, this.opacity + 0.15);
        } else {
          this.flameStrength = Math.max(this.flameStrength - 0.1, 0);
          this.size = Math.max(this.baseSize, this.size - 0.2);
          this.opacity = Math.max(0.3, this.opacity - 0.05);
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        );
        gradient.addColorStop(0, `rgba(57, 255, 20, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(57, 255, 20, 0)`);
        ctx.beginPath();
        ctx.ellipse(
          this.x,
          this.y,
          this.size,
          this.size * (1 + this.flameStrength * 0.5),
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const connectParticles = () => {
      const maxDistance = 100;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(57, 255, 20, ${0.4 * (1 - distance / maxDistance)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const trail = [];
    const maxTrailLength = 30;

    const addTrailPoint = (x, y) => {
      trail.push({ x, y, opacity: 1, size: Math.random() * 8 + 4 });
      if (trail.length > maxTrailLength) {
        trail.shift();
      }
    };

    const drawTrail = () => {
      trail.forEach((point) => {
        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          point.size
        );
        gradient.addColorStop(0, `rgba(57, 255, 20, ${point.opacity})`);
        gradient.addColorStop(1, `rgba(57, 255, 20, 0)`);
        ctx.beginPath();
        ctx.ellipse(
          point.x,
          point.y,
          point.size,
          point.size * 1.5,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.fill();
        point.opacity -= 0.05;
        point.size = Math.max(2, point.size - 0.2);
      });
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawTrail();
      particles.forEach((particle) => {
        particle.update(mouseX, mouseY);
        particle.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      addTrailPoint(mouseX, mouseY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 3D Tilt Effect for Buttons
  useEffect(() => {
    buttonRefs.current.forEach((button) => {
      const handleMouseMove = (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -y / 30;
        const rotateY = x / 30;
        gsap.to(button, {
          rotationX,
          rotationY,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.3,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          rotationX: 0,
          rotationY: 0,
          ease: "power2.out",
          duration: 0.3,
        });
      };

      button.addEventListener("mousemove", handleMouseMove);
      button.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        button.removeEventListener("mousemove", handleMouseMove);
        button.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);

  // Scroll-triggered animations for text and buttons
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el, index) => {
      gsap.fromTo(
        el,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#000000] overflow-hidden flex flex-col items-center justify-center px-8 md:px-20 py-16">
      {/* Flame Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mb-12 animate-on-scroll"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-[#39ff14] mb-4 
                     drop-shadow-[0_0_15px_rgba(57,255,20,0.7)] tracking-tight"
          variants={textVariants}
        >
          Hire Effective & Efficient Employees
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-gray-300 mb-8 
                     drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]"
          variants={textVariants}
        >
          Build Your Dream Team Today with Top Talent from Around the Globe!
        </motion.p>
      </motion.div>

      {/* Lottie Animation */}
      <motion.div
        className="w-[200px] md:w-[300px] lg:w-[400px] mb-12 animate-on-scroll"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
      >
        <DotLottieReact
          src="https://lottie.host/cab8b6e1-1eaa-4c4c-9838-0f58ad1cfc05/zZkacQGQXt.lottie"
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 0 20px rgba(57, 255, 20, 0.5))",
          }}
        />
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-6 animate-on-scroll">
        <Link
          to="/recruiterCompany"
          ref={(el) => (buttonRefs.current[0] = el)}
          className="relative bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-xl border border-[#39ff14]/30 
                     px-8 py-4 text-[#39ff14] font-bold text-lg md:text-xl 
                     flex items-center justify-center gap-2 
                     hover:bg-gradient-to-r hover:from-[#1b3c34] hover:via-[#39ff14] hover:to-[#1b3c34] 
                     hover:text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.7)] 
                     transition-all duration-500 group transform animate-pulse"
          style={{ perspective: "1000px" }}
        >
          <span className="relative z-10">🏢 Manage Companies</span>
          <div
            className="absolute inset-0 border-2 border-transparent 
                       group-hover:border-[#39ff14]/70 rounded-xl 
                       transition-all duration-500 pointer-events-none"
          ></div>
        </Link>
        <Link
          to="/recruiterJobs"
          ref={(el) => (buttonRefs.current[1] = el)}
          className="relative bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-xl border border-[#39ff14]/30 
                     px-8 py-4 text-[#39ff14] font-bold text-lg md:text-xl 
                     flex items-center justify-center gap-2 
                     hover:bg-gradient-to-r hover:from-[#1b3c34] hover:via-[#39ff14] hover:to-[#1b3c34] 
                     hover:text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.7)] 
                     transition-all duration-500 group transform animate-pulse"
          style={{ perspective: "1000px" }}
        >
          <span className="relative z-10">💼 Post Jobs</span>
          <div
            className="absolute inset-0 border-2 border-transparent 
                       group-hover:border-[#39ff14]/70 rounded-xl 
                       transition-all duration-500 pointer-events-none"
          ></div>
        </Link>
      </div>
    </div>
  );
};

export default RecruiterHome;