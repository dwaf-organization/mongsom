// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBST2oZfwl1ogPLvAHlQi3ylZSif0BQtWc',
  authDomain: 'mongsom-22c9b.firebaseapp.com',
  projectId: 'mongsom-22c9b',
  storageBucket: 'mongsom-22c9b.firebasestorage.app',
  messagingSenderId: '539191998873',
  appId: '1:539191998873:web:9347ab39131f504ed47b08',
  measurementId: 'G-Y44M1ZTLFG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
