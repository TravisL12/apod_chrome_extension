/*global chrome*/
import History from "../history";

const mockResponse = {
  date: "2007-09-05",
  explanation: "On September 1, Aurigid meteors filled the sky...",
  hdurl: "https://apod.nasa.gov/apod/image/0709/AurigidVaubaillon.jpg",
  media_type: "image",
  service_version: "v1",
  title: "Aurigids from 47,000 Feet",
  url: "https://apod.nasa.gov/apod/image/0709/AurigidVaubaillon720.jpg"
};

const mockResponse2 = { ...mockResponse, date: "2015-10-12" };

describe("History Helper Utility", () => {
  let history;

  beforeEach(() => {
    history = new History();
  });

  it("creates a new object", () => {
    expect(history.responses.length).toBe(0);
    expect(history.currentIdx).toBe(0);
  });

  it("adds response to history", () => {
    history.add(mockResponse);
    expect(history.responses.length).toBe(1);
    expect(history.currentIdx).toBe(0);
  });

  it("adds multiple responses to history", () => {
    history.add(mockResponse);
    history.add(mockResponse2);
    expect(history.responses.length).toBe(2);
    expect(history.currentIdx).toBe(1);
  });

  it("will not add existing  response to history", () => {
    history.add(mockResponse);
    history.add(mockResponse);
    expect(history.responses.length).toBe(1);
    expect(history.currentIdx).toBe(0);
  });

  it("gets previous date", () => {
    history.add(mockResponse);
    history.add(mockResponse2);

    const response = history.getPreviousDate();
    expect(response).toMatchObject(history.responses[0]);
  });

  it("no previous dates responds false", () => {
    history.add(mockResponse);
    history.add(mockResponse2);

    history.getPreviousDate();
    const response = history.getPreviousDate();
    expect(response).toBe(false);
  });

  it("gets next date", () => {
    history.add(mockResponse);
    history.add(mockResponse2);

    history.getPreviousDate();
    const response = history.getNextDate();
    expect(response).toMatchObject(history.responses[1]);
  });

  it("no next date responds false", () => {
    history.add(mockResponse);
    history.add(mockResponse2);

    const response = history.getNextDate();
    expect(response).toBe(false);
  });
});
