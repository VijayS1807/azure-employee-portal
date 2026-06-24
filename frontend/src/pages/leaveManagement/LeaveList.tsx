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
  getLeaveBalanceService as getLeaveBalance,
  getLeaveService as getLeaves,
  createLeaveService as createLeave,
  updateLeaveService as updateLeave,
  getLeaveByIdService as getLeave,
  updateLeaveStatusService as updateLeaveStatus
} from "../../services/leaveService"
import type { ApplyLeaveRequest, LeaveBalanceResponse, ApproveLeaveRequest } from "../../types/leave";
import { useReference } from "../../context/ReferenceContext";
import Typography from '@mui/material/Typography';
import ApplyLeaveForm, {
  type FormFieldValue,
  type ApplyLeaveFormState,
} from './LeaveForm';
//import { type ValidationResult, validateEmployee as validateEmployeeData } from './EmployeeCreate';
//import LeaveBalanceResponse from '../../types/leave';
import CancelIcon from '@mui/icons-material/Cancel';
import ApproveLeaveForm,
{
  type FormFieldValue as ApproveLeaveFormFieldValue,
  type ApproveLeaveFormState as ApproveLeaveFormState,
} from './PendingLeaveForm';
import dayjs from 'dayjs';



const INITIAL_PAGE_SIZE = 10;

