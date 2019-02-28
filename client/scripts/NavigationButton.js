import { $ } from "./utilities";
import ga from "./utils/ga";
import { apod } from "../index";

class NavigationButton {
  constructor(el, keycode, action) {
    this.el = $(el);
    this.keycode = keycode;
    this.action = action;

    this.el.addEventListener("click", e => {
      ga({ category: "Button", action: "clicked", label: this.el.id });
      apod[this.action]();
    });

    document.addEventListener("keyup", e => {
      if (e.which === this.keycode) {
        ga({ category: "Keydown", action: "pressed", label: this.el.id });
        apod[this.action]();
      }
    });
  }
}

export default NavigationButton;
