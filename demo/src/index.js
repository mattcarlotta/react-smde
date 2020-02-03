import React, { Component } from "react";
import { render } from "react-dom";
import MDEditor from "../../src/index.js";
import ReactMarkdown from "react-markdown";
// import MDEditor from "../../dist";
import "../../src/styles/all.scss";
// import "../../dist/styles/react-smde.css";
import "./styles/demo.scss";

class App extends Component {
  state = {
    value: ""
  };

  handleValueChange = value => this.setState({ value });

  loadSuggestions = async searchText => {
    const suggestions = await new Promise(resolve => {
      setTimeout(() => {
        const suggestions = [
          {
            value: "andre"
          },
          {
            value: "angela"
          },
          {
            value: "david"
          },
          {
            value: "louise"
          }
        ].filter(({ value }) =>
          value.toLowerCase().includes(searchText.toLowerCase())
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
      >
        <ReactMarkdown skipHtml>{this.state.value}</ReactMarkdown>
      </MDEditor>
    </div>
  );
}

render(<App />, document.getElementById("root"));
