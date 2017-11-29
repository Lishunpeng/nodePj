
/*损坏的：broke，普通的:ordin,*/
//武器
/*
var myWeapon =[
	{type:"00",name:"生锈的铁剑",detail:"一把生锈了许久的铁剑。",addAttr:"3",myclass:"broke",getMoney:"300",judey:'wea'},
	{type:"01",name:"铁剑",detail:"一把铁剑，比较新。",addAttr:"5",myclass:"ordin",getMoney:"500",judey:'wea'}
];
//防具
var myEqui =[
	{type:"00",name:"破损的布衣",detail:"一个穷逼穿的衣服。",addAttr:"3",myclass:"broke",getMoney:"300",judey:'clo'},
	{type:"01",name:"普通的布衣",detail:"普通草民衣服。",addAttr:"5",myclass:"ordin",getMoney:"500",judey:'clo'}
];
//首饰
var myAmulet =[
	{type:"00",name:"破损的护符",detail:"一个损坏的护身符。",addAttr:"30",myclass:"broke",getMoney:"300",judey:'amu'},
	{type:"01",name:"普通的护符",detail:"普通家庭的传家符。",addAttr:"50",myclass:"ordin",getMoney:"500",judey:'amu'}
];
//药水
var mymedicine = [
	{type:"00",name:"神奇的药水",detail:"敬请期待",addAttr:"",myclass:"pink",judey:'med'},
	{type:"01",name:"红药水",detail:"用于治疗的药水。",addAttr:"50",myclass:"ordin",getMoney:"300",judey:'med'}
];*/
//材料
var mymaterial = [
	{type:'mat',code:"00",name:"神奇的石头",detail:"一颗会发光的石头，还不知道有什么用",addAttr:"",myclass:"pink",imgPath:"bag_mat_00.png"},
	{type:'mat',code:"01",name:"材料2",detail:"我的材料2。",addAttr:"",myclass:"ordin",getMoney:"100",imgPath:"bag_mat_00.png"},
	{type:'mat',code:"02",name:"死去的蘑菇",detail:"花蘑菇尸体。",addAttr:"",myclass:"ordin",getMoney:"300",imgPath:"bag_mat_00.png"},
	{type:'mat',code:"03",name:"有毒的蘑菇盖",detail:"毒蘑菇头盖。",addAttr:"",myclass:"ordin",getMoney:"500",imgPath:"bag_mat_00.png"}
];
//合并装备
var myEqui =[
	{type:'wea',code:"000",belone:'ATK',name:"生锈的铁剑",detail:"一把生锈了许久的铁剑。",addAttr:"3",myclass:"broke",getMoney:"300",imgPath:"bag_wea_000.png"},
	{type:'wea',code:"001",belone:'ATK',name:"铁剑",detail:"一把铁剑，比较新。",addAttr:"5",myclass:"ordin",getMoney:"500",imgPath:"bag_wea_000.png"},
	{type:'clo',code:"100",belone:'DEF',name:"破损的布衣",detail:"一个穷逼穿的衣服。",addAttr:"3",myclass:"broke",getMoney:"300",imgPath:"bag_clo_100.png"},
	{type:'clo',code:"101",belone:'DEF',name:"普通的布衣",detail:"普通草民衣服。",addAttr:"5",myclass:"ordin",getMoney:"500",imgPath:"bag_clo_100.png"},
	{type:'amu',code:"200",belone:'HP',name:"破损的护符",detail:"一个损坏的护身符。",addAttr:"30",myclass:"broke",getMoney:"300",imgPath:"bag_amu_200.png"},
	{type:'amu',code:"201",belone:'HP',name:"普通的护符",detail:"普通家庭的传家符。",addAttr:"50",myclass:"ordin",getMoney:"500",imgPath:"bag_amu_200.png"}
];




