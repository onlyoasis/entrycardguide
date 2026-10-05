// 仅过滤构建时输出的资料库目录行；不发请求，不写入 HTML。
(() => {
  const library = document.querySelector<HTMLElement>('[data-library]');
  if (!library) return;

  const search = library.querySelector<HTMLInputElement>('[data-library-search]')!;
  const region = library.querySelector<HTMLSelectElement>('[data-library-region]')!;
  const status = library.querySelector<HTMLSelectElement>('[data-library-status]')!;
  const reset = library.querySelector<HTMLButtonElement>('[data-library-reset]')!;
  const controls = library.querySelector<HTMLElement>('[data-library-controls]')!;
  const statusLine = library.querySelector<HTMLElement>('[data-library-count]')!;
  const empty = library.querySelector<HTMLElement>('[data-library-empty]')!;
  const rows = Array.from(library.querySelectorAll<HTMLTableRowElement>('[data-library-row]'));
  const entries = rows.map(row => ({ row, searchText: row.dataset.search!.toLowerCase() }));
  const countLabel = statusLine.dataset.countLabel!;

  function filterRows(): void {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const { row, searchText } of entries) {
      const matches = (!region.value || row.dataset.region === region.value)
        && (!status.value || row.dataset.status === status.value)
        && terms.every(term => searchText.includes(term));
      row.hidden = !matches;
      if (matches) count++;
    }
    statusLine.textContent = countLabel.replace('{count}', String(count)).replace('{total}', String(rows.length));
    empty.hidden = count > 0;
    reset.disabled = !search.value && !region.value && !status.value;
  }

  search.addEventListener('input', filterRows);
  region.addEventListener('change', filterRows);
  status.addEventListener('change', filterRows);
  reset.addEventListener('click', () => {
    search.value = '';
    region.value = '';
    status.value = '';
    filterRows();
    search.focus();
  });

  filterRows();
  // Clear the inline display:none set in the markup — the .flex utility
  // beats the [hidden] attribute, so the attribute alone would leak dead
  // controls on no-JS browsers.
  controls.style.display = '';
  statusLine.style.display = '';
})();
