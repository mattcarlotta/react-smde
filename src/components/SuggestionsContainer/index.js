/* istanbul ignore file */
import styled from "styled-components";

export default styled.ul`
	position: absolute;
	min-width: 180px;
	padding: 0;
	margin: 20px 0 0;
	list-style: none;
	cursor: pointer;
	background: #fff;
	border: 1px solid #c8ccd0;
	border-radius: 3px;
	box-shadow: 0 1px 5px rgba(27, 31, 35, 0.15);
	text-align: left;

	li {
		padding: 4px 8px;

		&:first-child {
			border-top-left-radius: 3px;
			border-top-right-radius: 3px;
		}

		&:last-child {
			border-bottom-right-radius: 3px;
			border-bottom-left-radius: 3px;
		}

		&:hover,
		&[aria-selected="true"] {
			color: #fff;
			background-color: #3c9df8;
		}
	}
`;
