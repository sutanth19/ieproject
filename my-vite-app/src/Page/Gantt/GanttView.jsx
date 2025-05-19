// src/components/MyGanttComponent.jsx
import React, { useRef, useEffect, useState } from "react";
import { Gantt, Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import "../Css/Global.css";
import api from "./../../services/api";
import GanttToolbar from "./GanttToolbar"; 

const IconStyleLoader = () => {
  useEffect(() => {
    const href = "https://cdn.svar.dev/fonts/wxi/wx-icons.css";
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);
  return null;
};

const MyGanttComponent = () => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("100vh");
  const [rawTasks, setRawTasks] = useState([]);
  const [rawLinks, setRawLinks] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(2);
  const maxZoomLevel = 6;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    const isDarkMode = document.body.classList.contains('dark-mode') || 
                      localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);


  useEffect(() => {
    const defaultStartDate = "2025-04-01T00:00:00Z";
    const defaultEndDate = "2025-12-31T23:59:59Z";
    
    const params = {
      startDatetime: startDate || defaultStartDate,
      endDatetime: endDate || defaultEndDate,
    };

    api
      .get("/api/project", { params })
      .then((res) => {
        const data = res.data;
        setRawTasks(data.digitalProject || []);
        setRawLinks(data.digitalProjectLink || []);
      })
      .catch((err) => {
        console.error("Failed to load Gantt data:", err);
      });
  }, [startDate, endDate]); 

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const vh = window.innerHeight;
        const navBarHeight = document.querySelector('.appBar')?.offsetHeight || 64; 
        const top = containerRef.current.getBoundingClientRect().top;
        setContainerHeight(`${Math.max(400, vh - top - 20)}px`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const tasks = rawTasks.map((item) => {
    const start = new Date(item.startDatetime);
    const end = new Date(item.endDatetime);
    const duration =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;

    return {
      id: parseInt(item.id, 10),
      parent: item.parentId !== "0" ? parseInt(item.parentId, 10) : null,
      text: item.text,
      start,
      duration,
      progress: item.progress,
      type: item.taskType,
    };
  });


  const links = rawLinks
    .map((lnk, idx) => {
      const src = rawTasks.find((t) => t.guid === lnk.sourceId);
      const tgt = rawTasks.find((t) => t.guid === lnk.targetId);
      if (!src || !tgt) return null;
      return {
        id: idx + 1,
        source: parseInt(src.id, 10),
        target: parseInt(tgt.id, 10),
        type: lnk.linkType, 
      };
    })
    .filter(Boolean);

  const taskTypes = [
    { id: "task", label: "Task" },
    { id: "summary", label: "Summary" },
    { id: "milestone", label: "Milestone" },
    { id: "urgent", label: "Urgent" },
    { id: "narrow", label: "Narrow" },
    { id: "progress", label: "Progress" },
    { id: "round", label: "Rounded" },
  ];


  const getScalesForZoomLevel = (level) => {
    switch (level) {
      case 0:
        return [
          { unit: "year", step: 1, format: "yyyy" },
          { unit: "month", step: 3, format: "Q[Q]" }
        ];
      case 1:
        return [
          { unit: "year", step: 1, format: "yyyy" },
          { unit: "month", step: 1, format: "MMM" }
        ];
      case 2: 
        return [
          { unit: "month", step: 1, format: "MMMM yyyy" },
          { unit: "week", step: 1, format: "w" }
        ];
      case 3: 
        return [
          { unit: "month", step: 1, format: "MMMM yyyy" },
          { unit: "day", step: 1, format: "d" }
        ];
      case 4: 
        return [
          { unit: "week", step: 1, format: "'Week' w" },
          { unit: "day", step: 1, format: "EEE d" }
        ];
      case 5: 
        return [
          { unit: "day", step: 1, format: "EEE, MMM d" },
          { unit: "hour", step: 12, format: "ha" }
        ];
      case 6:
        return [
          { unit: "day", step: 1, format: "EEE, MMM d" },
          { unit: "hour", step: 6, format: "ha" }
        ];
      default:
        return [
          { unit: "month", step: 1, format: "MMMM yyyy" },
          { unit: "day", step: 1, format: "d" }
        ];
    }
  };


  const handleZoomIn = () => {
    if (zoomLevel < maxZoomLevel) {
      setZoomLevel(zoomLevel + 1);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  };
  
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleFilterReset = () => {
    setStartDate("");
    setEndDate("");
  };

 
  const containerStyle = {
    marginTop: "70px",
    width: "100%",
    height: containerHeight,
    display: "flex",
    flexDirection: "column",
    position: "relative", 
    zIndex: 5, 
    padding: 0,
    overflow: "hidden",
  };
  
  const ganttWrapperStyle = {
    flex: "1 1 auto",
    minHeight: 0,
    overflow: "hidden",
  };

  const scales = getScalesForZoomLevel(zoomLevel);

  return (
    <>
      <IconStyleLoader />
      <div style={containerStyle} ref={containerRef}>
        <GanttToolbar
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          currentZoomLevel={zoomLevel}
          maxZoomLevel={maxZoomLevel}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onFilterReset={handleFilterReset}
          darkMode={darkMode}
          
        />
        <Willow style={ganttWrapperStyle}>
          <Gantt
            tasks={tasks}
            links={links}
            scales={scales}
            taskTypes={taskTypes}
          />
        </Willow>
      </div>
    </>
  );
};

export default MyGanttComponent;