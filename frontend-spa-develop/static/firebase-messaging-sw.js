
importScripts(
  'https://www.gstatic.com/firebasejs/7.16.0/firebase-app.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/7.16.0/firebase-messaging.js'
)
firebase.initializeApp({"apiKey":"AIzaSyDriB-22FOYiG30kVp2xiN-ObYz4elqoK4","authDomain":"microerp-265008.firebaseapp.com","databaseURL":"https:\u002F\u002Fmicroerp-265008.firebaseio.com","projectId":"microerp-265008","storageBucket":"microerp-265008.appspot.com","messagingSenderId":"474093391726","appId":"1:474093391726:web:4eba821296c8e3a5c6bb7f","measurementId":"G-ED1YHY07N2"})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()
