import History from './components/History';
import { $, randomizer, htmlToElements } from './utilities';

class SunLoader {
    constructor() {
        this.bigRayCount = 12;
        this.littleRayCount = 8;
        this.template = `
            <div class='sun-container'>
                <div class='rays-big' id='big-rays'>${this.buildRays(this.bigRayCount)}</div>
                <div class='rays-small' id='small-rays'>${this.buildRays(this.littleRayCount)}</div>
                <div class='sun-light'></div>
            </div>`;
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

class CubeLoader {
    constructor() {
        this.el = htmlToElements(`
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
        `);
        this.currentSide = 0;
        this.sides = this.el.getElementsByClassName('side');

        chrome.storage.sync.get(['apodFavorites'], favorites => {
            if (favorites.apodFavorites) {
                for(let favorite in favorites.apodFavorites) {
                    this.updateBackground(favorites.apodFavorites[favorite].imgUrl);
                }
            }
        });
    }

    updateBackground(url) {
        this.sides[this.currentSide].style['background-image'] = `url(${url})`;

        if (this.currentSide < this.sides.length - 1) {
            this.currentSide += 1;
        } else {
            this.currentSide = 0;
        }
    }

    render() {
        return this.el;
    }
}

class FloatingHistoryLoader {
    constructor() {
        this.el = htmlToElements(`
            <div class="floating-history"></div>
        `);

        chrome.storage.sync.get(['apodFavorites'], favorites => {
            if (favorites.apodFavorites) {
                for(let favorite in favorites.apodFavorites) {
                    this.updateBackground(favorites.apodFavorites[favorite].imgUrl);
                }
            }
        });
    }

    loadFloatingImage(url) {
        const background = htmlToElements(`<div class="floating-image"></div>`)
        background.style['background-image'] = `url(${url})`;
        background.style['top'] = `${randomizer(100)}%`;
        background.style['left'] = `${randomizer(100)}%`;
        background.style['transform'] = `translateZ(-${randomizer(1000)}px)`;

        this.el.appendChild(background);
    }

    updateBackground(url) {
        const bgImg = new Image();
        bgImg.src = url;
        bgImg.onload = () => {
            this.loadFloatingImage(url);
        }
    }

    render() {
        return this.el;
    }
}

export { SunLoader, MoonLoader, CubeLoader, FloatingHistoryLoader };
