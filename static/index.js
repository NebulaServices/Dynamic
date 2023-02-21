document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  await worker();

  location.href = document.querySelector('form').action+'?url='+encodeURIComponent(document.querySelector('form input').value);
})

async function worker() {
  return await navigator.serviceWorker.register('/sw.js', {scope: '/service'});
}