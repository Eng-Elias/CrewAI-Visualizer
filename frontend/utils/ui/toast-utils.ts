import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export class ToastUtils {
  private static defaultConfig: SweetAlertOptions = {
    toast: true,
    position: "bottom-start",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  };

  private static showToast(options: SweetAlertOptions) {
    return MySwal.fire({
      ...this.defaultConfig,
      ...options,
    });
  }

  static success(message: string) {
    return this.showToast({
      icon: "success",
      title: message,
    });
  }

  static error(message: string) {
    return this.showToast({
      icon: "error",
      title: message,
    });
  }

  static warning(message: string) {
    return this.showToast({
      icon: "warning",
      title: message,
    });
  }

  static info(message: string) {
    return this.showToast({
      icon: "info",
      title: message,
    });
  }

  static loading(message: string = "Loading...") {
    return MySwal.fire({
      title: message,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        MySwal.showLoading();
      },
    });
  }

  static confirm({
    title = "Are you sure?",
    text = "",
    icon = "warning",
    confirmButtonText = "Yes",
    cancelButtonText = "No",
  } = {}) {
    return MySwal.fire({
      title,
      text,
      icon: icon as SweetAlertIcon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    });
  }
}
