// import * as XLSX from "xlsx"
// import { saveAs } from "file-saver"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"

// export function exportExcel(data:any[],fileName:string){

//  const worksheet = XLSX.utils.json_to_sheet(data)

//  const workbook = XLSX.utils.book_new()

//  XLSX.utils.book_append_sheet(
//   workbook,
//   worksheet,
//   "Report"
//  )

//  const excelBuffer = XLSX.write(workbook,{
//   bookType:"xlsx",
//   type:"array"
//  })

//  const blob = new Blob(
//   [excelBuffer],
//   {type:"application/octet-stream"}
//  )

//  saveAs(blob,`${fileName}.xlsx`)

// }



// export function exportCSV(data:any[],fileName:string){

//  const worksheet = XLSX.utils.json_to_sheet(data)

//  const csv = XLSX.utils.sheet_to_csv(worksheet)

//  const blob = new Blob(
//   [csv],
//   {type:"text/csv;charset=utf-8;"}
//  )

//  saveAs(blob,`${fileName}.csv`)

// }



// export function exportPDF(data:any[],fileName:string){

//  const doc = new jsPDF()

//  const columns = Object.keys(data[0] || {})

//  const rows = data.map(row =>
//   columns.map(col => row[col])
//  )

//  autoTable(doc,{
//   head:[columns],
//   body:rows
//  })

//  doc.save(`${fileName}.pdf`)

// }


///////////

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"



export function exportExcel(data:any[],fileName:string){

    console.log("row inside export Excel", data);

 if(!data.length) return

 const reportTitle = "Enterprise Report Builder"
 const generatedDate = new Date().toLocaleString()

 const columns = Object.keys(data[0])

 const header = [
  [reportTitle],
  [`Generated On: ${generatedDate}`],
  [],
  columns
 ]

 const rows = data.map(row =>
  columns.map(col => row[col])
 )

 const worksheet = XLSX.utils.aoa_to_sheet([
  ...header,
  ...rows
 ])

 const columnWidths = columns.map(() => ({wch:20}))
 worksheet["!cols"] = columnWidths

 const workbook = XLSX.utils.book_new()

 XLSX.utils.book_append_sheet(
  workbook,
  worksheet,
  "Report"
 )

 const excelBuffer = XLSX.write(workbook,{
  bookType:"xlsx",
  type:"array"
 })

 const blob = new Blob(
  [excelBuffer],
  {type:"application/octet-stream"}
 )

 saveAs(blob,`${fileName}.xlsx`)
}



export function exportCSV(data:any[],fileName:string){

 if(!data.length) return

 const columns = Object.keys(data[0])

 const rows = data.map(row =>
  columns.map(col => row[col]).join(",")
 )

 const header =
 `Enterprise Report Builder\nGenerated On: ${new Date().toLocaleString()}\n\n`

 const csv =
 header +
 columns.join(",") +
 "\n" +
 rows.join("\n")

 const blob = new Blob(
  [csv],
  {type:"text/csv;charset=utf-8;"}
 )

 saveAs(blob,`${fileName}.csv`)
}



export function exportPDF(data:any[],fileName:string){

 if(!data.length) return

 const doc = new jsPDF()

 const columns = Object.keys(data[0])

 const rows = data.map(row =>
  columns.map(col => row[col])
 )

 doc.setFontSize(16)
 doc.text("Enterprise Report Builder",14,15)

 doc.setFontSize(10)
 doc.text(
  `Generated On: ${new Date().toLocaleString()}`,
  14,
  22
 )

 autoTable(doc,{
  startY:28,
  head:[columns],
  body:rows,
  theme:"grid",
  styles:{
   fontSize:9
  },
  headStyles:{
   fillColor:[41,128,185]
  }
 })

 doc.save(`${fileName}.pdf`)
}