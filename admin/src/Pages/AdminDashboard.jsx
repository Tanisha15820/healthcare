import { useState, useEffect, useRef } from "react";
import AdminLayout from "../Components/AdminLayout";
import SEO from "../Components/SEO";

// Storage utilities
import {
  getAllBanners,
  addBannerSlide,
  updateBannerSlide,
  deleteBannerSlide,
  resetBanners,
} from "../utils/bannerStorage";

import {
  getMachineProducts,
  addMachineProduct,
  updateMachineProduct,
  deleteMachineProduct,
  resetMachineProducts,
  THEME_PRESETS,
} from "../utils/machineStorage";

import {
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  resetTestimonials,
  TESTIMONIAL_BG_OPTIONS,
} from "../utils/testimonialStorage";

import {
  getAllFaqs,
  addFaq,
  updateFaq,
  deleteFaq,
  resetFaqs,
  FAQ_ICON_OPTIONS,
} from "../utils/faqStorage";

import {
  getAllClients,
  addClient,
  updateClient,
  deleteClient,
  resetClients,
  CLIENT_ACCENT_OPTIONS,
} from "../utils/clientStorage";

import {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  resetBlogs,
  BLOG_IMAGE_PRESETS,
} from "../utils/blogStorage";

// Image assets
import homeBannerDefault from "../assets/images/home.png";
import homeBg1Default from "../assets/images/home_bg1.png";
import bipolarImg from "../assets/images/bipolar_plasma_generator.png";
import diodeImg from "../assets/images/diode_laser.png";
import cyberImg from "../assets/images/cyber_blade.png";
import bladderImg from "../assets/images/bladder_scanner.png";
import ursImg from "../assets/images/flexible_video_urs.png";
import endoImg from "../assets/images/endo_vision_set.png";
import maxLogo from "../assets/images/max.png";
import fortisLogo from "../assets/images/fortis.png";
import siemensLogo from "../assets/images/siemens.png";

// Material Icons
import ViewCarouselOutlinedIcon from "@mui/icons-material/ViewCarouselOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PersonIcon from "@mui/icons-material/Person";
import BuildIcon from "@mui/icons-material/Build";
import DescriptionIcon from "@mui/icons-material/Description";
import PublicIcon from "@mui/icons-material/Public";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CloseIcon from "@mui/icons-material/Close";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

const PRESET_PRODUCTS = [
  {
    key: "bipolar_plasma_generator",
    name: "Bipolar Plasma Generator",
    img: bipolarImg,
  },
  { key: "diode_laser", name: "Diode Laser", img: diodeImg },
  { key: "cyber_blade", name: "CyberBlade", img: cyberImg },
  { key: "bladder_scanner", name: "Bladder Scanner", img: bladderImg },
  { key: "flexible_video_urs", name: "Flexible Video URS", img: ursImg },
  { key: "endo_vision_set", name: "Endo Vision Set", img: endoImg },
];

const PRESET_AVATARS = [
  { label: "Doctor 1", url: "https://i.pravatar.cc/100?img=47" },
  { label: "Doctor 2", url: "https://i.pravatar.cc/100?img=12" },
  { label: "Doctor 3", url: "https://i.pravatar.cc/100?img=32" },
  { label: "Doctor 4", url: "https://i.pravatar.cc/100?img=60" },
  { label: "Doctor 5", url: "https://i.pravatar.cc/100?img=49" },
  { label: "Doctor 6", url: "https://i.pravatar.cc/100?img=68" },
];

const FAQ_ICON_MAP = {
  medical: <MedicalServicesIcon fontSize="small" />,
  verified: <VerifiedUserIcon fontSize="small" />,
  person: <PersonIcon fontSize="small" />,
  build: <BuildIcon fontSize="small" />,
  description: <DescriptionIcon fontSize="small" />,
  public: <PublicIcon fontSize="small" />,
  support: <ContactSupportIcon fontSize="small" />,
  hospital: <LocalHospitalIcon fontSize="small" />,
};

const CLIENT_PRESETS = [
  { key: "max", name: "MAX Hospital", img: maxLogo },
  { key: "fortis", name: "Fortis Healthcare", img: fortisLogo },
  { key: "siemens", name: "Siemens Healthineers", img: siemensLogo },
];

