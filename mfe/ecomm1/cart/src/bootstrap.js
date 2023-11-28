import faker from 'faker';

const mount = (el) => {
  const cartText = `<h1>Cart</h1><div>You have ${faker.random.number()} items in your cart</div>`;

  el.innerHTML = cartText;
};

if (process.env.NODE_ENV === 'development') {
  const el = document.querySelector('#dev-cart');

  if (el) {
    mount(el);
  }
}

export { mount };
