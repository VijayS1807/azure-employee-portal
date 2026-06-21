import { List,ListItem,ListItemText } from "@mui/material";

export default function FieldsPanel(){

 const fields=[
  "EmployeeName",
  "Department",
  "LeaveType",
  "FromDate",
  "ToDate",
  "Status"
 ]

 return(

 <List>

 {fields.map(f=>(
  <ListItem key={f}>
   <ListItemText primary={f}/>
  </ListItem>
 ))}

 </List>

 )
}