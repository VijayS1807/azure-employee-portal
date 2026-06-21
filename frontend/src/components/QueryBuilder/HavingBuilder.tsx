// import {
//   Paper,
//   Typography,
//   Button,
//   IconButton,
//   Select,
//   MenuItem,
//   TextField,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import { useDroppable } from "@dnd-kit/core";

// import FieldSelect from "./FieldSelect";
// import QueryRow from "./QueryRow";

// export default function HavingBuilder({
//   model,
//   setModel,
//   columns,
//   tables,
// }: any) {
//   const { setNodeRef } = useDroppable({ id: "having" });

//   function addHaving() {
//     setModel((prev: any) => ({
//       ...prev,
//       having: [
//         ...prev.having,
//         {
//           columnId: columns[0]?.Id,
//           aggregate: "SUM",
//           operator: ">",
//           value: "",
//         },
//       ],
//     }));
//   }

//   function remove(index: number) {
//     const arr = [...model.having];
//     arr.splice(index, 1);
//     setModel({ ...model, having: arr });
//   }

//   function update(index: number, key: string, value: any) {
//     const arr = [...model.having];
//     arr[index][key] = value;
//     setModel({ ...model, having: arr });
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
//         <Typography variant="h6">HAVING</Typography>
//         <Button size="small" startIcon={<AddIcon />} onClick={addHaving}>
//           Add
//         </Button>
//       </div>

//       {model.having?.map((h: any, i: number) => (
//         <QueryRow key={i}>
//           <FieldSelect
//             value={h.columnId}
//             columns={columns}
//             tables={tables}
//             onChange={(v: number) => update(i, "columnId", v)}
//           />

//           <Select
//             size="small"
//             value={h.aggregate}
//             onChange={(e) => update(i, "aggregate", e.target.value)}
//           >
//             <MenuItem value="SUM">SUM</MenuItem>
//             <MenuItem value="COUNT">COUNT</MenuItem>
//             <MenuItem value="AVG">AVG</MenuItem>
//             <MenuItem value="MIN">MIN</MenuItem>
//             <MenuItem value="MAX">MAX</MenuItem>
//           </Select>

//           <Select
//             size="small"
//             value={h.operator}
//             onChange={(e) => update(i, "operator", e.target.value)}
//           >
//             <MenuItem value=">">{">"}</MenuItem>
//             <MenuItem value="<">{"<"}</MenuItem>
//             <MenuItem value="=">=</MenuItem>
//             <MenuItem value=">=">{">="}</MenuItem>
//             <MenuItem value="<=">{"<="}</MenuItem>
//           </Select>

//           <TextField
//             size="small"
//             value={h.value}
//             onChange={(e) => update(i, "value", e.target.value)}
//           />

//           <IconButton onClick={() => remove(i)}>
//             <DeleteIcon />
//           </IconButton>
//         </QueryRow>
//       ))}
//     </Paper>
//   );
// }

//////

// import {
//   Paper,
//   Typography,
//   Button,
//   IconButton,
//   Select,
//   MenuItem,
//   TextField,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import { useDroppable } from "@dnd-kit/core";

// import FieldSelect from "./FieldSelect";
// import QueryRow from "./QueryRow";
// import DraggableValueRow from "./ValuesBuilder";

// export default function HavingBuilder({
//   model,
//   setModel,
//   fields,
//   tables,
// }: any) {
//   const { setNodeRef } = useDroppable({ id: "having" });

//   function addHaving() {
//     if (!model.values?.length) return;
//     const val = model.values[0];
//     setModel((prev: any) => ({
//       ...prev,
//       having: [
//         ...prev.having,
//         {
//           columnId: val.columnId,
//           aggregate: val.aggregate,
//           operator: ">",
//           value: "",
//         },
//       ],
//     }));
//   }

//   function remove(index: number) {
//     const arr = [...model.having];
//     arr.splice(index, 1);
//     setModel({ ...model, having: arr });
//   }

