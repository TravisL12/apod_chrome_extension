/*global chrome*/
import React from "react";
import { shallow } from "enzyme";
import App from ".";

describe("App Component", () => {
  it("renders component", () => {
    const component = shallow(<App />);
    expect(component).toHaveLength(1);
  });
});
