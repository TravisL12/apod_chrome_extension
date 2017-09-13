class DateWheel {

    constructor(el) {
        this.el = $(el);

        this.days = [];
        for (let day = 1; day <= 31; day++) {
            this.days.push(`<div class='num'>${day}</div>`);
        }
        this.el.innerHTML = this.days.join('');
        this.rotation = 0;

        this.el.addEventListener('mousewheel', function (e) {
            this.rotation += e.deltaY * 0.1;
            this.el.style.transform = `rotate3d(0,0,1,${this.rotation}deg)`; 
        }.bind(this));

    }

}
