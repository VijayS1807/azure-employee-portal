// import { Paper, Typography, Select, MenuItem } from "@mui/material";

// export default function OrderByBuilder({ model, setModel, columns }: any) {
//   function add() {
//     setModel((prev: any) => ({
//       ...prev,
//       orderBy: [
//         ...prev.orderBy,
//         {
//           columnId: columns[0].Id,
//           direction: "ASC",
//         },
//       ],
//     }));
//   }

//   return (
//     <Paper sx={{ p: 2 }}>
//       <Typography variant="h6">Order By</Typography>

//       <button onClick={add}>Add</button>

//       {model.orderBy.map((o: any, i: number) => (
//         <div key={i} style={{ display: "flex", gap: 10 }}>
//           <Select
//             value={o.columnId}
//             onChange={(e) => {
//               const arr = [...model.orderBy];

//               arr[i].columnId = e.target.value;

//               setModel({ ...model, orderBy: arr });
//             }}
//           >
//             {columns.map((c: any) => (
//               <MenuItem value={c.Id}>{c.DisplayName}</MenuItem>
//             ))}
//           </Select>

//           <Select
//             value={o.direction}
//             onChange={(e) => {
//               const arr = [...model.orderBy];

//               arr[i].direction = e.target.value;

//               setModel({ ...model, orderBy: arr });
//             }}
//           >
//             <MenuItem value="ASC">ASC</MenuItem>

//             <MenuItem value="DESC">DESC</MenuItem>
//           </Select>
//         </div>
//       ))}
//     </Paper>
//   );
// }
import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDroppable } from "@dnd-kit/core";

import FieldSelect from "./FieldSelect";
import QueryRow from "./QueryRow";

import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";

export default function OrderByBuilder({
  model,
  setModel,
  columns,
  tables,
  errors,
  expandAll,
}: any) {
  const { setNodeRef } = useDroppable({ id: "orderby" });

  const [expanded, setExpanded] = useState(expandAll);
  const count = model?.orderBy?.length || 0;

  useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  function addOrder() {
    setModel((prev: any) => ({
      ...prev,
      orderBy: [
        ...prev.orderBy,
        {
          columnId: columns[0]?.Id,
          direction: "ASC",
        },
      ],
    }));
  }

  function remove(index: number) {
    const arr = [...model.orderBy];
    arr.splice(index, 1);

    setModel({ ...model, orderBy: arr });
  }

  function update(index: number, key: string, value: any) {
    const arr = [...model.orderBy];
    arr[index][key] = value;

    setModel({ ...model, orderBy: arr });
  }

  return (
    <Paper sx={{ p: 2 }} ref={setNodeRef}>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Order By</Typography>

        <Button size="small" startIcon={<AddIcon />} onClick={addOrder}>
          Add
        </Button>
      </div> */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Typography variant="h6">Order By</Typography>

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
          <Button size="small" startIcon={<AddIcon />} onClick={addOrder}>
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
            model?.orderBy?.map((o: any, i: number) => (
              <QueryRow
                key={i}
                hasError={
                  !!errors?.orderBy?.[i] &&
                  Object.keys(errors.orderBy[i] || {}).length > 0
                }
                autoFocus={i === 0}
              >
                <FieldSelect
                  value={o.columnId}
                  className="qb-field qb-direction"
                  columns={columns}
                  tables={tables}
                  onChange={(v: number) => update(i, "columnId", v)}
                  error={errors?.orderBy?.[i]?.columnId}
                  helperText={errors?.orderBy?.[i]?.columnId}
                />

                <Select
                  size="small"
                  value={o.direction}
                  onChange={(e) => update(i, "direction", e.target.value)}
                  error={errors?.orderBy?.[i]?.direction}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      ...(errors?.orderBy?.[i]?.direction && {
                        border: "1px solid #ff4d4f",
                        borderRadius: "6px",
                      }),
                    },
                  }}
                >
                  <MenuItem value="ASC">ASC</MenuItem>
                  <MenuItem value="DESC">DESC</MenuItem>
                </Select>

                <IconButton onClick={() => remove(i)}>
                  <DeleteIcon />
                </IconButton>
              </QueryRow>
            ))}
        </div>
      </Collapse>
    </Paper>
  );
}
