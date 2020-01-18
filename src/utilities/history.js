export default class History {
  constructor() {
    this.responses = [];
    this.currentIdx = 0;
  }

  add(response) {
    const dateIndex = this.responses.findIndex(
      ({ date }) => date === response.date
    );

    if (dateIndex === -1) {
      this.responses.push(response);
      this.currentIdx = this.responses.length - 1;
    } else {
      this.currentIdx = dateIndex;
    }
  }

  getResponse() {
    return this.responses[this.currentIdx];
  }

  getPreviousDate() {
    if (this.currentIdx === 0) {
      return false;
    }
    this.currentIdx -= 1;
    return this.getResponse();
  }

  getNextDate() {
    if (this.currentIdx === this.responses.length - 1) {
      return false;
    }
    this.currentIdx += 1;
    return this.getResponse();
  }
}
