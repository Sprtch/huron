import React from "react";
import styled from "styled-components";

const _Loading = () => (
  <div class="d-flex justify-content-center">
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
);

export const Loading = styled(_Loading)``;
