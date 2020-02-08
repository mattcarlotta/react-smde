import { insertText } from "~utils/InsertTextAtPosition";
import { getStateFromTextArea } from "~utils/GetStateFromTextArea";

export function replaceSelection(currentTextArea, text) {
	insertText(currentTextArea, text);
	return getStateFromTextArea(currentTextArea);
}

export default replaceSelection;
