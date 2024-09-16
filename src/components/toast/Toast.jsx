// import 'react-toastify/dist/ReactToastify.css';
import toast from 'react-hot-toast';

export const showToastMessage = (message) => {
  toast.success(message, {
    position: 'top-right',
  });
};

export const showErrorMessage = (message) => {
  toast.error(message, {
    position: 'top-right',
  });
};

export const showWarningMessage = (message) => {
  toast.warning(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};

export const showInfoMessage = (message) => {
  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};
