import React, { useState, useEffect } from "react";
import axios from "axios";
import "./JournalHistory.css"; // Ensure this path matches your file structure
import { Link } from "react-router-dom";
import { FiSettings, FiBookOpen, FiHome} from 'react-icons/fi';


const JournalHistory = () => {
  const [journalEntries, setJournalEntries] = useState([
    {
      id: 1,
      date: "2024-03-14",
      title: "Reflections on a Sunny Day",
      body: "Today was remarkable because the sun was shining brighter than it has all week...",
    },
    {
      id: 2,
      date: "2024-03-13",
      title: "A Productive Afternoon",
      body: "I managed to complete all my tasks well before the evening. This left me with plenty of time to enjoy...",
    },
    {
      id: 3,
      date: "2024-03-12",
      title: "Learning Something New",
      body: "Today, I decided to learn about React Hooks. It's fascinating how they simplify state management in functional components...",
    },
    // Add more entries as needed
  ]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleEntryClick = (entry) => {
    // Toggle the entry between showing and not showing
    if (selectedEntry && selectedEntry.id === entry.id) {
      setSelectedEntry(null); // Deselect if it's the same entry
    } else {
      setSelectedEntry(entry); // Update the selected entry to show its body
    }
  };


//  const [journalEntries, setJournalEntries] = useState([]);
//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   const fetchEntries = async () => {
//     try {
//       const response = await axios.get(
//         "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442l/backend/journal/read.php",
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setJournalEntries(response.data);
//     } catch (error) {
//       console.error("Error fetching journal entries:", error);
//     }
//   };

  return (
    <div className="journal-history-page">
      <h1>Journal History</h1>
      {journalEntries.map((entry) => (
        <div key={entry.id} className="journal-entry" onClick={() => handleEntryClick(entry)}>
          <h3>{entry.date}</h3>
          <h4>{entry.title}</h4>
          {selectedEntry && selectedEntry.id === entry.id && (
            <p className="journal-body">{selectedEntry.body}</p>
          )}
        </div>
      ))}
        <footer>
        <Link to="/journal-history" className="icon-link"><FiBookOpen /></Link>
          <Link to="/journal" className="icon-link"><FiHome /></Link>

        </footer>
    </div>
  );
};

export default JournalHistory;
