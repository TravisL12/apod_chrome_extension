class History {
    constructor() {
        this.pastDates = [];
        this.currentIdx = this.pastDates.length;

        document.addEventListener('keyup', e => {
            // keycode left-arrow (37), right (39)
            if (e.which === 37) {
                this.recall(-1);
            } else if (e.which === 39) {
                this.recall(1);
            }
        });

    }

    add(date) {
        this.pastDates.push(date);
        this.currentIdx = this.pastDates.length;
    }

    recall(direction) {
        this.currentIdx += direction;
        this.pastDates[this.currentIdx];
        console.log(this.pastDates)
        console.log(this.pastDates[this.currentIdx])
    }

}

export default History;
