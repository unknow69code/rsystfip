import { createContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UNSET_STATUS, API_ROUTE } from "../utils/constants";
import { formatTodaysDate, formatTodaysDateTime } from "../utils/resources";

export const PeopleContext = createContext();

export function PeopleContextProvider({ children }) {
  const { id } = useParams();

  const [disabledAll, setDisabledAll] = useState(true);
  const [loading, setLoading] = useState(false);

  // Event id Aux
  const [eventId, setEventId] = useState("");

  // Select components states
  const [person, setPerson] = useState(UNSET_STATUS);
  const [doctype, setDoctype] = useState(UNSET_STATUS);
  const [facultie, setFacultie] = useState(UNSET_STATUS);
  // Input components states
  const [doc, setDoc] = useState("");
  const [name, setName] = useState("");
  const [asunt, setAsunt] = useState("");
  const [color, setColor] = useState("#388cdc");
  const [date, setDate] = useState(formatTodaysDate());
  const [start, setStart] = useState(formatTodaysDateTime());
  const [end, setEnd] = useState(formatTodaysDateTime());
  const [status, setStatus] = useState(2);
  const [staffDeans, setStaffDeans] = useState(null);

  // Refs to components
  const facultieSelectRef = useRef(null);
  const loadEventsRef = useRef(null);

  async function cancellSchedule() {
    setLoading(true);
    try {
      const request = await fetch(
        `${API_ROUTE}/cancell/scheduling?id=${eventId}&date=${date}`
      );
      const { ok, error } = await request.json();
      if (ok) {
        return toast(ok, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      toast.error(error);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function schedulePerson() {
    setLoading(true);
    try {
      const request = await fetch(`${API_ROUTE}/save/reg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person,
          name,
          doctype,
          doc,
          facultie,
          asunt,
          color,
          date,
          start,
          end,
          status,
        }),
      });
      const { ok, error } = await request.json();
      if (ok) {
        setPerson("unset");
        setDoc("");
        setDoctype("unset");
        setName("");
        setFacultie("unset");
        setAsunt("");
        toast(ok, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return true;
      }
      toast.error(error);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function editPerson() {
    setLoading(true);
    try {
      const request = await fetch(`${API_ROUTE}/update/reg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          person,
          name,
          doctype,
          doc,
          facultie,
          asunt,
        }),
      });
      const { ok, error } = await request.json();
      if (ok) {
        setPerson("unset");
        setDoc("");
        setDoctype("unset");
        setName("");
        setFacultie("unset");
        setAsunt("");
        return toast(ok, {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      toast.error(error);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function getStaffDeans() {
    const request = await fetch(`${API_ROUTE}/get/staffdeans/itfip`);
    const data = await request.json();
    setStaffDeans(data);
  }

  async function getUserData() {
    const request = await fetch(`${API_ROUTE}/get/person/one?id=${id}`);
    const { person_type, id_doc, facultad, name, num_doc, text_asunt } =
      await request.json();
    setPerson(person_type);
    setDoctype(id_doc);
    setFacultie(facultad);
    setName(name);
    setDoc(num_doc);
    setAsunt(text_asunt);
  }

  useEffect(() => {
    id && getUserData();
  }, []);

  useEffect(() => {
    if (!staffDeans) {
      return;
    }
    for (const dean of staffDeans) {
      if (dean.cc === doc) {
        setName(dean.name);
        setFacultie(dean.facultie);
        toast("Datos autocompletados automáticamente", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        break;
      }
    }
  }, [doc]);

  return (
    <PeopleContext.Provider
      value={{
        disabledAll,
        setDisabledAll,
        loadEventsRef,
        loading,
        person,
        setPerson,
        doctype,
        setDoctype,
        facultie,
        setFacultie,
        doc,
        setDoc,
        name,
        setName,
        asunt,
        setAsunt,
        color,
        setColor,
        setDate,
        setStart,
        setEnd,
        setStatus,
        facultieSelectRef,
        schedulePerson,
        editPerson,
        cancellSchedule,
        staffDeans,
        getStaffDeans,
        setEventId,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
}
