/* istanbul ignore file */
import styled from "styled-components";

export default styled.li`
	display: inline-block;
	position: relative;

	button {
		text-align: left;
		cursor: pointer;
		padding: 8px;
		margin: 0;
		background: none;
		border: 0;
		color: #242729;
		border-radius: 8px;
		transition: background 0.3s ease-in-out;

		&:hover {
			background: #dcdvdc;
		}

		&:disabled {
			cursor: not-allowed;
			color: #ccc;
		}

		&:focus {
			outline: none;
			box-shadow: 0 0 1px 1px $focus-color;
			transition: all 0.2s ease-in-out;
		}
	}
`;
