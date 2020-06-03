import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Tooltip from "./Tooltip";

class TooltipContainer extends React.Component {
	state = {
		isVisible: false,
		wasMounted: false,
		container: {
			bottom: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0,
			width: 0,
			x: 0,
			y: 0,
		},
		tooltip: {
			bottom: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0,
			width: 0,
			x: 0,
			y: 0,
		},
	};

	componentDidUpdate = prevProps => {
		if (this.props.overlay !== prevProps.overlay && this.state.wasMounted)
			this.setTooltipDimensions();
		if (this.props.disabled !== prevProps.disabled) this.hideTooltip();
	};

	handleVisibleChange = () => {
		this.setState(
			{
				isVisible: true,
				wasMounted: true,
			},
			this.setTooltipDimensions,
		);
	};

	hideTooltip = () => this.setState({ isVisible: false });

	setTooltipDimensions = () => {
		this.setState(prevState => ({
			container: this.containerRef.getBoundingClientRect(),
			tooltip: this.tooltipRef
				? this.tooltipRef.getBoundingClientRect()
				: prevState.tooltip,
		}));
	};

	render = () => (
		<React.Fragment>
			<div
				data-testid="mde-tooltip-wrapper"
				onMouseEnter={!this.props.disabled ? this.handleVisibleChange : null}
				onMouseLeave={!this.props.disabled ? this.hideTooltip : null}
			>
				<span
					data-testid="mde-tooltip-ref-wrapper"
					ref={node => (this.containerRef = node)}
				>
					{this.props.children}
				</span>
			</div>
			{this.state.wasMounted &&
				ReactDOM.createPortal(
					<Tooltip
						{...this.state}
						data-testid="mde-tooltip-container"
						ref={node => (this.tooltipRef = node)}
						placement={this.props.placement}
					>
						<div data-testid="mde-tooltip-arrow" className="TooltipArrow" />
						<div data-testid="mde-tooltip-overlay" className="TooltipOverlay">
							{this.props.overlay}
						</div>
					</Tooltip>,
					document.body,
				)}
		</React.Fragment>
	);
}

TooltipContainer.propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
	className: PropTypes.string,
	overlay: PropTypes.string.isRequired,
	placement: PropTypes.string.isRequired,
};

export default TooltipContainer;
