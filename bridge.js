var VERSION = "24631-priceprio";
var GPT_LIBRARY = "//securepubads.g.doubleclick.net/tag/js/gpt.js";
var PRECONNECT_DOMAINS = [
	"//fastlane.rubiconproject.com",
	"//htlb.casalemedia.com",
	"//prg.smartadserver.com",
	"//ib.adnxs.com",
	"//bidder.criteo.com",
	"//marfeel-d.openx.net",
	"//ice.360yield.com",
	"//mbid.marfeelrev.com",
	"//adservice.google.es",
	"//adservice.google.com"
];

function getTenantFromUrl(url) {
	var domainRegExOutput = url.match(/:\/\/([0-9]?\.)?(.[^/:/?]+)/i);
	return domainRegExOutput && domainRegExOutput[2];
}

function normalizeMaxWidth(width) {
	if (width == 300) {
		return 336;
	}
	return width;
}

function getMultiSize(maxWidth = 300, maxHeight = 600) {
	var sizes = [
		"980x250", "980x90","970x90", "728x90", "300x600", "300x250",
		"336x280", "300x300", "320x480", "200x200", "240x400" , "320x320",
		"320x240", "320x100", "300x100", "320x50", "300x50"];
	return sizes.filter(function(size) {
		var sizeArr = size.split("x");
		var width = parseInt(sizeArr[0]);
		var height = parseInt(sizeArr[1]);
		if (width > normalizeMaxWidth(maxWidth)) {
			return false;
		}
		if (height > maxHeight) {
			return false;
		}
		return true
	});
}

function getPlatform() {
	if (window.AMP_CONTEXT_DATA) {
		return "amp";
	}
	return "noamp";
}

function getDevice() {
	if(/Android|iPhone|iPad/.test(navigator.userAgent)) {
		return "mobile";
	}
	return "generic";
}

function buildTargeting() {
	var targeting = window.marfeel.targeting || {};
	targeting.priceprioEnvironment = getPlatform() + "_" + getDevice();
	targeting.tenant = targeting.tenant || [getTenantFromUrl(window.marfeel.url)];
	targeting.ms = getMultiSize(window.marfeel.width, window.marfeel.height);

	return targeting;
}

function link(href, rel, as) {
	var link = document.createElement("link");

	link.setAttribute("href", href);
	link.setAttribute("rel", rel);
	as && link.setAttribute("as", as);

	document.head.appendChild(link);
}

function preload(src) {
	link(src, "preload", "script");
}

function preconnect(domain) {
	link(domain, "preconnect");
}

function loadScript(src, attributes = {}) {
	var script = document.createElement("script");

	script.setAttribute("src", src);
	script.setAttribute("type", "text/javascript");

	for (var key in attributes) {
		script.setAttribute(key, attributes[key]);
	}

	document.head.appendChild(script);
}

function loadGPT() {
	preload(GPT_LIBRARY);
	loadScript(GPT_LIBRARY, { async: true, defer: true });
}

function preconnectDomains() {
	PRECONNECT_DOMAINS.forEach(preconnect);
}

function loadMatrioshka(tenant) {
	var src = "//live.mrf.io/atomic/" + tenant + "/index?bn=" + VERSION;
	loadScript(src, { async: true, defer: true });
}

function loadVarys() {
	loadScript(
		"//alexandria.marfeelcdn.com/varys/statics/32/dist/varys.ES2015.js",
		{ nomodule: true, defer: true, async: true }
	);

	loadScript(
		"//alexandria.marfeelcdn.com/varys/statics/32/dist/varys.js",
		{ nomodule: true, defer: true, async: true }
	);
}

var adunitTargetingFromMacro = buildTargeting();
var pageUrlFromMacro = window.marfeel.url;
var nonPersonalizedAds = "0";
var consentType = "gdpr";

loadGPT();
preconnectDomains();
loadMatrioshka(adunitTargetingFromMacro.tenant);
loadVarys();
