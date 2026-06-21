import { QueryModel } from "../../types/queryTypes";

// export function validateQuery(model: QueryModel) {
//   const errors: string[] = [];

//   // ✅ SELECT
//   if (
//     (!model.select || model.select.length === 0) &&
//     (!model.values || model.values.length === 0)
//   ) {
//     errors.push("Select at least one column or aggregation");
//   }

//   // ✅ SELECT alias duplicate
//   const selectAliases = (model.select || []).map((s: any) => s.alias);
//   if (new Set(selectAliases).size !== selectAliases.length) {
//     errors.push("Duplicate aliases in SELECT");
//   }

//   // ✅ AGGREGATION
//   const aggAliases = (model.values || []).map((v: any) => v.alias);
//   if (new Set(aggAliases).size !== aggAliases.length) {
//     errors.push("Duplicate aliases in Aggregation");
//   }

//   // ✅ WHERE
//   (model.where || []).forEach((w: any, i: number) => {
//     if (!w.columnId) errors.push(`WHERE row ${i + 1}: Column required`);
//     if (!w.operator) errors.push(`WHERE row ${i + 1}: Operator required`);
//     if (w.value === "" || w.value === null)
//       errors.push(`WHERE row ${i + 1}: Value required`);
//   });

//   // ✅ HAVING
//   if ((model.having || []).length && !(model.values || []).length) {
//     errors.push("HAVING cannot be used without aggregation");
//   }

//   (model.having || []).forEach((h: any, i: number) => {
//     if (!h.operator) errors.push(`HAVING row ${i + 1}: Operator required`);
//     if (h.value === "" || h.value === null)
//       errors.push(`HAVING row ${i + 1}: Value required`);
//   });

//   // ✅ ORDER BY
//   (model.orderBy || []).forEach((o: any, i: number) => {
//     if (!o.columnId) errors.push(`ORDER BY row ${i + 1}: Column required`);
//     if (!["ASC", "DESC"].includes(o.direction))
//       errors.push(`ORDER BY row ${i + 1}: Invalid direction`);
//   });

//   // ✅ PAGINATION
//   if (!model.pagination?.isPaginationEnabled) {
//     if (model.pagination?.pageNumber <= 0)
//       errors.push("Page must be greater than 0");

//     if (model.pagination?.pageSize <= 0)
//       errors.push("Page size must be greater than 0");
//   }

//   return errors;
// }

// export function validateQuery(model: any) {
//   const errors: any = {
//     select: [],
//     values: [],
//     where: [],
//     having: [],
//     orderBy: [],
//     global: [],
//   };

//   // ❌ SELECT
//   if (!model.select?.length && !model.values?.length) {
//     errors.global.push("At least one column or aggregation is required");
//   }

//   const selectIds = new Set();
//   (model.select || []).forEach((s: any, i: number) => {
//     if (!s.columnId) {
//       errors.select[i] = { columnId: "Column required" };
//     }

//     if (selectIds.has(s.columnId)) {
//       errors.select[i] = { columnId: "Duplicate column" };
//     }

//     selectIds.add(s.columnId);
//   });

//   // ❌ AGGREGATION
//   (model.values || []).forEach((v: any, i: number) => {
//     const rowErr: any = {};

//     if (!v.columnId) rowErr.columnId = "Column required";
//     if (!v.aggregate) rowErr.aggregate = "Aggregation required";

//     errors.values[i] = rowErr;
//   });

//   // ❌ WHERE
//   (model.where || []).forEach((w: any, i: number) => {
//     const rowErr: any = {};

//     if (!w.columnId) rowErr.columnId = "Column required";
//     if (!w.operator) rowErr.operator = "Operator required";
//     if (w.value === "" || w.value === null)
//       rowErr.value = "Value required";

//     errors.where[i] = rowErr;
//   });

//   // ❌ HAVING
//   (model.having || []).forEach((h: any, i: number) => {
//     const rowErr: any = {};

//     if (!h.columnId) rowErr.columnId = "Column required";
//     if (!h.aggregate) rowErr.aggregate = "Aggregate required";
//     if (!h.operator) rowErr.operator = "Operator required";
//     if (h.value === "" || h.value === null)
//       rowErr.value = "Value required";

//     errors.having[i] = rowErr;
//   });

//   // ❌ ORDER BY
//   (model.orderBy || []).forEach((o: any, i: number) => {
//     const rowErr: any = {};

//     if (!o.columnId) rowErr.columnId = "Column required";
//     if (!o.direction) rowErr.direction = "Direction required";

//     errors.orderBy[i] = rowErr;
//   });

//   // ❌ PAGINATION
//   if (model.pagination?.enabled) {
//     if (!model.pagination.page || model.pagination.page < 1) {
//       errors.global.push("Page must be >= 1");
//     }

