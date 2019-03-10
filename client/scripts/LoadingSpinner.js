import { htmlToElements } from "./utilities/";
import { $ } from "./utilities/";

class SunLoader {
  constructor(el) {
    this.bigRayCount = 12;
    this.littleRayCount = 8;
    this.el = $(el);
    this.template = `
            <div class='sun-container'>
                <div class='rays-big' id='big-rays'>${this.buildRays(
                  this.bigRayCount
                )}</div>
                <div class='rays-small' id='small-rays'>${this.buildRays(
                  this.littleRayCount
                )}</div>
                <div class='sun-light'></div>
            </div>`;
    this.el.appendChild(this.render());
  }

  buildRays(num) {
    const rayEl = "<div class='ray'></div>";
    let rays = "";

    for (let i = 0; i < num; i++) {
      rays += rayEl;
    }

    return rays;
  }

  render() {
    return htmlToElements(this.template);
  }
}

class MoonLoader {
  render() {
    return htmlToElements(`
            <div class='moon-container'>
                <div class='mask-left'>
                    <div class='moon shade-to-light'></div>
                    <div class='moon light-to-shade'></div>
                </div>

                <div class='mask-right'>
                    <div class='moon shade-to-light'></div>
                    <div class='moon light-to-shade'></div>
                </div>
            </div>`);
  }
}

export { SunLoader, MoonLoader };
