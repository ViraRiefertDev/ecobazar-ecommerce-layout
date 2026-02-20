// Строгий режим
"use strict"

//Коли все буде завантажено
window.addEventListener('load', windowLoad)

let isMobile

function deactivateActiveMenuItem(exceptElement=null){
  const menuItemActive = document.querySelector('.menu__item.--active')
      if(menuItemActive && menuItemActive !== exceptElement){
        menuItemActive.classList.remove('--active')
      }
}

function windowLoad(){
  isMobile = window.navigator.userAgentData.mobile || false
  isMobile ? document.body.setAttribute('data-touch','') : null

  document.addEventListener('click', documentActions)

  //перевіряємо наявність дата атрибуту data-countdown (або атрибутів якщо декілька таймерів на сторінці), 
  // якщо є хоча б один, то йдемо в функцію initCountdowns
  const countdowns = document.querySelectorAll('[data-countdown]')
  countdowns.length ? initCountdowns(countdowns):null

  dynamicAdaptHeader();

}

function dynamicAdaptHeader(){
  const topHeader = document.querySelector('.top-header')
  const menu = document.querySelector('.menu')
  const header = document.querySelector('.header')

  const phoneHeader = document.querySelector('.bottom-header__phone')
  const searchHeader = document.querySelector('.search-header')

  const bottomContainer = document.querySelector('.bottom-header__container')
  const actionsHeader = document.querySelector('.actions-header') 
  const placeSearch = document.querySelector('.body-header__place-search') 

  //динамічний адаптив
  //будуємо подію медіазапит mathMedia - це як @media в CSS
  const media = window.matchMedia("(max-width: 767.98px)")
  media.addEventListener('change',(e)=>dynamicAdaptHeaderInit(e))
  //викликаємо функцію відразу, щоб при завантаженні вона також спрацювала
  dynamicAdaptHeaderInit(media)

  function dynamicAdaptHeaderInit(media){
    if(media.matches){
      //перебудовуваємо
      bottomContainer.insertAdjacentElement('beforeend', searchHeader)
      actionsHeader.insertAdjacentElement('beforeend', phoneHeader)
      menu.insertAdjacentElement('beforeend', topHeader)
    }else{ 
      //повертаємо назад
      bottomContainer.insertAdjacentElement('beforeend', phoneHeader)
      placeSearch.insertAdjacentElement('beforeend', searchHeader)
      header.insertAdjacentElement('afterbegin', topHeader)
    }
    searchHeader.classList.toggle('--dynamic',media.matches)
    phoneHeader.classList.toggle('--dynamic',media.matches)
  }
}

function documentActions(e){
  const targetElement = e.target
  //Якщо користувач зайшов з мобілки і клікнув на меню button
  if(isMobile){
    const menuButton=targetElement.closest('.menu__button')
    if(menuButton){
      const currentElement = menuButton.closest('.menu__item')
      //закриваємо сабменю якщо це не поточний
      deactivateActiveMenuItem(currentElement)
      const subMenu = menuButton.nextElementSibling
      if(subMenu){
        currentElement.classList.toggle('--active')
      }
    }else{
      //клік за межами кнопки, закриваємо сабменю якщо відкрито
      deactivateActiveMenuItem()
    }
  }
  if(targetElement.closest('.icon-menu')){
    document.body.classList.toggle('scroll-lock')
    document.documentElement.classList.toggle('open-menu');
  }
}

//ця функція лише запускає всі таймери що знайшлись в коллекції countdowns
function initCountdowns(countdowns){
  countdowns.forEach(countdownItem=>{
    initCountdownItem(countdownItem)
  })
}

function initCountdownItem(countdownItem){
  //дістаємо строку дати/часу з data-countdown у елемента
  //На приклад: <div data-countdown="2026-03-23T00:00:00">
  const goalString = countdownItem.dataset.countdown 

  //якщо дата не задана - виходимо з функції і нічого не робимо
  if(!goalString) return

  //Знаходимо всі 4 span, куди будемо виводити: дні, часи, хвилини, секунди
    const countdownItemSpans = countdownItem.querySelectorAll('.countdown__digits span')

  // перетворюємо строку дати в timestamp (мілісекунди до 1970)
  const goalMs = Date.parse(goalString)

  // якщо дата погано розпарсилась виходимо
  if(Number.isNaN(goalMs)) return

  // якщо на елементі вже є запущений інтервал - зупиняємо його
  // щоб не було двух таймерів одночасно
  if(countdownItem._countdownIntervalId){
    clearInterval(countdownItem._countdownIntervalId)
  }

  //функція, яка оновлює числа на екрані
  //будемо визивати її одразу, а потім кожну секунду
  const tick = ()=>{
    const nowMs = Date.now()
    let diffMs = goalMs - nowMs
    if(diffMs<=0) diffMs = 0

    //Рахуємо кількість повних днів з diffMs
    // 1000ms * 60 = 1 мин, *60 = 1 час, *24 = 1 день
    const days = Math.floor(diffMs/(1000*60*60*24))

    //прибираэмо з залишку повні дні
    diffMs -= days*(1000*60*60*24)

    //із залишку рахуємо повні години
    const hours = Math.floor(diffMs / (1000 * 60 * 60))

    //прибираємо повні години
    diffMs -= hours*(1000*60*60)

    //із залишка рахуємо повні хвилини
    const minutes = Math.floor(diffMs / (1000*60))

    //прибираємо повні хвилини
    diffMs -= minutes *(1000 * 60)

    //рахуємо повні секунди
    const seconds = Math.floor(diffMs / 1000)

    //функція форматування: робить 2 знаки(05 замість 5)
    const pad2 = (n)=>String(n).padStart(2,'0')

    countdownItemSpans[0].innerText = days
    countdownItemSpans[1].innerText = pad2(hours)
    countdownItemSpans[2].innerText = pad2(minutes)
    countdownItemSpans[3].innerText = pad2(seconds)

    //Якщо diff вже 0, таймер дійшов до кінця
    // зупинаяємо інтервал
    if(goalMs <= nowMs){
      clearInterval(countdownItem._countdownIntervalId)
      countdownItem._countdownIntervalId = null
    }
  }

  tick()

  countdownItem._countdownIntervalId = setInterval(tick, 1000);
  console.log(countdownItem)
}