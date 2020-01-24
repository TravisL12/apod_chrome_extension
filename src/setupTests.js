import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

const get = jest.fn();
const set = jest.fn();
const addListener = jest.fn();
const getManifest = jest.fn();

global.chrome = {
  runtime: { getManifest },
  storage: {
    sync: { set, get },
    local: { set, get },
    onChanged: { addListener }
  }
};

configure({ adapter: new Adapter() });
