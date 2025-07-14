// Page/Admin/AdminTraining/AdminTrainingSharedComponent/AdminTrainingCarousel/AdminTrainingCarousel.tsx
import React, { useState, useEffect, useRef } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import CarouselHeader from "./CarouselHeader";
import CarouselForm from "./CarouselForm";
import CarouselList from "./CarouselList";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import SnackbarAlert from "./SnackbarAlert";

// Type definitions for imported components (until they're converted to TypeScript)
interface CarouselHeaderProps {
  title: string;
  formOpen: boolean;
  onToggle: () => void;
}

// Updated to match CarouselForm's expected type
interface CarouselFormData {
  title: string;
  subTitle: string;
}

interface CarouselFormProps {
  open: boolean;
  editingItem: CarouselItem | null;
  onCancel: () => void;
  onSubmit: (data: CarouselFormData, file: File | null) => Promise<void>; // Updated to match expected signature
}

interface CarouselListProps {
  items: CarouselItem[];
  loading: boolean;
  isSmall: boolean;
  onEdit: (item?: CarouselItem | null) => void;
  onDelete: (guid: string) => void;
}

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface SnackbarAlertProps {
  open: boolean;
  msg: string;
  sev: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

// Type definitions
interface CarouselItem {
  guid_id: string;
  title: string;
  subTitle: string;
  trainingType: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ConfirmState {
  open: boolean;
  guid: string | null;
}

interface SnackbarState {
  open: boolean;
  msg: string;
  sev: "success" | "error" | "warning" | "info";
}

interface AdminTrainingCarouselProps {
  trainingType: string;
}

const API_URL: string = "http://localhost:5001/api/training-carousel";

const AdminTrainingCarousel: React.FC<AdminTrainingCarouselProps> = ({ trainingType }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const carouselRef = useRef<HTMLDivElement>(null);

  /* ─────────────── state ─────────────── */
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<CarouselItem | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false, guid: null });
  const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, msg: "", sev: "success" });

  /* ─────────────── fetch ─────────────── */
  useEffect(() => { 
    load(); 
  }, [trainingType]);

  const load = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?type=${trainingType}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data: CarouselItem[] = await response.json();
      setItems(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      show(errorMessage, "error");
    } finally { 
      setLoading(false); 
    }
  };

  /* ─────────────── CRUD helpers ─────────────── */
  // Updated function signature to match CarouselForm's expectations
  const createOrUpdate = async (data: CarouselFormData, file: File | null): Promise<void> => {
    const formData = new FormData();
    formData.append("trainingType", trainingType);
    formData.append("title", data.title);
    formData.append("subTitle", data.subTitle);
    if (file) formData.append("image", file);

    // Update to use guid_id instead of id
    const url = editing ? `${API_URL}/${editing.guid_id}` : API_URL;
    const method = editing ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server error");
      }

      show(`Item ${editing ? "updated" : "created"}!`);
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      show(errorMessage, "error");
    }
  };

  const remove = async (guid: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${guid}`, { method: "DELETE" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Delete failed");
      }
      show("Deleted!");
      load();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      show(errorMessage, "error");
    }
  };

  /* ─────────────── UI helpers ─────────────── */
  const openForm = (item: CarouselItem | null = null): void => { 
    setEditing(item); 
    setFormOpen(true); 
  };

  const closeForm = (): void => { 
    setEditing(null); 
    setFormOpen(false); 
  };

  const show = (msg: string, sev: SnackbarState["sev"] = "success"): void => {
    setSnackbar({ open: true, msg, sev });
  };

  const handleDeleteClick = (guid: string): void => {
    setConfirm({ open: true, guid });
  };

  const handleConfirmClose = (): void => {
    setConfirm({ open: false, guid: null });
  };

  const handleConfirmDelete = (): void => {
    if (confirm.guid) {
      remove(confirm.guid);
      setConfirm({ open: false, guid: null });
    }
  };

  const handleSnackbarClose = (): void => {
    setSnackbar({ ...snackbar, open: false });
  };

  /* ─────────────── render ─────────────── */
  return (
    <Box sx={{ width: "100%" }}>
      <CarouselHeader
        title={`${trainingType} Carousel Content`}
        formOpen={formOpen}
        onToggle={() => (formOpen ? closeForm() : openForm())}
      />

      <CarouselForm
        open={formOpen}
        editingItem={editing}
        onCancel={closeForm}
        onSubmit={createOrUpdate}
      />

      <CarouselList
        ref={carouselRef}
        items={items}
        loading={loading}
        isSmall={isSmall}
        onEdit={openForm}
        onDelete={handleDeleteClick}
        {...({} as any)}
      />

      <ConfirmDeleteDialog
        open={confirm.open}
        onClose={handleConfirmClose}
        onConfirm={handleConfirmDelete}
      />

      <SnackbarAlert 
        {...snackbar} 
        onClose={handleSnackbarClose} 
      />
    </Box>
  );
};

export default AdminTrainingCarousel;