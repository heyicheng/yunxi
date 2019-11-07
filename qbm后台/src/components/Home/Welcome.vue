<template>
	<div class="welcom-wrap">
		<p class="welcom-tip">{{msg}}</p>
		<Row :gutter="16">
			<Col span="6">
				<Card :dis-hover="true" title="统计">
					<p>Content</p>
					<p>Content</p>
				</Card>
			</Col>
			<Col span="6">
				<Card :dis-hover="true" title="统计">
					<p>Content</p>
					<p>Content</p>
				</Card>
			</Col>
			<Col span="6">
				<Card :dis-hover="true" title="统计">
					<p>Content</p>
					<p>Content</p>
				</Card>
			</Col>
			<Col span="6">
				<Card :dis-hover="true" title="统计">
					<p>Content</p>
					<p>Content</p>
				</Card>
			</Col>
		</Row>
	</div>

</template>

<script>

let Component = {
	name: 'welcome',
	data () {
		return {
			msg: "欢迎使用钱保姆后台管理系统"
		};
	},
	mounted() {
		this.$http({
			method:'get',
			url:'http://test-activity.qbm360.com/worldcup/getGameList.html'
		}).then(res=>{
		    log(res)
		})
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	.welcom-wrap{
		width: 1200px;
		margin: 0 auto;
		.welcom-tip{
			padding-bottom: 20px;
		}
	}
</style>
