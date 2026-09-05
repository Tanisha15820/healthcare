// LocalStorage manager for Interactive Machine & Machine Products

export const INTERACTIVE_MACHINE_KEY = "rhs_interactive_machine_v1";
export const MACHINE_PRODUCTS_KEY = "rhs_machine_products_v1";

export const DEFAULT_INTERACTIVE_MACHINE = {
  machineImage: "", // empty means use default machine.png
  title: "Advanced Medical Machine & Healthcare Equipment Rental",
  subtitle: "Interactive showcase of high-performance medical machinery available for rental to hospitals and surgical clinics.",
  badgeText: "High-Performance Medical Technology",
  parts: [
    {
      id: "display",
      title: "Advanced Touch Display",
      description:
        "High-resolution touch display provides clear real-time monitoring and intuitive system control.",
      icon: "Monitor",
      top: "13%",
      left: "51%",
      cardPosition: "right",
    },
    {
      id: "control",
      title: "Control System",
      description:
        "Easy-to-use control interface designed for precise operation and quick access to essential settings.",
      icon: "Settings2",
      top: "27%",
      left: "50%",
      cardPosition: "left",
    },
    {
      id: "tray",
      title: "Integrated Storage Tray",
      description:
        "Convenient integrated tray provides additional space for essential accessories during procedures.",
      icon: "Package",
      top: "48%",
      left: "50%",
      cardPosition: "right",
    },
    {
      id: "stand",
      title: "Adjustable Stand",
      description:
        "Stable height-adjustable structure designed for comfortable positioning and efficient workflow.",
      icon: "Move",
      top: "68%",
      left: "50%",
      cardPosition: "left",
    },
    {
      id: "base",
      title: "Stable Mobile Base",
      description:
        "Strong wheeled base provides stability while allowing smooth movement of the equipment.",
      icon: "Move",
      top: "88%",
      left: "50%",
      cardPosition: "right",
    },
  ],
};

export const DEFAULT_MACHINE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Bipolar Plasma Generator",
    category: "Surgical",
    image: "",
    presetImageKey: "bipolar_plasma_generator",
    bg: "bg-[#F1EDFF]",
    iconBg: "bg-[#E4DAFF]",
    iconColor: "text-[#7357E8]",
    lineColor: "bg-[#7357E8]",
    description: "High-frequency plasma resection system for precise tissue coagulation.",
  },
  {
    id: "prod-2",
    name: "Diode Laser",
    category: "Laser Surgery",
    image: "",
    presetImageKey: "diode_laser",
    bg: "bg-[#EDF9F7]",
    iconBg: "bg-[#D5F2EC]",
    iconColor: "text-[#1EAE9B]",
    lineColor: "bg-[#1EAE9B]",
    description: "Dual-wavelength high power diode laser for multiple clinical procedures.",
  },
  {
    id: "prod-3",
    name: "CyberBlade",
    category: "Urology",
    image: "",
    presetImageKey: "cyber_blade",
    bg: "bg-[#EEF5FF]",
    iconBg: "bg-[#D9E8FF]",
    iconColor: "text-[#4285E8]",
    lineColor: "bg-[#4285E8]",
    description: "Ultra-sharp precision surgical instrumentation for minimally invasive work.",
  },
  {
    id: "prod-4",
    name: "Flexible Video URS",
    category: "Endoscopy",
    image: "",
    presetImageKey: "flexible_video_urs",
    bg: "bg-[#FFF1F5]",
    iconBg: "bg-[#FFE0E9]",
    iconColor: "text-[#F15B91]",
    lineColor: "bg-[#F15B91]",
    description: "High-resolution digital flexible ureteroscope for superior clinical visual clarity.",
  },
  {
    id: "prod-5",
    name: "Endo Vision Set",
    category: "OR Imaging",
    image: "",
    presetImageKey: "endo_vision_set",
    bg: "bg-[#F4F0FF]",
    iconBg: "bg-[#E6DDFF]",
    iconColor: "text-[#7357E8]",
    lineColor: "bg-[#7357E8]",
    description: "Complete laparoscopic and endoscopic camera tower & cold light system.",
  },
  {
    id: "prod-6",
    name: "Bladder Scanner",
    category: "Diagnostics",
    image: "",
    presetImageKey: "bladder_scanner",
    bg: "bg-[#EDF8FF]",
    iconBg: "bg-[#DCEEFF]",
    iconColor: "text-[#4285E8]",
    lineColor: "bg-[#4285E8]",
    description: "Non-invasive 3D ultrasound device for quick urinary volume assessment.",
  },
];