//   function update(index: number, key: string, value: any) {
//     const arr = [...model.having];
//     arr[index][key] = value;
//     setModel({ ...model, having: arr });
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
//         <Typography variant="h6">HAVING</Typography>
//         <Button size="small" startIcon={<AddIcon />} onClick={addHaving}>
//           Add
//         </Button>
//       </div>

//       {model.having?.map((h: any, i: number) => (
//         <DraggableValueRow key={i} value={h}>
//           <QueryRow key={i}>
//             <FieldSelect
//               value={h.columnId}
//               // columns={fields.filter((f: any) =>
//               //   model.values.some((v: any) => v.columnId === f.Id),
//               // )}
//               columns={(fields || []).filter((f: any) =>
//                 (model.values || []).some((v: any) => v.columnId === f.Id),
//               )}
//               tables={tables}
//               onChange={(v: number) => update(i, "columnId", v)}
//             />

//             <Select
//               size="small"
//               value={h.aggregate}
//               onChange={(e) => update(i, "aggregate", e.target.value)}
//             >
//               <MenuItem value="SUM">SUM</MenuItem>
//               <MenuItem value="COUNT">COUNT</MenuItem>
//               <MenuItem value="AVG">AVG</MenuItem>
//               <MenuItem value="MIN">MIN</MenuItem>
//               <MenuItem value="MAX">MAX</MenuItem>
//             </Select>

//             <Select
//               size="small"
//               value={h.operator}
//               onChange={(e) => update(i, "operator", e.target.value)}
//             >
//               <MenuItem value=">">{">"}</MenuItem>
//               <MenuItem value="<">{"<"}</MenuItem>
//               <MenuItem value="=">=</MenuItem>
//               <MenuItem value=">=">{">="}</MenuItem>
//               <MenuItem value="<=">{"<="}</MenuItem>
//             </Select>

//             <TextField
//               size="small"
//               value={h.value}
//               onChange={(e) => update(i, "value", e.target.value)}
//             />

//             <IconButton onClick={() => remove(i)}>
//               <DeleteIcon />
//             </IconButton>
//           </QueryRow>
//         </DraggableValueRow>
//       ))}
//     </Paper>
//   );
// }

// simplified version without add/remove or drag-and-drop, since having should only be based on values
// import {
//   Paper,
//   Typography,
//   Select,
//   MenuItem,
//   TextField,
//   Switch,
// } from "@mui/material";

// import FieldSelect from "./FieldSelect";
// import QueryRow from "./QueryRow";

// export default function HavingBuilder({
//   model,
//   setModel,
//   columns,
//   tables,
// }: any) {
//   function update(index: number, key: string, value: any) {
//     const arr = [...model.having];
//     arr[index][key] = value;
//     setModel({ ...model, having: arr });
//   }

//   return (
//     <Paper sx={{ p: 2 }}>
//       <Typography variant="h6">HAVING</Typography>

//       {(model.having || []).map((h: any, i: number) => {
//         // only show fields from aggregation
//         // const allowedFields = (fields || []).filter((f: any) =>
//         //   (model.values || []).some((v: any) => v.columnId === f.Id),
//         // );

//         return (
//           <QueryRow key={i}>
//             {/* ✅ Toggle */}
//             <Switch
//               checked={h.active || false}
//               onChange={(e) => update(i, "active", e.target.checked)}
//             />

//             {/* Field */}
//             <FieldSelect
//               className="qb-field qb-direction"
//               value={h.columnId}
//               // columns={allowedFields}
//               // columns={(fields || []).filter((f: any) =>
//               //   (model.values || []).some((v: any) => v.columnId === f.Id),
//               // )}
//               columns={(model.values || [])
//                 .map((v: any) =>
//                   (columns || []).find((f: any) => f.Id === v.columnId),
//                 )
//                 .filter(Boolean)}
//               tables={tables}
//               //   onChange={(v: number) => update(i, "columnId", v)}
//               disabled // ✅ IMPORTANT
//               onChange={() => {}} // no-op
//             />

