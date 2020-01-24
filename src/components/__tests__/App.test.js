/*global chrome*/
import React from "react";
import { shallow } from "enzyme";
import App from "../../index";
import Apod from "../Apod";
import { actualDate } from "../../utilities/dateUtility";

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

const mockDateString = "2020-01-23";
const mockedDate = actualDate(mockDateString);
global.Date = jest.fn(() => mockedDate);

describe("App Component", () => {
  it("renders component", () => {
    const component = shallow(<App {...props} />);
    expect(component).toHaveLength(1);
  });

  it("Does not render Apod if isLoading", () => {
    const component = shallow(<App {...props} currentDate={"2020-01-10"} />);
    expect(component.find(Apod)).toHaveLength(0);
  });

  it("Renders Apod if isLoading", () => {
    const component = shallow(<App {...props} currentDate={mockDateString} />);
    expect(component.find(Apod)).toHaveLength(1);
  });
});
