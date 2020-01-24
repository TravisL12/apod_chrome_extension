/*global chrome*/
import React from "react";
import { shallow } from "enzyme";
import App from "../../index";
import Apod from "../Apod";
import { actualDate } from "../../utilities/dateUtility";

const mockDateString = "2020-01-23";
const mockedDate = actualDate(mockDateString);
global.Date = jest.fn(() => mockedDate);

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

  it("Does not render Apod if currentDate is missing", () => {
    const component = shallow(<App {...props} />);
    expect(component.find(Apod)).toHaveLength(0);
  });

  it("Does not render Apod if currentDate does not match today", () => {
    const component = shallow(<App {...props} currentDate={"2020-01-10"} />);
    expect(component.find(Apod)).toHaveLength(0);
  });

  it("Does not render Apod if isLoading is true", () => {
    const component = shallow(<App {...props} currentDate={mockDateString} />);
    component.instance().setState({ isLoading: true });
    component.update();
    expect(component.find(Apod)).toHaveLength(0);
  });

  it("Renders Apod if currentDate matches today", () => {
    const component = shallow(<App {...props} currentDate={mockDateString} />);
    expect(component.find(Apod)).toHaveLength(1);
  });
});
