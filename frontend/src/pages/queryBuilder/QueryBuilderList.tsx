//import * as React from 'react';
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  GridEventListener,
  gridClasses,
  //GridValueGetterParams,
  GridValueGetter,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import ViewIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDialogs } from "../../hooks/useDialogs/useDialogs";
import useNotifications from "../../hooks/useNotifications/useNotifications";
import PageContainer from "../../components/layout/PageContainer";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";

// import {
//   getEmployeesService as getEmployees,
//   createEmployeeService as createEmployee,
//   updateEmployeeService as updateEmployee,
//   getEmployeeByIdService as getEmployee,
// } from "../../services/employeeService";
// import type { Employee } from "../../types/employee";
// import EmployeeForm, {
//   type FormFieldValue,
//   type EmployeeFormState,
// } from "./EmployeeForm";

//import { QueryFormState } from "./QueryBuilderPage";
// import QueryFormState, {
//   FormFieldValue,
//   QueryBuilderFormState,
// } from "./QueryBuilderForm";

import type { QueryBuilderFormState, FormFieldValue } from "./QueryBuilderPage";

import {
  getQueryTemplates,
  getQueryTemplateById,
  createQueryTemplates,
  updateQueryTemplates,
  deleteQueryTemplate,
} from "../../api/query.api";
import type {
  QueryBuilderQueryParams,
  QueryModel,
  QueryTemplate,
} from "../../types/queryTypes";
import Chip from "@mui/material/Chip";
import {
  DownloadMenuOptions,
  DownloadMenuOptionsInList,
} from "../../components/QueryBuilder/DownloadButtons";
import QueryBuilderPage from "./QueryBuilderPage";

const INITIAL_PAGE_SIZE = 10;

