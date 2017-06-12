class SunLoader {

    constructor () {
        this.bigRayCount = 12;
        this.littleRayCount = 8;
    }

    buildRays (num) {
        const rayEl = "<div class='ray'></div>";
        let rays = '';

        for(let i = 0; i < num; i++) {
            rays += rayEl;
        }

        return rays;
    }

    render () {
        return `
            <div class='sun-container'>
                <div class='rays-big' id='big-rays'>${this.buildRays(this.bigRayCount)}</div>
                <div class='rays-small' id='small-rays'>${this.buildRays(this.littleRayCount)}</div>
                <div class='sun-light'></div>
            </div>`;
    }
}

class MoonLoader {

    render () {
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

class StarsLoader {

    constructor () {
        this.starCount = 100;
    }

    buildRays(num) {
          const rayEl = "<div class='ray'></div>";
          let rays = "";

          for (let i = 0; i < num; i++) {
            rays += rayEl;
          }

          return rays;
    }

    setBlinkRates () {
        for (let i = 1; i <= this.starCount; i++) {
            let delay = randomizer(5000,1000);
            setInterval(() => {
                let star = $('#star-id-' + i);
                star.style.opacity = randomizer(100,20)/100;
            }, delay);

            setInterval(() => {
                let star = $('#star-id-' + i);
                star.style.opacity = 1;
            }, delay * 2);
        }
    }

    buildStars(num) {
        let stars = "";

        for (let i = 0; i < num; i++) {
            const starsPerGrid = randomizer(5, 1);
            const styleCoords = `
                left: ${randomizer(100)}%;
                top: ${randomizer(100)}%;
                opacity: ${randomizer(100,20)/100};
                transform: rotate3d(0,0,1,${randomizer(180)}deg)
            `;

            const starStyleNum = randomizer(5, 1); // Make sure this matches the CSS list of colors length
            stars += `<div class='star star-${starStyleNum}' id='star-id-${i+1}' style='${styleCoords}'>${this.buildRays(5)}</div>`;
        }

        return stars;
    }

    render () {
        return `
            <div class='stars-container' id='stars'>${this.buildStars(this.starCount)}</div>
        `;
    }

}
