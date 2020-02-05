export const getStateFromTextArea = textArea => ({
	selection: {
		start: textArea.selectionStart,
		end: textArea.selectionEnd,
	},
	text: textArea.value,
	selectedText: textArea.value.slice(
		textArea.selectionStart,
		textArea.selectionEnd,
	),
});

export const getPrevStateFromTextArea = (textArea, pos) =>
	textArea.value.slice(
		textArea.selectionStart - pos,
		textArea.selectionEnd + pos,
	);
