import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";

// Dummy job data
const dummyJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechNova Inc.",
    location: "Remote",
    salary: "$120,000 - $150,000",
    description: "Lead development of AI-driven applications for enterprise clients.",
    type: "Full-Time",
    postedAt: new Date("2025-06-01"),
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Insight Labs",
    location: "Mumbai",
    salary: "₹10,00,000 - ₹15,00,000",
    description: "Analyze large datasets to provide actionable business insights.",
    type: "Full-Time",
    postedAt: new Date("2025-05-20"),
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "CodeSmith Ltd.",
    location: "Bangalore",
    salary: "₹12,00,000 - ₹18,00,000",
    description: "Build scalable APIs and microservices for startup projects.",
    type: "Contract",
    postedAt: new Date("2025-04-15"),
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "PixelCraft Studios",
    location: "Delhi",
    salary: "₹8,00,000 - ₹12,00,000",
    description: "Design intuitive user interfaces for web and mobile apps.",
    type: "Part-Time",
    postedAt: new Date("2025-03-10"),
  },
];

// Modal Component
const JobModal = ({ isOpen, onClose, job, isEdit, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    company: job?.company || "",
    location: job?.location || "",
    salary: job?.salary || "",
    description: job?.description || "",
    type: job?.type || "",
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
              {isEdit ? "Edit Job" : "Add New Job"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Job Title"
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
              />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
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
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Salary Range"
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Job Description"
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
                rows="4"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] 
                           border border-[#39ff14]/20 focus:outline-none 
                           focus:ring-2 focus:ring-[#39ff14]/50 transition-all duration-300"
              >
                <option value="" className="bg-[#1a1a1a] text-[#39ff14]">Select Job Type</option>
                <option value="Full-Time" className="bg-[#1a1a1a] text-[#39ff14]">Full-Time</option>
                <option value="Part-Time" className="bg-[#1a1a1a] text-[#39ff14]">Part-Time</option>
                <option value="Contract" className="bg-[#1a1a1a] text-[#39ff14]">Contract</option>
              </select>
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
                {isEdit ? "Save Changes" : "Add Job"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Job Card Component
const JobCard = ({ job, onEdit }) => {
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

      <h2 className="text-xl font-bold text-[#39ff14] mb-2 group-hover:text-[#1b3c34] transition-colors duration-300">
        {job.title}
      </h2>
      <p className="text-gray-300 mb-2">{job.company}</p>
      <p className="text-sm text-gray-400">
        📍 <span className="font-semibold text-[#39ff14]">Location:</span> {job.location || "N/A"}
      </p>
      <p className="text-sm text-gray-400">
        💰 <span className="font-semibold text-[#39ff14]">Salary:</span> {job.salary || "N/A"}
      </p>
      <p className="text-sm text-gray-400">
        📅 <span className="font-semibold text-[#39ff14]">Posted:</span>{" "}
        {new Date(job.postedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>
      <p className="text-sm text-gray-400">
        🕒 <span className="font-semibold text-[#39ff14]">Type:</span> {job.type || "N/A"}
      </p>
      <p className="text-gray-300 mt-2 group-hover:text-white transition-colors duration-300">
        {job.description || "No description available."}
      </p>

      <div className="mt-4">
        <button
          onClick={() => onEdit(job)}
          className="w-full py-2 rounded-lg bg-[#1b3c34]/50 text-[#39ff14] font-bold 
                     border border-[#39ff14]/20 hover:bg-gradient-to-r hover:from-[#1b3c34] hover:via-[#39ff14] hover:to-[#1b3c34] 
                     hover:text-black hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] 
                     transition-all duration-300 animate-pulse"
        >
          ✏️ Edit
        </button>
      </div>
    </div>
  );
};

const RecruiterJobs = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const canvasRef = useRef(null);

  const handleEdit = (job) => {
    setSelectedJob(job);
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
    const cards = document.querySelectorAll(".job-card");
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
        💼 Manage Your Job Listings
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

      {/* Add New Job Button */}
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
          <span className="relative z-10">➕ Add New Job</span>
          <div
            className="absolute inset-0 border-2 border-transparent 
                       group-hover:border-[#39ff14]/70 rounded-xl 
                       transition-all duration-500 pointer-events-none"
          ></div>
        </button>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {dummyJobs.map((job) => (
          <JobCard key={job.id} job={job} onEdit={handleEdit} />
        ))}
      </div>

      {/* Modals */}
      <JobModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        job={selectedJob}
        isEdit={true}
        onSubmit={handleSubmit}
      />
      <JobModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        job={null}
        isEdit={false}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RecruiterJobs;