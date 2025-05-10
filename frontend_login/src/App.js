import React, { useState ,useEffect } from "react";
import './App.css';  
import axios from 'axios';




function App() {
  const [formData, setFormData] = useState({
    company: "",
    legalName: "",
    website: "",
    email: "",
    officeEmail: "",
    contactNo: "",
    regNo: "",
    gstNo: "",
    agreement: null,
    signDate: "",
    active: false
  });
  const [agreementFile, setAgreementFile] = useState(null);


  const [errors, setErrors] = useState({});

   useEffect(() => {
    fetch('http://localhost:8001/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => console.warn(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

 


  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!formData.company) newErrors.company = "Company name is required";
    if (!formData.legalName) newErrors.legalName = "Legal name is required";
    if (!formData.website || !formData.website.startsWith("http"))
      newErrors.website = "Enter a valid website (include http/https)";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    if (!emailRegex.test(formData.officeEmail)) newErrors.officeEmail = "Invalid office email";
    if (!/^\d{10}$/.test(formData.contactNo)) newErrors.contactNo = "Enter valid 10-digit number";
    if (!/^\d{7}$/.test(formData.regNo)) newErrors.regNo = "Enter valid 7-digit registration number";
    if (!gstRegex.test(formData.gstNo)) newErrors.gstNo = "Invalid GST number format";
    if (!formData.agreement) newErrors.agreement = "Signed agreement is required";
    if (!formData.signDate) newErrors.signDate = "Sign date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  if (type === "file" && name === "agreement") {
    setAgreementFile(files[0]);
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
};


const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;

  const form = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (key !== "agreement") {
      form.append(key, value);
    }
  });

  if (agreementFile) {
    form.append("agreement", agreementFile); 
    for (let pair of form.entries()) {
  console.log(pair[0]+ ', ' + pair[1]);
}
 
  }

  axios.post("http://localhost:8001/api/submit", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then((res) => {
    alert("Form submitted successfully!");
    console.log(res.data);
  })
  .catch((err) => {
    console.error("Error:", err.response?.data || err.message);
    alert("Submission failed.");
  });
};



  return (
    <div className="form-container">
      <h2>Company Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Company:</label>
        <input name="company" onChange={handleChange} />
        <p className="error">{errors.company}</p>

        <label>Legal Name:</label>
        <input name="legalName" onChange={handleChange} />
        <p className="error">{errors.legalName}</p>

        <label>Website:</label>
        <input name="website" onChange={handleChange} />
        <p className="error">{errors.website}</p>

        <label>Email:</label>
        <input name="email" onChange={handleChange} />
        <p className="error">{errors.email}</p>

        <label>Office Email:</label>
        <input name="officeEmail" onChange={handleChange} />
        <p className="error">{errors.officeEmail}</p>

        <label>Office Contact No:</label>
        <input name="contactNo" onChange={handleChange} />
        <p className="error">{errors.contactNo}</p>

        <label>Registration No:</label>
        <input name="regNo" onChange={handleChange} />
        <p className="error">{errors.regNo}</p>

        <label>GST No:</label>
        <input name="gstNo" onChange={handleChange} />
        <p className="error">{errors.gstNo}</p>

        <label>Signed Agreement (PDF):</label>
        <input type="file" name="agreement" onChange={handleChange} />
        <p className="error">{errors.agreement}</p>

        <label>Sign Date:</label>
        <input type="date" name="signDate" onChange={handleChange} />
        <p className="error">{errors.signDate}</p>


        <label>
          Active:
          <input type="checkbox" name="active" onChange={handleChange} />
        </label>

        <br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
