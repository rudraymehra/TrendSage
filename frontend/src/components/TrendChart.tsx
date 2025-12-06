'use client';

import { useEffect, useRef } from 'react';
import type { ChartDataPoint } from '@/types';

interface TrendChartProps {
  data: ChartDataPoint[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get computed styles for dark mode support
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Chart dimensions
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate scales
    const maxValue = Math.max(...data.map((d) => d.publications)) * 1.1;
    const minValue = 0;

    const xScale = (index: number) =>
      padding.left + (index / (data.length - 1)) * chartWidth;
    const yScale = (value: number) =>
      padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

    // Colors
    const primaryColor = isDarkMode ? '#818cf8' : '#6366f1';
    const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
    const textColor = isDarkMode ? '#9ca3af' : '#6b7280';
    const gradientStart = isDarkMode ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.2)';
    const gradientEnd = isDarkMode ? 'rgba(129, 140, 248, 0)' : 'rgba(99, 102, 241, 0)';

    // Draw grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Y-axis grid lines
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const y = padding.top + (i / yTicks) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(rect.width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const value = Math.round(maxValue - (i / yTicks) * (maxValue - minValue));
      ctx.fillStyle = textColor;
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(value.toString(), padding.left - 8, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    data.forEach((point, index) => {
      const x = xScale(index);
      ctx.fillStyle = textColor;
      ctx.fillText(point.year.toString(), x, rect.height - 10);
    });

    // Draw gradient area under line
    const gradient = ctx.createLinearGradient(0, padding.top, 0, rect.height - padding.bottom);
    gradient.addColorStop(0, gradientStart);
    gradient.addColorStop(1, gradientEnd);

    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(data[0].publications));
    data.forEach((point, index) => {
      ctx.lineTo(xScale(index), yScale(point.publications));
    });
    ctx.lineTo(xScale(data.length - 1), rect.height - padding.bottom);
    ctx.lineTo(xScale(0), rect.height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.moveTo(xScale(0), yScale(data[0].publications));
    data.forEach((point, index) => {
      ctx.lineTo(xScale(index), yScale(point.publications));
    });
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw points
    data.forEach((point, index) => {
      const x = xScale(index);
      const y = yScale(point.publications);

      // Outer circle
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = isDarkMode ? '#1f2937' : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner circle
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();
    });

  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400">
        No chart data available
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-48"
        style={{ width: '100%', height: '192px' }}
      />
      <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
        Publications per year
      </div>
    </div>
  );
}
