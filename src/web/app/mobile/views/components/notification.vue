<template>
<div class="mk-notification">
	<div class="notification reaction" v-if="notification.type == 'reaction'">
		<mk-time :time="notification.createdAt"/>
		<router-link class="avatar-anchor" :to="`/@${acct}`">
			<img class="avatar" :src="`${notification.user.avatarUrl}?thumbnail&size=64`" alt="avatar"/>
		</router-link>
		<div class="text">
			<p>
				<mk-reaction-icon :reaction="notification.reaction"/>
				<router-link :to="`/@${acct}`">{{ notification.user.name }}</router-link>
			</p>
			<router-link class="post-ref" :to="`/@${acct}/${notification.post.id}`">
				%fa:quote-left%{{ getPostSummary(notification.post) }}
				%fa:quote-right%
			</router-link>
		</div>
	</div>

	<div class="notification repost" v-if="notification.type == 'repost'">
		<mk-time :time="notification.createdAt"/>
		<router-link class="avatar-anchor" :to="`/@${acct}`">
			<img class="avatar" :src="`${notification.post.user.avatarUrl}?thumbnail&size=64`" alt="avatar"/>
		</router-link>
		<div class="text">
			<p>
				%fa:retweet%
				<router-link :to="`/@${acct}`">{{ notification.post.user.name }}</router-link>
			</p>
			<router-link class="post-ref" :to="`/@${acct}/${notification.post.id}`">
				%fa:quote-left%{{ getPostSummary(notification.post.repost) }}%fa:quote-right%
			</router-link>
		</div>
	</div>

	<template v-if="notification.type == 'quote'">
		<mk-post :post="notification.post"/>
	</template>

	<div class="notification follow" v-if="notification.type == 'follow'">
		<mk-time :time="notification.createdAt"/>
		<router-link class="avatar-anchor" :to="`/@${acct}`">
			<img class="avatar" :src="`${notification.user.avatarUrl}?thumbnail&size=64`" alt="avatar"/>
		</router-link>
		<div class="text">
			<p>
				%fa:user-plus%
				<router-link :to="`/@${acct}`">{{ notification.user.name }}</router-link>
			</p>
		</div>
	</div>

	<template v-if="notification.type == 'reply'">
		<mk-post :post="notification.post"/>
	</template>

	<template v-if="notification.type == 'mention'">
		<mk-post :post="notification.post"/>
	</template>

	<div class="notification poll_vote" v-if="notification.type == 'poll_vote'">
		<mk-time :time="notification.createdAt"/>
		<router-link class="avatar-anchor" :to="`/@${acct}`">
			<img class="avatar" :src="`${notification.user.avatarUrl}?thumbnail&size=64`" alt="avatar"/>
		</router-link>
		<div class="text">
			<p>
				%fa:chart-pie%
				<router-link :to="`/@${acct}`">{{ notification.user.name }}</router-link>
			</p>
			<router-link class="post-ref" :to="`/@${acct}/${notification.post.id}`">
				%fa:quote-left%{{ getPostSummary(notification.post) }}%fa:quote-right%
			</router-link>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import getPostSummary from '../../../../../common/get-post-summary';
import getAcct from '../../../../../common/user/get-acct';

export default Vue.extend({
	props: ['notification'],
	computed: {
		acct() {
			return getAcct(this.notification.user);
		}
	},
	data() {
		return {
			getPostSummary
		};
	}
});
</script>

<style lang="stylus" scoped>
.mk-notification

	> .notification
		padding 16px
		overflow-wrap break-word

		&:after
			content ""
			display block
			clear both

		> .mk-time
			display inline
			position absolute
			top 16px
			right 12px
			vertical-align top
			color rgba(0, 0, 0, 0.6)
			font-size 0.9em

		> .avatar-anchor
			display block
			float left

			img
				min-width 36px
				min-height 36px
				max-width 36px
				max-height 36px
				border-radius 6px

		> .text
			float right
			width calc(100% - 36px)
			padding-left 8px

			p
				margin 0

				i, .mk-reaction-icon
					margin-right 4px

			> .post-preview
				color rgba(0, 0, 0, 0.7)

			> .post-ref
				color rgba(0, 0, 0, 0.7)

				[data-fa]
					font-size 1em
					font-weight normal
					font-style normal
					display inline-block
					margin-right 3px

		&.repost
			.text p i
				color #77B255

		&.follow
			.text p i
				color #53c7ce

</style>

