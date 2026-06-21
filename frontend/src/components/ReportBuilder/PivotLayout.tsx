import { Grid,Paper,Typography } from "@mui/material"
import DropZone from "./DropZone"

//export default function PivotLayout({layout,fields}:any){
export default function PivotLayout({
 layout,
 fields,
 removeItem,
 changeAggregate
}:any){
 return(

 <Grid container spacing={2}>

 <Grid size={6}>
 <Paper sx={{p:2}}>
 <Typography>Rows</Typography>
 <DropZone id="rows" items={layout.rows}  fields={fields} removeItem={removeItem}/>
 </Paper>
 </Grid>

 <Grid  size={6}>
 <Paper sx={{p:2}}>
 <Typography>Columns</Typography>
 <DropZone id="columns" items={layout.columns}  fields={fields} removeItem={removeItem} />
 </Paper>
 </Grid>

 <Grid size={6}>
 <Paper sx={{p:2}}>
 <Typography>Values</Typography>
 <DropZone id="values" items={layout.values}  fields={fields} 
  removeItem={removeItem} changeAggregate={changeAggregate}
  />
 </Paper>
 </Grid>

 <Grid  size={6}>
 <Paper sx={{p:2}}>
 <Typography>Filters</Typography>
 <DropZone id="filters" items={layout.filters}  fields={fields} removeItem={removeItem}/>
 </Paper>
 </Grid>

 </Grid>

 )

}