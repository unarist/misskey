<template>
<div class="mk-user-card">
	<header :style="user.bannerUrl ? `background-image: url(${user.bannerUrl}?thumbnail&size=1024)` : ''">
		<a :href="`/@${acct}`">
			<img :src="`${user.avatarUrl}?thumbnail&size=200`" alt="avatar"/>
		</a>
	</header>
	<a class="name" :href="`/@${acct}`" target="_blank">{{ user.name }}</a>
	<p class="username">@{{ acct }}</p>
	<mk-follow-button :user="user"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import getAcct from '../../../../../common/user/get-acct';

export default Vue.extend({
	props: ['user'],
	computed: {
		acct() {
			return getAcct(this.user);
		}
	}
});
</script>

<style lang="stylus" scoped>
.mk-user-card
	display inline-block
	width 200px
	text-align center
	border-radius 8px
	background #fff

	> header
		display block
		height 80px
		background-color #ddd
		background-size cover
		background-position center
		border-radius 8px 8px 0 0

		> a
			> img
				position absolute
				top 20px
				left calc(50% - 40px)
				width 80px
				height 80px
				border solid 2px #fff
				border-radius 8px

	> .name
		display block
		margin 24px 0 0 0
		font-size 16px
		color #555

	> .username
		margin 0
		font-size 15px
		color #ccc

	> .mk-follow-button
		display inline-block
		margin 8px 0 16px 0

</style>
