class CommonUtils {
	static selectWait(selector, func, times, interval) {
		var _times = times || 100, //100次
			_interval = interval || 500, //20毫秒每次
			_jquery = null,
			_iIntervalID;

		_iIntervalID = setInterval(() => {
			if (!_times) {
				clearInterval(_iIntervalID);
			}
			_times <= 0 || _times--;
			_jquery = $(selector);
			if (_jquery.length) {
				func && func.call(func);
				clearInterval(_iIntervalID);
			}
		}, _interval);
		return this;
	}

	static selectNotWait(selector, func, interval) {
		let _jquery,
			_interval = interval || 20,
			_iIntervalID;

		_iIntervalID = setInterval(() => {
			_jquery = $(selector);
			if (_jquery.length < 1) {
				func && func.call(func);
				clearInterval(_iIntervalID);
			}
		}, _interval);
	}

	static copyText(value, cb) {
		const textarea = document.createElement("textarea");
		textarea.readOnly = "readonly";
		textarea.style.position = "absolute";
		textarea.style.left = "-9999px";
		textarea.value = value;
		document.body.appendChild(textarea);
		textarea.select();
		textarea.setSelectionRange(0, textarea.value.length);
		document.execCommand("Copy");
		document.body.removeChild(textarea);
		if (cb && Object.prototype.toString.call(cb) === "[object Function]") {
			cb();
		}
	}

	/**
	 * 休眠
	 * @param {number} ms 休眠多少毫秒
	 */
	static sleep(ms) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("完成");
			}, ms);
		});
	}
}
