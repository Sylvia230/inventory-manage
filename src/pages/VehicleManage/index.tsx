import React from 'react';
import { Card } from 'antd';
import VehicleList from './components/VehicleList';

const VehicleManage: React.FC = () => {
  return (
    <Card>
      <VehicleList />
    </Card>
  );
};

export default VehicleManage; 