//             {/* Aggregate */}
//             {/* <Select
//               size="small"
//               value={h.aggregate}
//               disabled // always comes from aggregation
//             >
//               <MenuItem value="SUM">SUM</MenuItem>
//               <MenuItem value="COUNT">COUNT</MenuItem>
//               <MenuItem value="AVG">AVG</MenuItem>
//               <MenuItem value="MIN">MIN</MenuItem>
//               <MenuItem value="MAX">MAX</MenuItem>
//             </Select> */}

//             <Select
//               size="small"
//               value={h.aggregate}
//               onChange={(e) => {
//                 const arr = [...model.having];
//                 arr[i].aggregate = e.target.value;
//                 setModel({ ...model, having: arr });
//               }}
//               disabled
//             >
//               <MenuItem value="SUM">SUM</MenuItem>
//               <MenuItem value="COUNT">COUNT</MenuItem>
//               <MenuItem value="AVG">AVG</MenuItem>
//               <MenuItem value="MIN">MIN</MenuItem>
//               <MenuItem value="MAX">MAX</MenuItem>
//             </Select>

//             {/* Operator */}
//             <Select
//               size="small"
//               value={h.operator}
//               onChange={(e) => update(i, "operator", e.target.value)}
//             >
//               <MenuItem value=">">{">"}</MenuItem>
//               <MenuItem value="<">{"<"}</MenuItem>
//               <MenuItem value="=">=</MenuItem>
//               <MenuItem value=">=">{">="}</MenuItem>
//               <MenuItem value="<=">{"<="}</MenuItem>
//             </Select>

//             {/* Value */}
//             <TextField
//               size="small"
//               value={h.value}
//               onChange={(e) => update(i, "value", e.target.value)}
//             />
//           </QueryRow>
//         );
//       })}
//     </Paper>
//   );
// }

/// simplified version without add/remove or drag-and-drop, since having should only be based on values

import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDroppable } from "@dnd-kit/core";

import FieldSelect from "./FieldSelect";
import QueryRow from "./QueryRow";

