import { Paper,Typography } from "@mui/material"

export default function SqlPreview({sql}:any){

 return(

 <Paper sx={{p:2,mt:2}}>

 <Typography variant="h6">Generated SQL</Typography>

 <pre>{sql}</pre>

 </Paper>

 )

}