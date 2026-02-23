'use client';

import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import { excelData } from '../modules/utils';
import { useSetAtom } from 'jotai';
import { updateStocksDataAtom } from '../store/atoms';

export default function ExcelUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setExcelData = useSetAtom(updateStocksDataAtom);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const excelsData = await readFilesAsBuffer(files);

    setExcelData(excelsData.flat());
  };


  const readFilesAsBuffer = async (files : FileList) => {
    const promises = Array.from(files).map((file) => {
      return new Promise((resolve)=>{
        const reader = new FileReader();
      
        reader.onload = (evt) => {
          const data = evt.target?.result;
          if (!data) return;

          const wb = XLSX.read(data, { type: 'array' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          
          const excelData = XLSX.utils.sheet_to_json(ws).slice(1) as excelData[];
          resolve(excelData)
        };

        reader.readAsArrayBuffer(file);
      }) as Promise<excelData[]>;
    })

    try {
      const results = await Promise.all(promises);
      return results;
    }
    catch (err) {
      console.log(err);
      return [];
    }
  }

  return (
    <>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        multiple
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