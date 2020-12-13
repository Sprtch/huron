import React from "react";
import styled from "styled-components";
import { Column, Table, AutoSizer } from "react-virtualized";

export const TWrapper = styled.div`
  .ReactVirtualized__Table {
  }

  .ReactVirtualized__Table__Grid {
  }

  .ReactVirtualized__Table__headerRow {
    font-weight: 700;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
    padding-top: 20px;
    border-bottom: 1px solid #b7b9bd;
    border-top: 1px solid #b7b9bd;
  }
  .ReactVirtualized__Table__row {
    flex-wrap: wrap;
    justify-content: center;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .ReactVirtualized__Table__headerTruncatedText {
    display: inline-block;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .ReactVirtualized__Table__headerColumn,
  .ReactVirtualized__Table__rowColumn {
    margin-right: 10px;
    min-width: 0px;
  }
  .ReactVirtualized__Table__rowColumn {
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ReactVirtualized__Table__headerColumn:first-of-type,
  .ReactVirtualized__Table__rowColumn:first-of-type {
    margin-left: 10px;
  }
  .ReactVirtualized__Table__sortableHeaderColumn {
    cursor: pointer;
  }

  .ReactVirtualized__Table__sortableHeaderIconContainer {
    display: flex;
    align-items: center;
  }
  .ReactVirtualized__Table__sortableHeaderIcon {
    flex: 0 0 24px;
    height: 1em;
    width: 1em;
    fill: currentColor;
  }
`;

const rowRenderer = ({ index }) => {
  if (index < 0) return;
  if (index % 2) {
    return {
      backgroundColor: "#ededed",
      color: "#333",
    };
  }
  return {
    backgroundColor: "#fff",
    color: "#333",
  };
};

export const TableWrapper = (props) => (
  <TWrapper>
    <div style={{ height: props.size }}>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            width={width}
            height={height}
            headerHeight={30}
            rowStyle={rowRenderer}
            rowHeight={width < 820 ? 100 : 50}
            {...props}
          />
        )}
      </AutoSizer>
    </div>
  </TWrapper>
);
