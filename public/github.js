// Fetch GitHub stats
document.addEventListener('DOMContentLoaded', async () => {
    const username = 'SameerAliKhan-git';
    const apiBase = `https://api.github.com/users/${username}`;

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? '--';
    };

    try {
        const resp = await fetch(apiBase);
        if (!resp.ok) throw new Error('GitHub API error');
        const data = await resp.json();

        set('githubRepos', data.public_repos);
        set('githubFollowers', data.followers);
        
        // Add tooltip with update time
        const chart = document.getElementById('githubChart');
        if (chart) {
            chart.title = `GitHub Contributions (green) - Updated: ${new Date().toLocaleTimeString()}`;
        }
    } catch (e) {
        console.error('GitHub stats fetch failed:', e);
    }
});
