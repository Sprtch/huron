import React from "react";
import { ExpandInput } from "../component/Input";

export const CardHeader = (props) => (
  <div className="py-1 px-3">
    <div className="card bg-primary">
      <div className="card-body" style={props.style}>
        <div className="row">{props.children}</div>
      </div>
    </div>
  </div>
);

export const CardHeaderSearch = (props) => (
  <CardHeader style={props.style}>
    <div className="col">
      <ExpandInput
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Filter..."
      />
    </div>
    <div className="col-auto text-right">{props.children}</div>
  </CardHeader>
);
