/* istanbul ignore file */
import styled from "styled-components";

export default styled.ul`
	margin: 0;
	padding: 5px;
	list-style: none;
	display: flex;
	flex-wrap: nowrap;

	&.hidden {
		visibility: hidden;
	}
`;
