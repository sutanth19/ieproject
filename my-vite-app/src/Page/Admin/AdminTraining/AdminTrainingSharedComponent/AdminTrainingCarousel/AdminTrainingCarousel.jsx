// Page/Admin/AdminTraining/AdminTrainingSharedComponent/AdminTrainingCarousel/AdminTrainingCarousel.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import CarouselHeader from "./CarouselHeader";
import CarouselForm   from "./CarouselForm";
import CarouselList   from "./CarouselList";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import SnackbarAlert  from "./SnackbarAlert";

const API_URL = "http://localhost:5001/api/training-carousel";

const AdminTrainingCarousel = ({ trainingType }) => {
  const theme      = useTheme();
  const isSmall    = useMediaQuery(theme.breakpoints.down("sm"));
  const carouselRef = useRef(null);

  /* ─────────────── state ─────────────── */
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [formOpen,   setFormOpen]   = useState(false);
  const [editing,    setEditing]    = useState(null);   // ← whole item or null
  const [confirm,    setConfirm]    = useState({ open:false, guid:null });
  const [snackbar,   setSnackbar]   = useState({ open:false, msg:"", sev:"success" });

  /* ─────────────── fetch ─────────────── */
  useEffect(() => { load(); }, [trainingType]);
  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch(`${API_URL}?type=${trainingType}`);
      if (!r.ok) throw new Error("Failed to fetch");
      setItems(await r.json());
    } catch (e) {
      show(e.message, "error");
    } finally { setLoading(false); }
  };

  /* ─────────────── CRUD helpers ─────────────── */
  const createOrUpdate = async (data, file) => {
    const fd = new FormData();
    fd.append("trainingType", trainingType);
    fd.append("title", data.title);
    fd.append("subTitle", data.subTitle);
    if (file) fd.append("image", file);

    // Update to use guid_id instead of id
    const url    = editing ? `${API_URL}/${editing.guid_id}` : API_URL;
    const method = editing ? "PUT" : "POST";

    try {
      const r = await fetch(url, { method, body: fd });
      if (!r.ok) throw new Error(await r.text() || "Server error");

      show(`Item ${editing ? "updated" : "created"}!`);
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  const remove = async (guid) => {
    try {
      const r = await fetch(`${API_URL}/${guid}`, { method:"DELETE" });
      if (!r.ok) throw new Error(await r.text() || "Delete failed");
      show("Deleted!");
      load();
    } catch (e) {
      show(e.message, "error");
    }
  };

  /* ─────────────── UI helpers ─────────────── */
  const openForm  = (item = null) => { setEditing(item); setFormOpen(true); };
  const closeForm = () => { setEditing(null); setFormOpen(false); };
  const show      = (msg, sev="success") => setSnackbar({ open:true, msg, sev });

  /* ─────────────── render ─────────────── */
  return (
    <Box sx={{ width:"100%" }}>
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
        onDelete={(guid) => setConfirm({ open:true, guid })}
      />

      <ConfirmDeleteDialog
        open={confirm.open}
        onClose={() => setConfirm({ open:false, guid:null })}
        onConfirm={() => { 
          remove(confirm.guid);
          setConfirm({ open:false, guid:null }); 
        }}
      />

      <SnackbarAlert {...snackbar} onClose={() => setSnackbar({ ...snackbar, open:false })} />
    </Box>
  );
};

export default AdminTrainingCarousel;