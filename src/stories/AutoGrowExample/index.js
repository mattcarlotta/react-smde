import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import Container from "~components/Container";
import MDEditor from "~components/MDEditor";
import ShowSource from "~components/ShowSource";

class AutoGrow extends Component {
	constructor() {
		super();
		this.state = { value: "" };
		this.handleValueChange = this.handleValueChange.bind(this);
	}

	handleValueChange(value) {
		this.setState({ value });
	}

	render() {
		return (
			<MDEditor
				autoGrow
				onChange={this.handleValueChange}
				value={this.state.value}
				minEditorHeight={100}
				maxEditorHeight={600}
				textAreaProps={{ placeholder: "As you type this editor will grow!" }}
			>
				<ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
			</MDEditor>
		);
	}
}

const text = `import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "react-smde";
import "react-smde/dist/styles/react-smde.css";

class BasicExample extends Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value){
    this.setState({ value });
  } 

  render() {
    return (
      <MDEditor
        autoGrow
        onChange={this.handleValueChange}
        value={this.state.value}
        minEditorHeight={100}
        maxEditorHeight={600}
        textAreaProps={{ placeholder: "As you type this editor will grow!" }}
      >
        <ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
      </MDEditor>
    );
  }
}`;

export default () => (
	<Container>
		<ShowSource text={text}>
			<AutoGrow />
		</ShowSource>
	</Container>
);
