// VibeHall Portal App
// Dynamic integration with PolyMind API

const API_BASE = "https://polymind-production.up.railway.app";

async function updateStats() {
    try {
        // Fetch Accuracy Report
        const accuracyResp = await fetch(`${API_BASE}/accuracy-report`);
        if (accuracyResp.ok) {
            const data = await accuracyResp.json();
            document.getElementById('system-accuracy').innerText = `${Math.round(data.current_accuracy * 100)}%`;
            document.getElementById('network-status').innerText = data.status === "STABLE" ? "STABLE" : "BETA_TRACKING";
        }

        // Fetch Hot Markets for Ticker
        const marketResp = await fetch(`${API_BASE}/markets/hot?limit=5`);
        if (marketResp.ok) {
            const data = await marketResp.json();
            const ticker = document.querySelector('.ticker-data');

            if (data.markets && data.markets.length > 0) {
                document.getElementById('total-markets').innerText = data.count;

                const topMarket = data.markets[0];
                ticker.innerHTML = `🔥 <strong>${topMarket.question}</strong> | Volume: $${Math.round(topMarket.volume24hr).toLocaleString()}`;
            }
        }
    } catch (error) {
        console.error("VibeHall Link Offline:", error);
    }
}

// Initial update
updateStats();

// Refresh every 30 seconds
setInterval(updateStats, 30000);
