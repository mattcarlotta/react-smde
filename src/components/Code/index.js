import React from "react";
import PropTypes from "prop-types";
import "~styles/code.scss";

const Code = ({ text }) => (
	<pre className="code">
		<code>{text}</code>
	</pre>
);

Code.propTypes = {
	text: PropTypes.string.isRequired,
};

export default Code;
