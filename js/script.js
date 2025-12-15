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



