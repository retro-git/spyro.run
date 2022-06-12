import styled, { css } from 'styled-components'

const getRowColour = (props) => {
    if (props.cheated) {
        return 'red';
    } else return 'white';
}

const getColWhitespace = (props) => {
  console.log(props.col);
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
  background-color: ${getRowColour};
`;

const LBTableData = styled.td`
  border: 1px solid;
  white-space: ${getColWhitespace};
  padding: 0.3em;
`;

const LBTableDataHead = styled.th`
  border: 1px solid;
`;

const LBTableBody = styled.tbody`
`;

export { LBTable, LBTableHead, LBTableRow, LBTableData, LBTableDataHead, LBTableBody }