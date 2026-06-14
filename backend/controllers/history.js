import DailyEntry from "../models/DailyEntry.js";

export const getMonthlyCalendar = async (req, res) => {
  try {
    const { familyId, month, year } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    // 🔥 FIX: query inside array
    const docs = await DailyEntry.find({
      family: familyId,
      "entries.date": { $gte: start, $lt: end },
    });

    let allEntries = [];

    docs.forEach(doc => {
      doc.entries.forEach(e => {
        if (new Date(e.date) >= start && new Date(e.date) < end) {
          allEntries.push(e);
        }
      });
    });

    // 🔥 GROUP BY DAY
    const calendarData = {};

    allEntries.forEach((entry) => {
      const day = new Date(entry.date).getDate();

      if (!calendarData[day]) {
        calendarData[day] = {
          litres: 0,
          total: 0,
        };
      }

      calendarData[day].litres += entry.litres;
      calendarData[day].total += entry.total;
    });

    res.json(calendarData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};