//     if (!model.pagination.pageSize || model.pagination.pageSize < 1) {
//       errors.global.push("Page size must be >= 1");
//     }
//   }

//   const isValid =
//     !errors.global.length &&
//     !Object.values(errors)
//       .flat()
//       .some((e: any) => e && Object.keys(e).length);

//   return { isValid, errors };
// }

////////////


import type {RowError, ValidationErrors} from "../../types/query.builder.error.type";

export function validateQuery(model: QueryModel) {
  const errors: ValidationErrors = {
    select: [],
    values: [],
    where: [],
    having: [],
    orderBy: [],
    global: [],
  };

  // ✅ SELECT (required)
  if (!model.select?.length && !model.values?.length) {
    errors.global.push("At least one column or aggregation is required");
  }

  // ✅ SELECT validation + duplicate column + alias
  const selectIds = new Set();
  const selectAliases = new Set();

  (model.select || []).forEach((s: any, i: number) => {
    const rowErr: RowError = {};

    if (!s.columnId) rowErr.columnId = "Column required";

    if (selectIds.has(s.columnId)) {
      rowErr.columnId = "Duplicate column";
    }
    selectIds.add(s.columnId);

    if (s.alias) {
      if (selectAliases.has(s.alias)) {
        rowErr.alias = "Duplicate alias";
      }
      selectAliases.add(s.alias);
    }

    if (Object.keys(rowErr).length) errors.select[i] = rowErr;
  });

  // ✅ AGGREGATION validation + duplicate alias
  const aggAliases = new Set();

  (model.values || []).forEach((v: any, i: number) => {
    const rowErr: RowError = {};

    if (!v.columnId) rowErr.columnId = "Column required";
    if (!v.aggregate) rowErr.aggregate = "Aggregation required";

    if (v.alias) {
      if (aggAliases.has(v.alias)) {
        rowErr.alias = "Duplicate alias";
      }
      aggAliases.add(v.alias);
    }

    if (Object.keys(rowErr).length) errors.values[i] = rowErr;
  });

  // ✅ WHERE
  (model.where || []).forEach((w: any, i: number) => {
    const rowErr: RowError = {};

    if (!w.columnId) rowErr.columnId = "Column required";
    if (!w.operator) rowErr.operator = "Operator required";
    if (w.value === "" || w.value === null)
      rowErr.value = "Value required";

    if (Object.keys(rowErr).length) errors.where[i] = rowErr;
  });

  // ✅ HAVING rule (must have aggregation)
  if (model.having?.length && !model.values?.length) {
    errors.global.push("HAVING cannot be used without aggregation");
  }

  // ✅ HAVING validation
  (model.having || []).forEach((h: any, i: number) => {
    const rowErr: RowError = {};

    if (!h.columnId) rowErr.columnId = "Column required";
    if (!h.aggregate) rowErr.aggregate = "Aggregate required";
    if (!h.operator) rowErr.operator = "Operator required";
    if (h.value === "" || h.value === null)
      rowErr.value = "Value required";

    if (Object.keys(rowErr).length) errors.having[i] = rowErr;
  });

  // ✅ ORDER BY
  (model.orderBy || []).forEach((o: any, i: number) => {
    const rowErr: RowError = {};

    if (!o.columnId) rowErr.columnId = "Column required";

    if (!o.direction) {
      rowErr.direction = "Direction required";
    } else if (!["ASC", "DESC"].includes(o.direction)) {
      rowErr.direction = "Invalid direction";
    }

    if (Object.keys(rowErr).length) errors.orderBy[i] = rowErr;
  });

  // ✅ PAGINATION
  if (model.pagination?.isPaginationEnabled) {
    if (!model.pagination.pageNumber || model.pagination.pageNumber <= 0) {
      errors.global.push("Page must be greater than 0");
    }

    if (!model.pagination.pageSize || model.pagination.pageSize <= 0) {
      errors.global.push("Page size must be greater than 0");
    }
  }

    //✅ FINAL VALIDATION CHECK
  //   const hasRowErrors = Object.keys(errors).some((key) => {
  //     if (key === "global") return false;
  //     return errors[key].some((e: RowError) => e && Object.keys(e).length > 0);
  //   });

  // const hasRowErrors = Object.values(errors)
  //   .filter((v) => v !== errors.global)
  //   .flat()
  //   .some((e: RowError) => e && Object.keys(e).length > 0);

  const hasErrors = (arr: RowError[]) =>
  arr.some((e) => e && Object.keys(e).length > 0);

const hasRowErrors =
  hasErrors(errors.select) ||
  hasErrors(errors.values) ||
  hasErrors(errors.where) ||
  hasErrors(errors.having) ||
  hasErrors(errors.orderBy);


  const isValid = !errors.global.length && !hasRowErrors;

  return { isValid, errors };
}