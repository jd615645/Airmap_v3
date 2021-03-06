var Cookies = require("js.cookie");
var userLang = Cookies.get('language') || navigator.language || navigator.userLanguage;

var LANG = {
	translation: {
		"en-US": {
			"pageTitle": "Taiwan Air Pollution Map",
			"recruit": "MicroStation Maintainer Recruit",

			"group": "Group",
			"display": "Display",
			"opacity": "Opacity",

			"selectAll": "Select All",
			"selectNone": "DeSelect All",

			"siteFilter": "Site Filter",
			"siteList": "Sites List",
			"siteChart": "Site Chart",			
			"siteComment": "Site Comment",
			"measureType": "Measure Type",
			"voronoiDiagram": "Voronoi Diagram",
			"windLayer": "Wind Layer",
			"windResourceAlert": "Wind layer consume lots resources, easy to cause browser crash. at your discretion.",
			"lastUpdate": "Last update",
			"halfHourUpdate": "update at half clock",

			"windFillOpacity": "Wind opacity",
			"windMoveSpeed": "Wing flow speed",

			"resourceLayer": "Resource Layer",
			"emissionLayer": "Emission",
			"displayEmissionStaton": "Show Emission Station",
			
			"cwbImage": "CWB Cloud Image",
			"imageProjectionNotEqual": "Satellite image using different projection with map, position not equal.",

			"selectSiteFirst": "Please Select Site on Map",
			"lastHourChart": "Last hour chart",
			"lastDayChart": "Last day chart",
			"lastWeekChart": "Last week chart",
			"lastMonthChart": "Last month chart",

			"historyChart": "歷史圖表",
			"independentPage": "Independent Page",

			"disclaimer": "This map provide visualize from public data, do not guarantee data accuracy.",
		},
		"zh-TW":{
			"pageTitle": "台灣空汙觀測地圖",
			"recruit": "自造站點持續募集中",

			"group": "群組",
			"display": "顯示",
			"opacity": "透明度",

			"selectAll": "全選",
			"selectNone": "全不選",

			"siteFilter": "測站篩選",
			"siteList": "站點清單",
			"siteChart": "測站圖表",
			"siteComment": "測站討論",
			"measureType": "量測類別",
			"voronoiDiagram": "勢力地圖",
			"windLayer": "風力線",
			"windResourceAlert": "風力線十分消耗資源，容易造成瀏覽器當機，請斟酌使用。",
			"lastUpdate": "資料時間",
			"halfHourUpdate": "半整點更新資料",

			"windFillOpacity": "線條亮度",
			"windMoveSpeed": "移動速度",

			"resourceLayer": "資源圖層",
			"emissionLayer": "固定汙染源",
			"displayEmissionStaton": "顯示站點",

			"cwbImage": "氣象雲圖",
			"imageProjectionNotEqual": "雲圖與地圖投影法不相同，位置會有誤差。",

			"selectSiteFirst": "請先選擇站點",
			"lastHourChart": "過去一小時歷史數值",
			"lastDayChart": "過去一天歷史數值",
			"lastWeekChart": "過去一週歷史數值",
			"lastMonthChart": "過去一個月歷史數值",

			"historyChart": "歷史圖表",
			"independentPage": "站點詳細頁面",

			"disclaimer": "本零時空汙觀測網僅彙整公開資料提供視覺化參考，並不對資料數據提供保證，實際測值以各資料來源為準。",
		}
	},
	currentLang: userLang,
	boot: function(){		
		this.translateApp();

		$("body").on("languageChange", function(e, lang){
			this.setLang(lang);
			translate();
		}.bind(this));
	},
	get: function(index){
		if( this.translation[this.currentLang] && this.translation[this.currentLang][index] ){
			return this.translation[this.currentLang][index];
		}
		return index + ' not found'
	},
	translateElement: function($el, index){
		if( !$el || !index ){ return false; }

		var text = this.get(index);

		if( $el.is("input:button") ){
			$el.val(text);
		}

		if( $el[0].hasAttribute("title") ){
			$el.attr('title', text);
		}

		if( !$el.children().length ){
			$el.text(text);
		}
	},
	translateApp: function(){
		$("[data-lang]").each(function(){
			LANG.translateElement($(this), $(this).data('lang'));
		});
		return this;
	},
	setLang: function(lang){
		this.currentLang = lang;
		moment.locale(lang);
		Cookies.set('language', lang);
		return this;
	},
	getLang: function(){
		return this.currentLang;
	}
};

module.exports = LANG;