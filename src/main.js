// 店舗情報は index.html に直接書きます。この JavaScript は表示の絞り込みだけを担当します。
const searchInput = document.querySelector('#shop-search');
const cards = [...document.querySelectorAll('.shop-card')];
const filterButtons = [...document.querySelectorAll('.filter-button')];
let selectedCategory = 'all';

// 全角・半角や英字の大文字・小文字を同じように検索します。
function normalize(text) {
  return text.normalize('NFKC').toLocaleLowerCase('ja').trim();
}

function filterShops() {
  const words = normalize(searchInput.value).split(/\s+/).filter(Boolean);
  let visibleCount = 0;

  for (const card of cards) {
    const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
    const text = ['h3', '.card-tagline', '.card-description']
      .map((selector) => card.querySelector(selector)?.textContent || '')
      .join(' ');
    const matchesSearch = words.every((word) => normalize(text).includes(word));
    card.hidden = !(matchesCategory && matchesSearch);
    if (!card.hidden) visibleCount += 1;
  }

  document.querySelector('#result-count').textContent = `${cards.length}店舗中 ${visibleCount}店舗`;
  document.querySelector('#no-results').hidden = visibleCount > 0;
  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.category === selectedCategory));
  }
}

for (const button of filterButtons) {
  button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    filterShops();
  });
}

searchInput.addEventListener('input', filterShops);
document.querySelector('#search-form').addEventListener('submit', (event) => event.preventDefault());
document.querySelector('#reset-search').addEventListener('click', () => {
  searchInput.value = '';
  selectedCategory = 'all';
  filterShops();
  searchInput.focus();
});

filterShops();

// 店舗カードの並び替え。カードは index.html にあるものを移動させるだけです。
const shopList = document.querySelector('#shop-list');
const sortSelect = document.querySelector('#shop-sort');

function sortShops() {
  const order = sortSelect.value;
  const sorted = [...cards];
  if (order !== 'default') {
    // 日本語として店名を比べます（濁点・長音・かな漢字の混在に対応）。
    sorted.sort((a, b) => {
      const nameA = a.querySelector('h3')?.textContent || '';
      const nameB = b.querySelector('h3')?.textContent || '';
      return nameA.localeCompare(nameB, 'ja');
    });
    if (order === 'name-desc') sorted.reverse();
  }
  for (const card of sorted) shopList.append(card);
}

sortSelect.addEventListener('change', sortShops);
