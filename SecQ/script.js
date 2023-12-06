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
        const downloadCount = localStorage.getItem('downloadCount') || 0;
        const visitCount = localStorage.getItem('visitCount') || 0;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Downloads', 'Visitas'],
                datasets: [{
                    label: 'Contadores',
                    data: [downloadCount, visitCount],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
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