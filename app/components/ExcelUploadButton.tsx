'use client';

import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';

export default function ExcelUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;

      const wb = XLSX.read(data, { type: 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      const jsonData = XLSX.utils.sheet_to_json(ws);

      console.log(formatData(jsonData));
    };

    reader.readAsArrayBuffer(file);
  };

  const formatData = (jsonData : any[]) => {
    const header = jsonData.slice(0, 1)[0];
    jsonData = jsonData.slice(1);

    let result = [];
    for(let i = 0; i < jsonData.length; i += 2){
      if(!jsonData[i] || !jsonData[i+1]){
          continue;
      }

      const firstData = {...jsonData[i]};
      const secondData = Object.fromEntries(
        Object.entries(jsonData[i+1]).map(([key, value])=>{
          let newKey = key;
          switch(key){
            case "종목명":
              newKey = "종목코드";
              break;
            case "수량":
              newKey = "단가";
              break;
            case "거래금액":
              newKey = "정산금액";
              break;
            case "잔고":
              newKey = "잔고금액";
              break;
            case "이율":
              newKey = "이자";
              break;
            case "수수료":
              newKey = "세금";
              break;
            case "연체료":
              newKey = "변제금";
              break;
            case "거래일자":
              value = `${firstData[key]} ${value}`;
              break;
          }

          return [newKey, value]
        })
      );

      result.push({
        ...firstData,
        ...secondData
      });
    }

    return {
      header,
      data : result
    };
  }

  return (
    <>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={handleButtonClick}
        className="bg-emerald-600 hover:bg-emerald-700 shadow-none px-6 py-2 rounded-xl font-bold normal-case"
      >
        엑셀 데이터 불러오기
      </Button>
    </>
  );
}