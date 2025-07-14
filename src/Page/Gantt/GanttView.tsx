// src/components/MyGanttComponent.tsx
import React, { useRef, useEffect, useState } from "react";
import { Gantt, Willow } from "wx-react-gantt";
import "wx-react-gantt/dist/gantt.css";
import "../Css/Global.css";
import api from "../../services/api";
import GanttToolbar from "./GanttToolbar";

// Type definitions
interface RawTask {
  id: string;
  parentId: string;
  text: string;
  startDatetime: string;
  endDatetime: string;
  progress: number;
  taskType: string;
  guid: string;
}

interface RawLink {
  sourceId: string;
  targetId: string;
  linkType: string;
}

interface ProcessedTask {
  id: number;
  parent: number | null;
  text: string;
  start: Date;
  duration: number;
  progress: number;
  type: string;
}

interface ProcessedLink {
  id: number;
  source: number;
  target: number;
  type: string;
}

interface TaskType {
  id: string;
  label: string;
}

interface Scale {
  unit: string;
  step: number;
  format: string;
}

interface ApiResponse {
  digitalProject?: RawTask[];
  digitalProjectLink?: RawLink[];
}

interface ApiParams {
  startDatetime: string;
  endDatetime: string;
}

const IconStyleLoader: React.FC = () => {
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

const MyGanttComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string>("100vh");
  const [rawTasks, setRawTasks] = useState<RawTask[]>([]);
  const [rawLinks, setRawLinks] = useState<RawLink[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(2);
  const maxZoomLevel: number = 6;
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  useEffect(() => {
    const isDarkMode = document.body.classList.contains('dark-mode') || 
    localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    const defaultStartDate = "2025-04-01T00:00:00Z";
    const defaultEndDate = "2025-12-31T23:59:59Z";
    
    const params: ApiParams = {
      startDatetime: startDate || defaultStartDate,
      endDatetime: endDate || defaultEndDate,
    };

    api
      .get<ApiResponse>("/api/project", { params })
      .then((res) => {
        const data = res.data;
        setRawTasks(data.digitalProject || []);
        setRawLinks(data.digitalProjectLink || []);
      })
      .catch((err: Error) => {
        console.error("Failed to load Gantt data:", err);
      });
  }, [startDate, endDate]); 

  useEffect(() => {
    const updateHeight = (): void => {
      if (containerRef.current) {
        const vh = window.innerHeight;
        const navBarElement = document.querySelector('.appBar') as HTMLElement;
        const navBarHeight = navBarElement?.offsetHeight || 64; 
        const top = containerRef.current.getBoundingClientRect().top;
        setContainerHeight(`${Math.max(400, vh - top - 20)}px`);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const tasks: ProcessedTask[] = rawTasks.map((item: RawTask) => {
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

  const links: ProcessedLink[] = rawLinks
    .map((lnk: RawLink, idx: number) => {
      const src = rawTasks.find((t: RawTask) => t.guid === lnk.sourceId);
      const tgt = rawTasks.find((t: RawTask) => t.guid === lnk.targetId);
      if (!src || !tgt) return null;
      return {
        id: idx + 1,
        source: parseInt(src.id, 10),
        target: parseInt(tgt.id, 10),
        type: lnk.linkType, 
      };
    })
    .filter((link): link is ProcessedLink => link !== null);

  const taskTypes: TaskType[] = [
    { id: "task", label: "Task" },
    { id: "summary", label: "Summary" },
    { id: "milestone", label: "Milestone" },
    { id: "urgent", label: "Urgent" },
    { id: "narrow", label: "Narrow" },
    { id: "progress", label: "Progress" },
    { id: "round", label: "Rounded" },
  ];

  const getScalesForZoomLevel = (level: number): Scale[] => {
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

  const handleZoomIn = (): void => {
    if (zoomLevel < maxZoomLevel) {
      setZoomLevel(zoomLevel + 1);
    }
  };

  const handleZoomOut = (): void => {
    if (zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEndDate(e.target.value);
  };

  const handleFilterReset = (): void => {
    setStartDate("");
    setEndDate("");
  };

  const containerStyle: React.CSSProperties = {
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
  
  const ganttWrapperStyle: React.CSSProperties = {
    flex: "1 1 auto",
    minHeight: 0,
    overflow: "hidden",
  };

  const scales: Scale[] = getScalesForZoomLevel(zoomLevel);

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
        <div style={ganttWrapperStyle}>
          <Gantt
            tasks={tasks}
            links={links}
            scales={scales}
            taskTypes={taskTypes}
          />
        </div>
      </div>
    </>
  );
};

export default MyGanttComponent;