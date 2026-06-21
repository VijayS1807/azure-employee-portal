// import { Paper, Button, Select, MenuItem, TextField } from "@mui/material";

// export default function WhereBuilder({ model, setModel, columns }: any) {
//   function addRule() {
//     setModel((prev: any) => ({
//       ...prev,

//       where: [
//         ...prev.where,
//         {
//           columnId: columns[0].Id,
//           operator: "=",
//           value: "",
//           condition: "AND",
//         },
//       ],
//     }));
//   }

//   return (
//     <Paper sx={{ p: 2 }}>
//       <Button onClick={addRule}>Add Filter</Button>

//       {model.where.map((w: any, i: number) => (
//         <div key={i} style={{ display: "flex", gap: 10, marginTop: 10 }}>
//           <Select
//             value={w.columnId}
//             onChange={(e) => {
//               const arr = [...model.where];

//               arr[i].columnId = e.target.value;

//               setModel({ ...model, where: arr });
//             }}
//           >
//             {columns.map((c: any) => (
//               <MenuItem value={c.Id}>{c.DisplayName}</MenuItem>
//             ))}
//           </Select>

//           <Select
//             value={w.operator}
//             onChange={(e) => {
//               const arr = [...model.where];

//               arr[i].operator = e.target.value;

//               setModel({ ...model, where: arr });
//             }}
//           >
//             <MenuItem value="=">=</MenuItem>
//             <MenuItem value=">">{">"}</MenuItem>
//             <MenuItem value="<">{"<"}</MenuItem>
//           </Select>

//           <TextField
//             value={w.value}
//             onChange={(e) => {
//               const arr = [...model.where];

//               arr[i].value = e.target.value;

//               setModel({ ...model, where: arr });
//             }}
//           />
//         </div>
//       ))}
//     </Paper>
//   );
// }

