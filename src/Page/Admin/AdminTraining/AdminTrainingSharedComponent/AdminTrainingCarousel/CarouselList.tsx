import React, { forwardRef, useState } from "react";
import { useTheme, alpha } from "@mui/material/styles";
import Box       from "@mui/material/Box";
import Card      from "@mui/material/Card";
import Skeleton  from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import Button     from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon   from "@mui/icons-material/Add";
import PhotoIcon from "@mui/icons-material/Photo";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon  from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CarouselList = forwardRef(({ items, loading, isSmall, onEdit, onDelete }, ref) => {
  const theme = useTheme();
  const [scroll, setScroll] = useState(0);

  const scrollBy = dir => {
    if (!ref.current) return;
    const w = ref.current.clientWidth;
    ref.current.scrollBy({ left: dir==="left"? -w : w, behavior:"smooth" });
  };
  const handleScroll = ()=>{ if (ref.current) setScroll(ref.current.scrollLeft); };

  const canLeft  = scroll > 0;
  const canRight = ref.current ? scroll < ref.current.scrollWidth - ref.current.clientWidth - 10 : false;

  return (
    <Box sx={{ position:"relative", mb:4 }}>
      {/* arrows */}
      <IconButton onClick={()=>scrollBy("left")}  disabled={!canLeft}
        sx={{ position:"absolute", left:-20, top:"50%", transform:"translateY(-50%)",
              backgroundColor:alpha(theme.palette.background.paper,0.8),
              backdropFilter:"blur(8px)", zIndex:10, opacity:canLeft?1:0.3,
              display: items.length<=1?"none":"flex",
              "&:hover":{ backgroundColor:alpha(theme.palette.primary.main,0.1) }}}>
        <ArrowBackIosNewIcon fontSize="small"/>
      </IconButton>
      <IconButton onClick={()=>scrollBy("right")} disabled={!canRight}
        sx={{ position:"absolute", right:-20, top:"50%", transform:"translateY(-50%)",
              backgroundColor:alpha(theme.palette.background.paper,0.8),
              backdropFilter:"blur(8px)", zIndex:10, opacity:canRight?1:0.3,
              display: items.length<=1?"none":"flex",
              "&:hover":{ backgroundColor:alpha(theme.palette.primary.main,0.1) }}}>
        <ArrowForwardIosIcon fontSize="small"/>
      </IconButton>

      {/* content */}
      {loading ? (
        <Box sx={{ display:"flex", gap:3, overflow:"hidden" }}>
          {Array.from({length:3}).map((_,i)=>
            <Skeleton key={i} variant="rectangular" width="100%" height={380}
                      sx={{ borderRadius:2, flex:"0 0 100%" }}/>
          )}
        </Box>
      ) : items.length===0 ? (
        <Box sx={{ textAlign:"center", py:8, background:alpha(theme.palette.background.paper,0.4),
                   backdropFilter:"blur(10px)", borderRadius:2,
                   border:`1px solid ${alpha(theme.palette.common.white,0.1)}` }}>
          <PhotoIcon sx={{ fontSize:80, opacity:0.3, mb:2 }} />
          <Typography variant="h6" gutterBottom fontWeight={500}>No carousel items yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb:3 }}>
            Click "Add Item" to create  first slide
          </Typography>
          <Button variant="contained" startIcon={<AddIcon/>} onClick={()=>onEdit(null)}
            sx={{ backgroundColor:theme.palette.primary.light,
                  "&:hover":{ backgroundColor:theme.palette.primary.main }}}>
            Add Item
          </Button>
        </Box>
      ) : (
        <Box ref={ref} onScroll={handleScroll}
          sx={{ display:"flex", gap:3, overflowX:"auto", pb:2,
                scrollbarWidth:"none", "&::-webkit-scrollbar":{display:"none"},
                msOverflowStyle:"none", scrollSnapType:"x mandatory" }}>
          {items.map(item=>(
            <Card key={item.guid_id} sx={{
              flex:"0 0 100%", width:"100%", height:380, position:"relative", borderRadius:2, overflow:"hidden",
              background: theme.palette.mode==="dark"
                ? "linear-gradient(to bottom, #121e34, #0e1726)" : "#F5F5F5",
              boxShadow:"0 4px 20px rgba(0,0,0,0.15)",
              transition:"all 0.3s ease",
              border:`1px solid ${alpha(theme.palette.common.white,0.1)}`,
              "&:hover":{ transform:"translateY(-4px)",
                boxShadow:`0 20px 30px -15px ${alpha(theme.palette.common.black,0.4)}`,
                border:`1px solid ${alpha(theme.palette.primary.main,0.3)}` },
              scrollSnapAlign:"start"
            }}>
              {/* left/upper image */}
              <Box sx={{ width:"70%", height:"100%", position:"relative", overflow:"hidden",
                         [theme.breakpoints.down("sm")]:{ width:"100%", height:"50%" } }}>
                {item.image ? (
                  <Box component="img" src={`http://localhost:5001/uploads/${item.image}`} alt={item.title}
                       sx={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                ) : (
                  <Box sx={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                             background:alpha(theme.palette.background.default,0.5) }}>
                    <PhotoIcon sx={{ fontSize:60, color:alpha(theme.palette.common.white,0.2) }}/>
                  </Box>
                )}
              </Box>

              {/* right/lower content */}
              <Box sx={{ width:"40%", display:"flex", flexDirection:"column", justifyContent:"center",
                         p:theme.spacing(4), position:"absolute", top:0, right:0, height:"100%",
                         background: theme.palette.mode==="dark"? "#1e2e4a":"#eaeef4",
                         [theme.breakpoints.down("sm")]:{ width:"100%", height:"50%", top:"50%", p:theme.spacing(2) }}}>
                <Typography variant={isSmall?"h6":"h5"} gutterBottom sx={{
                  fontWeight:700, lineHeight:1.2, display:"-webkit-box", WebkitLineClamp:2,
                  WebkitBoxOrient:"vertical", overflow:"hidden" }}>{item.title}</Typography>
                <Typography variant="body1" sx={{
                  fontWeight:300, lineHeight:1.6, mt:1, color:"text.secondary",
                  display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  {item.subTitle}
                </Typography>

                <Box sx={{ display:"flex", gap:2, mt:2, justifyContent:"center" }}>
                  <Button onClick={()=>onEdit(item)} startIcon={<EditIcon/>}
                          sx={{ backgroundColor:theme.palette.primary.light, color:"#fff", textTransform:"none",
                                fontSize:"0.9rem", minWidth:isSmall?"auto":100,
                                "&:hover":{ backgroundColor:theme.palette.primary.main }}}>
                    {isSmall? "": "Edit"}
                  </Button>
                  <Button onClick={()=>onDelete(item.guid_id)} startIcon={<DeleteIcon/>}
                          sx={{ backgroundColor:theme.palette.error.main, color:"#fff", textTransform:"none",
                                fontSize:"0.9rem", minWidth:isSmall?"auto":100,
                                "&:hover":{ backgroundColor:theme.palette.error.dark }}}>
                    {isSmall? "": "Delete"}
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
});

export default CarouselList;