export default (name, isActive, isAdditional, textContent, hasCounter, amount) => `
<a href="#${name}"
  class="
    main-navigation__item
    ${isActive ? `main-navigation__item--active` : ``}
    ${isAdditional ? `main-navigation__item--additional` : ``}
  "
>
  ${textContent}
  ${hasCounter ? ` <span class="main-navigation__item-count">${amount}</span>` : ``}
</a>`;
