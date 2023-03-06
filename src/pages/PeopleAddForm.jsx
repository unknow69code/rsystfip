import { useEffect } from "react";
import { PeopleContextProvider } from "../context/PeopleContext";
import FormPeople from "../components/FormPeople";

export default function PeopleAddForm() {
  useEffect(() => {
    document.title = "RSystfip | Fast scheduling";
  }, []);

  return (
    <div className="row">
      <div className="col-md-6 mx-auto">
        <div className="card card-body">
          <h1 className="h3 text-center">Agendamiento rápido</h1>
          <PeopleContextProvider>
            <FormPeople action="add" />
          </PeopleContextProvider>
        </div>
      </div>
    </div>
  );
}
