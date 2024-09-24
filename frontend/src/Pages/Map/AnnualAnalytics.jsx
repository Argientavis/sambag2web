import React, { useEffect, useState } from 'react';
import AnalyticsComponent from '../../Components/AnalyticsComponent';
import { Line } from 'react-chartjs-2';
import { database } from '../../Firebase';
import { ref, get } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, ChartDataLabels);

const AnnualAnalytics = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const reportRef = ref(database, 'reports');

    try {
      const reportSnapshot = await get(reportRef);
      const reportData = reportSnapshot.val();

      if (reportData) {
        const reportList = Object.values(reportData);
        const currentYear = new Date().getFullYear();

        const monthlyCounts = Array(12).fill().map(() => ({
          NOISE: 0,
          THIEF: 0,
          FIRE: 0,
        }));

        reportList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          const reportYear = reportDate.getFullYear();
          const reportMonth = reportDate.getMonth();

          if (reportYear === currentYear) {
            monthlyCounts[reportMonth][report.type] += 1;
          }
        });

        setData(monthlyCounts);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();

  const chartLabels = monthNames;
  const noiseCounts = data.map(month => month.NOISE);
  const thiefCounts = data.map(month => month.THIEF);
  const fireCounts = data.map(month => month.FIRE);

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
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      datalabels: {
        formatter: (value, context) => {
          const total = noiseCounts.reduce((a, b) => a + b, 0) +
                        thiefCounts.reduce((a, b) => a + b, 0) +
                        fireCounts.reduce((a, b) => a + b, 0);
          const percentage = total ? ((value / total) * 100).toFixed(2) + '%' : '0%';
          return percentage;
        },
        color: '#8F1213',
      },
    },
  };

  return (
    <div>
      <AnalyticsComponent />
      <div className='px-16 mt-4'>
        <h1 className='text-2xl font-bold'>Annual Report</h1>
        <h2 className='text-xl'>Monthly Breakdown for {currentYear}</h2>
      </div>
      <div className='mb-10' style={{ width: '100%', height: '300px', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AnnualAnalytics;
