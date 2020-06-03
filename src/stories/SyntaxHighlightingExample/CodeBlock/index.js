import React from "react";
import PropTypes from "prop-types";
import hljs from "highlight.js";
import "highlight.js/styles/atelier-forest-light.css";

class CodeBlock extends React.PureComponent {
	componentDidMount() {
		this.highlightCode();
	}

	componentDidUpdate() {
		this.highlightCode();
	}

	highlightCode() {
		hljs.highlightBlock(this.codeEl);
	}

	render() {
		return (
			<pre>
				<code
					ref={node => (this.codeEl = node)}
					className={`language-${this.props.language}`}
				>
					{this.props.value}
				</code>
			</pre>
		);
	}
}

CodeBlock.defaultProps = {
	language: "",
};

CodeBlock.propTypes = {
	value: PropTypes.string.isRequired,
	language: PropTypes.string,
};

export default CodeBlock;
