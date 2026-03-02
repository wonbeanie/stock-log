'use client';

import React, { useRef } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSetAtom } from 'jotai';
import { updateStocksDataAtom } from '@/store/stocks';
import { readFilesAsBuffer } from '@/lib/utils';

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