//怪物
/*掉落装备代码：#号前表示稀有,##代表特别稀有*/
var monster = [
	{code:"00",name:"花蘑菇",detail:"漂亮的蘑菇",ATK:"15",DEF:'5',HP:'30',myclass:"ordin",strong:'1',dropMoney:"500",dropGoods:'2',imgPath:'monster/mon_00.png',
	 drop:[{type:'mat',code:'03',odds:'100'},{type:'mat',code:'02',odds:'100'}]},
	{code:"01",name:"毒蘑菇",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"broke",strong:'1',dropMoney:"500",dropGoods:'3',imgPath:'monster/mon_00.png',
	 drop:[{type:'wea',code:'001',odds:'100'},{type:'amu',code:'200',odds:'100'},{type:'mat',code:'03',odds:'50'},{type:'mat',code:'01',odds:'30'}]},
	 {code:"02",name:"毒蘑菇2",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"pink",strong:'1',dropMoney:"500",dropGoods:'3',imgPath:'monster/mon_00.png',
	 drop:[{type:'wea',code:'001',odds:'10'},{type:'clo',code:'100',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'mat',code:'01',odds:'30'}]},
	 {code:"03",name:"毒蘑菇3",detail:"有毒蘑菇",ATK:"17",DEF:'8',HP:'30',myclass:"pink",strong:'1',dropMoney:"500",dropGoods:'3',imgPath:'monster/mon_00.png',
	drop:[{type:'wea',code:'001',odds:'10'},{type:'clo',code:'100',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'mat',code:'01',odds:'30'}]},
	{code:"#00",name:"☆毒蘑菇1",detail:"有毒蘑菇",ATK:"30",DEF:'18',HP:'130',myclass:"pink",strong:'1',dropMoney:"500",dropGoods:'3',imgPath:'monster/mon_00.png',
	drop:[{type:'wea',code:'001',odds:'10'},{type:'clo',code:'100',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'mat',code:'01',odds:'30'}]},
	{code:"#01",name:"☆毒蘑菇2",detail:"有毒蘑菇",ATK:"30",DEF:'18',HP:'130',myclass:"pink",strong:'2',dropMoney:"500",dropGoods:'3',imgPath:'monster/mon_00.png',
	drop:[{type:'wea',code:'001',odds:'10'},{type:'clo',code:'100',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'mat',code:'01',odds:'30'}]},
	{code:"#02",name:"☆毒蘑菇3",detail:"有毒蘑菇",ATK:"30",DEF:'18',HP:'130',myclass:"pink",strong:'3',dropMoney:"500",dropGoods:'3',imgPath:'monster/mon_00.png',
	drop:[{type:'wea',code:'001',odds:'10'},{type:'clo',code:'100',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'mat',code:'01',odds:'30'}]},
	{code:"#03",name:"☆毒蘑菇",detail:"有毒蘑菇",ATK:"30",DEF:'18',HP:'130',myclass:"pink",strong:'3',dropMoney:"500",dropGoods:'3',imgPath:'monster/mon_00.png',
	drop:[{type:'wea',code:'001',odds:'10'},{type:'clo',code:'100',odds:'10'},{type:'mat',code:'03',odds:'50'},{type:'mat',code:'01',odds:'30'}]},
];
//一些npc内容
var NPC =[
	{name:'黄大仙',myclass:'broke',detail:"1111"},{name:'黄大仙1',myclass:'ordin',detail:"2222"},{name:'黄大仙2',myclass:'broke',detail:"333"},
	{name:'黄大仙3',myclass:'broke',detail:"444"},{name:'黄大仙4',myclass:'ordin',detail:"555"},{name:'黄大仙5',myclass:'pink',detail:"666"},
	{name:'黄大仙6',myclass:'broke',detail:"777"},{name:'黄大仙7',myclass:'broke',detail:"888"}
];
//设置关卡
var tollGate = [
	{name:'荒古草原',detail:'死气沉沉的草原',imgPath:'tollGateImg/tg_f_bg.jpg',
	tg:[
		{monsterCode:'00,01,02,#00',imgPath:'tollGateImg/f1.png',name:'太原古店',detail:'荒废已久的古店'},
		{monsterCode:'02,03,04,#01',imgPath:'tollGateImg/f2.png',name:'草原边际',detail:'一望无际的草原'},
		{monsterCode:'00,01,02,#02',imgPath:'tollGateImg/f3.png',name:'草原中央',detail:'死气层层的草原'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f4.png',name:'沼泽之地',detail:'脏兮兮的沼泽'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f5.png',name:'荒古森林',detail:'漆黑恐怕的森林'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f6.png',name:'森林边缘',detail:'隐约能看见太阳'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f7.png',name:'森林深处',detail:'阴森森的森林'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f8.png',name:'森林山洞',detail:'莫名其妙的洞穴'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f9.png',name:'洞穴内部',detail:'可怕的洞穴'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f10.png',name:'洞中小屋',detail:'奇怪的房子'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f11.png',name:'小屋内部',detail:'奇怪的门'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/f12.png',name:'神秘密室',detail:'一个不知道通往哪里的密室'},
	]},
	{name:'烈焰火山',detail:'死气沉沉的草原',imgPath:'tollGateImg/tg_s_bg.jpg',
	tg:[
		{monsterCode:'00,01,02,#00',imgPath:'tollGateImg/s1.png',name:'密室通道',detail:'不知分岔后去向'},
		{monsterCode:'02,03,04,#01',imgPath:'tollGateImg/s2.png',name:'火焰山口',detail:'热气腾腾的火焰山入口'},
		{monsterCode:'00,01,02,#02',imgPath:'tollGateImg/s3.png',name:'山口森林',detail:'地板都是滚烫的'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s4.png',name:'火焰桥头',detail:'随时可能坠入熔岩'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s5.png',name:'桥头对面',detail:'热腾腾的山洞'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s6.png',name:'火洞边缘',detail:'被烧焦的气味'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s7.png',name:'火焰深处',detail:'靠近热中心'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s8.png',name:'熔岩巨洞',detail:'温度急剧升高'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s9.png',name:'洞穴内部',detail:'可怕的洞穴'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s10.png',name:'火焰内核',detail:'火焰山核心，靠此发出火焰'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s11.png',name:'火洞外围',detail:'温度开始减低了'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/s12.png',name:'离开山洞',detail:'走出了山洞'},
	]},
	{name:'极寒冰川',detail:'死气沉沉的草原',imgPath:'tollGateImg/tg_t_bg.jpg',
	tg:[
		{monsterCode:'00,01,02,#00',imgPath:'tollGateImg/t1.png',name:'荒凉山村',detail:'不知名的村庄'},
		{monsterCode:'02,03,04,#01',imgPath:'tollGateImg/t2.png',name:'村口雪地',detail:'地上铺满了雪'},
		{monsterCode:'00,01,02,#02',imgPath:'tollGateImg/t3.png',name:'冰封雪地',detail:'地上铺满了雪'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t4.png',name:'极地冰洞',detail:'随时可能坠入熔岩'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t5.png',name:'极地桥头',detail:'热腾腾的山洞'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t6.png',name:'冰洞深处',detail:'被烧焦的气味'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t7.png',name:'临近海洋',detail:'靠近热中心'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t8.png',name:'港口',detail:'温度急剧升高'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t9.png',name:'海洋深处',detail:'可怕的洞穴'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t10.png',name:'不明海洋',detail:'火焰山核心，靠此发出火焰'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t11.png',name:'不明发电厂',detail:'温度开始减低了'},
		{monsterCode:'00,01,02,#03',imgPath:'tollGateImg/t12.png',name:'发电厂内部',detail:'走出了山洞'},
	]}
];



