import faker from 'faker';

const cartText = `<h1>cart</h1><div>You have ${faker.random.number()} items in your cart</div>`;

document.querySelector('#dev-cart').innerHTML = cartText;
