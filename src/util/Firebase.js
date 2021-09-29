import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDRhaklmVogc4wWVlf6MWMUS0gpMccfn0I",
    authDomain: "atna-lab.firebaseapp.com",
    databaseURL: "https://atna-lab.firebaseio.com",
    projectId: "atna-lab",
    storageBucket: "atna-lab.appspot.com",
    messagingSenderId: "436661740234",
    appId: "1:436661740234:web:8baf6f9f6c2c845d828a33",
    measurementId: "G-LF9JG7V3D4"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {app, storage};