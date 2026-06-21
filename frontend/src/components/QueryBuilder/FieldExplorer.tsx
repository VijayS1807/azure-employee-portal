// import { Paper,Typography } from "@mui/material"
// import { useDraggable } from "@dnd-kit/core"

// export default function FieldExplorer({fields}:any){

//  return(

//  <Paper sx={{p:2}}>

//  <Typography variant="h6">Fields</Typography>

//  {fields.map((f:any)=>(
//  <DraggableField key={f.Id} field={f}/>
//  ))}

//  </Paper>

//  )

// }

// function DraggableField({field}:any){

//  const {attributes,listeners,setNodeRef,transform} = useDraggable({

//   id:field.Id,
//   data:field

//  })

//  const style = transform ? {

//   transform:`translate(${transform.x}px,${transform.y}px)`

//  }:undefined

//  return(

//  <div
//  ref={setNodeRef}
//  {...listeners}
//  {...attributes}
//  style={{
//   padding:6,
//   border:"1px solid #ccc",
//   marginTop:6,
//   cursor:"grab",
//   ...style
//  }}
//  >

//  {field.DisplayName}

//  </div>

//  )

// }

///////////////

import { useMemo, useState, useEffect } from "react";
import { Paper, Typography, TextField, Box, Badge } from "@mui/material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import IconButton from "@mui/material/IconButton";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import Tooltip from "@mui/material/Tooltip";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import SortIcon from "@mui/icons-material/Sort";

import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { getReportMetadata } from "../../api/reportApi";

