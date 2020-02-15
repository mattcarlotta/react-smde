import React from "react";
import PropTypes from "prop-types";

export class ClickHandler extends React.Component {
	state = {
		isVisible: false,
	};

	componentDidMount() {
		document.addEventListener("mousedown", this.handleGlobalClick, false);
	}

	componentWillUnmount() {
		document.removeEventListener("mousedown", this.handleGlobalClick, false);
	}

	handleGlobalClick = ({ target }) => {
		if (
			this.state.isVisible &&
			this.dropdown &&
			!this.dropdown.contains(target)
		) {
			this.closeDropdown();
		}
	};

	closeDropdown = () => this.setState({ isVisible: false });

	handleClick = () =>
		this.setState(prevState => ({ isVisible: !prevState.isVisible }));

	render = () => (
		<div
			className="click-handler"
			style={{ height: "100%", width: "100%" }}
			ref={ref => (this.dropdown = ref)}
		>
			{this.props.children({
				isVisible: this.state.isVisible,
				closeDropdown: this.closeDropdown,
				handleClick: this.handleClick,
			})}
		</div>
	);
}

ClickHandler.propTypes = {
	children: PropTypes.func.isRequired,
};

export default ClickHandler;
