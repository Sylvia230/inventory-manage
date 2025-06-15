import React from 'react';
import { ConfigProvider } from 'antd'
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { routes } from './router';
import './App.less'

const App: React.FC = () => {
  const createdRoutes = createHashRouter(routes)
  return (
    // <HashRouter>
    //   {/* <AppContent /> */}
    //   <RouterProvider router={createdRoutes} />
    // </HashRouter>
     <ConfigProvider>
       <RouterProvider router={createdRoutes} />
     </ConfigProvider>
  );
};

export default App;
