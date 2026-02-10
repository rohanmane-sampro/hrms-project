const fs = require('fs');
const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/hrms";

const EmployeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    role: String
}, { strict: false });

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

async function run() {
    try {
        await mongoose.connect(uri);
        const employees = await Employee.find({});

        let output = "--- USER REPORT ---\n";
        employees.forEach(emp => {
            output += `Name: ${emp.firstName} ${emp.lastName}\n`;
            output += `Email: ${emp.email}\n`;
            output += `Role: ${emp.role || 'Employee'}\n`;
            output += "-------------------\n";
        });

        fs.writeFileSync('employee_report.txt', output);

    } catch (e) {
        fs.writeFileSync('employee_report.txt', "Error: " + e.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();
