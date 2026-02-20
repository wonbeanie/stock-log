'use client';
import { Button, Card, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Home() {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <Card className="p-8 max-w-md mx-auto shadow-xl rounded-2xl">
        <Typography variant="h5" className="font-bold text-gray-800 mb-2">
          MUI 테스트
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<TrendingUpIcon />}
          className="bg-blue-600 hover:bg-blue-700 py-3 w-full"
        >
          버튼 테스트
        </Button>
      </Card>
    </div>
  );
}