function SunLoader() {
    this.bigRayCount = 12;
    this.littleRayCount = 8;
}

SunLoader.prototype = {
    buildRays (num) {
        const rayEl = "<div class='ray'></div>";
        let rays = '';

        for(let i = 0; i < num; i++) {
            rays += rayEl;
        }

        return rays;
    },

    render () {
        return `
            <div class='sun-container'>
                <div class='rays-big' id='big-rays'>${this.buildRays(this.bigRayCount)}</div>
                <div class='rays-small' id='small-rays'>${this.buildRays(this.littleRayCount)}</div>
                <div class='sun-light'></div>
            </div>
        `;
    },
}

function MoonLoader() {};

MoonLoader.prototype.render = () => {
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
        </div>
    `
}

// function buildStars(num) {
//     let starEl = '';

//     for (let i = 0; i < num; i++) {
//         let star = '';
//         const starsPerGrid = randomizer(5, 1);

//         for (let j = 0; j < starsPerGrid; j++) {
//             const styleCoords = `left: ${randomizer(100)}%; top: ${randomizer(100)}%;`
//             const starStyleNum = randomizer(5, 1); // Make sure this matches the CSS list of colors length
//             star += `<div class='star star-${starStyleNum}' style='${styleCoords}'>${buildRays(5)}</div>`;
//         }

//         starEl  += `<div class='star-grid'>${star}</div>`
//     }

//     return starEl;
// }

// $('#stars').innerHTML = buildStars(65);
