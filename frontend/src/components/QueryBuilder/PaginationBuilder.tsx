import { Paper, Typography, TextField, Grid, Switch } from "@mui/material";

//export default function PaginationBuilder({ model, setModel, errors }: any) {
export default function WhereBuilder({
  model,
  setModel,
  columns,
  tables,
  errors,
}: any) {
  function update(key: string, value: any) {
    //setModel({ ...model, [key]: value });
    setModel({ ...model, pagination: { ...model.pagination, [key]: value } });
  }

  return (
    <Paper sx={{ p: 2, display: "flex", gap: 10, alignItems: "center" }}>
      <Typography variant="h6">Pagination</Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginTop: 10,
        }}
      >
        <span>Get All</span>

        <Switch
          checked={!model.pagination.isPaginationEnabled || false}
          onChange={(e) => update("isPaginationEnabled", !e.target.checked)}
        />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <TextField
          size="small"
          label="Page"
          type="number"
          value={model.pagination.pageNumber || 1}
          disabled={!model.pagination.isPaginationEnabled}
          onChange={(e) => update("pageNumber", parseInt(e.target.value))}
          error={errors?.pagination?.pageNumber}
          helperText={errors?.pagination?.pageNumber}
        />
        <TextField
          size="small"
          label="Page Size"
          type="number"
          value={model.pagination.pageSize || 10}
          onChange={(e) => update("pageSize", parseInt(e.target.value))}
          error={errors?.pagination?.pageSize}
          helperText={errors?.pagination?.pageSize}
          disabled={!model.pagination.isPaginationEnabled}
        />
      </div>
    </Paper>
  );
}
