const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/hrms";

const EmployeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' },
    department: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, default: 'Active' },
    joiningDate: { type: Date, default: Date.now },
    salary: { type: Number, required: true },
}, { timestamps: true });

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

async function run() {
    await mongoose.connect(uri);
    const employees = await Employee.find({});
    console.log("Employees found:", employees.length);
    employees.forEach(emp => {
        console.log(`- ${emp.firstName} ${emp.lastName} (${emp.email}) [Role: ${emp.role}]`);
    });

    // Check specific email
    const specific = await Employee.findOne({ email: 'rohanmane9841@gmail.com' });
    if (specific) {
        console.log("\nSpecific user found:", specific);
    } else {
        console.log("\nUser 'rohanmane9841@gmail.com' NOT FOUND.");
    }

    await mongoose.disconnect();
}

run().catch(console.error);
