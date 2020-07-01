/* istanbul ignore file */
import styled from "styled-components";

export default styled.span`
	color: #a0a0a0;
	user-select: none;
	${({ disableGrip }) =>
		!disableGrip
			? "position:absolute;right: 20px;bottom: 0px;"
			: "text-align: center;"};
`;
