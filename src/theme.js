export default {
  Table: ``,
  Header: ``,
  Body: ``,
  BaseRow: `
      background-color: var(--theme-ui-colors-background);
  
      &.row-select-selected, &.row-select-single-selected {
        background-color: var(--theme-ui-colors-background-secondary);
        color: var(--theme-ui-colors-text);
      }
    `,
  HeaderRow: `
      font-size: 14px;
      color: var(--theme-ui-colors-text-light);
  
      .th {
        border-bottom: 1px solid var(--theme-ui-colors-border);
      }
    `,
  Row: `
      font-size: 12px;
      color: var(--theme-ui-colors-text);
  
      &:not(:last-of-type) .td {
        border-bottom: 1px solid var(--theme-ui-colors-border);
      }
  
      &:hover {
        color: var(--theme-ui-colors-text-light);
      }
    `,
  BaseCell: `
      border-bottom: 1px solid transparent;
      border-right: 1px solid transparent;
  
      padding: 8px;
      height: 52px;
    `,
  HeaderCell: ``,
  Cell: ``,
};
