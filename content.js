// File: content.js
(() => {
    // Select all day elements in the contribution calendar
    const days = Array.from(document.querySelectorAll('rect.ContributionCalendar-day'))
      .map(el => ({
        date: new Date(el.getAttribute('data-date')),
        count: parseInt(el.getAttribute('data-count'), 10)
      }))
      .sort((a, b) => a.date - b.date);
  
    if (!days.length) return;
  
    // Calculate longest streak
    let longest = 0;
    let tempStreak = 0;
    days.forEach(day => {
      if (day.count > 0) {
        tempStreak++;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
  
    // Calculate current streak
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) current++;
      else break;
    }
  
    // Insert streak info into the page
    const container = document.querySelector('.js-yearly-contributions h2') || document.querySelector('.js-yearly-contributions');
    if (container) {
      const streakDiv = document.createElement('div');
      streakDiv.style.margin = '10px 0';
      streakDiv.style.fontSize = '14px';
      streakDiv.innerHTML = `
        <strong>Current Streak:</strong> ${current} days<br>
        <strong>Longest Streak:</strong> ${longest} days
      `;
      container.parentElement.insertBefore(streakDiv, container.nextSibling);
    }
  })();