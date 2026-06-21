import type { ApproveLeaveRequest } from "../../types/leave";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
//import type { Employee } from '../../data/employees';
import type { ApplyLeaveRequest } from "../../types/leave";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { storage } from "../../utils/storage";

export interface ApproveLeaveFormState {
  values: Partial<ApproveLeaveRequest>;
  errors: Partial<Record<keyof ApproveLeaveFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface ApproveLeaveFormProps {
  formState: ApproveLeaveFormState;
  onFieldChange: (
    name: keyof ApproveLeaveFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<ApproveLeaveFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<ApproveLeaveFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
  initialData?: ApproveLeaveRequest;
  onSave: (data: ApproveLeaveRequest) => void;
  onCancel: () => void;
  handleClose: () => void;
  open: boolean;
}

 
// export type ValidationResult = { issues: { message: string; path: (keyof Employee)[] }[] };

// export  const validateEmployee = (employee: Partial<Employee>): ValidationResult => {
//     let issues: ValidationResult['issues'] = [];
  
//     if (!employee.fullName) {
//       issues = [...issues, { message: 'Name is required', path: ['fullName'] }];
//     }
    
//       if (!employee.email) {
//       issues = [...issues, { message: 'Email is required', path: ['email'] }];
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(employee.email)) {
//       issues = [...issues, { message: 'Enter a valid email', path: ['email'] }];
//     }
//     // if (!employee.age) {
//     //   issues = [...issues, { message: 'Age is required', path: ['age'] }];
//     // } else if (employee.age < 18) {
//     //   issues = [...issues, { message: 'Age must be at least 18', path: ['age'] }];
//     // }
  
//     if (!employee.dateOfJoining) {
//       issues = [...issues, { message: 'Join date is required', path: ['dateOfJoining'] }];
//     }
  
//     // if (!employee.role) {
//     //   issues = [...issues, { message: 'Role is required', path: ['role'] }];
//     // } else if (!['Market', 'Finance', 'Development'].includes(employee.role)) {
//     //   issues = [
//     //     ...issues,
//     //     { message: 'Role must be "Market", "Finance" or "Development"', path: ['role'] },
//     //   ];
//     // }

//     if (!employee.department) {
//       issues= [...issues, { message: 'Department is required', path: ['department'] }];
//     }
//     if (!employee.designation) {
//       issues = [...issues, { message: 'Designation is required', path: ['designation'] }];
//     }
  
//     return { issues };
// }

// export const handleFormFieldChange = React.useCallback(
//   (name: keyof EmployeeFormState['values'], value: FormFieldValue) => {
//     const validateField = async (values: Partial<EmployeeFormState['values']>) => {
//       const { issues } = validateEmployee(values);
//       setFormErrors({
//         ...formErrors,
//         [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
//       });
//     };

//     const newFormValues = { ...formValues, [name]: value };

//     setFormValues(newFormValues);
//     validateField(newFormValues);
//   },
//   [formValues, formErrors, setFormErrors, setFormValues],
// );

export default function ApproveLeaveForm(props: ApproveLeaveFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
    initialData,
    onSave,
    onCancel,
    handleClose,
    open,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  ///
// React.useEffect(() => {
//   const allowed =
//     role === "Admin"
//       ? ["Approved", "Rejected", "Cancelled"]
//       : ["Cancelled"];

//   if (!allowed.includes(formValues.status)) {
//     setFormValues(prev => ({
//       ...prev,
//       status: ""
//     }));
//   }
// }, [role]);
  ///

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof ApproveLeaveFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof ApproveLeaveFormState['values'],
        Number(event.target.value),
      );
    },
    [onFieldChange],
  );

//   const handleCheckboxFieldChange = React.useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
//       onFieldChange(event.target.name as keyof ApproveLeaveFormState['values'], checked);
//     },
//     [onFieldChange],
//   );

