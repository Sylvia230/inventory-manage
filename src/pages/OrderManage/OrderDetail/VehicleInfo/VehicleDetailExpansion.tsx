import React from 'react';
import { Space, Image, Descriptions } from 'antd';
import { VehicleData } from '../interface';

interface VehicleDetailExpansionProps {
  vehicle: VehicleData;
}

const VehicleDetailExpansion: React.FC<VehicleDetailExpansionProps> = ({ vehicle }) => {
  return (
    <div style={{ padding: '16px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 验车照片 */}
        {vehicle.inspectionPhotos && vehicle.inspectionPhotos.length > 0 && (
          <Descriptions title="验车照片" bordered>
            <Descriptions.Item span={3}>
              <Space wrap>
                {vehicle.inspectionPhotos?.map((url:string, index:number) => (
                  <Image
                    key={index}
                    width={200}
                    height={150}
                    src={url}
                    alt={`验车照片${index + 1}`}
                    style={{ objectFit: 'cover' }}
                  />
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}

        {/* 质损照片 */}
        {vehicle.damagePhotos && vehicle.damagePhotos.length > 0 && (
          <Descriptions title="质损照片" bordered>
            <Descriptions.Item span={3}>
              <Space wrap>
                {vehicle.damagePhotos?.map((url:string, index:number) => (
                  <Image
                    key={index}
                    width={200}
                    height={150}
                    src={url}
                    alt={`质损照片${index + 1}`}
                    style={{ objectFit: 'cover' }}
                  />
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        )}

        {/* 资料信息 */}
        {vehicle.documents && vehicle.documents.length > 0 && (
          <Descriptions title="资料信息" bordered>
            {vehicle.documents?.map((doc:any, index:number) => (
              <Descriptions.Item key={index} label={doc.name} span={3}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  查看文件
                </a>
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Space>
    </div>
  );
};

export default VehicleDetailExpansion; 