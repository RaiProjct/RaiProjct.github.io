document.addEventListener('DOMContentLoaded', function () {
    function incrementDownloadCount() {
        let downloadCount = localStorage.getItem('downloadCount') || 0;
        downloadCount = parseInt(downloadCount) + 1;
        localStorage.setItem('downloadCount', downloadCount);
        updateDownloadCount();
    }

    function updateDownloadCount() {
        const downloadCount = localStorage.getItem('downloadCount') || 0;
        document.getElementById('download-count').innerText = downloadCount;
        updateChart();
    }

    function incrementVisitCount() {
        let visitCount = localStorage.getItem('visitCount') || 0;
        visitCount = parseInt(visitCount) + 1;
        localStorage.setItem('visitCount', visitCount);
        updateVisitCount();
        updateChart();
    }

    function updateVisitCount() {
        const visitCount = localStorage.getItem('visitCount') || 0;
        document.getElementById('visit-count').innerText = visitCount;
    }

    function updateChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        const downloadCounts = JSON.parse(localStorage.getItem('downloadCounts')) || [];
        const visitCounts = JSON.parse(localStorage.getItem('visitCounts')) || [];

        const currentDate = new Date().toLocaleDateString();

        if (downloadCounts.length === 0 || downloadCounts[downloadCounts.length - 1].date !== currentDate) {
            downloadCounts.push({ date: currentDate, count: 0 });
        }

        if (visitCounts.length === 0 || visitCounts[visitCounts.length - 1].date !== currentDate) {
            visitCounts.push({ date: currentDate, count: 0 });
        }

        downloadCounts[downloadCounts.length - 1].count++;
        visitCounts[visitCounts.length - 1].count++;

        localStorage.setItem('downloadCounts', JSON.stringify(downloadCounts));
        localStorage.setItem('visitCounts', JSON.stringify(visitCounts));

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: downloadCounts.map(entry => entry.date),
                datasets: [{
                    label: 'Downloads',
                    data: downloadCounts.map(entry => entry.count),
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                }, {
                    label: 'Visitas',
                    data: visitCounts.map(entry => entry.count),
                    fill: false,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        labels: downloadCounts.map(entry => entry.date)
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    incrementVisitCount();
    updateDownloadCount();

    document.getElementById('download-button').addEventListener('click', function () {
        incrementDownloadCount();
    });
});