// File: content.js
(() => {
  console.log('[StreakExt] 🔥 content.js loaded');

  function computeAndInject() {
    const cells = document.querySelectorAll(
      '.js-yearly-contributions .ContributionCalendar-day[data-date]'
    );
    if (!cells.length) return;

    // Build sorted list of days
    const days = Array.from(cells)
      .map(el => ({
        dateStr: el.getAttribute('data-date'),
        contributed: parseInt(el.getAttribute('data-level') || '0', 10) > 0
      }))
      .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

    // Determine period
    const startDateStr = days[0].dateStr;
    const endDateStr = days[days.length - 1].dateStr;

    // Today's date string (UTC)
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentYear = todayStr.slice(0, 4);
    const endYear = endDateStr.slice(0, 4);
    // Show "Current streak" only when calendar ends today or later AND in the current year view
    const showCurrent = endDateStr >= todayStr && endYear === currentYear;

    // Calculate longest streak
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

    // Calculate ongoing streak only if within period
    let ongoing = 0;
    if (showCurrent) {
      for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].contributed) ongoing++;
        else break;
      }
    }

    // Locate header
    const header = document.querySelector('.js-yearly-contributions h2');
    if (!header) return;

    // Remove existing banner
    const existing = document.getElementById('streak-banner');
    if (existing) existing.remove();

    // Create banner
    const banner = document.createElement('div');
    banner.id = 'streak-banner';
    banner.style.cssText =
      'margin:8px 0;padding:6px 12px;background:#f6f8fa;border-radius:4px;font-size:14px;';

        // Build inner HTML conditionally with proper singular/plural
    const ongoingLabel = ongoing === 1 ? 'day' : 'days';
    const longestLabel = longest === 1 ? 'day' : 'days';
    let html = `<div><strong>Period:</strong> ${startDateStr} &ndash; ${endDateStr}</div>`;
    if (showCurrent) {
      html += `<div><strong>Current streak:</strong> ${ongoing} ${ongoingLabel} &nbsp;|&nbsp;<strong>Longest streak:</strong> ${longest} ${longestLabel}</div>`;
    } else {
      html += `<div><strong>Longest streak:</strong> ${longest} ${longestLabel}</div>`;
    }
    banner.innerHTML = html;

    header.insertAdjacentElement('afterend', banner);
  }

  // Debounced observer
  let timeoutId;
  const observer = new MutationObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(computeAndInject, 300);
  });

  // Observe relevant subtree
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run
  computeAndInject();
})();
