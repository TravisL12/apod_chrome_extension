/*global chrome*/
import Preload from "../preload-utility";

const axiosMock = {
  get: jest.fn(() => Promise.resolve({ data: {} }))
};

describe("Preload Utility", () => {
  let preload;

  beforeEach(() => {
    preload = new Preload();
  });

  it("creates a new object", () => {
    expect(preload.randomRequestPending).toBe(false);
    expect(preload.loadingCount).toBe(0);
    expect(preload.dates.length).toBe(0);
  });

  it("getImages makes a request", () => {});
});
