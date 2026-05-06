import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import "./Global.css";
import { nurseApi } from "./Api";

export default function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    license_number: "",
    dob: "",
    age: "",
  });

  const [sortField, setSortField] = useState("id");
  const [order, setOrder] = useState("ASC");

  const fetchData = async () => {
    const res = await axios.get(`${nurseApi}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setOrder("ASC");
    }
  };

  const sortIcon = (field) => {
    if (field !== sortField) return <FaSort />;
    return order === "ASC" ? <FaSortUp /> : <FaSortDown />;
  };

  const filtered = data.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (order === "ASC") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const openModal = (nurse = null, view = false) => {
    setViewMode(view);
    if (nurse) setForm(nurse);
    else
      setForm({
        id: null,
        name: "",
        license_number: "",
        dob: "",
        age: "",
      });
    setModal(true);
  };

  const handleSave = async () => {
    try {
      if (form.id) {
        await axios.put(`${nurseApi}/${form.id}`, form);
        toast.success("Nurse updated successfully!");
      } else {
        await axios.post(nurseApi, form);
        toast.success("Nurse added successfully!");
      }
      setModal(false);
      fetchData();
    } catch (error) {
      toast.error("Error saving nurse!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this nurse?")) {
      try {
        await axios.delete(`${nurseApi}/${id}`);
        toast.success("Nurse deleted successfully!");
        fetchData();
      } catch (error) {
        toast.error("Error deleting nurse!");
      }
    }
  };

  const handleExport = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Nurses");
      XLSX.writeFile(workbook, "nurses.xlsx");
      toast.success("File exported successfully!");
    } catch (error) {
      toast.error("Error exporting file!");
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>Nurse Management</h2>

      <div className="top-bar">
        <input
          placeholder="Search here"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <button onClick={() => openModal()}>Add</button>
          <button onClick={handleExport}>
            Download CSV
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              Id {sortIcon("id")}
            </th>
            <th onClick={() => handleSort("name")}>
              Name {sortIcon("name")}
            </th>
            <th onClick={() => handleSort("license_number")}>
              License {sortIcon("license_number")}
            </th>
            <th onClick={() => handleSort("dob")}>
              DOB {sortIcon("dob")}
            </th>
            <th onClick={() => handleSort("age")}>
              Age {sortIcon("age")}
            </th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.name}</td>
              <td>{n.license_number}</td>
              <td>{n.dob?.split("T")[0]}</td>
              <td>{n.age}</td>
              <td className="actions">
                <button onClick={() => openModal(n, true)}>
                  View
                </button>
                <button onClick={() => openModal(n)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDelete(n.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="modal">
          <div className="modal-box">
            <h3>
              {viewMode
                ? "View Nurse"
                : form.id
                ? "Edit Nurse"
                : "Add Nurse"}
            </h3>

            <input
              disabled={viewMode}
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              disabled={viewMode}
              placeholder="License"
              value={form.license_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  license_number: e.target.value,
                })
              }
            />

            <input
              disabled={viewMode}
              type="date"
              value={form.dob}
              onChange={(e) =>
                setForm({ ...form, dob: e.target.value })
              }
            />

            <input
              disabled={viewMode}
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />

            <div className="modal-actions">
              {!viewMode && <button onClick={handleSave}>Save</button>}
              <button onClick={() => setModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}