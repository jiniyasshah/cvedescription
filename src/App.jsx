import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cveId, setCveId] = useState("");
  const [description, setDescription] = useState([]); // Initialize as an empty array
  const [cveArray, setCVEArray] = useState([]);
  const [clear, setClear] = useState(false);
  const [rce, setRce] = useState([]);
  const [xss, setXSS] = useState([]);
  const [rceIsChecked, setIsChecked] = useState(false);
  const [xssIsChecked, setXSSIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    // Toggle the state when the checkbox is checked or unchecked
    setIsChecked(!rceIsChecked);

    // Call your function or perform any other action here
  };

  const handleXSSCheckboxChange = () => {
    setXSSIsChecked(!xssIsChecked);
  };

  const handleCveIdChange = (e) => {
    if (e.target.value === "") {
      setDescription([]);
      setRce([]);
      setXSS([]);
      setClear(false);
      setIsChecked(false);
      setXSSIsChecked(false);
    }
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

      const desc = response.data.containers.cna.descriptions[0].value;
      setDescription((prev) => [...prev, desc]);
      if (
        desc.toLowerCase().includes("arbitrary") ||
        desc.includes("RCE") ||
        (desc.toLowerCase().includes("code") &&
          desc.toLowerCase().includes("execution"))
      ) {
        setRce((prev) => [...prev, desc]);
      }

      if (
        desc.toLowerCase().includes("xss") ||
        (desc.toLowerCase().includes("cross") &&
          desc.toLowerCase().includes("site"))
      ) {
        setXSS((prev) => [...prev, desc]);
      }
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
      setRce([]);
      setXSS([]);
      setClear(false);
      setIsChecked(false);
      setXSSIsChecked(false);
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

        <div className="checkButton">
          <div className="innerButton">
            <label>
              <input
                type="checkbox"
                checked={rceIsChecked}
                onChange={handleCheckboxChange}
              />
              RCE
            </label>
          </div>
          <div className="innerButton">
            <label>
              <input
                type="checkbox"
                checked={xssIsChecked}
                onChange={handleXSSCheckboxChange}
              />
              XSS
            </label>
          </div>
        </div>
      </div>
      <button onClick={handleStoreArray}>
        {clear && cveId ? "Clear" : "Fetch"} Descriptions
      </button>
      <hr />

      <div className="result">
        {!rceIsChecked && !xssIsChecked && (
          <>
            <h2>CVE Descriptions: {description.length}</h2>
            {description.map((item, index) => (
              <p key={index} style={{ fontSize: "20px" }}>
                <span style={{ color: "orange" }}>{cveArray[index]}</span>
                <span>:</span> {item}
              </p>
            ))}
          </>
        )}
        {rceIsChecked && (
          <>
            <h2>RCE Descriptions: {rce.length}</h2>

            {rce.map((item, index) => (
              <p key={index} style={{ fontSize: "20px" }}>
                <span style={{ color: "orange" }}>{cveArray[index]}</span>
                <span>:</span> {item}
              </p>
            ))}
          </>
        )}

        {xssIsChecked && (
          <>
            <h2>XSS Descriptions: {xss.length}</h2>

            {xss.map((item, index) => (
              <p key={index} style={{ fontSize: "20px" }}>
                <span style={{ color: "orange" }}>{cveArray[index]}</span>
                <span>:</span> {item}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
