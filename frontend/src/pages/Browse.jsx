import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";
import axios from "axios";

const CompanyCard = ({ company }) => {
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
      className="company-card relative bg-[#1a1a1a]/80 backdrop-blur-2xl rounded-2xl border border-[#39ff14]/30 p-6 
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

      <a
        href={company.website || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full block py-2 text-center rounded-lg bg-gradient-to-r from-[#1b3c34] via-[#39ff14] to-[#1b3c34] 
                   text-black font-bold text-lg shadow-xl transform hover:scale-105 
                   hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] transition-all duration-300 
                   ease-in-out animate-pulse ring-2 ring-[#39ff14]/30"
      >
        🌐 Visit Website
      </a>
    </div>
  );
};

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // Fetch companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/company/all");
        // Transform _id to id for compatibility with CompanyCard
        const transformedCompanies = response.data.companies.map((company) => ({
          id: company._id,
          name: company.name,
          description: company.description,
          website: company.website,
          location: company.location,
          logo: company.logo,
          userId: company.userId,
          createdAt: company.createdAt,
        }));
        setCompanies(transformedCompanies);
        setLoading(false);
      } catch (err) {
        setError("Failed to load companies. Please try again later.");
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const uniqueLocations = [...new Set(companies.map((company) => company.location).filter(Boolean))];

  const filteredCompanies = companies.filter((company) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      company.name.toLowerCase().includes(query) ||
      (company.description && company.description.toLowerCase().includes(query));

    const matchesLocation = locationFilter === "" || company.location === locationFilter;

    return matchesSearch && matchesLocation;
  });

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

  // Scroll-triggered animations for company cards
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

  const dropdownStyles =
    "bg-[#1a1a1a]/80 backdrop-blur-lg text-[#39ff14] px-5 py-3 rounded-xl shadow-md " +
    "hover:bg-[#1b3c34]/80 focus:outline-none focus:ring-2 focus:ring-[#39ff14]/50 transition duration-300";

  const optionStyles =
    "bg-[#1a1a1a] text-[#39ff14] hover:bg-[#1b3c34] p-2";

  return (
    <div className="relative min-h-screen px-6 md:px-20 py-10 bg-[#000000] overflow-hidden">
      {/* Flame Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      <h1 className="text-4xl font-extrabold text-[#39ff14] mb-6 text-center drop-shadow-[0_0_10px_rgba(57,255,20,0.7)]">
        🌟 Discover Companies
      </h1>

      {/* Animation */}
      <div className="flex justify-center mb-10">
        <div className="w-[200px] md:w-[280px] lg:w-[300px] transform hover:scale-105 transition-transform duration-500 relative z-10">
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
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-6 relative z-10">
        <input
          type="text"
          placeholder="🔍 Search for companies or descriptions..."
          className="w-full md:w-[500px] px-5 py-3 rounded-xl shadow-xl text-sm md:text-base text-[#39ff14] bg-[#1a1a1a]/80 placeholder-[#39ff14]/70
                     focus:outline-none focus:ring-2 focus:ring-[#39ff14]/50 focus:bg-[#1b3c34]/80 transition-all duration-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-10 relative z-10">
        {/* Location Filter */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className={dropdownStyles}
        >
          <option value="" className={optionStyles}>🌍 All Locations</option>
          {uniqueLocations.map((loc, i) => (
            <option key={i} value={loc} className={optionStyles}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-[#39ff14]/80 text-xl drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] relative z-10">
          <DotLottieReact
            src="https://lottie.host/7f7b8276-09c8-4f1-a-4ab6-a1b6a7f0c7e9/0u1c2d3e4f5.lottie"
            loop
            autoplay
            style={{ width: 100, height: 100, margin: "0 auto" }}
          />
          <p>Loading companies...</p>
        </div>
      ) : error ? (
        <p className="text-center text-[#ff4444]/80 text-xl drop-shadow-[0_0_10px_rgba(255,68,68,0.5)] relative z-10">
          {error}
        </p>
      ) : filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#39ff14]/80 text-xl drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] relative z-10">
          😕 No companies found matching your search.
        </p>
      )}
    </div>
  );
};

export default Browse;