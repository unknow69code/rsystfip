import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BiTrash, BiKey } from "react-icons/bi";
import { API_ROUTE } from "../utils/constants";

export default function DashboardRow({ user }) {
  const [deleted, setDeleted] = useState(false);

  async function hdClkDelete({ id }) {
    if (!confirm("Seguro(a) de eliminar ese usuario?")) {
      return;
    }

    try {
      const request = await fetch(`${API_ROUTE}/delete/user?role=${id}`);
      const response = request.json();

      if (!response) {
        return toast.error("Error al eliminar");
      }
      toast("Usuario eliminado exitosamente", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setDeleted(true);
    } catch (err) {
      toast.error(err);
    }
  }

  if (deleted) {
    return null;
  }

  return (
    <tr>
      <td>{user.email}</td>
      <td>
        <Link
          to={`/users/manage/password/${user.id}/change`}
          className="btn btn-light border m-1"
          title={`Change password for user ${user.email}`}
        >
          <BiKey className="mb-1" />
        </Link>
        <button
          onClick={() => hdClkDelete(user)}
          className={
            user.id !== 3
              ? "btn btn-danger border m-1"
              : "btn btn-danger border disabled m-1"
          }
          title={`Delete user ${user.email} (Requires confirmation)`}
        >
          <BiTrash className="mb-1" />
        </button>
      </td>
    </tr>
  );
}
