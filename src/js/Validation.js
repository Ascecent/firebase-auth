const expressions = {
    'email': /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

const form_controls = document.querySelectorAll('.form-control')

export const submitButton = document.getElementById("submitFormButton");

export const getInputs = (
    selector = "#login_form .form-control > input"
) => document.querySelectorAll(selector);

/**
 * Inicializa la validacion de los campos de un formulario
 * @param NodeList inputs Arreglo o NodeList que contiene todos los campos de tipo input
 * @param Object obj Objeto que contiene los nombres de los campos y su estado de validacion
 * @param NodeList selects Arreglo o Nodelist que contiene todos los campos de tipo select
 */
export function initValidation(
    inputs,
    obj,
    validationFunction = checkInputValidity,
) {
    submitButton.disabled = true;

    inputs.forEach((input) => {
        input.addEventListener('click', () => validationFunction(input, obj))
        input.addEventListener('input', () => validationFunction(input, obj))
    });
}

/**
 * Valida si el objeto usado para validar el formulario posee todas sus propiedades en true
 * @param Object obj Objeto que contiene los nombres de los campos y su estado de validacion
 * @return true|false
 */
export function checkValidityState(obj) {
    const objArr = Object.values(obj).filter((item) => item === false);
    return objArr.length == 0;
}

/**
 * Controla el estado del boton para enviar el formulario
 * @param Object obj Objeto que contiene los nombres de los campos y su estado de validacion
 */
export function handleSubmitButtonState(obj) {
    checkValidityState(obj) ? successBtnState() : errorBtnState();
}

/**
 * Valida y gestiona los estados de un input
 * @param HTMLElement target Elemento al que se aplicara la validacion
 * @param string regex Tipo de validacion que se realizara
 * @param Object obj Objeto usado para la validacion del formulario
 * @return true|false
 */
export function validateRegex(target, regex, obj) {
    if (expressions === undefined) return false;

    const validation =
        regex == "empty"
            ? !(target.value === "")
            : expressions[regex].test(target.value);

    handleInputState(target, validation, obj);
    return validation;
}

/**
 * Controla el estado de un input del formulario
 * @param HTMLElement target Elemento input del formulario
 * @param Boolean value Estado que se le asignara
 * @param string message Mensaje en caso de estado de error
 * @param Object obj Objeto que contiene los nombres de los campos y su estado de validacion
 * @return true|false
 */
export function handleInputState(target, value, obj) {
    if (typeof value !== "boolean") return false;

    const message = target.getAttribute("data-error-message");

    value ? setSuccess(target) : setError(target, message);
    handleValidityObject(target.name, value, obj);
    return true;
}

/**
 * Controla los estados de las propiedades del objeto de validacion
 * @param string field Nombre del campo
 * @param Boolean value Estado a asignar
 * @param Object obj Objeto que contiene los nombres de los campos y su estado de validacion
 */
export function handleValidityObject(field, value, obj) {
    if (!obj.hasOwnProperty(field) || typeof value != "boolean") return false;
    obj[field] = value;
    return true;
}

/**
 * Valida un campo
 * @param HTMLElement target Input a validar
 * @param Object obj Objeto usado para validacion
 */
function checkInputValidity(target, obj) {
    const val = target.getAttribute("data-validation");
    validateRegex(target, val, obj);
    handleSubmitButtonState(obj);
}

/**
 * Setea los estilos del estado de error en un input
 * @param HTMLElement input Input a estilar
 * @param string message Mensaje que se mostrara como feedback
 */
export function setError(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector(".error-message");

    small.innerText = message;
    formControl.className = "form-control error";
}

/**
 * Resetea todos los form controls de un formulario
 */
export function resetFormControls(obj) {
    form_controls.forEach((control) => {
        control.className = "form-control";
    });
    resetInputsCheck(obj);
    handleSubmitButtonState(obj)
}

// Disable all the fields
export function resetInputsCheck(obj) {
    for (const campo in obj) {
        obj[campo] = false;
    }
}

/**
 * Setea los estilos del estado validado en un input
 * @param HTMLElement input Input a estilar
 */
export function setSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
}

/**
 * Setea el estado validado en el boton para enviar el formulario
 */
function successBtnState() {
    submitButton.disabled = false;
    submitButton.classList.remove("disabled");
}

/**
 * Setea el estado de error en el boton para enviar el formulario
 */
export function errorBtnState() {
    submitButton.disabled = true;
    submitButton.classList.add("disabled");
}