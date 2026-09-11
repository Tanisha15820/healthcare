import { useState, useRef } from "react";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";

// Storage helpers and presets
import {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  resetBlogs,
  BLOG_IMAGE_PRESETS,
} from "../../utils/blogStorage";
import { readFileAsBase64 } from "../../utils/fileUtils";

/**
 * BlogsTab Component
 * Simple, beginner-friendly component to manage website blog posts and articles.
 * Supports: Listing articles, Cover photo upload, Adding, Editing, and Deleting.
 */
function BlogsTab({ blogs, setBlogs, showNotify }) {
  // Modal states
  const [editingBlog, setEditingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hidden file input reference for cover image upload
  const fileInputRef = useRef(null);

  // Helper to determine the image to display (custom upload vs built-in preset)
  const getBlogDisplayImage = (blogObj) => {
    if (blogObj?.image && typeof blogObj.image === "string" && blogObj.image.trim() !== "") {
      return blogObj.image;
    }
    if (blogObj?.presetKey && BLOG_IMAGE_PRESETS.some((p) => p.id === blogObj.presetKey)) {
      const found = BLOG_IMAGE_PRESETS.find((p) => p.id === blogObj.presetKey);
      return found ? found.src : BLOG_IMAGE_PRESETS[0].src;
    }
    return BLOG_IMAGE_PRESETS[0]?.src || "";
  };

  // -------------------------------------------------------------
  // 1. OPEN MODAL FOR NEW BLOG
  // -------------------------------------------------------------
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
    setIsModalOpen(true);
  };

  // -------------------------------------------------------------
  // 2. OPEN MODAL FOR EDITING
  // -------------------------------------------------------------
  const openEditBlogModal = (post) => {
    setEditingBlog({ ...post });
    setIsModalOpen(true);
  };

  // -------------------------------------------------------------
  // 3. SAVE BLOG (ADD OR UPDATE)
  // -------------------------------------------------------------
  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!editingBlog) return;

    if (editingBlog.id === "new") {
      const updatedList = addBlog(editingBlog);
      setBlogs(updatedList);
      showNotify("New blog post added successfully!");
    } else {
      const updatedList = updateBlog(editingBlog.id, editingBlog);
      setBlogs(updatedList);
      showNotify("Blog post updated successfully!");
    }

    setIsModalOpen(false);
    setEditingBlog(null);
  };

  // -------------------------------------------------------------
  // 4. DELETE BLOG
  // -------------------------------------------------------------
  const handleDeleteBlog = (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this blog post?"
    );
    if (!isConfirmed) return;

    const updatedList = deleteBlog(id);
    setBlogs(updatedList);
    if (editingBlog?.id === id) setEditingBlog(null);
    showNotify("Blog post deleted successfully.");
  };

  // -------------------------------------------------------------
  // 5. RESET BLOGS TO DEFAULTS
  // -------------------------------------------------------------
  const handleResetBlogs = () => {
    const isConfirmed = window.confirm(
      "Reset all blog posts to factory default list?"
    );
    if (!isConfirmed) return;

    const defaults = resetBlogs();
    setBlogs(defaults);
    setEditingBlog(null);
    showNotify("Blog posts reset to original defaults.");
  };

  // -------------------------------------------------------------
  // 6. UPLOAD BLOG COVER IMAGE
  // -------------------------------------------------------------
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    readFileAsBase64(
      file,
      (base64String) => {
        setEditingBlog((prev) => ({
          ...prev,
          image: base64String,
          presetKey: "",
        }));
      },
      (errorMessage) => {
        showNotify(errorMessage, "error");
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
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

      {/* Blog Cards List */}
      <div className="space-y-6">
        {blogs.map((post, index) => {
          const displayImage = getBlogDisplayImage(post);

          return (
            <div
              key={post.id || index}
              className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all duration-300"
            >
              <div className="grid md:grid-cols-[40%_60%]">
                {/* Image Side */}
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

                {/* Content Side */}
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
                        onClick={() => openEditBlogModal(post)}
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

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT BLOG POST                               */}
      {/* ========================================================= */}
      {isModalOpen && editingBlog && (
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
                  setIsModalOpen(false);
                  setEditingBlog(null);
                }}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="mt-6 space-y-4">
              {/* Category Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category Tag
                </label>
                <input
                  type="text"
                  required
                  value={editingBlog.tag || ""}
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

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Blog Title
                </label>
                <input
                  type="text"
                  required
                  value={editingBlog.title || ""}
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
                    value={editingBlog.date || ""}
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
                    value={editingBlog.readTime || ""}
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
                  value={editingBlog.excerpt || ""}
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

              {/* Cover Image: Upload or Built-in Preset */}
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
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
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

              {/* Form Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingBlog(null);
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
    </div>
  );
}

export default BlogsTab;
