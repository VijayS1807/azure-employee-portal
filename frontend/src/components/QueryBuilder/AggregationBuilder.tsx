// import {
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   IconButton,
//   Button,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useDraggable, useDroppable } from "@dnd-kit/core";
// import AddIcon from "@mui/icons-material/Add";

// import FieldSelect from "./FieldSelect";
// import QueryRow from "./QueryRow";

// export default function AggregationBuilder({
//   model,
//   setModel,
//   columns,
//   tables,
// }: any) {
//   const { setNodeRef } = useDroppable({ id: "values" });

//   //   function remove(id: number) {
//   //     setModel((prev: any) => ({
//   //       ...prev,
//   //       values: prev.values.filter((v: any) => v.columnId !== id),
//   //     }));
//   //   }

//   // function add() {
//   //   setModel((prev: any) => ({
//   //     ...prev,
//   //     values: [
//   //       ...prev.values,
//   //       {
//   //         columnId: columns[0]?.Id,
//   //         aggregate: "SUM",
//   //       },
//   //     ],
//   //   }));
//   // }

//   function add() {
//     const firstCol = columns?.[0];
//     if (!firstCol) return;

//     const newAgg = {
//       columnId: firstCol.Id,
//       aggregate: "SUM",
//     };

//     setModel((prev: any) => ({
//       ...prev,
//       values: [...prev.values, newAgg],

//       // ✅ sync having
//       having: [
//         ...(prev.having || []),
//         {
//           columnId: firstCol.Id,
//           aggregate: "SUM",
//           operator: ">",
//           value: "",
//           active: false,
//         },
//       ],
//     }));
//   }

//   // function remove(index: number) {
//   //   const arr = [...model.values];

//   //   arr.splice(index, 1);

//   //   setModel({ ...model, values: arr });
//   // }

//   function remove(index: number) {
//     const removed = model.values[index];

//     const valuesArr = [...model.values];
//     valuesArr.splice(index, 1);

//     // ✅ remove corresponding HAVING
//     const havingArr = (model.having || []).filter(
//       (h: any) => h.columnId !== removed.columnId,
//     );

//     setModel({
//       ...model,
//       values: valuesArr,
//       having: havingArr,
//     });
//   }

//   function changeAgg(id: number, agg: string) {
//     setModel((prev: any) => ({
//       ...prev,
//       values: prev.values.map((v: any) => {
//         if (v.columnId === id) {
//           return { ...v, aggregate: agg };
//         }

//         return v;
//       }),
//     }));
//   }

//   return (
//     <Paper sx={{ p: 2 }} ref={setNodeRef}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h6">Aggregations</Typography>

//         <Button size="small" startIcon={<AddIcon />} onClick={add}>
//           Add
//         </Button>
//       </div>

//       {model?.values?.map((v: any, i: number) => {
//         const col = columns.find((c: any) => c.Id === v.columnId);

//         return (
//           //   <div
//           //     key={v.columnId}
//           //     style={{
//           //       display: "flex",
//           //       gap: 10,
//           //       alignItems: "center",
//           //     }}
//           //   >
//           //     {col?.DisplayName}

//           //     <Select
//           //       size="small"
//           //       value={v.aggregate}
//           //       onChange={(e) => changeAgg(v.columnId, e.target.value)}
//           //     >

//           <QueryRow key={i}>
//             <FieldSelect
//               value={v.columnId}
//               className="qb-field qb-direction"
//               columns={columns}
//               tables={tables}
//               onChange={(value: number) => {
//                 const arr = [...model.values];

//                 arr[i].columnId = value;

//                 setModel({ ...model, values: arr });
//               }}
//             />

//             <Select
//               size="small"
//               value={v.aggregate}
//               onChange={(e) => {
//                 const arr = [...model.values];

//                 arr[i].aggregate = e.target.value;

//                 setModel({ ...model, values: arr });
//               }}
//             >
//               <MenuItem value="SUM">SUM</MenuItem>
//               <MenuItem value="COUNT">COUNT</MenuItem>
//               <MenuItem value="AVG">AVG</MenuItem>
//               <MenuItem value="MIN">MIN</MenuItem>
//               <MenuItem value="MAX">MAX</MenuItem>
//             </Select>

//             <IconButton onClick={() => remove(i)}>
//               <DeleteIcon />
//             </IconButton>
//           </QueryRow>
//         );
//       })}

