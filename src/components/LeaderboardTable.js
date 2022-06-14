import styled, { css } from 'styled-components'
import legend from '../assets/legend.json5';

const getRowBgColour = (props) => {
  for (let l of legend) {
    if (props.data[l["name"]]) {
      return l["colour"];
    }
  }

  // Commented out to get test.scss to do its thaang
  //return "#20394f";
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

//
// Messed with everything below to get a less eye-bleedy layout
//

const LBTable = styled.table`
  border: 2px solid #08141e;
  border-collapse: collapse;
`;

// This gives us a nice header that's always in view
const LBTableHead = styled.thead`
  border: 0px solid;
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
	z-index: 2;
`;

const LBTableRow = styled.tr`
  background-color: ${getRowBgColour};
`;

const LBTableRowHead = styled.tr`
`;

const LBTableData = styled.td`
  border-bottom: 2px solid #08141e;
  border-left: 1px solid #08141e;
  white-space: ${getColWhitespace};
  padding: 0.3em;
`;

const LBTableDataHead = styled.th`
  border-bottom: 0px solid;
  white-space: ${getColWhitespace};
  padding: 0.3em;
`;

const LBTableBody = styled.tbody`
`;

export { LBTable, LBTableHead, LBTableRow, LBTableRowHead, LBTableData, LBTableDataHead, LBTableBody }