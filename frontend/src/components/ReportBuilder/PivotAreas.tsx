import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid';
import DropArea from "./DropArea";

export default function PivotAreas({layout}:any){

 return(

 <Grid container spacing={2}>

 <Grid size={6}>
 <Paper sx={{p:1}}>
 <Typography>Rows</Typography>
 <DropArea id="rows" items={layout.rows}/>
 </Paper>
 </Grid>

 <Grid  size={6}>
 <Paper sx={{p:1}}>
 <Typography>Columns</Typography>
 <DropArea id="columns" items={layout.columns}/>
 </Paper>
 </Grid>

 <Grid size={6}>
 <Paper sx={{p:1}}>
 <Typography>Values</Typography>
 <DropArea id="values" items={layout.values}/>
 </Paper>
 </Grid>

 <Grid size ={6}>
 <Paper sx={{p:1}}>
 <Typography>Filters</Typography>
 <DropArea id="filters" items={layout.filters}/>
 </Paper>
 </Grid>

 </Grid>

 )
}