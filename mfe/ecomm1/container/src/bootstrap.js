// import 'products/ProductsIndex'; // step 7
import { mount as productsMount } from 'products/ProductsIndex';
// import 'cart/CartShow'; // this alias is found in cart directory's webpack.config.js
import { mount as cartMount } from 'cart/CartShow';


console.log('Container!');

productsMount(document.querySelector('#my-products'));
cartMount(document.querySelector('#my-cart'));