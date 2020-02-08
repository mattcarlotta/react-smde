import React, { Component } from "react";
import { render } from "react-dom";
import ReactMarkdown from "react-markdown";
import MDEditor from "../../src/index.js";
import CodeBlock from "./CodeBlock";
import "../../src/styles/all.scss";
import "./styles/demo.scss";

class App extends Component {
	state = {
		value: "",
	};

	handleValueChange = value => this.setState({ value });

	loadSuggestions = async searchText => {
		const suggestions = await new Promise(resolve => {
			setTimeout(() => {
				const suggestions = [
					{
						value: "andre",
					},
					{
						value: "angela",
					},
					{
						value: "david",
					},
					{
						value: "louise",
					},
				].filter(({ value }) =>
					value.toLowerCase().includes(searchText.toLowerCase()),
				);
				resolve(suggestions);
			}, 1000);
		});

		return suggestions;
	};

	render = () => (
		<div className="container">
			<MDEditor
				onChange={this.handleValueChange}
				value={this.state.value}
				loadSuggestions={this.loadSuggestions}
				maxEditorWidth={800}
			>
				<ReactMarkdown renderers={{ code: CodeBlock }}>
					{this.state.value || "(empty)"}
				</ReactMarkdown>
			</MDEditor>
		</div>
	);
}

render(<App />, document.getElementById("root"));
