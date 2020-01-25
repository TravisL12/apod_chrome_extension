/*global chrome*/
import React from "react";
import { shallow } from "enzyme";
import Apod from "../Apod";
import Drawer from "../Drawer";
import Title from "../Title";
import { TitleLoader } from "../LoadingSpinner";
import TopSites from "../TopSites";
import mockResponses from "../../../fixtures/mockResponses";

describe("Apod Component", () => {
  const props = {
    selection: "today",
    favorites: {},
    isHighRes: true,
    showTopSites: true,
    showTodayOptions: {
      count: 0,
      limit: 0,
      isLimitOn: false
    }
  };

  it("renders component", () => {
    const component = shallow(<Apod {...props} />);
    expect(component).toHaveLength(1);
  });

  it("shows TopSites", () => {
    const component = shallow(<Apod {...props} />);
    expect(component.find(TopSites)).toHaveLength(1);
  });

  it("hides TopSites", () => {
    const component = shallow(<Apod {...props} showTopSites={false} />);
    expect(component.find(TopSites)).toHaveLength(0);
  });

  it("loads today on componentDidMount", () => {
    const component = shallow(<Apod {...props} />);
    const spy = jest.spyOn(component.instance(), "current");
    component.instance().componentDidMount();

    expect(spy).toBeCalledTimes(1);
  });

  it("loads random on componentDidMount", () => {
    const component = shallow(<Apod {...props} selection={"random"} />);
    const spy = jest.spyOn(component.instance(), "random");
    component.instance().componentDidMount();

    expect(spy).toBeCalledTimes(1);
  });

  it("loads today on componentDidMount when isLimitIsOn and under count limit", () => {
    const showTodayOptions = {
      count: 0,
      limit: 5,
      isLimitOn: true
    };
    const component = shallow(
      <Apod {...props} showTodayOptions={showTodayOptions} />
    );
    const spy = jest.spyOn(component.instance(), "current");
    component.instance().componentDidMount();

    expect(spy).toBeCalledTimes(1);
  });

  it("loads random on componentDidMount when isLimitIsOn and over count limit", () => {
    const showTodayOptions = {
      count: 6,
      limit: 5,
      isLimitOn: true
    };
    const component = shallow(
      <Apod {...props} showTodayOptions={showTodayOptions} />
    );
    const spy = jest.spyOn(component.instance(), "random");
    component.instance().componentDidMount();

    expect(spy).toBeCalledTimes(1);
  });

  it("hides Drawer and Title when isLoading", () => {
    const component = shallow(<Apod {...props} />);
    component.setState({ isLoading: true });
    component.update();

    expect(component.find(Title)).toHaveLength(0);
    expect(component.find(Drawer)).toHaveLength(1);
    expect(component.find(TitleLoader)).toHaveLength(1);
  });

  it("shows Drawer and Title when isLoading", () => {
    const component = shallow(<Apod {...props} />);
    component.setState({ response: mockResponses[0], isLoading: false });
    component.update();

    expect(component.find(Title)).toHaveLength(1);
  });
});
