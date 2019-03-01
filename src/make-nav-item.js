export default (properties) => `
<a href="#${properties.name}"
  class="
    main-navigation__item
    ${properties.isActive ? `main-navigation__item--active` : ``}
    ${properties.isAdditional ? `main-navigation__item--additional` : ``}
  "
>
  ${properties.text}
  ${properties.hasCounter ? ` <span class="main-navigation__item-count">${properties.amount}</span>` : ``}
</a>`;
