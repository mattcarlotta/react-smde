import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import Container from "~components/Container";
import MDEditor from "~components/MDEditor";
import ShowSource from "~components/ShowSource";

class SuggestionsExample extends Component {
	constructor() {
		super();
		this.state = { value: "" };
		this.handleValueChange = this.handleValueChange.bind(this);
		this.loadSuggestions = this.loadSuggestions.bind(this);
	}

	handleValueChange(value) {
		this.setState({ value });
	}

	async loadSuggestions(searchText) {
		const suggestions = await new Promise(resolve => {
			setTimeout(() => {
				const suggestions = [
					{
						value: "andrew",
					},
					{
						value: "angela",
					},
					{
						value: "david",
					},
					{
						value: "maria",
					},
				].filter(({ value }) =>
					value.toLowerCase().includes(searchText.toLowerCase()),
				);
				resolve(suggestions);
			}, 1000);
		});

		return suggestions;
	}

	render() {
		return (
			<MDEditor
				onChange={this.handleValueChange}
				value={this.state.value}
				loadSuggestions={this.loadSuggestions}
				textAreaProps={{
					placeholder: "Type the '@' key to pull up suggestions!",
				}}
			>
				<ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
			</MDEditor>
		);
	}
}

const text = `import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "react-smde";
import "react-smde/styles/react-smde.css";

class SuggestionsExample extends Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value){
    this.setState({ value });
  }

  async loadSuggestions(searchText) {
    const suggestions = await new Promise(resolve => {
      setTimeout(() => {
        const suggestions = [
          { value: "andrew" },
          { value: "angela" },
          { value: "david"  },
          { value: "maria"  },
        ].filter(({ value }) =>
          value.toLowerCase().includes(searchText.toLowerCase()),
        );
				resolve(suggestions);
      }, 1000);
  });

  render() {
    return (
      <MDEditor
        onChange={this.handleValueChange}
        value={this.state.value}
        loadSuggestions={this.loadSuggestions}
        textAreaProps={{
          placeholder: "Type the '@' key to pull up suggestions!",
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
			<SuggestionsExample />
		</ShowSource>
	</Container>
);
