import { useEffect, useState, useMemo } from "react";
import { Grid, Paper, Typography, Button, TextField } from "@mui/material";
import { DndContext, DragOverlay } from "@dnd-kit/core";

import DraggableField from "../../components/ReportBuilder/DraggableField";
import PivotLayout from "../../components/ReportBuilder/PivotLayout";
import ReportGrid from "../../components/ReportBuilder/ReportGrid";

import { getReportMetadata, generateReport } from "../../api/reportApi";

import { ReportLayout, ReportColumn } from "../../types/reportTypes";

import { DataGrid, gridClasses } from "@mui/x-data-grid";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { exportExcel, exportCSV, exportPDF } from "../../utils/exportUtils";

export default function ReportDataTableBuilder() {
  const [fields, setFields] = useState<ReportColumn[]>([]);

  const [reportData, setReportData] = useState<any[]>([]);

  const [layout, setLayout] = useState<ReportLayout>({
    rows: [],
    columns: [],
    values: [],
    filters: [],
  });

  const [activeField, setActiveField] = useState<any>(null);
  //  const groupedFields = useMemo(()=>{

  //     const map:any = {}

  //     fields.forEach(f=>{

  //       const key = f.TableName || "Other"

  //       if(!map[key]) map[key] = []

  //       map[key].push(f)

  //     })

  //   return map

  //   },[fields])

  const [tables, setTables] = useState<any[]>([]);

  const tableMap = useMemo(() => {
    const map: any = {};

    tables.forEach((t: any) => {
      map[t.Id] = t.DisplayName;
    });

    return map;
  }, [tables]);

  const [search, setSearch] = useState("");

  const groupedFields = useMemo(() => {
    const map: any = {};

    //  fields.forEach(f=>{

    //   //const key = f.DisplayName || f.TableId || f.TableName

    //   const key = tableMap[f.TableId] || "Other"

    //   if(!map[key]) map[key] = []

    //   map[key].push(f)

    //  })

    const filtered = fields.filter((f: any) =>
      f.DisplayName?.toLowerCase().includes(search.toLowerCase()),
    );

    filtered.forEach((f: any) => {
      const key = tableMap[f.TableId] || "Other";

      if (!map[key]) map[key] = [];

      map[key].push(f);
    });

    return map;
  }, [fields, search]);

  useEffect(() => {
    loadMeta();
  }, []);

  async function loadMeta() {
    const data = await getReportMetadata();
    console.log("Data :", data);
    setFields(data.columns);
    setTables(data.tables);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    const field = active.data.current;
    const zone = over.id;

    setLayout((prev: any) => {
      const updated: any = { ...prev };

      if (zone === "values") {
        const exists = updated.values.find((v: any) => v.columnId === field.Id);

        if (!exists) {
          updated.values.push({
            columnId: field.Id,
            aggregate: "SUM",
          });
        }
      } else {
        if (!updated[zone].includes(field.Id)) {
          updated[zone].push(field.Id);
        }
      }

      return updated;
    });
  }

  function removeItem(zone: any, id: number) {
    setLayout((prev: any) => {
      const updated = { ...prev };

      if (zone === "values") {
        updated.values = updated.values.filter((v: any) => v.columnId !== id);
      } else {
        updated[zone] = updated[zone].filter((x: any) => x !== id);
      }

      return updated;
    });
  }

  function changeAggregate(columnId: number, aggregate: string) {
    setLayout((prev: any) => {
      const updated = { ...prev };

      updated.values = updated.values.map((v: any) => {
        if (v.columnId === columnId) {
          return { ...v, aggregate };
        }

        return v;
      });

      return updated;
    });
  }

  async function runReport() {
    console.log("Running report with layout:", layout);
    const data = await generateReport(layout);
    console.log("Report data:", data);
    setReportData(data);
  }

  return (
    // <DndContext onDragEnd={handleDragEnd}>
    <DndContext
      onDragStart={(e) => {
        setActiveField(e.active.data.current);
      }}
      onDragEnd={(e) => {
        setActiveField(null);
        handleDragEnd(e);
      }}
    >
      <Grid container spacing={2} p={2}>
        <Grid size={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Fields</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Search fields..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mt: 1, mb: 2 }}
            />

            {/* {fields?.map(f=>(
        <DraggableField
          key={f.Id}
          field={f}
        />
        ))} */}

            {Object.keys(groupedFields).map((group) => (
              <Accordion key={group} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  {group}
                </AccordionSummary>

                <AccordionDetails>
                  {groupedFields[group].map((f: any) => (
                    <DraggableField key={f.Id} field={f} />
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        <Grid size={9}>
          <Paper sx={{ p: 2 }}>
            <PivotLayout
              layout={layout}
              fields={fields}
              removeItem={removeItem}
              changeAggregate={changeAggregate}
            />

            {/* <Button
          variant="contained"
          sx={{mt:2}}
          onClick={runReport}
        >
        Generate Report
        </Button> */}

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid>
                <Button variant="contained" onClick={runReport}>
                  Generate Report
                </Button>
              </Grid>

              <Grid>
                <Button
                  variant="outlined"
                  disabled={reportData.length === 0}
                  onClick={() => exportExcel(reportData, "Report")}
                >
                  Export Excel
                </Button>
              </Grid>

              <Grid>
                <Button
                  variant="outlined"
                  disabled={reportData.length === 0}
                  onClick={() => exportCSV(reportData, "Report")}
                >
                  Export CSV
                </Button>
              </Grid>

              <Grid>
                <Button
                  variant="outlined"
                  disabled={reportData.length === 0}
                  onClick={() => exportPDF(reportData, "Report")}
                >
                  Export PDF
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={12}>
          <ReportGrid data={reportData} />
        </Grid>
      </Grid>
      <DragOverlay>
        {activeField && (
          <Paper
            sx={{
              p: 1,
              px: 2,
              background: "#1976d2",
              color: "white",
            }}
          >
            {activeField.DisplayName}
          </Paper>
        )}
      </DragOverlay>
    </DndContext>
  );
}
