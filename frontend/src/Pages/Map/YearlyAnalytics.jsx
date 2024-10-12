import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { database } from '../../Firebase';
import { ref, get } from 'firebase/database';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import AnalyticsComponent from '../../Components/AnalyticsComponent';
import fire from '../../assets/fire.png';
import thief from '../../assets/thief.png';
import noise from '../../assets/noise.png';
import accident from '../../assets/accident.png';
import others from '../../assets/others.png';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const YearlyAnalytics = () => {
  const [data, setData] = useState([]);
  const [currentYear, setCurrentYear] = useState(2024);
  const [totalReports, setTotalReports] = useState(0);
  const [mostCommonReport, setMostCommonReport] = useState({ type: 'Noise', count: 0 });
  const [severityStats, setSeverityStats] = useState({ high: 0, medium: 0, low: 0 });
  const [resolutionStats, setResolutionStats] = useState({ resolved: 0, unresolved: 0 });

  const fetchData = async (year) => {
    const reportRef = ref(database, 'History');

    try {
      const reportSnapshot = await get(reportRef);
      const reportData = reportSnapshot.val();

      if (reportData) {
        const reportList = Object.values(reportData);
        let totalCount = 0;
        let noiseCount = 0, theftCount = 0, fireCount = 0, accidentCount = 0;
        let resolvedCount = 0, unresolvedCount = 0;
        let highSeverityCount = 0, mediumSeverityCount = 0, lowSeverityCount = 0;

        reportList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          const reportYear = reportDate.getFullYear();
          
          if (reportYear === year) {
            totalCount++;  // Total report count

            // Count types of incidents
            if (report.type === 'NOISE') noiseCount++;
            else if (report.type === 'THIEF') theftCount++;
            else if (report.type === 'FIRE') fireCount++;
            else if (report.type === 'ACCIDENT') accidentCount++;

            // Check the success field for resolution status
            if (report.success === 'Yes') {
              resolvedCount++;  // Count as resolved if success is "Yes"
            } else {
              unresolvedCount++;  // Otherwise count as unresolved
            }

            // Incident severity
            if (report.severity === 'HIGH') highSeverityCount++;
            else if (report.severity === 'MEDIUM') mediumSeverityCount++;
            else if (report.severity === 'LOW') lowSeverityCount++;
          }
        });

        setTotalReports(totalCount);

        // Most common report
        const mostCommon = Math.max(noiseCount, theftCount, fireCount, accidentCount);
        if (mostCommon === noiseCount) setMostCommonReport({ type: 'Noise', count: noiseCount });
        else if (mostCommon === theftCount) setMostCommonReport({ type: 'Thief', count: theftCount });
        else if (mostCommon === fireCount) setMostCommonReport({ type: 'Fire', count: fireCount });
        else setMostCommonReport({ type: 'Accident', count: accidentCount });

        // Set severity and resolution stats
        setSeverityStats({ high: highSeverityCount, medium: mediumSeverityCount, low: lowSeverityCount });
        setResolutionStats({ resolved: resolvedCount, unresolved: unresolvedCount });

        // Yearly data for the line chart
        const noiseCounts = [], thiefCounts = [], fireCounts = [], accidentCounts = [];
        for (let month = 0; month < 12; month++) {
          const monthlyReports = reportList.filter(r => new Date(r.timestamp).getMonth() === month && new Date(r.timestamp).getFullYear() === year);
          noiseCounts.push(monthlyReports.filter(r => r.type === 'NOISE').length);
          thiefCounts.push(monthlyReports.filter(r => r.type === 'THIEF').length);
          fireCounts.push(monthlyReports.filter(r => r.type === 'FIRE').length);
          accidentCounts.push(monthlyReports.filter(r => r.type === 'ACCIDENT').length);
        }

        setData({
          noiseCounts,
          thiefCounts,
          fireCounts,
          accidentCounts,
        });
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData(currentYear);
  }, [currentYear]);

  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value, 10));
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
      {
        label: 'Accident',
        data: data.accidentCounts || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Map report types to corresponding icons
  const getIncidentImage = (type) => {
    const normalizedType = type.trim().toUpperCase(); 

    if (normalizedType === 'FIRE') return fire;
    if (normalizedType === 'THIEF') return thief;
    if (normalizedType === 'NOISE') return noise;
    if (normalizedType === 'ACCIDENT') return accident;
    return others; // Default to 'OTHERS' if no match
  };

  const severityPieData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [severityStats.high, severityStats.medium, severityStats.low],
      backgroundColor: ['#FF0000', '#FFA500', '#FFFF00'],
    }]
  };

  const resolutionPieData = {
    labels: ['Resolved', 'Unresolved'],
    datasets: [{
      data: [resolutionStats.resolved, resolutionStats.unresolved],
      backgroundColor: ['#4CAF50', '#F44336'],
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,  // Disable the built-in legend so we can create custom labels
      },
    },
  };

  return (
    <div>
      <AnalyticsComponent />
      <div className="px-16 mt-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-4">Yearly Report</h1>
          <label htmlFor="year" className="text-lg mr-2">Select Year:</label>
          <select id="year" value={currentYear} onChange={handleYearChange} className="border p-2 rounded">
            {Array.from({ length: 11 }, (_, i) => 2024 + i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Line Chart */}
      <div className="mb-10" style={{ width: '100%', height: '300px', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <Line data={chartData} options={pieOptions} />
      </div>

      {/* Summary Cards */}
      <div className="flex justify-around mt-8">
        {/* Total Reports */}
        <div className="bg-[#8A252C] text-white p-6 rounded-lg shadow-md text-center w-[200px] h-[120px]">
          <h2 className="text-lg font-bold">Total Reports</h2>
          <p className="text-4xl font-bold">{totalReports}</p>
        </div>

        {/* Most Common Report */}
        <div className="bg-white text-black p-6 rounded-lg shadow-md text-center w-[300px] h-[150px] flex flex-col justify-center items-center">
          <h2 className="text-sm font-bold">MOST COMMON REPORT</h2>
          <div className="flex items-center mt-2">
            <img src={getIncidentImage(mostCommonReport.type)} alt={mostCommonReport.type} className="w-12 h-12 mr-4" />
            <div className="text-left">
              <p className="text-4xl font-bold">{mostCommonReport.count}</p>
              <p className="text-sm">Reports</p>
            </div>
          </div>
          <div className="mt-2 bg-[#8A252C] text-white font-bold text-xs px-4 py-1 rounded">
            {mostCommonReport.type.toUpperCase()}
          </div>
        </div>

        {/* Incident Severity */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-[250px] h-[150px]">
          <h2 className="text-lg font-bold">Incident Severity</h2>
          <Pie data={severityPieData} options={pieOptions} />
        </div>

        {/* Resolution Status */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-[250px] h-[150px]">
          <h2 className="text-lg font-bold mb-4">Resolution Status</h2>

          {/* Label Section with Flex */}
          <div className="flex justify-center items-center mb-4">
            {/* Resolved Label */}
            <div className="flex items-center mr-6">
              <div className="w-3 h-3 bg-green-500 mr-2"></div>
              <p className="text-sm">Resolved</p>
            </div>

            {/* Unresolved Label */}
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-2"></div>
              <p className="text-sm">Unresolved</p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex justify-center items-center">
            <div className="w-[100px] h-[40px]">
              <Pie data={resolutionPieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyAnalytics;
