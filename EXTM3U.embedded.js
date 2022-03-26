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
			const EXTM3U_headers_Regex = /^#(?<fileType>EXTM3U)?[^]*/;
			const EXTM3U_option_Regex = /^#(?<EXT>EXT-X-[^:]+)$/gm;
			const EXTM3U_body_Regex = /^(?<EXT>(EXT|AIV)[^:]+):(?<OPTION>.+)([^](?<URI>.+))?[^]*$/;
			let json = {
				headers: m3u8.match(EXTM3U_headers_Regex)?.groups ?? "",
				option: m3u8.match(EXTM3U_option_Regex) ?? [],
				body: m3u8.split(/[^]#/).map(item => item = item.match(EXTM3U_body_Regex)?.groups ?? "")
			};
			json.body = json.body.map(item => {
				if (/=/.test(item?.OPTION) && this.opts.includes(item.EXT)) item.OPTION = Object.fromEntries(item.OPTION.split(/,(?=[A-Z])/).map(item => item.split(/=(.*)/)));
				return item
			});
			return json
		};

		stringify(json = this.json) {
			let m3u8 = [
				json.headers = "#" + json.headers.fileType,
				json.option = json.option.join(this.newLine),
				json.body = json.body.map(item => {
					if (item) {
						if (typeof item?.OPTION == "object") item.OPTION = Object.entries(item.OPTION).map(item => item = item.join("=")).join(",");
						return item = (item.EXT == "EXT-X-STREAM-INF") ? "#" + item.EXT + ":" + item.OPTION + this.newLine + item.URI
							: "#" + item.EXT + ":" + item.OPTION
					}
				}).join(this.newLine)
			].join(this.newLine);
			return m3u8
		};
	})(opts)
}
