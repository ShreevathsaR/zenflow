import React from "react";
import "./OnBoard.css";
import Select from "react-select";

const OnBoard = () => {
  const [onboardForm, setOnboardForm] = React.useState("form1");

  const [orgType, setOrgType] = React.useState(null);
  const [orgName, setOrgName] = React.useState("");
  const [orgIndustry, setOrgIndustry] = React.useState("");
  const [orgLocation, setOrgLocation] = React.useState("");
  const [orgNoMembers, setOrgNoMembers] = React.useState("");

  const orgTypeOptions = [
    { value: "individual", label: "Individual" },
    { value: "business", label: "Business" },
    { value: "non-profit", label: "Non-Profit" },
    { value: "government", label: "Government" },
    { value: "startup", label: "Startup" },
    { value: "enterprise", label: "Enterprise" },
    { value: "educational", label: "Educational" },
  ];

  const industryOptions = [
    { value: "agriculture", label: "Agriculture" },
    { value: "automotive", label: "Automotive" },
    { value: "banking", label: "Banking" },
    { value: "construction", label: "Construction" },
    { value: "education", label: "Education" },
    { value: "energy", label: "Energy" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "hospitality", label: "Hospitality" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "media", label: "Media" },
    { value: "retail", label: "Retail" },
    { value: "technology", label: "Technology" },
    { value: "transportation", label: "Transportation" },
    { value: "utilities", label: "Utilities" },
  ];

  const locationOptions = [
    { value: "new-york", label: "New York" },
    { value: "los-angeles", label: "Los Angeles" },
    { value: "chicago", label: "Chicago" },
    { value: "houston", label: "Houston" },
    { value: "phoenix", label: "Phoenix" },
    { value: "philadelphia", label: "Philadelphia" },
    { value: "san-antonio", label: "San Antonio" },
    { value: "san-diego", label: "San Diego" },
    { value: "dallas", label: "Dallas" },
    { value: "san-jose", label: "San Jose" },
    { value: "austin", label: "Austin" },
    { value: "jacksonville", label: "Jacksonville" },
    { value: "fort-worth", label: "Fort Worth" },
    { value: "columbus", label: "Columbus" },
    { value: "charlotte", label: "Charlotte" },
    { value: "san-francisco", label: "San Francisco" },
  ];

  const membersOptions = [
    { value: "1-10", label: "1-10" },
    { value: "11-50", label: "11-50" },
    { value: "51-100", label: "51-100" },
    { value: "101-500", label: "101-500" },
    { value: "501-1000", label: "501-1000" },
    { value: "1001-5000", label: "1001-5000" },
    { value: "5001-10000", label: "5001-10000" },
    { value: "10001-50000", label: "10001-50000" },
    { value: "50001-100000", label: "50001-100000" },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "transparent",
      padding: "0.5rem", // Change background color of the control
      border: "none", // Change border color of the control
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#01121a", // Change background color of the dropdown list
      color: "#fff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#141f29"
        : state.isFocused
        ? "#141f29"
        : "#01121a", // Change background on select/focus
      color: state.isSelected ? "white" : "lightgray", // Change text color based on selected or focused state
      scrollbarWidth: "none",
      padding: 10,
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
      fontWeight: "500",
      //   backgroundColor: "#141f29",
      borderRadius: "7px",
      padding: "0.25rem",
      paddingLeft: "1rem", // Change text color of selected value in the control
    }),
  };

  return (
    <div className="onboard-page">
      <div className="onboard-heading">
        <h1>Welcome to Zenflow!</h1>
        <h3 style={{ fontWeight: "400" }}>
          Let's get started by creating your organization.
        </h3>
      </div>
      <div className="onboard-card">
        <h3>Organization Details</h3>
        {onboardForm === "form1" && (
          <div className="onboard-form" style={{ paddingTop: "1rem" }}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter your organization name"
                required
              />
              <div className="input-group" style={{ paddingTop: "2rem" }}>
                <label htmlFor="orgType">Organization Type</label>
                <Select
                  className="org-type-select"
                  styles={customStyles}
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  value={orgType}
                  onChange={(selectedOption) => setOrgType(selectedOption)}
                  name="color"
                  options={orgTypeOptions}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="onboard-btn"
              onClick={() => {
                setOnboardForm("form2");
              }}
            >
              Next
            </button>
          </div>
        )}
        {onboardForm === "form2" && (
          <div className="onboard-form">
            <div className="input-group" style={{ paddingTop: "1rem" }}>
              <label htmlFor="Industry">Industry</label>
              <Select
                className="org-type-select"
                styles={customStyles}
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                value={orgIndustry}
                onChange={(selectedOption) => setOrgIndustry(selectedOption)}
                name="color"
                required
                options={industryOptions}
              />
            </div>
            <div className="input-group" style={{ paddingTop: "2rem" }}>
              <label htmlFor="location">Location</label>
              <Select
                className="org-type-select"
                styles={customStyles}
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                value={orgLocation}
                onChange={(selectedOption) => setOrgLocation(selectedOption)}
                name="color"
                required
                options={locationOptions}
              />
            </div>
            <div className="input-group" style={{ paddingTop: "2rem" }}>
              <label htmlFor="noMembers">Number of Members</label>
              <Select
                className="org-type-select"
                styles={customStyles}
                classNamePrefix="select"
                isClearable={true}
                isSearchable={true}
                value={orgNoMembers}
                onChange={(selectedOption) => setOrgNoMembers(selectedOption)}
                name="color"
                required
                options={membersOptions}
              />
            </div>
            <div className="onboard-form-btn-grp">
              <button
                type="submit"
                className="onboard-btn"
                onClick={() => {
                  setOnboardForm("form1");
                }}
              >
                Back
              </button>
              <button
                type="submit"
                className="onboard-btn"
                onClick={() => {
                  console.log(orgName, orgType, orgIndustry, orgLocation, orgNoMembers);
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnBoard;
