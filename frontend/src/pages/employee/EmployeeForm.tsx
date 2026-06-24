import * as React from 'react';
import Avatar from '@mui/material/Avatar';
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
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useNavigate } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import type { Employee } from "../../types/employee";
import { useReference } from "../../context/ReferenceContext";
import { uploadEmployeePhoto } from "../../api/employee.api";
import useNotifications from "../../hooks/useNotifications/useNotifications";

// export interface EmployeeFormState {
//   values: Partial<Omit<Employee, 'employeeId'>>;
//   errors: Partial<Record<keyof EmployeeFormState['values'], string>>;
// }
// interface EmployeeFormProps {
//   initialData?: Employee;
//   onSave: (data: Employee) => void;
//   onCancel: () => void;
// }

export interface EmployeeFormState {
  values: Partial<Employee>;
  errors: Partial<Record<keyof EmployeeFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface EmployeeFormProps {
  formState: EmployeeFormState;
  onFieldChange: (
    name: keyof EmployeeFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<EmployeeFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<EmployeeFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
  initialData?: Employee;
  onSave: (data: Employee) => void;
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

export default function EmployeeForm(props: EmployeeFormProps) {
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
  const notifications = useNotifications();
  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !initialData?.employeeId) return;
      setIsUploadingPhoto(true);
      try {
        const result = await uploadEmployeePhoto(initialData.employeeId, file);
        const newUrl = result?.data?.profilePhotoUrl;
        if (newUrl) onFieldChange('profilePhotoUrl', newUrl);
        notifications.show("Photo uploaded.", { severity: "success", autoHideDuration: 3000 });
      } catch {
        notifications.show("Photo upload failed.", { severity: "error", autoHideDuration: 3000 });
      } finally {
        setIsUploadingPhoto(false);
        e.target.value = '';
      }
    },
    [initialData?.employeeId, onFieldChange, notifications],
  );

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
        event.target.name as keyof EmployeeFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof EmployeeFormState['values'],
        Number(event.target.value),
      );
    },
    [onFieldChange],
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(event.target.name as keyof EmployeeFormState['values'], checked);
    },
    [onFieldChange],
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof EmployeeFormState['values']) => (value: Dayjs | null) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString() ?? null);
      } else if (formValues[fieldName]) {
        onFieldChange(fieldName, null);
      }
    },
    [formValues, onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof EmployeeFormState['values'],
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
    //setFormErrors({});
    navigate(backButtonPath ?? '/employees');
  }, [navigate, backButtonPath]);

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
            <TextField
              value={formValues.fullName ?? ''}
              onChange={handleTextFieldChange}
              name="fullName"
              label="Name"
              error={!!formErrors.fullName}
              helperText={formErrors.fullName ?? ' '}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            {formValues.employeeId !== 0 && (
              <TextField
                label="Employee Code"
                name="employeeCode"
                value={formValues.employeeCode}
                fullWidth
                disabled
              />
            )}
          </Grid>

          {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.age ?? ''}
              onChange={handleNumberFieldChange}
              name="age"
              label="Age"
              error={!!formErrors.age}
              helperText={formErrors.age ?? ' '}
              fullWidth
            />
          </Grid> */}
          {/* <Grid>
            
            <TextField
              label="Full Name *"
              name="fullName"
              value={formValues.fullName ?? ''}
              onChange={handleTextFieldChange}
              fullWidth
              error={!!formErrors.fullName}
              helperText={formErrors.fullName ?? ' '}
            />
          </Grid> */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="email"
              value={formValues.email ?? ''}
              onChange={handleTextFieldChange}
              name="email"
              label="Email"
              error={!!formErrors.email}
              helperText={formErrors.email ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              label="Department *"
              name="department"
              value={formValues.department ?? ''}
              onChange={handleTextFieldChange}
              fullWidth
              error={!!formErrors.department}
              helperText={formErrors.department ?? ' '}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              label="Designation *"
              name="designation"
              value={formValues.designation ?? ''}
              onChange={handleTextFieldChange}
              fullWidth
              error={!!formErrors.designation}
              helperText={formErrors.designation ?? ' '}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.dateOfJoining ? dayjs(formValues.dateOfJoining) : null}
                onChange={handleDateFieldChange('dateOfJoining')}
                name="dateOfJoining"
                label="Join date"
                slotProps={{
                  textField: {
                    error: !!formErrors.dateOfJoining,
                    helperText: formErrors.dateOfJoining ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.employmentType} fullWidth>
              <InputLabel id="employment-type-label">Employment Type</InputLabel>
              <Select
                value={formValues.employmentType ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId="employment-type-label"
                name="employmentType"
                label="Employment Type"
                defaultValue="Permanent"
                fullWidth
              >
                {referenceData.employmentTypes.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.employmentType ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.status} fullWidth>
              <InputLabel id="status-label">Employee Status</InputLabel>
              <Select
                value={formValues.status ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                labelId="status-label"
                name="status"
                label="Employee Status"
                defaultValue="Active"
                fullWidth
              >
                {referenceData.employeeStatuses.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.status ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          {initialData?.employeeId ? (
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              {formValues.profilePhotoUrl
                ? <Avatar src={formValues.profilePhotoUrl} sx={{ width: 64, height: 64 }} />
                : <Avatar sx={{ width: 64, height: 64 }}>{(formValues.fullName ?? '?')[0]?.toUpperCase()}</Avatar>
              }
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">Profile Photo</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PhotoCameraIcon />}
                  loading={isUploadingPhoto}
                  onClick={() => photoInputRef.current?.click()}
                >
                  {formValues.profilePhotoUrl ? 'Change Photo' : 'Upload Photo'}
                </Button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </Stack>
            </Grid>
          ) : null}
          {/* <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl>
              <FormControlLabel
                name="isFullTime"
                control={
                  <Checkbox
                    size="large"
                    checked={formValues.isFullTime ?? false}
                    onChange={handleCheckboxFieldChange}
                  />
                }
                label="Full-time"
              />
              <FormHelperText error={!!formErrors.isFullTime}>
                {formErrors.isFullTime ?? ' '}
              </FormHelperText>
            </FormControl>
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
