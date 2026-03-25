import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

export const toastOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  maxToasts: 4,
  newestOnTop: true,
  toastClassName: "ecoshop-toast",
};

export default Toast;