const getClientDisplayLogo = (client) => {
  if (client.logo) return client.logo;
  const found = CLIENT_PRESETS.find((p) => p.key === client.presetKey);
  return found ? found.img : maxLogo;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("banners");

  // ================= DATA STATES =================
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [clients, setClients] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Toast / notification feedback
  const [notification, setNotification] = useState(null);

  // Active edit / modal states for Banners
  const [editingBanner, setEditingBanner] = useState(null);
  const [isNewBannerModalOpen, setIsNewBannerModalOpen] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Active edit / modal states for Machine Products
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Active edit / modal states for Testimonials
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isNewTestimonialModalOpen, setIsNewTestimonialModalOpen] = useState(false);

  // Active edit / modal states for FAQs
  const [editingFaq, setEditingFaq] = useState(null);
  const [isNewFaqModalOpen, setIsNewFaqModalOpen] = useState(false);
  const [previewFaqOpenId, setPreviewFaqOpenId] = useState(null);

  // Active edit / modal states for Clients
  const [editingClient, setEditingClient] = useState(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  // Active edit / modal states for Blogs
  const [editingBlog, setEditingBlog] = useState(null);
  const [isNewBlogModalOpen, setIsNewBlogModalOpen] = useState(false);

  // File input refs
  const bannerFileRef = useRef(null);
  const productFileRef = useRef(null);
  const testimonialFileRef = useRef(null);
  const clientFileRef = useRef(null);
  const blogFileRef = useRef(null);

  // Load all initial state
  useEffect(() => {
    setBanners(getAllBanners());
    setProducts(getMachineProducts());
    setTestimonials(getAllTestimonials());
    setFaqs(getAllFaqs());
    setClients(getAllClients());
    setBlogs(getAllBlogs());
  }, []);

  // Listen for background updates
  useEffect(() => {
    const handleTestimonialsUpdate = () => {
      setTestimonials(getAllTestimonials());
    };
    window.addEventListener("rhs_testimonials_updated", handleTestimonialsUpdate);
    window.addEventListener("storage", handleTestimonialsUpdate);
    return () => {
      window.removeEventListener("rhs_testimonials_updated", handleTestimonialsUpdate);
      window.removeEventListener("storage", handleTestimonialsUpdate);
    };
  }, []);

  useEffect(() => {
    const handleFaqsUpdate = () => {
      setFaqs(getAllFaqs());
    };
    window.addEventListener("rhs_faqs_updated", handleFaqsUpdate);
    window.addEventListener("storage", handleFaqsUpdate);
    return () => {
      window.removeEventListener("rhs_faqs_updated", handleFaqsUpdate);
      window.removeEventListener("storage", handleFaqsUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClientsUpdate = () => {
      setClients(getAllClients());
    };
    window.addEventListener("rhs_clients_updated", handleClientsUpdate);
    window.addEventListener("storage", handleClientsUpdate);
    return () => {
      window.removeEventListener("rhs_clients_updated", handleClientsUpdate);
      window.removeEventListener("storage", handleClientsUpdate);
    };
  }, []);

  useEffect(() => {
    const handleBlogsUpdate = () => {
      setBlogs(getAllBlogs());
    };
    window.addEventListener("rhs_blogs_updated", handleBlogsUpdate);
    window.addEventListener("storage", handleBlogsUpdate);
    return () => {
      window.removeEventListener("rhs_blogs_updated", handleBlogsUpdate);
      window.removeEventListener("storage", handleBlogsUpdate);
    };
  }, []);

  const showNotify = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Convert File to Base64
  const readFileAsBase64 = (file, callback) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showNotify("Please select an image file (PNG, JPG, WebP)", "error");
      return;
    }
    if (file.size > 3.5 * 1024 * 1024) {
      showNotify(
        "Image size is over 3.5MB. Please choose a smaller file.",
        "error",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.onerror = () => showNotify("Failed to read image file.", "error");
    reader.readAsDataURL(file);
  };

  // ========================================================
  // 1. BANNER OPERATIONS (ADD, EDIT, DELETE, RESET)
  // ========================================================
  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!editingBanner) return;

    if (editingBanner.id === "new") {
      const updated = addBannerSlide(editingBanner);
      setBanners(updated);
      setIsNewBannerModalOpen(false);
      showNotify("New homepage banner slide added successfully!");
    } else {
      const updated = updateBannerSlide(editingBanner.id, editingBanner);
      setBanners(updated);
      showNotify("Banner slide updated successfully!");
    }
    setEditingBanner(null);
  };

  const handleDeleteBanner = (id) => {
    if (window.confirm("Are you sure you want to delete this banner slide?")) {
      const res = deleteBannerSlide(id);
      if (res.success) {
        setBanners(res.slides);
        if (editingBanner?.id === id) setEditingBanner(null);
        showNotify("Banner slide deleted successfully.");
      } else {
        showNotify(res.message, "error");
      }
    }
  };

  const handleResetBanners = () => {
    if (
      window.confirm("Reset all banner slides to the original factory default?")
    ) {
      const defaults = resetBanners();
      setBanners(defaults);
      setEditingBanner(null);
      showNotify("Banner slides have been reset to original default.");
    }
  };

  const openNewBannerModal = () => {
    setEditingBanner({
      id: "new",
      image: "",
      smallHeading: "Trusted Healthcare Services",
      headingLine1: "Advanced Medical Equipment",
      headingHighlight: "Better Care.",
      singleLine: false,
      description:
        "Reinforce Healthcare Services provides high-grade medical systems and clinic solutions.",
      primaryBtnText: "Book an Appointment",
      primaryBtnLink: "/contact",
      secondaryBtnText: "Explore Products",
      secondaryBtnLink: "/machine",
      isActive: true,
    });
    setIsNewBannerModalOpen(true);
  };

  // ========================================================
  // 2. MACHINE PRODUCTS & CONTENT OPERATIONS
  // ========================================================
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (editingProduct.id === "new") {
      const updated = addMachineProduct(editingProduct);
      setProducts(updated);
      setIsNewProductModalOpen(false);
      showNotify("New medical machine product added to catalog!");
    } else {
      const updated = updateMachineProduct(editingProduct.id, editingProduct);
      setProducts(updated);
      showNotify("Medical machine product updated!");
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (
      window.confirm("Are you sure you want to delete this medical machine?")
    ) {
      const res = deleteMachineProduct(id);
      if (res.success) {
        setProducts(res.products);
        if (editingProduct?.id === id) setEditingProduct(null);
        showNotify("Machine product deleted from catalog.");
      } else {
        showNotify(res.message, "error");
      }
    }
  };

  const handleResetProducts = () => {
    if (window.confirm("Reset medical machines to factory default list?")) {
      const defaults = resetMachineProducts();
      setProducts(defaults);
      setEditingProduct(null);
      showNotify("Machine catalog reset to original defaults.");
    }
  };

  const openNewProductModal = () => {
    setEditingProduct({
      id: "new",
      name: "Precision Surgical Laser",
      category: "Laser Surgery",
      image: "",
      presetImageKey: "diode_laser",
      themeId: "teal",
      description:
        "State-of-the-art medical laser technology for operating theaters and specialized clinics.",
    });
    setIsNewProductModalOpen(true);
  };

  // ========================================================
  // 3. TESTIMONIAL OPERATIONS (ADD, EDIT, DELETE, RESET)
  // ========================================================
  const handleSaveTestimonial = (e) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    if (editingTestimonial.id === "new") {
      const updated = addTestimonial(editingTestimonial);
      setTestimonials(updated);
      setIsNewTestimonialModalOpen(false);
      showNotify("New testimonial card added successfully!");
    } else {
      const updated = updateTestimonial(
        editingTestimonial.id,
        editingTestimonial
      );
      setTestimonials(updated);
      showNotify("Testimonial card updated successfully!");
    }
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      const res = deleteTestimonial(id);
      if (res.success) {
        setTestimonials(res.testimonials);
        if (editingTestimonial?.id === id) setEditingTestimonial(null);
        showNotify("Testimonial deleted successfully.");
      } else {
        showNotify(res.message, "error");
      }
    }
  };

  const handleResetTestimonials = () => {
    if (window.confirm("Reset all testimonials to factory default list?")) {
      const defaults = resetTestimonials();
      setTestimonials(defaults);
      setEditingTestimonial(null);
      showNotify("Testimonials reset to original defaults.");
    }
  };

  const openNewTestimonialModal = () => {
    setEditingTestimonial({
      id: "new",
      name: "Dr. Sarah Mitchell",
      role: "Orthopedic Surgeon, Riverdale Health",
      text: "The quality of these medical devices is outstanding. They're reliable, easy to use, and significantly improve patient outcomes.",
      image: "https://i.pravatar.cc/100?img=47",
      bg: "bg-[#EDE9FE]",
    });
    setIsNewTestimonialModalOpen(true);
  };

  // ========================================================
  // 4. FAQ OPERATIONS (ADD, EDIT, DELETE, RESET)
  // ========================================================
  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!editingFaq) return;

    if (editingFaq.id === "new") {
      const updated = addFaq(editingFaq);
      setFaqs(updated);
      setIsNewFaqModalOpen(false);
      showNotify("New FAQ question added successfully!");
    } else {
      const updated = updateFaq(editingFaq.id, editingFaq);
      setFaqs(updated);
      showNotify("FAQ question updated successfully!");
    }
    setEditingFaq(null);
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ question?")) {
      const res = deleteFaq(id);
      if (res.success) {
        setFaqs(res.faqs);
        if (editingFaq?.id === id) setEditingFaq(null);
        showNotify("FAQ question deleted successfully.");
      } else {
        showNotify(res.message, "error");
      }
    }
  };

  const handleResetFaqs = () => {
    if (window.confirm("Reset all FAQ questions to factory default list?")) {
      const defaults = resetFaqs();
      setFaqs(defaults);
      setEditingFaq(null);
      showNotify("FAQ questions reset to original defaults.");
    }
  };

  const openNewFaqModal = () => {
    setEditingFaq({
      id: "new",
      question: "What types of healthcare products do you offer?",
      answer:
        "We offer a wide range of advanced medical devices and equipment including Bipolar Plasma Generators, Diode Lasers, Endoscopy Systems, Flexible Video URS and more.",
      iconKey: "medical",
    });
    setIsNewFaqModalOpen(true);
  };

  // ========================================================
  // 5. CLIENT OPERATIONS (ADD, EDIT, DELETE, RESET)
  // ========================================================
  const handleSaveClient = (e) => {
    e.preventDefault();
    if (!editingClient) return;

    if (editingClient.id === "new") {
      const updated = addClient(editingClient);
      setClients(updated);
      setIsNewClientModalOpen(false);
      showNotify("New client card added successfully!");
    } else {
      const updated = updateClient(editingClient.id, editingClient);
      setClients(updated);
      showNotify("Client card updated successfully!");
    }
    setEditingClient(null);
  };

  const handleDeleteClient = (id) => {
    if (window.confirm("Are you sure you want to delete this client card?")) {
      const res = deleteClient(id);
      if (res.success) {
        setClients(res.clients);
        if (editingClient?.id === id) setEditingClient(null);
        showNotify("Client card deleted successfully.");
      } else {
        showNotify(res.message, "error");
      }
    }
  };

  const handleResetClients = () => {
    if (window.confirm("Reset all clients to factory default list?")) {
      const defaults = resetClients();
      setClients(defaults);
      setEditingClient(null);
      showNotify("Clients catalog reset to original defaults.");
    }
  };

  const openNewClientModal = () => {
    setEditingClient({
      id: "new",
      name: "MAX Hospital",
      subtitle: "HOSPITALS",
      description: "Advanced medical care with patient-first excellence.",
      accent: "bg-[#F3F7FF]",
      presetKey: "max",
      logo: "",
    });
    setIsNewClientModalOpen(true);
  };

  // ========================================================
  // 6. BLOG OPERATIONS (ADD, EDIT, DELETE, RESET)
  // ========================================================
  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!editingBlog) return;

    if (editingBlog.id === "new") {
      const updated = addBlog(editingBlog);
      setBlogs(updated);
      setIsNewBlogModalOpen(false);
      showNotify("New blog post added successfully!");
    } else {
      const updated = updateBlog(editingBlog.id, editingBlog);
      setBlogs(updated);
      showNotify("Blog post updated successfully!");
    }
    setEditingBlog(null);
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      const res = deleteBlog(id);
      setBlogs(res);
      if (editingBlog?.id === id) setEditingBlog(null);
      showNotify("Blog post deleted successfully.");
    }
  };

  const handleResetBlogs = () => {
    if (window.confirm("Reset all blog posts to factory default list?")) {
      const defaults = resetBlogs();
      setBlogs(defaults);
      setEditingBlog(null);
      showNotify("Blog posts reset to original defaults.");
    }
  };

  const openNewBlogModal = () => {
    setEditingBlog({
      id: "new",
      tag: "Surgical Innovation",
      title: "The Future of Robotic Surgery in Modern Hospitals",
      date: "12 Sep 2026",
      readTime: "5 min read",
      excerpt:
        "How robotic-assisted systems are transforming surgical precision and what it means for hospitals upgrading their OT setups.",
      presetKey: "blog_3",
      image: "",
    });
    setIsNewBlogModalOpen(true);
  };

  // Blog image display helper
  const getBlogDisplayImage = (blogObj) => {
    if (blogObj?.image && typeof blogObj.image === "string" && blogObj.image.trim() !== "") {
      return blogObj.image;
    }
    if (blogObj?.presetKey && BLOG_IMAGE_PRESETS.some((p) => p.id === blogObj.presetKey)) {
      const found = BLOG_IMAGE_PRESETS.find((p) => p.id === blogObj.presetKey);
      return found.src;
    }
    return BLOG_IMAGE_PRESETS[0].src;
  };

  // Visual image helper
  const getProductDisplayImage = (prod) => {
    if (prod.image) return prod.image;
    const found = PRESET_PRODUCTS.find((p) => p.key === prod.presetImageKey);
    return found ? found.img : bipolarImg;
  };

  // Active banner simulation image
  const previewBanner = banners[activeBannerIndex] || banners[0] || {};
  const currentBannerImage =
    previewBanner.image ||
    (activeBannerIndex === 1 ? homeBg1Default : homeBannerDefault);

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      counts={{
        banners: banners.length,
        products: products.length,
        testimonials: testimonials.length,
        faqs: faqs.length,
        clients: clients.length,
        blogs: blogs.length,
      }}
    >
      <SEO
        title="Admin Content Portal | Reinforce Healthcare Services"
        description="Comprehensive dashboard to add, edit, and delete homepage banners, medical machine images, client testimonials, FAQ questions, and client partner logos."
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-md transition-all animate-fade-in border ${
            notification.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold ${
              notification.type === "error"
                ? "bg-rose-100 text-rose-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {notification.type === "error" ? (
              "!"
            ) : (
              <CheckCircleOutlinedIcon style={{ fontSize: 20 }} />
            )}
          </div>
          <div>
            <p className="text-xs font-bold">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 rounded-lg p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <CloseIcon style={{ fontSize: 16 }} />
          </button>
        </div>
      )}

      {/*  HOMEPAGE BANNERS TAB (ADD, EDIT, DELETE) */}
      {activeTab === "banners" && (
        <div className="space-y-8">
          {/* Top Bar with Add and Reset actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ViewCarouselOutlinedIcon className="text-primary" />
                Homepage Hero Banner Slides
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the slides shown on the live homepage hero slider. Add,
                edit, or delete slides anytime.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetBanners}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
              >
                <RestartAltOutlinedIcon style={{ fontSize: 18 }} />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={openNewBannerModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
              >
                <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                <span>Add Banner Slide</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* List of slides (left column) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Current Slides ({banners.length})
                </h3>
                <span className="text-[11px] text-slate-400">
                  Click a slide to preview or edit
                </span>
              </div>

              {banners.map((slide, index) => {
                const isSelected = activeBannerIndex === index;
                const slideImg =
                  slide.image ||
                  (index === 1 ? homeBg1Default : homeBannerDefault);

                return (
                  <div
                    key={slide.id || index}
                    onClick={() => setActiveBannerIndex(index)}
                    className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border p-5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10 ring-2 ring-primary/20"
                        : "border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    {/* Thumbnail & Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
                        <img
                          src={slideImg}
                          alt="Slide preview"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 rounded-md bg-slate-900/70 px-1.5 py-0.2 text-[9px] font-bold text-white backdrop-blur-xs">
                          #{index + 1}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary-dark">
                            {slide.smallHeading || "Badge"}
                          </span>
                          {slide.singleLine && (
                            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600">
                              Compact Line
                            </span>
                          )}
                        </div>
                        <h4 className="mt-1 truncate text-sm font-bold text-slate-900">
                          {slide.headingLine1}{" "}
                          <span className="text-primary font-extrabold">
                            {slide.headingHighlight}
                          </span>
                        </h4>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {slide.description}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBanner({ ...slide });
                        }}
                        className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition shadow-2xs cursor-pointer"
                      >
                        <EditNoteOutlinedIcon style={{ fontSize: 16 }} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={banners.length <= 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBanner(slide.id);
                        }}
                        title={
                          banners.length <= 1
                            ? "At least one slide must remain"
                            : "Delete slide"
                        }
                        className="rounded-xl border border-rose-200 bg-rose-50/50 p-1.5 text-rose-600 hover:bg-rose-600 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <DeleteOutlinedIcon style={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Interactive Preview & Quick Edit (right column) */}
            <div className="lg:col-span-6">
              <div className="sticky top-28 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <VisibilityOutlinedIcon
                      className="text-primary"
                      style={{ fontSize: 20 }}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Live Hero Banner Simulator (Slide #{activeBannerIndex + 1}
                      )
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingBanner({ ...previewBanner })}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    <EditNoteOutlinedIcon style={{ fontSize: 16 }} />
                    <span>Edit Selected Slide</span>
                  </button>
                </div>

                {/* Simulated Homepage Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl min-h-[360px] flex items-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40"
                    style={{ backgroundImage: `url(${currentBannerImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent" />

                  <div className="relative z-10 p-6 sm:p-8 max-w-lg">
                    {/* Small Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-md">
                      <ShieldOutlinedIcon
                        className="text-primary"
                        style={{ fontSize: 15 }}
                      />
                      <span>
                        {previewBanner.smallHeading ||
                          "Trusted Healthcare Services"}
                      </span>
                    </div>

                    {/* Main Title */}
                    <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl text-white">
                      {previewBanner.headingLine1 || "Quality Equipment."}
                      {previewBanner.singleLine ? " " : <br />}
                      <span className="bg-gradient-to-r from-primary to-sky-300 bg-clip-text text-transparent">
                        {previewBanner.headingHighlight || "Better Healthcare."}
                      </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-3">
                      {previewBanner.description ||
                        "Reinforce Healthcare Services delivers quality equipment..."}
                    </p>

                    {/* 4 Feature mini tags */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/10 p-1.5 backdrop-blur-xs">
                        <ShieldOutlinedIcon
                          className="text-primary shrink-0"
                          style={{ fontSize: 13 }}
                        />
                        <span className="truncate">Specialized</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/10 p-1.5 backdrop-blur-xs">
                        <CategoryOutlinedIcon
                          className="text-primary shrink-0"
                          style={{ fontSize: 13 }}
                        />
                        <span className="truncate">Multi Specialties</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/10 p-1.5 backdrop-blur-xs">
                        <LocalHospitalOutlinedIcon
                          className="text-primary shrink-0"
                          style={{ fontSize: 13 }}
                        />
                        <span className="truncate">Quality Products</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/10 p-1.5 backdrop-blur-xs">
                        <LocalHospitalOutlinedIcon
                          className="text-primary shrink-0"
                          style={{ fontSize: 13 }}
                        />
                        <span className="truncate">Expert Support</span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-3.5 py-2 text-xs font-bold text-white shadow-md">
                        {previewBanner.primaryBtnText || "Book an Appointment"}
                        <ArrowForwardIcon style={{ fontSize: 14 }} />
                      </span>
                      <span className="inline-flex items-center rounded-lg border border-white/30 bg-white/10 px-3.5 py-2 text-xs font-bold text-white backdrop-blur-sm">
                        {previewBanner.secondaryBtnText || "Explore Products"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-xs text-slate-500 shadow-2xs">
                  <p className="font-bold text-slate-700">
                    ⚡ Instant Synchronization
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    When you save a banner, changes are stored in browser
                    localStorage and immediately broadcast to the live homepage
                    without reloading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MACHINE PRODUCTS & CONTENT TAB                         */}
      {/* ========================================================= */}
      {activeTab === "machines" && (
        <div className="space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Inventory2OutlinedIcon className="text-primary" />
                Medical Machine Products & Content ({products.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the medical machinery cards and images displayed in the
                Healthcare Products carousel on the Homepage.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetProducts}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
              >
                <RestartAltOutlinedIcon style={{ fontSize: 18 }} />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={openNewProductModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
              >
                <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                <span>Add Medical Machine</span>
              </button>
            </div>
          </div>

          {/* Machine Products Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((prod) => {
              const displayImg = getProductDisplayImage(prod);

              return (
                <div
                  key={prod.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                >
                  {/* Top Category Badge */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary-dark">
                      {prod.category || "Medical Equipment"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...prod })}
                        className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition cursor-pointer"
                        title="Edit Machine"
                      >
                        <EditNoteOutlinedIcon style={{ fontSize: 18 }} />
                      </button>
                      <button
                        type="button"
                        disabled={products.length <= 1}
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="rounded-lg border border-rose-200 bg-rose-50/50 p-1 text-rose-600 hover:bg-rose-600 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="Delete Machine"
                      >
                        <DeleteOutlinedIcon style={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>

                  {/* Machine Image Preview */}
                  <div
                    className={`mt-4 flex h-44 w-full items-center justify-center rounded-2xl ${prod.bg || "bg-sky-50/50"} p-3 relative overflow-hidden`}
                  >
                    <div
                      className={`absolute h-32 w-32 rounded-full ${prod.iconBg || "bg-sky-100"} opacity-60 blur-xs`}
                    />
                    <img
                      src={displayImg}
                      alt={prod.name}
                      className="relative z-10 max-h-36 max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="mt-4">
                    <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {prod.description ||
                        "High-precision medical machinery designed for clinical efficiency."}
                    </p>
                  </div>

                  {/* Footer status */}
                  <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Live in Homepage Carousel</span>
                    <span className="font-semibold text-emerald-600">
                      ● Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. HOMEPAGE TESTIMONIALS TAB                              */}
      {/* ========================================================= */}
      {activeTab === "testimonials" && (
        <div className="space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RateReviewOutlinedIcon className="text-primary" />
                Homepage Testimonials & Reviews ({testimonials.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the doctor & specialist testimonial cards shown in the &quot;Our Trusted Clients&quot; section on the live homepage.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetTestimonials}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
              >
                <RestartAltOutlinedIcon style={{ fontSize: 18 }} />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={openNewTestimonialModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
              >
                <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                <span>Add Testimonial Card</span>
              </button>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, index) => {
              return (
                <div
                  key={item.id || index}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300 ${
                    item.bg || "bg-[#EDE9FE]"
                  }`}
                >
                  {/* Top Bar: Card index & Action buttons */}
                  <div className="flex items-center justify-between pb-3 border-b border-black/5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-extrabold text-white backdrop-blur-xs">
                        #{index + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingTestimonial({ ...item })}
                        className="rounded-lg border border-slate-200 bg-white/95 p-1 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition shadow-2xs cursor-pointer"
                        title="Edit Testimonial"
                      >
                        <EditNoteOutlinedIcon style={{ fontSize: 18 }} />
                      </button>
                      <button
                        type="button"
                        disabled={testimonials.length <= 1}
                        onClick={() => handleDeleteTestimonial(item.id)}
                        className="rounded-lg border border-rose-200 bg-white/95 p-1 text-rose-600 hover:bg-rose-600 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                        title={
                          testimonials.length <= 1
                            ? "At least one card must remain"
                            : "Delete Testimonial"
                        }
                      >
                        <DeleteOutlinedIcon style={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>

                  {/* Quote icon indicator */}
                  <div className="mt-3 flex items-center gap-1 text-primary">
                    <FormatQuoteOutlinedIcon
                      style={{ fontSize: 28 }}
                      className="rotate-180 opacity-70"
                    />
                  </div>

                  {/* Testimonial Quote Text */}
                  <p className="mt-1 min-h-[85px] text-xs leading-relaxed text-slate-700">
                    &ldquo;{item.text}&rdquo;
                  </p>

                  {/* Author / Client Info (Matches TestimonialSection.jsx) */}
                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-3">
                    <img
                      src={item.image || "https://i.pravatar.cc/100?img=47"}
                      alt={item.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-bold text-slate-900">
                        {item.name}
                      </h4>
                      <p className="truncate text-[10px] text-slate-600 font-medium">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Live on Homepage</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      Active
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. HOMEPAGE FAQ TAB                                       */}
      {/* ========================================================= */}
      {activeTab === "faqs" && (
        <div className="space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpOutlineOutlinedIcon className="text-primary" />
                Homepage FAQ Questions & Answers ({faqs.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the questions and answers shown in the interactive FAQ accordion on the live homepage.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetFaqs}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
              >
                <RestartAltOutlinedIcon style={{ fontSize: 18 }} />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={openNewFaqModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
              >
                <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                <span>Add FAQ Question</span>
              </button>
            </div>
          </div>

          {/* FAQ Accordion List (Matches Homepage Aesthetic) */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = previewFaqOpenId === faq.id;
              const topicOption = FAQ_ICON_OPTIONS.find(
                (o) => o.id === faq.iconKey
              );

              return (
                <div
                  key={faq.id || index}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-primary/40 bg-white shadow-md shadow-primary/5 ring-1 ring-primary/20"
                      : "border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  {/* Question Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
                    <div
                      onClick={() =>
                        setPreviewFaqOpenId(isOpen ? null : faq.id)
                      }
                      className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0 cursor-pointer select-none"
                    >
                      {/* Topic Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                          isOpen
                            ? "bg-primary text-white shadow-xs"
                            : "bg-[#EDF7FF] text-primary"
                        }`}
                      >
                        {FAQ_ICON_MAP[faq.iconKey] || (
                          <MedicalServicesIcon fontSize="small" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-extrabold text-white">
                            #{index + 1}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary-dark">
                            {topicOption ? topicOption.label : "Medical FAQ"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {faq.question}
                        </h4>
                      </div>
                    </div>

                    {/* Action controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewFaqOpenId(isOpen ? null : faq.id)
                        }
                        className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                        title={isOpen ? "Collapse answer" : "Expand answer preview"}
                      >
                        <span>{isOpen ? "Hide" : "Preview"}</span>
                        <ExpandMoreIcon
                          style={{ fontSize: 16 }}
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingFaq({ ...faq })}
                        className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition shadow-2xs cursor-pointer"
                        title="Edit Question & Answer"
                      >
                        <EditNoteOutlinedIcon style={{ fontSize: 16 }} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={faqs.length <= 1}
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="rounded-xl border border-rose-200 bg-rose-50/50 p-1.5 text-rose-600 hover:bg-rose-600 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title={
                          faqs.length <= 1
                            ? "At least one FAQ item must remain"
                            : "Delete FAQ"
                        }
                      >
                        <DeleteOutlinedIcon style={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Answer Section */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/60 p-5 sm:pl-18 animate-fade-in">
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Live on Homepage Accordion</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. HOMEPAGE CLIENTS TAB                                   */}
      {/* ========================================================= */}
      {activeTab === "clients" && (
        <div className="space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GroupOutlinedIcon className="text-primary" />
                Homepage Client Cards & Partner Logos ({clients.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the hospital & clinical partner logo cards displayed in the &quot;Trusted by Leading Healthcare Brands&quot; carousel on the Homepage.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetClients}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
              >
                <RestartAltOutlinedIcon style={{ fontSize: 18 }} />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={openNewClientModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
              >
                <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                <span>Add Client Card</span>
              </button>
            </div>
          </div>

          {/* Client Cards Grid (Matches Homepage Styling) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            {clients.map((client, index) => {
              const displayLogo = getClientDisplayLogo(client);

              return (
                <div
                  key={client.id || index}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                >
                  {/* Top Bar with Number & Controls */}
                  <div className="flex items-center justify-between p-4 pb-2">
                    <span className="rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-extrabold text-white">
                      #{index + 1}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary-dark">
                      {client.subtitle || "HOSPITAL"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingClient({ ...client })}
                        className="rounded-lg border border-slate-200 bg-white p-1 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition shadow-2xs cursor-pointer"
                        title="Edit Client Card"
                      >
                        <EditNoteOutlinedIcon style={{ fontSize: 18 }} />
                      </button>
                      <button
                        type="button"
                        disabled={clients.length <= 1}
                        onClick={() => handleDeleteClient(client.id)}
                        className="rounded-lg border border-rose-200 bg-rose-50/50 p-1 text-rose-600 hover:bg-rose-600 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title={
                          clients.length <= 1
                            ? "At least one client card must remain"
                            : "Delete Client Card"
                        }
                      >
                        <DeleteOutlinedIcon style={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>

                  {/* Card Logo Presentation Area (Matches Homepage Accent & Dimensions) */}
                  <div
                    className={`mx-4 my-2 flex h-40 items-center justify-center rounded-2xl border border-slate-100/90 p-4 transition duration-300 ${
                      client.accent || "bg-[#F3F7FF]"
                    }`}
                  >
                    <img
                      src={displayLogo}
                      alt={client.name || "Client"}
                      className="max-h-20 max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Info Footer */}
                  <div className="p-4 pt-2 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {client.name}
                    </h4>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Live on Homepage Carousel</span>
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. BLOGS TAB                                              */}
      {/* ========================================================= */}
      {activeTab === "blogs" && (
        <div className="space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ArticleOutlinedIcon className="text-primary" />
                Blogs & Articles ({blogs.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage the editorial blog cards displayed on the /blogs page of the website.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetBlogs}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
              >
                <RestartAltOutlinedIcon style={{ fontSize: 18 }} />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={openNewBlogModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
              >
                <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                <span>Add Blog Post</span>
              </button>
            </div>
          </div>

          {/* Blog Cards Grid (Matches /blogs Page Styling) */}
          <div className="space-y-6">
            {blogs.map((post, index) => {
              const displayImage = getBlogDisplayImage(post);

              return (
                <div
                  key={post.id || index}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-[40%_60%]">
                    {/* Image side */}
                    <div className="relative h-52 overflow-hidden bg-slate-100 md:h-full">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={post.title || "Blog post"}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary-dark/10 text-slate-300">
                          <ArticleOutlinedIcon style={{ fontSize: 48 }} />
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-xs backdrop-blur-sm">
                        {post.tag || "Article"}
                      </span>
                      <span className="absolute bottom-2 left-3 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-extrabold text-white">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Content side */}
                    <div className="relative flex flex-col justify-center p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-500">{post.date || "—"}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{post.readTime || "—"}</span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-primary to-primary-dark" />
                      <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>Live on Blogs Page</span>
                          <span className="font-semibold text-emerald-600 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingBlog({ ...post })}
                            className="rounded-lg border border-slate-200 bg-white p-1 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition shadow-2xs cursor-pointer"
                            title="Edit Blog Post"
                          >
                            <EditNoteOutlinedIcon style={{ fontSize: 18 }} />
                          </button>
                          <button
                            type="button"
                            disabled={blogs.length <= 1}
                            onClick={() => handleDeleteBlog(post.id)}
                            className="rounded-lg border border-rose-200 bg-rose-50/50 p-1 text-rose-600 hover:bg-rose-600 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            title={
                              blogs.length <= 1
                                ? "At least one blog post must remain"
                                : "Delete Blog Post"
                            }
                          >
                            <DeleteOutlinedIcon style={{ fontSize: 18 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD BANNER SLIDE                            */}
      {/* ========================================================= */}
      {(editingBanner !== null || isNewBannerModalOpen) && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingBanner.id === "new"
                    ? "Add New Homepage Banner Slide"
                    : "Edit Banner Slide"}
                </h3>
                <p className="text-xs text-slate-500">
                  Changes will immediately sync to the homepage hero carousel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingBanner(null);
                  setIsNewBannerModalOpen(false);
                }}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="mt-6 space-y-5">
              {/* Badge & Headings */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Small Heading Badge
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.smallHeading}
                  onChange={(e) =>
                    setEditingBanner((prev) => ({
                      ...prev,
                      smallHeading: e.target.value,
                    }))
                  }
                  placeholder="e.g. Trusted Healthcare Services"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Main Heading (Line 1)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.headingLine1}
                    onChange={(e) =>
                      setEditingBanner((prev) => ({
                        ...prev,
                        headingLine1: e.target.value,
                      }))
                    }
                    placeholder="e.g. Quality Equipment."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Highlighted Heading (Gradient)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.headingHighlight}
                    onChange={(e) =>
                      setEditingBanner((prev) => ({
                        ...prev,
                        headingHighlight: e.target.value,
                      }))
                    }
                    placeholder="e.g. Better Healthcare."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Single line toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="singleLine"
                  checked={Boolean(editingBanner.singleLine)}
                  onChange={(e) =>
                    setEditingBanner((prev) => ({
                      ...prev,
                      singleLine: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="singleLine"
                  className="text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Display title on a single line (like "LithoPulse 35W") instead
                  of breaking
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hero Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingBanner.description}
                  onChange={(e) =>
                    setEditingBanner((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter descriptive text..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Buttons info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Primary Button Label & Link
                  </label>
                  <input
                    type="text"
                    value={editingBanner.primaryBtnText}
                    onChange={(e) =>
                      setEditingBanner((prev) => ({
                        ...prev,
                        primaryBtnText: e.target.value,
                      }))
                    }
                    placeholder="Book an Appointment"
                    className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 mb-2"
                  />
                  <input
                    type="text"
                    value={editingBanner.primaryBtnLink}
                    onChange={(e) =>
                      setEditingBanner((prev) => ({
                        ...prev,
                        primaryBtnLink: e.target.value,
                      }))
                    }
                    placeholder="/contact"
                    className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Secondary Button Label & Link
                  </label>
                  <input
                    type="text"
                    value={editingBanner.secondaryBtnText}
                    onChange={(e) =>
                      setEditingBanner((prev) => ({
                        ...prev,
                        secondaryBtnText: e.target.value,
                      }))
                    }
                    placeholder="Explore Products"
                    className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 mb-2"
                  />
                  <input
                    type="text"
                    value={editingBanner.secondaryBtnLink}
                    onChange={(e) =>
                      setEditingBanner((prev) => ({
                        ...prev,
                        secondaryBtnLink: e.target.value,
                      }))
                    }
                    placeholder="/machine"
                    className="w-full rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Banner Background Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={editingBanner.image || homeBannerDefault}
                      alt="Banner Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition">
                      <CloudUploadOutlinedIcon style={{ fontSize: 16 }} />
                      <span>Upload New Image</span>
                      <input
                        ref={bannerFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            readFileAsBase64(file, (base64) => {
                              setEditingBanner((prev) => ({
                                ...prev,
                                image: base64,
                              }));
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {editingBanner.image && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingBanner((prev) => ({ ...prev, image: "" }))
                        }
                        className="block text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                      >
                        Reset to default photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBanner(null);
                    setIsNewBannerModalOpen(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
                >
                  Save Banner Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD MEDICAL MACHINE PRODUCT                 */}
      {/* ========================================================= */}
      {(editingProduct !== null || isNewProductModalOpen) && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProduct.id === "new"
                    ? "Add Medical Machine to Catalog"
                    : "Edit Medical Machine"}
                </h3>
                <p className="text-xs text-slate-500">
                  Displayed in the Healthcare Products carousel on the Homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsNewProductModalOpen(false);
                }}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Machine Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Diode Laser"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category / Specialization
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  placeholder="e.g. Urology, Surgical, Laser"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brief Technical Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter medical equipment details..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Color Theme Preset */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Card Color Palette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = editingProduct.themeId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          setEditingProduct((prev) => ({
                            ...prev,
                            themeId: preset.id,
                          }))
                        }
                        className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary-dark ring-2 ring-primary/20"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full shadow-xs"
                          style={{ backgroundColor: preset.badgeBg }}
                        />
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Machine Image: Upload or choose preset */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Machine Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center">
                    <img
                      src={getProductDisplayImage(editingProduct)}
                      alt="Product Preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition">
                      <CloudUploadOutlinedIcon style={{ fontSize: 16 }} />
                      <span>Upload Image</span>
                      <input
                        ref={productFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            readFileAsBase64(file, (base64) => {
                              setEditingProduct((prev) => ({
                                ...prev,
                                image: base64,
                                presetImageKey: "",
                              }));
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Or pick a built-in medical preset below:
                    </p>
                  </div>
                </div>

                {/* Presets picker */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {PRESET_PRODUCTS.map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() =>
                        setEditingProduct((prev) => ({
                          ...prev,
                          presetImageKey: preset.key,
                          image: "",
                        }))
                      }
                      className={`flex items-center gap-1.5 rounded-lg border p-1.5 text-[10px] font-semibold transition cursor-pointer ${
                        editingProduct.presetImageKey === preset.key &&
                        !editingProduct.image
                          ? "border-primary bg-primary/10 text-primary-dark"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <img
                        src={preset.img}
                        alt={preset.name}
                        className="h-5 w-5 object-contain"
                      />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsNewProductModalOpen(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
                >
                  Save Medical Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD TESTIMONIAL CARD                        */}
      {/* ========================================================= */}
      {(editingTestimonial !== null || isNewTestimonialModalOpen) &&
        editingTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingTestimonial.id === "new"
                      ? "Add New Testimonial Card"
                      : "Edit Testimonial Card"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Will appear in the &quot;Our Trusted Clients&quot; testimonials section on the Homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonial(null);
                    setIsNewTestimonialModalOpen(false);
                  }}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <CloseIcon style={{ fontSize: 20 }} />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="mt-6 space-y-4">
                {/* Author Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Author / Doctor Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name}
                    onChange={(e) =>
                      setEditingTestimonial((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g. Dr. Sarah Mitchell"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Title / Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Title, Specialty & Hospital / Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.role}
                    onChange={(e) =>
                      setEditingTestimonial((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    placeholder="e.g. Orthopedic Surgeon, Riverdale Health"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Testimonial Quote Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Testimonial Quote / Review
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingTestimonial.text}
                    onChange={(e) =>
                      setEditingTestimonial((prev) => ({
                        ...prev,
                        text: e.target.value,
                      }))
                    }
                    placeholder="Enter the quote text describing their experience with Reinforce Healthcare..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Background Color Preset */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Card Background Color Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TESTIMONIAL_BG_OPTIONS.map((opt) => {
                      const isSelected = editingTestimonial.bg === opt.bgClass;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setEditingTestimonial((prev) => ({
                              ...prev,
                              bg: opt.bgClass,
                            }))
                          }
                          className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary-dark ring-2 ring-primary/20"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className="h-4 w-4 rounded-full border border-slate-300 shadow-xs"
                            style={{ backgroundColor: opt.previewHex }}
                          />
                          <span className="truncate text-[11px]">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Author Photo */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Author Photo / Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 rounded-full border-2 border-primary/30 overflow-hidden bg-white p-0.5 flex items-center justify-center shadow-xs">
                      <img
                        src={editingTestimonial.image || "https://i.pravatar.cc/100?img=47"}
                        alt={editingTestimonial.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition">
                        <CloudUploadOutlinedIcon style={{ fontSize: 16 }} />
                        <span>Upload Photo</span>
                        <input
                          ref={testimonialFileRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              readFileAsBase64(file, (base64) => {
                                setEditingTestimonial((prev) => ({
                                  ...prev,
                                  image: base64,
                                }));
                              });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-400">
                        Or select a default doctor avatar:
                      </p>
                    </div>
                  </div>

                  {/* Preset Avatars */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setEditingTestimonial((prev) => ({
                            ...prev,
                            image: preset.url,
                          }))
                        }
                        className={`relative rounded-full p-0.5 transition cursor-pointer ${
                          editingTestimonial.image === preset.url
                            ? "ring-2 ring-primary ring-offset-2"
                            : "opacity-75 hover:opacity-100"
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="h-8 w-8 rounded-full object-cover border border-slate-200"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTestimonial(null);
                      setIsNewTestimonialModalOpen(false);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
                  >
                    Save Testimonial Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD CLIENT CARD                             */}
      {/* ========================================================= */}
      {(editingClient !== null || isNewClientModalOpen) && editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingClient.id === "new"
                    ? "Add New Client Card"
                    : "Edit Client Card"}
                </h3>
                <p className="text-xs text-slate-500">
                  Displayed in the Trusted by Leading Healthcare Brands carousel on the Homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingClient(null);
                  setIsNewClientModalOpen(false);
                }}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="mt-6 space-y-4">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Client / Hospital / Partner Name
                </label>
                <input
                  type="text"
                  required
                  value={editingClient.name}
                  onChange={(e) =>
                    setEditingClient((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. MAX Hospital"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Subtitle / Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category / Subtitle
                </label>
                <input
                  type="text"
                  required
                  value={editingClient.subtitle}
                  onChange={(e) =>
                    setEditingClient((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="e.g. HOSPITALS, PARTNERS, CLINIC"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Card Accent Theme */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Card Background Color Accent
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CLIENT_ACCENT_OPTIONS.map((opt) => {
                    const isSelected = editingClient.accent === opt.bgClass;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setEditingClient((prev) => ({
                            ...prev,
                            accent: opt.bgClass,
                          }))
                        }
                        className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary-dark ring-2 ring-primary/20"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-slate-300 shadow-xs"
                          style={{ backgroundColor: opt.previewHex }}
                        />
                        <span className="truncate text-[10px]">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Logo Image */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Client Logo Image
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className={`h-20 w-32 shrink-0 rounded-xl border border-slate-200 p-2 flex items-center justify-center shadow-xs ${
                      editingClient.accent || "bg-[#F3F7FF]"
                    }`}
                  >
                    <img
                      src={getClientDisplayLogo(editingClient)}
                      alt="Logo preview"
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition">
                      <CloudUploadOutlinedIcon style={{ fontSize: 16 }} />
                      <span>Upload Logo Image</span>
                      <input
                        ref={clientFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            readFileAsBase64(file, (base64) => {
                              setEditingClient((prev) => ({
                                ...prev,
                                logo: base64,
                                presetKey: "",
                              }));
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Or select a built-in brand logo preset:
                    </p>
                  </div>
                </div>

                {/* Preset Brand Logos */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {CLIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() =>
                        setEditingClient((prev) => ({
                          ...prev,
                          presetKey: preset.key,
                          logo: "",
                        }))
                      }
                      className={`flex items-center gap-2 rounded-xl border p-2 text-xs font-semibold transition cursor-pointer ${
                        editingClient.presetKey === preset.key &&
                        !editingClient.logo
                          ? "border-primary bg-primary/10 text-primary-dark ring-2 ring-primary/20"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <img
                        src={preset.img}
                        alt={preset.name}
                        className="h-6 w-12 object-contain"
                      />
                      <span className="truncate text-[11px]">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingClient(null);
                    setIsNewClientModalOpen(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
                >
                  Save Client Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD FAQ QUESTION                            */}
      {/* ========================================================= */}
      {(editingFaq !== null || isNewFaqModalOpen) && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingFaq.id === "new"
                    ? "Add New FAQ Question"
                    : "Edit FAQ Question & Answer"}
                </h3>
                <p className="text-xs text-slate-500">
                  Will update the accordion in the FAQ section on the live homepage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingFaq(null);
                  setIsNewFaqModalOpen(false);
                }}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="mt-6 space-y-4">
              {/* Question Topic Icon Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Question Category & Icon
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FAQ_ICON_OPTIONS.map((opt) => {
                    const isSelected = editingFaq.iconKey === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setEditingFaq((prev) => ({
                            ...prev,
                            iconKey: opt.id,
                          }))
                        }
                        className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary-dark ring-2 ring-primary/20"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-primary shrink-0">
                          {FAQ_ICON_MAP[opt.id] || (
                            <MedicalServicesIcon fontSize="small" />
                          )}
                        </span>
                        <span className="truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Question Text
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={(e) =>
                    setEditingFaq((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  placeholder="e.g. What types of healthcare products do you offer?"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Answer Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Answer
                </label>
                <textarea
                  rows={5}
                  required
                  value={editingFaq.answer}
                  onChange={(e) =>
                    setEditingFaq((prev) => ({
                      ...prev,
                      answer: e.target.value,
                    }))
                  }
                  placeholder="Provide a comprehensive answer to inform potential clients..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq(null);
                    setIsNewFaqModalOpen(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
                >
                  Save FAQ Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD BLOG POST                               */}
      {/* ========================================================= */}
      {(editingBlog !== null || isNewBlogModalOpen) && editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingBlog.id === "new"
                    ? "Add New Blog Post"
                    : "Edit Blog Post"}
                </h3>
                <p className="text-xs text-slate-500">
                  Will update the editorial blog cards on the live /blogs page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingBlog(null);
                  setIsNewBlogModalOpen(false);
                }}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="mt-6 space-y-4">
              {/* Tag / Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Tag
                </label>
                <input
                  type="text"
                  required
                  value={editingBlog.tag}
                  onChange={(e) =>
                    setEditingBlog((prev) => ({
                      ...prev,
                      tag: e.target.value,
                    }))
                  }
                  placeholder="e.g. Surgical Innovation"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Blog Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Blog Title
                </label>
                <input
                  type="text"
                  required
                  value={editingBlog.title}
                  onChange={(e) =>
                    setEditingBlog((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g. The Rise of Bipolar Plasma Technology in Modern OTs"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Date & Read Time */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlog.date}
                    onChange={(e) =>
                      setEditingBlog((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    placeholder="e.g. 12 Aug 2026"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Read Time
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBlog.readTime}
                    onChange={(e) =>
                      setEditingBlog((prev) => ({
                        ...prev,
                        readTime: e.target.value,
                      }))
                    }
                    placeholder="e.g. 5 min read"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Excerpt
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingBlog.excerpt}
                  onChange={(e) =>
                    setEditingBlog((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  placeholder="Write a short summary of the blog post..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-900 focus:border-primary focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Blog Cover Image */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Blog Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs">
                    <img
                      src={getBlogDisplayImage(editingBlog)}
                      alt="Blog cover preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition">
                      <CloudUploadOutlinedIcon style={{ fontSize: 16 }} />
                      <span>Upload Cover Image</span>
                      <input
                        ref={blogFileRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            readFileAsBase64(file, (base64) => {
                              setEditingBlog((prev) => ({
                                ...prev,
                                image: base64,
                                presetKey: "",
                              }));
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Or select a built-in cover image preset:
                    </p>
                  </div>
                </div>

                {/* Preset Cover Images */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {BLOG_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setEditingBlog((prev) => ({
                          ...prev,
                          presetKey: preset.id,
                          image: "",
                        }))
                      }
                      className={`flex items-center gap-2 rounded-xl border p-2 text-xs font-semibold transition cursor-pointer ${
                        editingBlog.presetKey === preset.id && !editingBlog.image
                          ? "border-primary bg-primary/10 text-primary-dark ring-2 ring-primary/20"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <img
                        src={preset.src}
                        alt={preset.label}
                        className="h-8 w-14 shrink-0 rounded-lg object-cover"
                      />
                      <span className="truncate text-[11px]">{preset.label}</span>
                    </button>
                  ))}
                </div>

                {editingBlog.image && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingBlog((prev) => ({
                        ...prev,
                        image: "",
                        presetKey: "blog_3",
                      }))
                    }
                    className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    Remove custom image (use preset)
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlog(null);
                    setIsNewBlogModalOpen(false);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-2 text-xs font-bold text-white shadow-md shadow-primary/20 hover:shadow-lg transition cursor-pointer"
                >
                  Save Blog Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
