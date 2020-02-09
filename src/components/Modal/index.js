import React, { Fragment } from "react";
import PropTypes from "prop-types";
import FlexEnd from "./FlexEnd";
import BackgroundOverlay from "./BackgroundOverlay";
import Center from "./Center";
import CloseModalButton from "./CloseModalButton";
import ClickHandler from "./ClickHandler";
import ModalContent from "./ModalContent";
import ModalContainer from "./ModalContainer";
import WindowContainer from "./WindowContainer";

export const Modal = ({ children, maxWidth, onClick }) => (
	<Fragment>
		<BackgroundOverlay />
		<WindowContainer>
			<ModalContainer>
				<Center maxWidth={maxWidth}>
					<ClickHandler closeModal={onClick}>
						<ModalContent maxWidth={maxWidth}>
							<FlexEnd>
								<CloseModalButton
									id="close-modal"
									aria-label="close modal"
									onClick={onClick}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="26"
										height="26"
										viewBox="0 0 26 26"
									>
										<path
											fill="currentColor"
											d="M21.125,0H4.875C2.182,0,0,2.182,0,4.875v16.25C0,23.818,2.182,26,4.875,26h16.25 C23.818,26,26,23.818,26,21.125V4.875C26,2.182,23.818,0,21.125,0z M18.78,17.394l-1.388,1.387c-0.254,0.255-0.67,0.255-0.924,0 L13,15.313L9.533,18.78c-0.255,0.255-0.67,0.255-0.925-0.002L7.22,17.394c-0.253-0.256-0.253-0.669,0-0.926l3.468-3.467L7.221,9.534 c-0.254-0.256-0.254-0.672,0-0.925l1.388-1.388c0.255-0.257,0.671-0.257,0.925,0L13,10.689l3.468-3.468 c0.255-0.257,0.671-0.257,0.924,0l1.388,1.386c0.254,0.255,0.254,0.671,0.001,0.927l-3.468,3.467l3.468,3.467 C19.033,16.725,19.033,17.138,18.78,17.394z"
										/>
									</svg>
								</CloseModalButton>
							</FlexEnd>
							{children}
						</ModalContent>
					</ClickHandler>
				</Center>
			</ModalContainer>
		</WindowContainer>
	</Fragment>
);

Modal.propTypes = {
	children: PropTypes.node.isRequired,
	maxWidth: PropTypes.string,
	onClick: PropTypes.func,
};

export default Modal;
