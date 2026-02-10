const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/hrms";

const EmployeeSchema = new mongoose.Schema({
    email: String,
    firstName: String
}, { strict: false });

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

async function fixEmail() {
    try {
        await mongoose.connect(uri);
        const res = await Employee.updateOne(
            { email: 'rohanamane9841@gmail.com' },
            { $set: { email: 'rohanmane9841@gmail.com' } }
        );

        if (res.modifiedCount > 0) {
            console.log("SUCCESS: Fixed email preference.");
        } else {
            console.log("NOTE: No record found with the typo email, or it was already fixed.");
        }

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await mongoose.disconnect();
    }
}

fixEmail();
