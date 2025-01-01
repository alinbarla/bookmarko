import { Toaster } from 'react-hot-toast';

const Notification = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '8px',
        },
        success: {
          iconTheme: {
            primary: '#77DD77',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#FF6961',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default Notification; 