import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  User, 
  Mail, 
  Phone,
  Settings,
  Database,
  ArrowRight,
  X,
  Sparkles,
  ShieldCheck,
  Terminal,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  Activity,
  Trash2,
  BarChart3,
  Sliders,
  Download,
  GitCompare,
  Eye,
  ChevronLeft,
  Radio,
  Zap,
  Lock,
  Globe,
  Clock,
  Target,
  Gauge,
  Rocket,
  Shield,
  ScanLine,
  Brain
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const heroImages = [
  '/screener_hero_1.jpg',
  '/screener_hero_2.jpg',
  '/screener_hero_3.jpg',
  '/screener_hero_4.jpg',
  '/screener_hero_5.jpg'
];

const consoleImages = [
  '/console_bg_1.jpg',
  '/console_bg_2.jpg',
  '/console_bg_3.jpg',
  '/console_bg_4.jpg'
];

const PIPELINE_STAGES = [
  "Screening",
  "Interviewing",
  "Offer Extended",
  "Hired",
  "Rejected"
];

const DEPARTMENTS = ["ALL", "Engineering", "Design", "Product", "Operations"];
const LOCATIONS = ["ALL", "Remote", "Hybrid", "Onsite"];

export default function App() {
  // --- CINEMATIC BOOT SYSTEM STATE ---
  const [isBooted, setIsBooted] = useState(false);
  const [bootLogs, setBootLogs] = useState([]);
  const [bootProgress, setBootProgress] = useState(0);

  // Navigation Role: 'applicant' | 'recruiter'
  const [userRole, setUserRole] = useState('applicant');
  
  // Console Sub-tab State: 'table' | 'board' | 'analytics'
  const [consoleSubTab, setConsoleSubTab] = useState('table');
  
  // Background slideshow index
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const [consoleImageIndex, setConsoleImageIndex] = useState(0);
  


  // --- DATABASE STATE ---
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [isAddingJob, setIsAddingJob] = useState(false);
  
  const [resumes, setResumes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // Candidate Detail Drawer Tab: 'overview' | 'skills' | 'experience' | 'education' | 'resume'
  const [activeDetailTab, setActiveDetailTab] = useState('overview');

  // Recruiter Notes & Hiring Stage Draft State (Drawer Panel)
  const [draftNotes, setDraftNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Candidate Comparison State
  const [compareIds, setCompareIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Resume Text Highlight Search Term
  const [resumeSearchTerm, setResumeSearchTerm] = useState('');

  // Dynamic Score Weights (Calibration Sliders)
  const [weights, setWeights] = useState({
    skills: 40,
    experience: 30,
    education: 10,
    roleFit: 20
  });

  // --- APPLICANT JOB BOARD STATE ---
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantFile, setApplicantFile] = useState(null);
  const [applySearchQuery, setApplySearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedLocFilter, setSelectedLocFilter] = useState('ALL');
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccessData, setApplySuccessData] = useState(null);
  const [activeStoryboardFrame, setActiveStoryboardFrame] = useState(0);
  const [isStoryboardAutoplay, setIsStoryboardAutoplay] = useState(true);

  // --- STORYBOARD AUTOPLAY TIMER ---
  useEffect(() => {
    if (!isStoryboardAutoplay || !isBooted || userRole !== 'applicant' || selectedJobForApply || applySuccessData) return;
    const interval = setInterval(() => {
      setActiveStoryboardFrame(prev => (prev + 1) % 3);
    }, 4500); // 4.5 seconds per slide
    return () => clearInterval(interval);
  }, [isStoryboardAutoplay, isBooted, userRole, selectedJobForApply, applySuccessData]);

  // --- SANDBOX SIMULATOR STATE ---
  const [simSkills, setSimSkills] = useState(['React', 'Python', 'SQL']);
  const [simExp, setSimExp] = useState(3);
  const [simEdu, setSimEdu] = useState('M.S.');

  const simMetrics = useMemo(() => {
    const skillCount = simSkills.length;
    const skillsScore = (skillCount / 5) * 10;
    const experienceScore = (simExp / 5) * 10;
    const educationScore = simEdu === 'Ph.D.' ? 10 : simEdu === 'M.S.' ? 8.5 : 6;
    const roleFit = 8.2;
    
    const rawScore = (skillsScore * 0.4 + experienceScore * 0.3 + educationScore * 0.1 + roleFit * 0.2);
    const scorePercentage = Math.round(rawScore * 10);
    
    let verdict = "REJECT";
    let message = "Candidate lacks required stack depth or work experience parameters.";
    if (scorePercentage >= 80) {
      verdict = "SHORTLIST";
      message = "Outstanding candidate profile matching engineering core qualifications.";
    } else if (scorePercentage >= 60) {
      verdict = "REVIEW";
      message = "Moderate alignment score. Recommend candidate for preliminary screening.";
    }
    
    return { scorePercentage, verdict, message };
  }, [simSkills, simExp, simEdu]);

  // --- WINDOW SCROLL POSITION TRACKER ---
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrolledImageIndex = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;
    const pct = scrollY / maxScroll;
    const idx = Math.min(Math.floor(pct * heroImages.length), heroImages.length - 1);
    return idx;
  }, [scrollY]);

  // --- 3D TUNNEL DIMENSIONAL ZOOM MATH ---
  const dim1 = useMemo(() => {
    const scale = 1 + scrollY * 0.0035;
    const opacity = Math.max(0, 1 - scrollY * 0.0022);
    return { scale, opacity };
  }, [scrollY]);

  const dim2 = useMemo(() => {
    let scale = 0.1;
    let opacity = 0;
    if (scrollY > 250) {
      if (scrollY <= 850) {
        const progress = (scrollY - 250) / 600;
        scale = 0.1 + progress * 0.9;
        opacity = progress;
      } else {
        const progress = (scrollY - 850) / 650;
        scale = 1.0 + progress * 2.0;
        opacity = Math.max(0, 1 - progress * 1.5);
      }
    }
    return { scale, opacity };
  }, [scrollY]);

  const dim3 = useMemo(() => {
    let scale = 0.1;
    let opacity = 0;
    if (scrollY > 1100) {
      if (scrollY <= 1900) {
        const progress = Math.min(1, (scrollY - 1100) / 600);
        scale = 0.1 + progress * 0.9;
        opacity = progress;
      } else {
        const progress = (scrollY - 1900) / 500;
        scale = 1.0 + progress * 2.0;
        opacity = Math.max(0, 1 - progress * 1.5);
      }
    }
    return { scale, opacity };
  }, [scrollY]);

  const dim4 = useMemo(() => {
    let scale = 0.1;
    let opacity = 0;
    if (scrollY > 2100) {
      const progress = Math.min(1, (scrollY - 2100) / 600);
      scale = 0.1 + progress * 0.9;
      opacity = progress;
    }
    return { scale, opacity };
  }, [scrollY]);


  // --- DARK SPACE MOVING STARS CANVAS ---
  useEffect(() => {
    if (!isBooted || userRole !== 'applicant' || selectedJobForApply || applySuccessData) return;
    const canvas = document.getElementById('space-network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star pool — stars fly outward from center like warp speed
    const starCount = 400;
    const stars = [];
    const resetStar = (star) => {
      star.x = (Math.random() - 0.5) * width;
      star.y = (Math.random() - 0.5) * height;
      star.z = Math.random() * 1500 + 500;
      star.speed = Math.random() * 4 + 2;
      const colorRoll = Math.random();
      if (colorRoll < 0.5) {
        star.r = 255; star.g = 255; star.b = 255; // pure white
      } else if (colorRoll < 0.75) {
        star.r = 180; star.g = 210; star.b = 255; // blue-white
      } else if (colorRoll < 0.9) {
        star.r = 255; star.g = 230; star.b = 200; // warm white
      } else {
        star.r = 150; star.g = 180; star.b = 255; // cool blue
      }
    };
    for (let i = 0; i < starCount; i++) {
      const star = { x: 0, y: 0, z: 0, speed: 0, r: 255, g: 255, b: 255 };
      resetStar(star);
      star.z = Math.random() * 2000; // spread initial depth
      stars.push(star);
    }

    const render = () => {
      // Pure black fill
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      stars.forEach(star => {
        // Move star closer (reduce z)
        star.z -= star.speed;

        // Reset when star passes camera
        if (star.z <= 0) {
          resetStar(star);
        }

        // Project 3D position to 2D screen
        const sx = (star.x / star.z) * 400 + centerX;
        const sy = (star.y / star.z) * 400 + centerY;

        // Star size grows as it gets closer
        const size = Math.max(0.3, (1 - star.z / 2000) * 3);

        // Brightness increases as star gets closer
        const brightness = Math.min(1, (1 - star.z / 2000) * 1.5);

        // Only draw if on screen
        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          // Draw star trail (motion streak)
          const prevZ = star.z + star.speed * 3;
          const prevSx = (star.x / prevZ) * 400 + centerX;
          const prevSy = (star.y / prevZ) * 400 + centerY;

          if (brightness > 0.3) {
            ctx.strokeStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${brightness * 0.3})`;
            ctx.lineWidth = size * 0.5;
            ctx.beginPath();
            ctx.moveTo(prevSx, prevSy);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }

          // Draw star dot
          ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${brightness})`;
          ctx.shadowBlur = size * 3;
          ctx.shadowColor = `rgba(${star.r}, ${star.g}, ${star.b}, 0.6)`;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBooted, userRole, selectedJobForApply, applySuccessData]);



  
  
  // Filtering & Sorting (Recruiter View)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sortField, setSortField] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Loading & Processing States
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isProcessingResumes, setIsProcessingResumes] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [errorAlert, setErrorAlert] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- BOOT SEQUENCE LOG TIMER ---
  useEffect(() => {
    if (isBooted) return;
    
    const logsSequence = [
      "SYSTEM CHECK: INITIALIZING LOCAL CPU SANDBOX...",
      "DATABASE CONNECTED: SQLite SCHEMA MATCHES CHECKED [OK]",
      "NLP DICTIONARY SCOPE: 100+ KEYWORDS MAPPED SUCCESSFULLY [OK]",
      "CRITERIA WEIGHT CONTROLLER: READY TO CALIBRATE...",
      "SYSTEM ENGINE STABLE: COCKPIT CORE ONLINE"
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logsSequence.length) {
        setBootLogs(prev => [...prev, logsSequence[currentLogIndex]]);
        setBootProgress(Math.round(((currentLogIndex + 1) / logsSequence.length) * 100));
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isBooted]);

  // --- BACKGROUND SLIDESHOW CYCLE (2s) ---
  useEffect(() => {
    if (!isBooted || userRole !== 'applicant') return;
    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isBooted, userRole]);

  // --- BACKGROUND SLIDESHOW CYCLE FOR CONSOLE (2s) ---
  useEffect(() => {
    if (!isBooted || userRole !== 'recruiter') return;
    const interval = setInterval(() => {
      setConsoleImageIndex((prev) => (prev + 1) % consoleImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isBooted, userRole]);



  // --- FETCH DATA METHODS ---
  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res = await axios.get(`${API_BASE}/jobs`);
      setJobs(res.data);
      if (res.data.length > 0 && !selectedJobId) {
        setSelectedJobId(res.data[0].id);
      }
    } catch (err) {
      showError('Failed to fetch jobs. Make sure the backend is running.');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/resumes`);
      setResumes(res.data);
    } catch (err) {
      showError('Failed to load resumes.');
    }
  };

  const fetchMatches = async (jobId) => {
    if (!jobId) return;
    try {
      const res = await axios.get(`${API_BASE}/matches?job_id=${jobId}`);
      setMatches(res.data);
    } catch (err) {
      showError('Failed to load candidates matching analysis.');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchResumes();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchMatches(selectedJobId);
      setSelectedMatch(null);
      setCompareIds([]);
    }
  }, [selectedJobId]);

  // Sync draft notes when a candidate is selected
  useEffect(() => {
    if (selectedMatch) {
      setDraftNotes(selectedMatch.notes || '');
    }
  }, [selectedMatch]);

  const showError = (msg) => {
    setErrorAlert(msg);
    setTimeout(() => setErrorAlert(''), 7000);
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // --- CLASSIFICATION HELPER FOR JOBS ---
  const getJobTags = (job) => {
    const titleLower = job.title.toLowerCase();
    const descLower = job.description.toLowerCase();
    
    let dept = "Operations";
    if (titleLower.includes("engineer") || titleLower.includes("developer") || titleLower.includes("code") || titleLower.includes("tech")) {
      dept = "Engineering";
    } else if (titleLower.includes("design") || titleLower.includes("ux") || titleLower.includes("ui") || titleLower.includes("creative")) {
      dept = "Design";
    } else if (titleLower.includes("product") || titleLower.includes("manager") || titleLower.includes("owner")) {
      dept = "Product";
    }
    
    let loc = "Onsite";
    if (descLower.includes("remote") || titleLower.includes("remote")) {
      loc = "Remote";
    } else if (descLower.includes("hybrid") || titleLower.includes("hybrid")) {
      loc = "Hybrid";
    }
    
    return { dept, loc };
  };

  // --- ACTION HANDLERS ---
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesc.trim()) {
      showError('Please fill in job title and description.');
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/jobs`, {
        title: newJobTitle,
        description: newJobDesc
      });
      setJobs([res.data, ...jobs]);
      setSelectedJobId(res.data.id);
      setNewJobTitle('');
      setNewJobDesc('');
      setIsAddingJob(false);
      showSuccess(`Created job opening: ${res.data.title}`);
    } catch (err) {
      showError('Failed to save job description.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!jobId) return;
    const targetJob = jobs.find(j => j.id === parseInt(jobId));
    if (!window.confirm(`Are you sure you want to delete the job opening "${targetJob?.title}"? This will permanently delete all associated match scores.`)) return;

    try {
      await axios.delete(`${API_BASE}/jobs/${jobId}`);
      setJobs(prev => prev.filter(j => j.id !== parseInt(jobId)));
      if (jobs.length > 1) {
        const remaining = jobs.filter(j => j.id !== parseInt(jobId));
        setSelectedJobId(remaining[0].id);
      } else {
        setSelectedJobId('');
        setMatches([]);
      }
      showSuccess("Job specification and evaluation logs deleted.");
    } catch (err) {
      showError("Failed to delete job opening records.");
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (!selectedJobId) {
      showError('Please select or create a Job Description first!');
      return;
    }

    setIsProcessingResumes(true);
    setProcessStatus('Connecting to local parser: Extracting PDF/TXT content...');
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      setProcessStatus('Structured Analysis: Standardizing extraction for contact, skills & jobs...');
      const uploadRes = await axios.post(`${API_BASE}/resumes/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newlyUploadedResumes = uploadRes.data;
      setProcessStatus(`Screener Engine Scoring: Correlating ${newlyUploadedResumes.length} profiles against requirements...`);
      
      const resumeIds = newlyUploadedResumes.map(r => r.id);
      await axios.post(`${API_BASE}/matches`, {
        job_id: parseInt(selectedJobId),
        resume_ids: resumeIds
      });

      fetchResumes();
      await fetchMatches(selectedJobId);
      
      showSuccess(`Successfully analyzed and ranked ${newlyUploadedResumes.length} candidates!`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'An error occurred during resume batch uploads.';
      showError(errorMsg);
    } finally {
      setIsProcessingResumes(false);
      setProcessStatus('');
      e.target.value = null;
    }
  };

  const handleReevaluateAll = async () => {
    if (!selectedJobId) return;
    if (resumes.length === 0) {
      showError('No resumes in database. Upload resumes to evaluate.');
      return;
    }

    setIsMatching(true);
    setProcessStatus('Auditing all database candidate matches against active requirements...');
    try {
      await axios.post(`${API_BASE}/matches`, {
        job_id: parseInt(selectedJobId)
      });
      await fetchMatches(selectedJobId);
      showSuccess('All candidates re-scored successfully.');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Matching failed.';
      showError(errorMsg);
    } finally {
      setIsMatching(false);
      setProcessStatus('');
    }
  };

  const handleDeleteCandidate = async (resumeId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this candidate's profile and matching analytics?")) return;
    
    try {
      await axios.delete(`${API_BASE}/resumes/${resumeId}`);
      setMatches(prev => prev.filter(m => m.resume_id !== resumeId));
      setResumes(prev => prev.filter(r => r.id !== resumeId));
      setCompareIds(prev => prev.filter(id => id !== resumeId));
      if (selectedMatch && selectedMatch.resume_id === resumeId) {
        setSelectedMatch(null);
      }
      showSuccess("Candidate records successfully deleted.");
    } catch (err) {
      showError("Failed to delete candidate records from database.");
    }
  };

  // Update candidate Hiring Pipeline Stage
  const handleUpdateStage = async (matchId, newStage) => {
    try {
      const res = await axios.patch(`${API_BASE}/matches/${matchId}`, { stage: newStage });
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, stage: res.data.stage } : m));
      if (selectedMatch && selectedMatch.id === matchId) {
        setSelectedMatch(prev => ({ ...prev, stage: res.data.stage }));
      }
      showSuccess(`Updated pipeline stage to: ${newStage}`);
    } catch (err) {
      showError("Failed to update candidate hiring stage.");
    }
  };

  // Save Recruiter Notes in Database
  const handleSaveNotes = async () => {
    if (!selectedMatch) return;
    setIsSavingNotes(true);
    try {
      const res = await axios.patch(`${API_BASE}/matches/${selectedMatch.id}`, { notes: draftNotes });
      setMatches(prev => prev.map(m => m.id === selectedMatch.id ? { ...m, notes: res.data.notes } : m));
      setSelectedMatch(prev => ({ ...prev, notes: res.data.notes }));
      showSuccess("Notes saved successfully.");
    } catch (err) {
      showError("Failed to save recruiter notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // --- JOB SEEKER APPLICATION SUBMIT ---
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJobForApply || !applicantFile) {
      showError("Please fill in the form and upload a resume.");
      return;
    }

    setIsApplying(true);
    const formData = new FormData();
    formData.append("files", applicantFile);

    try {
      const res = await axios.post(`${API_BASE}/resumes/upload?job_id=${selectedJobForApply.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const parsedResume = res.data[0];
      setApplySuccessData(parsedResume);
      
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setApplicantFile(null);
      
      fetchResumes();
      if (selectedJobId && parseInt(selectedJobId) === selectedJobForApply.id) {
        fetchMatches(selectedJobId);
      }
      
      showSuccess("Application submitted successfully!");
    } catch (err) {
      const errDetail = err.response?.data?.detail || "Application failed. Make sure your CV is text-based PDF/TXT.";
      showError(errDetail);
    } finally {
      setIsApplying(false);
    }
  };

  // --- DYNAMIC DUAL ENGINE (CALCULATING WEIGHTED SCORE CLIENT-SIDE IN REALTIME) ---
  const processedMatches = useMemo(() => {
    const totalWeight = weights.skills + weights.experience + weights.education + weights.roleFit;
    const wSkills = weights.skills / (totalWeight || 1);
    const wExp = weights.experience / (totalWeight || 1);
    const wEdu = weights.education / (totalWeight || 1);
    const wRole = weights.roleFit / (totalWeight || 1);

    return matches.map(match => {
      const recalculatedScore = (
        match.skill_score * wSkills +
        match.experience_score * wExp +
        match.education_score * wEdu +
        match.role_fit_score * wRole
      );
      
      let recommendation = "REJECT";
      if (recalculatedScore >= 8.0) recommendation = "SHORTLIST";
      else if (recalculatedScore >= 6.0) recommendation = "REVIEW";
      
      return {
        ...match,
        score: recalculatedScore,
        recommendation
      };
    });
  }, [matches, weights]);

  // --- FILTER & SORT PROCESSOR ---
  const filteredAndSortedMatches = useMemo(() => {
    return processedMatches
      .filter(match => {
        const nameMatch = (match.resume.name || match.resume.filename || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        
        const recMatch = statusFilter === 'ALL' || match.recommendation === statusFilter;
        const stageMatch = stageFilter === 'ALL' || match.stage === stageFilter;
        const scoreMatch = match.score >= minScoreFilter;
        
        return nameMatch && recMatch && stageMatch && scoreMatch;
      })
      .sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];
        
        if (sortField === 'name') {
          fieldA = a.resume.name || a.resume.filename || '';
          fieldB = b.resume.name || b.resume.filename || '';
        }
        
        if (sortField === 'score') {
          fieldA = a.score;
          fieldB = b.score;
        }

        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [processedMatches, searchQuery, statusFilter, stageFilter, minScoreFilter, sortField, sortOrder]);

  // Applicant Job Listings Search & Dynamic Tag Filter
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const { dept, loc } = getJobTags(job);
      const textMatch = job.title.toLowerCase().includes(applySearchQuery.toLowerCase()) || 
                        job.description.toLowerCase().includes(applySearchQuery.toLowerCase());
      
      const deptMatch = selectedDeptFilter === 'ALL' || dept === selectedDeptFilter;
      const locMatch = selectedLocFilter === 'ALL' || loc === selectedLocFilter;
      
      return textMatch && deptMatch && locMatch;
    });
  }, [jobs, applySearchQuery, selectedDeptFilter, selectedLocFilter]);

  // --- STATS / METRICS PANEL ---
  const metrics = useMemo(() => {
    if (processedMatches.length === 0) {
      return { total: 0, screening: 0, interviewing: 0, hired: 0, rejected: 0, avgScore: 0 };
    }
    const total = processedMatches.length;
    const screening = processedMatches.filter(m => m.stage === 'Screening').length;
    const interviewing = processedMatches.filter(m => m.stage === 'Interviewing').length;
    const hired = processedMatches.filter(m => m.stage === 'Hired').length;
    const rejected = processedMatches.filter(m => m.stage === 'Rejected' || m.stage === 'REJECT').length;
    const sum = processedMatches.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = Number(Math.round(sum / total + 'e1') + 'e-1');
    return { total, screening, interviewing, hired, rejected, avgScore };
  }, [processedMatches]);

  // --- EXPORT TO CSV GENERATOR ---
  const exportMatchesToCSV = () => {
    if (filteredAndSortedMatches.length === 0) {
      showError("No candidates available to export.");
      return;
    }
    const headers = ["Rank", "Candidate Name", "Email", "Phone", "Match Score", "Skills Fit", "Experience Fit", "Education Fit", "Role Fit", "Hiring Stage", "Verdict"];
    const rows = filteredAndSortedMatches.map((m, idx) => [
      idx + 1,
      `"${m.resume.name || 'Unnamed'}"`,
      `"${m.resume.email || 'N/A'}"`,
      `"${m.resume.phone || 'N/A'}"`,
      m.score.toFixed(1),
      m.skill_score.toFixed(1),
      m.experience_score.toFixed(1),
      m.education_score.toFixed(1),
      m.role_fit_score.toFixed(1),
      `"${m.stage || 'Screening'}"`,
      m.recommendation
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const jobTitleClean = selectedJob ? selectedJob.title.replace(/\s+/g, '_') : 'Candidates';
    link.setAttribute("download", `ScreenerAI_Rankings_${jobTitleClean}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess("Recruitment report exported as CSV.");
  };

  const toggleCompareCandidate = (id, e) => {
    e.stopPropagation();
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(cId => cId !== id);
      } else {
        if (prev.length >= 3) {
          showError("You can compare up to 3 candidates at a time.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const getRecommendationBadge = (rec) => {
    switch (rec) {
      case 'SHORTLIST':
        return <span className="px-3 py-1 text-[10px] tracking-wide font-extrabold rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Shortlist</span>;
      case 'REVIEW':
        return <span className="px-3 py-1 text-[10px] tracking-wide font-extrabold rounded-md bg-amber-950/40 text-amber-400 border border-amber-500/30 inline-flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Review</span>;
      case 'REJECT':
        return <span className="px-3 py-1 text-[10px] tracking-wide font-extrabold rounded-md bg-rose-950/40 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Reject</span>;
      default:
        return null;
    }
  };

  const getProgressBarColor = (score) => {
    if (score >= 8.0) return 'bg-cyan-400 shadow-[0_0_10px_#06b6d4]';
    if (score >= 6.0) return 'bg-indigo-500 shadow-[0_0_10px_#6366f1]';
    return 'bg-rose-500 shadow-[0_0_10px_#f43f5e]';
  };

  const getScoreColorClass = (score) => {
    if (score >= 8.0) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    if (score >= 6.0) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
  };

  const selectedJob = jobs.find(j => j.id === parseInt(selectedJobId));
  const initialLetter = selectedMatch ? (selectedMatch.resume.name || selectedMatch.resume.filename || 'C')[0].toUpperCase() : 'C';

  const comparedCandidates = useMemo(() => {
    return processedMatches.filter(m => compareIds.includes(m.resume_id));
  }, [compareIds, processedMatches]);

  const skillsGapMap = useMemo(() => {
    if (!selectedJob || !selectedMatch) return [];
    
    const jdSkills = [];
    const jdLower = selectedJob.description ? selectedJob.description.toLowerCase() : '';
    
    const TECH_KEYWORDS = [
      "python", "javascript", "typescript", "java", "c++", "c#", "php", "ruby", "go", "rust", "scala", "kotlin", "swift",
      "react", "angular", "vue", "next.js", "django", "flask", "fastapi", "spring boot", "express", "nest.js",
      "postgresql", "mysql", "sqlite", "mongodb", "redis", "docker", "kubernetes", "aws", "azure", "gcp", "git",
      "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "agile", "devops"
    ];
    
    TECH_KEYWORDS.forEach(skill => {
      if (jdLower.includes(skill)) {
        jdSkills.push(skill.length > 3 ? skill.charAt(0).toUpperCase() + skill.slice(1) : skill.toUpperCase());
      }
    });

    const candidateSkillsLower = (selectedMatch.resume.skills || []).map(s => s.toLowerCase());

    return jdSkills.map(skill => ({
      name: skill,
      hasSkill: candidateSkillsLower.includes(skill.toLowerCase())
    }));
  }, [selectedJob, selectedMatch]);

  const highlightedResumeText = useMemo(() => {
    if (!selectedMatch) return '';
    const text = selectedMatch.resume.raw_text || '';
    if (!resumeSearchTerm.trim()) return text;
    
    const parts = text.split(new RegExp(`(${escapeRegExp(resumeSearchTerm)})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === resumeSearchTerm.toLowerCase()
        ? `<mark class="bg-cyan-500/30 text-cyan-300 px-0.5 rounded font-bold border border-cyan-500/20">${part}</mark>`
        : part
    ).join('');
  }, [selectedMatch, resumeSearchTerm]);

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    container.style.setProperty('--mouse-x', `${x}px`);
    container.style.setProperty('--mouse-y', `${y}px`);
  };


  // --- CINEMATIC BOOT SCREEN LOADER ---
  if (!isBooted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#03050a] text-slate-300 relative overflow-hidden font-mono px-6">
        
        {/* Abstract futuristic grid layout overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        {/* Hologram glowing center orb */}
        <div className="relative z-10 space-y-8 max-w-lg w-full flex flex-col items-center text-center">
          
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Spinning radar-circle rings */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-radar" style={{ borderTopColor: '#06b6d4' }} />
            <div className="absolute inset-2 rounded-full border border-indigo-500/10 animate-radar" style={{ borderBottomColor: '#6366f1', animationDirection: 'reverse' }} />
            <Cpu className="w-10 h-10 text-cyan-405 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="font-extrabold text-lg text-white tracking-widest uppercase flex items-center gap-1.5 justify-center">
              Screener<span className="text-cyan-400 font-bold bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-[11px]">AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise Parser Sandbox</p>
          </div>

          {/* Running typewriter logs */}
          <div className="w-full text-left screener-card-sunken p-4 h-36 overflow-y-auto space-y-1.5 border border-slate-900 bg-slate-950/80 rounded-2xl text-[10px] text-slate-455 select-none leading-relaxed">
            {bootLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-1">
                <span className="text-cyan-550">&gt;</span>
                <span className="animate-float">{log}</span>
              </div>
            ))}
            {bootLogs.length < 5 && (
              <div className="flex items-center gap-1">
                <span className="text-cyan-550">&gt;</span>
                <div className="w-2 h-3.5 bg-cyan-400 animate-ping" />
              </div>
            )}
          </div>

          {/* Core progress line bar */}
          <div className="w-full space-y-1">
            <div className="flex justify-between text-[9px] text-slate-500 font-extrabold uppercase">
              <span>Establishing Core Bindings</span>
              <span>{bootProgress}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden border border-slate-950">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${bootProgress}%` }} />
            </div>
          </div>

          <div className="pt-2 w-full">
            <button
              onClick={() => setIsBooted(true)}
              disabled={bootLogs.length < 5}
              className={`w-full py-4 text-xs font-bold uppercase rounded-2xl transition-all duration-300 tracking-widest flex items-center justify-center gap-2 border cursor-pointer ${
                bootLogs.length >= 5 
                  ? 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border-transparent hover:scale-105 active:scale-95' 
                  : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
              }`}
            >
              <span>Initialize System Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col min-h-screen text-slate-355 antialiased font-sans screener-bg-cinematic relative overflow-hidden glow-spotlight-container cyber-grid-overlay" 
      onMouseMove={handleMouseMove}
    >
      <div className="glow-spotlight-overlay" />
      
      {/* HEADER SECTION */}
      <header className="relative z-30 bg-[#060813]/85 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <div className="w-full h-full bg-[#05070f] rounded-[10px] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 uppercase">
              Screener<span className="text-cyan-400 font-bold tracking-widest text-[10px] ml-0.5 bg-slate-900 border border-slate-800 px-1 py-0.5 rounded font-mono">AI</span>
            </h1>
            <p className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase">Enterprise Talent Portal</p>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-xs font-bold">
          <button 
            onClick={() => { setUserRole('applicant'); setSelectedJobForApply(null); setApplySuccessData(null); }} 
            className={`transition-colors py-1 ${userRole === 'applicant' ? 'text-white border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
          >
            Applicant Job Board
          </button>
          <button 
            onClick={() => {
              setUserRole('recruiter');
            }} 
            className={`transition-colors py-1 ${userRole === 'recruiter' ? 'text-white border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
          >
            Recruiter ATS Workspace
          </button>
          <a 
            href={`${API_BASE}/docs`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            API Docs <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </nav>

        <div>
          <button
            onClick={() => {
              setUserRole(userRole === 'applicant' ? 'recruiter' : 'applicant');
            }}
            className={`clay-btn text-xs px-4 py-2.5 rounded-xl ${userRole === 'applicant' ? 'clay-btn-cyan shadow-[0_0_15px_rgba(6,182,212,0.45)]' : 'clay-btn-dark border border-slate-800'}`}
          >
            {userRole === 'applicant' ? (
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Access Recruiter Console</span>
            ) : (
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-cyan-400" /> View Job Board</span>
            )}
          </button>
        </div>
      </header>

      {/* RECRUITER UPLOAD RADAR LOADER SCANNER */}
      {(isProcessingResumes || isMatching) && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-float">
          <div className="screener-card max-w-sm w-full p-8 text-center border-cyan-500/20 hologram-glow space-y-6 relative overflow-hidden">
            {/* Scan Beam vertical anim */}
            <div className="absolute inset-x-0 h-0.5 bg-cyan-400/50 shadow-[0_0_8px_#22d3ee] animate-scan-beam" />
            
            <div className="relative w-36 h-36 flex items-center justify-center mx-auto">
              {/* Spinning radar sweep */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/10 animate-radar" style={{ borderTopColor: '#06b6d4' }} />
              <div className="absolute inset-4 rounded-full border border-dashed border-indigo-500/20" />
              <Radio className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-white text-sm uppercase tracking-widest font-mono">Radar Parsing Active</h3>
              <p className="text-[10px] text-cyan-405 font-bold uppercase tracking-wider leading-relaxed animate-pulse">
                {processStatus || "Scanning database files..."}
              </p>
            </div>
            
            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden border border-slate-950">
              <div className="h-full bg-cyan-400 animate-pulse rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      )}

      {/* APPLICANT ROLE VIEW (PUBLIC JOB BOARD) */}
      {userRole === 'applicant' && (
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center w-full">
          
          {/* DARK SPACE MOVING STARS CANVAS BACKGROUND */}
          {!selectedJobForApply && !applySuccessData && (
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
              <canvas id="space-network-canvas" className="absolute inset-0 w-full h-full block" />
            </div>
          )}
          
          {/* Welcome view */}
          {!selectedJobForApply && !applySuccessData && (
            <>
              {/* FIXED CENTERED VIEWPORT FOR 3D PERSPECTIVE ZOOM LAYER TUNNEL */}
              <div className="fixed inset-x-0 top-16 bottom-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden">
                
                {/* DIMENSION 1: SYSTEM OVERVIEW PORTAL */}
                {dim1.opacity > 0 && (
                  <div 
                    className="absolute w-full max-w-6xl px-6 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-75 ease-out"
                    style={{
                      transform: `scale(${dim1.scale})`,
                      opacity: dim1.opacity,
                      pointerEvents: dim1.opacity > 0.85 ? 'auto' : 'none'
                    }}
                  >
                    <div className="inline-flex items-center gap-2 bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-4 py-1.5 rounded-full text-[9px] tracking-[0.2em] font-extrabold text-cyan-400 uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> 100% Local Sandboxed ATS Engine
                    </div>
                    
                    <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 tracking-tighter uppercase leading-none filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      Screener<span className="text-cyan-400 font-bold bg-slate-900 border border-slate-800 px-3 py-1 rounded-3xl ml-1 font-mono text-2xl sm:text-3xl md:text-4xl align-middle">AI</span>
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-slate-400 font-extrabold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
                      Automated Candidate Evaluation & Pipeline Orchestration
                    </p>

                    {/* METRICS BAR */}
                    <div className="screener-card p-4 grid grid-cols-5 gap-4 text-center border-slate-800 bg-[#060a12]/60 backdrop-blur-md w-full max-w-3xl">
                      <div>
                        <p className="text-lg font-black text-white font-mono leading-none">99.8%</p>
                        <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">CV Accuracy</p>
                      </div>
                      <div className="border-x border-slate-800/60">
                        <p className="text-lg font-black text-white font-mono leading-none">&lt; 15ms</p>
                        <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Parse Latency</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-white font-mono leading-none">100%</p>
                        <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Local Sandbox</p>
                      </div>
                      <div className="border-x border-slate-800/60">
                        <p className="text-lg font-black text-white font-mono leading-none">50+</p>
                        <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Skill Vectors</p>
                      </div>
                      <div>
                        <p className="text-lg font-black text-white font-mono leading-none">3-Stage</p>
                        <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Pipeline</p>
                      </div>
                    </div>

                    {/* FEATURE CARDS GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-3xl">
                      <div className="screener-card p-4 bg-[#060a12]/50 backdrop-blur-md text-left space-y-2 hover:border-cyan-500/30 transition-colors">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wide">Instant Parsing</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">PDF & TXT resumes parsed in under 15ms with zero-latency local NLP extraction engine.</p>
                      </div>
                      <div className="screener-card p-4 bg-[#060a12]/50 backdrop-blur-md text-left space-y-2 hover:border-cyan-500/30 transition-colors">
                        <Brain className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wide">Smart Scoring</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">Multi-dimensional scoring across skills, experience, education & project relevance vectors.</p>
                      </div>
                      <div className="screener-card p-4 bg-[#060a12]/50 backdrop-blur-md text-left space-y-2 hover:border-cyan-500/30 transition-colors">
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wide">Privacy First</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">All data stays local. No cloud uploads, no third-party APIs. 100% sandboxed processing.</p>
                      </div>
                      <div className="screener-card p-4 bg-[#060a12]/50 backdrop-blur-md text-left space-y-2 hover:border-cyan-500/30 transition-colors">
                        <Lock className="w-5 h-5 text-amber-400" />
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wide">Role-Based Access</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">Separate recruiter & applicant portals with isolated dashboards and data boundaries.</p>
                      </div>
                      <div className="screener-card p-4 bg-[#060a12]/50 backdrop-blur-md text-left space-y-2 hover:border-cyan-500/30 transition-colors">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wide">Multi-Department</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">Engineering, Design, Product, Marketing, Data — unified pipeline across all departments.</p>
                      </div>
                      <div className="screener-card p-4 bg-[#060a12]/50 backdrop-blur-md text-left space-y-2 hover:border-cyan-500/30 transition-colors">
                        <Clock className="w-5 h-5 text-rose-400" />
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wide">Real-Time Sync</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">Live pipeline updates. Scores recalculate instantly when criteria weights change.</p>
                      </div>
                    </div>

                    {/* TECH STACK ROW */}
                    <div className="flex items-center gap-4 justify-center flex-wrap pt-1">
                      {['React', 'Vite', 'FastAPI', 'SQLite', 'TailwindCSS', 'Python NLP'].map(tech => (
                        <span key={tech} className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">{tech}</span>
                      ))}
                    </div>

                    <div className="text-[10px] text-cyan-400 font-extrabold tracking-widest animate-bounce pt-2">
                      ↓ SCROLL TO ENTER INNER DIMENSION
                    </div>
                  </div>
                )}

                {/* DIMENSION 2: SYSTEM STORYBOARD & CALIBRATION COMMAND DASHBOARD */}
                {dim2.opacity > 0 && (
                  <div 
                    className="absolute w-full max-w-6xl px-6 flex flex-col items-center justify-center text-center space-y-5 transition-all duration-75 ease-out"
                    style={{
                      transform: `scale(${dim2.scale})`,
                      opacity: dim2.opacity,
                      pointerEvents: dim2.opacity > 0.7 ? 'auto' : 'none'
                    }}
                  >
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 rounded-full text-[9px] font-extrabold text-indigo-300">
                        <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Dimension 2 — Command Dashboard
                      </div>
                      <h3 className="text-3xl font-black text-white tracking-tight">System Controls & Evaluation Engine</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider max-w-xl mx-auto">Interactive sandbox to explore the screening pipeline, calibrate scoring weights, and simulate candidate evaluations in real-time</p>
                    </div>

                    {/* HOW IT WORKS — 3-STEP PIPELINE */}
                    <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
                      <div className="screener-card p-4 bg-[#060a12]/60 backdrop-blur-md text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h4 className="text-[11px] font-extrabold text-white uppercase">1. Upload</h4>
                        <p className="text-[8px] text-slate-500 leading-relaxed">Candidates submit PDF/TXT resumes. Recruiter creates job specs with required skills & criteria.</p>
                      </div>
                      <div className="screener-card p-4 bg-[#060a12]/60 backdrop-blur-md text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center mx-auto">
                          <ScanLine className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h4 className="text-[11px] font-extrabold text-white uppercase">2. Analyze</h4>
                        <p className="text-[8px] text-slate-500 leading-relaxed">NLP engine extracts skills, experience, education. Multi-vector scoring against job requirements.</p>
                      </div>
                      <div className="screener-card p-4 bg-[#060a12]/60 backdrop-blur-md text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto">
                          <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="text-[11px] font-extrabold text-white uppercase">3. Rank & Act</h4>
                        <p className="text-[8px] text-slate-500 leading-relaxed">Candidates ranked by match score. Recruiters shortlist, review, or reject via Kanban pipeline.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch w-full">
                      {/* Storyboard Deck — Enhanced */}
                      <div className="screener-card p-5 bg-[#070a13]/70 backdrop-blur-md border border-slate-800 flex flex-col justify-between min-h-[300px] relative overflow-hidden text-left">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-extrabold uppercase text-cyan-400 tracking-widest font-mono">Frame {activeStoryboardFrame + 1} of 3</span>
                            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[7px] font-extrabold rounded text-slate-400 uppercase">Auto-play</span>
                          </div>
                          <div className="min-h-[160px] animate-slide-left space-y-3" key={activeStoryboardFrame}>
                            {activeStoryboardFrame === 0 && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-cyan-400" />
                                  <h4 className="text-sm font-bold text-white">1. Intelligent Ingestion</h4>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">Uploaded resumes are parsed under 15ms inside local sandbox scopes using our zero-latency NLP extraction engine.</p>
                                <ul className="space-y-1.5">
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> PDF & TXT file support with automatic format detection</li>
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> Extracts name, email, phone, skills, experience, education</li>
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> No data leaves your local machine — 100% offline processing</li>
                                </ul>
                                <span className="inline-block px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/20 text-[7px] font-bold text-cyan-400 rounded-full uppercase">Avg parse: 12ms</span>
                              </>
                            )}
                            {activeStoryboardFrame === 1 && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Sliders className="w-4 h-4 text-indigo-400" />
                                  <h4 className="text-sm font-bold text-white">2. Criteria Calibration</h4>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">Adjust weight values dynamically across skill match, experience years, and education level. Scores recalculate instantly.</p>
                                <ul className="space-y-1.5">
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" /> Drag sliders to set importance of each evaluation vector</li>
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" /> Live score preview updates as weights change</li>
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" /> Per-job customizable scoring criteria</li>
                                </ul>
                                <span className="inline-block px-2 py-0.5 bg-indigo-400/10 border border-indigo-400/20 text-[7px] font-bold text-indigo-400 rounded-full uppercase">50+ skill vectors</span>
                              </>
                            )}
                            {activeStoryboardFrame === 2 && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Layers className="w-4 h-4 text-emerald-400" />
                                  <h4 className="text-sm font-bold text-white">3. Pipeline Action</h4>
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed">Move candidate entities between Kanban stages. Track every candidate from submission through final decision.</p>
                                <ul className="space-y-1.5">
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> 3-stage pipeline: Shortlisted → Under Review → Final Decision</li>
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> Bulk actions: approve, reject, or advance multiple candidates</li>
                                  <li className="flex items-start gap-2 text-[9px] text-slate-500"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> Full audit trail with timestamps and score snapshots</li>
                                </ul>
                                <span className="inline-block px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/20 text-[7px] font-bold text-emerald-400 rounded-full uppercase">Kanban Pipeline</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-3">
                          <button type="button" onClick={() => setIsStoryboardAutoplay(!isStoryboardAutoplay)} className="px-3 py-1 bg-slate-950 border border-slate-800 text-[8px] rounded text-slate-400 cursor-pointer hover:text-white transition-colors">
                            {isStoryboardAutoplay ? "⏸ Pause" : "▶ Play"}
                          </button>
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map(idx => (
                              <button key={idx} onClick={() => { setActiveStoryboardFrame(idx); setIsStoryboardAutoplay(false); }} className={`w-2 h-2 rounded-full transition-colors ${idx === activeStoryboardFrame ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.5)]' : 'bg-slate-800 hover:bg-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Calibrator Sandbox — Enhanced */}
                      <div className="cyber-card-trace p-5 flex flex-col justify-between min-h-[300px] relative overflow-hidden text-left">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-extrabold uppercase text-indigo-400 tracking-widest font-mono">Live Scoring Simulator</span>
                            <Gauge className="w-4 h-4 text-indigo-400" />
                          </div>
                          
                          {/* Skills */}
                          <div className="space-y-1.5">
                            <label className="block text-[7px] font-extrabold text-slate-500 uppercase tracking-widest">Tech Stack Match</label>
                            <div className="flex flex-wrap gap-1.5">
                              {["React", "Python", "SQL", "Node.js", "Docker", "AWS"].map(skill => {
                                const active = simSkills.includes(skill);
                                return (
                                  <button key={skill} onClick={() => active ? setSimSkills(s => s.filter(x => x !== skill)) : setSimSkills(s => [...s, skill])} className={`px-2 py-1 rounded text-[8px] font-bold transition-colors ${active ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'}`}>
                                    {skill}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Experience */}
                          <div className="space-y-1">
                            <label className="block text-[7px] font-extrabold text-slate-500 uppercase tracking-widest">Experience Level</label>
                            <input type="range" min="0" max="10" value={simExp} onChange={(e) => setSimExp(parseInt(e.target.value))} className="w-full h-1.5 accent-cyan-400 bg-slate-900 cursor-pointer rounded-lg" />
                            <div className="flex justify-between text-[7px] text-slate-600 font-bold">
                              <span>0 yr</span>
                              <span className="text-cyan-400 font-extrabold">{simExp} years</span>
                              <span>10 yr</span>
                            </div>
                          </div>

                          {/* Education */}
                          <div className="space-y-1">
                            <label className="block text-[7px] font-extrabold text-slate-500 uppercase tracking-widest">Education Tier</label>
                            <div className="flex gap-1.5">
                              {['High School', 'Bachelors', 'Masters', 'PhD'].map((tier, i) => (
                                <button key={tier} onClick={() => setSimEdu(tier)} className={`px-2 py-1 rounded text-[7px] font-bold transition-colors ${simEdu === tier ? 'bg-indigo-400/15 text-indigo-400 border border-indigo-400/30' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>
                                  {tier}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Score Output */}
                          <div className="screener-card p-3 bg-[#060a12]/60 border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-widest">Candidate Score</span>
                              <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${simMetrics.verdict === 'SHORTLIST' ? 'bg-emerald-400/15 text-emerald-400' : simMetrics.verdict === 'REVIEW' ? 'bg-amber-400/15 text-amber-400' : 'bg-red-400/15 text-red-400'}`}>{simMetrics.verdict}</span>
                            </div>
                            <div className="flex items-end gap-3">
                              <span className="text-4xl font-black text-white leading-none">{simMetrics.scorePercentage}<span className="text-lg text-slate-500">%</span></span>
                              <div className="flex-1 bg-slate-900 rounded-full h-2 overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-300 ${simMetrics.scorePercentage >= 70 ? 'bg-emerald-400' : simMetrics.scorePercentage >= 40 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${simMetrics.scorePercentage}%` }} />
                              </div>
                            </div>
                            <p className="text-[8px] text-slate-500 italic mt-2">"{simMetrics.message}"</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-indigo-300 font-extrabold tracking-widest animate-bounce">
                      ↓ CONTINUE DEEPER INTO THE SYSTEM
                    </div>
                  </div>
                )}

                {/* DIMENSION 3: PIPELINE REGISTRY & JOB BOARD */}
                {dim3.opacity > 0 && (
                  <div 
                    className="absolute inset-0 w-full h-full overflow-y-auto px-6 py-16 flex flex-col items-center space-y-6 transition-all duration-75 ease-out"
                    style={{
                      transform: `scale(${dim3.scale})`,
                      opacity: dim3.opacity,
                      pointerEvents: dim3.opacity > 0.5 ? 'auto' : 'none'
                    }}
                  >
                    <div className="w-full max-w-5xl space-y-6 text-center">
                      
                      {/* HEADER */}
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 px-4 py-1.5 rounded-full text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest">
                          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Dimension 3 — Career Portal
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight">Active Job Openings</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider max-w-lg mx-auto">Explore open positions across all departments. Click any role to submit your application through our AI-powered screening pipeline.</p>
                      </div>

                      {/* HIRING STATS */}
                      <div className="screener-card p-4 grid grid-cols-4 gap-4 text-center border-slate-800 bg-[#060a12]/60 backdrop-blur-md w-full max-w-3xl mx-auto">
                        <div>
                          <p className="text-lg font-black text-white font-mono leading-none">{filteredJobs.length}</p>
                          <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Open Roles</p>
                        </div>
                        <div className="border-x border-slate-800/60">
                          <p className="text-lg font-black text-white font-mono leading-none">&lt; 24h</p>
                          <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Avg Response</p>
                        </div>
                        <div>
                          <p className="text-lg font-black text-white font-mono leading-none">5+</p>
                          <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Departments</p>
                        </div>
                        <div className="border-l border-slate-800/60">
                          <p className="text-lg font-black text-white font-mono leading-none">Global</p>
                          <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Locations</p>
                        </div>
                      </div>

                      {/* WHY JOIN US */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mx-auto">
                        <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-center space-y-1.5">
                          <Rocket className="w-5 h-5 text-cyan-400 mx-auto" />
                          <h4 className="text-[9px] font-extrabold text-white uppercase">Fast Growth</h4>
                          <p className="text-[7px] text-slate-500 leading-relaxed">Accelerated career paths with mentorship programs</p>
                        </div>
                        <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-center space-y-1.5">
                          <Brain className="w-5 h-5 text-indigo-400 mx-auto" />
                          <h4 className="text-[9px] font-extrabold text-white uppercase">AI-First Culture</h4>
                          <p className="text-[7px] text-slate-500 leading-relaxed">Work with cutting-edge AI and automation tools daily</p>
                        </div>
                        <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-center space-y-1.5">
                          <Globe className="w-5 h-5 text-emerald-400 mx-auto" />
                          <h4 className="text-[9px] font-extrabold text-white uppercase">Remote Friendly</h4>
                          <p className="text-[7px] text-slate-500 leading-relaxed">Flexible work from anywhere with async collaboration</p>
                        </div>
                        <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-center space-y-1.5">
                          <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
                          <h4 className="text-[9px] font-extrabold text-white uppercase">Great Benefits</h4>
                          <p className="text-[7px] text-slate-500 leading-relaxed">Competitive comp, equity, health coverage & learning budget</p>
                        </div>
                      </div>

                      {/* FILTERS */}
                      <div className="flex flex-wrap items-center justify-center gap-3">
                        <select className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-extrabold rounded-xl p-2 focus:outline-none" value={selectedDeptFilter} onChange={(e) => setSelectedDeptFilter(e.target.value)}>
                          <option value="ALL">All Departments</option>
                          {DEPARTMENTS.filter(d => d !== "ALL").map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-extrabold rounded-xl p-2 focus:outline-none" value={selectedLocFilter} onChange={(e) => setSelectedLocFilter(e.target.value)}>
                          <option value="ALL">All Locations</option>
                          {LOCATIONS.filter(l => l !== "ALL").map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <input type="text" placeholder="Search roles or skills..." className="pl-3 pr-4 py-2 bg-slate-900 border border-slate-800 text-xs text-white rounded-xl focus:outline-none w-52 font-bold placeholder:text-slate-600" value={applySearchQuery} onChange={(e) => setApplySearchQuery(e.target.value)} />
                        <span className="text-[8px] text-slate-600 font-bold">{filteredJobs.length} results</span>
                      </div>

                      {/* JOB GRID — Enhanced Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-2">
                        {filteredJobs.map(job => {
                          const { dept, loc } = getJobTags(job);
                          const skills = job.required_skills ? job.required_skills.split(',').slice(0, 4) : [];
                          return (
                            <div key={job.id} onClick={() => setSelectedJobForApply(job)} className="screener-card p-5 hover:border-cyan-500/40 hover:scale-[1.01] cursor-pointer transition-all bg-[#060a12]/50 backdrop-blur-md group flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-1">
                                    <h4 className="font-extrabold text-white text-sm group-hover:text-cyan-400 transition-colors leading-tight">{job.title}</h4>
                                    <div className="flex items-center gap-2">
                                      <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[7px] font-extrabold rounded text-cyan-400 uppercase tracking-wider">{dept}</span>
                                      <span className="text-[8px] text-slate-600">📍 {loc || 'Remote'}</span>
                                    </div>
                                  </div>
                                  <Briefcase className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors shrink-0" />
                                </div>
                                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-3">{job.description}</p>
                                {skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {skills.map(s => (
                                      <span key={s} className="px-1.5 py-0.5 bg-slate-900/80 border border-slate-800 text-[7px] font-bold text-slate-500 rounded">{s.trim()}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between">
                                <span className="text-[8px] text-slate-600">Posted: {new Date(job.created_at || Date.now()).toLocaleDateString()}</span>
                                <span className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-widest group-hover:underline">Apply Now →</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* FOOTER CTA */}
                      <div className="screener-card p-5 bg-[#060a12]/60 backdrop-blur-md text-center space-y-2 max-w-lg mx-auto mt-4">
                        <Sparkles className="w-6 h-6 text-cyan-400 mx-auto" />
                        <h4 className="text-sm font-extrabold text-white">Don't see your role?</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">New positions are added weekly. Check back regularly or submit your resume to be considered for future openings across all departments.</p>
                      </div>
                    </div>
                  </div>
                )}
                {/* DIMENSION 4: DEVELOPER INFO */}
                {dim4.opacity > 0 && (
                  <div 
                    className="absolute inset-0 w-full h-full overflow-y-auto px-6 py-16 flex flex-col items-center space-y-6 transition-all duration-75 ease-out"
                    style={{
                      transform: `scale(${dim4.scale})`,
                      opacity: dim4.opacity,
                      pointerEvents: dim4.opacity > 0.5 ? 'auto' : 'none'
                    }}
                  >
                    <div className="w-full max-w-4xl space-y-8 text-center">

                      {/* BADGE */}
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full text-[9px] font-extrabold text-amber-400 uppercase tracking-widest">
                          <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Dimension 4 — Developer
                        </div>
                      </div>

                      {/* DEVELOPER CARD */}
                      <div className="screener-card p-8 bg-[#060a12]/70 backdrop-blur-md border-slate-800 space-y-6 max-w-2xl mx-auto">
                        
                        {/* Avatar Circle */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-indigo-500 to-amber-400 p-[3px] mx-auto">
                          <div className="w-full h-full rounded-full bg-[#060a12] flex items-center justify-center">
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">NG</span>
                          </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-2">
                          <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight uppercase leading-tight">
                            N.GOWTHAM SAI
                          </h2>
                          <p className="text-sm text-cyan-400 font-extrabold uppercase tracking-[0.3em]">Full Stack Developer</p>
                          <div className="flex items-center justify-center gap-3 pt-1">
                            <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-[8px] font-extrabold text-cyan-400 uppercase tracking-wider">React</span>
                            <span className="px-3 py-1 bg-indigo-400/10 border border-indigo-400/20 rounded-full text-[8px] font-extrabold text-indigo-400 uppercase tracking-wider">Python</span>
                            <span className="px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-[8px] font-extrabold text-emerald-400 uppercase tracking-wider">FastAPI</span>
                            <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-[8px] font-extrabold text-amber-400 uppercase tracking-wider">AI/ML</span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-800" />

                        {/* About */}
                        <div className="space-y-2 text-left">
                          <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">About the Developer</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Passionate full-stack developer with expertise in building modern web applications, AI-powered tools, and scalable backend systems. Designed and developed this entire Smart Resume Screener platform — from the animated space-theme landing page to the AI scoring engine and recruiter console.
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-3">
                          <div className="screener-card p-3 bg-[#060a12]/60 text-center">
                            <p className="text-lg font-black text-white font-mono leading-none">2.7K+</p>
                            <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Lines of Code</p>
                          </div>
                          <div className="screener-card p-3 bg-[#060a12]/60 text-center">
                            <p className="text-lg font-black text-white font-mono leading-none">4</p>
                            <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Dimensions</p>
                          </div>
                          <div className="screener-card p-3 bg-[#060a12]/60 text-center">
                            <p className="text-lg font-black text-white font-mono leading-none">Full</p>
                            <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Stack</p>
                          </div>
                          <div className="screener-card p-3 bg-[#060a12]/60 text-center">
                            <p className="text-lg font-black text-white font-mono leading-none">AI</p>
                            <p className="text-[7px] text-slate-500 font-extrabold uppercase tracking-widest mt-1">Powered</p>
                          </div>
                        </div>
                      </div>

                      {/* TECH EXPERTISE */}
                      <div className="space-y-4 max-w-2xl mx-auto">
                        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Tech Expertise</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-left space-y-1">
                            <Cpu className="w-4 h-4 text-cyan-400" />
                            <h5 className="text-[10px] font-extrabold text-white uppercase">Frontend</h5>
                            <p className="text-[8px] text-slate-500">React, Vite, TailwindCSS, Canvas API, CSS Animations</p>
                          </div>
                          <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-left space-y-1">
                            <Database className="w-4 h-4 text-indigo-400" />
                            <h5 className="text-[10px] font-extrabold text-white uppercase">Backend</h5>
                            <p className="text-[8px] text-slate-500">Python, FastAPI, SQLite, REST APIs, SQLAlchemy</p>
                          </div>
                          <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-left space-y-1">
                            <Brain className="w-4 h-4 text-emerald-400" />
                            <h5 className="text-[10px] font-extrabold text-white uppercase">AI & NLP</h5>
                            <p className="text-[8px] text-slate-500">Resume Parsing, Skill Extraction, Scoring Algorithms</p>
                          </div>
                          <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-left space-y-1">
                            <Layers className="w-4 h-4 text-rose-400" />
                            <h5 className="text-[10px] font-extrabold text-white uppercase">Architecture</h5>
                            <p className="text-[8px] text-slate-500">Microservices, REST, Component Design, State Management</p>
                          </div>
                          <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-left space-y-1">
                            <Terminal className="w-4 h-4 text-amber-400" />
                            <h5 className="text-[10px] font-extrabold text-white uppercase">DevOps</h5>
                            <p className="text-[8px] text-slate-500">Git, CI/CD, Docker, Environment Configuration</p>
                          </div>
                          <div className="screener-card p-3 bg-[#060a12]/50 backdrop-blur-md text-left space-y-1">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                            <h5 className="text-[10px] font-extrabold text-white uppercase">UI/UX</h5>
                            <p className="text-[8px] text-slate-500">3D Animations, Scroll Effects, Dark Themes, Motion Design</p>
                          </div>
                        </div>
                      </div>

                      {/* PROJECT HIGHLIGHTS */}
                      <div className="screener-card p-6 bg-[#060a12]/60 backdrop-blur-md max-w-2xl mx-auto text-left space-y-4">
                        <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest text-center">This Project — Built From Scratch</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400"><span className="text-white font-bold">4-Dimension Scroll Portal</span> — Immersive zoom-through landing page with 3D perspective transforms and space starfield canvas</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400"><span className="text-white font-bold">AI Resume Screener</span> — NLP-powered candidate evaluation with multi-vector scoring across skills, experience & education</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400"><span className="text-white font-bold">Recruiter Console</span> — Full dashboard with job management, resume processing, Kanban pipeline & analytics</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400"><span className="text-white font-bold">Applicant Portal</span> — Job browsing, filtering, application submission with real-time feedback</p>
                          </div>
                        </div>
                      </div>

                      {/* FOOTER SIGNATURE */}
                      <div className="space-y-3 pt-4">
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Designed & Developed by</p>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 uppercase tracking-wider">
                          N.GOWTHAM SAI
                        </h3>
                        <p className="text-[9px] text-slate-600 italic">© {new Date().getFullYear()} — All rights reserved</p>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* FAKE HEIGHT SCROLL ANCHOR TRACKER */}
              <div style={{ height: '4500px' }} className="pointer-events-none w-full" />
            </>
          )}

          {/* APPLICATION FORM FOR SELECTED JOB */}
          {selectedJobForApply && !applySuccessData && (
            <section className="w-full max-w-4xl px-6 py-12 animate-float">
              
              <button 
                onClick={() => setSelectedJobForApply(null)}
                className="mb-6 text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Job Board
              </button>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                
                {/* Requirements Column */}
                <div className="md:col-span-2 space-y-4">
                  <div className="screener-card p-6 bg-[#070a13]/80 border border-slate-900">
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[9px] font-extrabold rounded-md text-cyan-455 uppercase tracking-wider">Active Spec</span>
                    <h3 className="font-extrabold text-white text-base mt-2">{selectedJobForApply.title}</h3>
                    
                    <div className="mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400 font-medium leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto">
                      {selectedJobForApply.description}
                    </div>
                  </div>
                </div>

                {/* Apply Form Column */}
                <div className="md:col-span-3 screener-card p-6 border-indigo-500/20 bg-[#070a13]/80">
                  <h3 className="font-bold text-white text-base mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4.5 h-4.5 text-cyan-400" /> Apply For This Position
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-5">
                    Submit your details and CV text-based PDF/TXT file below:
                  </p>

                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input
                        type="text"
                        className="w-full cyber-input p-3 text-xs font-semibold focus:outline-none"
                        placeholder="John Doe"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                        <input
                          type="email"
                          className="w-full cyber-input p-3 text-xs font-semibold focus:outline-none"
                          placeholder="johndoe@example.com"
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          className="w-full cyber-input p-3 text-xs font-semibold focus:outline-none"
                          placeholder="+1 (555) 000-0000"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Upload CV (PDF or TXT)</label>
                      <label className="relative border border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-cyan-500/50 hover:bg-slate-950/20 cursor-pointer transition-all duration-300">
                        <input
                          type="file"
                          accept=".pdf,.txt"
                          className="hidden"
                          onChange={(e) => setApplicantFile(e.target.files[0])}
                          required
                        />
                        <Upload className="w-5 h-5 text-cyan-400 mb-2 animate-bounce" />
                        <span className="text-xs font-bold text-slate-300">
                          {applicantFile ? applicantFile.name : "Select Resume File"}
                        </span>
                        <span className="text-[9px] text-slate-500 mt-1 font-semibold">Maximum file size: 5MB</span>
                      </label>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="w-full clay-btn clay-btn-cyan py-3.5 text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                      >
                        {isApplying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            <span>Parsing CV & Registering Profile...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Submit Application</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                </div>

              </div>

            </section>
          )}

          {/* APPLICATION SUBMISSION SUCCESS DETAILS SCREEN */}
          {applySuccessData && (
            <section className="w-full max-w-xl px-6 py-20 animate-float text-center">
              <div className="screener-card p-8 border-emerald-500/20 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-white text-xl animate-float">Application Received!</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Thank you for applying. Our recruitment pipeline parser has scanned your CV and indexed your profile.
                  </p>
                </div>

                <div className="screener-card-sunken p-4 text-left space-y-3.5 border border-slate-900 rounded-2xl bg-[#090d16]/90">
                  <h4 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 font-mono">
                    Extracted Profile Details (Local Parser)
                  </h4>
                  <div className="space-y-1.5 text-xs font-semibold">
                    <p className="text-slate-400">Name: <span className="text-white font-extrabold">{applySuccessData.name || 'Unnamed'}</span></p>
                    <p className="text-slate-400">Email: <span className="text-white font-extrabold">{applySuccessData.email || 'N/A'}</span></p>
                    <p className="text-slate-400">Phone: <span className="text-white font-extrabold">{applySuccessData.phone || 'N/A'}</span></p>
                  </div>
                  
                  <div className="space-y-1.5 pt-1.5 border-t border-slate-900/60">
                    <p className="text-[9px] font-extrabold text-slate-550 uppercase tracking-widest font-mono">Identified Stack Matrix:</p>
                    <div className="flex flex-wrap gap-1">
                      {(applySuccessData.skills || []).slice(0, 8).map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-955 border border-slate-800 rounded-lg text-slate-350 text-[9px] font-bold">{skill}</span>
                      ))}
                      {(applySuccessData.skills || []).length === 0 && (
                        <span className="text-slate-500 italic text-[10px]">No skills identified.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setApplySuccessData(null);
                      setSelectedJobForApply(null);
                    }}
                    className="clay-btn clay-btn-cyan w-full py-3 text-xs rounded-xl"
                  >
                    Return to Job Board
                  </button>
                </div>

              </div>
            </section>
          )}

        </div>
      )}

      {/* RECRUITER ROLE VIEW (CONSOLE WORKSPACE) */}
      {userRole === 'recruiter' && (
        <div className="flex-1 relative z-20">
          
          {/* BACKGROUND GRAPHIC SLIDESHOW */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {consoleImages.map((src, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat ${
                  idx === consoleImageIndex ? 'opacity-35' : 'opacity-0'
                }`}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
            <div className="absolute inset-0 bg-[#05070f]/60" />
          </div>

          <div className="relative z-10 animate-float">
            
            {/* WORKSPACE ERROR / SUCCESS ALERTS */}
            {errorAlert && (
              <div className="screener-card border-l-4 border-rose-500 p-4 mx-6 mt-6 flex items-start gap-3 bg-rose-955/20 animate-float">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-rose-300 text-sm">Workspace Error</h3>
                  <p className="text-xs text-rose-400 mt-1 font-medium">{errorAlert}</p>
                </div>
                <button onClick={() => setErrorAlert('')} className="text-rose-400 hover:text-rose-255"><X className="w-4 h-4" /></button>
              </div>
            )}

            {successMessage && (
              <div className="screener-card border-l-4 border-emerald-500 p-4 mx-6 mt-6 flex items-start gap-3 bg-emerald-955/20 animate-float">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-300 text-sm">System Update</h3>
                  <p className="text-xs text-emerald-400 mt-1 font-medium">{successMessage}</p>
                </div>
                <button onClick={() => setSuccessMessage('')} className="text-emerald-400 hover:text-emerald-255"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* ADD JOB BOX */}
            {isAddingJob && (
              <div className="mx-6 mt-6 screener-card p-6 shadow-xl relative border-indigo-500/20 animate-float bg-[#070a13]/90">
                <h3 className="font-bold text-white text-base mb-4 flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-cyan-400" /> Define New Candidate Requirement
                </h3>
                <form onSubmit={handleAddJob} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Job Title</label>
                    <input
                      type="text"
                      className="w-full cyber-input p-3 text-xs font-semibold focus:outline-none"
                      placeholder="e.g. Senior Machine Learning Engineer"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">Requirements & Tech stack</label>
                    <textarea
                      rows="5"
                      className="w-full cyber-input p-3 text-xs font-medium focus:outline-none font-mono"
                      placeholder="Paste the job description. Describe tools, languages, and qualifications."
                      value={newJobDesc}
                      onChange={(e) => setNewJobDesc(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingJob(false)}
                      className="clay-btn clay-btn-dark px-4 py-2 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="clay-btn clay-btn-cyan px-5 py-2 text-xs shadow-md"
                    >
                      Save Requirement
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* MAIN DASHBOARD BLOCK */}
            <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-float">
              
              {/* LEFT COLUMN: ACTIVE JOB + UPLOADS + FUNNEL SCORES */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* ROLE SELECTION */}
                <div className="screener-card p-6 bg-[#070a13]/85 border-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="font-extrabold text-slate-400 text-[10px] uppercase tracking-widest">
                      Active Requirements
                    </h3>
                    <button 
                      onClick={() => setIsAddingJob(true)}
                      className="text-cyan-400 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Role
                    </button>
                  </div>
                  
                  {jobs.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-2">
                        <select
                          className="flex-1 bg-slate-955 border border-slate-900 text-slate-200 text-xs font-bold rounded-xl p-3 focus:outline-none"
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                          {jobs.map(j => (
                            <option key={j.id} value={j.id}>{j.title}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDeleteJob(selectedJobId)}
                          className="clay-btn clay-btn-dark p-3 text-xs rounded-xl flex items-center justify-center hover:border-rose-900/60"
                          title="Delete active job description specification"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                      {selectedJob && (
                        <div className="screener-card-sunken rounded-2xl p-4 max-h-40 overflow-y-auto text-[11px] text-slate-400 font-medium leading-relaxed whitespace-pre-line border border-slate-900">
                          {selectedJob.description}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No roles created. Please click Add Role above.
                    </div>
                  )}
                </div>

                {/* UPLOAD PANEL */}
                <div className="screener-card p-6 bg-[#070a13]/85 border-slate-900">
                  <h3 className="font-extrabold text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center justify-between">
                    <span>Candidate Uploads</span>
                    <Upload className="w-4 h-4 text-cyan-400" />
                  </h3>
                  
                  <div className="mt-4 space-y-4">
                    <label 
                      className={`relative border border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                        isProcessingResumes 
                          ? 'border-cyan-500/40 bg-cyan-955/10 cursor-not-allowed' 
                          : !selectedJobId
                            ? 'border-slate-855 bg-slate-955/30 opacity-40 cursor-not-allowed'
                            : 'border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950/50 cursor-pointer'
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.txt"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isProcessingResumes || !selectedJobId}
                      />
                      <div className={`p-4 rounded-full mb-3 border shadow-[inset_1px_1px_3px_rgba(0,0,0,0.8)] ${
                        !selectedJobId ? 'bg-slate-950 text-slate-600 border-slate-900' : 'bg-slate-950 text-cyan-400 border-slate-800'
                      }`}>
                        <Upload className="w-6 h-6 stroke-[2]" />
                      </div>
                      {!selectedJobId ? (
                        <>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Locked</p>
                          <p className="text-[9px] text-rose-500/80 mt-1 font-extrabold uppercase tracking-wide">Please select or add a job spec first</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">Upload CV Batch</p>
                          <p className="text-[10px] text-slate-500 mt-1 font-medium">Supports PDF/TXT (Up to 20 files)</p>
                        </>
                      )}
                    </label>

                    {selectedJobId && resumes.length > 0 && !isProcessingResumes && (
                      <button
                        onClick={handleReevaluateAll}
                        disabled={isMatching}
                        className="w-full clay-btn clay-btn-dark py-3.5 text-xs shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                      >
                        <Database className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>Re-screen Database Resumes ({resumes.length})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* REAL-TIME CALIBRATION SLIDERS */}
                <div className="screener-card p-6 bg-[#070a13]/85 border-slate-900">
                  <h3 className="font-extrabold text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center justify-between">
                    <span>Dimension Weight Calibration</span>
                    <Sliders className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  </h3>
                  
                  <div className="mt-4 space-y-4">
                    <p className="text-[10px] text-slate-550 font-bold uppercase tracking-wider leading-relaxed">
                      Adjust weights to recalculate candidate scores dynamically:
                    </p>
                    
                    <div className="space-y-3">
                      {/* Skills Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Technical Skills</span>
                          <span className="text-cyan-400">{weights.skills}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          className="w-full cursor-pointer h-1 accent-cyan-400 rounded-lg bg-slate-900 border border-slate-900"
                          value={weights.skills}
                          onChange={(e) => setWeights(prev => ({ ...prev, skills: parseInt(e.target.value) }))}
                        />
                      </div>

                      {/* Experience Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Work Experience</span>
                          <span className="text-cyan-400">{weights.experience}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          className="w-full cursor-pointer h-1 accent-cyan-400 rounded-lg bg-slate-900 border border-slate-900"
                          value={weights.experience}
                          onChange={(e) => setWeights(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                        />
                      </div>

                      {/* Education Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">Education Specs</span>
                          <span className="text-cyan-400">{weights.education}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          className="w-full cursor-pointer h-1 accent-cyan-400 rounded-lg bg-slate-900 border border-slate-900"
                          value={weights.education}
                          onChange={(e) => setWeights(prev => ({ ...prev, education: parseInt(e.target.value) }))}
                        />
                      </div>

                      {/* Role Fit Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-400">General Role Fit</span>
                          <span className="text-cyan-400">{weights.roleFit}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          className="w-full cursor-pointer h-1 accent-cyan-400 rounded-lg bg-slate-900 border border-slate-900"
                          value={weights.roleFit}
                          onChange={(e) => setWeights(prev => ({ ...prev, roleFit: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT / MIDDLE COLUMN: RANKINGS & FILTER SECTION */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* METRICS QUICK STATS PANELS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="screener-card p-4 flex flex-col justify-between bg-[#070a13]/85 border-slate-900 shadow-md">
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Total Applicants</span>
                      <p className="font-extrabold text-2xl text-white mt-1 font-mono">{metrics.total}</p>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-cyan-400" style={{ width: '100%' }} />
                    </div>
                  </div>
                  
                  <div className="screener-card p-4 flex flex-col justify-between bg-[#070a13]/85 border border-slate-900 shadow-md">
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest font-mono">In Interviewing</span>
                      <p className="font-extrabold text-2xl text-cyan-400 mt-1 font-mono">{metrics.interviewing}</p>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" style={{ width: `${metrics.total > 0 ? (metrics.interviewing / metrics.total) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div className="screener-card p-4 flex flex-col justify-between bg-[#070a13]/85 border border-slate-900 shadow-md">
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest font-mono">Total Hired</span>
                      <p className="font-extrabold text-2xl text-emerald-450 mt-1 font-mono">{metrics.hired}</p>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-emerald-400 shadow-[0_0_8px_#34d399]" style={{ width: `${metrics.total > 0 ? (metrics.hired / metrics.total) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div className="screener-card p-4 flex flex-col justify-between bg-[#070a13]/85 border border-slate-900 shadow-md">
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest font-mono">Total Screening</span>
                      <p className="font-extrabold text-2xl text-slate-400 mt-1 font-mono">{metrics.screening}</p>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-slate-400 shadow-[0_0_8px_#a1a1aa]" style={{ width: `${metrics.total > 0 ? (metrics.screening / metrics.total) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>

                {/* SEARCH, FILTER AND BLOCKBUSTER TOOLBAR */}
                <div className="screener-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#070a13]/85 border-slate-900">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Search applicants by name..."
                      className="w-full pl-9 pr-4 py-2.5 cyber-input text-xs font-bold focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Pipeline Stage Filter */}
                    <div className="flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-slate-505" />
                      <select
                        className="bg-slate-955 border border-slate-900 text-slate-450 text-[11px] font-bold rounded-xl p-2.5 cursor-pointer focus:outline-none cyber-badge animate-pulse"
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                      >
                        <option value="ALL">All Stages</option>
                        {PIPELINE_STAGES.map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                    </div>

                    {/* Verdict Filter */}
                    <div className="flex items-center gap-1.5">
                      <select
                        className="bg-slate-955 border border-slate-900 text-slate-455 text-[11px] font-bold rounded-xl p-2.5 cursor-pointer focus:outline-none cyber-badge"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="ALL">All Match Grades</option>
                        <option value="SHORTLIST">Shortlist Grade</option>
                        <option value="REVIEW">Review Grade</option>
                        <option value="REJECT">Reject Grade</option>
                      </select>
                    </div>

                    {/* CSV Report Exporter */}
                    <button
                      onClick={exportMatchesToCSV}
                      className="clay-btn clay-btn-dark px-3.5 py-2.5 text-[10px] rounded-xl flex items-center gap-1.5 cursor-pointer font-bold border border-slate-900 shadow-md hover:scale-105"
                      title="Export candidate ranking report to CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* CONSOLE SUB-TAB TOGGLES */}
                <div className="flex border-b border-slate-900 gap-4 text-xs font-extrabold px-1">
                  <button 
                    onClick={() => setConsoleSubTab('table')}
                    className={`pb-3 px-2 flex items-center gap-1.5 transition-colors border-b-2 ${
                      consoleSubTab === 'table' ? 'text-white border-cyan-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Users className="w-4 h-4" /> Applicant Pipeline Table
                  </button>
                  <button 
                    onClick={() => setConsoleSubTab('board')}
                    className={`pb-3 px-2 flex items-center gap-1.5 transition-colors border-b-2 ${
                      consoleSubTab === 'board' ? 'text-white border-cyan-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Layers className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} /> Interactive Kanban Board
                  </button>
                  <button 
                    onClick={() => setConsoleSubTab('analytics')}
                    className={`pb-3 px-2 flex items-center gap-1.5 transition-colors border-b-2 ${
                      consoleSubTab === 'analytics' ? 'text-white border-cyan-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" /> Pipeline Diagnostics
                  </button>
                </div>

                {/* TAB 1: RANKINGS TABLE */}
                {consoleSubTab === 'table' && (
                  <div className="screener-card p-2 shadow-xl overflow-hidden animate-float bg-[#070a13]/85 border-slate-900">
                    <div className="px-5 py-4 border-b border-slate-900 flex items-center justify-between">
                      <h3 className="font-extrabold text-white text-xs uppercase tracking-wider font-mono">Applicant Funnel ({filteredAndSortedMatches.length})</h3>
                      <div className="flex items-center gap-2">
                        {compareIds.length > 0 && (
                          <button
                            onClick={() => setShowCompareModal(true)}
                            className="clay-btn clay-btn-cyan px-3 py-1.5 text-[10px] rounded-lg flex items-center gap-1 font-bold animate-pulse"
                          >
                            <GitCompare className="w-3.5 h-3.5" /> Compare Candidates ({compareIds.length})
                          </button>
                        )}
                        <span className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-widest font-mono">Active Workspace</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-slate-900 text-[10px] font-bold text-slate-500 uppercase bg-[#090d16]/30">
                            <th className="py-4 px-4 w-10 text-center">Select</th>
                            <th className="py-4 px-5">Candidate</th>
                            <th className="py-4 px-5">Match Score</th>
                            <th className="py-4 px-5">Hiring Stage Pipeline</th>
                            <th className="py-4 px-5">Grade</th>
                            <th className="py-4 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-xs">
                          {filteredAndSortedMatches.map(m => {
                            const isSelected = selectedMatch && selectedMatch.id === m.id;
                            const isChecked = compareIds.includes(m.resume_id);
                            const initial = (m.resume.name || m.resume.filename || 'C')[0].toUpperCase();
                            
                            return (
                              <tr 
                                key={m.id}
                                onClick={() => setSelectedMatch(m)}
                                className={`hover:bg-slate-900/40 cursor-pointer transition-all duration-200 ${
                                  isSelected ? 'bg-indigo-950/20' : ''
                                }`}
                              >
                                <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    className="cursor-pointer rounded border-slate-800 bg-slate-950 accent-cyan-400 w-4 h-4"
                                    checked={isChecked}
                                    onChange={(e) => toggleCompareCandidate(m.resume_id, e)}
                                  />
                                </td>
                                <td className="py-4 px-5 font-semibold text-slate-100">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-xs border border-slate-800 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.05)]">
                                      {initial}
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-white leading-normal">{m.resume.name || 'Unnamed Candidate'}</p>
                                      <p className="text-[10px] text-slate-500 font-bold truncate max-w-40 md:max-w-xs">{m.resume.filename}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-md border ${getScoreColorClass(m.score)} cyber-badge`}>
                                      {m.score.toFixed(1)}
                                    </span>
                                    <div className="w-16 bg-slate-955 rounded-full h-1.5 overflow-hidden hidden md:block border border-slate-900">
                                      <div 
                                        className={`h-full rounded-full ${getProgressBarColor(m.score)}`} 
                                        style={{ width: `${m.score * 10}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                                  <select
                                    className="bg-slate-955 border border-slate-900 text-slate-300 text-[11px] font-extrabold rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer hover:border-slate-750"
                                    value={m.stage || "Screening"}
                                    onChange={(e) => handleUpdateStage(m.id, e.target.value)}
                                  >
                                    {PIPELINE_STAGES.map(stage => (
                                      <option key={stage} value={stage}>{stage}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-4 px-5">
                                  {getRecommendationBadge(m.recommendation)}
                                </td>
                                <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setSelectedMatch(m)}
                                      className="clay-btn clay-btn-dark p-2 text-xs rounded-xl inline-flex items-center shadow-sm hover:border-slate-700 hover:scale-105"
                                      title="Inspect Candidate details"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                    </button>
                                    <button
                                      onClick={(e) => handleDeleteCandidate(m.resume_id, e)}
                                      className="clay-btn clay-btn-dark p-2 text-xs rounded-xl inline-flex items-center shadow-sm hover:border-rose-900/60 hover:scale-105"
                                      title="Delete Candidate profile"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {filteredAndSortedMatches.length === 0 && (
                            <tr>
                              <td colSpan="6" className="py-12 text-center text-slate-500 font-semibold">
                                {matches.length === 0 
                                  ? 'No candidates evaluated. Drop resumes into uploader above.'
                                  : 'No matches found.'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 2: KANBAN BOARD VIEW */}
                {consoleSubTab === 'board' && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start animate-float">
                    {PIPELINE_STAGES.map(stage => {
                      const stageMatches = filteredAndSortedMatches.filter(m => (m.stage || 'Screening') === stage);
                      return (
                        <div key={stage} className="screener-card p-3 min-h-[500px] flex flex-col bg-[#070a13]/85 border border-slate-900 shadow-xl">
                          {/* Column Header */}
                          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{stage}</span>
                            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[9px] font-extrabold rounded-md text-cyan-400">{stageMatches.length}</span>
                          </div>

                          {/* Cards List */}
                          <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                            {stageMatches.map(m => {
                              const initial = (m.resume.name || m.resume.filename || 'C')[0].toUpperCase();
                              return (
                                <div 
                                  key={m.id} 
                                  onClick={() => setSelectedMatch(m)}
                                  className="screener-card-sunken hover:border-cyan-500/20 hover:scale-[1.02] p-3.5 space-y-3 cursor-pointer group transition-all duration-200"
                                >
                                  {/* Card Name & Rating */}
                                  <div className="flex items-start justify-between gap-1.5">
                                    <div className="flex items-center gap-2 max-w-[70%]">
                                      <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-[10px] border border-slate-800 shrink-0">
                                        {initial}
                                      </div>
                                      <p className="font-extrabold text-white text-[11px] leading-tight truncate">{m.resume.name || 'Unnamed'}</p>
                                    </div>
                                    <span className={`px-1.5 py-0.2 text-[10px] font-extrabold rounded border shrink-0 ${getScoreColorClass(m.score)}`}>
                                      {m.score.toFixed(1)}
                                    </span>
                                  </div>

                                  {/* Skills tags preview */}
                                  <div className="flex flex-wrap gap-1">
                                    {(m.resume.skills || []).slice(0, 3).map((s, idx) => (
                                      <span key={idx} className="px-1.5 py-0.2 bg-slate-950/60 border border-slate-900 text-slate-500 font-extrabold text-[8px] rounded uppercase tracking-wider">{s}</span>
                                    ))}
                                  </div>

                                  {/* Interactive pipeline movement triggers */}
                                  <div className="flex items-center justify-between border-t border-slate-900/60 pt-2" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center gap-1">
                                      {/* Move Left */}
                                      <button
                                        disabled={stage === PIPELINE_STAGES[0]}
                                        onClick={() => {
                                          const idx = PIPELINE_STAGES.indexOf(stage);
                                          handleUpdateStage(m.id, PIPELINE_STAGES[idx - 1]);
                                        }}
                                        className="p-1 rounded bg-slate-900 text-slate-500 hover:text-white border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-850"
                                        title="Move to previous pipeline stage"
                                      >
                                        <ChevronRight className="w-3.5 h-3.5 transform rotate-180" />
                                      </button>
                                      
                                      {/* Move Right */}
                                      <button
                                        disabled={stage === PIPELINE_STAGES[PIPELINE_STAGES.length - 1]}
                                        onClick={() => {
                                          const idx = PIPELINE_STAGES.indexOf(stage);
                                          handleUpdateStage(m.id, PIPELINE_STAGES[idx + 1]);
                                        }}
                                        className="p-1 rounded bg-slate-900 text-slate-500 hover:text-white border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-850"
                                        title="Move to next pipeline stage"
                                      >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => setSelectedMatch(m)}
                                      className="text-[9px] font-extrabold text-cyan-400 hover:underline flex items-center gap-0.5"
                                    >
                                      Audit <Eye className="w-3.5 h-3.5 animate-pulse" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                            {stageMatches.length === 0 && (
                              <div className="text-center py-12 text-slate-650 text-[10px] italic font-semibold border border-dashed border-slate-900 rounded-2xl">
                                Empty Stage
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 3: VISUAL DIAGNOSTICS */}
                {consoleSubTab === 'analytics' && (
                  <div className="screener-card p-6 shadow-xl space-y-6 animate-float bg-[#070a13]/85 border-slate-900">
                    <h3 className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-slate-900 pb-3 font-mono">
                      Recruitment Funnel & Calibration Diagnostics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Metric 1: Verdict Distribution Ratio */}
                      <div className="screener-card-sunken p-5 space-y-4">
                        <h4 className="text-[10px] font-extrabold text-slate-455 uppercase tracking-widest font-mono">
                          Hiring Pipeline Funnel Stages
                        </h4>
                        
                        {metrics.total > 0 ? (
                          <div className="space-y-4">
                            <div className="flex h-6 rounded-xl overflow-hidden border border-slate-900 shadow-inner">
                              <div 
                                className="bg-slate-550 transition-all duration-500" 
                                style={{ width: `${(metrics.screening / metrics.total) * 100}%` }}
                                title={`Screening: ${metrics.screening}`}
                              />
                              <div 
                                className="bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_#06b6d4]" 
                                style={{ width: `${(metrics.interviewing / metrics.total) * 100}%` }}
                                title={`Interviewing: ${metrics.interviewing}`}
                              />
                              <div 
                                className="bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_#10b981]" 
                                style={{ width: `${(metrics.hired / metrics.total) * 100}%` }}
                                title={`Hired: ${metrics.hired}`}
                              />
                              <div 
                                className="bg-rose-500 transition-all duration-500 shadow-[0_0_10px_#f43f5e]" 
                                style={{ width: `${(metrics.rejected / metrics.total) * 100}%` }}
                                title={`Rejected: ${metrics.rejected}`}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2.5 text-[10px] font-bold">
                              <div>
                                <span className="inline-block w-2.5 h-2.5 rounded bg-slate-500 mr-1.5 animate-pulse" />
                                <span className="text-slate-400">Screening ({Math.round((metrics.screening / metrics.total) * 100)}%)</span>
                              </div>
                              <div>
                                <span className="inline-block w-2.5 h-2.5 rounded bg-cyan-400 mr-1.5 animate-pulse" />
                                <span className="text-slate-400">Interviewing ({Math.round((metrics.interviewing / metrics.total) * 100)}%)</span>
                              </div>
                              <div>
                                <span className="inline-block w-2.5 h-2.5 rounded bg-emerald-500 mr-1.5 animate-pulse" />
                                <span className="text-slate-400">Hired ({Math.round((metrics.hired / metrics.total) * 100)}%)</span>
                              </div>
                              <div>
                                <span className="inline-block w-2.5 h-2.5 rounded bg-rose-500 mr-1.5 animate-pulse" />
                                <span className="text-slate-400">Rejected ({Math.round((metrics.rejected / metrics.total) * 100)}%)</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic py-6 text-center">No metrics to display.</p>
                        )}
                      </div>

                      {/* Metric 2: Average Fit score dial */}
                      <div className="screener-card-sunken p-5 flex flex-col items-center justify-center text-center">
                        <h4 className="text-[10px] font-extrabold text-slate-455 uppercase tracking-widest mb-3 self-start">
                          Average Candidate Alignment Rating
                        </h4>
                        
                        {metrics.total > 0 ? (
                          <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle 
                                cx="72" cy="72" r="54" 
                                className="stroke-slate-900 fill-transparent" 
                                strokeWidth="8"
                              />
                              <circle 
                                cx="72" cy="72" r="54" 
                                className="stroke-cyan-400 fill-transparent transition-all duration-1000" 
                                strokeWidth="8"
                                strokeDasharray={339}
                                strokeDashoffset={339 - (339 * (metrics.avgScore / 10))}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center font-mono">
                              <span className="text-3xl font-black text-white glow-text-cyan">{metrics.avgScore}</span>
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">out of 10</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic py-6">No alignment ratings.</p>
                        )}
                      </div>

                    </div>

                    {/* Skill tag inventory frequency */}
                    <div className="screener-card-sunken p-5">
                      <h4 className="text-[10px] font-extrabold text-slate-455 uppercase tracking-widest mb-4">
                        Talent Pool Skills Inventory Frequency
                      </h4>
                      
                      <div className="flex flex-wrap gap-2">
                        {resumes.length > 0 ? (
                          Object.entries(
                            resumes.reduce((acc, curr) => {
                              (curr.skills || []).forEach(s => {
                                acc[s] = (acc[s] || 0) + 1;
                              });
                              return acc;
                            }, {})
                          )
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 20)
                          .map(([skill, count]) => (
                            <span 
                              key={skill} 
                              className="px-3 py-1 bg-slate-955 border border-slate-900 rounded-xl text-slate-355 font-bold text-[10px] flex items-center gap-1.5"
                            >
                              <span>{skill}</span>
                              <span className="px-1.5 py-0.2 bg-cyan-955 text-cyan-400 font-extrabold text-[8px] rounded border border-cyan-900">{count}</span>
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-slate-550 italic py-4 text-center w-full">Skills database empty.</p>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </main>

            {/* CONSOLE FOOTER */}
            <footer className="mx-6 my-6 screener-card px-6 py-5 border border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl text-xs text-slate-500 bg-[#070a13]/85">
              <div>
                <p className="font-extrabold text-slate-350 tracking-wider">ScreenerAI SQL Database Engine</p>
                <p className="text-[10px] text-slate-655 font-bold uppercase mt-0.5">Prompt Compliance & Verifiable Decision Support System</p>
              </div>
              <div className="flex items-center gap-4 font-bold text-[9px] uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-slate-600" /> SQL database: online</span>
                <span className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-slate-600" /> Model: local-nlp-matcher</span>
              </div>
            </footer>

            {/* CANDIDATE DETAIL SLIDE-OUT PANEL */}
            {selectedMatch && (
              <div className="fixed inset-0 z-50 overflow-hidden flex animate-float" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                
                <div 
                  onClick={() => setSelectedMatch(null)}
                  className="absolute inset-0 bg-slate-955/70 backdrop-blur-sm transition-opacity"
                />

                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <div className="pointer-events-auto w-screen max-w-2xl transform bg-[#070b14]/95 backdrop-blur-2xl shadow-2xl transition-all duration-300 flex flex-col border-l border-slate-900">
                    
                    {/* Drawer Header */}
                    <div className="px-6 py-5 bg-gradient-to-r from-slate-955 via-[#0a0f1d] to-[#0c0e18] text-white flex items-center justify-between shadow-md border-b border-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-base border border-slate-800">
                          {initialLetter}
                        </div>
                        <div>
                          <h2 className="font-extrabold text-base text-white leading-normal">{selectedMatch.resume.name || 'Unnamed Candidate'}</h2>
                          <p className="text-[10px] text-slate-500 font-bold truncate max-w-sm">{selectedMatch.resume.filename}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getRecommendationBadge(selectedMatch.recommendation)}
                        <button 
                          onClick={() => setSelectedMatch(null)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-855 text-slate-400 hover:text-white transition-all active:scale-95 border border-slate-805"
                        >
                          <X className="w-4.5 h-4.5 text-slate-400" />
                        </button>
                      </div>
                    </div>

                    {/* DRAWER SUITE TABS */}
                    <div className="flex border-b border-slate-900 bg-slate-955/30 px-6 pt-3 text-xs font-bold gap-4">
                      <button 
                        onClick={() => setActiveDetailTab('overview')}
                        className={`pb-2.5 border-b-2 transition-all ${
                          activeDetailTab === 'overview' ? 'text-cyan-400 border-cyan-400' : 'text-slate-555'
                        }`}
                      >
                        Overview
                      </button>
                      <button 
                        onClick={() => setActiveDetailTab('skills')}
                        className={`pb-2.5 border-b-2 transition-all ${
                          activeDetailTab === 'skills' ? 'text-cyan-400 border-cyan-400' : 'text-slate-555'
                        }`}
                      >
                        Skills Gap Map
                      </button>
                      <button 
                        onClick={() => setActiveDetailTab('experience')}
                        className={`pb-2.5 border-b-2 transition-all ${
                          activeDetailTab === 'experience' ? 'text-cyan-400 border-cyan-400' : 'text-slate-555'
                        }`}
                      >
                        Work History
                      </button>
                      <button 
                        onClick={() => setActiveDetailTab('education')}
                        className={`pb-2.5 border-b-2 transition-all ${
                          activeDetailTab === 'education' ? 'text-cyan-400 border-cyan-400' : 'text-slate-555'
                        }`}
                      >
                        Education
                      </button>
                      <button 
                        onClick={() => setActiveDetailTab('resume')}
                        className={`pb-2.5 border-b-2 transition-all ${
                          activeDetailTab === 'resume' ? 'text-cyan-400 border-cyan-400' : 'text-slate-555'
                        }`}
                      >
                        Resume Viewer
                      </button>
                    </div>

                    {/* Drawer Body */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                      
                      {/* TAB 1: OVERVIEW */}
                      {activeDetailTab === 'overview' && (
                        <div className="space-y-6 animate-float">
                          
                          {/* Hiring Pipeline State Selector */}
                          <div className="screener-card p-4 bg-slate-950/40 border border-slate-905 rounded-2xl flex items-center justify-between">
                            <div>
                              <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" /> Pipeline Progression
                              </h4>
                              <p className="text-[9px] text-slate-505 font-bold uppercase mt-0.5">Select Candidate Stage</p>
                            </div>
                            <select
                              className="bg-slate-950 border border-slate-800 text-slate-350 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer"
                              value={selectedMatch.stage || "Screening"}
                              onChange={(e) => handleUpdateStage(selectedMatch.id, e.target.value)}
                            >
                              {PIPELINE_STAGES.map(stage => (
                                <option key={stage} value={stage}>{stage}</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="screener-card-sunken rounded-2xl p-4 space-y-3">
                              <h4 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-cyan-400" /> Contact Specifications
                              </h4>
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                                <span className="truncate">{selectedMatch.resume.email || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                                <span>{selectedMatch.resume.phone || 'N/A'}</span>
                              </div>
                            </div>

                            <div className="screener-card-sunken rounded-2xl p-4 flex flex-col justify-between">
                              <div>
                                <h4 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Verification Score
                                </h4>
                                <p className="text-[9px] text-slate-505 font-extrabold uppercase">Calibrated Weighted Fit</p>
                              </div>
                              <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-3xl font-extrabold text-white glow-text-cyan">{selectedMatch.score.toFixed(1)}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase">/ 10 points</span>
                              </div>
                            </div>
                          </div>

                          {/* Recruiter Notes Area */}
                          <div className="screener-card p-5 space-y-3">
                            <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-between border-b border-slate-900 pb-2">
                              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-cyan-400 font-mono" /> Recruiter Internal Notes</span>
                              <span className="text-[8px] text-slate-505 font-mono">Persisted in SQL</span>
                            </h4>
                            <textarea
                              rows="3"
                              className="w-full bg-slate-955 border border-slate-900 rounded-xl p-3 text-xs font-medium text-slate-300 focus:outline-none focus:border-slate-800"
                              placeholder="Write interview notes, feedback remarks, or details here..."
                              value={draftNotes}
                              onChange={(e) => setDraftNotes(e.target.value)}
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={handleSaveNotes}
                                disabled={isSavingNotes}
                                className="clay-btn clay-btn-cyan px-4 py-2 text-[10px] rounded-lg font-bold"
                              >
                                {isSavingNotes ? "Saving..." : "Save Note"}
                              </button>
                            </div>
                          </div>

                          {/* AI justification text */}
                          <div className="screener-card-sunken bg-indigo-955/10 border border-slate-900 rounded-2xl p-5 space-y-2">
                            <h4 className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                              <Sparkles className="w-4 h-4" /> local alignment justification
                            </h4>
                            <p className="text-xs text-slate-355 font-medium leading-relaxed">
                              {selectedMatch.justification}
                            </p>
                          </div>

                          {/* Strengths & Gaps */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-emerald-955/20 border border-emerald-500/20 rounded-2xl p-4 space-y-3">
                              <h4 className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 animate-pulse" /> Verified Strengths
                              </h4>
                              <ul className="space-y-2 text-xs font-bold text-slate-350 pl-1 list-disc list-inside">
                                {(selectedMatch.strengths || []).map((str, idx) => (
                                  <li key={idx} className="leading-snug">{str}</li>
                                ))}
                                {(selectedMatch.strengths || []).length === 0 && (
                                  <span className="text-slate-550 italic font-semibold">No strengths found.</span>
                                )}
                              </ul>
                            </div>

                            <div className="bg-rose-955/20 border border-rose-500/20 rounded-2xl p-4 space-y-3">
                              <h4 className="text-[9px] font-extrabold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 animate-pulse" /> Audited Gaps
                              </h4>
                              <ul className="space-y-2 text-xs font-bold text-slate-355 pl-1 list-disc list-inside">
                                {(selectedMatch.gaps || []).map((gap, idx) => (
                                  <li key={idx} className="leading-snug">{gap}</li>
                                ))}
                                {(selectedMatch.gaps || []).length === 0 && (
                                  <span className="text-slate-500 italic font-semibold">No gaps found.</span>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: SKILLS GAP MAP */}
                      {activeDetailTab === 'skills' && (
                        <div className="space-y-6 animate-float">
                          <div className="screener-card p-5 space-y-4">
                            <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2">
                              Dimension Score Breakdown
                            </h4>
                            
                            <div className="space-y-4">
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-400">Technical Skills ({weights.skills}% weight)</span>
                                  <span className="text-cyan-400 font-extrabold">{selectedMatch.skill_score.toFixed(1)} / 10</span>
                                </div>
                                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-900">
                                  <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" style={{ width: `${selectedMatch.skill_score * 10}%` }} />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-400">Work History ({weights.experience}% weight)</span>
                                  <span className="text-cyan-400 font-extrabold">{selectedMatch.experience_score.toFixed(1)} / 10</span>
                                </div>
                                <div className="w-full bg-slate-955 h-2.5 rounded-full overflow-hidden border border-slate-900">
                                  <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" style={{ width: `${selectedMatch.experience_score * 10}%` }} />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-400">Education ({weights.education}% weight)</span>
                                  <span className="text-cyan-400 font-extrabold">{selectedMatch.education_score.toFixed(1)} / 10</span>
                                </div>
                                <div className="w-full bg-slate-955 h-2.5 rounded-full overflow-hidden border border-slate-900">
                                  <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" style={{ width: `${selectedMatch.education_score * 10}%` }} />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-400">Role & Tech Fit ({weights.roleFit}% weight)</span>
                                  <span className="text-cyan-400 font-extrabold">{selectedMatch.role_fit_score.toFixed(1)} / 10</span>
                                </div>
                                <div className="w-full bg-slate-955 h-2.5 rounded-full overflow-hidden border border-slate-900">
                                  <div className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" style={{ width: `${selectedMatch.role_fit_score * 10}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Visual Skills Gap Map */}
                          <div className="space-y-3">
                            <h4 className="text-[9px] font-extrabold text-slate-505 uppercase tracking-widest border-b border-slate-900 pb-2">
                              Role Technical Skills Map Audit
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                              {skillsGapMap.map((skill, idx) => (
                                <div 
                                  key={idx}
                                  className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-between hover:scale-105 transition-transform duration-200 ${
                                    skill.hasSkill 
                                      ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' 
                                      : 'bg-slate-955/40 border-slate-900 text-slate-500'
                                  }`}
                                >
                                  <span>{skill.name}</span>
                                  <span>{skill.hasSkill ? "● Match" : "○ Lacking"}</span>
                                </div>
                              ))}
                              {skillsGapMap.length === 0 && (
                                <span className="text-slate-555 italic text-xs col-span-3">No specific matching tags evaluated.</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2.5 pt-2">
                            <h4 className="text-[9px] font-extrabold text-slate-505 uppercase tracking-widest border-b border-slate-900 pb-2">
                              Full Extracted Candidate Skills Inventory
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {(selectedMatch.resume.skills || []).map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-slate-955 border border-slate-800 rounded-xl text-slate-355 font-extrabold text-[9px] uppercase tracking-wider shadow-sm cyber-badge">
                                  {skill}
                                </span>
                              ))}
                              {(selectedMatch.resume.skills || []).length === 0 && (
                                <span className="text-slate-500 text-xs italic font-semibold">No skills identified.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: WORK HISTORY */}
                      {activeDetailTab === 'experience' && (
                        <div className="space-y-4 animate-float">
                          <h4 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5 font-mono">
                            <Briefcase className="w-4 h-4 text-cyan-400" /> Work History Audit Timeline
                          </h4>
                          
                          <div className="space-y-4 pl-3.5 border-l-2 border-slate-900 animate-float">
                            {(selectedMatch.resume.experience || []).map((exp, idx) => (
                              <div key={idx} className="relative space-y-1">
                                <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-[#070b14] shadow-sm shadow-cyan-400 animate-pulse" />
                                <h5 className="font-extrabold text-white text-xs">
                                  {exp.role || 'Position'} at <span className="text-cyan-400">{exp.company || 'Company'}</span>
                                </h5>
                                <p className="text-[10px] text-slate-555 font-extrabold">{exp.duration}</p>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">{exp.description}</p>
                              </div>
                            ))}
                            {(selectedMatch.resume.experience || []).length === 0 && (
                              <span className="text-slate-555 text-xs italic font-semibold pl-0">No documented experience found.</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 4: EDUCATION */}
                      {activeDetailTab === 'education' && (
                        <div className="space-y-4 animate-float">
                          <h4 className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5 font-mono">
                            <GraduationCap className="w-4 h-4 text-cyan-400" /> Academic & Certification Audit
                          </h4>
                          
                          <div className="space-y-3.5 pl-3.5 border-l-2 border-slate-900 animate-float">
                            {(selectedMatch.resume.education || []).map((edu, idx) => (
                              <div key={idx} className="relative space-y-1">
                                <div className="absolute -left-[21.5px] top-1.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-[#070b14] shadow-sm shadow-cyan-400 animate-pulse" />
                                <h5 className="font-extrabold text-white text-xs">{edu.degree || 'Degree'}</h5>
                                <p className="text-xs text-cyan-400 font-bold">{edu.institution}</p>
                                <p className="text-[9px] text-slate-500 font-extrabold">Graduation: {edu.graduation_year || 'N/A'}</p>
                              </div>
                            ))}
                            {(selectedMatch.resume.education || []).length === 0 && (
                              <span className="text-slate-505 text-xs italic font-semibold pl-0">No educational specs found.</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 5: RESUME RAW VIEW & SEARCH HIGHLIGHTER */}
                      {activeDetailTab === 'resume' && (
                        <div className="space-y-4 animate-float">
                          <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                              <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3.5" />
                              <input
                                type="text"
                                placeholder="Highlight keywords in CV raw text..."
                                className="w-full pl-9 pr-4 py-2.5 cyber-input text-xs font-bold focus:outline-none"
                                value={resumeSearchTerm}
                                onChange={(e) => setResumeSearchTerm(e.target.value)}
                              />
                            </div>
                            {resumeSearchTerm && (
                              <button 
                                onClick={() => setResumeSearchTerm('')}
                                className="clay-btn clay-btn-dark px-3 py-2.5 text-xs text-slate-400"
                              >
                                Clear
                              </button>
                            )}
                          </div>

                          <div className="screener-card-sunken border border-slate-900 rounded-2xl p-5 overflow-auto max-h-[50vh] font-mono text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap bg-[#05080f]/90">
                            <div dangerouslySetInnerHTML={{ __html: highlightedResumeText }} />
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* CANDIDATE SIDE-BY-SIDE COMPARE MODAL */}
            {showCompareModal && (
              <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                <div onClick={() => setShowCompareModal(false)} className="fixed inset-0 bg-slate-955/80 backdrop-blur-sm" />
                
                <div className="screener-card max-w-5xl w-full p-6 shadow-2xl relative z-10 border border-slate-800 bg-[#090d17]/95 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-6">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <GitCompare className="w-5 h-5 text-cyan-400" /> Side-by-Side Candidate Comparison
                    </h3>
                    <button 
                      onClick={() => setShowCompareModal(false)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {comparedCandidates.map(c => {
                      const initial = (c.resume.name || c.resume.filename || 'C')[0].toUpperCase();
                      return (
                        <div key={c.id} className="screener-card-sunken p-5 flex flex-col justify-between space-y-4">
                          
                          {/* Name info */}
                          <div className="text-center space-y-2 animate-float">
                            <div className="w-12 h-12 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-lg border border-slate-800 shadow-md mx-auto">
                              {initial}
                            </div>
                            <div>
                              <h4 className="font-black text-white text-sm">{c.resume.name || 'Unnamed'}</h4>
                              <p className="text-[10px] text-slate-550 font-bold truncate">{c.resume.filename}</p>
                            </div>
                            <div className="flex flex-col gap-1.5 items-center pt-2">
                              {getRecommendationBadge(c.recommendation)}
                              <span className="px-2 py-0.5 bg-slate-905 border border-slate-800 text-[10px] font-extrabold rounded-lg text-slate-400">{c.stage || 'Screening'}</span>
                            </div>
                          </div>

                          {/* Scores details */}
                          <div className="space-y-3 border-y border-slate-900 py-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-400 font-bold">Overall Fit</span>
                              <span className={`px-2 py-0.5 rounded font-black text-xs border ${getScoreColorClass(c.score)}`}>
                                {c.score.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-slate-555">Skills Alignment</span>
                              <span className="text-cyan-400">{c.skill_score.toFixed(1)} / 10</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-slate-555">Work Experience</span>
                              <span className="text-cyan-400">{c.experience_score.toFixed(1)} / 10</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-slate-555">Education Details</span>
                              <span className="text-cyan-400">{c.education_score.toFixed(1)} / 10</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-slate-555">Role & Stack Fit</span>
                              <span className="text-cyan-400">{c.role_fit_score.toFixed(1)} / 10</span>
                            </div>
                          </div>

                          {/* Notes Preview */}
                          {c.notes && (
                            <div className="p-3 bg-slate-955/60 border border-slate-900 rounded-xl text-[10px] font-semibold text-slate-400 leading-snug">
                              <p className="font-extrabold uppercase text-slate-550 text-[8px] tracking-wider mb-1">Recruiter Remark:</p>
                              <span className="italic">"{c.notes.slice(0, 100)}{c.notes.length > 100 ? "..." : ""}"</span>
                            </div>
                          )}

                          {/* Strengths / Gaps */}
                          <div className="space-y-3 text-xs leading-relaxed flex-1">
                            <div>
                              <p className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-450 mb-1">Strengths</p>
                              <ul className="list-disc pl-3 text-slate-300 font-semibold space-y-1">
                                {(c.strengths || []).slice(0, 2).map((str, idx) => (
                                  <li key={idx}>{str}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="pt-2">
                              <p className="text-[9px] font-extrabold uppercase tracking-widest text-rose-455 mb-1">Gaps</p>
                              <ul className="list-disc pl-3 text-slate-350 font-semibold space-y-1">
                                {(c.gaps || []).slice(0, 2).map((gap, idx) => (
                                  <li key={idx}>{gap}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 border-t border-slate-900 flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedMatch(c);
                                setShowCompareModal(false);
                              }}
                              className="w-full clay-btn clay-btn-cyan text-xs py-2 rounded-xl flex items-center justify-center gap-1 hover:scale-105"
                            >
                              <Eye className="w-3.5 h-3.5" /> Full Audit
                            </button>
                            <button
                              onClick={() => setCompareIds(prev => prev.filter(id => id !== c.resume_id))}
                              className="clay-btn clay-btn-dark px-3 py-2 rounded-xl text-rose-500 border border-slate-800"
                              title="Remove candidate from comparison list"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      );
                    })}

                    {comparedCandidates.length === 0 && (
                      <div className="col-span-3 text-center py-12 text-slate-500 text-xs italic">
                        No candidates selected. Please check candidates in the table.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
