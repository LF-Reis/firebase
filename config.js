// Substitua as configurações do seu projeto Firebase abaixo
const firebaseConfig = {
    apiKey: "AIzaSyA-ieItL0mV0xPM6GZ2xLX5RfHAoiufZAA",
    authDomain: "ifnmg-teste.firebaseapp.com",
    projectId: "ifnmg-teste",
    storageBucket: "ifnmg-teste.appspot.com",
    messagingSenderId: "342291790838",
    appId: "1:342291790838:web:650be06ec92079d90925d7",
    measurementId: "G-9ND790VW3Q"
};

// Inicializa o Firebase com as configurações fornecidas
firebase.initializeApp(firebaseConfig);

// Inicializa as variáveis auth e database para facilitar o acesso aos serviços do Firebase
const auth = firebase.auth();
const database = firebase.database();

function displayFeedback(message, isError = false) {
    const feedbackContainer = document.getElementById('feedback');
    feedbackContainer.style.color = isError ? 'red' : 'green';
    feedbackContainer.innerText = message;
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password).then(function(userCredential) {
        const user = userCredential.user;

        database.ref("users/" + user.uid).update({ last_login: new Date().toString() });

        displayFeedback('User Logado!');
    })
    .catch(function(error) {
        displayFeedback("User não Logado! " + error.message, true);
    });
}

document.getElementById("loginButton").addEventListener('click', function() {
    login();
});

function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (validar_email(email) && validar_senha(password)) {
        auth.createUserWithEmailAndPassword(email, password).then(function(userCredential) {
            const user = userCredential.user;

            const user_data = {
                email: email,
                tempo_registrado: new Date().toString(),
            };

            database.ref("users/" + user.uid).set(user_data);

            displayFeedback("User criado");
        })
        .catch(function(error) {
            displayFeedback("Erro ao criar user! " + error.message, true);
        });
    } else {
        displayFeedback("Email ou senha inválidos", true);
    }
}

document.getElementById("registerButton").addEventListener("click", function() {
    register();
});

function validar_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

function validar_senha(password) {
    const re = /^(?=.*\d)(?=.*[A-Za-z])[0-9a-zA-Z]{6,}$/;
    return re.test(password);
}
