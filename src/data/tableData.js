// import axios from "axios";

const fetchTableData = () => {
  // In the future fetch the data from faker
  return {
    columns: [
      { id: "col1", ordinalNo: 1, title: "Column 1", type: "string" },
      { id: "col2", ordinalNo: 2, title: "Column 2", type: "number" },
      { id: "col3", ordinalNo: 3, title: "Column 3", type: "string" },
      { id: "col4", ordinalNo: 4, title: "Column 4", type: "number" },
      { id: "col5", ordinalNo: 5, title: "Column 5", type: "string" },
      { id: "col6", ordinalNo: 6, title: "Column 6", type: "number" },
      { id: "col7", ordinalNo: 7, title: "Column 7", type: "string" },
    ],
    data: [
      {
        id: "row1",
        col1: "Data 1-1",
        col2: false,
        col3: "Data 1-3",
        col4: true,
        col5: "Data 1-5",
        col6: 15,
        col7: "Data 1-7",
      },
      {
        id: "row2",
        col1: "Data 2-1",
        col2: 200,
        col3: "Data 2-3",
        col4: 20,
        col5: "Data 2-5",
        col6: 25,
        col7: "Data 2-7",
      },
      {
        id: "row3",
        col1: "Data 3-1",
        col2: 300,
        col3: "Data 3-3",
        col4: 30,
        col5: "Data 3-5",
        col6: 35,
        col7: "Data 3-7",
      },
      {
        id: "row4",
        col1: "Data 4-1",
        col2: 400,
        col3: "Data 4-3",
        col4: 40,
        col5: "Data 4-5",
        col6: 45,
        col7: "Data 4-7",
      },
      {
        id: "row5",
        col1: "Data 5-1",
        col2: 500,
        col3: "Data 5-3",
        col4: 50,
        col5: "Data 5-5",
        col6: 55,
        col7: "Data 5-7",
      },
      {
        id: "row6",
        col1: "Data 6-1",
        col2: 600,
        col3: "Data 6-3",
        col4: 60,
        col5: "Data 6-5",
        col6: 65,
        col7: "Data 6-7",
      },
      {
        id: "row7",
        col1: "Data 7-1",
        col2: 700,
        col3: "Data 7-3",
        col4: 70,
        col5: "Data 7-5",
        col6: 75,
        col7: "Data 7-7",
      },
      {
        id: "row8",
        col1: "Data 8-1",
        col2: 800,
        col3: "Data 8-3",
        col4: 80,
        col5: "Data 8-5",
        col6: 85,
        col7: "Data 8-7",
      },
      {
        id: "row9",
        col1: "Data 9-1",
        col2: 900,
        col3: "Data 9-3",
        col4: 90,
        col5: "Data 9-5",
        col6: 95,
        col7: "Data 9-7",
      },
      {
        id: "row10",
        col1: "Data 10-1",
        col2: 1000,
        col3: "Data 10-3",
        col4: 100,
        col5: "Data 10-5",
        col6: 105,
        col7: "Data 10-7",
      },
    ],
  };
};

// in the future we can add here some data sorting
// and fetching functions and wrappers for this basic
// fetch function or in addition to it.
export default fetchTableData();
