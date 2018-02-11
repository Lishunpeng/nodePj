Vue.component('v-top', {
	props:{
     data:Array,
     bool:String
	},
	template: '<div class="infoTop"><div class="headerimg changeHead" v-if="bool" onclick="myobj.changeHead()">'+
			'<span class="top">LV.{{data.level}}</span><img :src="data.headPath"/><span class="bottom">点击换头像</span></div>'+
			'<div class="headerimg changeHead" v-else>'+
			'<span class="top">LV.{{data.level}}</span><img :src="data.headPath"/></div>'+
			'<div class="nameInfo"><div class="name">{{"角色名："+data.name}}</div>'+
			'<div class="name money_Box">{{"金币："+data.money}}</div>'+  
			'<div class="name expBox"><i>{{"当前经验："+data.EXP}}</i><span v-if="bool" onclick="myobj.upLevel()"></span></div></div></div>'
});
// 创建根实例
var publicVue = new Vue({
	el: '#publicDom',
	data:{
	  	publicData:[],
	  	isChangeHead:0,
	},
	methods:{
		//获取数据 
		getAjax:function(){
			var that = this;
			that.search = window.location.pathname;
			if (that.search == "/GameTest.html") {
				that.isChangeHead = 1;
			}
			mui.ajax({
				type: "get",
				url: "/getInfo?myacco="+localStorage.acco,
				success:function(data){ 
					that.publicData = JSON.parse(data);
				}
			})
		}
	},
	created:function(){
		this.getAjax();
	}
})