class DateWheel {

    constructor(el, nums) {
        this.el = $(el);

        this.days = [];
        for (let day = 1; day <= nums; day++) {
            this.days.push(`
                <div class='date-val'>
                    <div class='num'>${day}</div>
                </div>`
            );
        }
        this.el.innerHTML = this.days.join('');
        let currentRotationDeg = 92;
        this.setRotationAngle(0);

        this.el.addEventListener('mousewheel', function (e) {
            currentRotationDeg += e.deltaY * 0.1;
            this.setRotationAngle(currentRotationDeg);
        }.bind(this));
    }

    setRotationAngle (angle) {
        this.el.style.transform = `rotate3d(0,0,1,${angle}deg)`; 
    }

}
