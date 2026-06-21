import { List,ListItem,ListItemText } from "@mui/material";

export default function TablesPanel(){

 const tables=[
  {id:1,name:"Employees"},
  {id:2,name:"LeaveRequests"},
  {id:3,name:"LeaveBalances"}
 ];

 return(

 <List>

 {tables.map(t=>(
  <ListItem key={t.id}>
   <ListItemText primary={t.name}/>
  </ListItem>
 ))}

 </List>

 )
}