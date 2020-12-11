import styled from "styled-components";

export const PlainInput = styled.input`
  border-radius: 0px;
  width: 100px;
  border: 1px solid lightgray;
  padding-left: 2px;
`;

export const ExpandInput = styled.input`
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid white;
  outline: 0;
  font-size: 1.3rem;
  color: white;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;

  :focus {
    font-weight: 700;
    border-width: 2px;
    border-image: linear-gradient(to right, white, lightgray);
    border-image-slice: 1;
  }
`;
