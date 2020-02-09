import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import Container from "~components/Container";
import MDEditor from "~components/MDEditor";
import ShowSource from "~components/ShowSource";

class SimpleEditorExample extends Component {
	constructor() {
		super();
		this.state = {
			value:
				"# Simple editor\n\nAlthough this example is missing a toolbar, the syntax and hotkeys to **bold** (ctrl+b), *italicize* (ctrl+i), add a [link](https://github.com/mattcarlotta/react-smde) (ctrl+k) and toggle the markdown previewer (ctrl+0) will still work!\n\n Right now, you're in the preview mode. To switch back to the editor mode, press ctrl+0!",
		};
		this.handleValueChange = this.handleValueChange.bind(this);
	}

	handleValueChange(value) {
		this.setState({ value });
	}

	render() {
		return (
			<MDEditor
				disableGrip
				disableToolbar
				selectedTab="preview"
				onChange={this.handleValueChange}
				value={this.state.value}
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
import "./styles.scss";

class SimpleEditorExample extends Component {
  constructor() {
    super();
    this.state = { 
      value:
        "# Simple editor\\n\\nAlthough this example is missing a toolbar, the syntax and hotkeys to **bold** (ctrl+b), *italicize* (ctrl+i), add a [link](https://github.com/mattcarlotta/react-smde) (ctrl+k) and toggle the markdown previewer (ctrl+0) will still work!\\n\\n Right now, you're in the preview mode. To switch back to the editor mode, press ctrl+0!",
    };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value){
    this.setState({ value });
  } 

  render() {
    return (
      <MDEditor
        disableGrip
        disableToolbar
        selectedTab="preview"
        onChange={this.handleValueChange}
        value={this.state.value}
      >
        <ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
      </MDEditor>
    );
  }
}`;

export default () => (
	<Container>
		<ShowSource text={text}>
			<SimpleEditorExample />
		</ShowSource>
	</Container>
);
