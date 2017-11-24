function cardMatch(){
	this.deck = document.querySelector('.deck');
	this.restart = document.querySelector('.restart');
	this.stepDom = document.getElementById('steps');
	this.timeDom = document.getElementById('time');
	this.starDom = document.getElementById('stars');
	this.steps = 0;
	this.times = 0;
	this.stars = 3;
	this.cardList = [];
	this.tempIndex = -1;
	this.tempClassName = '';
	this.isCanMove = true;
	this.isGameover = false;
	this.classNameArr = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb'];
	this.allowMatchNum = 2; // 允许匹配的个数
	this.boardClassNameArr = [];
	this.matchingList = [];
	this.isTimeCounting = false;
}

cardMatch.prototype = {
	constructor: cardMatch,
	matchCard: function(objDom){
		objDom.classList.add('match','bounceIn');
	},
	showCard: function(objDom){
		objDom.classList.add('open','show');
	},
	disMatchCard: function(objDom){
		objDom.classList.add('wobble','dismatch');
		setTimeout(function(){
			objDom.classList.remove('wobble');
			setTimeout(function(){
				objDom.classList.remove('open','show','dismatch');
			},200);
		},1000);
	},
	init: function(){
		let _this = this;
		_this.renderBoard();
		_this.restart.addEventListener('click', function(event){
			_this.resetGame();
		});
	},
	renderBoard: function(){
		let _this = this;
		// TODO: 根据允许匹配个数和类名数组构造棋盘中所有的类名
		for(let k=0; k<_this.allowMatchNum; k++){
			_this.boardClassNameArr = _this.boardClassNameArr.concat(_this.classNameArr);
		}
		let tempHTML = '';
		let arrLength = _this.boardClassNameArr.length;
		for(let i=0; i<arrLength; i++){
			tempHTML += '<li class="card animated">'+
                		'<i class="fa '+ _this.randomClassName() +'"></i>'+
            			'</li>';
		}
		_this.deck.innerHTML = tempHTML;
		_this.cardList = _this.deck.getElementsByClassName('card')

		for(let i=0; i<_this.cardList.length; i++){
			_this.cardList[i].addEventListener('click', function(event){
				_this.judgeIsMatch(event);
			});
		}
	},
	randomClassName: function(){
		let tempIndex = parseInt(Math.random() * this.boardClassNameArr.length);
		let tempClassName = this.boardClassNameArr[tempIndex];
		this.boardClassNameArr.splice(tempIndex,1);
		return tempClassName;
	},
	startGame: function(){
		this.init();
	},
	resetGame: function(){
		this.renderBoard();
		this.steps = 0;
		this.times = 0;
		this.stars = 0;
		this.stepDom.innerHTML = '0';
		this.timeDom.innerHTML = '0';
		this.isTimeCounting = false;
		this.updateStars(3);
		clearInterval(this.interval);

		setTimeout(function(){
			alert('游戏已重置');
		},300);
	},
	judgeIsMatch: function(event){
		let _this = this;
		if(!event.target.classList.contains('open') && _this.isCanMove && (_this.matchingList.length < _this.allowMatchNum)){
			// TODO: 允许点击

			if(!_this.isTimeCounting){
				_this.isTimeCounting = true;
				_this.interval = setInterval(function(){
					_this.times++;
					_this.timeDom.innerHTML = _this.times;
					_this.checkIsDegrade();
				},1000);
			}

			_this.showCard(event.target);
			_this.matchingList.push(event.target);

			if(_this.matchingList.length == _this.allowMatchNum){
				// TODO: 进入匹配判断
				_this.updateMoves();
				_this.checkIsDegrade();
				_this.isCanMove = false;
				for(var i=0; i<_this.matchingList.length-1; i++){
					if(_this.matchingList[i].children[0].classList[1] != _this.matchingList[i+1].children[0].classList[1]){
						break;
					}
				}
				if(i==_this.matchingList.length-1){
					for(let j=0; j<_this.matchingList.length; j++){
						_this.matchCard(_this.matchingList[j]);
					}
					_this.isCanMove = true;
					_this.matchingList = [];
					_this.checkIsWin();
				}else{
					for(let j=0; j<_this.matchingList.length; j++){
						_this.disMatchCard(_this.matchingList[j]);
					}
					_this.matchingList = [];
					setTimeout(function(){
						_this.isCanMove = true;
					},800);
				}
			}
		}
	},
	checkIsDegrade: function(){
		// TODO: 评分判断
		if((this.steps>30 || this.times>65) && this.stars>0){
			this.updateStars(0);
		}else if((this.steps>20 || this.times>45) && this.stars>1){
			this.updateStars(1);
		}else if((this.steps>10 || this.times>25) && this.stars>2){
			this.updateStars(2);
		}
	},
	updateStars: function(starsNum){
		let tempHTML = '';
		this.stars = starsNum;
		for(let i=0; i<starsNum; i++){
        	tempHTML += '<li><i class="fa fa-star"></i></li>';
		}
		for(let j=0; j<3-starsNum; j++){
			tempHTML += '<li><i class="fa fa-star-o"></i></li>';
		}
		this.starDom.innerHTML = tempHTML;
	},
	updateMoves: function(){
		this.steps++;
		this.stepDom.innerHTML = this.steps;
	},
	checkIsWin: function(){
		let _this = this;
 		let matchNum = 0;
 		// TODO: 遍历所有card 看是否已全部完成
 		for(let i=0; i<_this.cardList.length; i++){
 			if(_this.cardList[i].classList.contains('match')){
 				matchNum++;
 			}
 		}
 		if(matchNum == _this.cardList.length){
 			clearInterval(this.interval);
 			setTimeout(function(){
				alert('恭喜你，游戏结束！游戏评分'+ _this.stars +'颗星！');
 			},500);
 		}

	}
}

let game = new cardMatch();
game.startGame();








