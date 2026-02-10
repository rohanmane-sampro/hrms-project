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
        console.log("--------------------------------------------------");
        console.log("CURRENT EMPLOYEES IN DATABASE:");
        console.log("--------------------------------------------------");
        employees.forEach(emp => {
            console.log(`Name: ${emp.firstName} ${emp.lastName}`);
            console.log(`Email: ${emp.email}`);
            console.log(`Role: ${emp.role || 'Employee'}`);
            console.log("--------------------------------------------------");
        });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

run();
