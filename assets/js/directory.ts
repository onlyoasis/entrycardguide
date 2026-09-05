// 仅过滤构建时输出的目录行；不发请求，不写入 HTML。
(() => {
  const directory = document.querySelector<HTMLElement>('[data-directory]');
  if (!directory) return;

  const search = directory.querySelector<HTMLInputElement>('[data-directory-search]')!;
  const fee = directory.querySelector<HTMLSelectElement>('[data-directory-fee]')!;
  const reset = directory.querySelector<HTMLButtonElement>('[data-directory-reset]')!;
  const controls = directory.querySelector<HTMLElement>('[data-directory-controls]')!;
  const status = directory.querySelector<HTMLElement>('[data-directory-status]')!;
  const empty = directory.querySelector<HTMLElement>('[data-directory-empty]')!;
  const rows = Array.from(directory.querySelectorAll<HTMLTableRowElement>('[data-directory-row]'));
  const entries = rows.map(row => ({ row, searchText: row.dataset.search!.toLowerCase() }));
  const countLabel = status.dataset.countLabel!;

  function filterRows(): void {
    const terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const { row, searchText } of entries) {
      const matches = (!fee.value || row.dataset.fee === fee.value)
        && terms.every(term => searchText.includes(term));
      row.hidden = !matches;
      if (matches) count++;
    }
    status.textContent = countLabel.replace('{count}', String(count)).replace('{total}', String(rows.length));
    empty.hidden = count > 0;
    reset.disabled = !search.value && !fee.value;
  }

  search.addEventListener('input', filterRows);
  fee.addEventListener('change', filterRows);
  reset.addEventListener('click', () => {
    search.value = '';
    fee.value = '';
    filterRows();
    search.focus();
  });

  filterRows();
  controls.hidden = false;
  status.hidden = false;
})();
