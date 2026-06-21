import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
// import {
//   createOne as createEmployee,
//   validate as validateEmployee,
//   type Employee,
// } from '../../data/employees';
import {
  getEmployeesService as getEmployees,
  //getLeaveBalanceService as getLeaveBalance,
  createEmployeeService as createEmployee,
  updateEmployeeService as updateEmployee,
} from "../../services/employeeService";
import type { Employee } from "../../types/employee";
import EmployeeForm, {
  type FormFieldValue,
  type EmployeeFormState,
} from './EmployeeForm';
import PageContainer from '../../components/layout/PageContainer';

const INITIAL_FORM_VALUES: Partial<EmployeeFormState['values']> = {
  // role: 'Market',
  // isFullTime: true,
      // employeeId: 0,
      employeeCode: "",
      fullName: "",
      email: "",
      department: "",
      designation: "",
      dateOfJoining: "",
      employmentType: "Permanent",
      status: "Active",
};

export default function EmployeeCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<EmployeeFormState>(() => ({
    values: INITIAL_FORM_VALUES,
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

  ///my custome code

  type ValidationResult = { issues: { message: string; path: (keyof Employee)[] }[] };

  const validate = (employee: Partial<Employee>): ValidationResult => {
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
      await createEmployee(formValues as Omit<Employee, 'id'>);
      notifications.show('Employee created successfully.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/employees');
    } catch (createError) {
      notifications.show(
        `Failed to create employee. Reason: ${(createError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="New Employee"
      breadcrumbs={[{ title: 'Employees', path: '/employees' }, { title: 'New' }]}
    >
      <EmployeeForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Create"
      />
    </PageContainer>
  );
}
