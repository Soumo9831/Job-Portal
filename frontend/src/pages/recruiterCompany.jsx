import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";
import axios from "axios";

const CompanyCard = ({ company, onEdit, onDelete }) => {
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
                 transform transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] 
                 cursor-pointer shadow-lg overflow-hidden group"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#39ff14]/70 
                      transition-all duration-300 rounded-2xl pointer-events-none"></div>
      <h2 className="text-xl font-bold text-[#39ff14] group-hover:text-[#1b3c34] transition-colors duration-300">
        {company.name || "N/A"}
      </h2>
      <p className="text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
        {company.description || "No description available."}
      </p>
      <p className="text-sm text-gray-400 mb-2">
        🌐 <span className="font-semibold text-[#39ff14]">Website:</span>{" "}
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {company.website || "N/A"}
        </a>
      </p>
      <p className="text-sm text-gray-400 mb-2">
        📍 <span className="font-semibold text-[#39ff14]">Location:</span> {company.location || "N/A"}
      </p>
      <p className="text-sm text-gray-400 mb-4">
        🖼️ <span className="font-semibold text-[#39ff14]">Logo:</span>{" "}
        <a
          href={company.logo}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {company.logo ? "View Logo" : "N/A"}
        </a>
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEdit(company)}
          className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#39ff14]/50 text-white 
                     hover:bg-[#1b3c34] hover:text-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.7)] 
                     font-semibold transition-all duration-300"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(company._id)}
          className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#39ff14]/50 text-white 
                     hover:bg-[#1b3c34] hover:text-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.7)] 
                     font-semibold transition-all duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const CompanyModal = ({ isOpen, onClose, onSubmit, isEdit = false, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logo: "",
  });
  const [error, setError] = useState("");
  const modalRef = useRef(null);

  // Pre-fill form for edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        website: initialData.website || "",
        location: initialData.location || "",
        logo: initialData.logo || "",
      });
    }
  }, [isEdit, initialData]);

  // GSAP animation for modal
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Company name is required.");
      return;
    }
    onSubmit(formData);
    setFormData({ name: "", description: "", website: "", location: "", logo: "" });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-100">
      <div
        ref={modalRef}
        className="bg-[#1a1a1a]/90 backdrop-blur-2xl rounded-2xl p-8 w-full max-w-md border border-[#39ff14]/50 
                   shadow-[0_0_30px_rgba(57,255,20,0.3)]"
      >
        <h2 className="text-2xl font-bold text-[#39ff14] mb-6 text-center">
          {isEdit ? "Edit Company" : "Add New Company"}
        </h2>
        {error && (
          <p className="text-[#ff4444] text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#39ff14] mb-1">Company Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-4 py-2 border border-[#39ff14]/30 rounded-lg bg-[#1a1a1a] text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#39ff14] transition duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-[#39ff14] mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter company description"
              className="w-full px-4 py-2 border border-[#39ff14]/30 rounded-lg bg-[#1a1a1a] text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#39ff14] transition duration-300"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-[#39ff14] mb-1">Website</label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="w-full px-4 py-2 border border-[#39ff14]/30 rounded-lg bg-[#1a1a1a] text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#39ff14] transition duration-300"
            />
          </div>
          <div>
            <label className="block text-[#39ff14] mb-1">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location (e.g., Kolkata)"
              className="w-full px-4 py-2 border border-[#39ff14]/30 rounded-lg bg-[#1a1a1a] text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#39ff14] transition duration-300"
            />
          </div>
          <div>
            <label className="block text-[#39ff14] mb-1">Logo URL</label>
            <input
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="Enter logo URL (e.g., https://example.com/logo.png)"
              className="w-full px-4 py-2 border border-[#39ff14]/30 rounded-lg bg-[#1a1a1a] text-white 
                         focus:outline-none focus:ring-2 focus:ring-[#39ff14] transition duration-300"
            />
          </div>
          <div className="flex gap-2 justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#39ff14] text-black font-semibold 
                         hover:bg-[#1b3c34] hover:text-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.7)] 
                         transition-all duration-300"
            >
              {isEdit ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[#1a1a1a] border border-[#39ff14]/50 text-[#39ff14] 
                         hover:bg-[#39ff14] hover:text-black transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RecruiterCompany = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCompanyData, setEditCompanyData] = useState({});
  const canvasRef = useRef(null);

  // Check role and fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "recruiter") {
        navigate("/login");
        return;
      }

      if (!token) {
        setError("Please log in to view your companies.");
        setLoading(false);
        navigate("/company");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/company", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        console.log("Companies response:", response.data);

        if (response.data.success) {
          setCompanies(response.data.companies || []);
        } else {
          setError(response.data.error || "Failed to fetch companies.");
        }
      } catch (err) {
        console.error("Fetch companies error:", err.response?.data?.error || err.message);
        setError(err.response?.data?.error || "Failed to fetch companies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [navigate]);

  // Handle adding a company
  const handleAddCompany = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add a company.");
      navigate("/company");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/company",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Add company response:", response.data);

      if (response.data.success) {
        setCompanies([...companies, response.data.company]);
        alert("Company added successfully!");
      } else {
        alert(response.data.error || "Failed to add company.");
      }
    } catch (err) {
      console.error("Add company error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Failed to add company. Please try again.");
    }
  };

  // Handle editing a company
  const handleEditCompany = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to edit a company.");
      navigate("/company");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/company/${editCompanyData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Edit company response:", response.data);

      if (response.data.success) {
        setCompanies(
          companies.map((company) =>
            company._id === editCompanyData._id ? response.data.company : company
          )
        );
        alert("Company updated successfully!");
      } else {
        alert(response.data.error || "Failed to update company.");
      }
    } catch (err) {
      console.error("Edit company error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Failed to update company. Please try again.");
    }
  };

  // Handle deleting a company
  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to delete a company.");
      navigate("/company");
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Delete company response:", response.data);

      if (response.data.success) {
        setCompanies(companies.filter((company) => company._id !== companyId));
        alert("Company deleted successfully!");
      } else {
        alert(response.data.error || "Failed to delete company.");
      }
    } catch (err) {
      console.error("Delete company error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Failed to delete company. Please try again.");
    }
  };

  // Open edit modal with company data
  const openEditModal = (company) => {
    setEditCompanyData(company);
    setIsEditModalOpen(true);
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
        ctx.ellipse(point.x, point.y, point.size, point.size * 1.5, 0, 0, Math.PI * 2);
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
  }, [companies]);

  return (
    <div className="relative min-h-screen px-6 md:px-20 py-10 bg-[#000000] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      <h1 className="text-4xl font-extrabold text-[#39ff14] mb-6 text-center drop-shadow-[0_0_10px_rgba(57,255,20,0.7)] relative z-10">
        🚀 Your Companies
      </h1>

      <div className="flex justify-center mb-6 relative z-10">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 rounded-lg bg-[#39ff14] text-[#39ff14] font-semibold 
                     hover:bg-[#1b3c34] hover:text-[#39ff14] hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] 
                     transition-all duration-300"
        >
          ➕ Add Company
        </button>
      </div>

      <CompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCompany}
        isEdit={false}
      />
      <CompanyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCompany}
        isEdit={true}
        initialData={editCompanyData}
      />

      <div className="flex justify-center mb-10 relative z-10">
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
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
          {companies.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              onEdit={openEditModal}
              onDelete={handleDeleteCompany}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#39ff14]/80 text-xl drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] relative z-10">
          😕 No companies found. Add a company to get started.
        </p>
      )}
    </div>
  );
};

export default RecruiterCompany;