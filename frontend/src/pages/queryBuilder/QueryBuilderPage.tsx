// import { useEffect, useState } from "react";
// import { Grid, Button, Paper, Typography } from "@mui/material";
// import { DndContext } from "@dnd-kit/core";

// import FieldExplorer from "../../components/QueryBuilder/FieldExplorer";
// import SelectBuilder from "../../components/QueryBuilder/SelectBuilder";
// import WhereBuilder from "../../components/QueryBuilder/WhereBuilder";
// import SqlPreview from "../../components/QueryBuilder/SqlPreview";
// import ResultGrid from "../../components/QueryBuilder/ResultGrid";

// import { getReportMetadata, runQuery } from "../../api/reportApi";
// import { generateSQL } from "../../utils/sqlGenerator";
// export default function QueryBuilderPage() {
//   const [tables, setTables] = useState<any[]>([]);
//   const [columns, setColumns] = useState<any[]>([]);
//   const [data, setData] = useState<any[]>([]);

//   const [model, setModel] = useState<any>({
//     select: [],
//     from: null,
//     joins: [],
//     where: [],
//     groupBy: [],
//     having: [],
//     orderBy: [],
//     distinct: false,
//   });

//   useEffect(() => {
//     loadMeta();
//   }, []);

//   async function loadMeta() {
//     const meta = await getReportMetadata();

//     setTables(meta.tables);
//     setColumns(meta.columns);

//     if (meta.tables.length) {
//       setModel((prev: any) => ({
//         ...prev,
//         from: meta.tables[0].Id,
//       }));
//     }
//   }

//   function handleDragEnd(e: any) {
//     const field = e.active?.data?.current;

//     if (!field) return;

//      setModel((prev:any)=>({

//      ...prev,
//      select:[...prev.select,{columnId:field.Id}]

//      }))

//     setModel((prev: any) => {
//       const exists = prev.select.find((s: any) => s.columnId === field.Id);

//       if (exists) return prev;

//       return {
//         ...prev,

//         select: [
//           ...prev.select,
//           {
//             columnId: field.Id,
//             aggregate: null,
//             alias: null,
//           },
//         ],
//       };
//     });
//   }

//   async function run() {
//     console.log("Sending query model:", model);

//     const res = await runQuery(model);

//     setData(res);
//   }

//   const sql = generateSQL(model,columns,tables)

//   return (
//     <DndContext onDragEnd={handleDragEnd}>
//       <Grid container spacing={2} p={2}>
//         <Grid size={3}>
//           <FieldExplorer fields={columns} />
//         </Grid>

//         <Grid size={9}>
//           <SelectBuilder model={model} setModel={setModel} columns={columns} />

//           <WhereBuilder model={model} setModel={setModel} columns={columns} />

//           <Button variant="contained" onClick={run} sx={{ mt: 2 }}>
//             Run Query
//           </Button>

//           {/* <SqlPreview sql={sql}/> */}

//           <Paper sx={{ p: 2, mt: 2 }}>
//             <Typography variant="h6">Query Model Sent To Backend</Typography>

//             <pre>{JSON.stringify(model, null, 2)}</pre>
//           </Paper>
//         </Grid>

//         <Grid size={12}>
//           <ResultGrid data={data} />
//         </Grid>
//       </Grid>
//     </DndContext>
//   );
// }

//////////////

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Pagination,
  Stack,
  Switch,
  TextField,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  Badge,
} from "@mui/material";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import Container, { type ContainerProps } from "@mui/material/Container";
import { Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ArrowLeftIcon } from "@mui/x-date-pickers";
import { ArrowRightIcon } from "@mui/x-date-pickers";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import FieldExplorer from "../../components/QueryBuilder/FieldExplorer";
import SelectBuilder from "../../components/QueryBuilder/SelectBuilder";
import GroupByBuilder from "../../components/QueryBuilder/GroupByBuilder";
import AggregationBuilder from "../../components/QueryBuilder/AggregationBuilder";
import WhereBuilder from "../../components/QueryBuilder/WhereBuilder";
import OrderByBuilder from "../../components/QueryBuilder/OrderByBuilder";
import ResultGrid from "../../components/QueryBuilder/ResultGrid";
import PageContainer from "../../components/layout/PageContainer";
import HavingBuilder from "../../components/QueryBuilder/HavingBuilder";
import PaginationBuilder from "../../components/QueryBuilder/PaginationBuilder";
import { DownloadMenuOptions } from "../../components/QueryBuilder/DownloadButtons";

import useNotifications from "../../hooks/useNotifications/useNotifications";

import { exportExcel, exportCSV, exportPDF } from "../../utils/exportUtils";
import { validateQuery } from "../../utils/validation/queryValidator";

import { QueryModel, QueryTemplate } from "../../types/queryTypes";

import { getReportMetadata, runQuery } from "../../api/reportApi";
import { runQuery as runQueryBuild } from "../../api/query.api";
import {
  createQueryTemplates,
  getQueryTemplates,
  deleteQueryTemplate,
  getQueryTemplateById,
} from "../../api/query.api";

// import QueryBuilderForm, {
//   QueryBuilderFormState,
//   FormFieldValue,
//   QueryBuilderFormProps,
// } from "./QueryBuilderForm";

