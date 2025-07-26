import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Job Modal Component
const JobModal = ({ isOpen, onClose, job, isEdit, onSubmit, companies }) => {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    description: job?.description || "",
    requirements: job?.requirements?.join(", ") || "",
    salary: job?.salary || "",
    location: job?.location || "",
    jobType: job?.jobType || "",
    position: job?.position || "",
    companyId: job?.company?._id || "", // Use company._id for edit
  });
  const [error, setError] = useState("");
  const modalRef = useRef(null);

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "salary" ? parseInt(value) || "" : value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEdit) { // Only validate for new job creation
      if (!formData.title.trim()) {
        setError("Job title is required.");
        return;
      }
      if (!formData.companyId) {
        setError("companyId is required.");
        return;
      }
      if (!formData.description.trim()) {
        setError("Job description is required.");
        return;
      }
      if (!formData.location.trim()) {
        setError("Location is required.");
        return;
      }
      if (!formData.position.trim()) {
        setError("Position is required.");
        return;
      }
    }
    const submitData = {
      ...formData,
      requirements: formData.requirements
        ? formData.requirements.split(",").map((req) => req.trim()).filter(Boolean)
        : [],
      salary: formData.salary ? parseInt(formData.salary) : null,
      companyId: formData.companyId, // Explicitly set companyId for backend
    };
    onSubmit(submitData);
    setFormData({
      title: "",
      description: "",
      requirements: "",
      salary: "",
      location: "",
      jobType: "",
      position: "",
      companyId: "",
    });
    setError("");
    onClose();
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
            ref={modalRef}
            className="bg-[#1a1a1a]/90 backdrop-blur-2xl rounded-2xl border border-[#39ff14]/30 
                       p-8 w-full max-w-md mx-4 shadow-[0_0_30px_rgba(57,255,20,0.3)] max-h-[70vh] overflow-y-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold text-[#39ff14] mb-6 text-center">
              {isEdit ? "Edit Job" : "Add New Job"}
            </h2>
            {error && (
              <p className="text-[#ff4444] text-sm mb-4 text-center">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block text-[#39ff14] mb-1">CompanyId *</label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white 
                             border border-[#39ff14]/30 focus:outline-none 
                             focus:ring-2 focus:ring-[#39ff14] transition-all duration-300 
                             max-h-32 overflow-y-auto"
                >
                  <option value="" className="bg-[#1a1a1a] text-white">Select Company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id} className="bg-[#1a1a1a] text-white">
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#39ff14] mb-1">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Job Title"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white 
                             border border-[#39ff14]/30 focus:outline-none 
                             focus:ring-2 focus:ring-[#39ff14] transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-[#39ff14] mb-1">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Position (e.g., Frontend Engineer)"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white 
                             border border-[#39ff14]/30 focus:outline-none 
                             focus:ring-2 focus:ring-[#39ff14] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-[#39ff14] mb-1">Requirements</label>
                <input
                  type="text"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Skills (e.g., React, Tailwind CSS)"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white 
                             border border-[#39ff14]/30 focus:outline-none 
                             focus:ring-2 focus:ring-[#39ff14] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-[#39ff14] mb-1">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Salary (e.g., 80000)"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white 
                             border border-[#39ff14]/30 focus:outline-none 
                             focus:ring-2 focus:ring-[#39ff14] transition-all duration-300"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-[#39ff14] mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white 
                             border border-[#39ff14]/30 focus:outline-none 
                             focus:ring-2 focus:ring-[#39ff14] transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-[#39ff14] mb-1">Job Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Job Description"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white 
                             border border-[#39ff14]/30 focus:outline-none 
                             focus:ring-2 focus:ring-[#39ff14] transition-all duration-300"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-[#39ff14] mb-1">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] text-white 
                             border border-[#39ff14]/30 focus:outline-none 
                             focus:ring-2 focus:ring-[#39ff14] transition-all duration-300"
                >
                  <option value="" className="bg-[#1a1a1a] text-white">Select Job Type</option>
                  <option value="full-time" className="bg-[#1a1a1a] text-white">Full-Time</option>
                  <option value="part-time" className="bg-[#1a1a1a] text-white">Part-Time</option>
                  <option value="contract" className="bg-[#1a1a1a] text-white">Contract</option>
                </select>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-[#1a1a1a] border border-[#39ff14]/50 text-[#39ff14] 
                             hover:bg-[#39ff14] hover:text-black transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isEdit && (!formData.title || !formData.companyId || !formData.description || !formData.location || !formData.position)}
                  className={`px-6 py-2 rounded-lg font-bold 
                             ${!isEdit && (!formData.title || !formData.companyId || !formData.description || !formData.location || !formData.position)
                              ? "bg-[#1a1a1a] text-[#39ff14]/50 border-[#39ff14]/30 cursor-not-allowed"
                              : "bg-[#39ff14] text-black hover:bg-[#1b3c34] hover:text-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.7)]"
                             } transition-all duration-300`}
                >
                  {isEdit ? "Update Job" : "Add Job"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Job Card Component
const JobCard = ({ job, onEdit, onDelete }) => {
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
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#39ff14]/70 
                      transition-all duration-500 rounded-2xl pointer-events-none"></div>
      <h2 className="text-xl font-bold text-[#39ff14] mb-2 group-hover:text-[#1b3c34] transition-colors duration-300">
        {job.title || "N/A"}
      </h2>
      <p className="text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
        {job.company?.name || "N/A"}
      </p>
      <p className="text-sm text-gray-400 mb-1">
        📍 <span className="font-semibold text-[#39ff14]">Location:</span> {job.location || "N/A"}
      </p>
      <p className="text-sm text-gray-400 mb-1">
        💰 <span className="font-semibold text-[#39ff14]">Salary:</span> {job.salary || "N/A"}
      </p>
      <p className="text-sm text-gray-400 mb-1">
        📅 <span className="font-semibold text-[#39ff14]">Posted:</span>{" "}
        {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
      </p>
      <p className="text-sm text-gray-400 mb-2">
        🕒 <span className="font-semibold text-[#39ff14]">Type:</span> {job.jobType ? job.jobType.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) : "N/A"}
      </p>
      <p className="text-gray-300 mt-2 group-hover:text-white transition-colors duration-300">
        {job.description || "No description available."}
      </p>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(job)}
          className="flex-1 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#39ff14]/50 text-white 
                     hover:bg-[#1b3c34] hover:text-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.7)] 
                     font-semibold transition-all duration-300"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(job._id)}
          className="flex-1 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#39ff14]/50 text-white 
                     hover:bg-[#1b3c34] hover:text-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.7)] 
                     font-semibold transition-all duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const RecruiterJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // State for delete confirmation
  const canvasRef = useRef(null);

  // Fetch jobs and companies
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "recruiter") {
        navigate("/login");
        return;
      }

      if (!token) {
        setError("Please log in to view your jobs.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        // Fetch jobs
        const jobsResponse = await axios.get("http://localhost:8000/api/jobs/my-jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        console.log("Jobs response:", jobsResponse.data);

        if (jobsResponse.data.success) {
          setJobs(jobsResponse.data.jobs || []);
        } else {
          setError(jobsResponse.data.error || "Failed to fetch jobs.");
        }

        // Fetch companies
        const companiesResponse = await axios.get("http://localhost:8000/api/company", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        console.log("Companies response:", companiesResponse.data);

        if (companiesResponse.data.success) {
          setCompanies(companiesResponse.data.companies || []);
        } else {
          setError(companiesResponse.data.error || "Failed to fetch companies.");
        }
      } catch (err) {
        console.error("Fetch error:", err.response?.data?.error || err.message);
        setError(err.response?.data?.error || "Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAdd = () => {
    setSelectedJob(null);
    setAddModalOpen(true);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setEditModalOpen(true);
  };

  const handleAddJob = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add a job.");
      navigate("/login");
      return;
    }
    console.log("Submitting job data:", formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/jobs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Add job response:", response.data);

      if (response.data.success) {
        setJobs([...jobs, response.data.job]);
        alert("Job added successfully!");
      } else {
        alert(response.data.error || "Failed to add job.");
      }
    } catch (err) {
      console.error("Add job error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Failed to add job. Please try again.");
    }
  };

  const handleEditJob = async (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to edit a job.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/jobs/${selectedJob._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Edit job response:", response.data);

      if (response.data.success) {
        setJobs(
          jobs.map((job) =>
            job._id === selectedJob._id ? response.data.job : job
          )
        );
        alert("Job updated successfully!");
      } else if (response.data.error === "Job not found or unauthorized") {
        alert("You are not authorized to edit this job or it does not exist.");
      } else {
        alert(response.data.error || "Failed to update job.");
      }
    } catch (err) {
      console.error("Edit job error:", err.response?.data?.error || err.message);
      alert(err.response?.data?.error || "Failed to update job. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (deleteConfirm === jobId) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to delete a job.");
        navigate("/login");
        return;
      }
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log("Delete job response:", response.data);

        if (response.data.success) {
          setJobs(jobs.filter((job) => job._id !== jobId));
          alert("Job deleted successfully!");
          setDeleteConfirm(null); // Reset confirmation
        } else if (response.data.error === "Job not found or unauthorized") {
          alert("You are not authorized to delete this job or it does not exist.");
          setDeleteConfirm(null);
        } else {
          alert(response.data.error || "Failed to delete job.");
        }
      } catch (err) {
        console.error("Delete job error:", err.response?.data?.error || err.message);
        alert(err.response?.data?.error || "Failed to delete job. Please try again.");
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(jobId); // Set confirmation state
    }
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
  }, [jobs]);

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
  }, [jobs]);

  return (
    <div className="relative min-h-screen px-8 md:px-20 py-10 bg-[#000000] overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      ></canvas>

      <h1 className="text-4xl md:text-5xl font-extrabold text-[#39ff14] mb-6 text-center 
                     drop-shadow-[0_0_10px_rgba(57,255,20,0.7)] relative z-10">
        💼 Manage Your Job Listings
      </h1>

      <div className="flex justify-center mb-10 relative z-10">
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

      <div className="flex justify-center mb-10 relative z-10">
        <button
          onClick={handleAdd}
          className="px-6 py-3 rounded-lg bg-[#1a1a1a] border border-[#39ff14]/50 text-[#39ff14] 
                     font-semibold hover:bg-[#1b3c34] hover:text-[#39ff14] 
                     hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] transition-all duration-300"
        >
          ➕ Add New Job
        </button>
      </div>

      {loading ? (
        <div className="text-center text-[#39ff14]/80 text-xl drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] relative z-10">
          <DotLottieReact
            src="https://lottie.host/7f7b8276-09c8-4f1-a-4ab6-a1b6a7f0c7e9/0u1c2d3e4f5.lottie"
            loop
            autoplay
            style={{ width: 100, height: 100, margin: "0 auto" }}
          />
          <p>Loading jobs...</p>
        </div>
      ) : error ? (
        <p className="text-center text-[#ff4444]/80 text-xl drop-shadow-[0_0_10px_rgba(255,68,68,0.5)] relative z-10">
          {error}
        </p>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDeleteJob}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#39ff14]/80 text-xl drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] relative z-10">
          😕 No jobs found. Add a job to get started.
        </p>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a]/90 backdrop-blur-2xl rounded-2xl border border-[#39ff14]/30 p-6 w-full max-w-md mx-4 text-center">
            <p className="text-[#39ff14] mb-4">Are you sure you want to delete this job?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 rounded-lg bg-[#1a1a1a] border border-[#39ff14]/50 text-[#39ff14] 
                           hover:bg-[#39ff14] hover:text-black transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deleteConfirm)}
                className="px-6 py-2 rounded-lg bg-[#39ff14] text-black hover:bg-[#1b3c34] 
                           hover:text-[#39ff14] hover:shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <JobModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        job={selectedJob}
        isEdit={true}
        onSubmit={handleEditJob}
        companies={companies}
      />
      <JobModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        job={null}
        isEdit={false}
        onSubmit={handleAddJob}
        companies={companies}
      />
    </div>
  );
};

export default RecruiterJobs;