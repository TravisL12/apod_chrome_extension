import { loader } from "../../index";

class History {
  constructor() {
    this.pastDates = [];
    this.currentIdx = this.pastDates.length;
  }

  checkDuplicateHistory(response) {
    const dates = this.pastDates.map(response => {
      return response.date;
    });

    return dates.indexOf(response.date) === -1;
  }

  add(response) {
    if (this.checkDuplicateHistory(response)) {
      this.pastDates.push(response);
      this.currentIdx = this.pastDates.length - 1;

      if (
        this.pastDates[this.currentIdx - 1] &&
        loader.hasOwnProperty("updateBackground")
      ) {
        loader.updateBackground(this.pastDates[this.currentIdx - 1].url);
      }
    }
  }

  recall(direction) {
    if (direction > 0 && this.currentIdx < this.pastDates.length - 1)
      this.currentIdx += direction;
    else if (direction < 0 && this.currentIdx > 0) {
      this.currentIdx += direction;
    } else {
      return false;
    }

    return this.pastDates[this.currentIdx];
  }
}

export default History;
