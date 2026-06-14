import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";

const CalendarPage = ({ familyId, month, year }) => {
  const { getCalendar } = useAdmin();
  const [data, setData] = useState({});

  useEffect(() => {
    if (familyId) {
      fetchData();
    }
  }, [familyId, month, year]);

  const fetchData = async () => {
    const res = await getCalendar(familyId, month, year);
    setData(res || {});
  };

  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <div>
      <h2>Milk Calendar</h2>

      <div style={styles.grid}>
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const entry = data[day];

          return (
            <div key={day} style={styles.day}>
              <strong>{day}</strong>

              {entry && (
                <div style={styles.tooltip}>
                  {entry.litres}L ({entry.milkType})
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
  },
  day: {
    border: "1px solid #ccc",
    padding: "10px",
    minHeight: "80px",
    position: "relative",
  },
  tooltip: {
    marginTop: "5px",
    fontSize: "12px",
    color: "green",
  },
};

export default CalendarPage;