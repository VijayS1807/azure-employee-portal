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
import { useReference } from "../../context/ReferenceContext";

// export interface EmployeeFormState {
//   values: Partial<Omit<Employee, 'employeeId'>>;
//   errors: Partial<Record<keyof EmployeeFormState['values'], string>>;
// }
// interface EmployeeFormProps {
//   initialData?: Employee;
//   onSave: (data: Employee) => void;
//   onCancel: () => void;
// }

export interface ApplyLeaveFormState {
  values: Partial<ApplyLeaveRequest>;
  errors: Partial<Record<keyof ApplyLeaveFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface ApplyLeaveFormProps {
  formState: ApplyLeaveFormState;
  onFieldChange: (
    name: keyof ApplyLeaveFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<ApplyLeaveFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<ApplyLeaveFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
  initialData?: ApplyLeaveRequest;
  onSave: (data: ApplyLeaveRequest) => void;
  onCancel: () => void;
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

export default function ApplyLeaveForm(props: ApplyLeaveFormProps) {
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
  } = props;

  const { referenceData } = useReference();
  const formValues = formState.values;
  const formErrors = formState.errors;

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
        event.target.name as keyof ApplyLeaveFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof ApplyLeaveFormState['values'],
        Number(event.target.value),
      );
    },
    [onFieldChange],
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(event.target.name as keyof ApplyLeaveFormState['values'], checked);
    },
    [onFieldChange],
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof ApplyLeaveFormState['values']) => (value: Dayjs | null) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString() ?? null);
      } else if (formValues[fieldName]) {
        onFieldChange(fieldName, null);
      }
      console.log(`Date field "${String(fieldName)}" changed to:`, value?.toISOString() ?? null);
    },
    [formValues, onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof ApplyLeaveFormState['values'],
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

    //   leaveRequestId  : number;
    // employeeId: number;
    // fromDate: string;
    // toDate: string;
    // leaveType?: string;
    // leaveTypeId: number;
    // dayType: "Full Day" | "Half Day";
    // totalDays: number;
    // reason: string;
    // status: "Pending" | "Approved" | "Rejected";
    // approvedBy?: string;    // default = 'admin', later from login

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
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.fromDate ? dayjs(formValues.fromDate) : null}
                onChange={handleDateFieldChange('fromDate')}
                name="fromDate"
                label="From date"
                //minDate={dayjs()} 
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
                //minDate={dayjs()} 
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
                {/* <MenuItem value="3">Loss Of Pay</MenuItem> */}
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
                {referenceData.dayTypes.map((dt) => (
                  <MenuItem key={dt} value={dt}>{dt}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.dayType ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.reason}
              onChange={handleTextFieldChange}
              name="reason"
              label="Reason"
              error={!!formErrors.reason}
              helperText={formErrors.reason ?? ' '}
              fullWidth
            />
          </Grid> */}
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
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
      </Stack>
    </Box>
  );
}