export interface QueryBuilderFormState {
  values: Partial<QueryTemplate>;
  errors: Partial<Record<keyof QueryBuilderFormState["values"], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

// function syncHaving(values: any[], prevHaving: any[] = []) {
//   return values.map((v: any) => {
//     const existing = prevHaving.find((h) => h.columnId === v.columnId);

//     return (
//       existing || {
//         columnId: v.columnId,
//         aggregate: v.aggregate || "SUM",
//         operator: ">",
//         value: "",
//         active: false,
//       }
//     );
//   });
// }

type QuerySaveModalProps = {
  open: boolean;
  onClose: () => void;
  modalFormState: QueryBuilderFormState;
  handleFormFieldChange: (
    name: keyof QueryBuilderFormState["values"],
    value: FormFieldValue,
  ) => void;
  handleSaveConfirm: () => void;
};

function QuerySaveModal({
  open,
  onClose,
  modalFormState,
  handleFormFieldChange,
  handleSaveConfirm,
}: QuerySaveModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Save Query</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DialogContentText>
          Enter a name for your query to save it for future use.
        </DialogContentText>

        <TextField
          autoFocus
          required
          margin="dense"
          label="Query Name"
          fullWidth
          error={!!modalFormState.errors?.name}
          helperText={modalFormState.errors?.name}
          value={modalFormState.values?.name || ""}
          onChange={(e) => handleFormFieldChange("name", e.target.value)}
        />

        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          value={modalFormState.values?.description || ""}
          error={!!modalFormState.errors?.description}
          helperText={modalFormState.errors?.description}
          onChange={(e) => handleFormFieldChange("description", e.target.value)}
        />

        <FormControlLabel
          control={
            <Switch
              checked={!!modalFormState.values?.isActive}
              onChange={(e, checked) =>
                handleFormFieldChange("isActive", checked)
              }
            />
          }
          label="Active"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveConfirm}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface QueryBuilderPageProps {
  formState: QueryBuilderFormState;
  // onFieldChange: (
  //   name: keyof QueryBuilderFormState["values"],
  //   value: FormFieldValue,
  // ) => void;
  // onSubmit: (
  //   formValues: Partial<QueryBuilderFormState["values"]>,
  // ) => Promise<void>;
  // onReset?: (formValues: Partial<QueryBuilderFormState["values"]>) => void;
  // submitButtonLabel: string;
  // backButtonPath?: string;
  // initialData?: QueryTemplate;
  // onSave: (data: QueryTemplate) => void;
  onCancel: () => void;
}

export default function QueryBuilderPage(props: QueryBuilderPageProps) {
  const {
    formState,
    // onFieldChange,
    // onSubmit,
    // onReset,
    // submitButtonLabel,
    // backButtonPath,
    // initialData,
    // onSave,
    onCancel,
  } = props;
  const [fields, setFields] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);

  const [activeField, setActiveField] = useState<any>(null);

  const notifications = useNotifications();