export default function LeaveList() {
  const { referenceData } = useReference();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [openModal, setOpenModal] = React.useState(false);
  const handleClose = React.useCallback(() => {
      setEditModalData(undefined); 
      setOpenModal(false);
  }, []);

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
    rows: ApplyLeaveRequest[];
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


    ///balance grid
const balanceColumns: GridColDef[] = [
  { field: "leaveTypeName", headerName: "Leave Name", flex: 1 },
  { field: "totalLeaves", headerName: "Total Leaves", type: "number", flex: 1 },
  { field: "leavesTaken", headerName: "Leaves Taken", type: "number", flex: 1 },
  { field: "remainingLeaves", headerName: "Remaining Leaves", type: "number", flex: 1 },
];
const [leaveBalance, setLeaveBalance] = useState<any[]>([]);

   ////setmodal form code
    const INITIAL_MODAL_FORM_VALUES: Partial<ApproveLeaveFormState['values']> = {
          leaveRequestId  : 0,
          status: "Cancelled",
          approvedBy: "",    // default = 'admin', later from login
    };
      const [showModalForm, setShowModalForm] = useState(false);
      const [modalLeaves, setModalLeaves] = useState<ApproveLeaveRequest[]>([]);
      const [editModalData, setEditModalData] = useState<ApproveLeaveRequest | undefined>(undefined);
      // const [query] = useState({
      //     //employeeId: editData?.employeeId || 0,
      //     mode: 2,
      //     pageNumber: 1,
      //     pageSize: 10,
      //     search: "",
      //     sortBy: "leaveRequestId",
      //     sortOrder: "DESC" as "ASC" | "DESC",
      // });
      const [modalFormState, setModalFormState] = React.useState<ApproveLeaveFormState>(() => ({
        values: INITIAL_MODAL_FORM_VALUES,
        errors: {},
      }));
      const modalFormValues = modalFormState.values;
      const modalFormErrors = modalFormState.errors;
      const handleModalSave = async (data: ApproveLeaveRequest) => {
      //   if (data.employeeId === 0) {
      //     await createLeave(data);
      //   } else {
      //     await updateLeave(data);
      //   }
        const statusToUpdate = data.status;
        await updateLeaveStatus(data);
        setShowModalForm(false);
        //loadEmployees();
        loadData();
      };
        const setModalFormValues = React.useCallback(
          (newFormValues: Partial<ApproveLeaveFormState['values']>) => {
            setModalFormState((previousState) => ({
              ...previousState,
              values: newFormValues,
            }));
          },
          [],
        );
        const handleModalFormReset = React.useCallback(() => {
          setModalFormValues(INITIAL_MODAL_FORM_VALUES);
        }, [setModalFormValues]);
  
        type modalValidationResult = { issues: { message: string; path: (keyof ApproveLeaveFormState['values'])[] }[] };
          
        const modalValidateLeave = (leave: Partial<ApproveLeaveFormState['values']>): modalValidationResult => {
          let issues: modalValidationResult['issues'] = [];
  
  
          if (!leave.status) {
            issues = [...issues, { message: 'Status is required', path: ['status'] }];
          }
          else if (!referenceData.leaveStatuses.includes(leave.status)) {
              issues = [
              ...issues,
              { message: `Status must be one of: ${referenceData.leaveStatuses.join(', ')}`, path: ['status'] },
              ];
          }
          return { issues };
        }
  
        const setModalFormErrors = React.useCallback(
          (newFormErrors: Partial<ApproveLeaveFormState['errors']>) => {
            setModalFormState((previousState) => ({
              ...previousState,
              errors: newFormErrors,
            }));
          },
          [],
        );
  
        const handleModalFormFieldChange = React.useCallback(
          (name: keyof ApproveLeaveFormState['values'], value: FormFieldValue) => {
            const validateField = async (values: Partial<ApproveLeaveFormState['values']>) => {
              const { issues } = modalValidateLeave(values);
              setModalFormErrors({
                ...modalFormErrors,
                [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
              });
            };
      
            const newFormValues = { ...modalFormValues, [name]: value };
      
            setModalFormValues(newFormValues);
            validateField(newFormValues);
          },
          [modalFormValues, modalFormErrors, setModalFormErrors, setModalFormValues],
        );
          const handleModalFormSubmit = React.useCallback(async () => {
              //console.log("Form values on submit:", modalFormValues);
            const { issues } = modalValidateLeave(modalFormValues);
            if (issues && issues.length > 0) {
              setModalFormErrors(
                Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
              );
              return;
            }
            setModalFormErrors({});
        
            try {
          //await onSubmit(modalFormValues);
              
              const leaveDataToSubmit: ApproveLeaveRequest = {
                  //leaveRequestId  : editData?.leaveRequestId || 0,
                  leaveRequestId: editModalData?.leaveRequestId || 0,
                  status: modalFormValues.status as "Pending" | "Approved" | "Rejected" | "Cancelled",
                  approvedBy: modalFormValues.approvedBy,     // default = 'admin', later from login
              };
              //console.log("Submitting leave data:", leaveDataToSubmit);
              //await createLeave(leaveDataToSubmit);
              const response = await updateLeaveStatus(leaveDataToSubmit);

            if (!response.success) {
              console.error("Leave update status failed:", response);
              notifications.show(`Leave update status failed. Reason: ${response.message}`, {
                severity: 'error',
                autoHideDuration: 3000,
              });
              //throw new Error(response.message || 'Failed to update leave status');
            } else {
              console.error("Leave update status successful:", response);
              notifications.show('Leave status updated successfully.', {
                severity: 'success',
                autoHideDuration: 3000,
              });
              setShowForm(false);
              loadData();
            }

              // notifications.show('Leave status updated successfully.', {
              //   severity: 'success',
              //   autoHideDuration: 3000,
              // });
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
          }, [modalFormValues, navigate, notifications, setModalFormErrors]);

  //////////////// end modal form code

  ////my custom code
  const INITIAL_FORM_VALUES: Partial<ApplyLeaveFormState['values']> = {
        leaveRequestId  : 0,
        employeeId: 0,
        fromDate: '',
        toDate: '',
        leaveType: '',
        leaveTypeId: 1,
        dayType: "Full Day",
        totalDays: 0,
        //reason: '',
        status: "Pending" as "Pending" | "Approved" | "Rejected" | "Cancelled",
        approvedBy: "",    // default = 'admin', later from login
  };
    const [showForm, setShowForm] = useState(false);
    const [leaves, setLeaves] = useState<ApplyLeaveRequest[]>([]);
    const [editData, setEditData] = useState<ApplyLeaveRequest | undefined>(undefined);
    // const [query] = useState({
    //     employeeId: editData?.employeeId || 0,
    //     mode: 2,
    //     pageNumber: 1,
    //     pageSize: 10,
    //     search: "",
    //     sortBy: "leaveRequestId",
    //     sortOrder: "DESC" as "ASC" | "DESC",
    // });

    const query = useMemo(() => {
      return {
        pageNumber: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        search: filterModel.quickFilterValues?.[0] || "",
        sortBy: sortModel[0]?.field || "leaveRequestId",
        sortOrder: (sortModel[0]?.sort?.toUpperCase() as "ASC" | "DESC") || "DESC",
      };
    }, [paginationModel, sortModel, filterModel]);

    const [formState, setFormState] = React.useState<ApplyLeaveFormState>(() => ({
      values: INITIAL_FORM_VALUES,
      errors: {},
    }));
    const formValues = formState.values;
    const formErrors = formState.errors;
    const handleSave = async (data: ApplyLeaveRequest) => {
      if (!data.leaveRequestId) {
        await createLeave(data);
      } else {
        await updateLeave(data);
      }
      setShowForm(false);
      //loadEmployees();
      loadData();
    };
      const setFormValues = React.useCallback(
        (newFormValues: Partial<ApplyLeaveFormState['values']>) => {
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

      type ValidationResult = { issues: { message: string; path: (keyof ApplyLeaveFormState['values'])[] }[] };
        
      const validateLeave = (leave: Partial<ApplyLeaveFormState['values']>): ValidationResult => {
        let issues: ValidationResult['issues'] = [];


        if (!leave.fromDate) {
            issues = [...issues, { message: 'From date is required', path: ['fromDate'] }];
          // }  else {
          //   const from = new Date(leave.fromDate);
          //   const day = from.getDay(); // 0 = Sunday, 6 = Saturday

          //   if (day === 0 || day === 6) {
          //     issues = [
          //       ...issues,
          //       { message: 'From date cannot be Saturday or Sunday', path: ['fromDate'] }
          //     ];
          //   }
          // }
        } else {
          const from = new Date(leave.fromDate);

          if (isNaN(from.getTime())) {
            issues = [
              ...issues,
              { message: "Invalid date format", path: ["fromDate"] }
            ];
          } else {
            const day = from.getDay(); // 0 = Sunday, 6 = Saturday

            if (day === 0 || day === 6) {
              issues = [
                ...issues,
                { message: "From date cannot be Saturday or Sunday", path: ["fromDate"] }
              ];
            }
          }
        } 
        if(leave.fromDate) {
          const from = new Date(leave.fromDate);

          // if (isNaN(from.getTime())) {
          if(dayjs(from).isBefore(dayjs(), 'day')) {
            issues = [
              ...issues,
              //{ message: "Previous date is invalid", path: ["fromDate"] }
            ];
          }
        }

        if (!leave.toDate) {
          issues = [...issues, { message: 'To date is required', path: ['toDate'] }];
        } else {
          const to = new Date(leave.toDate);
          const day = to.getDay(); // 0 = Sunday, 6 = Saturday

          if (day === 0 || day === 6) {
            issues = [
              ...issues,
              { message: 'To date cannot be Saturday or Sunday', path: ['toDate'] }
            ];
          }
        }
        // } else {
        //   const to = new Date(leave.toDate);
        //   if (isNaN(to.getTime())) {
        //     issues = [
        //       ...issues,
        //       { message: "Invalid date format", path: ["toDate"] }
        //     ];
        //   } else {
        //     const day = to.getDay(); // 0 = Sunday, 6 = Saturday
        //     if (day === 0 || day === 6) {
        //       issues = [
        //         ...issues,
        //         { message: "To date cannot be Saturday or Sunday", path: ["toDate"] }
        //       ];
        //     }
        //   }
        // }

        if(leave.toDate) {
          const to = new Date(leave.toDate);

          // if (isNaN(from.getTime())) {
          if(dayjs(to).isBefore(dayjs(), 'day')) {
            issues = [
              ...issues,
              //{ message: "Previous date is invalid", path: ["toDate"] }
            ];
          }
        }
        //working code for from date and to date validation
        // if (leave.fromDate && leave.toDate) {
        //   const from = new Date(leave.fromDate);
        //   const to = new Date(leave.toDate);

        //   from.setHours(0, 0, 0, 0);
        //   to.setHours(0, 0, 0, 0);
        //   console.log("From date (normalized):", from, "To date (normalized):", to, "Day type:", leave.dayType);

        //   //if (from > to) {
        //   if (from.getTime() > to.getTime()) {
        //     console.log("Validation error: From date must be less than or equal to To date");
        //     issues = [
        //       ...issues,
        //       {
        //         message: 'From date must be less than or equal to To date',
        //         path: ['fromDate'], // or ['toDate'] depending where you want error shown
        //       },
        //     ];
        //   } else if(from.getTime() != to.getTime()) {
        //     console.log("Validation error: From date and To date must be the same for non-full day leave", leave.dayType); 
        //     //if (leave.dayType === "Half Day") {
        //     if (['Half Day'].includes(leave.dayType as string)) {
        //       issues = [
        //         ...issues,
        //         {
        //           message: 'From date and To date must be the same when day type is Half Day',
        //           path: ['dayType'],
        //         },
        //       ];
        //     }
        //   }

        // }
        /////


        // from date and to date validation with dayjs
        // if (leave.fromDate && leave.toDate) {
        //   const from = dayjs(leave.fromDate).format("YYYY-MM-DD");
        //   const to = dayjs(leave.toDate).format("YYYY-MM-DD");
        //   console.log("From date (normalized):", from, "To date (normalized):", to, "Day type:", leave.dayType);

        //   if (from > to) {
        //     issues = [
        //       ...issues,
        //       {  
        //         message: "From date must be less than or equal to To date",
        //         path: ["fromDate"], 
        //       }
        //     ];
        //   } 

        ///// working code for from date and to date validation with dayjs


          //else if (from !== to) {
          // if (from !== to && leave.dayType === "Half Day") {
          //   //if (leave.dayType === "Half Day") {
          //     console.log("Validation error: From date and To date must be the same for non-full day leave", leave.dayType);
          //     // issues.push({
          //     //   message: "From date and To date must be the same when day type is Half Day",
          //     //   path: ["dayType"],
          //     // });
          //     issues = [
          //       ...issues,
          //       {  
          //         message: "From date and To date must be the same when day type is Half Day",
          //         path: ["dayType"], 
          //       }
          //     ];
          //   //}
          // }
        //}

        if (!leave.leaveTypeId) {
          issues = [...issues, { message: 'Leave type is required', path: ['leaveType'] }];
        } 
        // else if (!['Market', 'Finance', 'Development'].includes(leave.leaveType)) {
        //     issues = [
        //     ...issues,
        //     { message: 'Leave type must be "Market", "Finance" or "Development"', path: ['leaveType'] },
        //     ];
        // }
        else if(leave.leaveType == "Half Day"){
          if(leave.fromDate && leave.toDate && dayjs(leave.fromDate).format("YYYY-MM-DD") !== dayjs(leave.toDate).format("YYYY-MM-DD")){
             console.log("Validation error: From date and To date must be the same for non-full day leave", leave.dayType);
            issues = [
              ...issues,
              { message: 'From date and To date must be the same when day type is Half Day', path: ['leaveType'] },
              ];
          }
        }


        if (!leave.dayType) {
          issues = [...issues, { message: 'Day type is required', path: ['dayType'] }];
        } else if (!referenceData.dayTypes.includes(leave.dayType)) {
            issues = [
            ...issues,
            { message: `Day type must be one of: ${referenceData.dayTypes.join(', ')}`, path: ['dayType'] },
            ];
        }
        // if (!leave.reason) {
        //   issues = [...issues, { message: 'Reason is required', path: ['reason'] }];
        // }

        if (leave.fromDate && leave.toDate) {
          const from = dayjs(leave.fromDate).format("YYYY-MM-DD");
          const to = dayjs(leave.toDate).format("YYYY-MM-DD");
          console.log("From date (normalized):", from, "To date (normalized):", to, "Day type:", leave.dayType);

          if (from > to) {
            issues = [
              ...issues,
              {  
                message: "From date must be less than or equal to To date",
                path: ["fromDate"], 
              }
            ];
          } 
          else if (from != to && leave.dayType == "Half Day") {
            console.log("Validation error: From date and To date must be the same for non-full day leave", leave.dayType);
            issues = [
              ...issues,
              {  
                message: "From date and To date must be the same when day type is Half Day",
                path: ["dayType"], 
              }
            ];
          }
        }
        return { issues };
      }

      const setFormErrors = React.useCallback(
        (newFormErrors: Partial<ApplyLeaveFormState['errors']>) => {
          setFormState((previousState) => ({
            ...previousState,
            errors: newFormErrors,
          }));
        },
        [],
      );

      const handleFormFieldChange = React.useCallback(
        (name: keyof ApplyLeaveFormState['values'], value: FormFieldValue) => {
          const validateField = async (values: Partial<ApplyLeaveFormState['values']>) => {
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
            
            const leaveDataToSubmit: ApplyLeaveRequest = {
                leaveRequestId  : editData?.leaveRequestId || 0,
                employeeId: editData?.employeeId || 0,
                // fromDate: formValues.fromDate || "",
                //toDate: formValues.toDate? formValues.toDate.format("YYYY-MM-DD"): "",
                fromDate: formValues.fromDate? dayjs(new Date(formValues.fromDate)).format("YYYY-MM-DD"): "",
                toDate: formValues.toDate? dayjs(new Date(formValues.toDate)).format("YYYY-MM-DD"): "",
                leaveType: formValues.leaveType || "",
                leaveTypeId: formValues.leaveTypeId || 0,
                dayType: formValues.dayType as "Full Day" | "Half Day",
                totalDays: formValues.totalDays || 0,
                //reason: formValues.reason || "",
                status: formValues.status as "Pending" | "Approved" | "Rejected" | "Cancelled" | "All",
                approvedBy: formValues.approvedBy,     // default = 'admin', later from login
            };
            console.log("Submitting leave data:", leaveDataToSubmit);
            const isEdit = !!editData?.leaveRequestId;
            const response = isEdit
              ? await updateLeave(leaveDataToSubmit)
              : await createLeave(leaveDataToSubmit);
            if (!response.success) {
              notifications.show(isEdit ? 'Leave update failed.' : 'Leave creation failed.', {
                severity: 'error',
                autoHideDuration: 3000,
              });
              throw new Error(response.message || (isEdit ? 'Failed to update leave' : 'Failed to create leave'));
            } else {
              notifications.show(isEdit ? 'Leave updated successfully.' : 'Leave created successfully.', {
                severity: 'success',
                autoHideDuration: 3000,
              });
              setShowForm(false);
              loadData();
            }
            //navigate('/employees');
          } catch (error: any) {
           console.log('Error response from API inside catch:', error);
            console.error(
              'Error creating leave:',
              error?.response?.data?.message || error.message
            );

            notifications.show(
              error?.response?.data?.message || 'Failed to save leave.',
              {
                severity: 'error',
                autoHideDuration: 3000,
              }
            );
          }
          // catch (createError) {
          //   console.error("Error during leave creation:", createError);
          //   notifications.show(
          //     `Failed to create leave. Reason: ${(createError as Error).message}`,
          //     {
          //       severity: 'error',
          //       autoHideDuration: 3000,
          //     },
          //   );
          //   throw createError;
          // }
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
      const listData = await getLeaves(query);
      console.log("Query params used for fetching leaves:", query);
      console.log("Leaves in LeaveList:", listData);
      console.log("Leave items:", listData.data);
      setLeaves(listData?.data || []);
      setRowsState({
        rows: listData.data,
        rowCount: listData.totalRecords,
      });

      const balanceData = await getLeaveBalance();
      console.log("Leave balance data:", balanceData);
      setLeaveBalance(balanceData?.data || []);
    } catch (listDataError) {
      setError(listDataError as Error); 
    }

    setIsLoading(false);
  //}, [paginationModel, sortModel, filterModel]);
  }, [query]);

  useEffect(() => {
    console.log("Loading data with query in useEffect:", query);
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    console.log("Refreshing data...");
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
    (leave: ApplyLeaveRequest) => () => {
      navigate(`/leaves/${leave.leaveRequestId}/edit`);
    },
    [navigate],
  );

  const handleRowDelete = useCallback(
    (leave: ApplyLeaveRequest) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to delete the leave request from ${leave.fromDate} to ${leave.toDate}?`,
        {
          title: `Delete leave request?`,
          severity: 'error',
          okText: 'Delete',
          cancelText: 'Cancel',
        },
      );

      if (confirmed) {
        setIsLoading(true);
        try {
          //await deleteLeave(Number(leave.leaveRequestId));

          notifications.show('Leave request deleted successfully.', {
            severity: 'success',
            autoHideDuration: 3000,
          });
          loadData();
        } catch (deleteError) {
          notifications.show(
            `Failed to delete leave request. Reason: ${(deleteError as Error).message}`,
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US');
};

  const handleRowCancel = useCallback(
    (leave: ApplyLeaveRequest) => async () => {
      const confirmed = await dialogs.confirm(
        `Do you wish to cancel the leave request from ${formatDate(leave.fromDate)} to ${formatDate(leave.toDate)}?`,
        {
          title: `Cancel leave request?`,
          severity: 'error',
          okText: 'Yes, Cancel it',
          cancelText: 'No, Keep it',
        },
      );

      if (confirmed) {
        setIsLoading(true);
        try {
          //await deleteLeave(Number(leave.leaveRequestId));

              const leaveDataToSubmit: ApproveLeaveRequest = {
                  //leaveRequestId  : editData?.leaveRequestId || 0,
                  leaveRequestId: leave?.leaveRequestId || 0,
                  status: "Cancelled",
                  approvedBy: 'Employee',     // default = 'admin', later from login
              };
              //console.log("Submitting leave data:", leaveDataToSubmit);
              //await createLeave(leaveDataToSubmit);
              const response = await updateLeaveStatus(leaveDataToSubmit);
              console.log("Response from updateLeaveStatus service in LeaveList (cancel):", response);
              if (!response.success) {
                console.error("Leave cancellation failed:", response);
                notifications.show('Leave cancellation failed.', {
                  severity: 'error',
                  autoHideDuration: 3000,
                });
                throw new Error(response.message || 'Failed to cancel leave');
              } else {
                console.log("Leave cancellation successful:", response);
                notifications.show('Leave request cancelled successfully.', {
                  severity: 'success',
                  autoHideDuration: 3000,
                });
                loadData();
            } 
          }catch (cancelError) {
            console.error("Error during leave cancellation:", cancelError);
          notifications.show(
            `Failed to cancel leave request. Reason: ${(cancelError as Error).message}`,
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
      // valueOptions come from referenceData so frontend & backend stay in sync
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
        //width: 200,
        flex: 1,
      },
      {
        field: 'dayType',
        headerName: 'Day Type',
        type: 'singleSelect',
        valueOptions: referenceData.dayTypes,
        //width: 160,
        flex: 1,
      },
      {
        field: 'leaveTypeName',
        headerName: 'Leave Type',
        //width: 160,
        flex: 1,
      },
      {
        field: 'status',
        headerName: 'Status',
        type: 'singleSelect',
        valueOptions: referenceData.leaveStatuses,
        //width: 160,
        flex: 1,
      },
      {
        field: 'appliedDate',
        headerName: 'Applied Date',
        type: 'date',
        //valueGetter: (params: GridValueGetterParams) => params && new Date(params),
        //valueGetter: (value) => value && new Date(value),
        valueGetter: (value) => {
          return value ? new Date(value as string) : null;
        },

        // Format as MM/DD/YYYY
        valueFormatter: (value) => {
          if (!value) return '';
          return (value as Date).toLocaleDateString('en-US');
        },
        //width: 140,
        flex: 1,
      },
      {
        field: 'approvedBy',
        headerName: 'Approved By',
        //width: 190,
        flex: 1,
      },
      {
        field: 'appliedDays',
        headerName: 'Applied Days',
        //width: 160,
        flex: 1,
      },
      {
        field: 'leavesTakenCl',
        headerName: 'CL Taken',
        flex: 1,
      },
      {
        field: 'leavesTakenSl',
        headerName: 'SL Taken',
        flex: 1,
      },
      {
        field: 'leavesTakenLop',
        headerName: 'LOP Taken',
        flex: 1,
      },
      // {
      //   field: 'leavesTaken',
      //   headerName: 'Total Leaves Taken',
      //   flex: 1,
      // },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        flex: 1,
        align: 'right',
         width: 140,
         //working code for action buttons in grid
        // getActions: ({ row }) =>
        //    [
        //   <GridActionsCellItem
        //     key="cancel-item"
        //     icon={<CancelIcon />}
        //     label="Cancel Leave"
        //     //onClick={handleCancelLeave(row)}
        //     // onClick={() => {
        //     //   //console.log("Cancel clicked for leave:", row);
        //     //   // setOpenModal(true);
        //     //   // setShowForm(true);
        //     //   // setEditData(row);
        //     //   // setFormValues({
        //     //   //   leaveRequestId  : row.leaveRequestId,
        //     //   //   status: row.status,
        //     //   // });  
              
        //     //   //work in modal
        //     //       // 1️⃣ First set data
        //     //   const modalData: ApproveLeaveRequest = {
        //     //     leaveRequestId: row.leaveRequestId,
        //     //     status: row.status,
        //     //   };

        //     //   setEditModalData(modalData);
        //     //   setModalFormValues(modalData);

        //     //   // 2️⃣ Then open modal
        //     //   setShowModalForm(true);
        //     //   setOpenModal(true);        
        //     //   ///    

        //     // }}
        //     onClick={handleRowCancel(row)}
        //   />,
        //   <GridActionsCellItem
        //     key="edit-item"
        //     icon={<EditIcon />}
        //     label="Edit Leave Request"
        //     //onClick={handleRowEdit(row)}
        //     onClick={() => {
        //       //console.log("Edit clicked for leave:", row);
        //       setShowForm(true);
        //       setEditData(row);
        //       setFormValues({
        //         leaveRequestId  : row.leaveRequestId,
        //         employeeId: row.employeeId,
        //         fromDate: row.fromDate,
        //         toDate: row.toDate,
        //         leaveType: row.leaveType,
        //         leaveTypeId: row.leaveTypeId,
        //         dayType: row.dayType,
        //         totalDays: row.totalDays,
        //         //reason: row.reason,
        //         approvedBy: row.approvedBy,
        //       });
              
        //     }}
        //   />,
        //   // <GridActionsCellItem
        //   //   key="delete-item"
        //   //   icon={<DeleteIcon />}
        //   //   label="Delete"
        //   //   onClick={handleRowDelete(row)}
        //   // />,
        // ],
        ///////

        getActions: ({ row }) => {
  if (row.status === "Pending") {
    //console.log("Generating actions for row with status Pending:", row);
    return [
      <GridActionsCellItem
        key="cancel-item"
        icon={<CancelIcon />}
        label="Cancel Leave"
        //onClick={handleCancelLeave(row)}
        // onClick={() => {
        //   //console.log("Cancel clicked for leave:", row);
        //   // setOpenModal(true);
        //   // setShowForm(true);
        //   // setEditData(row);
        //   // setFormValues({
        //   //   leaveRequestId  : row.leaveRequestId,
        //   //   status: row.status,
        //   // });  
          
        //   //work in modal
        //       // 1️⃣ First set data
        //   const modalData: ApproveLeaveRequest = {
        //     leaveRequestId: row.leaveRequestId,
        //     status: row.status,
        //   };

        //   setEditModalData(modalData);
        //   setModalFormValues(modalData);

        //   // 2️⃣ Then open modal
        //   setShowModalForm(true);
        //   setOpenModal(true);        
        //   ///    

        // }}
        onClick={handleRowCancel(row)}
      />,
      <GridActionsCellItem
        key="edit-item"
        icon={<EditIcon />}
        label="Edit Leave Request"
        //onClick={handleRowEdit(row)}
        onClick={() => {
          //console.log("Edit clicked for leave:", row);
          setShowForm(true);
          setEditData(row);
          setFormValues({
            leaveRequestId  : row.leaveRequestId,
            employeeId: row.employeeId,
            fromDate: row.fromDate,
            toDate: row.toDate,
            leaveType: row.leaveType,
            leaveTypeId: row.leaveTypeId,
            dayType: row.dayType,
            totalDays: row.totalDays,
            //reason: row.reason,
            approvedBy: row.approvedBy,
          });
          
        }}
      />,
      // <GridActionsCellItem
      //   key="delete-item"
      //   icon={<DeleteIcon />}
      //   label="Delete"
      //   onClick={handleRowDelete(row)}
      // />,
    ];
  }
  return []; // no actions if status is not "Pending"
}
        
      },
    ],
    [handleRowEdit, handleRowDelete, handleRowCancel, referenceData],
  );

  const pageTitle = 'Leave Requests';

 return (
  <PageContainer
    title={pageTitle}
    //breadcrumbs={[{ title: pageTitle }]}
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
            onClick={() => {
              setEditData(undefined);
              setShowForm(true);
              setFormValues(INITIAL_FORM_VALUES);
            }}
            startIcon={<AddIcon />}
          >
            Apply Leave
          </Button>
        </Stack>
      )
    }
  >
    <ApproveLeaveForm 
        open={openModal} 
        handleClose={handleClose} 

        formState={modalFormState}
        onFieldChange={handleModalFormFieldChange}
        onSubmit={handleModalFormSubmit} 
        // onSubmit={handleSave}
        onReset={handleModalFormReset}
        submitButtonLabel="Save"
        backButtonPath={`/leaves/${leaves.find(leave => leave.leaveRequestId === editModalData?.leaveRequestId)?.leaveRequestId || ''}`}

        initialData={editModalData}
        onSave={handleModalSave}
        onCancel={() => {
            setShowModalForm(false);
            setEditModalData(undefined);   
            //setError(null);
        }}
    />

    {showForm ? (
      <ApplyLeaveForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Save"
        backButtonPath={`/leaves/${
          leaves.find(
            (leave) => leave.leaveRequestId === editData?.leaveRequestId
          )?.leaveRequestId || ""
        }`}
        initialData={editData}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setFormErrors({});
          setError(null);
          setEditData(undefined);
        }}
      />
    ) : (
      <>
        {/* ================= Leave Balance Grid ================= */}
        <Box sx={{ width: "100%", mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Leave Balance
          </Typography>

          <DataGrid
            rows={leaveBalance}
            columns={balanceColumns}
            autoHeight
            loading={isLoading}
            getRowId={(row) => row.leaveTypeName}
            hideFooter
            //initialState={initialState}
            disableRowSelectionOnClick
          />
        </Box>

        {/* ================= Leave Requests Grid ================= */}
        <Box sx={{ flex: 1, width: "100%" }}>
          {error ? (
            <Box sx={{ flexGrow: 1 }}>
              <Alert severity="error">{error.message}</Alert>
            </Box>
          ) : (
           <> 
            <Typography variant="h6" sx={{ mb: 1 }}>
              Leave Requests List
            </Typography>
         

            <DataGrid
              rows={rowsState.rows}
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
              disableColumnFilter
            />
            </>
          )}
        </Box>
      </>
    )}
  </PageContainer>
);

}
