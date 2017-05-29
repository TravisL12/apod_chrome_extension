function randomizer(max, min) {
    min = min || 0;
    max = max || 1;

    return Math.round(Math.random() * (max - min) + min);
}

function buildRays(num) {
    const rayEl = "<div class='ray'></div>";
    let rays = '';

    for(let i = 0; i < num; i++) {
        rays += rayEl;
    }

    return rays;
}

$('#big-rays').innerHTML   = buildRays(20);
$('#small-rays').innerHTML = buildRays(20);

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
