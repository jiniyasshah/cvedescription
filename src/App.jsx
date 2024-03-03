import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cveId, setCveId] = useState("");
  const [description, setDescription] = useState([]); // Initialize as an empty array
  const [cveArray, setCVEArray] = useState([]);
  const [clear, setClear] = useState(false);
  const handleCveIdChange = (e) => {
    setCveId(e.target.value);
    const inputText = e.target.value;
    // Split the input string by spaces and filter out any empty strings
    const cveNumbers = inputText.split(" ").filter((cve) => cve.trim() !== "");
    const uniqueCveNumbers = [...new Set(cveNumbers)];

    setCVEArray(uniqueCveNumbers);
  };

  const handleFetchData = async (item) => {
    try {
      const response = await axios.get(
        `https://cveawg.mitre.org/api/cve/${item}`
      );
      setDescription((prev) => [
        ...prev,
        response.data.containers.cna.descriptions[0].value,
      ]);
    } catch (error) {
      console.error("Error fetching CVE data", error);
      setDescription(["Error fetching data. Please check the CVE ID."]);
    }
  };

  const handleStoreArray = () => {
    // Access the cveArray variable for further usage
    console.log("Stored array:", cveArray);
    setClear(true);
    setDescription([]);
    if (!clear) {
      cveArray.forEach((item) => {
        handleFetchData(item);
      });
    } else {
      setCVEArray([]);
      setCveId("");
      setClear(false);
    }

    // Perform any additional logic or actions with the cveArray
  };

  return (
    <div className="container">
      <h1>CVE Description Fetcher</h1>
      <div className="text">
        <textarea
          type="text"
          className="textArea"
          id="cveId"
          value={cveId}
          onChange={handleCveIdChange}
          placeholder="CVE-XXXX-XXXXX CVE-XXXX-XXXXX  CVE-XXXX-XXXXX  CVE-XXXX-XXXXX   CVE-XXXX-XXXXX  CVE-XXXX-XXXXX  CVE-XXXX-XXXXX  CVE-XXXX-XXXXX  CVE-XXXX-XXXXX  CVE-XXXX-XXXXX"
        />
      </div>
      <button onClick={handleStoreArray}>
        {clear && cveId ? "Clear" : "Fetch"} Descriptions
      </button>
      <hr />
      <div className="result">
        <h2>CVE Descriptions: {description.length}</h2>
        {description.map((item, index) => (
          <p key={index} style={{ fontSize: "20px" }}>
            <span style={{ color: "orange" }}>{cveArray[index]}</span>
            <span>:</span> {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
