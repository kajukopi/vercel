window.Siduru = class {
  constructor() {
    this.url = location.origin;
  }
  async get(path) {
    try {
      const response = await fetch(`${location.origin}/api/${path}`, {
        method: "GET",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async post(path, payload, type) {
    const config = { method: "POST" };

    switch (type) {
      case "json":
        try {
          config.headers = { "Content-Type": "application/json" };
          config.body = JSON.stringify(payload);
          console.log(config);
          const response = await fetch(`${location.origin}/api/${path}`, config);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error:", error);
        }
        break;
      case "multi":
        try {
          config.headers = { "Content-Type": "multipart/form-data" };
          config.body = payload;
          const response = await fetch(`${location.origin}/api/${path}`, config);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error:", error);
        }
        break;
      case "url":
        try {
          config.headers = { "Content-Type": "application/x-www-form-urlencoded" };
          config.body = payload;
          const response = await fetch(`${location.origin}/api/${path}`, config);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error:", error);
        }
        break;

      default:
        try {
          config.body = payload;
          const response = await fetch(`${location.origin}/api/${path}`, config);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error:", error);
        }
        break;
    }
  }

  async put(path, payload) {
    try {
      const response = await fetch(`${location.origin}/api/${path}`, {
        method: "PUT",
        body: payload,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async delete(path, id) {
    try {
      const response = await fetch(`${location.origin}/api/${path}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const sidenav = document.getElementById("sidenav");
const sidenavInstance = mdb.Sidenav.getInstance(sidenav);

let innerWidth = null;

const setMode = (e) => {
  // Check necessary for Android devices
  if (window.innerWidth === innerWidth) {
    return;
  }

  innerWidth = window.innerWidth;

  if (window.innerWidth < 1000) {
    sidenavInstance.changeMode("over");
    sidenavInstance.hide();
  } else {
    sidenavInstance.changeMode("side");
    sidenavInstance.show();
  }
};

setMode();

// Event listeners
window.addEventListener("resize", setMode);
const siduru = new Siduru();
async function callBackSignIn(payload) {
  siduru.post("page/signin", payload, "json").then((data) => {
    if (data.status === true) {
      location.reload();
    } else {
      alert(data.content);
    }
  });
}
