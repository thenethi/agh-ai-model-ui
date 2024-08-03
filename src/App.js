import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";

const App = () => {
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [availability, setAvailability] = useState("");
  const [jobs, setJobs] = useState([]);
  const [trainMessage, setTrainMessage] = useState("");
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);

  const skillOptions = [
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "javascript", label: "JavaScript" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "r", label: "R" },
    { value: "sql", label: "SQL" },
    { value: "machine_learning", label: "Machine Learning" },
    { value: "data_analysis", label: "Data Analysis" },
    { value: "web_development", label: "Web Development" },
    { value: "technical_support", label: "Technical Support" },
    { value: "ui_ux_design", label: "UI/UX Design" },
    { value: "database_management", label: "Database Management" },
    { value: "testing", label: "Testing" },
    { value: "linux", label: "Linux" },
    { value: "windows", label: "Windows" },
    { value: "troubleshooting", label: "Troubleshooting" },
    { value: "aws", label: "AWS" },
    { value: "networking", label: "Networking" },
    { value: "product_management", label: "Product Management" },
    { value: "unity", label: "Unity" },
    { value: "business_analysis", label: "Business Analysis" },
    { value: "digital_marketing", label: "Digital Marketing" },
    { value: "technical_writing", label: "Technical Writing" },
    { value: "salesforce", label: "Salesforce" },
    { value: "docker", label: "Docker" },
    { value: "azure", label: "Azure" },
    { value: "bi_tools", label: "BI Tools" },
    { value: "systems_analysis", label: "Systems Analysis" },
    { value: "cloud_computing", label: "Cloud Computing" },
    { value: "cyber_security", label: "Cyber Security" },
    { value: "devops", label: "DevOps" },
  ];

  const handleTrainModel = async () => {
    setIsTraining(true);
    const response = await fetch(
      "https://agh-jobs-ai-model.onrender.com/api/train",
      {
        method: "GET",
      }
    );
    if (response.ok) {
      setTrainMessage("Model trained successfully");
      setIsModelTrained(true);
    } else {
      setTrainMessage("Failed to train model");
    }
    setIsTraining(false);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedSkills = skills.map((skill) => skill.value).join(" ");

    const requestBody = {
      skills: selectedSkills,
      experience: parseInt(experience),
      location,
      salary: parseInt(salary),
      availability,
    };

    const response = await fetch(
      "https://agh-jobs-ai-model.onrender.com/api/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setJobs(data);
    } else {
      console.error("Failed to fetch job predictions");
    }
    setIsLoading(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Job Matching App</h1>
      <button
        className="btn btn-primary mb-2"
        onClick={handleTrainModel}
        disabled={isModelTrained || isTraining}
      >
        {isTraining
          ? "Training..."
          : isModelTrained
          ? "Model Trained"
          : "Train Model"}
      </button>
      {trainMessage && <div className="alert alert-info">{trainMessage}</div>}
      <form onSubmit={handlePredict}>
        <div className="mb-3">
          <label htmlFor="skills" className="form-label">
            Skills
          </label>
          <Select
            isMulti
            name="skills"
            options={skillOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={setSkills}
            isDisabled={!isModelTrained}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="experience" className="form-label">
            Experience (years)
          </label>
          <input
            type="number"
            className="form-control"
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            disabled={!isModelTrained}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Preferred Location
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={!isModelTrained}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="salary" className="form-label">
            Expected Salary
          </label>
          <input
            type="number"
            className="form-control"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
            disabled={!isModelTrained}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="availability" className="form-label">
            Availability
          </label>
          <select
            className="form-control"
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            required
            disabled={!isModelTrained}
          >
            <option value="">Select Availability</option>
            <option value="Immediately">Immediately</option>
            <option value="1-2 Weeks">1-2 Weeks</option>
            <option value="1 Month">1 Month</option>
            <option value="Flexible">Flexible</option>
            <option value="Not Available">Not Available</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-success"
          disabled={isLoading || !isModelTrained}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      <div className="mt-5">
        {jobs.length > 0 && (
          <div>
            <h2>Job Matches</h2>
            <ul className="list-group">
              {jobs.map((job, index) => (
                <li key={index} className="list-group-item">
                  <h5>{job.job.title}</h5>
                  <p>Location: {job.job.location}</p>
                  <p>Experience: {job.job.experience} years</p>
                  <p>Salary: ${job.job.salary}</p>
                  <p>Skills: {job.job.skills}</p>
                  <p>Availability: {job.job.availability}</p>
                  <p>Match Score: {(job.match_score * 100).toFixed(2)}%</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
