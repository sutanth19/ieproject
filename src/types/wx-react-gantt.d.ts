declare module 'wx-react-gantt' {
  import { ComponentType, CSSProperties } from 'react';

  interface Task {
    id: number;
    text: string;
    start: Date;
    duration: number;
    progress?: number;
    parent?: number | null;
    type?: string;
  }

  interface Link {
    id: number;
    source: number;
    target: number;
    type: string;
  }

  interface Scale {
    unit: string;
    step: number;
    format: string;
  }

  interface GanttProps {
    tasks: Task[];
    links?: Link[];
    scales?: Scale[];
    taskTypes?: { id: string; label: string }[];
    [key: string]: any;
  }

  export const Gantt: ComponentType<GanttProps>;
  export const Willow: ComponentType<{ style?: CSSProperties }>;
}
