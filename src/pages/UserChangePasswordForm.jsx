import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { BiKey } from "react-icons/bi";
import { API_ROUTE } from "../utils/constants";

export default function UserChangePasswordForm() {
  const { role } = useParams();
  const [user, setUser] = useState([]);
  const [current_password, setCurrent_password] = useState("");
  const [new_password, setNew_password] = useState("");
  const [new_password_confirm, setNew_password_confirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "RSystfip | Change password users";
  }, []);

  async function getUser() {
    const request = await fetch(`${API_ROUTE}/get/users/one?role=${role}`);
    const data = await request.json();
    setUser(data);
  }

  useEffect(() => {
    getUser();
  }, [role]);

  async function changePassword(evt) {
    evt.preventDefault();
    setLoading(true);
    try {
      const request = await fetch(`${API_ROUTE}/update/password`, {
        method: "POST",
        headers: { "Content-Type": "application/javascript" },
        body: JSON.stringify({
          id: user.id,
          current_password,
          new_password,
          new_password_confirm,
        }),
      });
      const { error, ok } = await request.json();
      if (error) {
        return toast.error(error);
      }
      setCurrent_password("");
      setNew_password("");
      setNew_password_confirm("");
      return toast(ok, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="row">
      <div className="col-md-4 mx-auto">
        <form onSubmit={changePassword} className="card card-body">
          <h1 className="h3 text-center">
            Cambiar contraseña para {user.email}
          </h1>
          <div className="form-floating mb-3 mt-3">
            <input
              onChange={(evt) => setCurrent_password(evt.target.value)}
              value={current_password}
              className="form-control"
              type="password"
              placeholder="Current password"
              autoComplete="off"
              required
            />
            <label className="form-label">Contraseña anterior:</label>
          </div>
          <div className="form-floating mb-3">
            <input
              onChange={(evt) => setNew_password(evt.target.value)}
              value={new_password}
              className="form-control"
              type="password"
              placeholder="New password"
              autoComplete="off"
              required
            />
            <label className="form-label">Contraseña nueva:</label>
          </div>
          <div className="form-floating mb-3">
            <input
              onChange={(evt) => setNew_password_confirm(evt.target.value)}
              value={new_password_confirm}
              className="form-control"
              type="password"
              placeholder="Confirm new password"
              autoComplete="off"
              required
            />
            <label className="form-label">Confirmar contraseña nueva:</label>
          </div>
          <ToastContainer />
          <button
            className="w-100 btn btn-primary btn-lg mb-3"
            disabled={loading}
          >
            {!loading ? (
              <>
                Cambiar contraseña <BiKey className="mb-1" />
              </>
            ) : (
              <Spinner tam="lg" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
