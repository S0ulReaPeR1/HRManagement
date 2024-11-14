import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler, // Import Filler plugin
} from "chart.js";
import { React, useEffect, useRef } from "react";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler // Register Filler plugin
);

function PerformanceGraph({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const renderChart = () => {
      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Prepare the data for the chart
      const labels = data.map((entry) =>
        new Date(entry.review_date).toLocaleDateString()
      );
      const dataPoints = data.map((entry) => entry.score);

      // Create the new chart instance
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Performance Score",
              data: dataPoints,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              fill: true, // Enable fill with Filler plugin
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: "Review Date",
              },
            },
            y: {
              type: "linear",
              title: {
                display: true,
                text: "Score",
              },
              min: 0,
              max: 100,
            },
          },
          responsive: true,
          maintainAspectRatio: true,
        },
      });
    };

    // Render the chart whenever `data` changes
    if (data.length > 0) {
      renderChart();
    }

    // Cleanup chart instance on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
}

export default PerformanceGraph;
