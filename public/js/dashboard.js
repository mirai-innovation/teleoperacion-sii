// Dashboard Chart Initialization
(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharts);
  } else {
    initCharts();
  }

  function initCharts() {
    // History Chart
    const historyChartEl = document.getElementById('historyChart');
    if (historyChartEl && typeof window.historyData !== 'undefined' && window.historyData.length > 0) {
      const historyCtx = historyChartEl.getContext('2d');
      const historyData = window.historyData;
      
      const datasets = historyData.map(robot => ({
        label: robot.robot,
        data: robot.data.map(d => d.duration || 0),
        borderColor: robot.color,
        backgroundColor: robot.color + '20',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: robot.color,
        pointBorderColor: '#121212',
        pointBorderWidth: 2
      }));
      
      new Chart(historyCtx, {
        type: 'line',
        data: {
          labels: Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
          }),
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          backgroundColor: 'transparent',
          plugins: {
            legend: {
              labels: { 
                color: '#fff',
                font: { family: 'Inter', size: 12 },
                padding: 12
              }
            },
            tooltip: {
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + ' min';
                }
              }
            }
          },
          scales: {
            x: { 
              ticks: { 
                color: '#B0B0B0',
                font: { family: 'JetBrains Mono', size: 11 }
              }, 
              grid: { 
                color: 'rgba(255,255,255,0.05)',
                drawBorder: false
              } 
            },
            y: { 
              ticks: { 
                color: '#B0B0B0',
                font: { family: 'JetBrains Mono', size: 11 }
              }, 
              grid: { 
                color: 'rgba(255,255,255,0.05)',
                drawBorder: false
              } 
            }
          }
        },
        plugins: [{
          id: 'glow',
          afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((dataset, i) => {
              const meta = chart.getDatasetMeta(i);
              ctx.save();
              ctx.strokeStyle = dataset.borderColor;
              ctx.lineWidth = 3;
              ctx.shadowColor = dataset.borderColor;
              ctx.shadowBlur = 15;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
              meta.data.forEach((point, index) => {
                if (index < meta.data.length - 1) {
                  const nextPoint = meta.data[index + 1];
                  ctx.beginPath();
                  ctx.moveTo(point.x, point.y);
                  ctx.lineTo(nextPoint.x, nextPoint.y);
                  ctx.stroke();
                }
              });
              ctx.restore();
            });
          }
        }]
      });
    }
    
    // Usage Chart
    const usageChartEl = document.getElementById('usageChart');
    if (usageChartEl && typeof window.chartData !== 'undefined' && window.chartData.length > 0) {
      const usageCtx = usageChartEl.getContext('2d');
      const usageData = window.chartData;
      
      new Chart(usageCtx, {
        type: 'doughnut',
        data: {
          labels: usageData.map(d => d.robot),
          datasets: [{
            data: usageData.map(d => d.minutes || 0),
            backgroundColor: usageData.map(d => d.color + 'CC'),
            borderColor: usageData.map(d => d.color),
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          backgroundColor: 'transparent',
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                color: '#fff',
                font: { family: 'Inter', size: 11 },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return label + ': ' + value + ' min (' + percentage + '%)';
                }
              }
            }
          }
        },
        plugins: [{
          id: 'glow',
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            const meta = chart.getDatasetMeta(0);
            ctx.save();
            meta.data.forEach((arc, index) => {
              const color = usageData[index].color;
              ctx.shadowColor = color;
              ctx.shadowBlur = 15;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;
              ctx.strokeStyle = color;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(arc.x, arc.y, arc.outerRadius, arc.startAngle, arc.endAngle);
              ctx.stroke();
            });
            ctx.restore();
          }
        }]
      });
    }
  }
})();