import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export default function HavingBuilder({
  model,
  setModel,
  columns,
  tables,
  errors,
  expandAll,
}: any) {
  const { setNodeRef } = useDroppable({ id: "having" });

  const [expanded, setExpanded] = useState(expandAll);
  const count = model?.having?.length || 0;

  useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  function add() {
    const firstCol = columns?.[0];
    if (!firstCol) return;

    setModel((prev: any) => ({
      ...prev,
      having: [
        ...(prev.having || []),
        {
          id: Date.now() + Math.random(),
          columnId: firstCol.Id,
          aggregate: "COUNT",
          operator: ">",
          value: "",
          active: true,
          condition: "AND",
        },
      ],
    }));
  }

  function remove(index: number) {
    const arr = [...model.having];
    arr.splice(index, 1);

    setModel({
      ...model,
      having: arr,
    });
  }

  function update(index: number, key: string, value: any) {
    const arr = [...model.having];
    arr[index][key] = value;

    setModel({
      ...model,
      having: arr,
    });
  }

  const AGGREGATE_CONFIG: Record<string, string[]> = {
    number: ["SUM", "AVG", "MIN", "MAX", "COUNT"],
    date: ["MIN", "MAX", "COUNT"],
    string: ["COUNT"],
    boolean: ["COUNT"],
  };

  const HAVING_OPERATOR_CONFIG = [
    { label: "=", value: "=" },
    { label: "!=", value: "!=" },
    { label: ">", value: ">" },
    { label: ">=", value: ">=" },
    { label: "<", value: "<" },
    { label: "<=", value: "<=" },
    { label: "Is empty", value: "is_empty" },
    { label: "Is not empty", value: "is_not_empty" },
  ];

  const renderHavingValue = (h: any, i: number) => {
    if (["is_empty", "is_not_empty"].includes(h.operator)) return null;

    return (
      <TextField
        size="small"
        type="number" // 🔥 HAVING always numeric (aggregate result)
        value={h.value || ""}
        onChange={(e) => update(i, "value", e.target.value)}
        error={errors?.having?.[i]?.value}
        sx={{
          "& .MuiOutlinedInput-root": {
            ...(errors?.having?.[i]?.value && {
              border: "1px solid #ff4d4f",
              borderRadius: "6px",
            }),
          },
        }}
      />
    );
  };

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

  return (
    <Paper sx={{ p: 2 }} ref={setNodeRef}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Typography variant="h6">Having</Typography>

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
            (model.having || []).map(
              (h: any, i: number) =>
                //(
                {
                  const type = getColumnType(h.columnId);
                  const aggregates = AGGREGATE_CONFIG[type] || ["COUNT"];
                  return (
                    <QueryRow
                      key={h.id}
                      hasError={
                        !!errors?.having?.[i] &&
                        Object.keys(errors.having[i] || {}).length > 0
                      }
                      autoFocus={i === 0}
                    >
                      {/* FIELD */}
                      <FieldSelect
                        value={h.columnId}
                        className="qb-field qb-direction"
                        columns={columns}
                        tables={tables}
                        // onChange={(v: number) => update(i, "columnId", v)}
                        onChange={(v: number) => {
                          const type = getColumnType(v);
                          const aggs = AGGREGATE_CONFIG[type] || ["COUNT"];

                          update(i, "columnId", v);
                          update(i, "aggregate", aggs[0]);
                          update(i, "operator", ">");
                          update(i, "value", "");
                        }}
                        error={errors?.having?.[i]?.columnId}
                        helperText={errors?.having?.[i]?.columnId}
                      />

                      {/* AGGREGATE */}
                      <Select
                        size="small"
                        value={h.aggregate}
                        // className="qb-field qb-direction"
                        onChange={(e) => update(i, "aggregate", e.target.value)}
                        error={errors?.having?.[i]?.aggregate}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            ...(errors?.having?.[i]?.aggregate && {
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
                        {aggregates.map((agg) => (
                          <MenuItem key={agg} value={agg}>
                            {agg}
                          </MenuItem>
                        ))}
                      </Select>

                      {/* OPERATOR */}
                      <Select
                        size="small"
                        value={h.operator}
                        // className="qb-field qb-direction"
                        onChange={(e) => update(i, "operator", e.target.value)}
                        error={errors?.having?.[i]?.operator}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            ...(errors?.having?.[i]?.operator && {
                              border: "1px solid #ff4d4f",
                              borderRadius: "6px",
                            }),
                          },
                        }}
                      >
                        {/* <MenuItem value=">">{">"}</MenuItem>
            <MenuItem value="<">{"<"}</MenuItem>
            <MenuItem value="=">=</MenuItem>
            <MenuItem value=">=">{">="}</MenuItem>
            <MenuItem value="<=">{"<="}</MenuItem> */}
                        {HAVING_OPERATOR_CONFIG.map((op) => (
                          <MenuItem key={op.value} value={op.value}>
                            {op.label}
                          </MenuItem>
                        ))}
                      </Select>

                      {/* VALUE */}
                      {/* <TextField
              size="small"
              // className="qb-field"
              value={h.value}
              onChange={(e) => update(i, "value", e.target.value)}
              error={errors?.having?.[i]?.value}
              sx={{
                "& .MuiOutlinedInput-root": {
                  ...(errors?.having?.[i]?.value && {
                    border: "1px solid #ff4d4f",
                    borderRadius: "6px",
                  }),
                },
              }}
            /> */}
                      {renderHavingValue(h, i)}

                      {model?.having?.length - 1 !== i && (
                        <Select
                          size="small"
                          value={h.condition}
                          onChange={(e) =>
                            update(i, "condition", e.target.value)
                          }
                          error={errors?.having?.[i]?.condition}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              ...(errors?.having?.[i]?.condition && {
                                border: "1px solid #ff4d4f",
                                borderRadius: "6px",
                              }),
                            },
                          }}
                        >
                          <MenuItem value="AND">AND</MenuItem>
                          <MenuItem value="OR">OR</MenuItem>
                        </Select>
                      )}

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
