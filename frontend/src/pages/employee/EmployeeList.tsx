//import * as React from 'react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
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
  GridValueGetter
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  deleteOne as deleteEmployee,
  //getMany as getEmployees,
  //type Employee,
} from '../../data/employees';
import PageContainer from '../../components/layout/PageContainer';
import {
  getEmployeesService as getEmployees,
  //getLeaveBalanceService as getLeaveBalance,
  createEmployeeService as createEmployee,
  updateEmployeeService as updateEmployee,
  getEmployeeByIdService as getEmployee,
} from "../../services/employeeService";
import type { Employee } from "../../types/employee";
import Typography from '@mui/material/Typography';
//import EmployeeForm from './EmployeeForm';
import EmployeeForm, {
  type FormFieldValue,
  type EmployeeFormState,
} from './EmployeeForm';
//import { type ValidationResult, validateEmployee as validateEmployeeData } from './EmployeeCreate';

import dayjs from 'dayjs';
import { useAuth } from "../../context/AuthContext";

const INITIAL_PAGE_SIZE = 10;

export default function EmployeeList() {
  const { token } = useAuth();

  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
    pageSize: searchParams.get('pageSize')
      ? Number(searchParams.get('pageSize'))
      : INITIAL_PAGE_SIZE,
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>(
    searchParams.get('filter')
      ? JSON.parse(searchParams.get('filter') ?? '')
      : { items: [] },
  );
  const [sortModel, setSortModel] = useState<GridSortModel>(
    searchParams.get('sort') ? JSON.parse(searchParams.get('sort') ?? '') : [],
  );

  const [rowsState, setRowsState] = useState<{
    rows: Employee[];
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

      searchParams.set('page', String(model.page));
      searchParams.set('pageSize', String(model.pageSize));

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
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
        searchParams.set('filter', JSON.stringify(model));
      } else {
        searchParams.delete('filter');
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      setSortModel(model);

      if (model.length > 0) {
        searchParams.set('sort', JSON.stringify(model));
      } else {
        searchParams.delete('sort');
      }

      const newSearchParamsString = searchParams.toString();

      navigate(
        `${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`,
      );
    },
    [navigate, pathname, searchParams],
  );

  ////my custom code
  const INITIAL_FORM_VALUES: Partial<EmployeeFormState['values']> = {
    // role: 'Market',
    // isFullTime: true,
        employeeId: 0,
        employeeCode: "",
        fullName: "",
        email: "",
        department: "",
        designation: "",
        dateOfJoining: "",
        employmentType: "Permanent",
        status: "Active",
  };
    const [showForm, setShowForm] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [editData, setEditData] = useState<Employee | undefined>(undefined);
    // const [query] = useState({
    //     mode: 2,
    //     pageNumber: 1,
    //     pageSize: 10,
    //     search: "",
    //     sortBy: "employeeId",
    //     sortOrder: "DESC" as "ASC" | "DESC",
    // });

    const query = useMemo(() => {
      return {
        employeeId: editData?.employeeId || 0,
        mode: 2,
        pageNumber: paginationModel.page + 1, // backend usually 1-based
        pageSize: paginationModel.pageSize,
        search:
          filterModel.quickFilterValues?.[0] || "",
        sortBy: sortModel[0]?.field || "leaveRequestId",
        sortOrder: (sortModel[0]?.sort?.toUpperCase() as "ASC" | "DESC") || "DESC",
      };
    }, [editData, paginationModel, sortModel, filterModel]);

    const [formState, setFormState] = React.useState<EmployeeFormState>(() => ({
      values: INITIAL_FORM_VALUES,
      errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;
    const handleSave = async (data: Employee) => {
      if (data.employeeId === 0) {
        await createEmployee(data);
      } else {
        await updateEmployee(data);
      }
      setShowForm(false);
      //loadEmployees();
      loadData();
    };
      const setFormValues = React.useCallback(
        (newFormValues: Partial<EmployeeFormState['values']>) => {
          setFormState((previousState) => ({
            ...previousState,
            values: newFormValues,
          }));
        },
        [],
      );
      const handleFormReset = React.useCallback(() => {
        setFormValues(INITIAL_FORM_VALUES);
      }, [setFormValues]);

      type ValidationResult = { issues: { message: string; path: (keyof Employee)[] }[] };
        
      const validateEmployee = (employee: Partial<Employee>): ValidationResult => {
        let issues: ValidationResult['issues'] = [];
      
        if (!employee.fullName) {
          issues = [...issues, { message: 'Name is required', path: ['fullName'] }];
        }
        
          if (!employee.email) {
          issues = [...issues, { message: 'Email is required', path: ['email'] }];
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(employee.email)) {
          issues = [...issues, { message: 'Enter a valid email', path: ['email'] }];
        }
        // if (!employee.age) {
        //   issues = [...issues, { message: 'Age is required', path: ['age'] }];
        // } else if (employee.age < 18) {
        //   issues = [...issues, { message: 'Age must be at least 18', path: ['age'] }];
        // }
      
        // if (!employee.dateOfJoining) {
        //   issues = [...issues, { message: 'Join date is required', path: ['dateOfJoining'] }];
        // }

        if (!employee.dateOfJoining) {
          issues = [
            ...issues,
            { message: 'Join date is required', path: ['dateOfJoining'] }
          ];
        } else {
          const joiningDate = new Date(employee.dateOfJoining);
          const today = new Date();

          // Remove time part for accurate comparison
          today.setHours(0, 0, 0, 0);
          joiningDate.setHours(0, 0, 0, 0);

          if (joiningDate > today) {
            issues = [
              ...issues,
              { message: 'Join date cannot be a future date', path: ['dateOfJoining'] }
            ];
          }
        }
      
        // if (!employee.role) {
        //   issues = [...issues, { message: 'Role is required', path: ['role'] }];
        // } else if (!['Market', 'Finance', 'Development'].includes(employee.role)) {
        //   issues = [
        //     ...issues,
        //     { message: 'Role must be "Market", "Finance" or "Development"', path: ['role'] },
        //   ];
        // }
    
        // if (!formValues.department) {
        //   issues= [...issues, { message: 'Department is required', path: ['department'] }];
        // }
        // if (!formValues.designation) {
        //   issues = [...issues, { message: 'Designation is required', path: ['designation'] }];
        // }

        if (!employee.department) {
          issues = [...issues, { message: 'Department is required', path: ['department'] }];
        }
        if (!employee.designation) {
          issues = [...issues, { message: 'Designation is required', path: ['designation'] }];
        }
      
        return { issues };
      }

      const setFormErrors = React.useCallback(
        (newFormErrors: Partial<EmployeeFormState['errors']>) => {
          setFormState((previousState) => ({
            ...previousState,
            errors: newFormErrors,
          }));
        },
        [],
      );

      const handleFormFieldChange = React.useCallback(
        (name: keyof EmployeeFormState['values'], value: FormFieldValue) => {
          const validateField = async (values: Partial<EmployeeFormState['values']>) => {
            const { issues } = validateEmployee(values);
            setFormErrors({
              ...formErrors,
              [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
            });
          };
    
          const newFormValues = { ...formValues, [name]: value };
    
          setFormValues(newFormValues);
          validateField(newFormValues);
        },
        [formValues, formErrors, setFormErrors, setFormValues],
      );
        const handleFormSubmit = React.useCallback(async () => {
          const { issues } = validateEmployee(formValues);
          if (issues && issues.length > 0) {
            setFormErrors(
              Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
            );
            return;
          }
          setFormErrors({});
      
          try {
        //await onSubmit(formValues);
            
            const employeeDataToSubmit: Employee = {
              employeeId: editData?.employeeId || 0,
              employeeCode: formValues.employeeCode || "",
              fullName: formValues.fullName || "",
              email: formValues.email || "",
              department: formValues.department || "",
              designation: formValues.designation || "",
              //dateOfJoining: formValues.dateOfJoining || "",
              dateOfJoining: formValues.dateOfJoining? dayjs(new Date(formValues.dateOfJoining)).format("YYYY-MM-DD"): "",
              employmentType: formValues.employmentType as "Permanent" | "Contract",
              status: formValues.status as "Active" | "On Hold" | "Resigned" || "Active",
            };
            //console.log("Submitting employee data:", employeeDataToSubmit);
            const response = await createEmployee(employeeDataToSubmit);
            //console.log("Create employee response:", response);
            if (response.success) {
              notifications.show(response.message || 'Employee created successfully.', {
                severity: 'success',
                autoHideDuration: 3000,
              });
              setShowForm(false);
              loadData();
            } else {
              // notifications.show(
              //   `Failed to create employee. Reason: ${response.message || 'Unknown error'}`,
              //   {
              //     severity: 'error',
              //     autoHideDuration: 3000,
              //   },
              // );
              notifications.show(response.message || 'Employee creation failed.', {
                severity: 'error',
                autoHideDuration: 3000,
              });
              //throw new Error(response.message || 'Email already exists');
            }
            //navigate('/employees');
          } 
          // catch (error: any) {
          //   console.error('Error creating employee:', response?.message || (error as Error).message);
          //   notifications.show(
          //     `Failed to create employee. Reason: ${(error as Error).message}`,
          //     {
          //       severity: 'error',
          //       autoHideDuration: 3000,
          //     },
          //   );
          //   throw error;
          // }
          catch (error: any) {

            //console.log('Error response from API inside catch:', error?.response);
            console.error(
              'Error creating employee:',
              error?.response?.data?.message || error.message
            );

            notifications.show(
              error?.response?.data?.message || 'Failed to create employee.',
              {
                severity: 'error',
                autoHideDuration: 3000,
              }
            );
          }
        }, [formValues, navigate, notifications, setFormErrors]);
  ////

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
    //   const listData = await getEmployees({
    //     paginationModel,
    //     sortModel,
    //     filterModel,
    //   });
     if (!token) {
        console.warn('No token found, redirecting to loginData callback', token);
        navigate("/login", { replace: true });
        return; 
      }  // 🚨 CRITICAL LINE
      console.log("Token found in loadData, fetching employee data...", token, "Query params:", query);
      const listData = await getEmployees(query);
      //console.log("Employees in EmployeeList:", listData, "EmployeesData:", listData?.data, "EmployeeItems:", listData?.data?.items);
      setEmployees(listData?.data || []);
      setRowsState({
        rows: listData.data || [],
        rowCount: listData.totalRecords,
      });
    } catch (listDataError) {
      setError(listDataError as Error);
    }

    setIsLoading(false);
  //}, [paginationModel, sortModel, filterModel]);
  }, [query, token, navigate]);

  useEffect(() => {
      if (!token) {
        console.warn('No token found, redirecting to login', token);
        navigate("/login", { replace: true });
        return; 
      }  // 🚨 CRITICAL LINE
      console.log("Token found, loading employee data...", token);
    loadData();
  }, [loadData, token]);

  const handleRefresh = useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = useCallback<GridEventListener<'rowClick'>>(
    ({ row }) => {
      navigate(`/employees/${row.employeeId}`);
    },
    [navigate],
  );

  const handleCreateClick = useCallback(() => {
    navigate('/employees/new');
  }, [navigate]);

  const handleRowEdit = useCallback(
    (employee: Employee) => () => {
      navigate(`/employees/${employee.employeeId}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = useCallback(
    (employee: Employee) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete ${employee.fullName}?`,
        {
          title: `Delete employee?`,
          severity: 'error',
          okText: 'Delete',
          cancelText: 'Cancel',
        },
      );

      if (confirmed) {
        setIsLoading(true);
        try {
          await deleteEmployee(Number(employee.employeeId));

          notifications.show('Employee deleted successfully.', {
            severity: 'success',
            autoHideDuration: 3000,
          });
          loadData();
        } catch (deleteError) {
          notifications.show(
            `Failed to delete employee. Reason: ${(deleteError as Error).message}`,
            {
              severity: 'error',
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

  const columns = useMemo<GridColDef[]>(
    () => [
      //{ field: 'employeeId', headerName: 'S.No' },
      // {
      //   field: 'employeeId',
      //   headerName: 'S.No',
      //   width: 80,
      //   sortable: false,
      //   filterable: false,
      //   //valueGetter: (params) => params.api.getRowIndex(params.id) + 1, //+ page * pageSize,
      //   // valueGetter: (params: GridValueGetterParams) =>
      //   //   params.api.getRowIndex(params.id) + 1, // works now
      //   // valueGetter: ((params) =>
      //   //   params.api.getRowIndex(params.employeeId) + 1) as GridValueGetter,
      // },

      { field: 'fullName', 
        headerName: 'Name', 
        //width: 140,
        flex: 1,
        renderCell: (params) => (
          <Box>
            <Typography variant="body1">
              {params.row.fullName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {params.row.employeeCode}
            </Typography>
          </Box>
        ),
      },
      // { field: 'age', headerName: 'Age', type: 'number' },
      // {
      //   field: 'dateOfJoining',
      //   headerName: 'Join date',
      //   type: 'date',
      //   //valueGetter: (params: GridValueGetter) => params && new Date(params),
      //   valueGetter: (value) => value && new Date(value),
      //   //width: 140,
      //   flex: 1,
      // },
      {
        field: 'dateOfJoining',
        headerName: 'Join Date',
        type: 'date',
        // valueGetter: (params) =>
        //   params.value ? new Date(params.value) : null,
        // valueFormatter: (params) => {
        //   if (!params.value) return '';
        //   const date = new Date(params.value);
        //   return `${(date.getMonth() + 1)
        //     .toString()
        //     .padStart(2, '0')}/${date
        //     .getDate()
        //     .toString()
        //     .padStart(2, '0')}/${date.getFullYear()}`;
        // },
        // Convert string to Date for sorting
        valueGetter: (value) => {
          return value ? new Date(value as string) : null;
        },

        // Format as MM/DD/YYYY
        valueFormatter: (value) => {
          if (!value) return '';
          return (value as Date).toLocaleDateString('en-US');
        },
        flex: 1,
      },
      {
        field: 'department',
        headerName: 'Department',
        type: 'singleSelect',
        valueOptions: ['Market', 'Finance', 'Development'],
        //width: 160,
        flex: 1,
      },
       { field: 'designation', headerName: 'Designation', type: 'singleSelect',  //width: 160,
        flex: 1 },
      { field: 'status', headerName: 'Status', type: 'singleSelect', valueOptions: ['Active', 'On Hold', 'Resigned'], flex: 1 },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        flex: 1,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Edit"
            //onClick={handleRowEdit(row)}
            onClick={() => {
              //console.log("Edit clicked for employee:", row);
              setShowForm(true);
              setEditData(row);
              setFormValues({
                // employeeId: row.employeeId,
                employeeCode: row.employeeCode,
                fullName: row.fullName,
                email: row.email,
                department: row.department,
                designation: row.designation,
                dateOfJoining: row.dateOfJoining,
                employmentType: row.employmentType,
                status: row.status,
              });
              
            }}
          />,
          // <GridActionsCellItem
          //   key="delete-item"
          //   icon={<DeleteIcon />}
          //   label="Delete"
          //   onClick={handleRowDelete(row)}
          // />,
        ],
      },
    ],
    [handleRowEdit, handleRowDelete],
  );

  const pageTitle = 'Employees';

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: pageTitle }]}
      actions={
        showForm ? null : (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Button
            variant="contained"
            //onClick={handleCreateClick}
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
    {showForm ? (
      <EmployeeForm

         formState={formState}
         onFieldChange={handleFormFieldChange}
         onSubmit={handleFormSubmit} 
        // onSubmit={handleSave}
         onReset={handleFormReset}
         submitButtonLabel="Save"
         backButtonPath={`/employees/${employees.find(emp => emp.employeeId === editData?.employeeId)?.employeeId || ''}`}

        initialData={editData}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditData(undefined);  
          setFormErrors({}); 
        }}
      />
      ) : (
       <>
      <Box sx={{ flex: 1, width: '100%' }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : (
          <DataGrid
            rows={rowsState.rows}
            //rowCount={rowsState.rowCount}
            columns={columns}
            getRowId={(row) => row.employeeId}
            pagination
            sortingMode="server"
            filterMode="server"
            paginationMode="server"
            paginationModel={paginationModel}
            rowCount={rowsState.rowCount} 
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            disableRowSelectionOnClick
            onRowClick={handleRowClick}
            loading={isLoading}
            initialState={initialState}
            showToolbar
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent',
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: 'none',
                },
              [`& .${gridClasses.row}:hover`]: {
                cursor: 'pointer',
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'circular-progress',
                noRowsVariant: 'circular-progress',
              },
              baseIconButton: {
                size: 'small',
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
