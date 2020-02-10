import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import { FaSmile } from "react-icons/fa";
import Container from "~components/Container";
import MDEditor from "~components/MDEditor";
import { defaultCommandLayout } from "~commands";
import replaceSelection from "~utils/ReplaceSelection";
import ShowSource from "~components/ShowSource";

class CustomCommandsExample extends Component {
	constructor() {
		super();
		this.state = {
			value: "",
		};
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleSmileEmojiCommand = this.handleSmileEmojiCommand.bind(this);
		this.handleEmojiMenuCommand = this.handleEmojiMenuCommand.bind(this);
	}

	adjustEditorSelection(start, end) {
		this.editorRef.focus();
		this.editorRef.selectionStart = start;
		this.editorRef.selectionEnd = end;
	}

	handleValueChange(value) {
		this.setState({ value });
	}

	handleSmileEmojiCommand() {
		const { selection } = replaceSelection(this.editorRef, "😊");

		this.adjustEditorSelection(selection.start - 1, selection.end);
	}

	handleEmojiMenuCommand(value) {
		const { selection } = replaceSelection(this.editorRef, value);

		this.adjustEditorSelection(selection.start, selection.end);
	}

	render() {
		return (
			<MDEditor
				editorRef={node => (this.editorRef = node)}
				commands={[
					...defaultCommandLayout,
					[
						{
							name: "smile-emoji",
							tooltip: "Add smile emoji",
							buttonProps: {
								"aria-label": "Add smile emoji",
								onClick: this.handleSmileEmojiCommand,
							},
							icon: "😊",
						},
						{
							name: "emoji-menu",
							tooltip: "Add an emoji",
							buttonProps: {
								"aria-label": "Add an emoji",
							},
							onClick: this.handleEmojiMenuCommand,
							icon: <FaSmile style={{ position: "relative", top: 1 }} />,
							children: [
								{
									name: "smile",
									icon: <p>🙂</p>,
									value: "🙂",
								},
								{
									name: "grin",
									icon: <p>😄</p>,
									value: "😄",
								},
								{
									name: "beam",
									icon: <p>😁</p>,
									value: "😁",
								},
								{
									name: "tears",
									icon: <p>😂</p>,
									value: "😂",
								},
							],
						},
					],
				]}
				onChange={this.handleValueChange}
				value={this.state.value}
				textAreaProps={{
					placeholder:
						"This example demonstrates how to create your own custom button interactions.",
				}}
			>
				<ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
			</MDEditor>
		);
	}
}

const text = `import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor, { defaultCommandLayout, replaceSelection } from "react-smde";
import { FaSmile } from "react-icons/fa";
import "react-smde/dist/styles/react-smde.css";

/* 
  replaceSelection expects two arguments: (editorRef, string)
	
  it also returns an object with several properties: 
	
  {
    selection: {
      start: textArea.selectionStart, ==> current textarea selection start
      end: textArea.selectionEnd, ==> current textarea selection end
    },
    text: textArea.value, ==> current textarea value
    selectedText: textArea.value.slice(
      textArea.selectionStart,
      textArea.selectionEnd,
    ), ==> any selected text with the previous selection ranges
  }

  you can utilize this object to insert some text and then immediately
  highlight/select it by offsetting by its length (see the 
  handleSmileEmojiCommand below for an example)
*/ 


class CustomCommandsExample extends Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSmileEmojiCommand = this.handleSmileEmojiCommand.bind(this);
    this.handleEmojiMenuCommand = this.handleEmojiMenuCommand.bind(this);
  }
	
  adjustEditorSelection(start, end) {
    this.editorRef.focus();
    this.editorRef.selectionStart = start;
    this.editorRef.selectionEnd = end;
  }

  handleValueChange(value){
    this.setState({ value });
  }
	
  handleSmileEmojiCommand() {
    const { selection } = replaceSelection(this.editorRef, "😊");
    this.adjustEditorSelection(selection.start - 1, selection.end);
  }

  handleEmojiMenuCommand(value) {
    const { selection } = replaceSelection(this.editorRef, value);
    this.adjustEditorSelection(selection.start, selection.end);
  }

  render() {
    return (
      <MDEditor
        editorRef={node => (this.editorRef = node)}
        commands={[
          ...defaultCommandLayout,
          [
            {
              name: "smileemoji",
              tooltip: "Add smile emoji",
              buttonProps: {
                "aria-label": "Add smile emoji",
                onClick: this.handleSmileEmojiCommand,
              },
              icon: 😊,
            },
            {
              name: "emojimenu",
              tooltip: "Add an emoji",
              buttonProps: {
                "aria-label": "Add an emoji",
              },
              // since we're using a menu group, we'll pass this "onClick" as
              // a separate property, instead of adding it to the "buttonProps"
              onClick: this.handleEmojiMenuCommand, 
              icon: <FaSmile style={{ position: "relative", top: 1 }} />,
              children: [
                {
                  name: "smile",
                  icon: <p>🙂</p>,
                  value: "🙂"
                },
                {
                  name: "grin",
                  icon: <p>😄</p>,
                  value: "😄"
                },
                {
                  name: "beam",
                  icon: <p>😁</p>,
                  value: "😁"
                },
                {
                  name: "tears",
                  icon: <p>😂</p>,
                  value: "😂"
                },
              ],
            },
          ],
        ]}
        onChange={this.handleValueChange}
        value={this.state.value}
        textAreaProps={{
          placeholder:
            "This example demonstrates how to create your own custom button interactions.",
        }}
      >
        <ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
      </MDEditor>
    );
  }
}`;

export default () => (
	<Container>
		<ShowSource text={text}>
			<CustomCommandsExample />
		</ShowSource>
	</Container>
);
