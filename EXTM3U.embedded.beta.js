// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
function EXTM3U(opts) {
	return new (class {
		constructor(opts) {
			this.name = "EXTM3U v0.6.0";
			this.opts = opts;
			this.newLine = (this.opts.includes("\n")) ? "\n" : (this.opts.includes("\r")) ? "\r" : (this.opts.includes("\r\n")) ? "\r\n" : "\n";
			this.m3u8 = new String;
			this.json = { headers: {}, option: [], body: [] };
		};

		parse(m3u8 = this.m3u8) {
			$.log(`🚧 ${$.name}, parse EXTM3U`, "");
			const EXTM3U_headers_Regex = /^#(?<fileType>EXTM3U)?[^]*/;
			const EXTM3U_option_Regex = /^#(?<EXT>EXT-X-[^:]+)$/gm;
			const EXTM3U_body_Regex = /^(?<EXT>(EXT|AIV)[^:]+):(?<OPTION>.+)([^](?<URI>.+))?[^]*$/;
			let json = {
				headers: m3u8.match(EXTM3U_headers_Regex)?.groups ?? "",
				option: m3u8.match(EXTM3U_option_Regex) ?? [],
				body: m3u8.split(/[^]#/).map(item => item = item.match(EXTM3U_body_Regex)?.groups ?? "")
			};
			$.log(`🚧 ${$.name}, parse EXTM3U`, `json.headers: ${JSON.stringify(json.headers)}`, "");
			$.log(`🚧 ${$.name}, parse EXTM3U`, `json.option: ${JSON.stringify(json.option)}`, "");
			$.log(`🚧 ${$.name}, parse EXTM3U`, `json.body: ${JSON.stringify(json.body)}`, "");
			json.body = json.body.map(item => {
				//$.log(`🚧 ${$.name}, parse EXTM3U`, `before: item.OPTION ${JSON.stringify(item.OPTION)}`, "");
				$.log(`🚧 ${$.name}, parse EXTM3U`, `before: item.OPTION.split(/,(?=[A-Z])/) ${JSON.stringify(item.OPTION?.split(/,(?=[A-Z])/) ?? "")}`, "");
				if (/=/.test(item?.OPTION) && this.opts.includes(item.EXT)) item.OPTION = Object.fromEntries(item.OPTION.split(/,(?=[A-Z])/).map(item => item.split(/=(.*)/)));
				//$.log(`🚧 ${$.name}, parse EXTM3U`, `after: item.OPTION ${JSON.stringify(item.OPTION)}`, "");
				//$.log(`🚧 ${$.name}, parse EXTM3U`, `after: item ${JSON.stringify(item)}`, "");
				return item
			});
			$.log(`🚧 ${$.name}, parse WebVTT`, `json.body: ${JSON.stringify(json.body)}`, "");
			return json
		};

		stringify(json = this.json) {
			$.log(`🚧 ${$.name}, stringify EXTM3U`, "");
			//const newLine = (options.includes("\n")) ? "\n" : (options.includes("\r")) ? "\r" : (options.includes("\r\n")) ? "\r\n" : "\n";
			let m3u8 = [
				json.headers = "#" + json.headers.fileType,
				json.option = json.option.join(this.newLine),
				json.body = json.body.map(item => {
					if (item) {
						if (typeof item?.OPTION == "object") {
							/***************** v0.5.0-beta *****************/
							item.OPTION = Object.entries(item.OPTION).map(item => item = item.join("=")).join(",");
							// 按步骤分行写法
							/*
							let OPTION = Object.entries(item.OPTION)
							$.log(`🚧 ${$.name}, stringify EXTM3U`, `Object.entries ${JSON.stringify(OPTION)}`, "");

							OPTION = OPTION.map(item => item = item.join("="))
							$.log(`🚧 ${$.name}, stringify EXTM3U`, `OPTION.map ${JSON.stringify(OPTION)}`, "");

							OPTION = OPTION.join(",")
							$.log(`🚧 ${$.name}, stringify EXTM3U`, `OPTION.join ${OPTION}`, "");

							item.OPTION = OPTION
							*/
						}
						return item = (item.EXT == "EXT-X-STREAM-INF") ? "#" + item.EXT + ":" + item.OPTION + this.newLine + item.URI
							: "#" + item.EXT + ":" + item.OPTION
					}
				}).join(this.newLine)
			].join(this.newLine);
			$.log(`🚧 ${$.name}, stringify EXTM3U`, `json.body: ${m3u8}`, "");
			return m3u8
		};
	})(opts)
}
