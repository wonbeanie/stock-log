'use client'

import { useState } from 'react'
import StorageIcon from '@mui/icons-material/Storage';
import { Button } from '@mui/material';
import ServerConfigModal from '../modals/ServerConfigModal';

export default function ServerConfigBtn() {
  const [open, setOpen] = useState(false);

  const onHandlerClick = () => {
    setOpen(!open);
  }

  return (
    <>
      <Button
        variant="contained" 
        startIcon={<StorageIcon />}
        onClick={onHandlerClick}
        className="bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 normal-case px-6 py-2 rounded-xl"
      >
        서버 설정
      </Button>
      <ServerConfigModal open={open} onClose={onHandlerClick}  />
    </>
  )
}
