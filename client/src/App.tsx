import { ToastContainer } from 'react-toastify';
import DashboardRoutes from './routes/DashboardRoutes';

function App() {

  return (
    <>
      <DashboardRoutes />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme={'light'}
      />
    </>
  );
}

export default App;
