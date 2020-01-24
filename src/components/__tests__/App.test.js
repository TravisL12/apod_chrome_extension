/*global chrome*/
import React from "react";
import { shallow } from "enzyme";
import App from "../../index";

const props = {
  apodType: "today",
  apodFavorites: {},
  hiResOnly: false,
  showTopSites: true,
  currentDate: undefined,
  todayCount: 0,
  todayLimit: 0,
  isTodayLimitOn: false
};

describe("App Component", () => {
  it("renders component", () => {
    const component = shallow(<App {...props} />);
    expect(component).toHaveLength(1);
  });
});