//       {/* {model?.values?.map((v: any, i: number) => (
//         <DraggableAggregationRow
//           key={`${v.columnId}-${i}`}
//           v={v}
//           i={i}
//           columns={columns}
//           tables={tables}
//           model={model}
//           setModel={setModel}
//           remove={remove}
//         />
//       ))} */}
//     </Paper>
//   );
// }

// function DraggableAggregationRow({
//   v,
//   i,
//   columns,
//   tables,
//   model,
//   setModel,
//   remove,
// }: any) {
//   const { attributes, listeners, setNodeRef } = useDraggable({
//     id: `agg-${v.columnId}-${i}`, // UNIQUE
//     data: {
//       columnId: v.columnId,
//       type: "aggregation",
//       aggregate: v.aggregate,
//     },
//   });

//   return (
//     <div ref={setNodeRef} {...listeners} {...attributes}>
//       <QueryRow>
//         <FieldSelect
//           value={v.columnId}
//           className="qb-field qb-direction"
//           columns={columns}
//           tables={tables}
//           onChange={(value: number) => {
//             const arr = [...model.values];
//             arr[i].columnId = value;
//             setModel({ ...model, values: arr });
//           }}
//         />

//         <Select
//           size="small"
//           value={v.aggregate}
//           // onChange={(e) => {
//           //   const arr = [...model.values];
//           //   arr[i].aggregate = e.target.value;
//           //   setModel({ ...model, values: arr });
//           // }}
//           onChange={(e) => {
//             const newAgg = e.target.value;

//             const valuesArr = [...model.values];
//             valuesArr[i].aggregate = newAgg;

//             // ✅ sync to having
//             const havingArr = (model.having || []).map((h: any) => {
//               if (h.columnId === v.columnId) {
//                 return { ...h, aggregate: newAgg };
//               }
//               return h;
//             });

//             setModel({
//               ...model,
//               values: valuesArr,
//               having: havingArr,
//             });
//           }}
//         >
//           <MenuItem value="SUM">SUM</MenuItem>
//           <MenuItem value="COUNT">COUNT</MenuItem>
//           <MenuItem value="AVG">AVG</MenuItem>
//           <MenuItem value="MIN">MIN</MenuItem>
//           <MenuItem value="MAX">MAX</MenuItem>
//         </Select>

//         <IconButton onClick={() => remove(i)}>
//           <DeleteIcon />
//         </IconButton>
//       </QueryRow>
//     </div>
//   );
// }

//////////

/// simplified version without add/remove or drag-and-drop, since having should only be based on values
import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";

import FieldSelect from "./FieldSelect";
import QueryRow from "./QueryRow";

import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";

