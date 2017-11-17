
/*损坏的：broke，普通的:ordin,*/
//武器
var myWeapon =[
	{type:"00",name:"生锈的铁剑",detail:"一把生锈了许久的铁剑。",addAttr:"3",myclass:"broke",getMoney:"300"},
	{type:"01",name:"铁剑",detail:"一把铁剑，比较新。",addAttr:"5",myclass:"ordin",getMoney:"500"}
];
//防具
var myEqui =[
	{type:"00",name:"破损的布衣",detail:"一个穷逼穿的衣服。",addAttr:"3",myclass:"broke",getMoney:"300"},
	{type:"01",name:"普通的布衣",detail:"普通草民衣服。",addAttr:"5",myclass:"ordin",getMoney:"500"}
];
//首饰
var myAmulet =[
	{type:"00",name:"破损的护符",detail:"一个损坏的护身符。",addAttr:"30",myclass:"broke",getMoney:"300"},
	{type:"01",name:"普通的护符",detail:"普通家庭的传家符。",addAttr:"50",myclass:"ordin",getMoney:"500"}
];
//药水
var mymedicine = [
	{type:"00",name:"神奇的药水",detail:"敬请期待",addAttr:"",myclass:"pink"},
	{type:"01",name:"红药水",detail:"用于治疗的药水。",addAttr:"50",myclass:"ordin",getMoney:"300"}
];
//材料
var mymaterial = [
	{type:"00",name:"神奇的石头",detail:"一颗会发光的石头，还不知道有什么用",addAttr:"",myclass:"pink"},
	{type:"01",name:"材料2",detail:"我的材料2。",addAttr:"",myclass:"ordin",getMoney:"100"},
	{type:"02",name:"死去的蘑菇",detail:"花蘑菇尸体。",addAttr:"",myclass:"ordin",getMoney:"300"},
	{type:"03",name:"有毒的蘑菇盖",detail:"毒蘑菇头盖。",addAttr:"",myclass:"ordin",getMoney:"500"}
];
//怪物
/*掉落装备代码：#号前表示*/
var easyMonster = [
	{type:"00",name:"花蘑菇",detail:"漂亮的蘑菇",ATK:"15",DEF:'5',HP:'30',myclass:"ordin",level:'1',dropMoney:"500",dropGoods:'1',
	 drop:[{type:'wea',code:'00',odds:'10'},{type:'clo',code:'00',odds:'10'},{type:'mat',code:'02',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	{type:"01",name:"毒蘑菇",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"broke",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	 {type:"02",name:"毒蘑菇2",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"pink",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	 {type:"03",name:"毒蘑菇3",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"pink",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	 {type:"04",name:"毒蘑菇4",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"ordin",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	 {type:"05",name:"毒蘑菇5",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"ordin",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	 {type:"06",name:"毒蘑菇6",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"ordin",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	 {type:"07",name:"毒蘑菇7",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"broke",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	 {type:"08",name:"毒蘑菇8",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"ordin",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]},
	 {type:"09",name:"毒蘑菇9",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"broke",level:'1',dropMoney:"500",dropGoods:'3',
	 drop:[{type:'wea',code:'01',odds:'10'},{type:'amu',code:'00',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'med',code:'01',odds:'30'}]}
];
//一些npc内容
var NPC =[
	{name:'黄大仙',myclass:'broke',detail:"1111"},{name:'黄大仙1',myclass:'ordin',detail:"2222"},{name:'黄大仙2',myclass:'broke',detail:"333"},
	{name:'黄大仙3',myclass:'broke',detail:"444"},{name:'黄大仙4',myclass:'ordin',detail:"555"},{name:'黄大仙5',myclass:'pink',detail:"666"},
	{name:'黄大仙6',myclass:'broke',detail:"777"},{name:'黄大仙7',myclass:'broke',detail:"888"}
];




