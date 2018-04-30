class History {
    constructor() {
        this.pastDates = [];
        this.currentIdx = this.pastDates.length;
    }

    add(date) {
        if (this.pastDates.indexOf(date) === -1) {
            this.pastDates.push(date);
            this.currentIdx = this.pastDates.length;
            console.log(this.pastDates);
        }
    }

    recall(direction) {
        if (direction > 0 && this.currentIdx < this.pastDates.length - 1)
            this.currentIdx += direction;
        else if (direction < 0 && this.currentIdx > 0) {
            this.currentIdx += direction;
        } else {
            return;
        }

        console.log(this.pastDates[this.currentIdx]);

        return this.pastDates[this.currentIdx];
    }

}

export default History;