export default function FieldExplorer({ fields, tables }: any) {
  const [search, setSearch] = useState("");

  const tableMap = useMemo(() => {
    const map: any = {};

    tables?.forEach((t: any) => {
      map[t.Id] = t.DisplayName || t.Name;
    });

    return map;
  }, [tables]);

  const [sortMode, setSortMode] = useState<"default" | "asc" | "desc">(
    "default",
  );

  const grouped = useMemo(() => {
    const map: any = {};

    const filtered = fields.filter((f: any) =>
      f.DisplayName?.toLowerCase().includes(search.toLowerCase()),
    );

    filtered.forEach((f: any) => {
      const key = tableMap[f.TableId] || "Others";

      if (!map[key]) map[key] = [];

      map[key].push(f);
    });

    //return map;

    // 🔥 DEFAULT SORT (by TableId + ColumnId)
    if (sortMode === "default") {
      Object.keys(map).forEach((key) => {
        map[key].sort((a: any, b: any) => a.Id - b.Id);
      });

      return map; // keep original group order
    }

    // 🔥 ALPHABET SORT (groups + columns)
    const sortedGroupKeys = Object.keys(map).sort((a, b) => {
      return sortMode === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    });

    const sortedMap: any = {};

    sortedGroupKeys.forEach((key) => {
      sortedMap[key] = map[key].sort((a: any, b: any) => {
        return sortMode === "asc"
          ? (a.DisplayName || "").localeCompare(b.DisplayName || "")
          : (b.DisplayName || "").localeCompare(a.DisplayName || "");
      });
    });

    return sortedMap;
  }, [fields, search, tableMap, sortMode]);

  const [expandAll, setExpandAll] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  const handleToggleAll = () => {
    const newValue = !expandAll;
    setExpandAll(newValue);

    const updated: Record<string, boolean> = {};
    Object.keys(grouped).forEach((g) => {
      updated[g] = newValue;
    });

    setExpandedGroups(updated);
  };

  const handleToggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  //const modules = Object.keys(grouped ?? {});

  // const [selectedModules, setSelectedModules] = useState<string[]>();
  //const [selectedModules, setSelectedModules] = useState<string[]>(() => []);

  // const [selectedModules, setSelectedModules] = useState<string[]>(() =>
  //   Object.keys(grouped ?? {}),
  // );

  // useEffect(() => {
  //   if (modules.length > 0) {
  //     setSelectedModules(modules);
  //   }
  //   console.log("RUNNING EFFECT: <Field>");
  // }, [modules]);

  const modules = useMemo(() => Object.keys(grouped ?? {}), [grouped]);

  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    if (modules.length > 0 && selectedModules.length === 0) {
      setSelectedModules(modules);
    }
  }, [modules]); // ✅ safe

  const isAllSelected = selectedModules?.length === modules.length;

  const handleToggleAllFilter = () => {
    if (isAllSelected) {
      setSelectedModules([]);
    } else {
      setSelectedModules(modules);
    }
  };

  const handleToggleFilterModule = (module: string) => {
    setSelectedModules((prev = []) =>
      prev.includes(module)
        ? prev.filter((m) => m !== module)
        : [...prev, module],
    );
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  //

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [loadingMeta, setLoadingMeta] = useState(false);
  const handleRefresh = async () => {
    try {
      setLoadingMeta(true);

      // API call
      await getReportMetadata();
      setSortMode("default");
      console.log("refresh clicked");

      // optionally reset filters after refresh
      // setSelectedModules(Object.keys(newGrouped));
      setSelectedModules(modules);
    } catch (err) {
      console.error("Failed to refresh metadata", err);
    } finally {
      setLoadingMeta(false);
    }
  };

  //

  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);

  const handleOpenSort = (e: React.MouseEvent<HTMLElement>) => {
    setSortAnchor(e.currentTarget);
  };

  const handleCloseSort = () => setSortAnchor(null);

  return (
    <Paper sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* ALL */}
        <MenuItem
          // onClick={handleToggleAllFilter}
          //onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation(); // prevents menu close
            handleToggleAllFilter();
          }}
        >
          <Checkbox
            checked={isAllSelected}
            indeterminate={
              selectedModules.length > 0 &&
              selectedModules.length < modules.length
            }
          />
          <ListItemText primary="All" />
        </MenuItem>

        {/* MODULES */}
        {modules.map((module) => (
          <MenuItem
            key={module}
            // onClick={() => handleToggleFilterModule(module)}
            onChange={(e) => {
              e.stopPropagation(); // prevents menu close
              handleToggleFilterModule(module);
            }}
          >
            <Checkbox checked={selectedModules.includes(module)} />
            <ListItemText primary={module} />
          </MenuItem>
        ))}
      </Menu>
      {/* <Typography variant="h6">Fields</Typography> */}

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Fields</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          {/* 🔄 Refresh */}
          <Tooltip title="Refresh fields">
            <IconButton
              size="small"
              onClick={handleRefresh}
              disabled={loadingMeta}
            >
              <RefreshIcon
                sx={{
                  fontSize: "1.2rem",
                  ...(loadingMeta && {
                    animation: "spin 1s linear infinite",
                  }),
                }}
              />
            </IconButton>
          </Tooltip>

          {/* <IconButton size="small" onClick={handleOpenSort}>
            <SortIcon color={sortMode !== "default" ? "primary" : "inherit"} />
          </IconButton> */}

          <IconButton size="small" onClick={handleOpenSort}>
            {/* {sortMode === "asc" && <SortByAlphaIcon />}
            {sortMode === "desc" && <ArrowDownwardIcon />}
            {sortMode === "default" && <SortIcon />} */}

            {sortMode === "default" && <SortIcon />}
            {sortMode !== "default" && (
              <SortByAlphaIcon
                sx={{
                  transform: sortMode === "desc" ? "rotate(180deg)" : "none",
                  color: "primary.main", // sortMode !== "default" ? "primary.main" : "inherit",
                }}
              />
            )}
          </IconButton>

          <Menu
            anchorEl={sortAnchor}
            open={!!sortAnchor}
            onClose={handleCloseSort}
          >
            <MenuItem
              onClick={() => {
                setSortMode("default");
                handleCloseSort();
              }}
            >
              Default
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortMode("asc");
                handleCloseSort();
              }}
            >
              A → Z
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortMode("desc");
                handleCloseSort();
              }}
            >
              Z → A
            </MenuItem>
          </Menu>

          {/* <IconButton size="small" onClick={handleSortOpen}>
            <SortIcon />
          </IconButton>

          <Menu
            anchorEl={sortAnchorEl}
            open={sortOpen}
            onClose={handleSortClose}
          >
            <MenuItem
              onClick={() => {
                setSortMode("default");
                handleSortClose();
              }}
            >
              Default
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortMode("asc");
                handleSortClose();
              }}
            >
              A → Z
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortMode("desc");
                handleSortClose();
              }}
            >
              Z → A
            </MenuItem>
          </Menu> */}

          {/* Filter */}
          <Tooltip title="Filter fields">
            <IconButton onClick={handleOpen} size="small">
              <Badge
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: 10,
                    height: 16,
                    minWidth: 16,
                    padding: "0 4px",
                  },
                }}
                badgeContent={selectedModules.length}
                color="primary"
              >
                <FilterListIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* expand/collpase */}
          <Tooltip title={expandAll ? "Collapse all" : "Expand all"}>
            <IconButton size="small" onClick={handleToggleAll}>
              {expandAll ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TextField
        size="small"
        fullWidth
        placeholder="Search fields..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mt: 1, mb: 2 }}
      />

      {/* {Object.keys(grouped).map((group) => ( */}
      {Object.keys(grouped)
        .filter((group) => selectedModules.includes(group))
        .map((group) => (
          <Accordion
            key={group}
            //defaultExpanded
            expanded={expandedGroups[group] ?? expandAll}
            onChange={() => handleToggleGroup(group)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {group}
            </AccordionSummary>

            <AccordionDetails>
              {grouped[group].map((f: any) => (
                <DraggableField key={f.Id} field={f} />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </Paper>
  );
}

function DraggableField({ field }: any) {
  // const { attributes, listeners, setNodeRef, transform, isDragging } =
  //   useDraggable({
  //     id: `column-${field.Id}`,
  //     data: {
  //       columnId: field.Id,
  //       type: "column",
  //     },
  //   });

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `column-${field.Id}`,
    data: {
      columnId: field.Id,
      type: "column",
    },
  });

  const style = {
    // transform: transform
    //   ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    //   : undefined,
    border: "1px solid #ddd",
    padding: 6,
    marginTop: 5,
    cursor: "grab",
    background: "#fafafa",
    // opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {field.DisplayName}
    </div>
  );
}
