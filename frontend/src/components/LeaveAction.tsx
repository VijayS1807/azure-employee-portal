import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent, SelectProps } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface LeaveActionProps {
  open: boolean;
  handleClose: () => void;
}

export default function LeaveAction({ open, handleClose }: LeaveActionProps) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          //   onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          onSubmit: (event: React.SyntheticEvent) => {
            //onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <DialogTitle>Leave Action</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
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
          // value={formValues.status ?? ''}
          // onChange={handleSelectFieldChange as SelectProps['onChange']}
          labelId="status-label"
          name="status"
          label="Status"
          fullWidth
        >
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
