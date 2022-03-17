// refer: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-08
function EXTM3U(name, opts) {
	return new (class {
		constructor(name, opts) {
			this.name = name
			Object.assign(this, opts)
		};

		parse(m3u8 = "", format = "EXT-X-MEDIA", options = []) {
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
				if (item?.EXT == format) item.OPTION = Object.fromEntries(item.OPTION.split(/,(?=[A-Z])/).map(item => item.split(/=/)));
				//$.log(`🚧 ${$.name}, parse EXTM3U`, `after: item.OPTION ${JSON.stringify(item.OPTION)}`, "");
				//$.log(`🚧 ${$.name}, parse EXTM3U`, `after: item ${JSON.stringify(item)}`, "");
				return item
			});
			$.log(`🚧 ${$.name}, parse WebVTT`, `json.body: ${JSON.stringify(json.body)}`, "");
			return json
		};

		stringify(json = { headers: {}, option: [], body: [] }, format = "EXT-X-MEDIA", options = ["\n"]) {
			$.log(`🚧 ${$.name}, stringify EXTM3U`, "");
			const newLine = (options.includes("\n")) ? "\n" : (options.includes("\r")) ? "\r" : (options.includes("\r\n")) ? "\r\n" : "\n";
			let m3u8 = [
				json.headers = "#" + json.headers.fileType,
				json.option = json.option.join(newLine),
				json.body = json.body.map(item => {
					if (item) {
						if (item?.EXT == format) {
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
						return item = (item.EXT == "EXT-X-STREAM-INF") ? "#" + item.EXT + ":" + item.OPTION + newLine + item.URI
							: "#" + item.EXT + ":" + item.OPTION
					}
				}).join(newLine)
			].join(newLine);
			$.log(`🚧 ${$.name}, stringify EXTM3U`, `json.body: ${m3u8}`, "");
			return m3u8
		};
	})(name, opts)
}
