import { useState, useEffect } from "react";

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  useTree,
  CellTree,
  TreeExpandClickTypes,
} from "@table-library/react-table-library/tree";
import {
  TextField,
  Box,
  Toolbar,
  Typography,
  AppBar,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import fetchedTableData from "./data/tableData";

import THEME from "./theme.js";

function App() {
  const [tableData, setTableData] = useState(fetchedTableData);
  const [sortedColumns, _] = useState(
    tableData?.columns?.sort((a, b) => a.ordinalNo - b.ordinalNo)
  );
  const [search, setSearch] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const theme = useTheme(THEME);

  const toggleColumn = (column) => {
    if (hiddenColumns.includes(column)) {
      setHiddenColumns(hiddenColumns.filter((v) => v !== column));
    } else {
      setHiddenColumns(hiddenColumns.concat(column));
    }
  };

  // In the future we can implement elastic search for
  // larger amounts of data and more percise searching.
  const handleSearch = (event) => {
    setSearch(event.target.value);
    setTableData(() => ({
      columns: sortedColumns,
      data: fetchedTableData.data.filter((item) =>
        Object.values(item)
          .join("-")
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ),
    }));
  };

  // It as not performant as it can be
  const handleUpdate = (newData, columnId, rowId) => {
    setTableData((prevState) => ({
      columns: prevState.columns,
      data: prevState.data.map((row) => {
        if (row.id === rowId) {
          return { ...row, [columnId]: newData };
        } else {
          return row;
        }
      }),
    }));
  };

  // For better handling of large amounts of data we could implement
  // the use of indexedDB for local storage alternative.
  useEffect(() => {
    const tableDataFromStorage = localStorage.getItem("tableData");

    if (tableDataFromStorage) {
      setTableData(JSON.parse(tableDataFromStorage));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const encodedTableData = JSON.stringify(tableData);

      localStorage.setItem("tableData", encodedTableData);
    }
  }, [tableData, isLoaded]);

  const treeContext = useTree(
    { nodes: tableData.data },
    {},
    {
      clickType: TreeExpandClickTypes.ButtonClick,
    }
  );

  const renderByType = (data, columnId, rowId) => {
    switch (typeof data) {
      case "number":
      case "string":
        return (
          <TextField
            value={data}
            onChange={(event) =>
              handleUpdate(event.target.value, columnId, rowId)
            }
            variant="outlined"
            size="small"
            sx={{ color: "white" }}
          />
        );
      case "boolean":
        return (
          <Chip
            label={data.toString()}
            color={data === true ? "success" : "error"}
          />
        );
      case "object":
        return (
          <FormControl fullWidth size="small">
            <Select
              value={data.value}
              label="Age"
              onChange={(event) =>
                handleUpdate(
                  { ...data, value: event.target.value },
                  columnId,
                  rowId
                )
              }
            >
              {data.options.map((current) => (
                <MenuItem value={current.value}>{current.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
    }
  };

  // So if you will hide the first column the tree icon won't be hidden with it
  const ordinalNoOfFirstColumn = sortedColumns
    ?.filter((current) => !hiddenColumns.includes(current.title))
    .shift()?.ordinalNo;

  // If we will use large amounts of data we can add a skeleton loader
  // for better user experience.
  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "white", paddingY: 2 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <TextField
            label="Search Task"
            value={search}
            onChange={handleSearch}
          />
          <Typography variant="h4" component="div" sx={{ color: "gray" }}>
            Data Management System
          </Typography>
          <Button onClick={() => localStorage.clear()}>Reset Storage</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            width: "90%",
            borderRadius: 2,
            backgroundColor: "#283593",
            marginY: 2,
            paddingX: 2,
            color: "white",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{ textAlign: "center", marginY: 2 }}
          >
            Want to hide a column?
          </Typography>
          <FormGroup
            sx={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {sortedColumns.map((currentColumn) => (
              <FormControlLabel
                key={currentColumn.id}
                control={
                  <Checkbox
                    checked={!hiddenColumns.includes(currentColumn.title)}
                  />
                }
                onChange={() => toggleColumn(currentColumn.title)}
                label={currentColumn.title}
              />
            ))}
          </FormGroup>
        </Box>
      </Box>
      <Table
        data={{ nodes: tableData.data || {} }}
        theme={theme}
        tree={treeContext}
      >
        {(tableList) => (
          <>
            <Header>
              <HeaderRow sx={{ fontSize: "18px" }}>
                {sortedColumns.map((current, index) => (
                  <HeaderCell
                    key={index}
                    hide={hiddenColumns.includes(current.title)}
                  >
                    {current.title}
                  </HeaderCell>
                ))}
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((row) => (
                <Row key={row.rowId} item={row}>
                  {sortedColumns.map((column) =>
                    row?.nodes &&
                    column.ordinalNo === ordinalNoOfFirstColumn ? (
                      <>
                        <CellTree
                          key={column.id}
                          item={row}
                          hide={hiddenColumns.includes(column.title)}
                        >
                          {renderByType(row[column.id], column.id, row.id)}
                        </CellTree>
                      </>
                    ) : (
                      <Cell
                        key={column.id}
                        align="center"
                        hide={hiddenColumns.includes(column.title)}
                      >
                        {renderByType(row[column.id], column.id, row.id)}
                      </Cell>
                    )
                  )}
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </Box>
  );
}

export default App;
