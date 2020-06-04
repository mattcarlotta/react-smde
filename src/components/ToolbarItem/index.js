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
		transition: background 0.2s ease-in-out;

		&:hover {
			background: #c5c4c4;
		}

		&:disabled {
			cursor: not-allowed;
			color: #949494;

			&:hover {
				background: transparent;
			}
		}

		&:focus {
			outline: none;
			box-shadow: 0 0 1px 1px #8f8f8f;
			transition: all 0.2s ease-in-out;
		}
	}
`;