// Color theme presets for products
export const THEME_PRESETS = [
  {
    id: "purple",
    label: "Royal Purple",
    bg: "bg-[#F1EDFF]",
    iconBg: "bg-[#E4DAFF]",
    iconColor: "text-[#7357E8]",
    lineColor: "bg-[#7357E8]",
    badgeBg: "#7357E8",
  },
  {
    id: "teal",
    label: "Medical Teal",
    bg: "bg-[#EDF9F7]",
    iconBg: "bg-[#D5F2EC]",
    iconColor: "text-[#1EAE9B]",
    lineColor: "bg-[#1EAE9B]",
    badgeBg: "#1EAE9B",
  },
  {
    id: "blue",
    label: "RHS Sky Blue",
    bg: "bg-[#EEF5FF]",
    iconBg: "bg-[#D9E8FF]",
    iconColor: "text-[#4285E8]",
    lineColor: "bg-[#4285E8]",
    badgeBg: "#4285E8",
  },
  {
    id: "pink",
    label: "Surgical Rose",
    bg: "bg-[#FFF1F5]",
    iconBg: "bg-[#FFE0E9]",
    iconColor: "text-[#F15B91]",
    lineColor: "bg-[#F15B91]",
    badgeBg: "#F15B91",
  },
];

// ================= 1. INTERACTIVE SHOWCASE MACHINE METHODS =================

export const getInteractiveMachineData = () => {
  try {
    const raw = localStorage.getItem(INTERACTIVE_MACHINE_KEY);
    if (!raw) return { ...DEFAULT_INTERACTIVE_MACHINE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_INTERACTIVE_MACHINE,
      ...parsed,
      parts: Array.isArray(parsed.parts) ? parsed.parts : DEFAULT_INTERACTIVE_MACHINE.parts,
    };
  } catch (err) {
    console.error("Error loading interactive machine data:", err);
    return { ...DEFAULT_INTERACTIVE_MACHINE };
  }
};

export const saveInteractiveMachineData = (data) => {
  try {
    localStorage.setItem(INTERACTIVE_MACHINE_KEY, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent("rhs_machines_updated", { detail: { type: "interactive", data } })
    );
    return true;
  } catch (err) {
    console.error("Error saving interactive machine data:", err);
    return false;
  }
};

export const addMachineHotspot = (hotspot) => {
  const current = getInteractiveMachineData();
  const newPart = {
    id: `part-${Date.now()}`,
    title: hotspot.title || "New Feature Point",
    description: hotspot.description || "Feature description for this medical machine part.",
    icon: hotspot.icon || "Sparkles",
    top: hotspot.top || "50%",
    left: hotspot.left || "50%",
    cardPosition: hotspot.cardPosition || "right",
  };
  const updated = {
    ...current,
    parts: [...current.parts, newPart],
  };
  saveInteractiveMachineData(updated);
  return updated;
};

export const updateMachineHotspot = (id, updatedFields) => {
  const current = getInteractiveMachineData();
  const updatedParts = current.parts.map((p) =>
    p.id === id ? { ...p, ...updatedFields } : p
  );
  const updated = {
    ...current,
    parts: updatedParts,
  };
  saveInteractiveMachineData(updated);
  return updated;
};

