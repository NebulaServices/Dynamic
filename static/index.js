async function worker() {
  return await navigator.serviceWorker.register("/sw.js", {
    scope: "/service",
  });
}
function isUrl(val = "") {
  if (
    /^http(s?):\/\//.test(val) ||
    (val.includes(".") && val.substr(0, 1) !== " ")
  )
    return true;
  return false;
}
const inpbox = document.getElementById("uform");

inpbox.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Connecting to service -> loading");

  if (typeof navigator.serviceWorker === "undefined")
    alert(
      "An error occured registering your service worker. Please contact support - discord.gg/unblocker"
    );
  form = document.querySelector("form");
  const formValue = document.querySelector("form input").value;
  if (!isUrl(formValue)) {
    location.href =
      form.action +
      "?url=https://www.google.com/search?q=" +
      encodeURIComponent(formValue);
  } else {
    location.href = form.action + "?url=" + encodeURIComponent(formValue);
  }
});

console.log("epicness ");
