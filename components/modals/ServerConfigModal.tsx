'use client'

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { serverUrlAtom } from '../../store/atoms';
import DnsIcon from '@mui/icons-material/Dns';

export default function ServerConfigModal({ open, onClose }: Props) {
  const [serverUrl, setServerUrl] = useAtom(serverUrlAtom);
  const [tempUrl, setTempUrl] = useState(serverUrl);

  const handleSave = () => {
    if (!tempUrl.startsWith('http')) {
      alert('올바른 URL 형식이 아닙니다. (http:// 또는 https:// 포함)');
      return;
    }
    setServerUrl(tempUrl);
    onClose();
    window.location.reload(); 
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ className: "rounded-2xl p-2" }}
    >
      <DialogTitle className="flex items-center gap-2 font-bold text-gray-800">
        <DnsIcon className="text-blue-500" />
        서버 엔드포인트 설정
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" className="text-gray-500 mb-4">
          데이터를 가져올 GraphQL 서버의 주소를 입력해주세요.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Server URL"
          type="url"
          fullWidth
          variant="outlined"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          placeholder="http://localhost:4000/"
          className="bg-gray-50"
        />
      </DialogContent>

      <DialogActions className="p-4 pt-0">
        <Button onClick={onClose} className="text-gray-500 normal-case">
          취소
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          className="bg-blue-600 hover:bg-blue-700 shadow-none normal-case rounded-lg px-6"
        >
          저장 후 적용
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}