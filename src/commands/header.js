import React from "react";
import SvgIcon from "~icons";

const header = {
  name: "header",
  buttonProps: { "aria-label": "Add header" },
  tooltip: "Add a header",
  icon: <SvgIcon icon="header" />,
  children: [
    {
      name: "header-1",
      icon: <p className="header-1">H1</p>
    },
    {
      name: "header-2",
      icon: <p className="header-2">H2</p>
    },
    {
      name: "header-3",
      icon: <p className="header-3">H3</p>
    },
    {
      name: "header-4",
      icon: <p className="header-4">H4</p>
    },
    {
      name: "header-5",
      icon: <p className="header-5">H5</p>
    },
    {
      name: "header-6",
      icon: <p className="header-6">H6</p>
    }
  ]
};

export default header;
