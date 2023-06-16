const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./trashcare-387803-firebase-adminsdk-hi4at-f6df30114e');
const functions = require("firebase-functions");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Database Firestore
const db = admin.firestore();

app.use(express.json());

app.get('/history/:trashId', async (req, res) => {
  try {

    // TrashId
    const trashId = req.params.trashId;

    // Mendapatkan data submission user berdasarkan trashId
    const submissionRef = db.collection('trashdispose').where('trashId', '==', trashId);
    const snapshot = await submissionRef.get();

    if (snapshot.empty) {
      res.status(404).json({ message: 'Data submission sampah tidak tersedia' });
    } else {
      //Mengambil data submission user
      const submission = snapshot.docs[0].data();
      res.json(submission);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terdapat error dalam pengambilan data submission sampah' });
  }
});

exports.apihistorydetail = functions.https.onRequest(app);

// Tes di local
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });