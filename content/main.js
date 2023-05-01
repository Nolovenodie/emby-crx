class Home {
	static start() {
		this.itemQuery = { ImageTypes: "Backdrop", EnableImageTypes: "Logo,Backdrop", IncludeItemTypes: "Movie,Series", SortBy: "ProductionYear, PremiereDate, SortName", Recursive: true, ImageTypeLimit: 1, Limit: 10, Fields: "ProductionYear", SortOrder: "Descending", EnableUserData: false, EnableTotalRecordCount: false };
		this.coverOptions = { type: "Backdrop", maxWidth: 3000 };
		this.logoOptions = { type: "Logo", maxWidth: 3000 };

		if (window.location.href.indexOf("home") != -1) {
			const load = `
			<div class="misty-loading">
				<h1>MISTY MEDIA</h1>
				<div class="mdl-spinner"><div class="mdl-spinner__layer mdl-spinner__layer-1"><div class="mdl-spinner__circle-clipper mdl-spinner__left"><div class="mdl-spinner__circle mdl-spinner__circleLeft"></div></div><div class="mdl-spinner__circle-clipper mdl-spinner__right"><div class="mdl-spinner__circle mdl-spinner__circleRight"></div></div></div></div>
			</div>
			`;
			$("body").append(load);
		}
		CommonUtils.selectWait(".section0 .backdropCard", async () => {
			await this.initBanner();
		});
	}

	static injectCall(func, arg) {
		let hash = md5(arg);
		return new Promise((resolve, reject) => {
			const channel = new BroadcastChannel(hash);
			channel.addEventListener("message", (event) => resolve(event.data));
			const script = `
			<script class="I${hash}">
				setTimeout(async ()=> {
					var client = await new Promise((resolve, reject) => {
						setInterval(() => {
							if (window.ApiClient != undefined) resolve(window.ApiClient);
						}, 16);
					});
					const channel = new BroadcastChannel("${hash}");
					channel.postMessage(await client.${func}(${arg}));
					document.querySelector("script.I${hash}").remove()
				}, 16)
			</script>
			`;
			$(document.head || document.documentElement).append(script);
		});
	}

	static getItems(query) {
		return this.injectCall("getItems", "client.getCurrentUserId(), " + JSON.stringify(query));
	}

	static getItem(itemId) {
		return this.injectCall("getItem", `client.getCurrentUserId(), "${itemId}"`);
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
		$(".homeSectionsContainer").prepend(banner);
		$(".section0").detach().appendTo(".misty-banner-library");

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
					<div><button>MORE</button></div>
				</div>
			</div>
			`,
				logoHtml = `
			<img id="${detail.Id}" draggable="false" loading="auto" decoding="lazy" class="misty-banner-logo" data-banner="img-title" alt="Logo" src="${await this.getImageUrl(detail.Id, this.logoOptions)}">
			`;
			if (detail.ImageTags && detail.ImageTags.Logo) {
				$(".misty-banner-body").append(itemHtml);
				$(".misty-banner-logos").append(logoHtml);
			}
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
				$(".misty-loading").fadeOut(500);
				await CommonUtils.sleep(150);
				// 置入场动画
				let delay = 80; // 动媒体库画间隔
				let id = $(".misty-banner-item").eq(0).addClass("active").attr("id"); // 初次信息动画
				$(`.misty-banner-logo[id=${id}]`).addClass("active");

				await CommonUtils.sleep(200); // 间隔动画
				$(".section0 > div").addClass("misty-banner-library-overflow"); // 关闭overflow 防止媒体库动画溢出
				$(".misty-banner .backdropCard").each((i, dom) => setTimeout(() => $(dom).addClass("misty-banner-library-show"), i * delay)); // 媒体库动画
				await CommonUtils.sleep(delay * 8 + 1000); // 等待媒体库动画完毕
				$(".section0 > div").removeClass("misty-banner-library-overflow"); // 开启overflow 防止无法滚动

				// 滚屏逻辑
				var index = 0;
				setInterval(async () => {
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
}

// 运行
Home.start();
