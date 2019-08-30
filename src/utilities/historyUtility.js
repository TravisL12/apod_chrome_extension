export default class History {
  constructor() {
    this.dates = [];
    this.responses = {};
    this.currentIdx = 0;
  }

  add(response) {
    const dateIndex = this.dates.indexOf(response.date);

    if (dateIndex === -1) {
      this.dates.push(response.date);
      this.responses[response.date] = response;
      this.currentIdx += this.dates.length - 1;
    } else {
      this.currentIdx = dateIndex;
    }
  }

  getResponse() {
    const dateKey = this.dates[this.currentIdx];
    return this.responses[dateKey];
  }

  getPreviousDate() {
    if (this.currentIdx === 0) {
      return false;
    }
    this.currentIdx -= 1;
    return this.getResponse();
  }

  getNextDate() {
    if (this.currentIdx === this.dates.length - 1) {
      return false;
    }
    this.currentIdx += 1;
    return this.getResponse();
  }
}
