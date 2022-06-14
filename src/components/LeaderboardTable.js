import styled, { css } from 'styled-components'
import legend from '../assets/legend.json5';

const getRowBgColour = (props) => {
  for (let l of legend) {
    if (props.data[l["name"]]) {
      return l["colour"];
    }
  }

  return "grey";
}

const getColWhitespace = (props) => {
  switch (props.col) {
    case "link":
    case "comment":
      return "normal";
    default:
      return "nowrap";
  }
}

const LBTable = styled.table`
  border: 1px solid;
  border-collapse: collapse;
`;

const LBTableHead = styled.thead`
  border: 1px solid;
`;

const LBTableRow = styled.tr`
  background-color: ${getRowBgColour};
`;

const LBTableRowHead = styled.tr`
  background-color: 'grey';
`;

const LBTableData = styled.td`
  border: 1px solid;
  white-space: ${getColWhitespace};
  padding: 0.3em;
`;

const LBTableDataHead = styled.th`
  border: 1px solid;
  white-space: ${getColWhitespace};
  padding: 0.3em;
`;

const LBTableBody = styled.tbody`
`;

export { LBTable, LBTableHead, LBTableRow, LBTableRowHead, LBTableData, LBTableDataHead, LBTableBody }