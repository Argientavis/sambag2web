import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { database } from '../../Firebase';
import { ref, get } from 'firebase/database';
import AnalyticsComponent from '../../Components/AnalyticsComponent';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const MonthlyAnalytics = () => {
  const [data, setData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [totalReports, setTotalReports] = useState(0);
  const [resolvedReports, setResolvedReports] = useState(0);
  const [unresolvedReports, setUnresolvedReports] = useState(0);
  const [severityStats, setSeverityStats] = useState({ high: 0, medium: 0, low: 0 });
  const [reportStats, setReportStats] = useState({ fire: 0, theft: 0, noise: 0, accident: 0, others: 0 });
  const [history,setHistory] = useState(null);

  // Fetch report data from History node based on the selected month and year
  const fetchData = async (month, year) => {
    const historyRef = ref(database, 'History'); // Reference to the 'History' node
  
    try {
      const historySnapshot = await get(historyRef);
      const historyData = historySnapshot.val();
  
      if (historyData) {
        const historyList = Object.values(historyData);
        let fireCount = 0, theftCount = 0, noiseCount = 0, accidentCount = 0, othersCount = 0;
        let totalCount = 0;
        let resolvedCount = 0;
        let unresolvedCount = 0;
        let highSeverityCount = 0, mediumSeverityCount = 0, lowSeverityCount = 0;
  
        // Filter history reports by month and year
        historyList.forEach(report => {
          const reportDate = new Date(report.timestamp);
          if (reportDate.getMonth() === month && reportDate.getFullYear() === year) {
            totalCount++;  // Count the total number of reports for the month
  
            // Count types of incidents
            if (report.type === 'FIRE') fireCount++;
            else if (report.type === 'CRIME OR THIEF') theftCount++;
            else if (report.type === 'NOISE') noiseCount++;
            else if (report.type === 'ACCIDENT') accidentCount++;
            else othersCount++;  // Count for "OTHERS" if the type is not in the predefined categories
  
            // Count resolution status based on 'success' field
            if (report.success === "Yes") {
              resolvedCount++;  // Count as resolved if success is "Yes"
            } else {
              unresolvedCount++;  // Otherwise count as unresolved
            }
  
            // Count incident severity
            if (report.severity === 'HIGH') highSeverityCount++;
            else if (report.severity === 'MEDIUM') mediumSeverityCount++;
            else if (report.severity === 'LOW') lowSeverityCount++;
          }
        });
  
        // Update state with report statistics, including "OTHERS"
        setReportStats({ fire: fireCount, theft: theftCount, noise: noiseCount, accident: accidentCount, others: othersCount });
        setTotalReports(totalCount);
        setResolvedReports(resolvedCount);
        setUnresolvedReports(unresolvedCount);
        setSeverityStats({ high: highSeverityCount, medium: mediumSeverityCount, low: lowSeverityCount });
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  // Fetch data when the component mounts or when the selected month/year changes
  useEffect(() => {
    fetchData(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  // List of month names
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Handle month change event
  const handleMonthChange = (event) => {
    setCurrentMonth(parseInt(event.target.value, 10));
  };

  // Adjust the colors dynamically based on the number of reports
  const getSeverityColors = () => {
    const { high, medium, low } = severityStats;

    const highColor = high > 10 ? '#B20000' : '#FF0000';  // Darker red for many high reports
    const mediumColor = medium > 10 ? '#FF6600' : '#FF8000';  // Darker orange for many medium reports
    const lowColor = low > 10 ? '#FFE066' : '#FFFF66';  // Slightly darker yellow for many low reports

    return [highColor, mediumColor, lowColor];
  };

  // Bar chart data now includes "OTHERS"
  const barData = {
    labels: ['Fire', 'Crime or Theft', 'Noise', 'Accident', 'Others'],
    datasets: [{
      label: 'Total Reports',
      data: [reportStats.fire, reportStats.theft, reportStats.noise, reportStats.accident, reportStats.others],
      backgroundColor: [
        '#FF6384',  // Fire
        '#36A2EB',  // Crime or Theft
        '#FFCE56',  // Noise
        '#4BC0C0',  // Accident
        '#FF9F40',  // Others
      ],  // Different colors for each type
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Pie chart for resolution status based on fetched data
  const resolutionPieData = {
    labels: ['Resolved', 'Unresolved'],
    datasets: [{
      data: [resolvedReports, unresolvedReports],
      backgroundColor: ['#4C0000', '#FF0000'],  // Dark red for resolved, bright red for unresolved
    }]
  };

  // Pie chart for incident severity based on fetched data
  const severityPieData = {
    labels: ['High (10+ Reports)', 'Medium (6-10 Reports)', 'Low (1-5 Reports)'],
    datasets: [{
      data: [severityStats.high, severityStats.medium, severityStats.low],
      backgroundColor: getSeverityColors(),  // Dynamically generated colors based on report counts
    }]
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
      },
      datalabels: {
        color: 'white',
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total;
          const percentage = ((value / total) * 100).toFixed(0);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <div>
      <AnalyticsComponent/>
      <div className=" bg-[#F8F8F8] p-3">
        <div className="flex items-center ml-4 mt-0 ">
          <h1 className='text-2xl font-bold mr-4'>Monthly Report</h1>
          <label htmlFor="month" className="text-lg mr-2">Select Month:</label>
          <select
            id="month"
            value={currentMonth}
            onChange={handleMonthChange}
            className="border p-2 rounded"
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>
        
        <div className="flex mt-8">
          <div className="flex-1 pr-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-500 mt-2 ml-4 font-bold">Reports for {monthNames[currentMonth]} {currentYear}</p>
              <div className="w-full h-[500px] overflow-auto">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>

          <div className="w-[350px] flex flex-col space-y-6">
            <div className="bg-[#8A252C] text-white p-2 rounded-lg shadow-md text-center flex flex-col justify-center items-center w-[350px] h-[110px]">
              <h2 className="text-sm font-bold tracking-wider">TOTAL OF REPORTS</h2>
              <p className="text-6xl font-bold mt-2">{totalReports}</p>
            </div>

            <div className="h-[200px] w-[300] bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-4">Resolution Status</h2>
              <Pie data={resolutionPieData} options={pieOptions} />
            </div>

            <div className="h-[220px] bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-4">Incident Severity</h2>
              <Pie data={severityPieData} options={pieOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAnalytics;
