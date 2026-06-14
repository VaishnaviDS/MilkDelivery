import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

const EntryModal = ({ familyId, onClose }) => {
  const { createEntry } = useAdmin();

  const [form, setForm] = useState({
    date: "",
    milkType: "cow",
    litres: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createEntry({
      familyId,
      ...form,
    });

    alert("Entry added");
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Add Entry</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="date"
            required
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <select
            onChange={(e) =>
              setForm({ ...form, milkType: e.target.value })
            }
          >
            <option value="cow">Cow</option>
            <option value="buffalo">Buffalo</option>
          </select>

          <input
            type="number"
            placeholder="Litres"
            required
            onChange={(e) =>
              setForm({ ...form, litres: e.target.value })
            }
          />

          <div style={{ marginTop: "10px" }}>
            <button type="submit">Save</button>
            <button onClick={onClose} type="button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default EntryModal;