export default function AggregationBuilder({
  model,
  setModel,
  columns,
  tables,
  errors,
  expandAll,
}: any) {
  const { setNodeRef } = useDroppable({ id: "values" });

  const [expanded, setExpanded] = useState(expandAll);
  const count = model?.values?.length || 0;

  useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  // ✅ ADD
  // function add() {
  //   const firstCol = columns?.[0];
  //   if (!firstCol) return;

  //   const newAgg = {
  //     columnId: firstCol.Id,
  //     aggregate: "SUM",
  //   };

  //   setModel((prev: any) => ({
  //     ...prev,
  //     values: [...prev.values, newAgg],

  //     // ✅ sync HAVING
  //     having: [
  //       ...(prev.having || []),
  //       {
  //         columnId: firstCol.Id,
  //         aggregate: "SUM",
  //         operator: ">",
  //         value: "",
  //         active: false,
  //       },
  //     ],
  //   }));
  // }

  // function add() {
  //   const firstCol = columns?.[0];
  //   if (!firstCol) return;

  //   const newValues = [
  //     ...model.values,
  //     {
  //       columnId: firstCol.Id,
  //       aggregate: "SUM",
  //     },
  //   ];

  //   setModel((prev: any) => ({
  //     ...prev,
  //     values: newValues,

  //     // ✅ ALWAYS SYNC
  //     having: newValues.map((v: any) => {
  //       const existing = (prev.having || []).find(
  //         (h: any) => h.columnId === v.columnId,
  //       );

  //       return (
  //         existing || {
  //           columnId: v.columnId,
  //           aggregate: v.aggregate,
  //           operator: ">",
  //           value: "",
  //           active: false,
  //         }
  //       );
  //     }),
  //   }));
  // }

  const getColumnType = (columnId: number) => {
    const col = columns.find((c: any) => c.Id === columnId);
    console.log("col :", col);
    if (!col) return "string";

    const type = col.DataType?.toLowerCase();

    if (["int", "bigint", "decimal", "float", "numeric"].includes(type))
      return "number";

    if (["date", "datetime", "timestamp"].includes(type)) return "date";

    if (["bit", "boolean"].includes(type)) return "boolean";

    return "string";
  };

  function add() {
    // console.log("add clicked", columns);
    // const firstCol = columns?.[0];
    // if (!firstCol) return;

    // setModel((prev: any) => ({
    //   ...prev,
    //   values: [
    //     ...prev.values,
    //     {
    //       columnId: firstCol.Id,
    //       aggregate: "SUM",
    //       alias: `SUM_(${firstCol.DisplayName || ""})`, // ✅ DEFAULT ALIAS
    //     },
    //   ],
    // }));

    console.log("columns ", columns);

    const defaultColumnId = columns?.[0]?.Id;

    const type = getColumnType(defaultColumnId);
    const aggs = AGGREGATE_CONFIG[type] || ["COUNT"];

    setModel((prev: any) => ({
      ...prev,
      values: [
        ...prev.values,
        {
          columnId: columns[0]?.Id,
          //operator: "=",
          //operator: ops[0]?.value || "",
          //value: "",
          //condition: "AND",
          aggregate: "COUNT",
          dataType: columns[0].DataType,
          alias: `SUM_(${columns[0].DisplayName || ""})`,

          // columnId,
          // aggregate: "SUM",
          // alias: `SUM_(${col?.DisplayName || ""})`, // ✅ DEFAULT
          // dataType: col?.DataType,
        },
      ],
    }));
  }

  // ✅ REMOVE
  // function remove(index: number) {
  //   const removed = model.values[index];

  //   const valuesArr = [...model.values];
  //   valuesArr.splice(index, 1);

  //   const havingArr = (model.having || []).filter(
  //     (h: any) => h.columnId !== removed.columnId,
  //   );

  //   setModel({
  //     ...model,
  //     values: valuesArr,
  //     having: havingArr,
  //   });
  // }

  // function remove(index: number) {
  //   const valuesArr = [...model.values];
  //   valuesArr.splice(index, 1);

  //   setModel((prev: any) => ({
  //     ...prev,
  //     values: valuesArr,

  //     // ✅ ALWAYS SYNC
  //     having: valuesArr.map((v: any) => {
  //       const existing = (prev.having || []).find(
  //         (h: any) => h.columnId === v.columnId,
  //       );

  //       return (
  //         existing || {
  //           columnId: v.columnId,
  //           aggregate: v.aggregate,
  //           operator: ">",
  //           value: "",
  //           active: false,
  //         }
  //       );
  //     }),
  //   }));
  // }
  function remove(index: number) {
    const valuesArr = [...model.values];
    valuesArr.splice(index, 1);

    setModel({
      ...model,
      values: valuesArr,
    });
  }

  function update(index: number, key: string, value: any) {
    const arr = [...model.values];
    arr[index][key] = value;

    setModel({
      ...model,
      values: arr,
    });
  }

  const AGG_OPERATOR_CONFIG = [
    { label: "=", value: "=" },
    { label: "!=", value: "!=" },
    { label: ">", value: ">" },
    { label: ">=", value: ">=" },
    { label: "<", value: "<" },
    { label: "<=", value: "<=" },
    { label: "Is empty", value: "is_empty" },
    { label: "Is not empty", value: "is_not_empty" },
    { label: "Is any of", value: "in" }, // optional advanced
  ];

  const renderAggValue = (a: any, i: number) => {
    if (["is_empty", "is_not_empty"].includes(a.operator)) return null;

    if (a.operator === "in") {
      return (
        <TextField
          size="small"
          placeholder="e.g. 10,20,30"
          value={a.value || ""}
          onChange={(e) => update(i, "value", e.target.value)}
        />
      );
    }
    return (
      <TextField
        size="small"
        type="number"
        value={a.value || ""}
        onChange={(e) => update(i, "value", e.target.value)}
        error={errors?.aggregate?.[i]?.value}
      />
    );
  };

  const AGGREGATE_CONFIG: Record<string, string[]> = {
    number: ["SUM", "AVG", "MIN", "MAX", "COUNT"],
    date: ["MIN", "MAX", "COUNT"],
    string: ["COUNT"],
    boolean: ["COUNT"],
  };

  return (
    <Paper sx={{ p: 2 }} ref={setNodeRef}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* <Typography variant="h6">Aggregations</Typography>

        <Button size="small" startIcon={<AddIcon />} onClick={add}>
          Add
        </Button> */}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Typography variant="h6">Aggregations</Typography>

          {!expanded && count > 0 && (
            <Chip size="small" label={`${count} field(s)`} />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tooltip title={expanded ? "Collapse" : "Expand"}>
            <IconButton
            //onClick={() => setExpanded((p) => !p)}
            >
              {expanded ? (
                <ExpandLessIcon onClick={() => setExpanded((p: any) => !p)} />
              ) : (
                <ExpandMoreIcon onClick={() => setExpanded((p: any) => !p)} />
              )}
            </IconButton>
          </Tooltip>

          <Button size="small" startIcon={<AddIcon />} onClick={add}>
            Add
          </Button>
        </div>
      </div>
      <Collapse
        in={expanded}
        // timeout="auto"
        // unmountOnExit
        timeout={300}
        sx={{ overflow: "hidden" }}
      >
        <div>
          {expanded &&
            model?.values?.map(
              (v: any, i: number) =>
                //(
                {
                  const type = getColumnType(v.columnId);
                  const aggregates = AGGREGATE_CONFIG[type] || ["COUNT"];
                  return (
                    <QueryRow key={i}>
                      {/* COLUMN */}
                      <FieldSelect
                        value={v.columnId}
                        className="qb-field qb-direction"
                        columns={columns}
                        tables={tables}
                        error={errors?.values?.[i]?.columnId}
                        helperText={errors?.values?.[i]?.columnId}
                        // onChange={(value: number) => {
                        //   const oldColumnId = v.columnId;

                        //   const valuesArr = [...model.values];
                        //   valuesArr[i].columnId = value;

                        //   // ✅ sync HAVING column
                        //   const havingArr = (model.having || []).map((h: any) => {
                        //     if (h.columnId === oldColumnId) {
                        //       return { ...h, columnId: value };
                        //     }
                        //     return h;
                        //   });

                        //   setModel({
                        //     ...model,
                        //     values: valuesArr,
                        //     having: havingArr,
                        //   });
                        // }}
                        // onChange={(value: number) => {
                        //   const valuesArr = [...model.values];
                        //   valuesArr[i].columnId = value;

                        //   setModel((prev: any) => ({
                        //     ...prev,
                        //     values: valuesArr,

                        //     // ✅ ALWAYS SYNC
                        //     having: valuesArr.map((v: any) => {
                        //       const existing = (prev.having || []).find(
                        //         (h: any) => h.columnId === v.columnId,
                        //       );

                        //       return (
                        //         existing || {
                        //           columnId: v.columnId,
                        //           aggregate: v.aggregate,
                        //           operator: ">",
                        //           value: "",
                        //           active: false,
                        //         }
                        //       );
                        //     }),
                        //   }));
                        // }}

                        // onChange={(value: number) => {
                        //   const col = columns.find((c: any) => c.Id === value);

                        //   const valuesArr = [...model.values];
                        //   valuesArr[i].columnId = value;

                        //   // ✅ AUTO UPDATE ALIAS
                        //   //valuesArr[i].alias =`${valuesArr[i].aggregate}(${col?.DisplayName || ""})`;
                        //   valuesArr[i].alias =
                        //     `${valuesArr[i].aggregate}_${col?.DisplayName || ""}`;

                        //   setModel({
                        //     ...model,
                        //     values: valuesArr,
                        //   });
                        // }}
                        onChange={(v: number) => {
                          //const type = getColumnType(v);
                          //const aggs = AGGREGATE_CONFIG[type] || ["COUNT"];
                          //const aggs = AGG_OPERATOR_CONFIG[type] || ["COUNT"];

                          const newType = getColumnType(v);
                          const aggs = AGGREGATE_CONFIG[newType] || ["COUNT"];

                          update(i, "columnId", v);
                          update(i, "aggregate", aggs[0]);
                          //update(i, "operator", ">");
                          //update(i, "value", "");
                        }}
                      />

                      {/* AGGREGATE */}
                      <Select
                        size="small"
                        value={v.aggregate}
                        // onChange={(e) => {
                        //   const newAgg = e.target.value;

                        //   const valuesArr = [...model.values];
                        //   valuesArr[i].aggregate = newAgg;

                        //   // ✅ sync HAVING aggregate
                        //   const havingArr = (model.having || []).map((h: any) => {
                        //     if (h.columnId === v.columnId) {
                        //       return { ...h, aggregate: newAgg };
                        //     }
                        //     return h;
                        //   });

                        //   setModel({
                        //     ...model,
                        //     values: valuesArr,
                        //     having: havingArr,
                        //   });
                        // }}
                        // onChange={(e) => {
                        //   const newAgg = e.target.value;

                        //   const valuesArr = [...model.values];
                        //   valuesArr[i].aggregate = newAgg;

                        //   setModel((prev: any) => ({
                        //     ...prev,
                        //     values: valuesArr,

                        //     // ✅ ALWAYS SYNC
                        //     having: valuesArr.map((v: any) => {
                        //       const existing = (prev.having || []).find(
                        //         (h: any) => h.columnId === v.columnId,
                        //       );

                        //       return {
                        //         ...(existing || {
                        //           columnId: v.columnId,
                        //           operator: ">",
                        //           value: "",
                        //           active: false,
                        //         }),
                        //         aggregate: v.aggregate,
                        //       };
                        //     }),
                        //   }));
                        // }}

                        // onChange={(e) => {
                        //   const newAgg = e.target.value;

                        //   const col = columns.find((c: any) => c.Id === v.columnId);

                        //   const valuesArr = [...model.values];
                        //   valuesArr[i].aggregate = newAgg;

                        //   // ✅ AUTO UPDATE ALIAS
                        //   //valuesArr[i].alias = `${newAgg}(${col?.DisplayName || ""})`;
                        //   valuesArr[i].alias = `${newAgg}_${col?.DisplayName || ""}`;

                        //   setModel({
                        //     ...model,
                        //     values: valuesArr,
                        //   });
                        // }}
                        onChange={(e) => update(i, "aggregate", e.target.value)}
                        error={errors?.values?.[i]?.aggregate}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            ...(errors?.values?.[i]?.aggregate && {
                              border: "1px solid #ff4d4f",
                              borderRadius: "6px",
                            }),
                          },
                        }}
                      >
                        {/* <MenuItem value="SUM">SUM</MenuItem>
                  <MenuItem value="COUNT">COUNT</MenuItem>
                  <MenuItem value="AVG">AVG</MenuItem>
                  <MenuItem value="MIN">MIN</MenuItem>
                  <MenuItem value="MAX">MAX</MenuItem> */}

                        {/* {AGG_OPERATOR_CONFIG.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                      {op.label}
                    </MenuItem>
                  ))} */}
                        {aggregates.map((agg) => (
                          <MenuItem key={agg} value={agg}>
                            {agg}
                          </MenuItem>
                        ))}
                      </Select>
                      {/* <TextField
                        size="small"
                        placeholder="Alias"
                        value={v.alias || ""}
                        className="qb-field"
                        type="number" // 🔥 Aggregation always numeric (aggregate result)
                        // onChange={(e) => {
                        //   const valuesArr = [...model.values];
                        //   valuesArr[i].alias = e.target.value;

                        //   setModel({
                        //     ...model,
                        //     values: valuesArr,
                        //   });
                        // }}
                        onChange={(e) => update(i, "alias", e.target.value)}
                        error={errors?.values?.[i]?.alias}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            ...(errors?.values?.[i]?.alias && {
                              border: "1px solid #ff4d4f",
                              borderRadius: "6px",
                            }),
                          },
                        }}
                      /> */}
                      {/* ✅ ALIAS INPUT */}
                      <TextField
                        size="small"
                        placeholder="Alias"
                        value={v.alias || ""}
                        className="qb-field"
                        onChange={(e) => update(i, "alias", e.target.value)}
                        error={errors?.select?.[i]?.alias}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            ...(errors?.select?.[i]?.alias && {
                              border: "1px solid #ff4d4f",
                              borderRadius: "6px",
                            }),
                          },
                        }}
                      />
                      {/* {renderAggValue(v, i)} */}
                      {/* DELETE */}
                      <IconButton onClick={() => remove(i)}>
                        <DeleteIcon />
                      </IconButton>
                    </QueryRow>
                  );
                },
              //)
            )}
        </div>
      </Collapse>
    </Paper>
  );
}

// simplified version without add/remove or drag-and-drop, since having should only be based on values
