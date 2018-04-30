import History from './components/History';
import { $, randomizer, htmlToElements } from './utilities';

class LoadingSpinner {
    constructor(el) {
        this.el = $(el);
        // this.loader = new [SunLoader, MoonLoader, CubeLoader][(randomizer(2))]();
        this.loader = new CubeLoader();
        this.el.appendChild(htmlToElements(this.loader.render()));
        if (this.loader.constructor.name === 'CubeLoader') {
            this.currentSide = 0;
            this.sides = this.el.getElementsByClassName('side');
        }
    }

    updateBackground(url) {
        if (this.loader.constructor.name === 'CubeLoader') {
            this.sides[this.currentSide].style['background-image'] = `url(${url})`;
            if (this.currentSide < this.sides.length - 1) {
                this.currentSide += 1;
            } else {
                this.currentSide = 0;
            }
        }
    }
}

export class SunLoader {
    constructor() {
        this.bigRayCount = 12;
        this.littleRayCount = 8;
    }

    buildRays(num) {
        const rayEl = "<div class='ray'></div>";
        let rays = '';

        for (let i = 0; i < num; i++) {
            rays += rayEl;
        }

        return rays;
    }

    render() {
        return `
            <div class='sun-container'>
                <div class='rays-big' id='big-rays'>${this.buildRays(this.bigRayCount)}</div>
                <div class='rays-small' id='small-rays'>${this.buildRays(this.littleRayCount)}</div>
                <div class='sun-light'></div>
            </div>`;
    }
}

class MoonLoader {
    render() {
        return `
            <div class='moon-container'>
                <div class='mask-left'>
                    <div class='moon shade-to-light'></div>
                    <div class='moon light-to-shade'></div>
                </div>

                <div class='mask-right'>
                    <div class='moon shade-to-light'></div>
                    <div class='moon light-to-shade'></div>
                </div>
            </div>`;
    }
}

class CubeLoader {
    render() {
        return `
            <div class="scene">
              <div class="cube">
                <div class="side back"></div>
                <div class="side left"></div>
                <div class="side right"></div>
                <div class="side top"></div>
                <div class="side bottom"></div>
                <div class="side front"></div>
              </div>
            </div>
        `
    }
}

export default LoadingSpinner;