//////////
import { useState, useEffect } from "react";
import {
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";

import FieldSelect from "./FieldSelect";
import QueryRow from "./QueryRow";

import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";

export default function WhereBuilder({
  model,
  setModel,
  columns,
  tables,
  errors,
  expandAll,
}: any) {
  const { setNodeRef } = useDroppable({ id: "where" });

  const [expanded, setExpanded] = useState(expandAll);
  const count = model?.where?.length || 0;

  useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  function add() {
    const defaultColumnId = columns?.[0]?.Id;

    const type = getColumnType(defaultColumnId);
    const ops = OPERATOR_CONFIG[type] || OPERATOR_CONFIG.string;

    setModel((prev: any) => ({
      ...prev,
      where: [
        ...prev.where,
        {
          columnId: columns[0]?.Id,
          // operator: "=",
          operator: ops[0]?.value || "",
          value: "",
          condition: "AND",
          dataType: columns[0].DataType,
        },
      ],
    }));
  }

  function remove(index: number) {
    const arr = [...model.where];
    arr.splice(index, 1);
    setModel({ ...model, where: arr });
  }

  function update(index: number, key: string, value: any) {
    const arr = [...model.where];
    arr[index][key] = value;
    setModel({ ...model, where: arr });
  }

  const OPERATOR_CONFIG: Record<string, { label: string; value: string }[]> = {
    string: [
      { label: "Contains", value: "contains" },
      { label: "Does not contain", value: "not_contains" },
      { label: "Equal", value: "=" },
      { label: "Does not equal", value: "!=" },
      { label: "Starts with", value: "starts_with" },
      { label: "Ends with", value: "ends_with" },
      { label: "Is empty", value: "is_empty" },
      { label: "Is not empty", value: "is_not_empty" },
      { label: "Is any of", value: "in" },
    ],

    number: [
      { label: "=", value: "=" },
      { label: "!=", value: "!=" },
      { label: ">", value: ">" },
      { label: ">=", value: ">=" },
      { label: "<", value: "<" },
      { label: "<=", value: "<=" },
      { label: "Is empty", value: "is_empty" },
      { label: "Is not empty", value: "is_not_empty" },
      { label: "Is any of", value: "in" },
    ],

    date: [
      { label: "Is", value: "=" },
      { label: "Is not", value: "!=" },
      { label: "Is after", value: ">" },
      { label: "Is on or after", value: ">=" },
      { label: "Is before", value: "<" },
      { label: "Is on or before", value: "<=" },
      { label: "Is empty", value: "is_empty" },
      { label: "Is not empty", value: "is_not_empty" },
    ],

    boolean: [{ label: "Is", value: "=" }],
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

  //const w = model?.where;
  // const type = getColumnType(w.columnId);
  // const operators = OPERATOR_CONFIG[type] || OPERATOR_CONFIG.string;

  const getOperators = (columnId: number) => {
    const type = getColumnType(columnId);
    console.log("type :", type);
    return OPERATOR_CONFIG[type] || OPERATOR_CONFIG.string;
  };

  const renderValueInput = (w: any, i: number) => {
    const type = getColumnType(w.columnId);

    // 🚫 No value needed
    if (["is_empty", "is_not_empty"].includes(w.operator)) return null;

    // 🔢 NUMBER
    if (type === "number") {
      return (
        <TextField
          size="small"
          type="number"
          value={w.value || ""}
          onChange={(e) => update(i, "value", e.target.value)}
          error={errors?.where?.[i]?.value}
        />
      );
    }

    // 📅 DATE
    if (type === "date") {
      return (
        <TextField
          size="small"
          type="date"
          value={w.value || ""}
          onChange={(e) => update(i, "value", e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={errors?.where?.[i]?.value}
        />
      );
    }

    // ✅ BOOLEAN
    if (type === "boolean") {
      return (
        <Select
          size="small"
          value={w.value ?? ""}
          onChange={(e) => update(i, "value", e.target.value)}
        >
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      );
    }

    // 🔤 STRING (default)
    return (
      <TextField
        size="small"
        value={w.value || ""}
        onChange={(e) => update(i, "value", e.target.value)}
        error={errors?.where?.[i]?.value}
      />
    );
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
          <Typography variant="h6">Condition</Typography>

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
            model?.where?.map((w: any, i: number) => {
              const operators = getOperators(w.columnId);

              return (
                <QueryRow
                  key={i}
                  hasError={
                    !!errors?.where?.[i] &&
                    Object.keys(errors.where[i] || {}).length > 0
                  }
                  autoFocus={i === 0}
                >
                  <FieldSelect
                    className="qb-field"
                    value={w.columnId}
                    columns={columns}
                    tables={tables}
                    //onChange={(v: number) => update(i, "columnId", v)}
                    onChange={(v: number) => {
                      update(i, "columnId", v);
                      update(i, "operator", "");
                      update(i, "value", "");
                    }}
                    error={errors?.where?.[i]?.columnId}
                    helperText={errors?.where?.[i]?.columnId}
                  />

                  <Select
                    size="small"
                    value={w.operator}
                    onChange={(e) => update(i, "operator", e.target.value)}
                    error={errors?.where?.[i]?.operator}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        ...(errors?.where?.[i]?.operator && {
                          border: "1px solid #ff4d4f",
                          borderRadius: "6px",
                        }),
                      },
                    }}
                  >
                    {/* <MenuItem value="=">=</MenuItem>
            <MenuItem value="!=">!=</MenuItem>
            <MenuItem value=">">{">"}</MenuItem>
            <MenuItem value="<">{"<"}</MenuItem>
            <MenuItem value=">=">{">="}</MenuItem>
            <MenuItem value="<=">{"<="}</MenuItem>
            <MenuItem value="LIKE">LIKE</MenuItem> */}

                    {operators.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>

                  {/* <TextField
            size="small"
            value={w.value}
            onChange={(e) => update(i, "value", e.target.value)}
            error={errors?.where?.[i]?.value}
            sx={{
              "& .MuiOutlinedInput-root": {
                ...(errors?.where?.[i]?.value && {
                  border: "1px solid #ff4d4f",
                  borderRadius: "6px",
                }),
              },
            }}
          /> */}
                  {/* {renderValueInput()} */}
                  {/* ✅ value */}
                  {renderValueInput(w, i)}

                  {model?.where?.length - 1 !== i && (
                    <Select
                      size="small"
                      value={w.condition}
                      onChange={(e) => update(i, "condition", e.target.value)}
                      error={errors?.where?.[i]?.condition}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          ...(errors?.where?.[i]?.condition && {
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

                  <IconButton onClick={() => remove(i)}>
                    <DeleteIcon />
                  </IconButton>
                </QueryRow>
              );
            })}
        </div>
      </Collapse>
    </Paper>
  );
}
