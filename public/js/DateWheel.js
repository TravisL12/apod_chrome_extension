class DateWheel {

    constructor(id, nums) {
        this.el = document.createElement('div');
        this.el.id = id;

        this.days = [];
        for (let day = 1; day <= nums; day++) {
            this.days.push(`
                <div class='date-val'>
                    <div class='num'>${day}</div>
                </div>`
            );
        }
        this.el.innerHTML = this.days.join('');
        let currentRotationDeg = 130;
        this.setRotationAngle(currentRotationDeg);

        this.el.addEventListener('mousewheel', function (e) {
            currentRotationDeg += e.deltaY * 0.1;
            this.setRotationAngle(currentRotationDeg);
        }.bind(this));
    }

    setRotationAngle (angle) {
        this.el.style.transform = `rotate3d(0,0,1,${angle}deg)`; 
    }

    render () {
        return this.el;
    }

}

class DatePicker {

    constructor(el) {
        this.el = $(el);
        this.dayPicker = new DateWheel('day-wheel', 31);
        this.monthPicker = new DateWheel('month-wheel', 12);
        this.yearPicker = new DateWheel('year-wheel', 10);

        this.el.appendChild(this.dayPicker.render());
        this.el.appendChild(this.monthPicker.render());
        this.el.appendChild(this.yearPicker.render());
    }

}
