import React, { useEffect, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

// Dummy job data
const latestJobs = [
  {
    id: 101,
    title: "AI Research Intern",
    description: "Work with state-of-the-art ML models to build scalable AI solutions.",
    requirements: ["Python", "TensorFlow", "NLP"],
    salary: 20000,
    location: "Remote",
    jobType: "internship",
    position: "Intern",
    company: "BrainForge AI",
  },
  {
    id: 102,
    title: "UI/UX Designer",
    description: "Craft elegant and user-friendly designs with Figma.",
    requirements: ["Figma", "Design Systems", "User Research"],
    salary: 50000,
    location: "Chennai",
    jobType: "contract",
    position: "Designer",
    company: "DesignGrid",
  },
  {
    id: 103,
    title: "DevOps Engineer",
    description: "Automate CI/CD pipelines and manage cloud infrastructure.",
    requirements: ["AWS", "Docker", "Jenkins"],
    salary: 100000,
    location: "Remote",
    jobType: "full-time",
    position: "DevOps",
    company: "CloudCore",
  },
  {
    id: 104,
    title: "Content Strategist",
    description: "Develop engaging content strategies for tech audiences.",
    requirements: ["SEO", "Copywriting", "Analytics"],
    salary: 45000,
    location: "Kolkata",
    jobType: "part-time",
    position: "Writer",
    company: "TechTales",
  },
  {
    id: 105,
    title: "Sales Executive",
    description: "Drive B2B sales and build strong client relationships.",
    requirements: ["CRM Tools", "Cold Calling", "Communication"],
    salary: 30000,
    location: "Pune",
    jobType: "full-time",
    position: "Sales",
    company: "GrowBiz Solutions",
  },
  {
    id: 106,
    title: "Mobile App Developer",
    description: "Develop and deploy cross-platform mobile apps.",
    requirements: ["Flutter", "Firebase", "REST APIs"],
    salary: 80000,
    location: "Hyderabad",
    jobType: "full-time",
    position: "Mobile Dev",
    company: "AppNest",
  },
];

// Job Card Component
const JobCard = ({ job }) => {
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
      className="job-card relative bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-2xl border border-[#39ff14]/30 p-6 
                 transform transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] 
                 cursor-pointer shadow-lg overflow-hidden group"
      style={{ perspective: "1000px" }}
    >
      {/* Glowing border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#39ff14]/70 
                      transition-all duration-500 rounded-2xl pointer-events-none"></div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#39ff14] group-hover:text-[#1b3c34] transition-colors duration-300">
          {job.title}
        </h2>
        <span className="text-sm bg-[#39ff14]/20 text-[#39ff14] font-semibold px-3 py-1 rounded-full capitalize 
                         group-hover:bg-[#39ff14]/40 transition-all duration-300">
          {job.jobType}
        </span>
      </div>

      <p className="text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">{job.description}</p>
      <p className="text-sm text-gray-400">
        📍 <span className="font-semibold text-[#39ff14]">Location:</span> {job.location}
      </p>
      <p className="text-sm text-gray-400">
        💰 <span className="font-semibold text-[#39ff14]">Salary:</span> ₹{job.salary.toLocaleString()}
      </p>
      <p className="text-sm text-gray-400">
        🧑‍💼 <span className="font-semibold text-[#39ff14]">Position:</span> {job.position}
      </p>
      <p className="text-sm text-gray-400 mb-3">
        🏢 <span className="font-semibold text-[#39ff14]">Company:</span> {job.company}
      </p>

      <div className="text-sm text-gray-400 mb-3">
        ✅ <span className="font-semibold text-[#39ff14]">Requirements:</span>
        <ul className="list-disc list-inside ml-4">
          {job.requirements.map((req, index) => (
            <li key={index} className="group-hover:text-white transition-colors duration-300">
              {req}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#1b3c34] via-[#39ff14] to-[#1b3c34] 
                   text-black font-bold text-lg shadow-xl transform hover:scale-105 
                   hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] transition-all duration-300 
                   ease-in-out animate-pulse ring-2 ring-[#39ff14]/30"
      >
        🚀 Apply Now
      </button>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Flames of Green Lights Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 200; // Dense for flame effect

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
        const maxDistance = 250; // Wide range for flame spread
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 6;
          this.flameStrength = Math.min(this.flameStrength + 0.25, 2);
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force;
          this.y -= Math.sin(angle) * force * 1.5; // Elongate vertically for flame shape
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

    // Connect particles for flame effect
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

    // Flame-like trail
    const trail = [];
    const maxTrailLength = 30;

    const addTrailPoint = (x, y) => {
      trail.push({ x, y, opacity: 1, size: Math.random() * 8 + 4 });
      if (trail.length > maxTrailLength) {
        trail.shift();
      }
    };

    const drawTrail = () => {
      trail.forEach((point, index) => {
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

  // Scroll-triggered animations for job cards
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
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#000000] px-4 md:px-16 py-10 gap-16 overflow-hidden">
      {/* Flame Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-12 w-full sticky top-0 z-10">
        {/* Text Section */}
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#39ff14] drop-shadow-[0_0_10px_rgba(57,255,20,0.7)] mb-6">
            <Typewriter
              words={[
                "Where opportunity meets ambition — the #1 job portal trusted worldwide.",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={60}
              deleteSpeed={40}
              delaySpeed={1200}
            />
          </h1>
          <p className="text-lg text-gray-300 mt-4 group-hover:text-white transition-colors duration-300">
            Explore thousands of career opportunities, discover top employers, and start your journey toward success.
          </p>
        </div>

        {/* Animation */}
        <div className="w-full md:w-[500px] transform hover:scale-105 transition-transform duration-500">
          <DotLottieReact
            src="https://lottie.host/5ba75b17-8f9a-4e6f-a048-6506510a6675/ei3VLqr2WG.lottie"
            loop
            autoplay
            style={{
              width: "100%",
              height: "100%",
              filter: "drop-shadow(0 0 20px rgba(57, 255, 20, 0.5))",
            }}
          />
        </div>
      </div>

      {/* Latest Jobs Section */}
      <div className="w-full relative z-10">
        <h2 className="text-3xl font-bold text-[#39ff14] mb-8 text-center drop-shadow-[0_0_10px_rgba(57,255,20,0.7)]">
          🆕 Latest Job Openings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-8">
          {latestJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Browse More Jobs Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/jobs")}
            className="px-6 py-3 text-lg font-semibold text-black bg-gradient-to-r from-[#1b3c34] via-[#39ff14] to-[#1b3c34] 
                       rounded-full shadow-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] 
                       transition-all duration-300 ease-in-out border border-[#39ff14]/20 
                       backdrop-blur-lg ring-2 ring-[#39ff14]/30"
          >
            🔎 Browse More Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;