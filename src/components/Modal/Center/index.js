/* istanbul ignore file */
import styled from "styled-components";

export default styled.div`
	max-width: ${({ maxWidth }) => maxWidth || "500px"};
	width: 100%;
	margin: 0 auto;
`;
