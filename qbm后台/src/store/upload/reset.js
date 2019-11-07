const state={
    is_reset:1
};
const getters={};

const mutations={
    mutaIs_reset(state,payload){
        state.is_reset+=1;
    },
};
const actions= {
    asynIs_reset(context, payload) {
        context.commit('mutaIs_reset', payload);
    },
};
// const
export default {
    state,
    getters,
    actions,
    mutations
};
