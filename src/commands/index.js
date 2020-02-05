import bold from "./bold";
import code from "./code";
import header from "./header";
import image from "./image";
import italic from "./italic";
import link from "./link";
import quote from "./quote";
import { checkedList, orderedList, unorderedList } from "./lists";
import strikeThrough from "./strikeThrough";
import horizontalRule from "./horizontalRule";
// import underline from "./underline"; // not supported

const getDefaultCommands = () => [
	[header, bold, italic, strikeThrough],
	[horizontalRule],
	[link, quote, code, image],
	[unorderedList, orderedList, checkedList],
];

const commands = {
	header,
	bold,
	italic,
	strikeThrough,
	horizontalRule,
	link,
	quote,
	code,
	image,
	unorderedList,
	orderedList,
	checkedList,
};

export { getDefaultCommands };

export default commands;
