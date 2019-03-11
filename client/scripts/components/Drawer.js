import { $ } from "scripts/utilities";
import ExplanationTab from "scripts/tabs/ExplanationTab";
import FavoritesTab from "scripts/tabs/FavoritesTab";

class Drawer {
  constructor(el) {
    this.el = $(el);
    this.tabsEl = this.el.querySelector(".apod__drawer-tabs");
    this.tabs = [];
    this.isOpen = false;
    this.currentTabIdx;
    this.createDefaultTabs();
    document.addEventListener("keydown", e => {
      if (e.which === 27 && this.isOpen) {
        this.closeDrawer();
      }
    });
  }

  createDefaultTabs() {
    new ExplanationTab("#tab-explanation", this);
    new FavoritesTab("#tab-favorites", this);
  }

  resetTabs() {
    this.closeDrawer();
    this.currentTabIdx = null;
    this.tabs = this.tabs.slice(0, 2);
  }

  openDrawer() {
    this.el.classList.add("show");
    this.isOpen = true;
  }

  closeDrawer() {
    this.el.classList.remove("show");
    this.isOpen = false;

    if (this.currentTabIdx && this.currentTabIdx >= 0) {
      this.tabs[this.currentTabIdx].closeTab();
    }
  }

  setCurrentTabIdx(idx) {
    this.currentTabIdx = idx;
  }
}

export default Drawer;
