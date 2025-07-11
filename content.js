(() => {
  console.log('[StreakExt] 🔥 content.js loaded');

  function init() {
    // Select all calendar-day cells with a data-date attribute
    const cells = document.querySelectorAll('.js-yearly-contributions .ContributionCalendar-day[data-date]');
    console.log('[StreakExt] found cells:', cells.length);
    if (!cells.length) return false;

    // Map to { date, contributed } and sort chronologically
    const days = Array.from(cells)
      .map(el => {
        const dateStr = el.getAttribute('data-date');
        const level = parseInt(el.getAttribute('data-level') || '0', 10);
        // treated as contributed if level > 0
        return { date: new Date(dateStr), contributed: level > 0 };
      })
      .sort((a, b) => a.date - b.date);

    // Compute longest streak
    let longest = 0, temp = 0;
    days.forEach(day => {
      if (day.contributed) {
        temp++;
        longest = Math.max(longest, temp);
      } else {
        temp = 0;
      }
    });

    // Compute current streak
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributed) current++;
      else break;
    }
    console.log(`[StreakExt] current: ${current}, longest: ${longest}`);

    // Locate header and insert streak banner
    const header = document.querySelector('.js-yearly-contributions h2');
    if (!header) {
      console.error('[StreakExt] header not found');
      return true;
    }

    const banner = document.createElement('div');
    banner.style.cssText = 'margin:8px 0;padding:4px 8px;background:#f6f8fa;border-radius:4px;font-size:14px;';
    banner.textContent = `Current streak: ${current} days | Longest streak: ${longest} days`;
    header.insertAdjacentElement('afterend', banner);
    console.log('[StreakExt] banner injected');
    return true;
  }

  // Keep retrying until the calendar loads
  (function retry() {
    if (!init()) {
      console.log('[StreakExt] retrying in 500ms');
      setTimeout(retry, 500);
    }
  })();
})();