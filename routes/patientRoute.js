//Packages are imported to use in this module
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

//Data model importing here
const Patient = require("../models/patientShema");
const Appointment = require('../models/appoinmentShema');

//controller
const authMiddleware = require('../controllers/authMiddleware');

//Endpoints for patients
router.get("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const patients = await Patient.find();
    return res.status(200).json({ data: patients });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

//Route end point for enter patients data
router.post("/", async (req, res) => {
  const {
    userId,
    name,
    age,
    mobile,
    email,
    address,
    diseaseCategory,
    diseaseSubCategory,
    diseaseName
  } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "Register or login first." });
    }
    if (!name) {
      return res.status(400).json({ message: "Name is not valid" });
    }

    if (!age || age.length < 1 || age.length > 130) {
      return res.status(400).json({ message: "Age is not valid" });
    }

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Mobile Number must be exactly 10 digits" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address is not valid" });
    }

    if (!diseaseName) {
      return res.status(400).json({ message: "Disease Name is not valid" });
    }

    const newPatient = new Patient({
      userId,
      name,
      age,
      mobile,
      email,
      address,
      diseaseCategory,
      diseaseSubCategory,
      diseaseName,
      status: 'pending'
    });

    const postedPatient = await newPatient.save();

    console.log(postedPatient);
    return res
      .status(201)
      .json({ message: "Patient Added", data: postedPatient });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

//Update patients route
router.put('/update/:id', async (req, res) => {
        const { id } =  req.params;
        const requestData = req.body;

        try {
                if (!id) {
                        return res.status(400).json({message: "Patient id needed to update"});
                }

                const updatedPatient = await Patient.findByIdAndUpdate(id, requestData, { new: true, runValidators: true });

                if (!updatedPatient) {
                        return res.status(404).json({message: "Patient not found"});
                }
                console.log(updatedPatient);
                
                return res.status(200).json({message: "Updated patient", data: updatedPatient});
        } catch (error) {
                console.log(error);
                return res.status(500).json({message: error.message});
        }

});

//Delete Route for patients
router.delete('/delete/:id', authMiddleware(["admin", "doctor", "patient"]), async (req, res) => {
        const { id } = req.params;

        try {
                if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Patient ID" });
}

                const deletedPatient = await Patient.findByIdAndDelete(id);

                if (!deletedPatient) {
                        return res.status(400).json({message: "Patient Delete operation is not completed"});
                }

                console.log("Deleted successfuly.");
                return res.status(200).json({message: "Patient is deleted."});
                
        } catch (error) {
                console.log(error);
                return res.status(500).json({message: error.message});
                
        }
});

// POST /api/create-order
router.post('/create-order', authMiddleware, async (req, res) => {
  const { amount, currency, receipt } = req.body;
  const options = { amount, currency, receipt };
  const order = await razorpay.orders.create(options);
  res.json(order);
});

// POST /api/verify-payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, ...patientData } = req.body;

  // ✅ Verify signature (Razorpay docs)
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // ✅ Save to MongoDB
  const appointment = new Appointment({
    ...patientData,
    paymentId: razorpay_payment_id,
    status: 'confirmed',
    userId: req.user.id
  });
  await appointment.save();

  res.json({ success: true });
});

router.put('/update/:id', async(req, res) => {
  const { id } = req.params;
  const status = req.body;

  try {
    const statusUpdated = await Patient.findByIdAndUpdate(id, status, {new: true, runValidators: true});
    if (!statusUpdated) {
      return res.status(400).json({message: "Status not updated"});
    }
  } catch (error) {
    return res.status(500).json({message: error.message});
    console.log(error);
  }
});

router.get('/appointments', async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const appointments = await Patient.find({ email: email });
    return res.status(200).json({ data: appointments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});


router.delete('/cancel-appointment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const deletedAppointment = await Patient.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

//Route export
module.exports = router;
