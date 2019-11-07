import * as types from './types';
import url from '@util/url';
// initial state
// shape: [{ id, quantity }]
const state = {
    added: [],
    checkoutStatus: null,
    all: [],
    msg: ''
};

// getters
const getters = {
    checkoutStatus: state => state.checkoutStatus,
    cartProducts: state => {
        return state.added.map(({
            id,
            quantity
        }) => {
            const product = state.all.find(p => p.id === id);
            return {
                title: product.title,
                price: product.price,
                quantity
            };
        });
    },
    allProducts: state => state.all,
    getMsg: state => state.msg
};

function buyProducts(products, cb, errorCb) {
    setTimeout(() => {
        // simulate random checkout failure.
        (Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1) ? cb(): errorCb();
    }, 100);
};

// actions
const actions = {
    checkout({ commit, state }, products) {
        const savedCartItems = [...state.added];
        commit(types.CHECKOUT_REQUEST);
        buyProducts(
            products,
            () => commit(types.CHECKOUT_SUCCESS),
            () => commit(types.CHECKOUT_FAILURE, {
                savedCartItems
            })
        );
    },
    getAllProducts({ commit }) {
        fetch(`${url.webUrl}/products`).then(function(response) {
            return response.json();
        }).then(function(data) {
            commit(types.RECEIVE_PRODUCTS, {
                data
            });
        });
    },
    addToCart({ commit }, product) {
        if (product.inventory > 0) {
            commit(types.ADD_TO_CART, {
                id: product.id
            });
        }
    },
};

// mutations
const mutations = {
    [types.ADD_TO_CART](state, {
        id
    }) {
        state.lastCheckout = null;
        state.all.find(p => p.id === id).inventory--;
        const record = state.added.find(p => p.id === id);
        if (!record) {
            state.added.push({
                id,
                quantity: 1
            });
        } else {
            record.quantity++;
        }
    },

    [types.CHECKOUT_REQUEST](state) {
        // clear cart
        state.added = [];
        state.checkoutStatus = null;
    },

    [types.CHECKOUT_SUCCESS](state) {
        state.checkoutStatus = 'successful';
    },

    [types.CHECKOUT_FAILURE](state, {
        savedCartItems
    }) {
        // rollback to the cart saved before sending the request
        state.added = savedCartItems;
        state.checkoutStatus = 'failed';
    },

    [types.RECEIVE_PRODUCTS](state, {
        data
    }) {
        state.all = data;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};
