<template>
	<div>
		<h1>Shopping Cart Example</h1>
		<hr>
		<h2>Products</h2>
		<product-list></product-list>
		<hr>
		<cart></cart>
	</div>
</template>

<script>
import ProductList from '@components/Cart/ProductList';
import Cart from '@components/Cart/Cart';

export default {
	name: 'cart',
	components: { ProductList, Cart }
};
</script>