  const [model, setModel] = useState<QueryModel>({
    select: [],
    groupBy: [],
    values: [],
    where: [],
    having: [],
    orderBy: [],
    // page: 1,
    // pageSize: 10,
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      isPaginationEnabled: true,
    },
    distinct: false,
  });

  const [rows, setRows] = useState<QueryModel[]>([]);

  const [errors, setErrors] = useState<any>({});
  const [isValid, setIsValid] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  // const [modalFormState, setModalFormState] = useState<QueryBuilderFormState>({
  //   values: formState.values ?? {},
  //   errors: formState.errors ?? {},
  // });
  const [modalFormState, setModalFormState] = useState<QueryBuilderFormState>(
    () => ({
      values: formState?.values ?? {},
      errors: formState?.errors ?? {},
    }),
  );

  const navigate = useNavigate();

  useEffect(() => {
    const result = validateQuery(model);
    setErrors(result.errors);
    setIsValid(result.isValid);
    console.log("Validation result:", result);
  }, [model, validateQuery]);

  async function handleRun() {
    try {
      console.log("Running query with model:", model);
      const validationErrors = validateQuery(model);
      // if (validationErrors.length) {
      //   notifications.show(`Validation errors:\n${validationErrors.join("\n")}`, {
      //     severity: "error",
      //     autoHideDuration: 3000,
      //   });
      //   return;
      // }
      console.log("model after Generate Clicked : ", model);
      const data = await runQueryBuild(model);
      setRows(data);
      console.log("Query result:", data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadMeta();
    console.log("RUNNING EFFECT: <loadMeta>");
  }, []);

  async function loadMeta() {
    const meta = await getReportMetadata();
    console.log("Metadata loaded:", meta);
    setFields(meta.columns);
    setTables(meta.tables);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    const zone = over.id;
    const columnId = active.data.current?.columnId;
    if (!columnId) return;

    setModel((prev: any) => {
      const updated = { ...prev };

      // SELECT
      // if (zone === "select") {
      //   if (!updated.select.includes(columnId)) updated.select.push(columnId);
      // }

      if (zone === "select") {
        const columnId = active.data.current?.columnId;
        if (!columnId) return;

        const col = fields.find((f: any) => f.Id === columnId);

        console.log(col);

        updated.select = [
          ...(updated.select || []),
          {
            columnId,
            alias: col?.DisplayName || "", // ✅ DEFAULT ALIAS
            dataType: col?.DataType,
          },
        ];
      }

      // GROUP BY
      if (zone === "groupby") {
        if (!updated.groupBy.includes(columnId)) updated.groupBy.push(columnId);
      }

      // VALUES / AGGREGATION
      // if (zone === "values") {
      //   const exists = updated.values.find((v: any) => v.columnId === columnId);
      //   if (!exists) {
      //     updated.values.push({
      //       columnId,
      //       aggregate: "SUM",
      //     });
      //   }
      // }

      // if (zone === "values") {
      //   const exists = updated.values.find((v: any) => v.columnId === columnId);

      //   if (!exists) {
      //     const newVal = {
      //       columnId,
      //       aggregate: "SUM",
      //     };

      //     updated.values.push(newVal);

      //     // ✅ AUTO ADD TO HAVING
      //     updated.having.push({
      //       columnId,
      //       aggregate: "SUM",
      //       operator: ">",
      //       value: "",
      //       active: false, // toggle OFF by default
      //     });
      //   }
      // }

      // if (zone === "values") {
      //   const columnId = active.data.current?.columnId;

      //   if (!columnId) return;

      //   const exists = updated.values.find((v: any) => v.columnId === columnId);

      //   if (!exists) {
      //     const newAgg = {
      //       columnId,
      //       aggregate: "SUM",
      //     };

      //     updated.values.push(newAgg);

      //     // ✅ ADD HAVING ONLY AFTER VALUE SUCCESS
      //     updated.having = [
      //       ...(updated.having || []),
      //       {
      //         columnId,
      //         aggregate: "SUM",
      //         operator: ">",
      //         value: "",
      //         active: false,
      //       },
      //     ];
      //   }
      // }

      // if (zone === "values") {
      //   const columnId = active.data.current?.columnId;
      //   if (!columnId) return;

      //   const exists = updated.values.find((v: any) => v.columnId === columnId);

      //   if (!exists) {
      //     const newAgg = {
      //       columnId,
      //       aggregate: "SUM",
      //     };

      //     updated.values.push(newAgg);

      //     // ✅ FIX: sync HAVING on drag ALSO
      //     const existsHaving = (updated.having || []).find(
      //       (h: any) => h.columnId === columnId,
      //     );

      //     if (!existsHaving) {
      //       updated.having = [
      //         ...(updated.having || []),
      //         {
      //           columnId,
      //           aggregate: "SUM",
      //           operator: ">",
      //           value: "",
      //           active: false,
      //         },
      //       ];
      //     }
      //   }
      // }

      // if (zone === "values") {
      //   const columnId = active.data.current?.columnId;
      //   if (!columnId) return;

      //   const exists = updated.values.find((v: any) => v.columnId === columnId);

      //   if (!exists) {
      //     const newAgg = {
      //       columnId,
      //       aggregate: "SUM",
      //     };

      //     updated.values.push(newAgg);

      //     // ✅ MUST: also insert into HAVING
      //     updated.having = [
      //       ...(updated.having || []),
      //       {
      //         columnId,
      //         aggregate: "SUM",
      //         operator: ">",
      //         value: "",
      //         active: false,
      //       },
      //     ];
      //   }
      // }

      // REFACTOR: sync HAVING with VALUES on every drag, to ensure consistency, instead of only adding on new VALUE drag
      if (zone === "values") {
        const columnId = active.data.current?.columnId;
        if (!columnId) return;

        const exists = updated.values.find((v: any) => v.columnId === columnId);
        const col = fields.find((f: any) => f.Id === columnId);
        if (!exists) {
          updated.values.push({
            columnId,
            aggregate: "COUNT",
            alias: `COUNT_(${col?.DisplayName || ""})`, // ✅ DEFAULT
            dataType: col?.DataType,
          });

          // ❌ REMOVE OLD MANUAL PUSH
        }

        // ✅ ALWAYS SYNC HAVING
        //updated.having = syncHaving(updated.values, updated.having);
      }
      // REFACTOR: this sync logic can be extracted to a separate function since it's used in multiple places (on drag and on manual add from having builder)

      // WHERE / CONDITION
      if (zone === "where") {
        // check if this column already exists in where
        const exists = updated.where.find((w: any) => w.columnId === columnId);
        const col = fields.find((f: any) => f.Id === columnId);
        if (!exists) {
          updated.where.push({
            columnId,
            operator: "=",
            value: "",
            condition: "AND",
            dataType: col?.DataType,
          });
        }
      }

      // ORDER BY
      if (zone === "orderby") {
        const exists = updated.orderBy.find(
          (o: any) => o.columnId === columnId,
        );
        if (!exists) {
          updated.orderBy.push({
            columnId,
            direction: "ASC",
          });
        }
      }

      // if (zone === "having") {
      //   // Only allow if column exists in values
      //   const inValues = updated.values.find(
      //     (v: any) => v.columnId === columnId,
      //   );
      //   if (!inValues) return;

      //   // Prevent duplicate HAVING rows
      //   const exists = updated.having.find((h: any) => h.columnId === columnId);
      //   if (!exists) {
      //     updated.having.push({
      //       columnId,
      //       aggregate: inValues.aggregate, // prefill aggregate from values
      //       operator: ">",
      //       value: "",
      //     });
      //   }
      // }

      // if (zone === "having") {
      //   const columnId = active.data.current?.columnId;
      //   if (!columnId) return;

      //   // Only allow if column exists in Values
      //   const inValues = updated.values.find(
      //     (v: any) => v.columnId === columnId,
      //   );
      //   if (!inValues) return;

      //   // Prevent duplicates
      //   const exists = updated.having.find((h: any) => h.columnId === columnId);
      //   if (!exists) {
      //     updated.having.push({
      //       columnId,
      //       aggregate: inValues.aggregate, // prefill aggregate from Values
      //       operator: ">",
      //       value: "",
      //     });
      //   }
      // }

      // if (zone === "having") {
      //   const data = active.data.current;

      //   // ❌ BLOCK dragging from left panel
      //   if (data?.type !== "value") return;

      //   const columnId = data.columnId;

      //   const exists = updated.having.find((h: any) => h.columnId === columnId);
      //   if (!exists) {
      //     updated.having.push({
      //       columnId,
      //       aggregate: data.aggregate, // from values
      //       operator: ">",
      //       value: "",
      //     });
      //   }
      // }

      // if (zone === "having") {
      //   const data = active.data.current;

      //   // allow only drag from VALUES
      //   if (data?.type !== "value") return;

      //   const columnId = data.columnId;

      //   const exists = updated.having.find((h: any) => h.columnId === columnId);
      //   if (!exists) {
      //     updated.having.push({
      //       columnId,
      //       aggregate: data.aggregate,
      //       operator: ">",
      //       value: "",
      //     });
      //   }
      // }

      // REFACTOR: instead of checking type === "value", we can just check if the dragged column exists in VALUES, to allow more flexible drag from either left panel or values section
      // if (zone === "having") {
      //   const data = active.data.current;

      //   // ✅ allow ONLY aggregation drag
      //   if (data?.type !== "aggregation") return;

      //   const columnId = data.columnId;

      //   // const exists = updated.having.find((h: any) => h.columnId === columnId);
      //   // if (!exists) {
      //   //   updated.having.push({
      //   //     columnId,
      //   //     aggregate: data.aggregate,
      //   //     operator: ">",
      //   //     value: "",
      //   //   });
      //   // }

      //   const existsHaving = (updated.having || []).find(
      //     (h: any) => h.columnId === columnId,
      //   );

      //   if (!existsHaving) {
      //     updated.having.push({
      //       columnId,
      //       aggregate: "SUM",
      //       operator: ">",
      //       value: "",
      //       active: false,
      //     });
      //   }
      // }
      // REFACTOR: this can also be simplified by reusing the same syncHaving function used in VALUES, since the logic is essentially the same - just add to HAVING if it exists in VALUES and not already in HAVING

      if (zone === "having") {
        const columnId = active.data.current?.columnId;
        const col = fields.find((f: any) => f.Id === columnId);
        if (!columnId) return;

        updated.having = [
          ...(updated.having || []),
          {
            id: Date.now() + Math.random(),
            columnId,
            aggregate: "COUNT",
            operator: ">",
            value: "",
            active: true,
            condition: "AND",
            dataType: col?.DataType,
          },
        ];
      }
      return updated;
    });
  }

  async function run() {
    const res = await runQuery(model);

    setData(res);
  }

  useEffect(() => {
    if (!isValid) {
      const el = document.querySelector(".qb-row-error");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    console.log("RUNNING EFFECT: <errors>");
  }, [errors]);

  const setModalFormErrors = useCallback(
    (newFormErrors: Partial<QueryBuilderFormState["errors"]>) => {
      setModalFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );
  type ValidationResult = {
    issues: {
      message: string;
      path: (keyof QueryBuilderFormState["values"])[];
    }[];
  };
  const validateQueryConfirmSave = useCallback(
    (formValues: Partial<QueryBuilderFormState["values"]>) => {
      let issues: ValidationResult["issues"] = [];

      if (!formValues?.name || (formValues?.name as string).trim() === "") {
        issues = [...issues, { message: "Name is required", path: ["name"] }];
        // issues = [
        //   ...issues,
        //   {
        //     message: "Join date is required",
        //     path: ["dateOfJoining"],
        //   },
        // ];
      } else if ((formValues?.name as string).length > 100) {
        issues = [
          ...issues,
          { message: "Name must be less than 100 characters", path: ["name"] },
        ];
      }
      return { issues, isValid: true, errors: {} };
    },
    [model, modalFormState.values],
  );

  const handleSaveConfirm = useCallback(
    //async (event: React.SyntheticEvent) => {
    async () => {
      //event.preventDefault();
      console.log("Saving query with model:", model);

      // 1. validate query
      if (!isValid) {
        console.log(
          "Validation errors exist, cannot save.",
          isValid,
          errors,
          modalFormState.errors,
        );
        //alert("Please fix validation errors before saving.");
        notifications.show(
          `Please fix validation errors before confirm saving.`,
          {
            severity: "warning",
            autoHideDuration: 3000,
          },
        );
        return;
      }

      // 2. validate modal form
      console.log("Form values on save confirm:", formState?.values);
      //const { issues } = validateQueryConfirmSave(formState?.values);
      const { issues } = validateQueryConfirmSave(modalFormState.values);
      if (issues && issues.length > 0) {
        console.log("Validation issues found:", issues);
        setModalFormErrors(
          Object.fromEntries(
            issues.map((issue) => [issue.path?.[0], issue.message]),
          ),
        );
        return;
      }
      setModalFormErrors({});
      console.log("Form values after validation:", formState?.values);
      try {
        const queryTemplateData: QueryTemplate = {
          id: (formState?.values?.id as number) || 0,
          queryModel: model as QueryModel,
          // name: (formState?.values?.name as string) || `Query Template ${Date.now()}`,
          // description: (formState?.values?.description as string) || "",
          //isActive: (formState?.values?.isActive as boolean) || true,
          name:
            (modalFormState.values?.name as string) ||
            `Query Template ${Date.now()}`,
          description: (modalFormState.values?.description as string) || "",
          isActive: (modalFormState.values?.isActive as boolean) || true,
        };

        const response = await createQueryTemplates(queryTemplateData);
        if (response.success) {
          setOpenModal(false);
          notifications.show(
            response.message || "Query Template created successfully.",
            {
              severity: "success",
              autoHideDuration: 3000,
            },
          );
          //setShowForm(false);
          //loadData();
          navigate("/queryBuilder");
        } else {
          notifications.show(
            response.message || "Query Template creation failed.",
            {
              severity: "error",
              autoHideDuration: 3000,
            },
          );
        }
      } catch (error: any) {
        console.error(
          "Error creating query template:",
          error?.response?.data?.message || error.message,
        );

        notifications.show(
          error?.response?.data?.message || "Failed to create query template.",
          {
            severity: "error",
            autoHideDuration: 3000,
          },
        );
      }
    },
    [formState?.values, navigate, notifications, setModalFormErrors],
  );

  const handleSave = () => {
    if (!isValid) {
      //alert("Please fix validation errors before saving.");
      notifications.show(`Please fix validation errors before saving.`, {
        severity: "warning",
        autoHideDuration: 3000,
      });
      return;
    }
    setModalFormState({
      values: formState?.values ?? {},
      errors: {},
    });
    setOpenModal(true);
  };

  const handleFormFieldChange = useCallback(
    (name: keyof QueryBuilderFormState["values"], value: FormFieldValue) => {
      const validateField = async (
        values: Partial<QueryBuilderFormState["values"]>,
      ) => {
        const { issues } = validateQueryConfirmSave(values);
        setModalFormErrors({
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...modalFormState.values, [name]: value };

      //setModalFormValues(newFormValues);
      setModalFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
      validateField(newFormValues);
    },
    [modalFormState, validateQueryConfirmSave],
  );

  // function QuerySaveModal({
  //   open,
  //   onClose,
  // }: {
  //   open: boolean;
  //   onClose: () => void;
  // }) {
  //   return (
  //     <Dialog
  //       // open={true}
  //       // onClose={() => {}}
  //       //open={openModal}
  //       //onClose={() => setOpenModal(false)}
  //       open={open}
  //       onClose={onClose}
  //       slotProps={{
  //         paper: {
  //           component: "form",
  //           // onSubmit: (event: React.SyntheticEvent) => {
  //           //   event.preventDefault();
  //           //   handleSaveConfirm();
  //           //   setOpenModal(false);
  //           // },
  //           // onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
  //           //   event.preventDefault();
  //           //   handleSaveConfirm();
  //           //   setOpenModal(false);
  //           // },
  //           // onSubmit: (event: React.FormEvent) => {
  //           //   event.preventDefault();
  //           //   handleSaveConfirm();
  //           //   //setOpenModal(false);
  //           // },
  //         },
  //       }}
  //     >
  //       <DialogTitle>Save Query</DialogTitle>
  //       <DialogContent
  //         sx={{
  //           display: "flex",
  //           flexDirection: "column",
  //           gap: 2,
  //           width: "100%",
  //         }}
  //       >
  //         <DialogContentText>
  //           Enter a name for your query to save it for future use.
  //         </DialogContentText>
  //         <TextField
  //           autoFocus
  //           required
  //           margin="dense"
  //           id="name"
  //           name="name"
  //           label="Query Name"
  //           placeholder="Enter query name"
  //           type="text"
  //           fullWidth
  //           error={!!modalFormState.errors?.name}
  //           helperText={modalFormState.errors?.name}
  //           value={modalFormState.values?.name || ""}
  //           onChange={(event) =>
  //             handleFormFieldChange("name", event.target.value)
  //           }
  //         />
  //         <TextField
  //           margin="dense"
  //           id="description"
  //           name="description"
  //           label="Description"
  //           placeholder="Enter query description (optional)"
  //           type="text"
  //           fullWidth
  //           multiline
  //           //rows={3}
  //           error={!!modalFormState.errors?.description}
  //           helperText={modalFormState.errors?.description}
  //           value={modalFormState.values?.description || ""}
  //           onChange={(event) =>
  //             handleFormFieldChange("description", event.target.value)
  //           }
  //         />
  //         {/* <FormControlLabel
  //           control={<Checkbox name="isActive" />}
  //           label="Active"
  //         /> */}
  //         {/* <span>Is Active</span> */}
  //         {/* <Switch
  //           aria-label="Is Active"
  //           // checked={model.distinct || false}
  //           // onChange={(e) => setModel({ ...model, distinct: e.target.checked })}
  //         /> */}
  //         <FormControlLabel
  //           control={
  //             <Switch
  //               // checked={model.distinct || false}
  //               // onChange={(e) => setModel({ ...model, distinct: e.target.checked })}
  //               checked={!!modalFormState.values?.isActive}
  //               onChange={(event, checked) =>
  //                 handleFormFieldChange("isActive", checked)
  //               }
  //               value={modalFormState.values?.isActive || true}
  //             />
  //           }
  //           label="Active"
  //           // onChange={(event) =>
  //           //   handleFormFieldChange("isActive", event.target.checked)
  //           // }
  //           onChange={(event, checked) =>
  //             handleFormFieldChange("isActive", checked)
  //           }
  //         />
  //         <Typography variant="body2" color="textSecondary">
  //           Toggle to set the query template as active or inactive. Inactive
  //           templates will not be available for selection when running reports,
  //           but will be retained in the system for record-keeping and can be
  //           reactivated later if needed.
  //         </Typography>
  //         {/* {"Is Active"} */}
  //       </DialogContent>
  //       <DialogActions sx={{ pb: 3, px: 3 }}>
  //         <Button onClick={() => setOpenModal(false)}>Cancel</Button>
  //         <Button
  //           variant="contained"
  //           // type="submit"
  //           onClick={(event: React.SyntheticEvent) => {
  //             //handleSaveConfirm(event);
  //             handleSaveConfirm();
  //             //setOpenModal(false);
  //             //navigate("/queryBuilder");
  //           }}
  //           //onClick={handleSaveConfirm}
  //         >
  //           Save
  //         </Button>
  //       </DialogActions>
  //     </Dialog>
  //   );
  // }

  const [expandAllBuilders, setExpandAllBuilders] = useState(true);

  const [isStepperMode, setIsStepperMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const builders = useMemo(
    () => [
      {
        key: "select",
        label: "Select",
        // component: (
        //   <SelectBuilder
        //     model={model}
        //     setModel={setModel}
        //     columns={fields}
        //     tables={tables}
        //     errors={errors}
        //     expandAll={expandAllBuilders}
        //   />
        // ),
        component: SelectBuilder,
      },
      {
        key: "groupBy",
        label: "Group By",
        // component: (
        //   <GroupByBuilder
        //     model={model}
        //     setModel={setModel}
        //     columns={fields}
        //     tables={tables}
        //     errors={errors}
        //     expandAll={expandAllBuilders}
        //   />
        // ),
        component: GroupByBuilder,
      },
      {
        key: "aggregation",
        label: "Aggregation",
        // component: (
        //   <AggregationBuilder
        //     model={model}
        //     setModel={setModel}
        //     columns={fields}
        //     tables={tables}
        //     errors={errors}
        //     expandAll={expandAllBuilders}
        //   />
        // ),
        component: AggregationBuilder,
      },
      {
        key: "where",
        label: "Where",
        // component: (
        //   <WhereBuilder
        //     model={model}
        //     setModel={setModel}
        //     columns={fields}
        //     tables={tables}
        //     errors={errors}
        //     expandAll={expandAllBuilders}
        //   />
        // ),
        component: WhereBuilder,
      },
      {
        key: "having",
        label: "Having",
        // component: (
        //   <HavingBuilder
        //     model={model}
        //     setModel={setModel}
        //     columns={fields}
        //     tables={tables}
        //     errors={errors}
        //     expandAll={expandAllBuilders}
        //   />
        // ),
        component: HavingBuilder,
      },
      {
        key: "pagination",
        label: "Pagination",
        // component: (
        //   <PaginationBuilder
        //     model={model}
        //     setModel={setModel}
        //     // columns={fields}
        //     // tables={tables}
        //     errors={errors}
        //     // expandAll={expandAllBuilders}
        //   />
        // ),
        component: PaginationBuilder,
      },
      {
        key: "orderBy",
        label: "Order By",
        // component: (
        //   <OrderByBuilder
        //     model={model}
        //     setModel={setModel}
        //     columns={fields}
        //     tables={tables}
        //     errors={errors}
        //     expandAll={expandAllBuilders}
        //   />
        // ),
        component: OrderByBuilder,
      },
    ],
    //[expandAllBuilders],
    [],
  );
  //const builderKeys = builders.map((b) => b.key);
  const builderKeys = useMemo(() => builders.map((b) => b.key), [builders]);

  // const [selectedBuilders, setSelectedBuilders] = useState<string[]>([]);

  // useEffect(() => {
  //   if (builderKeys.length > 0) {
  //     setSelectedBuilders(builderKeys);
  //   }
  // }, [builderKeys]);

  // useEffect(() => {
  //   if (
  //     builderKeys.length > 0
  //     //&& selectedBuilders.length === 0
  //   ) {
  //     setSelectedBuilders(builderKeys);
  //   }
  // }, [builderKeys, selectedBuilders.length]);

  //
  const [selectedBuilders, setSelectedBuilders] =
    useState<string[]>(builderKeys);

  useEffect(() => {
    setSelectedBuilders(builderKeys);
  }, [builderKeys]);
  //

  // useEffect(() => {
  //   if (selectedBuilders.length === 0 && builderKeys.length > 0) {
  //     setSelectedBuilders(builderKeys);
  //   }
  // }, [builderKeys]); // 🔥 no dependency on selectedBuilders

  // const [selectedBuilders, setSelectedBuilders] = useState<string[]>(
  //   () => builderKeys,
  // );

  const isAllBuildersSelected =
    selectedBuilders.length === builderKeys.length && builderKeys.length > 0;

  // const handleToggleAllBuilders = () => {
  //   setSelectedBuilders(isAllBuildersSelected ? [] : builderKeys);
  // };

  // const handleToggleAllBuilders = (checked: boolean) => {
  //   setSelectedBuilders(checked ? builderKeys : []);
  // };

  const handleToggleAllBuilders = (checked: boolean) => {
    if (!checked) {
      setSelectedBuilders([]);
      return;
    }
    setSelectedBuilders([...builderKeys]);
  };

  const handleToggleBuilder = (key: string) => {
    setSelectedBuilders((prev = []) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const filteredBuilders = builders.filter((b) =>
    selectedBuilders.includes(b.key),
  );

  const maxIndex = filteredBuilders.length - 1;

  const handlePrev = () => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  };

  const handleNext = () => {
    setActiveIndex((i) => Math.min(i + 1, maxIndex));
  };

  useEffect(() => {
    console.log("RUNNING EFFECT: <selectedBuilders>");
    setActiveIndex(0);
  }, [selectedBuilders]);

  useEffect(() => {
    console.log("RUNNING EFFECT: <filteredBuilders.length>");
    setActiveIndex((prev) => Math.min(prev, filteredBuilders.length - 1, 0));
  }, [filteredBuilders.length]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuOpen = Boolean(anchorEl);

  const [openResetConfirm, setOpenResetConfirm] = useState(false);
  const handleResetAll = () => {
    setModel((prev: any) => ({
      ...prev,
      select: [],
      where: [],
      groupBy: [],
      having: [],
      orderBy: [],
      values: [], // aggregation builder
    }));

    // select: [],
    // groupBy: [],
    // values: [],
    // where: [],
    // having: [],
    // orderBy: [],
    // // page: 1,
    // // pageSize: 10,
    // pagination: {
    //   pageNumber: 1,
    //   pageSize: 10,
    //   isPaginationEnabled: true,
    // },
    // distinct: false,

    setOpenResetConfirm(false);
  };

  const hasData =
    model?.select?.length ||
    model?.where?.length ||
    model?.groupBy?.length ||
    model?.having?.length ||
    model?.orderBy?.length ||
    model?.values?.length;
  return (
    // {openModal === true && <QuerySaveModal />}

    // {openModal && <QuerySaveModal open={openModal} onClose={() => setOpenModal(false)} />}

    // <DndContext
    //   onDragStart={(e) => {
    //     setActiveField(e.active.data.current?.field);
    //   }}
    //   onDragEnd={(e) => {
    //     setActiveField(null);

    //     handleDragEnd(e);
    //   }}
    // >
    <>
      {/* <QuerySaveModal open={openModal} onClose={() => setOpenModal(false)} /> */}
      {/* <PageContainer> */}
      {/* <Container sx={{ flex: 1, display: "flex", flexDirection: "column" }}> */}
      <QuerySaveModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        modalFormState={modalFormState}
        handleFormFieldChange={handleFormFieldChange}
        handleSaveConfirm={handleSaveConfirm}
      />
      <Dialog
        open={openResetConfirm}
        onClose={() => setOpenResetConfirm(false)}
      >
        <DialogTitle>Reset all builders?</DialogTitle>

        <DialogContent>
          This will remove all configured rows in all builders.
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenResetConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleResetAll}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        //anchorEl={anchorEl} open={open} onClose={handleClose}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
      >
        {/* ALL */}
        <MenuItem
          // onClick={(e) => {
          //   e.stopPropagation();
          //   //handleToggleAllBuilders();
          // }}
          disableRipple
        >
          <Checkbox
            checked={isAllBuildersSelected}
            indeterminate={
              selectedBuilders.length > 0 &&
              selectedBuilders.length < builderKeys.length
            }
            // onChange={handleToggleAllBuilders}
            onChange={(e) => {
              e.stopPropagation();
              //handleToggleAllBuilders();
              handleToggleAllBuilders(e.target.checked);
            }}
          />
          <ListItemText primary="All" />
        </MenuItem>

        {/* INDIVIDUAL BUILDERS */}
        {builders.map((b) => (
          <MenuItem
            key={b.key}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   //handleToggleBuilder(b.key);
            // }}
            disableRipple
          >
            <Checkbox
              checked={selectedBuilders.includes(b.key)}
              // onChange={() => handleToggleBuilder(b.key)}
              onChange={(e) => {
                e.stopPropagation();
                handleToggleBuilder(b.key);
              }}
            />
            <ListItemText primary={b.label} />
          </MenuItem>
        ))}
      </Menu>

      <DndContext
        onDragStart={(event) => {
          setActiveField(event.active.data.current);
        }}
        onDragEnd={(event) => {
          setActiveField(null);
          handleDragEnd(event);
        }}
      >
        {errors?.global?.length > 0 && (
          <Paper sx={{ p: 2, m: 2, background: "#ffe6e6" }}>
            {errors.global.map((e: string, i: number) => (
              <div key={i} style={{ color: "red" }}>
                {e}
              </div>
            ))}
          </Paper>
        )}

        <Grid container spacing={2} p={2}>
          <Grid size={3}>
            <FieldExplorer fields={fields} tables={tables} />
          </Grid>

          <Grid size={9}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Previous">
                  <span>
                    <IconButton
                      disabled={!isStepperMode || activeIndex === 0}
                      onClick={() => setActiveIndex((i) => i - 1)}
                      //onClick={handleNext}
                      size="small"
                    >
                      {/* <ArrowBackIosNewIcon /> */}
                      <ArrowLeftIcon></ArrowLeftIcon>
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Next">
                  <span>
                    <IconButton
                      //disabled={ !isStepperMode || activeIndex === builders.length - 1}
                      disabled={!isStepperMode || activeIndex >= maxIndex}
                      onClick={() => setActiveIndex((i) => i + 1)}
                      //onClick={handlePrev}
                      size="small"
                    >
                      {/* <ArrowForwardIosIcon /> */}
                      <ArrowRightIcon></ArrowRightIcon>
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Toggle Step Mode">
                  <Switch
                    checked={isStepperMode}
                    onChange={(e) => setIsStepperMode(e.target.checked)}
                    size="small"
                  />
                </Tooltip>
              </Box>

              {/* your existing expand/collapse all button stays here */}
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip
                  title={hasData ? "Reset all builders" : "Nothing to reset"}
                >
                  <span>
                    <IconButton
                      size="small"
                      //onClick={() => setOpenResetConfirm(true)}
                      onClick={() => {
                        if (!hasData) return; // extra safety
                        setOpenResetConfirm(true);
                      }}
                      disabled={!hasData}
                    >
                      <RestartAltIcon
                        sx={{
                          color: hasData ? "error.main" : "action.disabled",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>

                <IconButton onClick={handleOpen} size="small">
                  <Badge
                    badgeContent={selectedBuilders.length}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 10,
                        height: 16,
                        minWidth: 16,
                      },
                    }}
                  >
                    <FilterListIcon />
                  </Badge>
                </IconButton>

                <Tooltip
                  title={expandAllBuilders ? "Collapse all" : "Expand all"}
                >
                  <IconButton
                    size="small"
                    onClick={() => setExpandAllBuilders((p) => !p)}
                  >
                    {" "}
                    {expandAllBuilders ? (
                      <UnfoldLessIcon />
                    ) : (
                      <UnfoldMoreIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Grid container spacing={2}>
              {filteredBuilders.map((b, index) => {
                if (isStepperMode && index !== activeIndex) return null;
                const Component = b.component;
                return (
                  <Grid size={24} key={b.key}>
                    <Component
                      expandAll={expandAllBuilders}
                      model={model}
                      setModel={setModel}
                      columns={fields}
                      tables={tables}
                      errors={errors}
                    />
                  </Grid>
                );
              })}
            </Grid>

            {/* <Grid container spacing={2}>
              {filteredBuilders.map((b, index) => {
                if (isStepperMode && index !== activeIndex) return null;

                return (
                  <Grid size={24} key={b.key}>
                    {b.component}
                  </Grid>
                );
              })}
            </Grid> */}

            {/* <Grid container spacing={2}>
              {builders.map((b, index) => {
                if (isStepperMode && index !== activeIndex) return null;

                return (
                  <Grid size={24} key={b.key}>
                    {b.component}
                  </Grid>
                );
              })}
            </Grid> */}

            {/* <Grid container spacing={2}>
              <Grid size={24}>
                <SelectBuilder
                  model={model}
                  setModel={setModel}
                  columns={fields}
                  tables={tables}
                  errors={errors}
                  expandAll={expandAllBuilders}
                />
              </Grid>

              <Grid size={24}>
                <GroupByBuilder
                  model={model}
                  setModel={setModel}
                  columns={fields}
                  tables={tables}
                  errors={errors}
                  expandAll={expandAllBuilders}
                />
              </Grid>

              <Grid size={24}>
                <AggregationBuilder
                  model={model}
                  setModel={setModel}
                  columns={fields}
                  tables={tables}
                  errors={errors}
                  expandAll={expandAllBuilders}
                />
              </Grid>

              <Grid size={24}>
                <WhereBuilder
                  model={model}
                  setModel={setModel}
                  columns={fields}
                  tables={tables}
                  errors={errors}
                  expandAll={expandAllBuilders}
                />
              </Grid>
              <Grid size={24}>
                <HavingBuilder
                  model={model}
                  setModel={setModel}
                  columns={fields}
                  tables={tables}
                  errors={errors}
                  expandAll={expandAllBuilders}
                />
              </Grid>
              <Grid size={24}>
                <PaginationBuilder
                  model={model}
                  setModel={setModel}
                  // columns={fields}
                  // tables={tables}
                  // expandAll={expandAllBuilders}
                  errors={errors}
                />
              </Grid>
              <Grid size={24}>
                <OrderByBuilder
                  model={model}
                  setModel={setModel}
                  columns={fields}
                  tables={tables}
                  errors={errors}
                  expandAll={expandAllBuilders}
                />
              </Grid>
            </Grid> */}

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <div
                style={{
                  flex: 1,
                  justifyContent: "space-between",
                  display: "flex",
                }}
              >
                <>
                  <Grid>
                    <Button
                      variant="contained"
                      onClick={handleRun}
                      disabled={!isValid}
                      fullWidth
                      sx={{
                        "&.Mui-disabled": {
                          color: "#fff", // ensure text visible
                          opacity: 0.6,
                        },
                      }}
                    >
                      Generate Report
                    </Button>
                  </Grid>

                  {/* <Grid>
              <Button
                variant="outlined"
                disabled={rows.length === 0}
                onClick={() => exportExcel(rows, "Report")}
              >
                Export Excel
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="outlined"
                disabled={rows.length === 0}
                onClick={() => exportCSV(rows, "Report")}
              >
                Export CSV
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="outlined"
                disabled={rows.length === 0}
                onClick={() => exportPDF(rows, "Report")}
              >
                Export PDF
              </Button>
            </Grid> */}

                  <DownloadMenuOptions row={rows} />
                </>
                <>
                  <Stack
                    // sx={{ mt: 2 }}
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Button
                      variant="contained"
                      startIcon={<ArrowBackIcon />}
                      //onClick={handleBack}
                      onClick={onCancel}
                    >
                      Back
                    </Button>
                    <Button
                      //type="submit"
                      variant="contained"
                      // size="large"
                      //loading={isSubmitting}
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      {/* {submitButtonLabel} */}
                      {/* {formState.id ? "Update" : "Save"} */}
                      Save
                    </Button>
                  </Stack>
                </>
              </div>
            </Grid>

            {/* <Stack
            sx={{ mt: 2 }}
            direction="row"
            spacing={2}
            justifyContent="space-between"
          >
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              //onClick={handleBack}
              onClick={onCancel}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              //loading={isSubmitting}
            >
              {formState.id ? "Update" : "Save"}
            </Button>
          </Stack> */}
          </Grid>
          {/* <Button variant="contained" onClick={handleRun}>
          Run Query
        </Button> */}
          <Grid size={12}>
            {/* <ResultGrid data={data} /> */}
            <DataGrid
              rows={rows}
              getRowId={(row) => JSON.stringify(row)}
              columns={
                rows.length
                  ? Object.keys(rows[0]).map((key) => ({
                      field: key,
                      headerName: key,
                      flex: 1,
                    }))
                  : []
              }
            />
          </Grid>
        </Grid>

        {/* <DragOverlay>
        {activeField && (
          <Paper sx={{ p: 1, px: 2, background: "#1976d2", color: "white" }}>
            {activeField.DisplayName}
          </Paper>
        )}
      </DragOverlay> */}
        <DragOverlay>
          {activeField?.columnId ? (
            <div
              style={{
                //border: "1px solid #1976d2",
                border: "1px solid #011b34",
                background: "#054d82",
                color: "white",
                padding: 6,
                borderRadius: 4,
              }}
            >
              {fields.find((c: any) => c.Id === activeField.columnId)
                ?.DisplayName || "Field"}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {/* </Container> */}
      {/* </PageContainer> */}
    </>
  );
}
