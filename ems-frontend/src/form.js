import { useState } from "react";
import * as Yup from "yup";
import './App.css';

// Validation Schema
const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is Required"),
    lastName: Yup.string().required("Last Name is required"),
    employeeId: Yup.string()
        .max(10, "Employee ID must not exceed 10 characters")
        .matches(/^[a-z0-9]+$/i, "Employee ID must be alphanumeric")
        .required("Employee ID is required"),
    email: Yup.string()
        .email("Invalid Email Format")
        .required("Email is Required"),
    phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits with no special characters")
        .required("Phone Number is Required"),
    department: Yup.string()
        .oneOf(["HR", "Engineering", "Marketing"], "Invalid department selected")
        .required("Department is Required"),
    dateOfJoining: Yup.date().required("Date of Joining is Required"),
    role: Yup.string().required("Role is Required"),
});

const EMSForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        employeeId: "",
        email: "",
        phoneNumber: "",
        department: "",
        dateOfJoining: "",
        role: "",
    });

    const [errors, setErrors] = useState({});

    // Handle field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    // Inside handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form data using Yup
        try {
            await validationSchema.validate(formData, { abortEarly: false });

            const response = await fetch("http://localhost:5000/submit", {  // Change to backend port
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Form submitted successfully!");
                setFormData({
                    firstName: "",
                    lastName: "",
                    employeeId: "",
                    email: "",
                    phoneNumber: "",
                    department: "",
                    dateOfJoining: "",
                    role: "",
                }); // Reset the form after successful submission
            } else {
                const errorResponse = await response.json();
                alert(errorResponse.message || "Failed to submit form.");
            }
        } catch (err) {
            const errorMessages = {};
            err.inner.forEach((error) => {
                errorMessages[error.path] = error.message;
            });
            setErrors(errorMessages); // Display errors
        }
    };


    return (
        <form onSubmit={handleSubmit} >
            <div className="form-container">
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        placeholder="Enter your first name"
                        onChange={handleChange}
                    />
                    {errors.firstName && <div className="error">{errors.firstName}</div>}
                </div>

                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        placeholder="Enter your last name"
                        onChange={handleChange}
                    />
                    {errors.lastName && <div className="error">{errors.lastName}</div>}
                </div>

                <div>
                    <label>Employee ID:</label>
                    <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        placeholder="Enter your employee ID"
                        onChange={handleChange}
                    />
                    {errors.employeeId && <div className="error">{errors.employeeId}</div>}
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>

                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        placeholder="Enter your phone number"
                        onChange={handleChange}
                    />
                    {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                </div>

                <div>
                    <label>Department:</label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                    >
                        <option value="">Select Department</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                    {errors.department && <div className="error">{errors.department}</div>}
                </div>

                <div>
                    <label>Date of Joining:</label>
                    <input
                        type="date"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                    />
                    {errors.dateOfJoining && <div className="error">{errors.dateOfJoining}</div>}
                </div>

                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        placeholder="Enter your role"
                        onChange={handleChange}
                    />
                    {errors.role && <div className="error">{errors.role}</div>}
                </div>

                <button type="submit">Submit</button>
            </div>
        </form>
    );
};

export default EMSForm;
