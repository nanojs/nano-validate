/*
 *  nano Validate plugin v1.0
 *  http://nanojs.org/plugins/validate
 *
 *  Copyright (c) 2008-2015 James Watts
 *  https://github.com/jameswatts
 *
 *  This is FREE software, licensed under the GPL
 *  http://www.gnu.org/licenses/gpl.html
 */

if (nano) {
	nano.plugin({
		validate: function _validate(type, mode, min, max) {
			return nano.validate(this, type, mode, min, max);
		}
	},
	function() {
		this.validate = function _validate(node, type, mode, min, max) {
			var value = node.get();
			switch (type) {
				case 'url':
					return (/^(http|ftp)(s)?:\/\/\w+(\.\w+)*(-\w+)?\.([a-z]{2,7}(\.[a-z]{2,7}|))(:\d{2,5})?(\/)?((\/).+)?$/.test(value)
						|| (typeof value === 'string'
						&& ((nano.isset(min) && value.length < min)
						|| (nano.isset(max) && value.length > max))));
				case 'email':
					return (/^([\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i.test(value)
						|| (typeof value === 'string'
						&& ((nano.isset(min) && value.length < min)
						|| (nano.isset(max) && value.length > max))));
				case 'date':
					var check = '/^([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1])\/([1-9]|0[1-9]|1[1-2])\/\d{4}$/';
					if (typeof mode === 'string') {
						mode = mode.toLowerCase()
							.replace(/\//, '\/')
							.replace(/\-/, '\-')
							.replace(/dd/, '([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-1])')
							.replace(/mm/, '([1-9]|0[1-9]|1[1-2])');
						check = (mode.indexOf('yyyy') !== -1)? mode.replace(/yyyy/, '\\d{4}') : mode.replace(/yy/, '\\d{2}');
					}
					return new RegExp('^' + check + '$', 'i').test(value);
				case 'time':
					var check = '/^([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])\:([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])$/';
					if (typeof mode === 'string') {
						check = mode.toLowerCase()
							.replace(/\:/, '\:')
							.replace(/hh/, '([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])')
							.replace(/mm/, '([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])')
							.replace(/ss/, '([1-9]|0[1-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])');
					}
					return new RegExp('^' + check + '$', 'i').test(value);
				case 'password':
					if (mode) {
						if (!nano.isset(value)
							|| /\s/.test(value)
							|| !/\d+/.test(value)
							|| !/[a-z]+/.test(value)
							|| !/[A-Z]+/.test(value)
							|| !/\W+/.test(value)
							|| value === ''
							|| value === '0'
							|| value === 0
							|| value === false
							|| (typeof value === 'string'
							&& ((nano.isset(min) && value.length < min)
							|| (nano.isset(max) && value.length > max)))) {
							return false;
						}
					} else if (!nano.isset(value)
						|| /\s/.test(value)
						|| !/\d+/.test(value)
						|| !/[a-z]+/.test(value)
						|| !/[A-Z]+/.test(value)
						|| value === ''
						|| value === '0'
						|| value === 0
						|| value === false
						|| (typeof value === 'string'
						&& ((nano.isset(min) && value.length < min)
						|| (nano.isset(max) && value.length > max)))) {
						return false;
					}
					return true;
				case 'number':
					return (typeof value !== 'number'
						|| isNaN(value)
						|| ((nano.isset(min) && value < min)
						|| (nano.isset(max) && value > max)))? false : true;
				case 'string':
					return (typeof value !== 'string'
						|| value === ''
						|| /^\s+$/.test(value)
						|| (nano.isset(mode)
						&& ((nano.type(mode) === 'regexp'
						&& !mode.test(value))
						|| (typeof mode === 'string'
						&& value !== mode)))
						|| ((nano.isset(min) && value.length < min)
						|| (nano.isset(max) && value.length > max)))? false : true;
				case 'object':
					return (nano.type(value) !== 'object'
						|| (nano.isset(mode)
						&& !nano.isset(value[mode]))
						|| ((nano.isset(min) && nano.count(value) < min)
						|| (nano.isset(max) && nano.count(value) > max)))? false : true;
				case 'array':
					return (nano.type(value) !== 'array'
						|| ((nano.isset(min) && value.length < min)
						|| (nano.isset(max) && value.length > max)))? false : true;
				default:
					return (!nano.isset(value)
						|| value === ''
						|| value === '0'
						|| value === 0
						|| value === false
						|| (typeof value === 'number'
						&& ((nano.isset(min) && value < min)
						|| (nano.isset(max) && value > max)))
						|| (typeof value === 'string'
						&& ((nano.isset(min) && value.length < min)
						|| (nano.isset(max) && value.length > max))))? false : true;
			}
		};
	});
}
