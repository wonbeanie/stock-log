'use client';

import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';
import { excelData } from '../modules/utils';
import { useSetAtom } from 'jotai';
import { updateExcelDataAtom } from '../store/atoms';

export default function ExcelUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateData = useSetAtom(updateExcelDataAtom);

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

      updateData(jsonData as excelData[]);
    };

    reader.readAsArrayBuffer(file);
  };

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