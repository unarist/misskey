/**
 * Module dependencies
 */
import $ from 'cafy';
import Channel from '../../models/channel';
import Watching from '../../models/channel-watching';

/**
 * Watch a channel
 *
 * @param {any} params
 * @param {any} user
 * @return {Promise<any>}
 */
module.exports = (params, user) => new Promise(async (res, rej) => {
	// Get 'channelId' parameter
	const [channelId, channelIdErr] = $(params.channelId).id().$;
	if (channelIdErr) return rej('invalid channelId param');

	//#region Fetch channel
	const channel = await Channel.findOne({
		_id: channelId
	});

	if (channel === null) {
		return rej('channel not found');
	}
	//#endregion

	//#region Check whether already watching
	const exist = await Watching.findOne({
		userId: user._id,
		channelId: channel._id,
		deletedAt: { $exists: false }
	});

	if (exist !== null) {
		return rej('already watching');
	}
	//#endregion

	// Create Watching
	await Watching.insert({
		createdAt: new Date(),
		userId: user._id,
		channelId: channel._id
	});

	// Send response
	res();

	// Increment watching count
	Channel.update(channel._id, {
		$inc: {
			watchingCount: 1
		}
	});
});
