import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";

// Dummy company data (same as Browse.jsx)
const dummyCompanies = [
  {
    id: 1,
    name: "TechNova Inc.",
    description: "Leading AI solutions provider for global enterprises.",
    website: "https://technova.com",
    location: "Remote",
    logo: "https://via.placeholder.com/100",
    userId: "507f1f77bcf86cd799439011",
    createdAt: new Date("2024-06-01"),
  },
  {
    id: 2,
    name: "Insight Labs",
    description: "Data analytics firm specializing in actionable insights.",
    website: "https://insightlabs.io",
    location: "Mumbai",
    logo: "https://via.placeholder.com/100",
    userId: "507f1f77bcf86cd799439012",
    createdAt: new Date("2023-09-15"),
  },
  {
    id: 3,
    name: "CodeSmith Ltd.",
    description: "Building scalable backend systems for startups.",
    website: "https://codesmith.dev",
    location: "Bangalore",
    logo: "https://via.placeholder.com/100",
    userId: "507f1f77bcf86cd799439013",
    createdAt: new Date("2022-03-10"),
  },
  {
    id: 4,
    name: "PixelCraft Studios",
    description: "Creative agency for UI/UX and graphic design.",
    website: "https://pixelcraft.studio",
    location: "Delhi",
    logo: "https://via.placeholder.com/100",
    userId: "507f1f77bcf86cd799439014",
    createdAt: new Date("2021-12-05"),
  },
];

// Modal Component
const CompanyModal = ({ isOpen, onClose, company, isEdit, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    description: company?.description || "",
    website: company?.website || "",
    location: company?.location || "",
    logo: company?.logo || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#1a1a1a]/90 backdrop-blur-2xl rounded-2xl border border-[#39ff14]/30 
                       p-8 w-full max-w-md mx-4 shadow-[0_0_30px_rgba(57,255,20,0.3)]"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold text-[#39ff14] mb-6">
              {isEdit ? "Edit Company" : "Add New Company"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
                rows="4"
              />
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website URL"
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
              />
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="Logo URL"
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 hover:bg-[#1b3c34] 
                           hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] 
                           transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#1b3c34] via-[#39ff14] to-[#1b3c34] 
                           text-black font-bold hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] 
                           transition-all duration-300 animate-pulse"
              >
                {isEdit ? "Save Changes" : "Add Company"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Company Card Component
const CompanyCard = ({ company, onEdit }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -y / 50;
      const rotateY = x / 50;
      gsap.to(card, {
        rotationX,
        rotationY,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        ease: "power2.out",
        duration: 0.3,
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-2xl border border-[#39ff14]/30 p-6 
                 transform transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] 
                 cursor-pointer shadow-lg overflow-hidden group"
      style={{ perspective: "1000px" }}
    >
      {/* Glowing border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#39ff14]/70 
                      transition-all duration-500 rounded-2xl pointer-events-none"></div>

      <div className="flex items-center mb-4">
        <img
          src={company.logo || "https://via.placeholder.com/50"}
          alt={`${company.name} logo`}
          className="w-12 h-12 rounded-full mr-4 object-cover border border-[#39ff14]/30"
        />
        <h2 className="text-xl font-bold text-[#39ff14] group-hover:text-[#1b3c34] transition-colors duration-300">
          {company.name}
        </h2>
      </div>

      <p className="text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
        {company.description || "No description available."}
      </p>
      <p className="text-sm text-gray-400">
        📍 <span className="font-semibold text-[#39ff14]">Location:</span> {company.location || "N/A"}
      </p>
      <p className="text-sm text-gray-400">
        🌐 <span className="font-semibold text-[#39ff14]">Website:</span>{" "}
        {company.website ? (
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[#39ff14] hover:underline">
            Visit
          </a>
        ) : (
          "N/A"
        )}
      </p>
      <p className="text-sm text-gray-400 mb-3">
        📅 <span className="font-semibold text-[#39ff14]">Founded:</span>{" "}
        {new Date(company.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
      </p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => onEdit(company)}
          className="w-full py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] font-bold 
                     border border-[#39ff14]/20 hover:bg-gradient-to-r hover:from-[#1b3c34] hover:via-[#39ff14] hover:to-[#1b3c34] 
                     hover:text-black hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] 
                     transition-all duration-300 animate-pulse"
        >
          ✏️ Edit
        </button>
        <a
          href={company.website || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 text-center rounded-lg bg-gradient-to-r from-[#1b3c34] via-[#39ff14] to-[#1b3c34] 
                     text-black font-bold shadow-xl transform hover:scale-105 
                     hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] transition-all duration-300 
                     ease-in-out animate-pulse ring-2 ring-[#39ff14]/30"
        >
          🌐 Visit Website
        </a>
      </div>
    </div>
  );
};

const RecruiterCompany = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const canvasRef = useRef(null);

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleSubmit = () => {
    // Placeholder for submit logic
    setEditModalOpen(false);
    setAddModalOpen(false);
  };

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

  // Scroll-triggered animations for cards
  useEffect(() => {
    const cards = document.querySelectorAll(".company-card");
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <div className="relative min-h-screen px-8 md:px-20 py-10 bg-[#000000] overflow-hidden">
      {/* Flame Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      {/* Hero Section */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#39ff14] mb-6 text-center 
                     drop-shadow-[0_0_10px_rgba(57,255,20,0.7)]">
        🌟 Manage Your Companies
      </h1>

      {/* Lottie Animation */}
      <div className="flex justify-center mb-10">
        <motion.div
          className="w-[200px] md:w-[300px] lg:w-[400px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
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
      </div>

      {/* Add New Company Button */}
      <div className="flex justify-center mb-10">
        <button
          onClick={handleAdd}
          className="relative bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-xl border border-[#39ff14]/30 
                     px-8 py-4 text-[#39ff14] font-bold text-lg md:text-xl 
                     flex items-center justify-center gap-2 
                     hover:bg-gradient-to-r hover:from-[#1b3c34] hover:via-[#39ff14] hover:to-[#1b3c34] 
                     hover:text-black hover:shadow-[0_0_30px_rgba(57,255,20,0.7)] 
                     transition-all duration-500 group transform animate-pulse"
        >
          <span className="relative z-10">➕ Add New Company</span>
          <div
            className="absolute inset-0 border-2 border-transparent 
                       group-hover:border-[#39ff14]/70 rounded-xl 
                       transition-all duration-500 pointer-events-none"
          ></div>
        </button>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {dummyCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} onEdit={handleEdit} />
        ))}
      </div>

      {/* Modals */}
      <CompanyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        company={selectedCompany}
        isEdit={true}
        onSubmit={handleSubmit}
      />
      <CompanyModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        company={null}
        isEdit={false}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RecruiterCompany;