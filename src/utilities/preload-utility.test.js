/*global chrome*/
import Preload from "./preload-utility";

describe("Preload Utility", () => {
  it("creates a new object", () => {
    const preload = new Preload();
    expect(preload.currentIdx).toBe(0);
  });
});
