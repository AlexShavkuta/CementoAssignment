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
} from "@mui/material";

// Icons
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

import fetchedTableData from "./data/tableData";

import THEME from "./theme.js";

function App() {
  const [tableData, setTableData] = useState(fetchedTableData);
  const [sortedColumns, setSortedColumns] = useState(
    tableData?.columns?.sort((a, b) => a.ordinalNo - b.ordinalNo)
  );
  const [search, setSearch] = useState("");
  const [hiddenColumns, setHiddenColumns] = useState(["Column 1"]);

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

  // A better way is to do it with indexed DB
  useEffect(() => {
    // json encode the data
    const encodedTableData = JSON.stringify(tableData);
    // save into the local storage
    localStorage.setItem("tableData", encodedTableData);
  }, [tableData]);

  // const tree = useTree(
  //   tableData,
  //   {},
  //   {
  //     treeIcon: {
  //       margin: "4px",
  //       iconDefault: <InsertDriveFileOutlinedIcon fontSize="small" />,
  //       iconRight: <FolderIcon fontSize="small" />,
  //       iconDown: <FolderOpenIcon fontSize="small" />,
  //     },
  //   }
  // );

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
            // color="white"
          />
          <Typography variant="h4" component="div" sx={{ color: "gray" }}>
            Data Management System
          </Typography>
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
        // tree={tree}
      >
        {(tableList) => (
          <>
            <Header>
              <HeaderRow sx={{ fontSize: "18px" }}>
                {sortedColumns
                  // .filter((column) => !hiddenColumns.includes(column.title))
                  .map((current) => (
                    <HeaderCell hide={hiddenColumns.includes(current.title)}>
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
                      <CellTree key={column.id} item={row}>
                        {row.title}
                      </CellTree>
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