//   const handleDateFieldChange = React.useCallback(
//     (fieldName: keyof ApproveLeaveFormState['values']) => (value: Dayjs | null) => {
//       if (value?.isValid()) {
//         onFieldChange(fieldName, value.toISOString() ?? null);
//       } else if (formValues[fieldName]) {
//         onFieldChange(fieldName, null);
//       }
//     },
//     [formValues, onFieldChange],
//   );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof ApproveLeaveFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/leaves');
  }, [navigate, backButtonPath]);

  //const role = localStorage.getItem("role");
  
  const getRoleIntial = React.useCallback((): "Admin" | "Employee" | null => {
    const data = storage.getData();
    //console.log("Data from storage:", data);
    const roleName = data?.roleName;
    if (roleName === "Admin" || roleName === "Employee") {
      return roleName;
    }
    return null;
  }, []);

  const role = getRoleIntial();

  //console.log("User role from storage in PendingLeaveForm:", role); 

  // const getRole = (): "Admin" | "Employee" | null => {
  //   const data = storage.getData();
  //   //console.log("Data from storage:", data);
  //   const roleName = data?.roleName;
  //   if (roleName === "Admin" || roleName === "Employee") {
  //     return roleName;
  //   }
  //   return null;
  // };
  
  // const role = getRole();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        {/* <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
                      <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.fromDate ? dayjs(formValues.fromDate) : null}
                onChange={handleDateFieldChange('fromDate')}
                name="fromDate"
                label="From date"
                slotProps={{
                  textField: {
                    error: !!formErrors.fromDate,
                    helperText: formErrors.fromDate ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.toDate ? dayjs(formValues.toDate) : null}
                onChange={handleDateFieldChange('toDate')}
                name="toDate"
                label="To date"
                slotProps={{
                  textField: {
                    error: !!formErrors.toDate,
                    helperText: formErrors.toDate ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.leaveType} fullWidth>
              <InputLabel id="leave-type-label">Leave Type</InputLabel>
              <Select
                //value={formValues.leaveTypeId ?? 0}
                value={String(formValues.leaveTypeId ?? '1')}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId="leave-type-label"
                name="leaveTypeId"
                label="Leave Type"
                defaultValue="1"
                fullWidth
              >
                <MenuItem value="1">Casual Leave</MenuItem>
                <MenuItem value="2">Sick Leave</MenuItem>
                <MenuItem value="3">Loss Of Pay</MenuItem>
              </Select>
              <FormHelperText>{formErrors.leaveType ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.dayType} fullWidth>
              <InputLabel id="day-type-label">Day Type</InputLabel>
              <Select
                value={formValues.dayType ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId="day-type-label"
                name="dayType"
                label="Day Type"
                defaultValue="1"
                fullWidth
              >
                <MenuItem value="Full Day">Full Day</MenuItem>
                <MenuItem value="Half Day">Half Day</MenuItem>
              </Select>
              <FormHelperText>{formErrors.dayType ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid> */}

            <Dialog
              open={open}
              onClose={handleClose}
              slotProps={{
                paper: {
                  component: 'form',
                //   onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  onSubmit: (event : React.SyntheticEvent) => {
                //onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    handleClose();
                  },
                  sx: { backgroundImage: 'none' },
                },
              }}
            >
              <DialogTitle>Leave Action</DialogTitle>
              <DialogContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
              >
                <DialogContentText>
                  {/* Enter your account&apos;s email address, and we&apos;ll send you a link to
                  reset your password. */}
                  Take action on this leave request by approving or rejecting it.
                </DialogContentText>
                {/* <OutlinedInput
                  autoFocus
                  required
                  margin="dense"
                  id="status"
                  name="status"
                  label="Status"
                  placeholder="Status"
                  type="text"
                  fullWidth
                /> */}
                <InputLabel id="status-label">Status</InputLabel>
        
                <Select
                value={formValues.status ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId="status-label"
                name="status"
                label="Status"
                fullWidth
                >

                {/* <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem> */}

                {/* {role === "Admin" && 
                <>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </>
                }
                {role === "Employee" &&
                <>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </>
                } */}

                 {role === "Admin" &&
                    [
                      <MenuItem key="Approved" value="Approved">Approved</MenuItem>,
                      <MenuItem key="Rejected" value="Rejected">Rejected</MenuItem>,
                      <MenuItem key="Cancelled" value="Cancelled">Cancelled</MenuItem>,
                    ]
                  }

                  {role === "Employee" &&
                    [
                      <MenuItem key="Cancelled" value="Cancelled">Cancelled</MenuItem>
                    ]
                  }

                </Select>
        
              </DialogContent>
              <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    variant="contained" 
                    type="submit"
                    loading={isSubmitting}
                >
                  {submitButtonLabel}
                </Button>
              </DialogActions>
            </Dialog>

      </FormGroup>
      {/* <Stack direction="row" spacing={2} justifyContent="space-between">
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
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack> */}
    </Box>
  );
}
