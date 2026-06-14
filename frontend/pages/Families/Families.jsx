import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import EntryModal from "../../components/EntriesModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./families.css"
const Families = () => {
  const {
    families,
    createFamily,
    fetchFamilies,
    deleteFamily,
    updateFamily,
  } = useAdmin();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchFamilies();
  }, []);

  // ➕ Create / ✏️ Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateFamily(editId, form);
      setEditId(null);
    } else {
      await createFamily(form);
    }

    setForm({ name: "", phone: "", address: "" });
  };

  // ✏️ Edit button click
  const handleEdit = (family) => {
    setEditId(family._id);
    setForm({
      name: family.name,
      phone: family.phone,
      address: family.address,
    });
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this family?")) {
      await deleteFamily(id);
    }
  };

  // 🥛 Go to entry page
  const handleEntry = (id) => {
    navigate(`/entries/${id}`);
  };

  return (
    <div className="families-page">
      <h1>Families</h1>

      {/* 🔍 Search */}
<input
  className="family-search"
  placeholder="Search family..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    fetchFamilies(e.target.value);
  }}
/>

      {/* ➕ Form */}
      <form onSubmit={handleSubmit} className="family-form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <button type="submit">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* 📋 Table */}
      
 <div className="family-table-container">
  <table className="family-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {families.map((f) => (
            <tr key={f._id}>
              <td>{f.name}</td>
              <td>{f.phone}</td>
              <td>{f.address}</td>

              <td>
<button
  className="entry-btn"
  onClick={() => setSelectedFamily(f._id)}
>
  Entry
</button>

<button
  className="icon-btn edit-btn"
  onClick={() => handleEdit(f)}
  title="Edit Family"
>
  <FaEdit />
</button>

<button
  className="icon-btn delete-btn"
  onClick={() => handleDelete(f._id)}
  title="Delete Family"
>
  <FaTrash />
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
<<<<<<< HEAD
      {selectedFamily && (
=======
            {selectedFamily && (
>>>>>>> 9355e7271d5b50ba72b1fd5a0cbb723d61eeebde
  <EntryModal
    familyId={selectedFamily}
    onClose={() => setSelectedFamily(null)}
  />
)}
    </div>
  );
};

const styles = {
  form: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
};

export default Families;
