<template>
	<ul>
		<li v-for="p in products">
			{{ p.title }} - {{ p.price | currency }}
			<br>
			<Button
				:disabled="!p.inventory"
				@click="addToCart(p)">
				Add to cart
			</Button>
		</li>
		<p>{{$url.webUrl}}</p>
	</ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	data(){
		return {
			$url: this.$url
		};
	},
	computed: mapGetters({
		products: 'allProducts'
	}),
	methods:mapActions([
		'addToCart'
	]),
	created () {

		this.$store.dispatch('getAllProducts');
	}
};
</script>
