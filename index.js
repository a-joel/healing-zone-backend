require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//Import Files from external folders
const dbConnection = require('./config/dbConnection');
const userRouter = require('./routes/userRoute'); 
const diseaseRoute = require('./routes/diseaseRoute');
const doctorRoute = require('./routes/doctorRoute');
const patient = require('./routes/patientRoute');
const hospitalRoute = require('./routes/hospitalRoute');

//controllers
const authMiddleware = require('./controllers/authMiddleware');

//Middleware for using the files
const app = express();
app.use(cors())
app.use(express.json());
dbConnection();

//Middlewares to use the routes in the server
app.use('/users', userRouter);
app.use('/diseases', diseaseRoute);
app.use('/doctors', doctorRoute);
app.use('/patients', patient);
app.use('/hospitals', hospitalRoute);

app.post('/api/payments/create-checkout-session', authMiddleware, async (req, res) => {
        try {
                const {appoinmentFor, amount, appoinmentId} = req.body;

        if (!appoinmentFor || !amount || !appoinmentId) {
                return res.status(400).json({message: "All fields are required"});
        }
        const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                        {
                                price_data: {
                                        currency: 'inr',
                                        product_data: {
                                                name: `Appoinment for ${appoinmentFor}`,
                                                description: 'Hospital appoinment booking'
                                        },
                                        unit_amount: amount * 100
                                },
                                quantity: 1
                        },
                ],
                metadata: {
                        appoinmentId: appoinmentId,
                },
                succes_url: `${process.env.SERVER_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.SERVER_URL}/cancel-payment`,
        });
        } catch (error) {
              return res.status(500).json({message: error.message});
              console.log(error);
                
        }


});

//Server endpoints for running APIs
app.get('/', (req, res) => {
        return res.status(200).json({message: "Home server url"});
});

//Listening at the port
app.listen(process.env.PORT, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}`);      
});
