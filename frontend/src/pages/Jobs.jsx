import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";

// Dummy job data
const dummyJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "Build modern UIs with React and Tailwind.",
    requirements: ["React", "Tailwind CSS", "REST APIs"],
    salary: 75000,
    location: "Remote",
    jobType: "full-time",
    position: "Software Engineer",
    company: "TechNova Inc.",
  },
  {
    id: 2,
    title: "Data Analyst Intern",
    description: "Analyze datasets to extract insights using Python & SQL.",
    requirements: ["Python", "SQL", "Excel"],
    salary: 15000,
    location: "Mumbai",
    jobType: "internship",
    position: "Intern",
    company: "Insight Labs",
  },
  {
    id: 3,
    title: "Backend Engineer",
    description: "Develop scalable backend systems using Node.js.",
    requirements: ["Node.js", "Express", "MongoDB"],
    salary: 90000,
    location: "Bangalore",
    jobType: "full-time",
    position: "Backend Developer",
    company: "CodeSmith Ltd.",
  },
  {
    id: 4,
    title: "Graphic Designer",
    description: "Design creatives for marketing and UI assets.",
    requirements: ["Figma", "Illustrator", "Photoshop"],
    salary: 40000,
    location: "Delhi",
    jobType: "contract",
    position: "Visual Designer",
    company: "PixelCraft Studios",
  },
];

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

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const canvasRef = useRef(null);

  const uniqueLocations = [...new Set(dummyJobs.map((job) => job.location))];
  const uniquePositions = [...new Set(dummyJobs.map((job) => job.position))];

  const filteredJobs = dummyJobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.position.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query);

    const matchesLocation = locationFilter === "" || job.location === locationFilter;
    const matchesPosition = positionFilter === "" || job.position === positionFilter;
    const matchesSalary =
      salaryFilter === "" ||
      (salaryFilter === "<30000" && job.salary < 30000) ||
      (salaryFilter === "30000-60000" && job.salary >= 30000 && job.salary <= 60000) ||
      (salaryFilter === ">60000" && job.salary > 60000);

    return matchesSearch && matchesLocation && matchesPosition && matchesSalary;
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
        🚀 Explore Job Opportunities
      </h1>

      {/* Animation */}
      <div className="flex justify-center mb-10">
        <div className="w-[200px] md:w-[280px] lg:w-[300px] transform hover:scale-105 transition-transform duration-500">
          <DotLottieReact
            src="https://lottie.host/8a96f0c5-502c-4247-9b1d-b273af275e60/kdpe2W3dMH.lottie"
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
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Search for jobs, roles or companies..."
          className="w-full md:w-[500px] px-5 py-3 rounded-xl shadow-xl text-sm md:text-base text-[#39ff14] bg-[#1a1a1a]/80 placeholder-[#39ff14]/70
                     focus:outline-none focus:ring-2 focus:ring-[#39ff14]/50 focus:bg-[#1b3c34]/80 transition-all duration-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
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

        {/* Position Filter */}
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className={dropdownStyles}
        >
          <option value="" className={optionStyles}>🧑‍💼 All Positions</option>
          {uniquePositions.map((pos, i) => (
            <option key={i} value={pos} className={optionStyles}>{pos}</option>
          ))}
        </select>

        {/* Salary Filter */}
        <select
          value={salaryFilter}
          onChange={(e) => setSalaryFilter(e.target.value)}
          className={dropdownStyles}
        >
          <option value="" className={optionStyles}>💰 All Salaries</option>
          <option value="<30000" className={optionStyles}>Less than ₹30,000</option>
          <option value="30000-60000" className={optionStyles}>₹30,000 - ₹60,000</option>
          <option value=">60000" className={optionStyles}>More than ₹60,000</option>
        </select>
      </div>

      {/* Job Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#39ff14]/80 text-xl drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
          😕 No jobs found matching your search.
        </p>
      )}
    </div>
  );
};

export default Jobs;