class Home {
	static start() {
		this.cache = {
			items: undefined,
			item: new Map(),
		};
		this.itemQuery = { ImageTypes: "Backdrop", EnableImageTypes: "Logo,Backdrop", IncludeItemTypes: "Movie,Series", SortBy: "ProductionYear, PremiereDate, SortName", Recursive: true, ImageTypeLimit: 1, Limit: 10, Fields: "ProductionYear", SortOrder: "Descending", EnableUserData: false, EnableTotalRecordCount: false };
		this.coverOptions = { type: "Backdrop", maxWidth: 3000 };
		this.logoOptions = { type: "Logo", maxWidth: 3000 };
		this.initStart = false;
		setInterval(() => {
			if (window.location.href.indexOf("!/home") != -1) {
				if ($(".view:not(.hide) .misty-banner").length == 0 && $(".misty-loading").length == 0) {
					this.initStart = false;
					this.initLoading();
				}
				if ($(".hide .misty-banner").length != 0) {
					$(".hide .misty-banner").remove();
				}
				if (!this.initStart && $(".section0 .card").length != 0 && $(".view:not(.hide) .misty-banner").length == 0) {
					this.initStart = true;
					this.init();
				}
			}
		}, 233);
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
		// Popup
		this.initPopup();
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
			if ("BroadcastChannel" in window) {
				const channel = new BroadcastChannel(hash);
				channel.addEventListener("message", (event) => resolve(event.data));
			} else if ("postMessage" in window) {
				window.addEventListener("message", (event) => {
					if (event.data.channel === hash) {
						resolve(event.data.message);
					}
				});
			}
			const script = `
			<script class="I${hash}">
				setTimeout(async ()=> {
					async function R${hash}(){${code}};
					if ("BroadcastChannel" in window) {
						const channel = new BroadcastChannel("${hash}");
						channel.postMessage(await R${hash}());
					} else if ('postMessage' in window) {
						window.parent.postMessage({channel:"${hash}",message:await R${hash}()}, "*");
					}
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
		// $(".view:not(.hide) .section0").detach().appendTo(".view:not(.hide) .misty-banner-library");

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
					<div><button onclick="appRouter.showItem('${detail.Id}')">PLAY NOW</button></div>
					<br> </br>
					<div>
		<a hidden target="_blank" href="https://smallcounter.com/conline/1744202293/"><img alt="visitors by country counter" border="0" src="https://smallcounter.com/online/fcc.php?id=1744202293"></a>
<a href="https://hits.sh/100.100.100.6:8096/web/index.html/"><img alt="Hits" src="https://hits.sh/100.100.100.6:8096/web/index.html.svg?view=today-total&style=for-the-badge&color=c22efa&labelColor=007ec6"/></a>
				
				</div>
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

		// 只判断第一张海报加载完毕, 优化加载速度
		await new Promise((resolve, reject) => {
			let waitLoading = setInterval(() => {
				if (document.querySelector(".misty-banner-cover")?.complete) {
					clearInterval(waitLoading);
					resolve();
				}
			}, 16);
		});

		// 判断section0加载完毕
		await new Promise((resolve, reject) => {
			let waitsection0 = setInterval(() => {
				if ($(".view:not(.hide) .section0 .emby-scrollbuttons").length > 0 && $(".view:not(.hide) .section0.hide").length == 0) {
					clearInterval(waitsection0);
					resolve();
				}
			}, 16);
		});

		$(".view:not(.hide) .section0 .emby-scrollbuttons").remove();
		const items = $(".view:not(.hide) .section0 .emby-scroller .itemsContainer")[0].items;
		if (CommonUtils.checkType() === 'pc') {
			$(".view:not(.hide) .section0").detach().appendTo(".view:not(.hide) .misty-banner-library");
		}

		$(".misty-loading").fadeOut(500, () => $(".misty-loading").remove());
		await CommonUtils.sleep(150);
		$(".view:not(.hide) .section0 .emby-scroller .itemsContainer")[0].items = items;

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
		this.bannerInterval = setInterval(() => {
			// 背景切换
			if (window.location.href.endsWith("home") && !document.hidden) {
				index += index + 1 == $(".misty-banner-item").length ? -index : 1;
				$(".misty-banner-body").css("left", -(index * 100).toString() + "%");
				// 信息切换
				$(".misty-banner-item.active").removeClass("active");
				let id = $(".misty-banner-item").eq(index).addClass("active").attr("id");
				// LOGO切换
				$(".misty-banner-logo.active").removeClass("active");
				$(`.misty-banner-logo[id=${id}]`).addClass("active");
			}
		}, 8000);
	}

	/* 初始事件 */
	static initEvent() {
		// 通过注入方式, 方可调用appRouter函数, 以解决Content-Script window对象不同步问题
		const script = `
		// 挂载appRouter
		if (!window.appRouter) window.appRouter = (await window.require(["appRouter"]))[0];
		/* // 修复library事件参数
		const serverId = ApiClient._serverInfo.Id,
			librarys = document.querySelectorAll(".view:not(.hide) .section0 .card");
		librarys.forEach(library => {
			library.setAttribute("data-serverid", serverId);
			library.setAttribute("data-type", "CollectionFolder");
		}); */
		`;
		this.injectCode(script);
	}

	/* 插入通知弹窗 */
	static initPopup() {
		// Add popup styles to the head of the document
		if ($("#misty-popup-styles").length === 0) {
			const popupStyles = `
				.misty-popup-overlay {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background-color: rgba(0, 0, 0, 0.7);
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 9999;
					opacity: 0;
					transition: opacity 0.3s ease-in-out;
				}
				.misty-popup-overlay.show {
					opacity: 1;
				}
				.misty-popup {
					background-color: #333;
					color: #fff;
					padding: 20px;
					border-radius: 8px;
					position: relative;
					max-width: 90%;
					text-align: center;
					box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
					transform: scale(0.9);
					transition: transform 0.3s ease-in-out;
				}
				.misty-popup-overlay.show .misty-popup {
					transform: scale(1);
				}
				.misty-popup-img {
				  max-width: 100%;
				  height: auto;
				  border-radius: 4px;
				  margin-bottom: 15px;
				  display: block;
				  object-fit: contain; /* Optional: ensures full image is shown */
				  background-color: #000; /* Optional: fills empty space if image doesn't fill container */
				}
				
				 /*.misty-popup-img {
					max-width: 100%;
					height: auto;
					border-radius: 4px;
					margin-bottom: 15px;
				}*/
				.misty-popup-text {
					font-size: 1.2em;
					line-height: 1.5;
					margin: 0;
				}
				.misty-popup-close-btn {
					position: absolute;
					top: 10px;
					right: 10px;
					background: none;
					border: none;
					color: #fff;
					font-size: 2em;
					cursor: pointer;
				}
				@media (min-width: 768px) {
					.misty-popup {
						max-width: 600px;
						padding: 40px;
					}
					.misty-popup-text {
						font-size: 1.5em;
					}
				}
			`;
			$(document.head || document.documentElement).append(`<style id="misty-popup-styles">${popupStyles}</style>`);
		}

		const popupHtml = `
		
						<div class="misty-popup-overlay">
				  <div class="misty-popup">
					<button class="misty-popup-close-btn">&times;</button>
					<a href="http://100.100.100.2/" target="_blank" style="text-decoration: none; color: inherit;">
					  <img class="misty-popup-img" src="logosn.png" alt="Notice Image">
					  <p class="misty-popup-text">
						Welcome to the new SN EMBY Home page! We have updated the design to improve your experience. Enjoy!
					  </p>
					</a>
				  </div>
				</div>

		`;

		$("body").append(popupHtml);

		// Show the popup with a slight delay for the animation
		setTimeout(() => {
			$(".misty-popup-overlay").addClass("show");
		}, 100);

		// Add event listener to close the popup
		$(".misty-popup-close-btn, .misty-popup-overlay").on("click", function(e) {
			if ($(e.target).hasClass("misty-popup-overlay") || $(e.target).hasClass("misty-popup-close-btn")) {
				$(".misty-popup-overlay").removeClass("show");
				setTimeout(() => {
					$(".misty-popup-overlay").remove();
				}, 300);
			}
		});
	}
}

// 运行
if ("BroadcastChannel" in window || "postMessage" in window) {
	if ($("meta[name=application-name]").attr("content") == "Emby" || $(".accent-emby") != undefined) {
		Home.start();
	}
}
