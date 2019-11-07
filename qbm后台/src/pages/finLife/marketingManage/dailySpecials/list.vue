<template>
	<div class="">
		限时特卖
		<quill-editor :options="editorOption"></quill-editor>
	</div>
</template>

<script>

let Component = {
	name: 'dailySpecials',
	data () {
		return {
            editorOption: {
                // placeholder: '请输入商品介绍',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                    ],
                    /* syntax: {
                         highlight: text => hljs.highlightAuto(text).value
                     }*/
                }
            },
		};
	},
	mounted() {

	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>

</style>
