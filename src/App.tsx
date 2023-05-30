import { ThemeProvider, AnalyticalTable } from "@ui5/webcomponents-react";
import { useState, useEffect } from "react";

const DATA = [
  {
    name: "Name1 - with empty sub rows array (expand arrow is displayed because of custom hook)",
    id: "0",
    subRows: [],
  },
  { name: "Name2 - w/o sub rows" },
  {
    name: "Name3 - with initial sub rows",
    subRows: [{ name: "Peter", subRows: [] }],
  },
  {
    name: "Name4 - with `expanded` property defined in manualExpandedKey",
    subRows: [],
    // You have to make sure to update the `expanded` property to the current state when the row is toggled
    expanded: false,
  },
];

const DATA_EXPANDED = [
  {
    name: "Name1 - with empty sub rows array (expand arrow is displayed because of custom hook)",
    id: "0",
    subRows: [{ name: "Peter" }],
  },
  { name: "Name2 - w/o sub rows" },
  {
    name: "Name3 - with initial sub rows",
    subRows: [{ name: "Peter", subRows: [] }],
  },
  {
    name: "Name4 - with `expanded` property defined in manualExpandedKey",
    subRows: [],
    // You have to make sure to update the `expanded` property to the current state when the row is toggled
    expanded: false,
  },
];

const COLUMNS = [{ accessor: "name", Header: "Name" }];

const useLazyExpand = (hooks) => {
  hooks.getToggleRowExpandedProps.push((props, { row }) => {
    // here you can define custom logic, for when a row should be expandable
    if (row.original.subRows) {
      row.canExpand = true;
    }
    return props;
  });
};

function App() {
  const [data, setData] = useState(DATA);
  const [loading, setLoading] = useState<string | boolean>(false);
  const handleExpandChange = (e) => {
    const { isExpanded, original } = e.detail.row;
    console.log(original.id);
    if (original.id === "0") {
      setLoading(!isExpanded ? "expanded" : "collapsed");
    }
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        if (loading === "expanded") {
          setData(() => DATA_EXPANDED);
        } else {
          setData(DATA);
        }
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  return (
    <ThemeProvider>
      If you expand the first entry, the sub-rows of this row will be fake lazy
      loaded
      <br />
      <br />
      <AnalyticalTable
        loading={!!loading}
        showOverlay={!!loading}
        onRowExpandChange={handleExpandChange}
        data={data}
        columns={COLUMNS}
        isTreeTable
        tableHooks={[useLazyExpand]}
        // here you can define a key that controls the state of the rows. If this key is found the row includes the expand icon, with the respective state.
        reactTableOptions={{
          manualExpandedKey: "expanded",
          autoResetExpanded: false,
        }}
      />
    </ThemeProvider>
  );
}

export default App;
