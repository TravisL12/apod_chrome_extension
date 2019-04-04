import { $ } from "scripts/utilities";
import ga from "scripts/utilities/ga";

class NavigationButton {
  constructor(el, keycode, action, apod) {
    this.el = $(el);
    this.keycode = keycode;
    this.action = action;
    this.isEnabled = true;

    this.el.addEventListener("click", e => {
      ga({ category: "Button", action: "clicked", label: this.el.id });
      apod[this.action]();
    });

    document.addEventListener("keyup", e => {
      if (e.which === this.keycode && this.isEnabled) {
        ga({ category: "Keydown", action: "pressed", label: this.el.id });
        apod[this.action]();
      }
    });
  }

  toggle(isEnabled) {
    this.isEnabled = isEnabled;
  }
}

export default NavigationButton;
