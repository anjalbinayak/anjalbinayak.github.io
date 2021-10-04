let contactFormSubject = document.querySelector("#contact-form-subject");
let contactFormMessage = document.querySelector("#contact-form-message");
let contactFormMessageBox = document.querySelector("#contact-form-messages");
let contactFormSendButton = document.querySelector("#contact-form-send");
function dynamicLink() {
  let subject = contactFormSubject.value;
  let message = contactFormMessage.value;
  let href = `mailto:anjaladhikari3@outlook.com?subject=${subject}&body=${message}`;
  contactFormSendButton.setAttribute("href", href);
}
contactFormSubject.addEventListener("keyup", dynamicLink);
contactFormMessage.addEventListener("keyup", dynamicLink);
