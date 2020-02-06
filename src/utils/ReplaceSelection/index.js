import { insertText, getStateFromTextArea } from "~utils";

export function replaceSelection(currentTextArea, text) {
	insertText(currentTextArea, text);
	return getStateFromTextArea(currentTextArea);
}

export default replaceSelection;
