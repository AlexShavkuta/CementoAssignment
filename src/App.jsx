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
  InputLabel,
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

  useEffect(() => {
    const tableDataFromStorage = localStorage.getItem("tableData");

    if (tableDataFromStorage) {
      console.log("updating state of tableData");
      setTableData(JSON.parse(tableDataFromStorage));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      console.log("saving tableData", tableData);

      const encodedTableData = JSON.stringify(tableData);

      localStorage.setItem("tableData", encodedTableData);
    }
  }, [tableData, isLoaded]);

  const tree = useTree(
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
        break;
      case "boolean":
        return (
          <Chip
            label={data.toString()}
            color={data === true ? "success" : "error"}
          />
        );
        break;
      case "object":
        return (
          <FormControl fullWidth size="small" sx={{}}>
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
        break;
    }
  };

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
      <Table data={{ nodes: tableData.data || {} }} theme={theme} tree={tree}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow sx={{ fontSize: "18px" }}>
                {sortedColumns
                  // .filter((column) => !hiddenColumns.includes(column.title))
                  .map((current, index) => (
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
                    row?.nodes && column.ordinalNo === 1 ? (
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