export const deleteMachineHotspot = (id) => {
  const current = getInteractiveMachineData();
  if (current.parts.length <= 1) {
    return {
      success: false,
      message: "At least one hotspot point must remain on the machine.",
      data: current,
    };
  }
  const updated = {
    ...current,
    parts: current.parts.filter((p) => p.id !== id),
  };
  saveInteractiveMachineData(updated);
  return {
    success: true,
    data: updated,
  };
};

export const resetInteractiveMachineData = () => {
  try {
    localStorage.removeItem(INTERACTIVE_MACHINE_KEY);
    window.dispatchEvent(
      new CustomEvent("rhs_machines_updated", {
        detail: { type: "interactive", data: DEFAULT_INTERACTIVE_MACHINE },
      })
    );
    return { ...DEFAULT_INTERACTIVE_MACHINE };
  } catch (err) {
    console.error("Error resetting interactive machine data:", err);
    return { ...DEFAULT_INTERACTIVE_MACHINE };
  }
};

// ================= 2. MACHINE PRODUCTS CATALOG METHODS =================

export const getMachineProducts = () => {
  try {
    const raw = localStorage.getItem(MACHINE_PRODUCTS_KEY);
    if (!raw) return DEFAULT_MACHINE_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_MACHINE_PRODUCTS;
  } catch (err) {
    console.error("Error loading machine products:", err);
    return DEFAULT_MACHINE_PRODUCTS;
  }
};

export const saveMachineProducts = (products) => {
  try {
    localStorage.setItem(MACHINE_PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(
      new CustomEvent("rhs_machines_updated", { detail: { type: "products", data: products } })
    );
    return true;
  } catch (err) {
    console.error("Error saving machine products:", err);
    return false;
  }
};

export const addMachineProduct = (product) => {
  const current = getMachineProducts();
  const theme = THEME_PRESETS.find((t) => t.id === product.themeId) || THEME_PRESETS[2];
  const newProd = {
    id: `prod-${Date.now()}`,
    name: product.name || "New Medical Machine",
    category: product.category || "Healthcare Equipment",
    image: product.image || "",
    presetImageKey: product.presetImageKey || "",
    bg: theme.bg,
    iconBg: theme.iconBg,
    iconColor: theme.iconColor,
    lineColor: theme.lineColor,
    description: product.description || "High-precision medical machinery designed for clinical efficiency.",
  };
  const updated = [...current, newProd];
  saveMachineProducts(updated);
  return updated;
};

export const updateMachineProduct = (id, updatedFields) => {
  const current = getMachineProducts();
  let themeObj = {};
  if (updatedFields.themeId) {
    const found = THEME_PRESETS.find((t) => t.id === updatedFields.themeId);
    if (found) {
      themeObj = {
        bg: found.bg,
        iconBg: found.iconBg,
        iconColor: found.iconColor,
        lineColor: found.lineColor,
      };
    }
  }
  const updated = current.map((p) =>
    p.id === id ? { ...p, ...updatedFields, ...themeObj } : p
  );
  saveMachineProducts(updated);
  return updated;
};

export const deleteMachineProduct = (id) => {
  const current = getMachineProducts();
  if (current.length <= 1) {
    return {
      success: false,
      message: "At least one medical product must remain visible.",
      products: current,
    };
  }
  const updated = current.filter((p) => p.id !== id);
  saveMachineProducts(updated);
  return {
    success: true,
    products: updated,
  };
};

export const resetMachineProducts = () => {
  try {
    localStorage.removeItem(MACHINE_PRODUCTS_KEY);
    window.dispatchEvent(
      new CustomEvent("rhs_machines_updated", {
        detail: { type: "products", data: DEFAULT_MACHINE_PRODUCTS },
      })
    );
    return DEFAULT_MACHINE_PRODUCTS;
  } catch (err) {
    console.error("Error resetting machine products:", err);
    return DEFAULT_MACHINE_PRODUCTS;
  }
};
