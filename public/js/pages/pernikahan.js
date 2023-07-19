const stepper = new mdb.Stepper(document.getElementById("stepper-form"));
const form = document.querySelector("#form-pernikahan");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  formData.append("filewanita", form.querySelector("#file-wanita").files[0]);
  formData.append("filepria", form.querySelector("#file-pria").files[0]);
  form.querySelector("#galeri").files.forEach((file) => {
    formData.append("galeri", file);
  });
  siduru
    .post("upload/" + form.dataset.subId, formData)
    .then((content) => {
      console.log(content);
      form.reset();
      Storage.remove("data-pernikahan");
    })
    .catch((error) => {
      console.log(error);
    });
});

function getFormData() {
  const form = document.querySelector("#form-pernikahan");
  const formData = new FormData(form);
  Storage.set("data-pernikahan", Object.fromEntries(formData));
}

const data = Storage.get("data-pernikahan");
if (data) {
  for (const [key, val] of Object.entries(data)) {
    if (key !== "filewanita" && key !== "filepria" && key !== "galeri") {
      document.querySelector(`[name="${key}"]`).value = val;
    }
  }
  document.querySelectorAll(".form-outline").forEach((formOutline) => {
    new mdb.Input(formOutline).init();
  });
}

document.getElementById("form-next-step").addEventListener("click", () => {
  stepper.nextStep();
  getFormData();
});

document.getElementById("form-prev-step").addEventListener("click", () => {
  stepper.previousStep();
  getFormData();
});
