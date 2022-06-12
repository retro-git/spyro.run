import styled, { css } from 'styled-components'

const getRowColour = (props) => {
    if (props.cheated) {
        return 'red';
    } else return 'black';
}

const LBTable = styled.table`
`;

const LBTableHead = styled.thead`
`;

const LBTableRow = styled.tr`
  color: ${getRowColour};
`;

const LBTableData = styled.td`
`;

const LBTableBody = styled.tbody`
`;

export { LBTable, LBTableHead, LBTableRow, LBTableData, LBTableBody }