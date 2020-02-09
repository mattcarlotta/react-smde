import bold from "./bold";
import boldItalic from "./boldItalic";
import code from "./code";
import header from "./header";
import image from "./image";
import italic from "./italic";
import link from "./link";
import quote from "./quote";
import { checkedList, orderedList, unorderedList } from "./lists";
import strikeThrough from "./strikeThrough";
import horizontalRule from "./horizontalRule";
import trash from "./trash";
// import underline from "./underline"; // not supported

const getDefaultCommands = () => [
	[header, bold, boldItalic, italic, strikeThrough],
	[horizontalRule],
	[link, quote, code, image],
	[unorderedList, orderedList, checkedList],
	[trash],
];

const commands = {
	header,
	bold,
	boldItalic,
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
	trash,
};

export { getDefaultCommands };

export default commands;
