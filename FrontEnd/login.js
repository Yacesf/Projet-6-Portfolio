const buttonLogin = document.getElementById("login");
const caseEmail = document.querySelector("#email");
const casePassword = document.querySelector("#password");
const errorLogin = document.querySelector("#error-login");

const loginUser = async (email, password) => {
  const user = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      return result;
    } else if (response.status === 401 || response.status === 404) {
      throw new Error("Erreur dans l’identifiant ou le mot de passe");
    } else {
      throw new Error("Une erreur inattendue s'est produite");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function loginResult(e) {
  e.preventDefault();
  try {
    const result = await loginUser(caseEmail.value, casePassword.value);
    localStorage.setItem("token", result.token);
    window.location.href = "index.html";
    localStorage.setItem("isLoggedOut", false);
  } catch (error) {
    errorLogin.innerHTML = error.message;
  }
}

buttonLogin.addEventListener("click", loginResult);