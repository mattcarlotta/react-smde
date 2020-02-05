import { JSDOM } from "jsdom";
import { configure, mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

/* THE BELOW ARE ACCESSIBLE AND PREDEFINED FOR ALL *.TEST.JS FILES */
const exposedProperties = ["window", "navigator", "document"];
const { document } = new JSDOM("").window;
global.document = document;
global.window = document.defaultView;
global.HTMLElement = window.HTMLElement;
global.HTMLAnchorElement = window.HTMLAnchorElement;
global.shallow = shallow;
global.mount = mount;
global.React = require("react");

Object.keys(document.defaultView).forEach(property => {
	if (typeof global[property] === "undefined") {
		exposedProperties.push(property);
		global[property] = document.defaultView[property];
	}
});

global.navigator = {
	userAgent: "node.js",
};
