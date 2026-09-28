(() => {
  const log = document.querySelector('.activity-log');
  if (!log) return;
  const viewport = log.querySelector('.activity-window');
  const rows = [...log.querySelectorAll('.activity-list > li')];
  const more = log.querySelector('.activity-more');
  const end = log.querySelector('.activity-end');
  const status = log.querySelector('.activity-status');
  const batch = 5;
  let visible = Math.min(batch, rows.length);
  function render() {
    rows.forEach((row, index) => { row.hidden = index >= visible; });
    more.hidden = visible >= rows.length;
    end.hidden = !more.hidden;
    status.textContent = `${visible} of ${rows.length} changes`;
  }
  function loadMore() {
    const hadFocus = document.activeElement === more;
    const firstNew = rows[visible];
    visible = Math.min(visible + batch, rows.length);
    render();
    if (hadFocus && firstNew) {
      firstNew.tabIndex = -1;
      firstNew.focus({preventScroll: true});
      firstNew.scrollIntoView({block: 'nearest'});
    }
  }
  more.addEventListener('click', loadMore);
  // The log owns its scroll: it never captures wheel/touch or changes page position.
  viewport.addEventListener('scroll', () => {
    if (!more.hidden && viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 90) loadMore();
  }, {passive: true});
  render();
})();
