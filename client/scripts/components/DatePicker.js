import { $, monthNames, htmlToElements } from '../utilities';
import ga from '../utils/ga';
import DateManager from '../DateManagement';
import { apod } from '../../index';

const _monthNames = monthNames.short;
const startYear = 1995;
const currentYear = new Date().getFullYear();
const yearDif = currentYear - startYear;
const yearRange = Array.from(new Array(yearDif + 1), (x, i) => i + startYear);

class DatePickerComponent {
    constructor(el) {
        this.el = $(el);
        this.submitBtn = $('button.date-submit');
        this.dayWheel = new DateWheel('day-wheel', 31);
        this.monthWheel = new DateWheel('month-wheel', _monthNames);
        this.yearWheel = new DateWheel('year-wheel', yearRange);

        this.el.appendChild(this.dayWheel.render());
        this.el.appendChild(this.monthWheel.render());
        this.el.appendChild(this.yearWheel.render());

        this.submitBtn.addEventListener('click', e => {
            const date = this.getSelectedDate();
            apod.specificDate(date);

            ga({
                category: 'Date Wheel',
                action: 'clicked',
                label: date,
            });
        });
    }

    getSelectedDate() {
        return [
            yearRange[this.yearWheel.currentValue()],
            this.monthWheel.currentValue() + 1,
            this.dayWheel.currentValue() + 1,
        ].join('-');
    }

    update(date) {
        date = new Date(DateManager.prettyDateFormat(date));
        this.dayWheel.setDate(date.getDate() - 1);
        this.monthWheel.setDate(date.getMonth());

        const yearIdx = yearRange.indexOf(date.getFullYear());
        this.yearWheel.setDate(yearIdx);
    }
}

class DateWheel {
    constructor(id, nums) {
        this.el = document.createElement('div');
        this.el.id = id;
        this.currentRotationDeg = 45;
        this.updateAngle();

        if (Array.isArray(nums)) {
            this.collection = nums;
            this.amount = nums.length;
        } else {
            this.amount = nums;
        }
        this.el.appendChild(htmlToElements(this.createWheelValues().join(''), true));

        let wheelSpin = false;
        const wheelDelay = 250;
        const wheelTriggerSpeed = 35;
        this.el.addEventListener('mousewheel', e => {
            if (!wheelSpin && Math.abs(e.deltaY) > wheelTriggerSpeed) {
                const direction = e.deltaY < 0 ? 1 : -1;
                this.currentRotationDeg += 360 / this.amount * direction;
                this.updateAngle();
                wheelSpin = true;

                let nextIdx;
                if (this.currentIdx === this.amount - 1 && direction < 0) {
                    nextIdx = 0;
                } else if (this.currentIdx === 0 && direction > 0) {
                    nextIdx = this.amount - 1;
                } else {
                    nextIdx = this.currentIdx - direction;
                }

                this.currentDate = nextIdx;

                setTimeout(() => {
                    wheelSpin = false;
                }, wheelDelay);
            }
        });
    }

    createWheelValues() {
        let days;

        if (!this.collection) {
            days = [];
            for (let day = 1; day <= this.amount; day++) {
                days.push(`
                    <div class='date-val'>
                        <div class='num'>${day}</div>
                    </div>`);
            }
        } else {
            days = this.collection.map(item => {
                return `
                    <div class='date-val'>
                        <div class='num'>${item}</div>
                    </div>`;
            });
        }
        return days;
    }

    currentValue() {
        return this.currentIdx;
    }

    set currentDate(idx) {
        let current = this.el.querySelector('.current');
        if (current) {
            current.classList.remove('current');
        }
        this.currentIdx = idx;
        this.el.firstChild.children[idx].querySelector('.num').classList.add('current');
    }

    updateAngle() {
        this.el.style.transform = `rotate3d(0,0,1,${this.currentRotationDeg}deg)`;
    }

    setDate(value) {
        this.currentDate = value;
        this.currentRotationDeg = -(value / this.amount * 360) + 45;
        this.updateAngle();
    }

    render() {
        return this.el;
    }
}

export default DatePickerComponent;
