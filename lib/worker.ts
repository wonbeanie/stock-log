import * as XLSX from 'xlsx';

self.onmessage = (e) => {
  const fileBuffer = e.data;
  const wb = XLSX.read(fileBuffer, {type:'array'});
  const ws = wb.Sheets[wb.SheetNames[0]];
  const excelData = XLSX.utils.sheet_to_json(ws).slice(1);

  self.postMessage(excelData);
}