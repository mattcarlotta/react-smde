import React from "react";
import ReactMarkdown from "react-markdown";
import Container from "~components/Container";
import MDEditor from "~components/MDEditor";
import ShowSource from "~components/ShowSource";

class BasicExample extends React.Component {
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
			<MDEditor onChange={this.handleValueChange} value={this.state.value}>
				<ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
			</MDEditor>
		);
	}
}

const text = `import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "react-smde";

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
			<BasicExample />
		</ShowSource>
	</Container>
);
