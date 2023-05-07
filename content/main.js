class Home {
	static start() {
		this.cache = {
			items: undefined,
			item: new Map(),
		};
		this.itemQuery = { ImageTypes: "Backdrop", EnableImageTypes: "Logo,Backdrop", IncludeItemTypes: "Movie,Series", SortBy: "ProductionYear, PremiereDate, SortName", Recursive: true, ImageTypeLimit: 1, Limit: 10, Fields: "ProductionYear", SortOrder: "Descending", EnableUserData: false, EnableTotalRecordCount: false };
		this.coverOptions = { type: "Backdrop", maxWidth: 3000 };
		this.logoOptions = { type: "Logo", maxWidth: 3000 };

		setInterval(() => {
			if (window.location.href.indexOf("!/home") != -1) {
				if ($(".view:not(.hide) .misty-banner").length == 0 && $(".misty-loading").length == 0) {
					this.initLoading();
				}
				if ($(".hide .misty-banner").length != 0) {
					$(".hide .misty-banner").remove();
					this.init();
				}
				if ($(".section0 .card").length != 0 && $(".view:not(.hide) .misty-banner").length == 0) {
					this.init();
				}
			}
		}, 100);
	}

	static async init() {
		// Beta
		$(".view:not(.hide)").attr("data-type", "home");
		// Loading
		const serverName = await this.injectCall("serverName", "");
		$(".misty-loading h1").text(serverName).addClass("active");
		// Banner
		await this.initBanner();
		this.initEvent();
	}

	/* 插入Loading */
	static initLoading() {
		const load = `
		<div class="misty-loading">
			<h1></h1>
			<div class="mdl-spinner"><div class="mdl-spinner__layer mdl-spinner__layer-1"><div class="mdl-spinner__circle-clipper mdl-spinner__left"><div class="mdl-spinner__circle mdl-spinner__circleLeft"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle mdl-spinner__circleRight"></div></div></div></div>
		</div>
		`;
		$("body").append(load);
	}

	static injectCode(code) {
		let hash = md5(code + Math.random().toString());
		return new Promise((resolve, reject) => {
			const channel = new BroadcastChannel(hash);
			channel.addEventListener("message", (event) => resolve(event.data));
			const script = `
			<script class="I${hash}">
				setTimeout(async ()=> {
					async function R${hash}(){${code}};
					const channel = new BroadcastChannel("${hash}");
					channel.postMessage(await R${hash}());
					document.querySelector("script.I${hash}").remove()
				}, 16)
			</script>
			`;
			$(document.head || document.documentElement).append(script);
		});
	}

	static injectCall(func, arg) {
		const script = `
		// const client = (await window.require(["ApiClient"]))[0];
		const client = await new Promise((resolve, reject) => {
			setInterval(() => {
				if (window.ApiClient != undefined) resolve(window.ApiClient);
			}, 16);
		});
		return await client.${func}(${arg})
		`;
		return this.injectCode(script);
	}

	static getItems(query) {
		if (this.cache.items == undefined) {
			this.cache.items = this.injectCall("getItems", "client.getCurrentUserId(), " + JSON.stringify(query));
		}
		return this.cache.items;
	}

	static async getItem(itemId) {
		// 双缓存 优先使用 WebStorage
		if (typeof Storage !== "undefined" && !localStorage.getItem("CACHE|" + itemId) && !this.cache.item.has(itemId)) {
			const data = JSON.stringify(await this.injectCall("getItem", `client.getCurrentUserId(), "${itemId}"`));
			if (typeof Storage !== "undefined") localStorage.setItem("CACHE|" + itemId, data);
			else this.cache.item.set(itemId, data);
		}
		return JSON.parse(typeof Storage !== "undefined" ? localStorage.getItem("CACHE|" + itemId) : this.cache.item.get(itemId));
	}

	static getImageUrl(itemId, options) {
		return this.injectCall("getImageUrl", itemId + ", " + JSON.stringify(options));
	}

	/* 插入Banner */
	static async initBanner() {
		const banner = `
		<div class="misty-banner">
			<div class="misty-banner-body">
			</div>
			<div class="misty-banner-library">
				<div class="misty-banner-logos"></div>
			</div>
		</div>
		`;
		$(".view:not(.hide) .homeSectionsContainer").prepend(banner);
		$(".view:not(.hide) .section0").detach().appendTo(".view:not(.hide) .misty-banner-library");

		// 插入数据
		const data = await this.getItems(this.itemQuery);
		console.log(data);
		data.Items.forEach(async (item) => {
			const detail = await this.getItem(item.Id),
				itemHtml = `
			<div class="misty-banner-item" id="${detail.Id}">
				<img draggable="false" loading="eager" decoding="async" class="misty-banner-cover" src="${await this.getImageUrl(detail.Id, this.coverOptions)}" alt="Backdrop" style="">
				<div class="misty-banner-info padded-left padded-right">
					<h1>${detail.Name}</h1>
					<div><p>${detail.Overview}</p></div>
					<div><button onclick="appRouter.showItem('${detail.Id}')">MORE</button></div>
				</div>
			</div>
			`,
				logoHtml = `
			<img id="${detail.Id}" draggable="false" loading="auto" decoding="lazy" class="misty-banner-logo" data-banner="img-title" alt="Logo" src="${await this.getImageUrl(detail.Id, this.logoOptions)}">
			`;
			if (detail.ImageTags && detail.ImageTags.Logo) {
				$(".misty-banner-logos").append(logoHtml);
			}
			$(".misty-banner-body").append(itemHtml);
			console.log(item.Id, detail);
		});

		let complete = 0;
		let loading = setInterval(async () => {
			// 判断图片加载完毕
			$(".misty-banner-cover:not(.complete)").each((i, dom) => {
				if (dom.complete) {
					dom.classList.add("complete");
					complete++;
				}
			});
			if (complete == $(".misty-banner-item").length && $(".misty-banner-item").length != 0) {
				clearInterval(loading);
				$(".misty-loading").fadeOut(500, () => $(".misty-loading").remove());
				await CommonUtils.sleep(150);
				// 置入场动画
				let delay = 80; // 动媒体库画间隔
				let id = $(".misty-banner-item").eq(0).addClass("active").attr("id"); // 初次信息动画
				$(`.misty-banner-logo[id=${id}]`).addClass("active");

				await CommonUtils.sleep(200); // 间隔动画
				$(".section0 > div").addClass("misty-banner-library-overflow"); // 关闭overflow 防止媒体库动画溢出
				$(".misty-banner .card").each((i, dom) => setTimeout(() => $(dom).addClass("misty-banner-library-show"), i * delay)); // 媒体库动画
				await CommonUtils.sleep(delay * 8 + 1000); // 等待媒体库动画完毕
				$(".section0 > div").removeClass("misty-banner-library-overflow"); // 开启overflow 防止无法滚动

				// 滚屏逻辑
				var index = 0;
				clearInterval(this.bannerInterval);
				this.bannerInterval = setInterval(async () => {
					// 背景切换
					index += index + 1 == $(".misty-banner-item").length ? -index : 1;
					$(".misty-banner-body").css("left", -(index * 100).toString() + "%");
					// 信息切换
					$(".misty-banner-item.active").removeClass("active");
					let id = $(".misty-banner-item").eq(index).addClass("active").attr("id");
					// LOGO切换
					$(".misty-banner-logo.active").removeClass("active");
					$(`.misty-banner-logo[id=${id}]`).addClass("active");
				}, 8000);
			}
		}, 16);
	}

	/* 初始事件 */
	static initEvent() {
		// 通过注入方式, 方可调用appRouter函数, 以解决Content-Script window对象不同步问题
		const script = `
		// 挂载appRouter
		if (!window.appRouter) window.appRouter = (await window.require(["appRouter"]))[0];
		// 修复library事件参数
		const serverId = ApiClient._serverInfo.Id,
			librarys = document.querySelectorAll(".view:not(.hide) .section0 .card");
		librarys.forEach(library => {
			library.setAttribute("data-serverid", serverId);
			library.setAttribute("data-type", "CollectionFolder");
		});
		`;
		this.injectCode(script);
	}
}

// 运行
if ($("meta[name=application-name]").attr("content") == "Emby" || $(".accent-emby") != undefined) {
	Home.start();
}
