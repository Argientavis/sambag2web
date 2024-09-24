import React, { useEffect, useState } from 'react';
import AnalyticsComponent from '../../Components/AnalyticsComponent';
import { Line } from 'react-chartjs-2';
import { database } from '../../Firebase';
import { ref, get } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ChartDataLabels);

const MonthlyAnalytics = () => {
  const [data, setData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState(0);

  const fetchData = async () => {
    const reportRef = ref(database, 'led/reports');

    try {
      const reportSnapshot = await get(reportRef);
      const reportData = reportSnapshot.val();

      if (reportData) {
        const reportList = Object.values(reportData);
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        
        setCurrentMonth(month);
        setCurrentYear(year);

        const dailyCounts = Array(31).fill(0).map(() => ({ NOISE: 0, THIEF: 0, FIRE: 0, ACCIDENT: 0 }));

        reportList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          const reportDay = reportDate.getDate() - 1; // 0-indexed for array
          
          if (reportDate.getMonth() === month && reportDate.getFullYear() === year) {
            dailyCounts[reportDay][report.type] += 1;
          }
        });

        setData(dailyCounts);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const chartLabels = Array.from({ length: 31 }, (_, i) => i + 1); // Days of the month
  const noiseCounts = data.map(day => day.NOISE);
  const thiefCounts = data.map(day => day.THIEF);
  const fireCounts = data.map(day => day.FIRE);
  const accidentCounts = data.map(day => day.ACCIDENT);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Noise',
        data: noiseCounts,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Thief',
        data: thiefCounts,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Fire',
        data: fireCounts,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Accident',
        data: accidentCounts,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div>
      <AnalyticsComponent />
      <div className='px-16 mt-4'>
        <h1 className='text-2xl font-bold'>Monthly Report</h1>
        <h2 className='text-xl'>Daily breakdown for {monthNames[currentMonth]} {currentYear}</h2>
      </div>
      <div className='mb-10' style={{ width: '100%', height: '500px', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyAnalytics;
