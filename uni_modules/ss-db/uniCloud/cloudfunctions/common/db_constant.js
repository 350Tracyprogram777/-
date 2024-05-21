const db = uniCloud.database()
const db_user = db.collection('uni-id-users')
const db_address_book = db.collection('address-book')
const db_house_rent = db.collection('house-rent')
const db_report_center = db.collection('report-center')
const db_user_media = db.collection('user-media')
const uniID = require('uni-id-common')

const {
	getAccessToken,
	setAccessToken,
	removeAccessToken
} = require('uni-open-bridge-common')
const key_dcloudAppid_platform = {
	dcloudAppid: '__UNI__C22E2CC',
	platform: 'weixin-mp'
}
const dmb=db.command
const $=db.command.aggregate
module.exports = {
	db_user,
	db_address_book,
	db_house_rent,
	db_user_media,
	key_dcloudAppid_platform,
	getAccessToken,
	dmb
}
