import React, { useEffect, useState } from 'react';
import AnalyticsComponent from '../../Components/AnalyticsComponent';
import { Line } from 'react-chartjs-2';
import { database } from '../../Firebase';
import { ref, get } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const YearlyAnalytics = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const reportRef = ref(database, 'reports');

    try {
      const reportSnapshot = await get(reportRef);
      const reportData = reportSnapshot.val();

      if (reportData) {
        const reportList = Object.values(reportData);
        const yearlyCounts = {};

        reportList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          const reportYear = reportDate.getFullYear();
          
          // Count reports for years 2024-2034
          if (reportYear >= 2024 && reportYear <= 2034) {
            yearlyCounts[reportYear] = yearlyCounts[reportYear] || { NOISE: 0, THIEF: 0, FIRE: 0 };
            yearlyCounts[reportYear][report.type] += 1;
          }
        });

        // Prepare data for chart
        const years = [];
        const noiseCounts = [];
        const thiefCounts = [];
        const fireCounts = [];
        
        for (let year = 2024; year <= 2034; year++) {
          years.push(year);
          const counts = yearlyCounts[year] || { NOISE: 0, THIEF: 0, FIRE: 0 };
          noiseCounts.push(counts.NOISE);
          thiefCounts.push(counts.THIEF);
          fireCounts.push(counts.FIRE);
        }

        setData({
          years,
          noiseCounts,
          thiefCounts,
          fireCounts,
        });
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = {
    labels: data.years || [],
    datasets: [
      {
        label: 'Noise',
        data: data.noiseCounts || [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Thief',
        data: data.thiefCounts || [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Fire',
        data: data.fireCounts || [],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
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
        <h1 className='text-2xl font-bold'>Yearly Report</h1>
      </div>
      <div className='mb-10' style={{ width: '100%', height: '300px', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default YearlyAnalytics;
