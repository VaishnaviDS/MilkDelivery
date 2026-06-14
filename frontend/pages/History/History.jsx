import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import CalendarPage from "../../components/Calendar";
import "./history.css";

const History = () => {
  const { families, fetchFamilies } = useAdmin();

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );
  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [selectedFamily, setSelectedFamily] =
    useState(null);

  useEffect(() => {
    fetchFamilies();
  }, []);

  return (
    <div className="history-page">
      <h1>📊 History</h1>

      {/* Search */}
      <input
        className="history-search"
        placeholder="Search by name or address"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          fetchFamilies(e.target.value);
        }}
      />

      {/* Filters */}
      <div className="history-filters">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Month {i + 1}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
        />
      </div>

      {/* Family Table */}
      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Calendar</th>
            </tr>
          </thead>

          <tbody>
            {families.length > 0 ? (
              families.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>{f.phone}</td>
                  <td>{f.address}</td>

                  <td>
                    <button
                      className="calendar-btn"
                      onClick={() =>
                        setSelectedFamily(
                          selectedFamily === f._id
                            ? null
                            : f._id
                        )
                      }
                      title="View Calendar"
                    >
                      📅
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No families found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Calendar Modal */}
      {selectedFamily && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <button
              className="admin-modal-close"
              onClick={() =>
                setSelectedFamily(null)
              }
            >
              ✖
            </button>

            <h3>
              {
                families.find(
                  (f) => f._id === selectedFamily
                )?.name
              }{" "}
              - Calendar
            </h3>

            <CalendarPage
              familyId={selectedFamily}
              month={Number(month)}
              year={Number(year)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default History;