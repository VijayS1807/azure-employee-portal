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
import PageContainer from '../../components/layout/PageContainer';
import {
// getLeaveBalanceService as getLeaveBalance,
// getLeaveService as getLeaves,
// createLeaveService as createLeave,
// updateLeaveService as updateLeave,
//getLeaveByIdService as getLeave,
getPendingLeavesService as getPendingLeaves,
updateLeaveStatusService as updateLeaveStatus
} from "../../services/leaveService"
//import type { ApplyLeaveRequest } from "../../types/leave";
import type { ApproveLeaveRequest } from "../../types/leave";
import Typography from '@mui/material/Typography';
import 
ApproveLeaveForm,
{
  type FormFieldValue,
  type ApproveLeaveFormState,
} from './PendingLeaveForm';



//import { type ValidationResult, validateEmployee as validateEmployeeData } from './EmployeeCreate';
import LeaveAction from '../../components/LeaveAction';

const INITIAL_PAGE_SIZE = 10;

export default function PendingLeaveList() {
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
    rows: ApproveLeaveRequest[];
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
  const INITIAL_FORM_VALUES: Partial<ApproveLeaveFormState['values']> = {
        leaveRequestId  : 0,
        status: "Approved",
        approvedBy: "",    // default = 'admin', later from login
  };
    const [showForm, setShowForm] = useState(false);
    const [leaves, setLeaves] = useState<ApproveLeaveRequest[]>([]);
    const [editData, setEditData] = useState<ApproveLeaveRequest | undefined>(undefined);
    // const [query] = useState({
    //     //employeeId: editData?.employeeId || 0,
    //     mode: 2,
    //     pageNumber: 1,
    //     pageSize: 10,
    //     search: "",
    //     sortBy: "leaveRequestId",
    //     sortOrder: "DESC" as "ASC" | "DESC",
    // });

    const query = useMemo(() => {
      return {
        //employeeId: editData?.approvedBy || 0,
        employeeId: 0,
        mode: 2,
        pageNumber: paginationModel.page + 1, // backend usually 1-based
        pageSize: paginationModel.pageSize,
        search:
          filterModel.quickFilterValues?.[0] || "",
        sortBy: sortModel[0]?.field || "leaveRequestId",
        sortOrder: (sortModel[0]?.sort?.toUpperCase() as "ASC" | "DESC") || "DESC",
        status: "All",
      };
    }, [editData, paginationModel, sortModel, filterModel]);

    const [formState, setFormState] = React.useState<ApproveLeaveFormState>(() => ({
      values: INITIAL_FORM_VALUES,
      errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;
    const handleSave = async (data: ApproveLeaveRequest) => {
    //   if (data.employeeId === 0) {
    //     await createLeave(data);
    //   } else {
    //     await updateLeave(data);
    //   }
      const statusToUpdate = data.status;
      await updateLeaveStatus(data);
      setShowForm(false);
      //loadEmployees();
      loadData();
    };
      const setFormValues = React.useCallback(
        (newFormValues: Partial<ApproveLeaveFormState['values']>) => {
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

      type ValidationResult = { issues: { message: string; path: (keyof ApproveLeaveFormState['values'])[] }[] };
        
      const validateLeave = (leave: Partial<ApproveLeaveFormState['values']>): ValidationResult => {
        let issues: ValidationResult['issues'] = [];


        if (!leave.status) {
          issues = [...issues, { message: 'Status is required', path: ['status'] }];
        }
        else if (!['Pending', 'Approved', 'Rejected', 'Cancelled'].includes(leave.status)) {
            issues = [
            ...issues,
            { message: 'Status must be "Pending", "Approved", "Rejected" or "Cancelled"', path: ['status'] },
            ];
        }
        return { issues };
      }

      const setFormErrors = React.useCallback(
        (newFormErrors: Partial<ApproveLeaveFormState['errors']>) => {
          setFormState((previousState) => ({
            ...previousState,
            errors: newFormErrors,
          }));
        },
        [],
      );

      const handleFormFieldChange = React.useCallback(
        (name: keyof ApproveLeaveFormState['values'], value: FormFieldValue) => {
          const validateField = async (values: Partial<ApproveLeaveFormState['values']>) => {
            const { issues } = validateLeave(values);
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
            //console.log("Form values on submit:", formValues);
          const { issues } = validateLeave(formValues);
          if (issues && issues.length > 0) {
            setFormErrors(
              Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
            );
            return;
          }
          setFormErrors({});
      
          try {
        //await onSubmit(formValues);
            
            const leaveDataToSubmit: ApproveLeaveRequest = {
                leaveRequestId  : editData?.leaveRequestId || 0,
                status: formValues.status as "Pending" | "Approved" | "Rejected" | "Cancelled",
                approvedBy: formValues.approvedBy,     // default = 'admin', later from login
            };
            console.log("Submitting leave data in handleFormSubmit:", leaveDataToSubmit);
            //await createLeave(leaveDataToSubmit);
            await updateLeaveStatus(leaveDataToSubmit);
            notifications.show('Leave status updated successfully.', {
              severity: 'success',
              autoHideDuration: 3000,
            });
            setShowForm(false);
            loadData();
            //navigate('/employees');
          } catch (createError) {
            notifications.show(
              `Failed to update leave status. Reason: ${(createError as Error).message}`,
              {
                severity: 'error',
                autoHideDuration: 3000,
              },
            );
            throw createError;
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
      const listData = await getPendingLeaves(query);
      //console.log("Query params used for fetching leaves:", query);
      //console.log("Leaves in LeaveList:", listData);
      //console.log("Leave items:", listData.data);
      setLeaves(listData?.data || []);
      setRowsState({
        rows: listData.data,
        rowCount: listData.totalRecords,
      });
    } catch (listDataError) {
      setError(listDataError as Error);
    }

    setIsLoading(false);
  //}, [paginationModel, sortModel, filterModel]);
  }, [query]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = useCallback<GridEventListener<'rowClick'>>(
    ({ row }) => {
      navigate(`/leaves/${row.leaveRequestId}`);
    },
    [navigate],
  );

  const handleCreateClick = useCallback(() => {
    navigate('/leaves/new');
  }, [navigate]);

  const handleRowEdit = useCallback(
    (leave: ApproveLeaveRequest) => () => {
      navigate(`/leaves/${leave.leaveRequestId}/edit`);
    },
    [navigate],
  );

//   const handleRowDelete = useCallback(
//     (leave: ApproveLeaveRequest) => async () => {
//       const confirmed = await dialogs.confirm(
//         `Do you wish to delete the leave request from ${leave.fromDate} to ${leave.toDate}?`,
//         {
//           title: `Delete leave request?`,
//           severity: 'error',
//           okText: 'Delete',
//           cancelText: 'Cancel',
//         },
//       );

//       if (confirmed) {
//         setIsLoading(true);
//         try {
//           //await deleteLeave(Number(leave.leaveRequestId));

//           notifications.show('Leave request deleted successfully.', {
//             severity: 'success',
//             autoHideDuration: 3000,
//           });
//           loadData();
//         } catch (deleteError) {
//           notifications.show(
//             `Failed to delete leave request. Reason: ${(deleteError as Error).message}`,
//             {
//               severity: 'error',
//               autoHideDuration: 3000,
//             },
//           );
//         }
//         setIsLoading(false);
//       }
//     },
//     [dialogs, notifications, loadData],
//   );

  const initialState = useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  );

  const [open, setOpen] = React.useState(false);
//   const handleUpdateActionModalClose = () => {
//     setOpen(false);
//   };
    const handleClose = React.useCallback(() => {
        setEditData(undefined); 
        setOpen(false);
    }, []);
    const handleUpdateActionModalOpen = React.useCallback(() => {
        setOpen(true);
    }, []);

  const columns = useMemo<GridColDef[]>(
    () => [
      //{ field: 'employeeId', headerName: 'S.No' },
    //   {
    //     field: 'leaveRequestId',
    //     headerName: 'S.No',
    //     width: 80,
    //     sortable: false,
    //     filterable: false,
    //     //valueGetter: (params) => params.api.getRowIndex(params.id) + 1, //+ page * pageSize,
    //     // valueGetter: (params: GridValueGetterParams) =>
    //     //   params.api.getRowIndex(params.id) + 1, // works now
    //     // valueGetter: ((params) =>
    //     //   params.api.getRowIndex(params.employeeId) + 1) as GridValueGetter,
    //   },
    //   {
    //     field: 'date',
    //     headerName: 'From Date',
    //     type: 'date',
    //     //valueGetter: (params: GridValueGetter) => params && new Date(params),
    //     valueGetter: (value) => value && new Date(value),
    //     width: 140,
    //   },
     {
        field: 'dateRange',
        headerName: 'Date Range',
        //type: 'date',
        //valueGetter: (params: GridValueGetter) => params && new Date(params),
        //valueGetter: (value) => value && new Date(value),
        //valueGetter: (params) => {
        // valueGetter: (params: any) => {
        //     const start = params.row.fromDate ? new Date(params.row.fromDate) : null;
        //     const end = params.row.toDate ? new Date(params.row.toDate) : null;
        //     if (!start || !end) return '';
        //     // Format as YYYY-MM-DD or use toLocaleDateString()
        //         return `${start.toLocaleDateString()} → ${end.toLocaleDateString()}`;
        // },
        valueGetter: (_value, row) => {
            const start = row.fromDate ? new Date(row.fromDate) : null;
            const end = row.toDate ? new Date(row.toDate) : null;

            if (!start || !end) return '';

            return `${start.toLocaleDateString('en-US')} → ${end.toLocaleDateString('en-US')}`;
        },
        //width: 140,
          flex: 1,
      },
      {
        field: 'dayType',
        headerName: 'Day Type',
        type: 'singleSelect',
        valueOptions: ['Full Day', 'Half Day'],
        //width: 160,  
          flex: 1,
      },
      {
        field: 'leaveTypeName',
        headerName: 'Leave Type',
        //width: 140,
          flex: 1,
      },
      {
        field: 'status',
        headerName: 'Status',
        type: 'singleSelect',
        valueOptions: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        //width: 160,
          flex: 1,
      },
      {
        field: 'appliedDate',
        headerName: 'Applied Date',
        type: 'date',
        //valueGetter: (params: GridValueGetter) => params && new Date(params),
        valueGetter: (value) => value && new Date(value),
        valueFormatter: (value) => {
          if (!value) return '';
          return (value as Date).toLocaleDateString('en-US');
        },
        //width: 140,
          flex: 1,
      },
      {
        field: 'appliedDays',
        headerName: 'Applied Days',
        //width: 160,
        flex: 1,
      },
      {
        field: 'appliedBy',
        headerName: 'Applied By',
          //width: 140,
          flex: 1,
      },
      {
        field: 'approvedBy',
        headerName: 'Approved By',
        //width: 140,
          flex: 1,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        flex: 1,
        align: 'right',
        // getActions: ({ row }) => [
                getActions: ({ row }) => {
        if (row.status === "Pending") {
          //console.log("Generating actions for row with status Pending:", row);
          return [
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Edit"
            //onClick={handleRowEdit(row)}
            onClick={() => {
              console.log("Edit clicked for leave:", row);
              setOpen(true);
              setShowForm(true);
              setEditData(row);
              setFormValues({
                leaveRequestId  : row.leaveRequestId,
                status: row.status,
              });
              
            }}
            //onClick={handleUpdateActionModalOpen}

          />,
          // <GridActionsCellItem
          //   key="delete-item"
          //   icon={<DeleteIcon />}
          //   label="Delete"
          //   onClick={handleRowDelete(row)}
          // />,
        //],
            ];
  }
  return []; // no actions if status is not "Pending"
}



      },
    ],
    //[handleRowEdit, handleRowDelete],
    [handleRowEdit],
  );

  const pageTitle = 'Pending Leave Requests';

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
          {/* <Button
            variant="contained"
            //onClick={handleCreateClick}
            onClick={() => {
              setEditData(undefined);
              setShowForm(true);
              setFormValues(INITIAL_FORM_VALUES);
            }}
            startIcon={<AddIcon />}
          >
            Apply Leave
          </Button> */}
        </Stack>
        )
      }
    >
    {/* {open && ( */}
        <ApproveLeaveForm 
            open={open} 
            handleClose={handleClose} 

            formState={formState}
            onFieldChange={handleFormFieldChange}
            onSubmit={handleFormSubmit} 
            // onSubmit={handleSave}
            onReset={handleFormReset}
            submitButtonLabel="Save"
            backButtonPath={`/leaves/${leaves.find(leave => leave.leaveRequestId === editData?.leaveRequestId)?.leaveRequestId || ''}`}

            initialData={editData}
            onSave={handleSave}
            onCancel={() => {
                setShowForm(false);
                setEditData(undefined);   
                setFormErrors({});
            }}
        />
    {/* )} */}
    {/* {showForm ? (
      <ApplyLeaveForm

         formState={formState}
         onFieldChange={handleFormFieldChange}
         onSubmit={handleFormSubmit} 
        // onSubmit={handleSave}
         onReset={handleFormReset}
         submitButtonLabel="Save"
         backButtonPath={`/leaves/${leaves.find(leave => leave.leaveRequestId === editData?.leaveRequestId)?.leaveRequestId || ''}`}

        initialData={editData}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditData(undefined);   
        }}
      />
      ) : ( */}
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
            getRowId={(row) => row.leaveRequestId}
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
            disableColumnFilter
          />
        )}
      </Box>
      </>
    {/* //   )} */}
    </PageContainer>
  );
}
