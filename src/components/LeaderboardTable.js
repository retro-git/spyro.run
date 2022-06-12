import styled, { css } from 'styled-components'

const getRowColour = (props) => {
    if (props.cheated) {
        return 'red';
    } else return 'white';
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
`;

const LBTableDataHead = styled.th`
  border: 1px solid;
`;

const LBTableBody = styled.tbody`
`;

export { LBTable, LBTableHead, LBTableRow, LBTableData, LBTableDataHead, LBTableBody }