import React from "react";
import styled from "styled-components";

const _Loading = () => (
  <div className="d-flex justify-content-center">
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export const Loading = styled(_Loading)``;