export default function QueryBuilderList() {
  const { token } = useAuth();

  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
    pageSize: searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : INITIAL_PAGE_SIZE,
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>(
    searchParams.get("filter")
      ? JSON.parse(searchParams.get("filter") ?? "")
      : { items: [] },
  );
  const [sortModel, setSortModel] = useState<GridSortModel>(
    searchParams.get("sort") ? JSON.parse(searchParams.get("sort") ?? "") : [],
  );

  const [rowsState, setRowsState] = useState<{
    rows: QueryTemplate[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handlePaginationModelChange = useCallback(
    (model: GridPaginationModel) => {
      setPaginationModel(model);

      searchParams.set("page", String(model.page));
      searchParams.set("pageSize", String(model.pageSize));

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleFilterModelChange = useCallback(
    (model: GridFilterModel) => {
      setFilterModel(model);

      if (
        model.items.length > 0 ||
        (model.quickFilterValues && model.quickFilterValues.length > 0)
      ) {
        searchParams.set("filter", JSON.stringify(model));
      } else {
        searchParams.delete("filter");
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      setSortModel(model);

      if (model.length > 0) {
        searchParams.set("sort", JSON.stringify(model));
      } else {
        searchParams.delete("sort");
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? "?" : ""}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  //my custom code
  const INITIAL_FORM_VALUES: Partial<QueryBuilderFormState["values"]> = {
    id: 0,
    name: "",
    description: "",
    isActive: false,
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: "",
    queryModel: {
      select: [],
      groupBy: [],
      values: [],
      where: [],
      having: [],
      orderBy: [],
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        isPaginationEnabled: true,
      },
      distinct: false,
    },
  };
  const [showForm, setShowForm] = useState(false);
  const [queryTemplates, setQueryTemplates] = useState<QueryTemplate[]>([]);
  const [editData, setEditData] = useState<QueryTemplate | undefined>(
    undefined,
  );

  interface QueryBuilderFormProps {
    formState: QueryBuilderFormState;
    onFieldChange: (
      name: keyof QueryBuilderFormState["values"],
      value: FormFieldValue,
    ) => void;
    onSubmit: (
      formValues: Partial<QueryBuilderFormState["values"]>,
    ) => Promise<void>;
    onReset?: (formValues: Partial<QueryBuilderFormState["values"]>) => void;
    submitButtonLabel: string;
    backButtonPath?: string;
    initialData?: QueryTemplate;
    onSave: (data: QueryTemplate) => void;
    onCancel: () => void;
  }

  const query = useMemo(() => {
    return {
      id: editData?.id || 0,
      mode: 2,
      pageNumber: paginationModel.page + 1, // backend usually 1-based
      pageSize: paginationModel.pageSize,
      search: filterModel.quickFilterValues?.[0] || "",
      sortBy: sortModel[0]?.field || "Id",
      sortOrder:
        (sortModel[0]?.sort?.toUpperCase() as "ASC" | "DESC") || "DESC",
    };
  }, [editData, paginationModel, sortModel, filterModel]);

  const [formState, setFormState] = React.useState<QueryBuilderFormState>(
    () => ({
      values: INITIAL_FORM_VALUES,
      errors: {},
    }),
  );
  const formValues = formState.values;
  const formErrors = formState.errors;
  //   const handleSave = async (data: QueryTemplate) => {
  //     if (data.id === 0) {
  //       await createQueryTemplate(data);
  //     } else {
  //       await updateQueryTemplate(data);
  //     }
  //     setShowForm(false);
  //     loadData();
  //   };
  const setFormValues = React.useCallback(
    (newFormValues: Partial<QueryBuilderFormState["values"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );
  //   const handleFormReset = React.useCallback(() => {
  //     setFormValues(INITIAL_FORM_VALUES);
  //   }, [setFormValues]);

  //   type ValidationResult = {
  //     issues: { message: string; path: (keyof QueryBuilderFormState["values"])[] }[];
  //   };

  //   const validateQuery = (query: Partial<QueryBuilderFormState["values"]>): ValidationResult => {
  //     let issues: ValidationResult["issues"] = [];

  //     if (!query.fullName) {
  //       issues = [...issues, { message: "Name is required", path: ["fullName"] }];
  //     }

  //     if (!query.email) {
  //       issues = [...issues, { message: "Email is required", path: ["email"] }];
  //     } else if (
  //       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(query.email)
  //     ) {
  //       issues = [...issues, { message: "Enter a valid email", path: ["email"] }];
  //     }

  //     if (!query.dateOfJoining) {
  //       issues = [
  //         ...issues,
  //         { message: "Join date is required", path: ["dateOfJoining"] },
  //       ];
  //     } else {
  //       const joiningDate = new Date(query.dateOfJoining);
  //       const today = new Date();

  //       // Remove time part for accurate comparison
  //       today.setHours(0, 0, 0, 0);
  //       joiningDate.setHours(0, 0, 0, 0);

  //       if (joiningDate > today) {
  //         issues = [
  //           ...issues,
  //           {
  //             message: "Join date cannot be a future date",
  //             path: ["dateOfJoining"],
  //           },
  //         ];
  //       }
  //     }

  //     if (!query.department) {
  //       issues = [
  //         ...issues,
  //         { message: "Department is required", path: ["department"] },
  //       ];
  //     }
  //     if (!query.designation) {
  //       issues = [
  //         ...issues,
  //         { message: "Designation is required", path: ["designation"] },
  //       ];
  //     }

  //     return { issues };
  //   };

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<QueryBuilderFormState["errors"]>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

  //   const handleFormFieldChange = React.useCallback(
  //     (name: keyof QueryFormState["values"], value: FormFieldValue) => {
  //       const validateField = async (
  //         values: Partial<QueryFormState["values"]>,
  //       ) => {
  //         const { issues } = validateQuery(values);
  //         setFormErrors({
  //           ...formErrors,
  //           [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
  //         });
  //       };

  //       const newFormValues = { ...formValues, [name]: value };

  //       setFormValues(newFormValues);
  //       validateField(newFormValues);
  //     },
  //     [formValues, formErrors, setFormErrors, setFormValues],
  //   );
  // const handleFormSubmit = React.useCallback(async () => {
  //   const { issues } = validateEmployee(formValues);
  //   if (issues && issues.length > 0) {
  //     setFormErrors(
  //       Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
  //     );
  //     return;
  //   }
  //   setFormErrors({});

  //   try {

  //     const employeeDataToSubmit: Employee = {
  //       employeeId: editData?.employeeId || 0,
  //       employeeCode: formValues.employeeCode || "",
  //       fullName: formValues.fullName || "",
  //       email: formValues.email || "",
  //       department: formValues.department || "",
  //       designation: formValues.designation || "",
  //       dateOfJoining: formValues.dateOfJoining? dayjs(new Date(formValues.dateOfJoining)).format("YYYY-MM-DD"): "",
  //       employmentType: formValues.employmentType as "Permanent" | "Contract",
  //       status: formValues.status as "Active" | "On Hold" | "Resigned" || "Active",
  //     };
  //     const response = await createEmployee(employeeDataToSubmit);
  //     if (response.success) {
  //       notifications.show(response.message || 'Employee created successfully.', {
  //         severity: 'success',
  //         autoHideDuration: 3000,
  //       });
  //       setShowForm(false);
  //       loadData();
  //     } else {
  //       notifications.show(response.message || 'Employee creation failed.', {
  //         severity: 'error',
  //         autoHideDuration: 3000,
  //       });

  //     }

  //   }
  //   catch (error: any) {
  //     console.error(
  //       'Error creating employee:',
  //       error?.response?.data?.message || error.message
  //     );

  //     notifications.show(
  //       error?.response?.data?.message || 'Failed to create employee.',
  //       {
  //         severity: 'error',
  //         autoHideDuration: 3000,
  //       }
  //     );
  //   }
  // }, [formValues, navigate, notifications, setFormErrors]);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!token) {
        console.warn(
          "No token found, redirecting to loginData callback",
          token,
        );
        navigate("/login", { replace: true });
        return;
      } // 🚨 CRITICAL LINE
      console.log(
        "Token found in loadData, fetching employee data...",
        token,
        "Query params:",
        query,
      );
      const listData = await getQueryTemplates(query);
      console.log("getQueryTemplates ", listData);
      setQueryTemplates(listData?.data?.data || []);
      setRowsState({
        rows: listData?.data?.data || [],
        rowCount: listData.data.totalRecords,
      });
    } catch (listDataError) {
      setError(listDataError as Error);
    }

    setIsLoading(false);
  }, [query, token, navigate]);

  useEffect(() => {
    if (!token) {
      console.warn("No token found, redirecting to login", token);
      navigate("/login", { replace: true });
      return;
    } // 🚨 CRITICAL LINE
    console.log("Token found, loading query template data...", token);
    loadData();
  }, [loadData, token]);

  const handleRefresh = useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = useCallback<GridEventListener<"rowClick">>(
    ({ row }) => {
      navigate(`/query/template/${row.id}`);
    },
    [navigate],
  );

  const handleCreateClick = useCallback(() => {
    navigate("/query/template/new");
  }, [navigate]);

  const handleRowEdit = useCallback(
    (queryTemplate: QueryTemplate) => () => {
      navigate(`/query/template/${queryTemplate.id}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = useCallback(
    (queryTemplate: QueryTemplate) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete ${queryTemplate.name || "this template"}?`,
        {
          title: `Delete template?`,
          severity: "error",
          okText: "Delete",
          cancelText: "Cancel",
        },
      );

      if (confirmed) {
        setIsLoading(true);
        try {
          await deleteQueryTemplate(Number(queryTemplate.id));

          notifications.show("Template deleted successfully.", {
            severity: "success",
            autoHideDuration: 3000,
          });
          loadData();
        } catch (deleteError) {
          notifications.show(
            `Failed to delete template. Reason: ${(deleteError as Error).message}`,
            {
              severity: "error",
              autoHideDuration: 3000,
            },
          );
        }
        setIsLoading(false);
      }
    },
    [dialogs, notifications, loadData],
  );

  const initialState = useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "Name",
        headerName: "Name",
        flex: 1,
        align: "left",
        headerAlign: "left",
        //   renderCell: (params) => (
        //     <Box>
        //       <Typography variant="body1">{params.row.Name}</Typography>
        //     </Box>
        //   ),
      },
      {
        field: "Description",
        headerName: "Description",
        type: "string",
        flex: 1,
        renderCell: (params) => (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {params.row.Description}
            </Typography>
          </Box>
        ),
      },
      {
        field: "IsActive",
        headerName: "Active",
        type: "boolean",
        // renderCell: (params) => (
        //   <Box>
        //     <Typography variant="body1">
        //         {params.row.isActive ? "Yes" : "No"}
        //     </Typography>
        //   </Box>
        // ),
        renderCell: (params) => {
          const isActive = params.row.IsActive;
          return (
            <Chip
              label={isActive ? "Active" : "Inactive"}
              color={isActive ? "success" : "error"}
              size="small"
              variant="filled"
            />
          );
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        flex: 1,
        align: "right",
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="view-item"
            icon={<ViewIcon />}
            label="View"
            onClick={() => {
              setShowForm(true);
              setEditData(row);
              setFormValues({
                id: row.id,
                name: row.name,
                isActive: row.isActive,
                description: row.description,
                createdBy: row.createdBy,
                createdAt: row.createdAt,
                updatedBy: row.updatedBy,
                updatedAt: row.updatedAt,
                queryModel: row.queryModel,
              });
            }}
          />,
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Edit"
            onClick={() => {
              setShowForm(true);
              setEditData(row);
              setFormValues({
                id: row.id,
                name: row.name,
                isActive: row.isActive,
                description: row.description,
                createdBy: row.createdBy,
                createdAt: row.createdAt,
                updatedBy: row.updatedBy,
                updatedAt: row.updatedAt,
                queryModel: row.queryModel,
              });
            }}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleRowDelete(row)}
          />,
          // <GridActionsCellItem
          //   key="download-item"
          //   icon={<DownloadIcon />}
          //   label="Download"
          //   onClick={() => handleDownload(row)}
          // />,
          <GridActionsCellItem
            key="download-item"
            icon={<DownloadIcon />}
            label="Download"
            // onClick={() => <DownloadMenuOptions row={row} />}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
              setSelectedRow(row);
            }}
          />,
        ],
      },
    ],
    [handleRowEdit, handleRowDelete],
  );

  const pageTitle = "Query Templates";

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: pageTitle }]}
      actions={
        showForm ? null : ( // ) //   /> //     }} //       setFormErrors({}); //       setEditData(undefined); //       setShowForm(false); //     onCancel={() => { //     // onSave={handleSave} //     //initialData={editData} //     //backButtonPath={`/query/template/${queryTemplates.find((template) => template.id === editData?.id)?.id || ""}`} //     //submitButtonLabel="Save" //     //onReset={handleFormReset} //     //onSubmit={handleFormSubmit} //     //onFieldChange={handleFormFieldChange} //     formState={formState} //   <QueryBuilderPage // (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="Reload data" placement="right" enterDelay={1000}>
              <div>
                <IconButton
                  size="small"
                  aria-label="refresh"
                  onClick={handleRefresh}
                >
                  <RefreshIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Button
              variant="contained"
              onClick={() => {
                setEditData(undefined);
                setShowForm(true);
                setFormValues(INITIAL_FORM_VALUES);
              }}
              startIcon={<AddIcon />}
            >
              Create
            </Button>
          </Stack>
        )
      }
    >
      <DownloadMenuOptionsInList
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        row={selectedRow}
        onClose={() => setAnchorEl(null)}
      />

      {showForm ? (
        <QueryBuilderPage
          formState={formState}
          //onFieldChange={handleFormFieldChange}
          //onSubmit={handleFormSubmit}
          //onReset={handleFormReset}
          //submitButtonLabel="Save"
          //backButtonPath={`/query/template/${queryTemplates.find((template) => template.id === editData?.id)?.id || ""}`}
          //initialData={editData}
          // onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditData(undefined);
            setFormErrors({});
            console.log("Form cancelled, returning to list view");
          }}
        />
      ) : (
        <>
          <Box sx={{ flex: 1, width: "100%" }}>
            {error ? (
              <Box sx={{ flexGrow: 1 }}>
                <Alert severity="error">{error.message}</Alert>
              </Box>
            ) : (
              <DataGrid
                rows={rowsState.rows}
                columns={columns}
                getRowId={(row) => row.Id}
                pagination
                // sortingMode="server"
                // filterMode="server"
                // paginationMode="server"
                paginationModel={paginationModel}
                // rowCount={rowsState.rowCount}
                onPaginationModelChange={handlePaginationModelChange}
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                filterModel={filterModel}
                onFilterModelChange={handleFilterModelChange}
                disableRowSelectionOnClick
                //onRowClick={handleRowClick}
                loading={isLoading}
                initialState={initialState}
                showToolbar
                pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
                sx={{
                  [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                    outline: "transparent",
                  },
                  [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                    {
                      outline: "none",
                    },
                  [`& .${gridClasses.row}:hover`]: {
                    cursor: "pointer",
                  },
                }}
                slotProps={{
                  loadingOverlay: {
                    variant: "circular-progress",
                    noRowsVariant: "circular-progress",
                  },
                  baseIconButton: {
                    size: "small",
                  },
                }}
                // disableColumnFilter
              />
            )}
          </Box>
        </>
      )}
    </PageContainer>
  );
}
