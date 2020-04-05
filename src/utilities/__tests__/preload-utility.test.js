import axios from "axios";
import mockResponses from "../../../fixtures/mockResponses";
import Preload from "../preload-utility";

jest.mock("axios");

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

  it("getImages makes a request", async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(mockResponses));
    const processSpy = jest.spyOn(preload, "processResponse");
    await preload.getImages();
    expect(preload.randomRequestPending).toBe(false);
    expect(processSpy).toHaveBeenCalledWith(mockResponses);
  });
});
