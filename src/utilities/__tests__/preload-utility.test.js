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
    expect(preload.currentIdx).toBe(0);
    expect(preload.loadingCount).toBe(0);
  });

  it("getImages makes a request", () => {});
});
