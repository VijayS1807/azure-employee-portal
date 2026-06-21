import axios from "axios"

const API_BASE = "http://localhost:5000/api";

export async function getReportMetadata(){

 //const res = await axios.get(`${API_BASE}/report/modules`)

  const res = await axios.get(`${API_BASE}/report/metadata`)
  return res.data
}

export async function generateReport(layout:any){

 const res = await axios.post(
  `${API_BASE}/report/generate`,
  {layout}
 )
 console.log("Report generation response:", res.data)   
 const dataWithSno = res.data.map((item:any, index:any) => ({
  "S.No": index + 1,
  ...item
  }));
 return dataWithSno
}

export async function runQuery(queryModel:any){

 const res = await axios.post(`${API_BASE}/report/run`,queryModel)

 return res.data

}