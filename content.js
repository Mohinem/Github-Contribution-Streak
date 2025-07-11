(() => {
  console.log('[StreakExt] 🔥 content.js loaded');

  function init() {
    // Grab all calendar cells with data-date
    const cells = document.querySelectorAll(
      '.js-yearly-contributions .ContributionCalendar-day[data-date]'
    );
    console.log('[StreakExt] found cells:', cells.length);
    if (!cells.length) return false;

    // Build sorted array of {dateStr, contributed}
    const days = Array.from(cells)
      .map(el => ({
        dateStr: el.getAttribute('data-date'),
        contributed: parseInt(el.getAttribute('data-level') || '0', 10) > 0
      }))
      .sort((a, b) => (a.dateStr < b.dateStr ? -1 : 1));

    // Dynamically determine the range from the calendar
    const startDateStr = days[0].dateStr;
    const endDateStr = days[days.length - 1].dateStr;
    console.log(`[StreakExt] period: ${startDateStr} – ${endDateStr}`);

    // Compute longest streak
    let longest = 0;
    let temp = 0;
    days.forEach(day => {
      if (day.contributed) {
        temp++;
        longest = Math.max(longest, temp);
      } else {
        temp = 0;
      }
    });

    // Compute current (ending) streak
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributed) current++;
      else break;
    }
    console.log(`[StreakExt] current: ${current}, longest: ${longest}`);

    // Insert or update banner beneath the calendar header
    const header = document.querySelector('.js-yearly-contributions h2');
    if (!header) {
      console.error('[StreakExt] header not found');
      return true;
    }
    const existing = document.getElementById('streak-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'streak-banner';
    banner.style.cssText =
      'margin:8px 0;padding:6px 12px;background:#f6f8fa;border-radius:4px;font-size:14px;';
    banner.innerHTML = `
      <div><strong>Period:</strong> ${startDateStr} &ndash; ${endDateStr}</div>
      <div><strong>Current streak:</strong> ${current} days &nbsp;|&nbsp;<strong>Longest streak:</strong> ${longest} days</div>
    `;
    header.insertAdjacentElement('afterend', banner);
    console.log('[StreakExt] banner injected');

    return true;
  }

  // Poll until the calendar SVG has fully loaded
  (function retry() {
    if (!init()) {
      console.log('[StreakExt] retrying in 500ms');
      setTimeout(retry, 500);
    }
  })();
})();