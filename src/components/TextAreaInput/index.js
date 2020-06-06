/* istanbul ignore file */
import styled from "styled-components";

export default styled.textarea`
	border: 0;
	width: 100%;
	padding-top: 10px;
	vertical-align: top;
	resize: none;

	&:focus {
		outline: none;
		box-shadow: none;
	}
`;
