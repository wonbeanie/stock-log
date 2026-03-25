'use client';

import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { updateStocksData } from '@/lib/utils';
import { useSetAtom } from 'jotai';
import { updateLastHashAtom } from '@/store/excel';

export default function ExcelUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateLastHash = useSetAtom(updateLastHashAtom);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try{
      await updateStocksData(files);
      updateLastHash();
    }
    catch(err){
      console.error(err);
    }

    e.target.value = "";
  };

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