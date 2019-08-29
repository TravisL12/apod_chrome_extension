export default class History {
  constructor() {
    this.dates = [];
    this.responses = {};
    this.currentIdx = 0;
  }

  add(response) {
    if (!this.doesExist(response.date)) {
      this.dates.push(response.date);
      this.responses[response.date] = response;
      this.currentIdx += this.dates.length - 1;
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

  doesExist(date) {
    return this.dates.includes(date);
  }
}
