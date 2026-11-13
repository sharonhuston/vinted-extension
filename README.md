# Vinted Load & Sort

A small Chrome/Edge extension for Vinted list pages (for example your Favorited Items). One click:

1. **Loads everything.** It keeps scrolling the lazy-loading list until no more items appear.
2. **Sorts the items.** Sold items come first, then all other items by price, lowest to highest.

## Install

1. Download or clone this repository.
2. Open `chrome://extensions` (or `edge://extensions`) and turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Use

Open a Vinted list page, such as `vinted.com/member/items/favourite_list`, and click the extension's toolbar button. A banner in the top-right corner shows progress, then how many items were sorted.

## Notes

- Sold items keep Vinted's original order. **Reserved** items are not counted as sold, so they're sorted by price with the rest.
- Sorting uses the listed price, not the total including Vinted's fee.
- Sold items are found by the English "Sold" label, so other Vinted languages need that word added in `content.js`.
- The new order is only on your screen. It resets when the page reloads, or when Vinted redraws the list. Click the button again to re-sort.
- The extension only gets access to a tab when you click its button (`activeTab`). It collects no data and makes no network requests of its own.
