'use strict';
class Modal {

  constructor() {
    this.triggers = document.querySelectorAll('.js-modal');
    this.close = document.querySelectorAll('.js-close-modal');
    this.modals = document.querySelectorAll('.modal');
    this.modalInners = document.querySelectorAll('.modal-inner');

    this.listeners();
  }

  listeners() {
    window.addEventListener('keydown', this.keyDown);

    this.triggers.forEach(el => {
      el.addEventListener('click', this.openModal, false);
    });

    this.modals.forEach(el => {
      el.addEventListener('transitionend', this.revealModal, false);
      el.addEventListener('click', this.backdropClose, false);
    });

    this.close.forEach(el => {
      el.addEventListener('click', Modal.hideModal, false);
    });

    this.modalInners.forEach(el => {
      el.addEventListener('transitionend', this.closeModal, false);
    });
  }

  keyDown(e) {
    if (27 === e.keyCode && document.body.classList.contains('modal-body')) {
      Modal.hideModal();
    }
  }

  backdropClose(el) {
    if (!el.target.classList.contains('modal-visible')) {
      return;
    }

    let backdrop = el.currentTarget.dataset.backdrop !== undefined ? el.currentTarget.dataset.backdrop : true;

    if (backdrop === true) {
      Modal.hideModal();
    }
  }

  static hideModal() {
    let modalOpen = document.querySelector('.modal.modal-visible');

    modalOpen.querySelector('.modal-inner').classList.remove('modal-reveal');
    document.querySelector('.modal-body').addEventListener('transitionend', Modal.modalBody, false);
    document.body.classList.add('modal-fadeOut');
  }

  closeModal(el) {
    if ('opacity' === el.propertyName && !el.target.classList.contains('modal-reveal')) {
      document.querySelector('.modal.modal-visible').classList.remove('modal-visible');
    }
  }

  openModal(el) {
    if (!el.currentTarget.dataset.modal) {
      console.error('No data-modal attribute defined!');
      return;
    }

    let modalID = el.currentTarget.dataset.modal;
    let modal = document.getElementById(modalID);

    document.body.classList.add('modal-body');
    modal.classList.add('modal-visible');
  }

  revealModal(el) {
    if ('opacity' === el.propertyName && el.target.classList.contains('modal-visible')) {
      el.target.querySelector('.modal-inner').classList.add('modal-reveal');
    }
  }

  static modalBody(el) {
    if ('opacity' === el.propertyName && el.target.classList.contains('modal') && !el.target.classList.contains('modal-visible')) {
      document.body.classList.remove('modal-body', 'modal-fadeOut');
    }
  }}
new Modal();

window.addEventListener('DOMContentLoaded', function (){
  
const versionInd = document.getElementById('settings-version')
const xhr = new XMLHttpRequest();
xhr.open("GET", '/info');
xhr.send();
xhr.responseType = "json";
xhr.onload = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    const response = xhr.response;
    versionInd.innerHTML = `Dynamic v${response.version} <span id='hashHover'> (${response.hashShort}) </span> `
    const hashHover = document.getElementById('hashHover')
    hashHover.onclick = function displayFullHash(){
      console.log('cool')
    hashHover.innerText = `(${response.hash})`
    hashHover.style.fontSize = `10px`
  }
  } else {
    versionInd.innerText = 'Unable to get version'
  }
};

})

