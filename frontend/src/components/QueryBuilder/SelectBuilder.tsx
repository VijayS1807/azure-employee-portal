// import { Paper,Typography } from "@mui/material"
// import { useDroppable } from "@dnd-kit/core"

// export default function SelectBuilder({model,setModel,columns}:any){

//  const {setNodeRef} = useDroppable({

//   id:"select"

//  })

//  return(

//  <Paper sx={{p:2}} ref={setNodeRef}>

//  <Typography variant="h6">SELECT</Typography>

//  {model.select.map((s:any)=>{

//  const col = columns.find((c:any)=>c.Id===s.columnId)

//  return(

//  <div key={s.columnId}>

//  {col.DisplayName} ({s.aggregate || "NONE"})

//  </div>

//  )

//  })}

//  </Paper>

//  )

// }

////////////////////

import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDroppable } from "@dnd-kit/core";
import Tooltip from "@mui/material/Tooltip";

import FieldSelect from "./FieldSelect";
import QueryRow from "./QueryRow";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";

export default function SelectBuilder({
  model,
  setModel,
  columns,
  tables,
  errors,
  expandAll,
}: any) {
  const { setNodeRef } = useDroppable({ id: "select" });

  //const [expanded, setExpanded] = useState(true);

  const [expanded, setExpanded] = useState(expandAll);
  const count = model?.select?.length || 0;

  useEffect(() => {
    setExpanded(expandAll);
    console.log("RUNNING EFFECT: <Select>");
  }, [expandAll]);

  // function add() {
  //   setModel((prev: any) => ({
  //     ...prev,
  //     select: [...prev.select, columns[0]?.Id],
  //   }));
  // }
  function add() {
    const firstCol = columns?.[0];
    if (!firstCol) return;

    setModel((prev: any) => ({
      ...prev,
      select: [
        ...(prev.select || []),
        {
          columnId: firstCol.Id,
          alias: firstCol.DisplayName || "", // ✅ DEFAULT
        },
      ],
    }));
  }

  //   function remove(id: number) {
  //     setModel((prev: any) => ({
  //       ...prev,
  //       select: prev.select.filter((x: number) => x !== id),
  //     }));
  //   }

  function remove(index: number) {
    const arr = [...model.select];

    arr.splice(index, 1);

    setModel({ ...model, select: arr });
  }

  function change(index: number, value: number) {
    const arr = [...model.select];

    arr[index] = value;

    setModel({ ...model, select: arr });
  }

  // ✅ UPDATE
  function update(index: number, key: string, value: any) {
    const arr = [...model.select];
    arr[index][key] = value;

    setModel({
      ...model,
      select: arr,
    });
  }

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
          <Typography variant="h6">Columns</Typography>

          {!expanded && count > 0 && (
            <Chip size="small" label={`${count} field(s)`} />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* ✅ DISTINCT SWITCH */}
          <span>Distinct</span>
          <Switch
            checked={model.distinct || false}
            onChange={(e) => setModel({ ...model, distinct: e.target.checked })}
          />

          {/*       <Button size="small" startIcon={<AddIcon />} onClick={add}>
            Add
          </Button> */}

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tooltip title={expanded ? "Collapse all" : "Expand all"}>
              <IconButton>
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
      </div>

      {/* {model?.select?.map((id: number, i: number) => {
        const col = columns.find((c: any) => c.Id === id);

        if (!col) return null;

        return (
          <QueryRow key={i}>
            <FieldSelect
              value={id}
              className="qb-field"
              columns={columns}
              tables={tables}
              onChange={(v: number) => change(i, v)}
            />
            <IconButton onClick={() => remove(i)}>
              <DeleteIcon />
            </IconButton>
          </QueryRow>
        );
      })} */}

      {expanded &&
        (model.select || []).map((s: any, i: number) => (
          <QueryRow
            key={i}
            hasError={
              !!errors?.select?.[i] &&
              Object.keys(errors.select[i] || {}).length > 0
            }
            autoFocus={i === 0}
            //hasError={!!errors?.select?.[i]}
          >
            {/* COLUMN */}
            <FieldSelect
              value={s.columnId}
              className="qb-field qb-direction"
              columns={columns}
              tables={tables}
              //onChange={(v: number) => update(i, "columnId", v)}
              onChange={(v: number) => {
                const col = columns.find((c: any) => c.Id === v);

                update(i, "columnId", v);
                update(i, "alias", col?.DisplayName || ""); // ✅ AUTO UPDATE
              }}
              error={errors?.select?.[i]?.columnId?.alias}
              helperText={errors?.select?.[i]?.columnId.alias}
            />

            {/* ✅ ALIAS INPUT */}
            <TextField
              size="small"
              placeholder="Alias"
              value={s.alias || ""}
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

            {/* DELETE */}
            <IconButton onClick={() => remove(i)}>
              <DeleteIcon />
            </IconButton>
          </QueryRow>
        ))}
    </Paper>
  );
}
