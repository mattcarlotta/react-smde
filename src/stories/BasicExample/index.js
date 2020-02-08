import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "~components/MDEditor";
import ShowSource from "~components/ShowSource";

class BasicExample extends Component {
	constructor() {
		super();
		this.state = { value: "" };
		this.handleValueChange = this.handleValueChange.bind(this);
	}

	handleValueChange(value) {
		this.setState({ value });
	}

	render = () => (
		<div className="container">
			<MDEditor onChange={this.handleValueChange} value={this.state.value}>
				<ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
			</MDEditor>
		</div>
	);
}

const text = `import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "react-smde";
import "react-smde/styles/react-smde.css";

class BasicExample extends Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value){
    this.setState({ value });
  } 

  render = () => (
    <div className="container">
      <MDEditor 
        onChange={this.handleValueChange} 
        value={this.state.value}
      >
        <ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
      </MDEditor>
    </div>
  );
}`;

export default () => (
	<ShowSource text={text}>
		<BasicExample />
	</ShowSource>
);
