import { useState, useEffect } from "react";
import { Paper, Typography, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDroppable } from "@dnd-kit/core";
import AddIcon from "@mui/icons-material/Add";

import FieldSelect from "./FieldSelect";
import QueryRow from "./QueryRow";

//import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";

export default function GroupByBuilder({
  model,
  setModel,
  columns,
  tables,
  errors,
  expandAll,
}: any) {
  const { setNodeRef } = useDroppable({ id: "groupby" });

  // const [expanded, setExpanded] = useState(true);
  const [expanded, setExpanded] = useState(expandAll);
  const count = model?.groupBy?.length || 0;

  useEffect(() => {
    setExpanded(expandAll);
    console.log("RUNNING EFFECT: <Group>");
  }, [expandAll]);

  //   function remove(id: number) {
  //     setModel((prev: any) => ({
  //       ...prev,
  //       groupBy: prev.groupBy.filter((x: number) => x !== id),
  //     }));
  //   }

  function add() {
    setModel((prev: any) => ({
      ...prev,
      groupBy: [...prev.groupBy, columns[0]?.Id],
      errors: {
        ...prev.errors,
        groupBy: [...(prev.errors?.groupBy || []), null],
      },
    }));
  }

  function remove(index: number) {
    const arr = [...model.groupBy];

    arr.splice(index, 1);

    setModel({
      ...model,
      groupBy: arr,
      errors: { ...model.errors, groupBy: arr.map(() => null) },
    });
  }

  function change(index: number, value: number) {
    const arr = [...model.groupBy];

    arr[index] = value;

    setModel({
      ...model,
      groupBy: arr,
      errors: { ...model.errors, groupBy: arr.map(() => null) },
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
          <Typography variant="h6">Group By</Typography>

          {!expanded && count > 0 && (
            <Chip size="small" label={`${count} field(s)`} />
          )}
        </div>

        {/* <Button size="small" startIcon={<AddIcon />} onClick={add}>
          Add
        </Button> */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tooltip title={expanded ? "Collapse all" : "Expand all"}>
            <IconButton>
              {/* <IconButton onClick={() => setExpanded((p) => !p)}> */}
              {/* {expanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />} */}
              {/* {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />} */}
              {/* </IconButton> */}
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
            model?.groupBy?.map((id: number, i: number) => {
              const col = columns.find((c: any) => c.Id === id);

              return (
                <QueryRow key={i}>
                  <FieldSelect
                    value={id}
                    className="qb-field"
                    columns={columns}
                    tables={tables}
                    onChange={(v: number) => change(i, v)}
                    error={errors?.groupBy?.[i]}
                    helperText={errors?.groupBy?.[i]}
                  />

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
