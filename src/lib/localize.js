import moment from 'moment-timezone';
import { dateFormat } from './constants';

let org = window.org || {};
export const localize = {
	t: (text) => {
		return text;
	},
	replace: (text) => {
		return text;
	},
	displayPartnerText: (orgType, text) => {
		return text;
	},
	date: (val) => {
		let mm = val.date ? moment(val.date) : moment(val);
		return mm.tz(org.region?.zone || 'UTC').format(dateFormat)
	}
}

