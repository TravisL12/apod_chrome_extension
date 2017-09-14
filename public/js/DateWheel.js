class DateWheel {

    constructor(id, nums) {
        this.el = document.createElement('div');
        this.el.id = id;
        this.amount = nums;
        this.currentRotationDeg = 135;
        this.setRotationAngle();

        this.days = [];
        for (let day = 1; day <= this.amount; day++) {
            this.days.push(`
                <div class='date-val'>
                    <div class='num'>${day}</div>
                </div>`
            );
        }
        this.el.innerHTML = this.days.join('');

        this.el.addEventListener('mousewheel', function (e) {
            this.currentRotationDeg += e.deltaY * -0.1;
            this.setRotationAngle();
        }.bind(this));
    }

    setCurrent (idx) {
        let current = this.el.querySelector('.current')
        if (current) {
            current.classList.remove('current');
        }
        this.el.children[idx].querySelector('.num').classList.add('current')
    }

    setRotationAngle () {
        this.el.style.transform = `rotate3d(0,0,1,${this.currentRotationDeg}deg)`; 
    }

    setDate (value) {
        this.setCurrent(value);
        this.currentRotationDeg = -((value / this.amount) * 360) + 135;
        this.setRotationAngle();
    }

    render () {
        return this.el;
    }

}

class DatePicker {

    constructor(el) {
        this.el = $(el);
        this.dayWheel = new DateWheel('day-wheel', 31);
        this.monthWheel = new DateWheel('month-wheel', 12);
        this.yearWheel = new DateWheel('year-wheel', 22);

        this.el.appendChild(this.dayWheel.render());
        this.el.appendChild(this.monthWheel.render());
        this.el.appendChild(this.yearWheel.render());
    }

    update (date) {
        date = new Date(DateManager.prettyDateFormat(date));
        this.dayWheel.setDate(date.getDate() - 1);
        this.monthWheel.setDate(date.getMonth());
        this.yearWheel.setDate(8 - 1);
    }

}
