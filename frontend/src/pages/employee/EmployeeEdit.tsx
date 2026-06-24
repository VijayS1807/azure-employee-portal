import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
// import {
//   getOne as getEmployee,
//   updateOne as updateEmployee,
//   validate as validateEmployee,
//   type Employee,
// } from '../../data/employees';
import {
  getEmployeesService as getEmployees,
  //getLeaveBalanceService as getLeaveBalance,
  createEmployeeService as createEmployee,
  updateEmployeeService as updateEmployee,
  getEmployeeByIdService as getEmployee,
} from "../../services/employeeService";
import type { Employee } from "../../types/employee";
import EmployeeForm, {
  type FormFieldValue,
  type EmployeeFormState,
} from './EmployeeForm';
import PageContainer from '../../components/layout/PageContainer';
import { useState } from 'react';


//const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

function EmployeeEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Partial<EmployeeFormState['values']>;
  onSubmit: (formValues: Partial<EmployeeFormState['values']>) => Promise<void>;
}) {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<EmployeeFormState>(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<EmployeeFormState['values']>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<EmployeeFormState['errors']>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

   ///my custome code
  
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
    
      if (!employee.dateOfJoining) {
        issues = [...issues, { message: 'Join date is required', path: ['dateOfJoining'] }];
      }
    
      // if (!employee.role) {
      //   issues = [...issues, { message: 'Role is required', path: ['role'] }];
      // } else if (!['Market', 'Finance', 'Development'].includes(employee.role)) {
      //   issues = [
      //     ...issues,
      //     { message: 'Role must be "Market", "Finance" or "Development"', path: ['role'] },
      //   ];
      // }
  
       if (!formValues.department) {
        issues= [...issues, { message: 'Department is required', path: ['department'] }];
      }
      if (!formValues.designation) {
        issues = [...issues, { message: 'Designation is required', path: ['designation'] }];
      }
    
      return { issues };
    }
  
    //////

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

  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

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
      await onSubmit(formValues);
      notifications.show('Employee edited successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/employees');
    } catch (editError) {
      notifications.show(
        `Failed to edit employee. Reason: ${(editError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <EmployeeForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/employees/${employeeId}`}
      initialData={initialValues as Employee}
      onCancel={() => navigate('/employees')}
    />
  );
}

export default function EmployeeEdit() {
  const { employeeId } = useParams();

  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getEmployee(Number(employeeId));

      setEmployee(showData);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [employeeId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = React.useCallback(
    async (formValues: EmployeeFormState['values']) => {
      const updatedData = await updateEmployee(formValues);
      // setEmployee(updatedData);
    },
    [employeeId],
  );

  const renderEdit = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return employee ? (
      <EmployeeEditForm initialValues={employee} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, employee, handleSubmit]);

  return (
    <PageContainer
      title={`Edit Employee ${employeeId}`}
      breadcrumbs={[
        { title: 'Employees', path: '/employees' },
        { title: `Employee ${employeeId}`, path: `/employees/${employeeId}` },
        { title: 'Edit' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
