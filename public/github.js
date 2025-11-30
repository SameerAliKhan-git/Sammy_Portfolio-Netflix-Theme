document.addEventListener('DOMContentLoaded', async () => {
    console.log('github.js v2.3 loaded');

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) {
            // console.log(`Setting ${id} to ${value}`);
            el.textContent = value ?? '--';
        }
    };

    const container = document.getElementById('github-calendar-graph');

    try {
        // 1. Fetch Summary Stats (Repos, Followers) from our server
        // This also returns a 'contributions' count based on recent events
        console.log('Fetching /api/github-stats...');
        const statsResp = await fetch('/api/github-stats');
        let serverContribs = 0;
        
        if (statsResp.ok) {
            const statsData = await statsResp.json();
            console.log('Stats data received:', statsData);
            set('githubRepos', statsData.repos);
            set('githubFollowers', statsData.followers);
            
            // Use server-side calculated contributions as a fallback/initial value
            serverContribs = statsData.contributions;
            set('githubContribs', serverContribs);
        } else {
            console.warn('Stats API failed:', statsResp.status);
        }

        // 2. Fetch Contribution Data (Last Year) for the Calendar
        console.log('Fetching calendar data...');
        const calendarResp = await fetch('https://github-contributions-api.jogruber.de/v4/SameerAliKhan-git?y=last');
        
        if (!calendarResp.ok) {
            throw new Error(`Calendar API error: ${calendarResp.status}`);
        }
        
        const calendarData = await calendarResp.json();
        console.log('Calendar data received:', calendarData);
        
        // Update total contributions count if available
        if (calendarData.total && (calendarData.total.lastYear !== undefined)) {
            const total = calendarData.total.lastYear;
            console.log(`Updating contributions to ${total} from calendar API`);
            set('githubContribs', total);
        } else {
            console.warn('No lastYear total in calendar data, keeping server value');
        }

        // 3. Render Calendar
        if (container) {
            container.innerHTML = ''; // Clear loading state
            
            const grid = document.createElement('div');
            grid.className = 'calendar-grid';
            
            // The API returns contributions array.
            if (calendarData.contributions && Array.isArray(calendarData.contributions)) {
                calendarData.contributions.forEach(day => {
                    const dayEl = document.createElement('div');
                    dayEl.className = `calendar-day level-${day.level}`;
                    
                    // Tooltip
                    const tooltip = document.createElement('div');
                    tooltip.className = 'calendar-tooltip';
                    const date = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    tooltip.textContent = `${day.count} contributions on ${date}`;
                    
                    dayEl.appendChild(tooltip);
                    grid.appendChild(dayEl);
                });
                container.appendChild(grid);
            } else {
                container.innerHTML = '<div style="color: #E50914; padding: 20px;">No contribution data available to render.</div>';
            }
        }

    } catch (e) {
        console.error('GitHub fetch failed:', e);
        if (container) {
            container.innerHTML = '<div style="color: #E50914; padding: 20px;">Failed to load GitHub data. Please try again later.</div>';
        }
    }
});
